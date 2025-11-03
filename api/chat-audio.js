import { generateFeedback } from './_feedback.js';

export const config = {
  api: {
    bodyParser: false
  }
};

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }
  try {
    // We don't actually need to parse the audio for mock feedback
    const body = await parseMultipart(req);
    // Try to extract scenario from simple multipart body (best-effort)
    const text = body.toString('utf8');
    const match = text.match(/name="scenario"\r\n\r\n([^\r\n]+)/);
    const scenario = match ? match[1] : 'general';
    const feedback = generateFeedback(null, scenario);
    res.status(200).json({ feedback });
  } catch (e) {
    res.status(500).json({ error: 'internal_error' });
  }
}

