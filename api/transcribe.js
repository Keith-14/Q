// api/transcribe.js — Vercel Serverless Function
// Proxies audio to AssemblyAI to avoid CORS restrictions in the browser.

export const config = {
  api: {
    bodyParser: false, // We receive raw audio binary
  },
};

async function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function pollTranscript(id, apiKey, maxAttempts = 40) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 1500));
    const res = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
      headers: { Authorization: apiKey },
    });
    const data = await res.json();
    if (data.status === 'completed') return data.text;
    if (data.status === 'error') throw new Error(data.error || 'AssemblyAI error');
  }
  throw new Error('Transcription timed out');
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ASSEMBLYAI_API_KEY not configured in Vercel env vars' });
  }

  try {
    // 1. Read the raw audio buffer from request
    const audioBuffer = await readBody(req);

    // 2. Upload audio to AssemblyAI
    const uploadRes = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: { Authorization: apiKey },
      body: audioBuffer,
    });

    if (!uploadRes.ok) throw new Error(`Upload failed: ${await uploadRes.text()}`);
    const { upload_url } = await uploadRes.json();

    // 3. Request transcription with auto language detection
    const transcriptRes = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: { Authorization: apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio_url: upload_url, language_detection: true }),
    });

    if (!transcriptRes.ok) throw new Error(`Transcript request failed: ${await transcriptRes.text()}`);
    const { id } = await transcriptRes.json();

    // 4. Poll until completed
    const text = await pollTranscript(id, apiKey);

    return res.status(200).json({ text });
  } catch (err) {
    console.error('Transcribe error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
