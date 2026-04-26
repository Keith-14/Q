// api/get-transcribe-token.js
// Returns a short-lived AssemblyAI streaming token for secure browser-side WebSocket auth

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    console.error('STT API Error: ASSEMBLYAI_API_KEY is missing from environment variables.');
    return res.status(500).json({ error: 'AssemblyAI API Key not configured on server' });
  }

  try {
    console.log('STT Token API: Requesting temporary token from AssemblyAI...');
    const response = await fetch('https://streaming.assemblyai.com/v3/ws/token', {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expires_in: 120 }), // Valid for 2 mins
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`STT API Error (AssemblyAI Response): ${response.status} - ${errText}`);
      return res.status(response.status).json({ error: `AssemblyAI Token Refresh Failed: ${response.statusText}` });
    }

    const data = await response.json();
    if (!data.token) {
      throw new Error('AssemblyAI response did not contain a token');
    }

    console.log('STT Token API: Successfully generated token.');
    return res.status(200).json({ token: data.token });
  } catch (err) {
    console.error('STT API Fatal Error:', err.message);
    return res.status(500).json({ error: 'Internal Server Error refreshing STT token' });
  }
}

