#  AI-Powered Job Preparation Platform

A production-ready full-stack GenAI web application that helps users prepare for job interviews by analyzing their resume against job descriptions, detecting skill gaps, generating personalized interview questions, and creating ATS-optimized resumes.

>  **Work in Progress** — Authentication complete, AI integration in progress.

---

##  Features

-  **Secure Authentication** — JWT with token blacklisting, OTP email verification, httpOnly cookies
-  **Resume Upload & Parsing** — Upload resume and job description for AI analysis
-  **Skill Gap Detection** — Gemini AI detects missing skills based on JD vs resume
-  **Interview Question Generation** — Role-specific technical and behavioural questions
-  **Personalized Prep Plan** — Structured preparation plan based on detected gaps
-  **ATS Resume Generation** — Puppeteer-based dynamic PDF resume tailored to the job

---

##  Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React.js + Vite | UI framework |
| React Router | Client-side routing |
| Axios | HTTP requests |
| Context API | Global state management |
| SCSS | Styling |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express.js | Server & API |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| bcrypt | Password hashing |
| cookie-parser | Cookie management |
| Gemini AI | AI features |
| Puppeteer | PDF generation |

---

##  Project Structure

```
GenAI/
├── Backend/
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   │   └── auth.controller.js
│   │   ├── models/            # MongoDB schemas
│   │   │   ├── user.model.js
│   │   │   └── blacklist.model.js
│   │   ├── routes/            # API routes
│   │   │   └── auth.route.js
│   │   ├── middlewares/       # Auth middleware
│   │   │   └── auth.middleware.js
│   │   └── config/            # DB connection
│   │       └── database.js
│   ├── .env                   # Never committed
│   ├── .env.example           # Template
│   ├── package.json
│   └── server.js
├── Frontend/
│   ├── src/
│   │   ├── features/
│   │   │   └── auth/
│   │   │       ├── auth.context.jsx
│   │   │       ├── hooks/
│   │   │       │   └── useAuth.jsx
│   │   │       └── services/
│   │   │           └── auth.api.js
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── styles/
│   │   │   └── auth.form.scss
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
└── .gitignore
```

---

##  Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/Ri1tik/GenAI.git
cd GenAI
```

### 2. Setup Backend
```bash
cd Backend
npm install
```

Create `.env` file in `Backend/`:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_min_32_chars
GOOGLE_API_KEY=your_gemini_api_key
NODE_ENV=development
```

Start the backend:
```bash
node server.js
# or with auto-restart
nodemon server.js
```

### 3. Setup Frontend
```bash
cd Frontend
npm install
```

Create `.env` file in `Frontend/`:
```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:
```bash
npm run dev
```

### 4. Open in browser
```
http://localhost:5173
```

---

##  API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login user |
| GET | `/logout` | Public | Logout & blacklist token |
| GET | `/getMe` | Private | Get current user info |

### AI Routes — `/api/ai`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/analyze-resume` | Private | Analyze resume against job description and detect skill gaps |
| POST | `/generate-questions` | Private | Generate role-specific technical and behavioural interview questions |
| POST | `/generate-prep-plan` | Private | Generate a personalized preparation roadmap based on detected skill gaps |
| POST | `/generate-resume` | Private | Generate an ATS-optimized resume tailored to the job description |
| POST | `/generate-mock-interview` | Private | Generate a mock interview session with structured questions |

---

##  Security Features

-  JWT stored in **httpOnly cookies** (not localStorage)
-  Token **blacklisting on logout** prevents session reuse
-  Passwords hashed with **bcrypt** (salt rounds: 10)
-  Protected routes via **Express middleware**
-  CORS configured with **credentials: true**
-  Environment variables validated on startup

---

##  Roadmap

- [x] Project setup & DB connection
- [x] User authentication (Register, Login, Logout)
- [x] JWT middleware & token blacklisting
- [x] React frontend with Auth context
- [x] Resume upload & parsing
- [x] Job description input
- [x] Gemini AI skill gap detection
- [x] Interview question generation
- [x] Personalized prep plan UI
- [ ] ATS resume generation with Puppeteer
- [ ] Dashboard with progress tracking

---

##  Author

**Ritik Roshan Yadav**
-  B.Tech CSE — NIT Rourkela (CGPA: 9.03)
-  GitHub: [@Ri1tik](https://github.com/Ri1tik)
-  ritik.r.yadav0001@gmail.com

---

##  License

This project is for educational and portfolio purposes.
