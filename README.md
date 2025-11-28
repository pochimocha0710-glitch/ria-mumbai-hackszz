# RIA - Wellness Aware Agentic AI 🧘‍♀️

> An AI-powered wellness companion featuring real-time posture detection, mood analysis, and personalized health routines.

![RIA Dashboard](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue)
![MediaPipe](https://img.shields.io/badge/MediaPipe-Latest-orange)

## ✨ Features

### 🎭 Real-Time AI Detection
- **Mood Detection**: Instant emotion recognition using MediaPipe Face Landmarker
  - Detects: Happy 😊, Sad 😢, Angry 😠, Neutral 😐, Surprised 😲
  - Visual face mesh overlay
  - Live confidence scores and expression breakdown
  
- **Posture Analysis**: Real-time body tracking with green skeleton overlay
  - Detects slouching, uneven shoulders, forward head posture
  - 0-100 posture scoring system
  - Instant feedback and corrections

### 🎯 Core Features
- **User Onboarding**: Personalized health profile setup
- **XP & Gamification**: Level up by completing wellness tasks
- **Google Calendar Integration**: Sync routines with your calendar
- **Firebase Backend**: Secure authentication and data storage
- **Leaderboard**: Compete with other users
- **AI Chat**: Wellness guidance and support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase account
- Google Cloud account (for Calendar API)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/piyushxt43/ria-test-1.git
cd ria-test-1
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Google Calendar API
VITE_GOOGLE_CLIENT_ID=734179532245-n3fmch2r1848q63c133phc6de2kfnta9.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your_google_api_key

# Gemini AI API
VITE_GEMINI_API_KEY=AIzaSyDuJ3PYOuvtl8e3VuA3FPuNreDgrifqGZo
```

4. **Run the development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## 📦 Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **TypeScript 5.6.3** - Type safety
- **Vite 5.4.20** - Build tool
- **Tailwind CSS 3.4.17** - Styling
- **Framer Motion 11.13.1** - Animations
- **Wouter 3.3.5** - Routing

### AI & Detection
- **MediaPipe Tasks Vision** - Real-time face and pose detection
  - Face Landmarker for emotion recognition
  - Pose Landmarker for posture analysis
- **TensorFlow.js 4.22.0** - ML infrastructure
- **@mediapipe/tasks-vision** - Vision tasks

### Backend & Services
- **Firebase 12.6.0** - Authentication, Firestore, Analytics
- **Google APIs** - Calendar integration
- **Express 4.21.2** - Server

### UI Components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icons
- **React Hook Form** - Form management

## 🏗️ Project Structure

```
ria-test-1/
├── client/                    # Frontend application
│   ├── public/
│   │   ├── logoria.gif       # App logo
│   │   └── mainbg1.png       # Background assets
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ui/          # UI primitives
│   │   │   ├── UnifiedHeader.tsx
│   │   │   ├── UserOnboarding.tsx
│   │   │   ├── RiaChat.tsx
│   │   │   └── ...
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useFaceDetection.ts    # MediaPipe face detection
│   │   │   └── usePostureDetection.ts # MediaPipe pose detection
│   │   ├── lib/             # Utilities and configs
│   │   │   ├── firebase.config.ts     # Firebase setup
│   │   │   └── googleCalendar.ts      # Calendar integration
│   │   ├── pages/           # Route pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   └── ...
│   │   └── App.tsx          # Main app component
│   └── index.html
├── server/                   # Backend server
│   └── index-dev.ts
├── package.json
└── README.md
```

## 🎮 Usage

### Dashboard
1. Sign in with Google
2. Complete onboarding (age, height, weight, health info, goals)
3. Navigate to Dashboard

### Mood Detection
1. Click "Mood Detection" tab
2. Click "Start Camera"
3. See instant emotion recognition with face mesh overlay
4. View live results on the right panel

### Posture Detection
1. Click "Posture Detection" tab
2. Click "Start Camera"
3. See green skeleton tracking your body
4. Get real-time posture feedback and scoring

### Tasks & Gamification
1. View daily tasks in "Tasks" tab
2. Complete tasks to earn XP
3. Level up and climb the leaderboard

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Google Sign-In)
3. Create a Firestore database
4. Copy your config to `.env`

### Google Calendar API
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Copy Client ID and API Key to `.env`

## 🌐 Deployment

### Production Build

1. **Set up environment variables**
   
   Create a `.env` file in the root directory with your production values:
   ```env
   PORT=5000
   NODE_ENV=production
   ALLOWED_ORIGINS=https://your-production-domain.com
   
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   VITE_GOOGLE_API_KEY=your_google_api_key
   ```

2. **Build for production**
   ```bash
   npm run build
   ```
   This will:
   - Build the React frontend to `dist/public`
   - Bundle the Express server to `dist/index.js`

3. **Start production server**
   ```bash
   npm start
   ```
   The server will serve both the API and static files on the port specified in `PORT` (default: 5000).

### Production Features

- ✅ **Security Headers**: XSS protection, content type options, frame options
- ✅ **CORS Configuration**: Configurable allowed origins
- ✅ **Health Check Endpoint**: `/api/health` for monitoring
- ✅ **Error Handling**: Production-safe error messages
- ✅ **Static File Caching**: Optimized cache headers for assets
- ✅ **Environment-based Configuration**: Secure environment variable management

### Deployment Platforms

#### Vercel / Netlify
For frontend-only deployment, build the client and deploy `dist/public`:
```bash
npm run build
# Deploy dist/public directory
```

#### Railway / Render / Fly.io
Deploy the full-stack application:
```bash
# Set environment variables in platform dashboard
npm install
npm run build
npm start
```

#### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Health Check

Monitor your production deployment:
```bash
curl https://your-domain.com/api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

## 📊 MediaPipe Models

The app uses Google's MediaPipe for instant AI detection:

- **Face Landmarker**: Detects 478 facial landmarks and 52 blendshapes
  - Model: `face_landmarker.task` (~3MB)
  - Loaded from CDN: No downloads needed
  
- **Pose Landmarker**: Tracks 33 body landmarks
  - Model: `pose_landmarker_lite.task` (~5MB)
  - Loaded from CDN: No downloads needed

Both models load in <1 second and run at 30-60 FPS on modern devices.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **MediaPipe** by Google for real-time ML models
- **Firebase** for backend infrastructure
- **Radix UI** for accessible components
- **Tailwind CSS** for styling system

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ for wellness and health
#   r i a - m u m b a i - h a c k s z z 
 
 