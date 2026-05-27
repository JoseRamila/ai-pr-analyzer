# AI PR Analyzer

AI-powered GitHub Pull Request analyzer built with FastAPI, Docker, GitHub API and OpenAI.

---

## Overview

AI PR Analyzer allows users to submit a public GitHub Pull Request URL and receive a structured technical analysis.

The backend fetches Pull Request metadata, changed files and patch previews from the GitHub API, builds an AI-ready prompt and generates a structured review response.

If OpenAI quota is unavailable, the application automatically falls back to a local analysis strategy.

---

## Features

- GitHub Pull Request URL validation
- GitHub API integration
- Pull Request metadata extraction
- Patch preview processing
- AI-ready prompt generation
- OpenAI integration
- Local fallback analysis
- FastAPI Swagger documentation
- Docker support
- Automated tests with Pytest

---

## Tech Stack

- Python 3.12
- FastAPI
- Pydantic
- HTTPX
- OpenAI SDK
- Docker
- Pytest
- Ruff
- Black

---

## Architecture

```text
Client
  ↓
FastAPI Routes
  ↓
Analysis Service
  ↓
GitHub Client + OpenAI Client
  ↓
External APIs
```

---

## Project Structure

```text
ai-pr-analyzer/
├── backend/
│   ├── app/
│   │   ├── clients/
│   │   ├── core/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── services/
│   ├── tests/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env
├── docker-compose.yml
└── README.md
```

---

## Environment Variables

Create a `.env` file inside `backend/`.

```env
OPENAI_API_KEY=
GITHUB_TOKEN=
DATABASE_URL=
```

---

## Run Locally

```bash
cd backend

python -m venv .venv

.venv\Scripts\Activate.ps1

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Open:

```text
http://127.0.0.1:8000/docs
```

---

## Run with Docker

From the project root:

```bash
docker compose up --build
```

Open:

```text
http://127.0.0.1:8000/docs
```

---

## Run Tests

From `backend/`:

```bash
pytest
```

---

## API Documentation

Swagger UI:

```text
http://127.0.0.1:8000/docs
```

---

## Example Request

```json
{
  "pr_url": "https://github.com/fastapi/fastapi/pull/15613"
}
```

---

## Example Workflow

```text
GitHub PR URL
↓
FastAPI Endpoint
↓
GitHub API Integration
↓
Patch & Metadata Extraction
↓
Prompt Builder
↓
OpenAI Analysis
↓
Structured Technical Response
```

---

## Current Status

Implemented:
- GitHub PR parsing
- GitHub API integration
- OpenAI client integration
- Prompt engineering pipeline
- Local fallback analysis
- Docker support
- Automated tests
- Swagger documentation

Planned:
- Frontend UI
- Database persistence
- CI/CD pipeline
- Cloud deployment

---

## Author

Built by Jose Ramila.