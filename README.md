RIA – Wellness Aware Agentic AI
Your AI-powered posture, mood & wellness companion.

Real-time detection • Agentic AI • Google Calendar Sync • Wellness Automation

🚀 Overview

RIA is an AI-powered wellness companion that analyzes your posture, mood, and daily habits in real time using computer vision and agentic AI.
It automatically generates personalized routines, manages your calendar, and even prepares doctor appointments using Gemini AI.

This is a fully deployed, production-ready, full-stack application with real-time MediaPipe detection, Firebase backend, and intelligent scheduling.

✨ Key Features
🎭 Real-Time AI Detection

Mood Recognition using MediaPipe Face Landmarker
Detects: Happy, Sad, Angry, Neutral, Surprised
Includes face mesh overlay + expression confidence scores

Posture Tracking with Pose Landmarker

Green skeleton overlay

Detects slouching, forward head posture, shoulder imbalance

Live posture score (0–100)

🧠 Agentic AI Workflows

Gemini-powered reasoning

Personalized routines generated from health profile

Adaptive tasks based on disability/condition (supports “Other”)

AI doctor appointment assistant (prepares booking options)

📅 Smart Calendar Automation

Google Calendar integration

Pulls all events

Shows existing events in Blue

Inserts AI-generated tasks into free slots in Green

🔥 Core App Features

Google Sign-In (Firebase Auth)

Personalized onboarding

XP + Gamification system

Leaderboard (with seeded sample users)

AI chat for wellness advice

Fully responsive UI (React + Tailwind)

🏗️ Tech Stack
Frontend

React 18 + Vite

TypeScript

Tailwind CSS

Framer Motion

Wouter (routing)

AI / Vision

MediaPipe Tasks Vision

TensorFlow.js

face_landmarker.task

pose_landmarker_lite.task

Backend & Infrastructure

Firebase Authentication

Firestore Database

Firebase Storage

Google Calendar API

Gemini AI API

Express Server

Production build with security headers + health checks

📦 Project Structure
ria-test-1/
├── client/                   
│   ├── public/               
│   ├── src/
│   │   ├── components/       
│   │   ├── hooks/           
│   │   │   ├── useFaceDetection.ts    
│   │   │   └── usePostureDetection.ts 
│   │   ├── lib/             
│   │   │   ├── firebase.config.ts     
│   │   │   └── googleCalendar.ts      
│   │   ├── pages/           
│   │   └── App.tsx          
│   └── index.html
├── server/
│   └── index-dev.ts
└── package.json

⚙️ Environment Setup

Create a .env file:

# Firebase
VITE_FIREBASE_API_KEY=YOUR_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_ID
VITE_FIREBASE_APP_ID=YOUR_APPID
VITE_FIREBASE_MEASUREMENT_ID=YOUR_MEASURE_ID

# Google Calendar
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID

# Gemini AI
VITE_GEMINI_API_KEY=YOUR_GEMINI_KEY


The Firebase project is already pre-configured — app runs without .env for testing.

🛠️ Installation & Running Locally
1️⃣ Clone the repo
git clone https://github.com/<your-username>/ria.git
cd ria

2️⃣ Install dependencies
npm install

3️⃣ Start development server
npm run dev


Access at:
👉 http://localhost:5000

🏁 Production Deployment
Build
npm run build

Start production server
npm start


Includes:

Optimized static file serving

Secure headers

CORS config

/api/health monitoring endpoint

🧪 MediaPipe Models

Face Landmarker: 478 landmarks + 52 blendshapes

Pose Landmarker: 33 body landmarks

Runs fully in-browser at 30–60 FPS

🎮 How to Use
Mood Detection

Dashboard → Mood Detection

Start Camera

Live emotion detection with mesh overlay

Posture Detection

Dashboard → Posture Detection

Start Camera

Skeleton overlay + posture score

Tasks & Calendar

Complete onboarding

AI generates tasks

Tasks auto-populate Google Calendar

Leaderboard

Earn XP → Level up → Compete globally

🌍 Launch & Marketing

Fully launched on web

Product Hunt release: Tomorrow

Promotions on: Reddit, X/Twitter, Instagram, Facebook

Applying to a16z + Y Combinator

🤝 Contributing

Fork repository

Create a new branch

Commit your changes

Submit a pull request

📜 License

MIT License — free to use and modify.

💬 Contact

For issues, suggestions, or contributions—open an issue or PR on GitHub.

❤️ Built with passion for accessibility, wellness, and agentic AI.
