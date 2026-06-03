# Architecture

AI PR Analyzer follows a modular backend architecture.

## Flow

Client
↓
FastAPI Routes
↓
Analysis Service
↓
GitHub Client / OpenAI Client
↓
External APIs

## Main Layers

- routes: HTTP endpoints
- services: business logic and orchestration
- clients: external API communication
- schemas: request and response validation
- core: application configuration