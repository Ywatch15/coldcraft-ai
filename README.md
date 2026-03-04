<p align="center">
  <img src="frontend/public/image.png" alt="ColdCraft AI" width="120" height="120" style="border-radius: 16px;" />
</p>

<h1 align="center">
  <a href="https://coldcraft-frontend.onrender.com/" target="_blank" style="text-decoration: none; color: inherit;">
    ColdCraft AI
  </a>
</h1>
<p align="center">
  <strong>AI-Powered Cold Email Generator</strong><br/>
  Craft hyper-personalized outreach emails that actually get replies.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Gemini_2.0-Flash-4285F4?style=flat-square&logo=google" alt="Gemini" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Deploy-Render-46E3B7?style=flat-square&logo=render" alt="Render" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Clone & Install](#clone--install)
  - [Environment Variables](#environment-variables)
  - [Run Locally](#run-locally)
- [Backend API Reference](#backend-api-reference)
- [Template Engine (Fallback)](#template-engine-fallback)
- [Email Verification (Nodemailer)](#email-verification-nodemailer)
- [Deployment on Render](#deployment-on-render)
- [Project Structure](#project-structure)
- [License](#license)

---

## Overview

**ColdCraft AI** is a full-stack MERN application that generates professional, personalized cold emails using Google Gemini 2.0 Flash AI. When the AI service is unavailable (rate limits, downtime, or no API key configured), a built-in template engine with **500+ real-world job titles** takes over seamlessly — ensuring zero downtime for email generation.

Users register with email verification (OTP via Nodemailer/Gmail SMTP), log in, and generate unlimited cold emails from an interactive dashboard with full history tracking and a resizable sidebar.

---

## Features

| Feature | Description |
|---------|-------------|
| **AI Email Generation** | Google Gemini 2.0 Flash generates context-aware, hyper-personalized cold emails |
| **Template Engine Fallback** | 500+ job title coverage across 12 industry categories when AI is unavailable |
| **OTP Email Verification** | Nodemailer + Gmail SMTP sends styled HTML verification codes |
| **Email History** | Full CRUD — view, search, and revisit all previously generated emails |
| **Resizable Sidebar** | Drag-to-resize sidebar with smooth animations and persistent branding |
| **Dark UI with Shaders** | WebGL aurora shader (Auth), neon tube particles (Dashboard), geometric hero (Landing) |
| **JWT Authentication** | Secure token-based auth with 7-day expiry and bcrypt password hashing |
| **Tone & Goal Control** | Professional / Casual / Formal / Friendly tones + customizable outreach goals |
| **One-Click Deploy** | `render.yaml` blueprint for instant Render deployment |
| **Responsive Design** | Mobile-first Tailwind CSS + shadcn/ui components |

---

## Tech Stack

### Frontend
- **React 18** + **TypeScript** — UI library
- **Vite 5** — Build tool & dev server
- **Tailwind CSS 3** — Utility-first styling
- **shadcn/ui** — Radix-based component library
- **Framer Motion** — Page/element animations
- **Three.js** — WebGL shader backgrounds
- **Lucide React** — Icon system
- **React Router v6** — Client-side routing

### Backend
- **Node.js** + **Express 4** — REST API server
- **MongoDB** + **Mongoose 8** — Database & ODM
- **Google Generative AI** — Gemini 2.0 Flash model
- **Nodemailer** — SMTP email transport (OTP delivery)
- **bcryptjs** — Password hashing (12 salt rounds)
- **jsonwebtoken** — JWT authentication
- **dotenv** — Environment variable management

### Infrastructure
- **Render** — Cloud hosting (Web Service + Static Site)
- **MongoDB Atlas** — Managed database cluster

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Frontend                         │
│  React + Vite + TypeScript + Tailwind + Three.js     │
│                                                      │
│  Landing ──► Auth (OTP) ──► Dashboard                │
│              │                  │                     │
│        ShaderBG            TubesBackground            │
│              │                  │                     │
│              ▼                  ▼                     │
│         Login/Register    GenerateForm + History      │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS (JWT Bearer)
                   ▼
┌─────────────────────────────────────────────────────┐
│                     Backend API                      │
│  Express + Mongoose + JWT + Nodemailer               │
│                                                      │
│  POST /api/auth/register   → OTP via Nodemailer      │
│  POST /api/auth/verify-otp → JWT token               │
│  POST /api/auth/login      → JWT token               │
│  POST /api/emails/generate → Gemini AI │ Template     │
│  GET  /api/emails          → Email history            │
│  GET  /api/health          → Health check             │
└──────────────────┬──────────────────────────────────┘
                   │
          ┌────────┴────────┐
          ▼                 ▼
   ┌─────────────┐  ┌──────────────┐
   │ MongoDB     │  │ Gemini 2.0   │
   │ Atlas       │  │ Flash API    │
   │             │  │              │
   │ Users       │  │ (fallback:   │
   │ Emails      │  │ roleTemplates│
   └─────────────┘  └──────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x (or **Bun** for the frontend)
- **MongoDB Atlas** account (free M0 tier works)
- **Google AI Studio** API key ([get one here](https://aistudio.google.com/apikey))
- **Gmail App Password** for Nodemailer ([generate here](https://myaccount.google.com/apppasswords))

### Clone & Install

```bash
git clone https://github.com/Ywatch15/coldcraft-ai.git
cd coldcraft-ai

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create `backend/.env` from the example:

```bash
cp backend/.env.example backend/.env
```

Then fill in the values:

```env
# ─── MongoDB ──────────────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/?retryWrites=true&w=majority
DB_NAME=coldcraft

# ─── JWT ──────────────────────────────────────────────
JWT_SECRET=<random-64-char-string>
JWT_EXPIRY=7d

# ─── Google Gemini AI ─────────────────────────────────
GEMINI_API_KEY=<your-gemini-api-key>

# ─── Nodemailer (Gmail SMTP) ──────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=<your-gmail-app-password>

EMAIL_FROM="ColdCraft AI <your-email@gmail.com>"

# ─── CORS ─────────────────────────────────────────────
FRONTEND_URL=http://localhost:8080

# ─── Server ───────────────────────────────────────────
PORT=5000
NODE_ENV=development
```

> **Important:** `SMTP_PASS` is a **Gmail App Password**, NOT your Gmail login password. You must enable 2FA on your Google account first, then generate an app password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).

### Run Locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# ✓ Server running on port 5000

# Terminal 2 — Frontend
cd frontend
npm run dev
# ➜ Local: http://localhost:8080
```

---

## Backend API Reference

All endpoints prefixed with `/api`. Email routes require `Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | No | Register with email + password → sends OTP |
| `POST` | `/api/auth/verify-otp` | No | Verify 6-digit OTP → returns JWT |
| `POST` | `/api/auth/login` | No | Login with email + password → returns JWT |
| `POST` | `/api/emails/generate` | Yes | Generate cold email (AI or template) |
| `GET` | `/api/emails` | Yes | Fetch user's email history |
| `GET` | `/api/health` | No | Health check → `{ status: "ok" }` |

### Generate Email Request Body

```json
{
  "recipientName": "Sarah Chen",
  "company": "Stripe",
  "role": "VP of Engineering",
  "goal": "Schedule a product demo",
  "tone": "Professional",
  "extraContext": "Met at TechCrunch Disrupt 2025"
}
```

### Generate Email Response

```json
{
  "id": "...",
  "subject": "Quick Question About Stripe's Engineering Roadmap",
  "body": "Hi Sarah, ...",
  "metadata": { "recipientName": "Sarah Chen", "company": "Stripe", ... },
  "source": "ai",
  "createdAt": "2026-03-04T..."
}
```

The `source` field indicates whether the email was generated by `"ai"` (Gemini) or `"template"` (fallback engine).

---

## Template Engine (Fallback)

When Gemini is unavailable (rate limit / network error / no API key), the built-in template engine generates professional emails using:

- **12 industry categories** — Tech, Finance, Healthcare, Marketing, Legal, Education, etc.
- **500+ real-world job titles** in `backend/data/jobTitles.json`
- **Seniority detection** — C-Suite, Director, Senior, Mid-level (adjusts language formality)
- **4 tone profiles** — Professional, Casual, Formal, Friendly (each with greeting/closing/style rules)
- **8 goal templates** — Demo, Meeting, Partnership, Introduction, Feedback, Hiring, Investment, General
- **Randomized subject lines** — 5 variants per generation to avoid repetition

The fallback is transparent to users — the only difference is the `source` field in the API response.

---

## Email Verification (Nodemailer)

OTP delivery uses **Nodemailer** with Gmail SMTP:

1. User registers → server generates a 6-digit OTP (valid 10 minutes)
2. If `SMTP_USER` + `SMTP_PASS` are configured → sends a styled HTML verification email
3. If not configured (dev mode) → OTP is logged to the server console
4. User enters OTP → account is verified → JWT issued

**Gmail App Password Setup:**
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Generate a new password for "Mail" → use that as `SMTP_PASS`

---

## Deployment on Render

ColdCraft uses a **Render Blueprint** (`render.yaml`) that provisions both services automatically.

### Step-by-Step

1. **Push code to GitHub**
   ```bash
   git add -A
   git commit -m "production ready"
   git push origin main
   ```

2. **Create a MongoDB Atlas Cluster**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) → Create free M0 cluster
   - Create a database user and whitelist `0.0.0.0/0` for network access
   - Copy the connection string: `mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/?retryWrites=true&w=majority`

3. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**
   - Connect your GitHub repository (`Your Username\Project name`)
   - Render auto-detects `render.yaml` and creates two services:
     - `coldcraft-api` — Node.js Web Service (backend)
     - `coldcraft-frontend` — Static Site (frontend)

4. **Set Environment Variables on Render**

   Navigate to `coldcraft-api` → **Environment** and add:

   | Variable | Value | Notes |
   |----------|-------|-------|
   | `MONGODB_URI` | `mongodb+srv://...` | Your Atlas connection string |
   | `JWT_SECRET` | `<random-64-chars>` | Generate with `openssl rand -hex 32` |
   | `GEMINI_API_KEY` | `AI......` | From [Google AI Studio](https://aistudio.google.com/apikey) |
   | `SMTP_HOST` | `smtp.gmail.com` | SMTP server hostname |
   | `SMTP_PORT` | `587` | SMTP port (587 = STARTTLS) |
   | `SMTP_USER` | `your-email@gmail.com` | Your Gmail address |
   | `SMTP_PASS` | `xxxx xxxx xxxx xxxx` | Gmail App Password |
   | `EMAIL_FROM` | `"ColdCraft AI <your-email@gmail.com>"` | Sender name & address |

   > `NODE_ENV`, `DB_NAME`, `JWT_EXPIRY`, and `FRONTEND_URL` are already set in `render.yaml`.
   >
   > `VITE_API_URL` on the frontend is auto-linked to the backend's host via `render.yaml`.

5. **Deploy**
   - Click **Apply** on the Blueprint page
   - Both services build and deploy (first deploy takes ~2-3 minutes)
   - Backend: `https://coldcraft-api.onrender.com`
   - Frontend: `https://coldcraft-frontend.onrender.com`

### Render Service Configuration (from render.yaml)

| Service | Type | Runtime | Build Command | Start Command |
|---------|------|---------|---------------|--------------|
| `coldcraft-api` | Web Service | Node.js | `npm install` | `node src/server.js` |
| `coldcraft-frontend` | Static Site | Static | `npm install && npm run build` | — (serves `dist/`) |

### Post-Deploy Checklist

- [ ] Visit `/api/health` on the backend URL — should return `{ "status": "ok" }`
- [ ] Register a new account — OTP email should arrive in a few seconds
- [ ] Generate an email — check `source` field in response (`"ai"` = Gemini working)
- [ ] Verify sidebar history loads previously generated emails

---

## Project Structure

```
coldcraft-ai/
├── render.yaml                    # Render deployment blueprint
│
├── backend/
│   ├── package.json
│   ├── .env.example               # Environment variable template
│   ├── data/
│   │   └── jobTitles.json         # 500+ real-world job titles
│   └── src/
│       ├── server.js              # Express app entry point
│       ├── config/
│       │   └── db.js              # MongoDB connection (Mongoose)
│       ├── middleware/
│       │   └── auth.js            # JWT sign/verify/middleware
│       ├── models/
│       │   ├── User.js            # User schema (email, password, OTP, isVerified)
│       │   └── Email.js           # Email schema (subject, body, metadata)
│       ├── routes/
│       │   ├── auth.js            # Register, verify-otp, login
│       │   └── emails.js          # Generate + list emails (Gemini → template fallback)
│       ├── services/
│       │   └── gemini.js          # Google Gemini 2.0 Flash integration
│       └── utils/
│           ├── mailer.js          # Nodemailer Gmail SMTP transport
│           ├── otp.js             # OTP generation + expiry helpers
│           └── roleTemplates.js   # Template engine (12 categories, seniority, tones)
│
└── frontend/
    ├── package.json
    ├── index.html                 # Entry HTML (favicon, meta tags)
    ├── vite.config.ts             # Vite configuration (proxy, alias)
    ├── tailwind.config.ts         # Tailwind theme & plugins
    ├── tsconfig.json              # TypeScript configuration
    ├── public/
    │   ├── image.png              # App icon (robot + envelope)
    │   └── robots.txt
    └── src/
        ├── App.tsx                # Route definitions
        ├── main.tsx               # React DOM root
        ├── index.css              # Global styles + Space Grotesk font
        ├── components/
        │   ├── Navbar.tsx         # Navigation bar with auth state
        │   ├── GenerateForm.tsx   # Email generation form (GlowingEffect, animations)
        │   ├── OutputPanel.tsx    # Generated email display
        │   ├── EmailCard.tsx      # Sidebar email history card
        │   └── ui/               # shadcn/ui + custom components
        │       ├── animated-shader-background.tsx  # WebGL aurora shader (Auth)
        │       ├── neon-flow.tsx                   # Neon tube particles (Dashboard)
        │       ├── shape-landing-hero.tsx           # Geometric hero (Landing)
        │       ├── glowing-effect.tsx               # Glow border effect
        │       └── ... (40+ shadcn/ui primitives)
        ├── context/
        │   └── AuthContext.tsx     # JWT auth context provider
        ├── hooks/
        │   ├── use-mobile.tsx     # Responsive breakpoint hook
        │   └── use-toast.ts       # Toast notification hook
        ├── lib/
        │   └── utils.ts           # cn() class merge utility
        ├── pages/
        │   ├── Landing.tsx        # Hero + feature cards
        │   ├── Auth.tsx           # Login / Register / OTP verification
        │   ├── Dashboard.tsx      # Main app (sidebar + form + output)
        │   └── NotFound.tsx       # 404 page
        └── utils/
            └── api.ts             # Axios-free fetch wrapper for all API calls
```

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Ywatch15">Ywatch15</a>
</p>
