import { generateFeedback } from './_feedback.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }
  try {
    const { text } = req.body || {};
    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'text is required' });
      return;
    }
    const feedback = generateFeedback(text);
    res.status(200).json({ input: text, feedback });
  } catch (e) {
    res.status(500).json({ error: 'internal_error' });
  }
}

