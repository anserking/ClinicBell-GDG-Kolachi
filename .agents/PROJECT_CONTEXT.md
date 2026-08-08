# ClinicBell — Project Context

> **App Name:** Sehat Loop (powered by ClinicBell)
> **Event:** GDG Kolachi Hackathon
> **Build Time:** 1 Day
> **Status:** MVP in progress

---

## 1. Problem Statement

Clinics and hospitals in Pakistan — especially small general practices and private clinics —
operate on **paper-based or zero-system** patient management:

- Patient history is recorded in physical register books or loose paper
- Doctors have no quick access to past prescriptions or visit history
- Patients frequently **miss follow-up appointments** and medication timings
- No automated communication channel between doctor and patient post-visit
- Women's health (PCOS, PCOD, postpartum) cases especially lack structured follow-up
- Family medical history and hospital visit logs are scattered or lost

---

## 2. Solution

**Sehat Loop** is a lightweight, AI-powered clinic management system designed specifically
for solo GPs, private clinics, and small/medium hospitals in Pakistan.

### Core Workflow:
1. **Doctor checks in a patient** -> NewPatientModal captures name, phone, age, gender, complaint
2. **Patient appears in Today's Queue** -> prescription-slip styled cards on dashboard
3. **Doctor opens PatientDrawer** -> sees full medical history timeline
4. **Doctor dictates or types the note** -> voice or text input
5. **Gemini AI structures the note** -> formats diagnosis, prescription, WhatsApp follow-up message
6. **Doctor saves to patient record** -> visit added to history timeline
7. **WhatsApp follow-up is scheduled** -> message sent via wa.me deep link at configured delay
8. **Follow-ups tracked in Followups Log** -> filtered by due/sent status

---

## 3. Business Canvas (Summary)

### Problem
- Paper-based records
- Missed appointments and medication timings
- No structured patient follow-up
- Time-consuming manual data entry for doctors

### Solution
- AI voice/text/image data entry (Gemini)
- Digital patient medical records
- Automated WhatsApp follow-up messages
- Women's health section (PCOS/PCOD tracking) — planned
- Family medical history — planned

### Unique Value Proposition
- First AI-assisted clinic tool designed for Karachi/Pakistan GPs
- Works entirely on WhatsApp — no patient app installation required
- Multi-modal input: voice dictation, text, image upload — planned
- Bilingual (Urdu + English) AI output

### Customer Segments
- General Physicians (solo practice)
- Private Clinics (1-5 doctors)
- Small/Medium Hospitals
- Specialist clinics (Gynae, Paeds, Ortho)
- Women's Health Clinics

### Customer Pains
- Manual data entry wastes 20-30 min per session
- Paper records lost/damaged
- No reminder system for patients
- Poor post-visit communication

### Revenue Model
- SaaS Monthly Subscription (Doctor/Clinic plans)
- Basic: PKR 2,000/month — up to 50 patients/day
- Pro: PKR 5,000/month — unlimited + AI features
- Hospital: Custom enterprise plan

### Competitive Advantage
- vs. HealthWire / oladoc: They focus on booking, not in-clinic management
- vs. Hospital HIS systems: Those are complex, expensive, require IT team
- Our USP: Lightweight, AI-first, WhatsApp-native, affordable, bilingual

---

## 4. Current App Architecture

### Frontend (React SPA)
```
App.tsx (State Hub)
+-- Sidebar         -- Navigation + New Patient CTA
+-- Topbar          -- Search bar + date + queue count
+-- [today view]    -- PatientCard grid (Today's Queue)
+-- [patients view] -- PatientCard grid (All Records)
+-- [followups view]-- FollowupsView table
+-- [settings view] -- SettingsView form
+-- PatientDrawer   -- Slide-in panel (medical history + dictation + WhatsApp)
+-- NewPatientModal -- Patient check-in form
```

### Backend (Express + Gemini)
```
server.ts
+-- GET  /api/health
+-- POST /api/gemini/parse-note  -- Gemini AI note structuring
    Vite dev server (all other routes -> SPA)
```

---

## 5. Feature Inventory

### Currently Built (MVP)
| Feature                        | Status   | Component            |
|-------------------------------|----------|----------------------|
| Patient check-in modal         | DONE     | NewPatientModal      |
| Today's queue grid view        | DONE     | App + PatientCard    |
| All patients records view      | DONE     | App + PatientCard    |
| Search patients by name/phone  | DONE     | Topbar + App         |
| Patient detail drawer          | DONE     | PatientDrawer        |
| Medical history timeline       | DONE     | PatientDrawer        |
| Voice dictation (Web Speech)   | DONE     | PatientDrawer        |
| Text note input                | DONE     | PatientDrawer        |
| Gemini AI note structuring     | DONE     | PatientDrawer + server |
| WhatsApp follow-up launch      | DONE     | App + PatientDrawer  |
| Follow-up scheduling (delay)   | DONE     | PatientDrawer        |
| Follow-ups log view + filter   | DONE     | FollowupsView        |
| Status badges (new/due/sent)   | DONE     | PatientCard          |
| Clinic settings form           | DONE     | SettingsView         |
| Mobile responsive sidebar      | DONE     | App + Sidebar        |
| Responsive grid layout         | DONE     | App                  |

### Planned / In Roadmap
| Feature                                | Priority |
|---------------------------------------|----------|
| Firebase Firestore persistence         | HIGH     |
| Image upload (prescription photo -> AI)| HIGH     |
| Patient search by diagnosis            | MEDIUM   |
| Women's health / PCOS module           | HIGH     |
| Medication reminder SMS/WhatsApp       | HIGH     |
| Analytics dashboard (visits, followups)| MEDIUM   |
| Multi-doctor / multi-clinic support    | LOW      |
| PDF prescription export                | MEDIUM   |
| Patient self-registration QR code      | LOW      |
| Urdu UI option                         | LOW      |

---

## 6. Data Flow

```
User Action
    |
    v
React State (App.tsx)
    |
    v
Component Props / Handlers
    |
    v
[If AI needed]
    |
    v
fetch('/api/gemini/parse-note')
    |
    v
Express server.ts
    |
    v
GoogleGenAI SDK -> Gemini API
    |
    v
JSON response
    |
    v
setState() update in component
    |
    v
UI re-renders
```

For WhatsApp:
```
Send button clicked
    |
    v
handleSendWhatsApp() in App.tsx
    |
    v
wa.me deep link -> WhatsApp opens with pre-filled message
    |
    v
patient.status = 'sent' (in React state)
```

---

## 7. UX Design Philosophy

- **"Torn prescription slip"** visual motif — PatientCards look like ripped paper slips
  to feel familiar to doctors used to physical prescriptions
- **Teal + WhatsApp green** colour palette — professional medical green with WhatsApp familiarity
- **Fraunces serif font** for headings — clinical, trustworthy aesthetic
- **IBM Plex Mono** for phone numbers, timestamps — tabular, accurate feel
- **Bilingual messages** — WhatsApp messages default to Urdu/English mix ("Assalam-o-Alaikum")
- **Mobile-first** — doctors often use tablets or phones between consultations

---

## 8. Target Demo Scenario

**"Dr. Ahmed Raza, Al-Noor Clinic, Karachi"**

A typical day flow to demo to judges:
1. Open app -> see patients in Today's Queue
2. Click a patient card (Sana Malik) -> PatientDrawer opens
3. Show medical history timeline with past visits
4. Click Voice Dictation -> speak a diagnosis
5. Click "Gemini Auto-Structure" -> AI formats it
6. Save to record -> visit added to timeline
7. WhatsApp follow-up auto-generated -> click Send
8. Navigate to Follow-ups view -> show scheduled + sent log
9. Navigate to Settings -> clinic config

---

## 9. Hackathon Pitch Points

1. **AI-powered, not AI-gimmicked** — Gemini actually structures real doctor notes
2. **Zero patient friction** — patients only need WhatsApp (everyone in Pakistan has it)
3. **Built for Pakistan** — Urdu greetings, +92 phone format, local clinic terminology
4. **One day build** — lean, focused, production-quality UI
5. **Real problem** — 80% of Pakistani clinics still use paper registers
6. **Revenue-ready** — SaaS model with clear tiers
