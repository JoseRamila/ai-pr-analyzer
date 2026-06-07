# AI PR Analyzer

AI-powered GitHub Pull Request analyzer built with FastAPI, React, Docker, GitHub API, and OpenAI.

---

# Overview

AI PR Analyzer allows users to submit a public GitHub Pull Request URL and receive a structured technical analysis.

The application fetches Pull Request metadata and changed files directly from the GitHub API, generates an AI-ready prompt, and returns a developer-focused review including:

* Pull Request summary
* Changed files
* Risk analysis
* Suggested tests
* Review checklist
* Impact level

If OpenAI quota is unavailable, the backend automatically falls back to a local analysis engine.

---

# Features

## Backend

* FastAPI backend
* GitHub API integration
* OpenAI integration
* Local fallback analysis
* Structured API responses
* Pull Request URL validation
* Changed files processing
* Docker support
* Automated tests with Pytest

## Frontend

* React + Vite frontend
* Modern dashboard UI
* Real-time PR analysis
* Loading and error states
* Structured visualization of:

  * files changed
  * additions/deletions
  * commits
  * risks
  * suggested tests
  * review checklist

---

# Tech Stack

## Frontend

* React
* TypeScript
* Vite
* TailwindCSS
* Lucide Icons

## Backend

* Python 3.12
* FastAPI
* Pydantic
* HTTPX
* OpenAI SDK

## Tooling

* Docker
* GitHub API
* Pytest
* Ruff
* Black

---

# Architecture

```text
Frontend (React + Vite)
        ↓
FastAPI Backend
        ↓
GitHub API
        ↓
OpenAI API / Local Fallback
```

---

# Project Structure

```text
ai-pr-analyzer/
│
├── backend/
│   ├── app/
│   │   ├── clients/
│   │   ├── core/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── db/
│   │   ├── models/
│   │   └── repositories/
│   │
│   ├── tests/
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
│
├── docker-compose.yml
└── README.md
```

---

# Run Backend Locally

```bash
cd backend

python -m venv .venv

# Windows
.venv\Scripts\Activate.ps1

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

Swagger docs:

```text
http://127.0.0.1:8000/docs
```

---

# Run Frontend Locally

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# Run with Docker

```bash
docker compose up --build
```

---

# Environment Variables

Create a `.env` file inside `backend/`:

```env
OPENAI_API_KEY=
GITHUB_TOKEN=
DATABASE_URL=
```

---

# API Endpoint

## Analyze Pull Request

```http
POST /analyses
```

Request body:

```json
{
  "pr_url": "https://github.com/fastapi/fastapi/pull/15613"
}
```

---

# Current Status

## Implemented

* FastAPI backend
* React frontend
* GitHub integration
* OpenAI integration
* Local fallback analysis
* Docker support
* Structured PR analysis
* Real changed files visualization
* Automated tests

## Planned

* PostgreSQL persistence
* Analysis history
* Authentication
* CI/CD pipeline
* Syntax-highlighted patches
* Advanced AI risk analysis

---

# Future Deployment

## Frontend

Vercel

## Backend

Render

