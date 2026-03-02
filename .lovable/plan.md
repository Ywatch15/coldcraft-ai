

# ColdCraft — AI Cold Email Generator (Frontend)

## Overview
A polished SaaS-style React frontend with three main pages: Landing, Auth, and Dashboard. All data will use mock/dummy values. API calls will be structured so you can easily point them to your real backend later.

## Pages & Features

### 1. Landing Page
- Dark SaaS theme with animated gradient/spiral background
- Hero section with headline, subtext, and two CTA buttons ("Get Started", "Login")
- Features section using a Bento Grid layout (4-6 feature cards highlighting AI email generation, personalization, history, etc.)
- Fully responsive

### 2. Auth Page
- Animated gradient background
- Multi-step form flow:
  - **Step 1:** Register or Login (email + password)
  - **Step 2:** OTP verification (6-digit input)
- On success: stores a mock JWT in localStorage, redirects to Dashboard
- Toggle between Register and Login modes

### 3. Dashboard Page
- Protected route (redirects to Auth if no token in localStorage)
- ChatGPT-style layout:
  - **Left Sidebar:** "New Email" button + scrollable email history list
  - **Right Panel:** Generation form + output display
- **GenerateForm:** Fields for recipient name, company, role, goal, tone, extra context. Ctrl+Enter shortcut to submit.
- **OutputPanel:** Displays generated subject + body with shimmer loading animation. Copy-to-clipboard button.
- Mock email generation with realistic dummy responses
- Auto-save draft to localStorage
- Email history stored in local state (mock data)

### 4. Shared Components
- **Navbar:** Logo, nav links, auth status
- **AuthContext:** React context for managing auth state (token in localStorage)
- **api.js utility:** Centralized API helper with base URL from env, ready to connect to your real backend

### Design
- Dark theme throughout (dark backgrounds, light text, accent gradients)
- Tailwind CSS styling
- Smooth animations and transitions

