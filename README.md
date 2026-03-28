# 🚀 TalentBridge v2.0 — Modern Talent Acquisition Ecosystem

TalentBridge is an enterprise-grade, full-stack Job Portal built to redefine the hiring experience for the high-end professional market. Featuring a clinical **"Vibrant Black"** design system and AI-integrated career tools, it provides a seamless bridge between elite talent and leading employers.

---

## ✨ Features

### 👤 For Job Seekers
- **Linear Job Discovery:** Single-line horizontal search bar (proportioned 60/25/15) for surgical precision.
- **Vibrant Identity Profile:** High-definition identity module with real-time profile strength diagnostics.
- **Application Tracking:** Real-time visibility into your professional journey (Pending, Shortlisted, Rejected).
- **AI Career Assistant:** Instant interview prep and resume optimization powered by **Gemini AI**.

### 💼 For Employers
- **Recruiter Console:** High-density candidates' review boards with medical-grade data visibility.
- **Dynamic Job Deployment:** Deploy mission-critical roles with nested requirement matrices.
- **Identity Sync:** Clinical professional branding for corporate ventures.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite), Tailwind CSS, Lucide-React |
| **Backend** | Node.js, Express.js, JWT Authentication |
| **Database** | MongoDB Atlas (Cloud NoSQL) |
| **Cloud Services** | Cloudinary (Resumes), OpenRouter (Gemini AI) |

---

## 🏗️ Installation & Setup

### 1. Repository Synchronization
```bash
git clone https://github.com/Lerner-11052025-20/JobSeeking-Portal.git
cd JobSeeking-Portal
```

### 2. Backend Environment (Production: Render)
- **Production URL:** `https://talentbridge-backend-ar54.onrender.com`
- **Root Directory:** `backend`

Create a `.env` file in the `backend` directory:
```env
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_secret
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
OPENROUTER_API_KEY=your_gemini_key
CORS_ORIGIN=https://talentbridge-frontend.onrender.com (Change to your frontend)
PORT=10000
```
```bash
cd backend
npm install
npm start
```

### 3. Frontend Environment (Production: Render)
- **Root Directory:** `frontend`
- **Publish Directory:** `dist`

Create a `.env` file in the `frontend` directory:
```env
VITE_API_BASE_URL=https://talentbridge-backend-ar54.onrender.com/api
```
```bash
cd frontend
npm install
npm run dev
```

---

## 🎨 Design Philosophy: "Vibrant Black"
The platform utilizes a surgical **Signature Black** palette (`#08070B`) accented with **Vibrant Purple** architectural strokes (`brand-purple/35`). This creates a high-contrast, premium workspace that prioritizes information density and professional focus.

---

## 🚀 Deployment (Render)

### Backend (Web Service)
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`

### Frontend (Static Site)
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

---

## 📜 Documentation
Full technical documentation covering system architecture, database schemas, and UI/UX decisions is available in the **[Technical Documentation](./talentbridge_v2_documentation.md.resolved)** module.

THANK YOU....

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

---
**Developed with surgical precision by Deep S.**
