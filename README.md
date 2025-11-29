🌿 RIA – Wellness Aware Agentic AI
Your AI-powered posture, mood & wellness companion.

Real-time detection • Agentic AI • Google Calendar Sync • Wellness Automation

🚀 Overview

RIA is an AI-powered wellness companion that analyzes your posture, mood, and daily habits in real time using computer vision and agentic AI.
It automatically generates personalized routines, manages your calendar, and even prepares doctor appointments using Gemini AI.

This is a fully deployed, production-ready, full-stack application powered by MediaPipe, Firebase, Calendar API, and Gemini AI.

✨ Key Features
🎭 Real-Time AI Detection

Mood Recognition (Happy, Sad, Angry, Neutral, Surprised)

Face mesh overlay + confidence scores

Posture Scoring with green skeleton overlay

Detects slouching, imbalance, forward head posture

🧠 Agentic AI Workflows

Personalized routines

Adaptive tasks based on disability + “Other” custom inputs

Smart scheduling

AI doctor appointment assistant (user-confirmation based)

📅 Smart Calendar Automation

Full Google Calendar sync

Existing events = Blue

AI-generated tasks = Green

Inserts tasks into free time slots intelligently

🔥 App Highlights

Google Sign-In

Onboarding system

Gamification (XP + levels)

Leaderboard (with seeded sample users)

AI Wellness Chat

Fully responsive UI

🏗️ Tech Stack

Frontend: React, TypeScript, Vite, Tailwind, Framer Motion
AI: MediaPipe Tasks Vision, TensorFlow.js
Backend: Firebase Auth, Firestore, Express
Integrations: Google Calendar API, Gemini API

📦 Project Structure
ria/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── App.tsx
├── server/
└── package.json

⚙️ Environment Setup

.env example:

# Firebase
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_APP_ID=your_app_id

# Google Calendar
VITE_GOOGLE_CLIENT_ID=your_client_id

# Gemini AI
VITE_GEMINI_API_KEY=your_key

🛠️ Running Locally
git clone <repo>
npm install
npm run dev

🏁 Production Deployment
npm run build
npm start


Includes:

Security headers

CORS protection

/api/health endpoint

🌍 Launch, Marketing & Accelerator Applications

The complete product is already launched publicly on the web

Product Hunt launch: Tomorrow to reach global early adopters

Marketing rollout across:

Reddit, X/Twitter, Instagram, Facebook

Applying to top global accelerators:

Y Combinator

a16z (Andreessen Horowitz)

Other leading AI & health-tech early-stage funds

Goal: Position RIA as a global Agentic Wellness AI platform

🤝 Contributing

Contributions welcome! Submit PRs or issues.

📜 License

MIT License.

💬 Contact

Open an issue or PR on GitHub.

❤️ Built for the future of wellness and human-centered AI.
