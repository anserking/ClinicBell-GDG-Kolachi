# 🔔 ClinicBell — Next-Gen AI Healthcare Management & Smart Prescription Platform

<div align="center">
  <img width="1200" height="475" alt="ClinicBell Banner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

<div align="center">

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs)
![Express](https://img.shields.io/badge/Express-4.21-000000?style=for-the-badge&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-4169E1?style=for-the-badge&logo=postgresql)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google)
![PWA](https://img.shields.io/badge/PWA-Desktop_%26_Mobile-5A0FC8?style=for-the-badge&logo=pwa)

</div>

---

## 🌟 Project Evolution & Journey

ClinicBell was conceived and built through two key phases of Google's AI developer ecosystem:

1. **Google AI Studio (Concept & Prompt Prototyping)**:
   - Initialized using **Google AI Studio** to engineer and fine-tune multimodal prompts for deciphering challenging handwritten doctor prescriptions and structuring raw clinical dictations.

2. **Google DeepMind Antigravity AI (Full Codebase Curation)**:
   - Architecture, frontend glassmorphism design system, Node.js + Neon PostgreSQL backend, role-based security hardening, and Progressive Web App (PWA) capabilities were curated and built with **Google DeepMind Antigravity AI**, Google's agentic pair-programming assistant.

---

## 🚀 Built with Google & Gemini AI Technologies

ClinicBell integrates Google technologies to automate healthcare workflows:

* **Google Gemini 2.5 / 3.6 / 3.5 Flash Multimodal Vision AI**:
  * Powers the **Handwritten Doctor Prescription OCR Scanner**.
  * Deciphers faint, messy handwritten doctor prescription slips and extracts medicine names, daily dose counts, timings, treatment duration, and clinical reasons into structured medical records.
* **Google Gemini AI Clinical Restructurer**:
  * Transforms raw, unstructured doctor voice dictations into standard medical prescription orders and polite WhatsApp follow-up check-in messages in a respectful Urdu/English mix.
* **Google Web Speech API**:
  * Native browser-level speech-to-text dictation engine operating on Desktop and installed Mobile PWAs with zero latency.
* **Google Fonts**:
  * Utilizes `Outfit`, `Inter`, `Playfair Display`, and `JetBrains Mono` for a modern, glassmorphic UI.

---

## ⚡ Key Core Features

### 1. 📸 Handwritten Doctor Prescription OCR Image Scanner
- Snap a photo or upload an image of a handwritten prescription slip.
- **Gemini Vision AI** deciphers handwritten doctor shorthand and extracts:
  - **Diagnosis & Primary Symptoms** (*e.g., Acute Pharyngitis & Pyrexia*)
  - **Medication Name & Strength** (*e.g., Tab Paracetamol 500mg*)
  - **Doses Per Day & Daily Frequency** (*e.g., 3 times daily (1-1-1)*)
  - **Timings & Meal Instructions** (*e.g., After meals, At bedtime*)
  - **Duration** (*e.g., 3 days, 5 days*)
  - **Clinical Reason** (*e.g., For fever & pain relief*)

### 2. 🎙️ Unified Voice Dictation & 100% Editable Textarea
- Speak naturally into your microphone on Desktop or Mobile PWA.
- Voice dictation streams live into an **editable text box**, allowing doctors to click anywhere to edit, backspace, or type freely.
- One-click **✨ Gemini Auto-Structure Rx** formats raw dictation into standard medical orders.

### 3. 💬 Automated WhatsApp Patient Recovery & Follow-up Log
- Tracks patient recovery schedules (3 days, 1 week, 2 weeks).
- Features voice-dictated and AI-restructured WhatsApp check-in messages (*"Assalam-o-Alaikum..."*).
- One-click direct launch into WhatsApp Web / Mobile app.

### 4. 🔒 100% Live Cloud Database & Role-Based Security (RBAC)
- Powered by **Neon Cloud PostgreSQL** (zero static mock arrays).
- Role-based interface isolation:
  - **Admin**: Multi-hospital management, doctor/customer registrations, system oversight.
  - **Doctor**: Todays queue, patient drawers, voice dictation, OCR prescription scanning.
  - **Customer / Patient**: Private personal medical history, past prescriptions, active meds, and upcoming follow-ups.
- **Security Hardened**: Generic authentication responses prevent account enumeration and role exposure attacks.

### 5. 📱 Desktop & Mobile Progressive Web App (PWA)
- Standalone app installation on Windows, macOS, Linux, Android, and iOS.
- Persistent top **Install Now** prompt bar on login and dashboard views.

---

## 🛠️ Architecture & Tech Stack

```mermaid
graph TD
    User[Doctor / Patient / Admin] -->|PWA / Web Browser| Frontend[React 18 + Vite + TailwindCSS]
    Frontend -->|Web Speech API| NativeMic[Browser Speech Dictation]
    Frontend -->|REST API Requests| Backend[Node.js + Express API]
    Backend -->|Live SQL Queries| Database[(Neon Cloud PostgreSQL)]
    Backend -->|OpenRouter API / Gemini SDK| GeminiAI[Google Gemini 2.5 Flash Multimodal Vision AI]
```

* **Frontend**: React 18, Vite, TypeScript, TailwindCSS, Lucide Icons, Web Speech API, PWA Service Worker.
* **Backend**: Node.js, Express, ES Modules, JWT Authentication, node-postgres (`pg`).
* **Database**: Neon Cloud PostgreSQL (Pooled SSL Serverless DB).
* **AI Service**: Google Gemini AI (`google/gemini-3.6-flash`, `google/gemini-3.5-flash-lite`, `google/gemini-2.5-flash`) via `@google/genai` and OpenRouter API.

---

## 💻 Local Development Quickstart

### Prerequisites
* **Node.js**: v18.x or higher
* **npm**: v9.x or higher

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/anserking/ClinicBell-GDG-Kolachi.git
cd ClinicBell-GDG-Kolachi
npm run setup
```

### 2. Configure Environment Variables

Create `backend/.env`:
```env
PORT=3000
DATABASE_URL="postgresql://neondb_owner:npg_W5pKDlqQ1GjR@ep-dark-shadow-ax2anau5-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require"
OPENROUTER_API_KEY="sk-or-v1-your-openrouter-key-here"
GEMINI_API_KEY="your-gemini-api-key-here"
JWT_SECRET="clinicbell-secret-key-24h"
FRONTEND_URL="http://localhost:5173"
```

Create `frontend/.env`:
```env
VITE_API_BASE_URL="http://localhost:3000"
```

### 3. Seed Neon Cloud PostgreSQL Database
Populate PostgreSQL database with sample hospital node `hosp-gdg-01`, 3 doctors, 5 customers, clinical visits, and follow-ups:
```bash
npx tsx backend/scripts/seed.ts
```

### 4. Run Application Locally
```bash
# Start backend server & frontend dev server concurrently
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Database Schema Summary

ClinicBell runs on 5 core PostgreSQL tables:
- **`hospitals`**: `(id, name, code)`
- **`users`**: `(id, cnic, name, phone, role, hospital_id, password_hash, specialty, age, gender)`
- **`patients`**: `(id, user_id, hospital_id, cnic, name, phone, age, gender, status, note)`
- **`visits`**: `(id, patient_id, doctor_id, diagnosis, prescription, raw_note, visit_date)`
- **`followups`**: `(id, patient_id, visit_id, hospital_id, send_date, status, delay, custom_message)`

---

## 🚀 Live Deployments

* **Frontend (Netlify)**: [https://clinicbell.netlify.app](https://clinicbell.netlify.app)
* **Backend (Render)**: [https://clinicbell-backend-4ulw.onrender.com](https://clinicbell-backend-4ulw.onrender.com)

---

## 📄 License & Acknowledgments

Built for **GDG Kolachi AI Seekho Builders Day**.  
Special thanks to **Google AI Studio** and **Google DeepMind Antigravity AI** for powering the intelligence behind ClinicBell.
