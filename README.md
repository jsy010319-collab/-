# AI Platform Monorepo

This repository contains a minimal, production-minded skeleton for an AI platform:

- apps/web: Minimal web placeholder (static) for quick start
- services/api: Node.js Express API gateway
- services/llm: Python FastAPI service for text generation (placeholder)
- docker-compose.yml: Local orchestration for API and LLM services (plus Postgres, Redis)

## Quick Start (Docker)

1. Copy environment file and update values as needed:

```bash
cp .env.example .env
```

2. Build and run:

```bash
docker compose up -d --build
```

Services:
- API: http://localhost:3000
- LLM: http://localhost:8000
- Postgres: localhost:5432 (password: postgres)
- Redis: localhost:6379

3. Test health endpoints:

```bash
curl http://localhost:3000/health
curl http://localhost:8000/health
```

## Local Development (without Docker)

- API: Node 18+
```bash
cd services/api
npm install
npm run dev
```

- LLM: Python 3.10+
```bash
cd services/llm
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

## Architecture

- API acts as a gateway: auth, rate limits, persistence, and proxy to LLM
- LLM service encapsulates model/runtime; API calls it over HTTP
- Postgres for durable data (users, conversations, messages)
- Redis for caching, rate limiting, and background tasks

## Next Steps

- Define MVP scope and user journeys
- Implement chat endpoint with streaming
- Add auth (email/OAuth), sessions, and usage tracking
- Add file upload and RAG pipeline (embeddings + vector search)
- Observability: logs, metrics, tracing

## Notes

- The LLM service is a placeholder that returns a simple response; swap it with real providers or local models.
- This repo is intentionally minimal to get you started fast.

