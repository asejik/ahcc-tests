⚓ Anchor of Hope Assessment Portal
A professional psychological assessment platform built for Anchor of Hope Counselling & Consultancy. This application allows clients to take secure, code-protected psychological tests and provides therapists with a comprehensive dashboard for AI-powered analysis and result management.

✨ Features
🧠 Client Portal
5 Professional Assessments:

Temperament Test: (Choleric, Sanguine, etc.)

Big Five Personality: (OCEAN Model)

Attachment Style: (Secure, Anxious, Avoidant, Fearful)

5 Love Languages: (Words of Affirmation, Acts of Service, etc.)

Conflict Resolution: (Avoiding, Competing, Collaborating, etc.)

Secure Access: Clients must enter a valid, one-time-use access code to start a test.

Modern UI/UX: High-end glassmorphism design with Framer Motion animations.

AI Analysis: Instant, personalized psychological profile generation using Google Gemini AI.

🛡️ Admin Dashboard
Result Management: View, search, filter, and delete client results.

Access Code Generator: Generate unique codes for specific tests or "Master" codes for unlimited access.

Detailed Analytics: Visual score breakdowns, charts, and AI insights for every client.

PDF Export: One-click generation of client reports.

Security: Authentication protected via Firebase Auth.

🛠️ Tech Stack
Frontend: React (Vite), TypeScript

Styling: Tailwind CSS v4, Framer Motion (Animations)

Backend / Database: Firebase Firestore, Firebase Authentication

AI Engine: Google Gemini API (gemini-2.5-flash)

Icons: Lucide React

Deployment: Vercel

🚀 Getting Started
Prerequisites
Node.js (v18 or higher)

npm or yarn

1. Clone the Repository
Bash

git clone https://github.com/yourusername/anchor-portal.git
cd anchor-portal
2. Install Dependencies
Bash

npm install
3. Environment Variables
Create a .env file in the root directory and add your Firebase and Gemini keys:

Code snippet

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_key
4. Run Locally
Bash

npm run dev
Open http://localhost:5173 to view the app.

🔐 Access Code System
The system uses a custom Firestore collection (access_codes) to manage permissions.

Standard Code: Valid for 2 uses (configurable). Restricted to a specific test type (e.g., "Temperament").

Master Code: Created by selecting "MASTER" in the generator. It has -1 uses (Unlimited) and works for ALL test types. Useful for admin testing or VIP clients.

📂 Project Structure
src/
├── components/      # UI components (Buttons, Cards, Inputs)
├── lib/             # Logic (Firebase, Gemini, Math helpers)
├── pages/           # Route pages (Home, Dashboard, Tests, Results)
├── store/           # Zustand state management
├── types/           # TypeScript interfaces (TestResult, UserInfo)
└── App.tsx          # Main router and layout
🌍 Deployment
This project is optimized for Vercel.

Push your code to GitHub.

Import the project in Vercel.

Add the Environment Variables (from Step 3) in Vercel Settings.

Deploy!

Note: A vercel.json file is included to handle Single Page Application (SPA) routing.

📄 License
Proprietary software for Anchor of Hope Counselling & Consultancy. All rights reserved.