// supabase/functions/transcribe/index.ts
// Proxies audio uploads to AssemblyAI to avoid CORS restrictions in the browser.

const ASSEMBLYAI_API_KEY = Deno.env.get('ASSEMBLYAI_API_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (!ASSEMBLYAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'ASSEMBLYAI_API_KEY secret not configured in Supabase.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const audioBlob = await req.blob();

    // 1. Upload audio to AssemblyAI
    const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: { 'Authorization': ASSEMBLYAI_API_KEY },
      body: audioBlob,
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      throw new Error(`Upload failed: ${err}`);
    }

    const { upload_url } = await uploadRes.json();

    // 2. Request transcription with auto language detection
    const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': ASSEMBLYAI_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: upload_url,
        language_detection: true,
      }),
    });

    if (!transcriptRes.ok) {
      const err = await transcriptRes.text();
      throw new Error(`Transcription request failed: ${err}`);
    }

    const { id: transcriptId } = await transcriptRes.json();

    // 3. Poll until done (max ~60 seconds)
    let attempts = 0;
    while (attempts < 40) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      attempts++;

      const pollRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: { 'Authorization': ASSEMBLYAI_API_KEY },
      });

      const pollData = await pollRes.json();

      if (pollData.status === 'completed') {
        return new Response(
          JSON.stringify({ text: pollData.text }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (pollData.status === 'error') {
        throw new Error(pollData.error ?? 'AssemblyAI transcription failed');
      }
    }

    throw new Error('Transcription timed out after 60 seconds.');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Transcribe error:', message);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
