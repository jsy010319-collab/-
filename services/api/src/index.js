import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const LLM_BASE_URL = process.env.LLM_BASE_URL || 'http://localhost:8000';

// Serve static web app from apps/web via volume mount to /app/public
app.use('/', express.static(path.resolve('/app/public')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api' });
});

app.post('/chat/text', async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'text is required' });
    }
    const llmRes = await fetch(`${LLM_BASE_URL}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: text })
    });
    const data = await llmRes.json();
    res.json({ input: text, feedback: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});

app.post('/chat/audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'audio file is required' });
    }
    // For MVP, we do not store audio; we send a placeholder to LLM
    const llmRes = await fetch(`${LLM_BASE_URL}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: null, audioBytesBase64: req.file.buffer.toString('base64') })
    });
    const data = await llmRes.json();
    res.json({ feedback: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

