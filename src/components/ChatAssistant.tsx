import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Mic, Send, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import chatAvatar from '@/assets/chat-avatar.webp';
import ReactMarkdown from 'react-markdown';

type Msg = { role: 'user' | 'assistant' | 'system'; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const SYSTEM_PROMPT = `
You are an Islamic knowledge assistant. Your goal is to provide beneficial Islamic perspectives using the provided context.

STRICT RULES:
- Base your answers firmly on the provided Islamic context.
- The context contains authentic Qur’an and Hadith texts.
- If a question asks about a general life issue (e.g. relationships, habits, hardships), try to extract moral principles, patience, or Islamic rulings from the provided context.
- If the context truly does not contain ANY relevant Islamic guidance on the topic, state: "I do not have enough authentic Islamic evidence in my knowledge base to answer this directly, but generally Islam advises..." and give a brief, modest, and principled general Islamic perspective.
- Do NOT give personal opinions or issue formal religious fatwas.

OUTPUT FORMAT (MANDATORY):

1. A clear explanatory paragraph in the same language as the user's input/question.
2. If a Hadith or Qur'anic verse is used to support your answer, you MUST explicitly quote it:
   - Include the Arabic text (if present in context).
   - Provide the clear translation/meaning in the user's language.
3. End with a clearly separated "Source:" section.
4. List the exact sources (e.g., "Sahih Bukhari Hadith X", "Qur'an Surah Y:Z") on separate lines.
5. Keep the tone respectful, compassionate, and educational.

Do not add anything outside this structure.
`;

async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (err: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    onError(data.error || 'Failed to connect');
    return;
  }

  if (!resp.body) { onError('No response'); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buffer.indexOf('\n')) !== -1) {
      let line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 1);
      if (line.endsWith('\r')) line = line.slice(0, -1);
      if (!line.startsWith('data: ')) continue;
      const json = line.slice(6).trim();
      if (json === '[DONE]') { onDone(); return; }
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) onDelta(content);
      } catch {
        buffer = line + '\n' + buffer;
        break;
      }
    }
  }
  onDone();
}

interface ChatAssistantProps {
  open: boolean;
  onClose: () => void;
}

export const ChatAssistant = ({ open, onClose }: ChatAssistantProps) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [imgError, setImgError] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const baseInputRef = useRef<string>(''); // committed input before current speech turn

  const getFriendlyError = (error: string) => {
    const errorMap: Record<string, string> = {
      'service-not-allowed': 'Voice service is restricted by your browser or OS.',
      'not-allowed': 'Microphone access was denied.',
      'network': 'Network error occurred during speech recognition.',
      'no-speech': 'No speech was detected.',
      'language-not-supported': 'The selected language is not supported.',
    };
    return errorMap[error] || `Voice service Error: ${error}`;
  };

  const stopSpeech = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'Terminate' }));
      wsRef.current.close();
    }
    processorRef.current?.disconnect();
    audioContextRef.current?.close().catch(() => {});
    streamRef.current?.getTracks().forEach(t => t.stop());
    wsRef.current = null;
    audioContextRef.current = null;
    processorRef.current = null;
    streamRef.current = null;
    setIsListening(false);
  };

  const toggleSpeech = useCallback(async () => {
    if (isListening) {
      console.log('STT: Stopping active session.');
      stopSpeech();
      return;
    }

    if (isStarting) {
      console.warn('STT: Already starting a session, ignoring click.');
      return;
    }

    setIsStarting(true);
    console.log('STT: Starting new session...');

    try {
      // 1. Get a short-lived token from our backend (keeps API key server-side)
      console.log('STT: Fetching token from /api/get-transcribe-token...');
      const tokenRes = await fetch('/api/get-transcribe-token', { method: 'POST' });
      
      if (!tokenRes.ok) {
        const errorData = await tokenRes.json().catch(() => ({}));
        console.warn('STT: Token endpoint failed:', errorData.error || tokenRes.statusText);
        throw new Error('primary_service_offline');
      }

      const { token, error: tokenErr } = await tokenRes.json();
      if (tokenErr) {
        console.error('STT: Backend returned token error:', tokenErr);
        throw new Error(tokenErr);
      }

      // 2. Open WebSocket directly to AssemblyAI
      console.log('STT: Connecting to AssemblyAI WebSocket...');
      const wsUrl = `wss://streaming.assemblyai.com/v3/ws?token=${token}&sample_rate=16000&speech_model=u3-rt-pro`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        console.log('STT: WebSocket opened. Requesting microphone...');
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = stream;

          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
          audioContextRef.current = audioContext;

          const source = audioContext.createMediaStreamSource(stream);
          const processor = audioContext.createScriptProcessor(4096, 1, 1);
          processorRef.current = processor;

          processor.onaudioprocess = (e) => {
            if (ws.readyState !== WebSocket.OPEN) return;
            const float32 = e.inputBuffer.getChannelData(0);
            const int16 = new Int16Array(float32.length);
            for (let i = 0; i < float32.length; i++) {
              int16[i] = Math.max(-32768, Math.min(32767, Math.floor(float32[i] * 32768)));
            }
            ws.send(int16.buffer);
          };

          source.connect(processor);
          processor.connect(audioContext.destination);
          baseInputRef.current = input;
          setIsListening(true);
          setIsStarting(false);
          console.log('STT: Streaming active.');
        } catch (err: any) {
          console.error('STT: Microphone error:', err);
          const msg = err.name === 'NotAllowedError' ? 'Microphone access denied' : `Mic error: ${err.message}`;
          setInput(msg);
          ws.close();
          setIsStarting(false);
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'Turn') {
            const transcript: string = data.transcript || '';
            if (!transcript) return;
            const base = baseInputRef.current;
            const separator = base.trim() ? ' ' : '';
            if (data.turn_is_formatted) {
              const committed = base + separator + transcript;
              baseInputRef.current = committed;
              setInput(committed);
            } else {
              setInput(base + separator + transcript);
            }
          }
        } catch (err) {
          console.error('STT: WS parse error:', err);
        }
      };

      ws.onerror = (err) => {
        console.error('STT: WebSocket error:', err);
        setInput('Connection error. Retrying fallback...');
        stopSpeech();
        setIsStarting(false);
      };

      ws.onclose = () => {
        console.log('STT: WebSocket closed.');
        setIsListening(false);
        setIsStarting(false);
      };

    } catch (err: any) {
      setIsStarting(false);
      console.warn('STT: Primary (AssemblyAI) failed, checking browser fallback:', err.message);

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        console.error('STT: No browser fallback available.');
        setInput('Voice service unavailable in this browser.');
        return;
      }

      console.log('STT: Starting native browser SpeechRecognition...');
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'en' ? 'en-US' : language; 
      
      recognition.onstart = () => {
        console.log('STT: Native recognition started.');
        setIsListening(true);
      };
      
      recognition.onend = () => {
        console.log('STT: Native recognition ended.');
        setIsListening(false);
      };
      
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput(prev => {
            const separator = prev.trim() ? ' ' : '';
            return prev + separator + transcript;
          });
        }
      };

      recognition.onerror = (event: any) => {
        console.error('STT: Native recognition error:', event.error);
        setIsListening(false);
        if (event.error !== 'aborted' && event.error !== 'no-speech') {
          setInput(getFriendlyError(event.error));
        }
      };

      try { 
        recognition.start(); 
      } catch (e) { 
        console.error('STT: Failed to start native recognition:', e);
        setIsListening(false);
      }
    }
  }, [isListening, isStarting, input, language]);


  const userName = user?.displayName?.split(' ')[0] || '';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');

    const userMsg: Msg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    let assistantSoFar = '';
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: 'assistant', content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [{ role: 'system', content: SYSTEM_PROMPT.trim() }, ...newMessages],
        onDelta: upsert,
        onDone: () => setIsLoading(false),
        onError: (err) => {
          setMessages(prev => [...prev, { role: 'assistant', content: err }]);
          setIsLoading(false);
        },
      });
    } catch {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex flex-col font-arabic" style={{ background: 'linear-gradient(180deg, hsl(145 30% 18%) 0%, hsl(0 0% 4%) 35%)' }}>
      {/* Header */}
      <div className="relative px-5 pt-6 pb-4 text-center">
        <button
          onClick={onClose}
          className="absolute right-4 top-6 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h1 className="text-2xl font-bold text-[#ffebc9] font-heading">
          As-Salaam-Alaikum{userName ? `, ${userName}` : ''}!
        </h1>
        <p className="text-sm text-muted-foreground mt-1">How can I assist you today?</p>

        {/* Avatar */}
        <div className="mt-4 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 border-2 border-primary/30 flex items-center justify-center overflow-hidden shadow-[0_0_30px_-5px_hsl(145_70%_45%/0.4)] transform-gpu text-primary relative">
            {!imgError ? (
              <img 
                src={chatAvatar} 
                alt="Assistant" 
                className="w-20 h-20 object-contain flex-shrink-0 relative z-10 block" 
                onError={() => setImgError(true)}
              />
            ) : (
               <MessageCircle className="w-12 h-12 absolute z-10" strokeWidth={1.5} />
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                ? 'bg-card/80 text-foreground rounded-br-md'
                : 'bg-[#ffebc9]/10 text-[#ffebc9] border border-[#ffebc9]/20 rounded-bl-md'
              }`}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm prose-invert max-w-none [&_p]:m-0">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : msg.content}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex justify-start">
            <div className="bg-[#ffebc9]/10 border border-[#ffebc9]/20 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 pb-32 pt-2">
        <div className="flex items-center gap-2 bg-card/60 border border-primary/20 rounded-2xl px-4 py-2 backdrop-blur-sm">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Write Something Here"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
          />
          {/* Mic button — red pulse = listening/streaming, click again to stop */}
          <button
            onClick={toggleSpeech}
            className={`p-2 rounded-full transition-colors ${
              isListening
                ? 'bg-red-500/30 text-red-400 animate-pulse'
                : 'bg-primary/20 text-primary hover:bg-primary/30'
            }`}
            title={isListening ? 'Click to stop recording' : 'Click to speak'}
          >
            <Mic className="h-5 w-5" />
          </button>

          {/* Send button */}
          <button
            onClick={send}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors disabled:opacity-40"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
