# ☁️ CloudControl

> The Forest Den's central portfolio platform — where all projects live, breathe, and are monitored in real time.

![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=flat&logo=githubactions&logoColor=white)

## Overview

CloudControl is the frontend hub of [The Forest Den](https://theforestden.dev) — a self-hosted home lab platform running on an Ubuntu Server. It serves as a live portfolio, a real-time infrastructure monitor, and the entry point to LifeOS, all in one.

Built with a production-first mindset: containerised with Docker, deployed behind Cloudflare Tunnel with SSL, and automatically deployed via GitHub Actions CI/CD on every push to main.

## Features

- **Projects Page** — Live monitoring of all running applications with real-time health status
- **Server Control Centre** — Start, stop, and restart Docker containers directly from the UI with confirmation guards
- **LifeOS Integration** — Full personal productivity suite proxied through Next.js API routes
- **About Page** — Portfolio profile with language distribution charts and career timeline
- **Language Statistics** — Auto-calculated from project data, visualised with Recharts pie chart
- **JWT Authentication** — Auth-aware navigation with protected routes

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Charts | Recharts |
| Auth | JWT (via SecureAuth-Lite) |
| Container | Docker + Docker Compose |
| Reverse Proxy | Nginx |
| Tunnel | Cloudflare Tunnel |
| CI/CD | GitHub Actions (self-hosted runner) |

## Architecture

CloudControl acts as a reverse proxy for internal services — all LifeOS API calls are proxied through Next.js API routes to avoid CORS issues and keep the internal server IP private.
```
Browser → Cloudflare Tunnel → Nginx → CloudControl (port 3000)
                                           ↓
                                    Next.js API Routes
                                           ↓
                              LifeOS API / ServerControl API
```

## Running Locally
```bash
git clone https://github.com/Nathan-Forest/cloudcontrol.git
cd cloudcontrol
npm install
npm run dev
```

> **Note:** Some features require the full Forest Den stack (LifeOS API, ServerControl) running on the server. Core pages work standalone.

## Deployment

Deployed on a self-hosted Ubuntu Server (ThinkCentre m700) via Docker Compose. CI/CD is handled by a GitHub Actions self-hosted runner — pushes to `main` automatically rebuild and restart the container.

## Part of The Forest Den

CloudControl is one of several applications in The Forest Den home lab platform:

| App | Stack | Purpose |
|---|---|---|
| **CloudControl** | Next.js / TypeScript | Portfolio hub & frontend |
| **LifeOS API** | C# / .NET 8 | Personal productivity backend |
| **ServerControl** | Python / FastAPI | Docker management API |
| **SecureAuth-Lite** | C# / .NET 8 | JWT authentication service |
| **PulseMonitor** | FastAPI + React | Real-time system monitoring |
| **FinanceHub** | C# ASP.NET Core | Personal finance dashboard |