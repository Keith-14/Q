import { Layout } from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { BarcodeFormat, DecodeHintType, NotFoundException } from '@zxing/library';
import { ArrowLeft, ScanBarcode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type Alternative = {
  emoji: string;
  name: string;
  brand: string;
  note: string;
  certified_by?: string;
};

type HalalStatus = 'halal' | 'not_halal' | 'doubtful' | 'unknown' | null;

export const HalalScanner = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ status: HalalStatus; productName: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [microcopy, setMicrocopy] = useState<string | null>(null);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [loading, setLoading] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);
  const isProcessingRef = useRef(false);

  const cleanupScanner = useCallback(async () => {
    try {
      if (readerRef.current) {
        // BrowserMultiFormatReader does not expose reset() in the browser package
        readerRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    } catch {
      // ignore cleanup errors
    }
  }, []);

  const handleBarcodeDetected = useCallback(
    async (decodedText: string) => {

      // prevent duplicate calls for same scan
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      setScanning(false);
      setLoading(true);
      setResult(null);
      setVerdict(null);
      setMicrocopy(null);
      setAlternatives([]);
      setError(null);

      // stop camera AFTER state updates, not before
      await cleanupScanner();

      console.log('Barcode detected:', decodedText);
      console.log('Sending to /api/scan/barcode...');

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/scan/barcode`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            barcode: decodedText,
            region: 'UK',
            session_id:
              localStorage.getItem('barakah_session_id') ?? 'guest',
          }),
        });

        console.log('Response status:', response.status);

        const data = await response.json();

        console.log('Response data:', data);

        if (!response.ok) {
          setError(data.error ?? 'Could not analyse product.');
          return;
        }

        const uiStatus: HalalStatus =
          data.status === 'haram'
            ? 'not_halal'
            : data.status === 'unknown'
            ? 'doubtful'
            : data.status;

        setResult({ status: uiStatus, productName: data.product_name });
        setVerdict(data.verdict ?? null);
        setMicrocopy(data.microcopy ?? null);
        setAlternatives(data.alternatives ?? []);

      } catch (err) {
        console.error('Fetch error:', err);
        setError('Could not reach the server. Is the backend running?');
      } finally {
        setLoading(false);
        isProcessingRef.current = false;
      }
    },
    [cleanupScanner]
  );

  const startScanning = async () => {
    setResult(null);
    setError(null);
    setVerdict(null);
    setMicrocopy(null);
    setAlternatives([]);
    isProcessingRef.current = false;

    await cleanupScanner();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          focusMode: { ideal: 'continuous' },
        } as MediaTrackConstraints,
      });
      streamRef.current = stream;

      const video = videoRef.current;
      if (!video) return;

      video.srcObject = stream;

      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => resolve();
      });

      await video.play().catch(() => {
        // already playing — ignore
      });

      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
        BarcodeFormat.ITF,
        BarcodeFormat.QR_CODE,
      ]);
      hints.set(DecodeHintType.TRY_HARDER, true);
      const reader = new BrowserMultiFormatReader(hints);
      readerRef.current = reader;

      reader.decodeFromVideoElement(video, (result, err) => {
        console.log('decode tick', result?.getText(), err?.name);
        if (result && !isProcessingRef.current) {
          console.log('Barcode detected:', result.getText());
          handleBarcodeDetected(result.getText());
        }
      });

      if (mountedRef.current) setScanning(true);
    } catch (err) {
      console.error('Camera error:', err);
      if (mountedRef.current) {
        setError('Camera access denied. Please allow camera permissions.');
        setScanning(false);
      }
    }
  };

  const stopScanning = async () => {
    await cleanupScanner();
    setScanning(false);
  };

  useEffect(() => {
    if (!localStorage.getItem('barakah_session_id')) {
      localStorage.setItem('barakah_session_id', crypto.randomUUID());
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      cleanupScanner();
    };
  }, [cleanupScanner]);

 type StatusKey = 'halal' | 'not_halal' | 'doubtful';

type StatusConfig = {
  label: string;
  message: string;
  bgClass: string;
  textClass: string;
  badgeBg: string;
  messageBg: string;
};

const statusConfig: Record<StatusKey, StatusConfig> = {
  halal: {
    label: 'HALAL',
    message: 'This item is Halal certified!\nMay Allah bless what you consume.',
    bgClass: 'bg-primary/20 border-primary/40',
    textClass: 'text-primary',
    badgeBg: 'bg-[#d4c9a8]/90 text-[#2d3a2e]',
    messageBg: 'bg-[#d4c9a8]/90',
  },
  not_halal: {
    label: 'NOT HALAL',
    message: 'This item is NOT Halal.\nPlease avoid consuming this product.',
    bgClass: 'bg-destructive/20 border-destructive/40',
    textClass: 'text-destructive',
    badgeBg: 'bg-destructive/20 text-destructive',
    messageBg: 'bg-destructive/10',
  },
  doubtful: {
    label: 'DOUBTFUL',
    message: 'The Halal status of this item is uncertain.\nWhen in doubt, leave it out.',
    bgClass: 'bg-yellow-500/20 border-yellow-500/40',
    textClass: 'text-yellow-500',
    badgeBg: 'bg-yellow-500/20 text-yellow-600',
    messageBg: 'bg-yellow-500/10',
  },
};

  // safe key for statusConfig — unknown maps to doubtful
  const safeStatus =
    result?.status === 'unknown' || result?.status === null
      ? 'doubtful'
      : result?.status ?? 'doubtful';

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center px-5 py-6 pb-32 font-arabic">
        {/* Back button */}
        <div className="w-full flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-foreground hover:bg-primary/8 rounded-xl h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
          </Button>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground text-center mb-1">
          Scan a product barcode
        </h1>
        <p className="text-muted-foreground text-center mb-6">
          Check if the product is Halal
        </p>

        {/* Scanner viewfinder */}
        <div className="relative w-full max-w-[340px] rounded-2xl overflow-hidden border-2 border-[#d4c9a8]/40 bg-[#d4c9a8]/10 mb-6" style={{ aspectRatio: '16/9' }}>
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-primary/70 rounded-tl-md z-10" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-primary/70 rounded-tr-md z-10" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-primary/70 rounded-bl-md z-10" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-primary/70 rounded-br-md z-10" />

          {scanning && (
            <div className="absolute left-4 right-4 h-0.5 bg-destructive z-10 animate-[scanline_2s_ease-in-out_infinite]" />
          )}

          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted
            playsInline
          />

          {!scanning && !result && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground pointer-events-none">
              <ScanBarcode className="h-16 w-16 opacity-30" />
              <p className="text-sm">Tap scan to start</p>
            </div>
          )}
        </div>

        {/* Scan button */}
        <button
          onClick={scanning ? stopScanning : startScanning}
          disabled={loading}
          className="mb-6 w-16 h-16 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ScanBarcode className="h-8 w-8 text-foreground" strokeWidth={1.5} />
        </button>

        {/* Manual barcode entry */}
        <div className="flex items-center gap-3 w-full max-w-[340px] my-2">
          <div className="flex-1 h-px bg-border/40" />
          <span className="text-xs text-muted-foreground">or enter barcode manually</span>
          <div className="flex-1 h-px bg-border/40" />
        </div>

        <div className="flex gap-2 w-full max-w-[340px] mb-6">
          <input
            type="number"
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && manualBarcode.trim()) {
                handleBarcodeDetected(manualBarcode.trim());
                setManualBarcode('');
              }
            }}
            placeholder="e.g. 8902433005794"
            className="flex-1 px-4 py-2 rounded-xl bg-card border border-border/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
          <button
            onClick={() => {
              if (manualBarcode.trim()) {
                handleBarcodeDetected(manualBarcode.trim());
                setManualBarcode('');
              }
            }}
            disabled={!manualBarcode.trim() || loading}
            className="px-4 py-2 rounded-xl bg-primary/20 text-primary text-sm font-medium border border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Check
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-destructive text-sm text-center mb-4">{error}</p>
        )}

        {/* Status badges */}
        <div className="flex gap-3 mb-5">
          {(['halal', 'not_halal', 'doubtful'] as const).map((status) => {
            const config = statusConfig[status];
            const isActive = safeStatus === status && result !== null;
            return (
              <div
                key={status}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-300 ${
                  isActive
                    ? config.badgeBg + ' border-current scale-105 shadow-md'
                    : 'bg-card/50 border-border/30 text-muted-foreground'
                }`}
              >
                {config.label}
              </div>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="w-full max-w-[340px] rounded-2xl px-6 py-5 text-center bg-card border border-border/30 mt-3">
            <p className="text-muted-foreground text-sm animate-pulse">
              Checking ingredients...
            </p>
          </div>
        )}

        {/* Result message */}
        {result && result.status && !loading && (
          <div
            className={`w-full max-w-[340px] rounded-2xl px-6 py-5 text-center ${statusConfig[safeStatus].messageBg} border border-[#d4c9a8]/30`}
          >
            <p className="text-[#2d3a2e] font-semibold text-base whitespace-pre-line leading-relaxed">
              {result.productName && (
                <span className="block text-sm font-normal mb-2 opacity-70">
                  {result.productName}
                </span>
              )}
              {statusConfig[safeStatus].message}
            </p>
          </div>
        )}

        {/* Microcopy */}
        {microcopy && !loading && (
          <p className="text-sm text-center text-muted-foreground italic mt-3 max-w-[300px]">
            {microcopy}
          </p>
        )}

        {/* Verdict */}
        {verdict && !loading && (
          <div className="w-full max-w-[340px] rounded-2xl px-6 py-4 mt-3 bg-card border border-border/30">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Ruling
            </p>
            <p className="text-sm text-foreground leading-relaxed">{verdict}</p>
          </div>
        )}

        {/* Halal alternatives */}
        {alternatives.length > 0 && !loading && (
          <div className="w-full max-w-[340px] rounded-2xl px-6 py-4 mt-3 mb-6 bg-card border border-border/30">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              🛒 Halal alternatives
            </p>
            {alternatives.map((alt, i) => (
              <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                <span className="text-2xl">{alt.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {alt.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {alt.brand} · {alt.note}
                  </p>
                  {alt.certified_by && (
                    <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {alt.certified_by}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes scanline {
          0%, 100% { top: 20%; }
          50% { top: 75%; }
        }
      `}</style>
    </Layout>
  );
};