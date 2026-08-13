# 🚀 Hobby AI Skill Coach - Backend API Server

A production-grade, multi-modal Express.js & MongoDB backend providing real-time AI Coaching, intelligent curriculum progression, session practice tracking, YouTube video integration with deduplication, global leaderboards, and static Single Page Application (SPA) web hosting.

---

## 🌟 Live Production Links

* **Live API Base URL**: `https://hobby.missioninvictus.com/api/v1`
* **Live Web Application**: `https://hobby.missioninvictus.com`

---

## 🛠️ Technology Stack & Architecture

* **Core Engine**: Node.js (v18+) & Express.js
* **Database**: MongoDB Atlas (Mongoose ODM v6)
* **AI Providers**: Google Gemini 1.5 Pro/Flash & OpenAI GPT-4o
* **Video Integration**: YouTube Data API v3 (with 24-hour NodeCache & deduplication memory)
* **Process Manager**: PM2 (Cluster Mode, 0-downtime execution)
* **Reverse Proxy & SSL**: Nginx 1.26 + Let's Encrypt Certbot HTTPS
* **Hosting**: DigitalOcean Ubuntu Droplet

---

## ✨ Key Features & Capabilities

### 1. Multi-Modal AI Coaching Engine (`/api/v1/ai/learn-skill`)
* Generates structured JSON lesson content (Text, SVGs, Interactive Quizzes, Checklists, Flashcards, Code Snippets, Musical Notes).
* Incorporates user strengths, weaknesses, level, score, and previous 6-turn context window.
* **Selective AI Video Triggering**: Only fetches YouTube videos when teaching physical/visual techniques (posture, finger positioning, hand movements) or when explicitly requested.

### 2. Video Deduplication Memory
* Inspects active conversation history to extract previously delivered `videoId`s.
* Searches top 5 YouTube results and filters out seen videos, guaranteeing learners **never see duplicate videos**.

### 3. Automated Practice Session Coalescing
* Calculates real-time study depth based on delivered forms (+60s SVG, +60s checklist, +90s musical notes, +90s code, +60s per quiz question).
* Automatically groups continuous learning turns within 15-minute windows into realistic `PracticeSession` documents to auto-update **Total Practice Time** & **Weekly Practice Goal**.

### 4. Anonymous Device & User Session Resolver (`authMiddleware.js`)
* Resolves `x-device-id` headers into unique MongoDB `User` documents.
* Generates cryptographic device hashes for Incognito mode & new devices, ensuring 100% data isolation.

### 5. Global & Hobby Leaderboard (`/api/v1/leaderboard`)
* Real-time XP & Score aggregation with 60-second in-memory caching (`LEADERBOARD_CACHE`).
* Returns podium rankings, user ranks, and XP required to overtake the user ahead.

### 6. Static Web App Hosting (`app.js`)
* Serves the Expo Web static build directly from `/public` with Single Page Application (SPA) fallback.

---

## 📁 Repository Directory Structure

```
hobby-backend/
├── Config/                   # DB connection, admin credentials & constants
│   ├── db.js                 # Mongoose connection setup
│   ├── hobby-coach-admin.js  # Admin seeds & global configuration
│   ├── modelConfig.js        # AI provider models mapping
│   └── skillLearningConstants.js # Enums for skill levels & learning forms
├── Controller/               # Core business logic
│   ├── aiController.js       # General AI endpoints
│   ├── authController.js     # User authentication & device profiles
│   ├── dashboardController.js# User hobbies, goals, stage progress & stats
│   ├── leaderboardController.js # Leaderboard calculations & caching
│   └── skillLearningController.js # Multi-modal AI coaching & session tracking
├── Middleware/               # Express Middlewares
│   ├── authMiddleware.js     # Anonymous device & session resolver
│   ├── costGate.js           # Daily AI cost ceiling limiter
│   ├── rateLimiter.js        # API rate limiting
│   ├── requireAdmin.js       # Admin access guard
│   └── verifyToken.js        # JWT verification
├── Models/                   # MongoDB Mongoose Schemas
│   ├── AIRequest.js          # AI token & request auditing
│   ├── Conversation.js       # Active AI chat session threads
│   ├── Hobby.js              # Global hobby catalog
│   ├── HobbySkill.js         # Skills & modules per hobby
│   ├── Message.js            # Individual chat messages & payloads
│   ├── PracticeSession.js    # Coalesced practice sessions & XP
│   ├── QuizAttempt.js        # Quiz answers & evaluations
│   ├── User.js               # User accounts & external auth IDs
│   ├── UserHobby.js          # Enrolled user hobbies & targets
│   └── UserSkill.js          # User skill scores, levels & streaks
├── Routes/                   # Express API Route Registries
│   ├── aiRoute.js
│   ├── authRoute.js
│   ├── dashboardRoute.js
│   ├── leaderboardRoute.js
│   └── skillLearningRoute.js
├── Service/                  # Integrations & Helper Services
│   ├── AiModelService.js     # OpenAI & Gemini SDK wrapper
│   ├── YouTubeService.js     # YouTube Data API v3 integration & cache
│   └── TimeService.js        # Session windowing & time utilities
├── public/                   # Static build output for Expo Web App
├── app.js                    # Express Application instance & routing
├── ecosystem.config.js       # PM2 production process configuration
├── package.json              # Dependency manifest
└── server.js                 # Server entry point
```

---

## 📡 API Endpoint Reference

### 1. AI Skill Coaching
* **POST** `/api/v1/ai/learn-skill`
  * **Headers**: `x-device-id: <UUID>`
  * **Payload**:
    ```json
    {
      "message": "How do I hold the harmonium bellows?",
      "conversationId": "66b123...",
      "userHobbyId": "66b456..."
    }
    ```
  * **Response**:
    ```json
    {
      "status": 200,
      "data": {
        "responseType": "learning_content",
        "conversationId": "66b123...",
        "learningContent": {
          "formsToDeliver": ["text", "video"],
          "text": "### How to Hold Harmonium Bellows\n...",
          "video": {
            "title": "Harmonium Bellows Air Technique",
            "videoId": "dF9x1a2b3c4",
            "embedUrl": "https://www.youtube.com/embed/dF9x1a2b3c4?autoplay=1&playsinline=1"
          }
        }
      }
    }
    ```

* **GET** `/api/v1/ai/chat-history`
  * **Query Params**: `conversationId`, `userHobbyId`, `page`, `limit`

* **POST** `/api/v1/ai/submit-quiz`
  * **Payload**: `{ "quizId": "q_1", "selectedIndex": 0, "correctIndex": 0 }`

---

### 2. Dashboard & Onboarding
* **GET** `/api/v1/dashboard/summary`
  * **Query Params**: `userHobbyId` (optional)
  * Returns user's active stage, step, weekly practice minutes, total practice time, mastery score, and countdown.

* **POST** `/api/v1/dashboard/enroll`
  * **Payload**:
    ```json
    {
      "hobbyName": "Harmonium",
      "goal": "Play devotional songs fluently",
      "experienceLevel": "beginner",
      "weeklyPracticeMinutes": 120,
      "displayName": "Alex Rivera",
      "avatar": "⚡"
    }
    ```

* **GET** `/api/v1/dashboard/hobbies`
  * Returns list of user's enrolled hobbies and catalog.

---

### 3. Leaderboard
* **GET** `/api/v1/leaderboard`
  * **Query Params**: `type=weekly|alltime`, `limit=20`
  * **Response**:
    ```json
    {
      "success": true,
      "type": "weekly",
      "podium": [...top 3 learners...],
      "rankings": [...rankings 4 to 20...],
      "currentUserRank": { "rank": 4, "xpNeededToOvertake": 12 }
    }
    ```

---

## ⚙️ Environment Variables (`.env`)

```env
PORT=4056
MONGODB_URL=your-mongodb-connection-string
JWT_TOKEN_KEY=your-jwt-secret-key
PROJECT_NAME=Hobby Server
OPENAI_API_KEY=sk-proj-your-openai-key
GEMINI_API_KEY=your-gemini-key
YOUTUBE_API_KEY=your-youtube-key
AI_DAILY_COST_CEILING=2.00
BYPASS_SECRET_TOKEN=your-bypass-token
```

---

## 🏃 Local Setup & Installation

1. **Clone repository**:
   ```bash
   git clone https://github.com/Mr-Ajay-Singh/Hobby-App-Backend.git
   cd Hobby-App-Backend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start local development server**:
   ```bash
   npm run dev
   ```

---

## 🚀 Production Deployment (DigitalOcean & PM2)

```bash
# 1. Pull latest changes
git pull

# 2. Low-memory npm install
NODE_OPTIONS="--max-old-space-size=256" npm install --omit=dev --no-audit --no-fund

# 3. Start/Restart on PM2
pm2 restart ecosystem.config.js --env production
pm2 save
```

---

## 📄 License
ISC License © 2026 Mr. Ajay Singh.