# AI Career Intelligence Platform

Automated job ingestion, matching and daily reporting using n8n, PostgreSQL,
a local LLM (Ollama) and Docker. Runs fully on a local machine with free,
open-source tools.

> Status: work in progress.

## Problem
Job searching is manual, repetitive and full of duplicates, and it is hard to
tell how well a job fits a profile.

## Planned features
- Job ingestion from public APIs and RSS feeds
- Validation, normalization and deduplication
- Rules-based plus local-AI job matching with explanations
- Daily report and a web dashboard
- Error monitoring and logging

## Tech stack
n8n, PostgreSQL, Ollama, Docker Compose, Next.js dashboard

## Disclaimer
Match scores are estimates, not a guarantee of any job outcome.
Only official APIs and RSS feeds are used. No scraping of login-protected sites.

## Documentation
Setup, architecture and troubleshooting guides will be added under `docs/`.

## Data sources and attribution
- Remote jobs data courtesy of [Remotive](https://remotive.com). Job listings link back to the original Remotive page.
- Remotive data is stored only in a local database and is not committed to this repository. Sample data in this repo is synthetic.
- Remotive allows at most 4 API requests per day; this project fetches once per day.
