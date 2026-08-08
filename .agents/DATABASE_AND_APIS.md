# ClinicBell — Database & API Keys Reference

> This document explains every external service, database, and API key used in this project,
> what it does, why we chose it, and how it is configured.

---

## 1. GEMINI_API_KEY — Google Gemini AI

### What it is
API key for Google's Gemini generative AI API, accessed via the `@google/genai` npm SDK.

### Where it is used
- `server.ts` line 13-20: SDK initialization
- `POST /api/gemini/parse-note`: Clinical note structuring endpoint
- The frontend (`PatientDrawer.tsx`) calls this endpoint at `/api/gemini/parse-note`

### Why we chose Gemini
- **Free tier available** — critical for a hackathon
- **JSON mode / structured output** — Gemini supports `responseMimeType: 'application/json'`
  with a strict `responseSchema`, ensuring reliable, parseable output every time
- **Multilingual** — handles mixed Urdu/English doctor notes naturally
- **Low latency** — `gemini-3.6-flash` model is fast (< 2 seconds for note parsing)
- **GDG hackathon context** — Google event, Google AI = natural fit for judges

### What it does in the app
Takes raw, messy doctor dictation like:
```
"patient fever 101, cough 5 days, give augmentin 625 and panadol extra"
```
And returns a clean, structured JSON:
```json
{
  "diagnosis": "Acute Upper Respiratory Tract Infection",
  "prescription": "Augmentin 625mg 1-0-1 x 5 days, Panadol Extra 2 tabs t.i.d",
  "advice": "Rest, fluids, avoid cold drinks, recheck if fever persists > 3 days",
  "whatsappMessage": "Assalam-o-Alaikum Patient, this is Al-Noor Clinic. How is your fever and cough now after taking Augmentin? Please let us know if you need to revisit."
}
```

### Model used
`gemini-3.6-flash` — chosen for speed (flash tier) and cost-efficiency

### How to configure
1. Get key from: https://aistudio.google.com/app/apikey
2. Create `.env` file at project root (copy from `.env.example`):
   ```
   GEMINI_API_KEY="your-key-here"
   ```
3. Key is loaded via `process.env.GEMINI_API_KEY` in `server.ts`
4. In AI Studio, inject via the Secrets panel

### Fallback behavior
If `GEMINI_API_KEY` is empty/missing, the server returns a mock structured response
so the UI never crashes. This allows demo without a key.

---

## 2. WhatsApp — wa.me Deep Link (No API Key Required)

### What it is
WhatsApp's official URL scheme for launching a chat with a pre-filled message.
This is NOT the WhatsApp Business API — it is a free, key-less deep link.

### Format
```
https://wa.me/<phone_number>?text=<encoded_message>
```

### Where it is used
- `App.tsx` — `handleSendWhatsApp()` function
- `PatientDrawer.tsx` — "Send Follow-up Message via WhatsApp" button
- `FollowupsView.tsx` — WhatsApp button per follow-up row

### Why we chose this approach
- **No API key, no cost** — wa.me is free and open
- **Zero patient setup** — every patient already has WhatsApp on their phone
- **Pakistan-specific** — WhatsApp penetration in Pakistan is ~90%+ among smartphone users
- **Doctor control** — doctor reviews the message before sending (not automated background send)
- **Hackathon speed** — implemented in minutes with no backend dependency

### Phone number formatting
All Pakistani numbers are normalized to country code 92:
```ts
const rawPhone = patient.phone.replace(/[^0-9]/g, '');
const cleanPhone = rawPhone.startsWith('92') ? rawPhone : `92${rawPhone.replace(/^0/, '')}`;
```
Example: `0300-1234567` becomes `923001234567`

### Limitations (upgrade path)
The wa.me link requires the doctor to manually click "Send" inside WhatsApp.
For TRUE automated background sending, the upgrade path would be:
- **WhatsApp Business API** (Meta) — requires business verification
- **Twilio WhatsApp API** — paid, ~$0.005/message
- **Infobip / Bird (MessageBird)** — cheaper for Pakistan-local sending

---

## 3. Web Speech API — Voice Dictation (Browser Built-in, No Key)

### What it is
A browser-native API for real-time speech-to-text transcription.
Available in Chrome, Edge, Safari. No external API key required.

### Where it is used
- `PatientDrawer.tsx` — Voice Dictation input mode
- Uses `window.SpeechRecognition` or `window.webkitSpeechRecognition`

### Why we chose this
- **Free, zero-latency** — built into the browser, no API call needed
- **Continuous transcription** — `recognition.continuous = true` streams text in real-time
- **English + Urdu support** — lang set to `en-US` but recognizes common Urdu medical terms
- **Hackathon pragmatism** — gets voice dictation working in < 50 lines of code

### Configuration
```ts
recognition.lang = 'en-US';  // Change to 'ur-PK' for Urdu if needed
recognition.continuous = true;
recognition.interimResults = true;
```

### Fallback
If browser blocks microphone (sandbox environment), a simulated transcript is auto-filled
so demo still works.

### Upgrade path
For production, upgrade to:
- **Google Cloud Speech-to-Text API** — superior accuracy, Urdu support, medical vocabulary models
- **Whisper API (OpenAI)** — excellent multilingual support, upload audio files

---

## 4. No Database — React State Only (Current Status)

### Current state
All data lives in React component state (`useState` in `App.tsx`).
Seed data is in `src/data/initialData.ts`.

**This means data is LOST on page refresh.** This is acceptable for hackathon demo.

### Why no database yet
- Hackathon time constraint (1 day)
- Seed data is rich enough to demo all features
- Focus was on AI + UX, not persistence

### Planned Database: Firebase Firestore

#### Why Firebase Firestore
| Reason                  | Details                                              |
|-------------------------|------------------------------------------------------|
| Free tier               | Spark plan: 50,000 reads/day, 20,000 writes/day      |
| Realtime                | Live updates across multiple devices/doctors         |
| No backend needed       | Firebase SDK works directly from React (client SDK)  |
| Google ecosystem        | Aligns with Gemini + GDG hackathon context           |
| Auth built-in           | Firebase Auth for doctor login (email/Google SSO)    |
| File storage            | Firebase Storage for prescription image uploads      |

#### Planned collection structure
```
firestore/
├── clinics/
│   └── {clinicId}/
│       ├── name, doctorName, phone, defaultDelay, followupTemplate
│       └── patients/
│           └── {patientId}/
│               ├── name, phone, age, gender, status, note, ...
│               └── visits/
│                   └── {visitId}/
│                       └── date, text, diagnosis, prescription, doctorName
└── followups/
    └── {followupId}/
        └── patientId, patientName, phone, status, sendDate, ...
```

#### Firebase keys needed (future)
```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```
These go in `.env` and are prefixed with `VITE_` so Vite exposes them to the frontend.

---

## 5. APP_URL — Environment Variable

### What it is
The public URL where the app is hosted (used for self-referential links or OAuth callbacks).

### Where it comes from
- In AI Studio: automatically injected as the Cloud Run service URL
- Locally: `http://localhost:3000`

### Current usage
Not actively used in code yet. Kept as a placeholder for future OAuth or webhook integrations.

---

## 6. Summary Table

| Service / Key        | Key Name           | Required | Free? | Purpose                          |
|----------------------|--------------------|----------|-------|----------------------------------|
| Google Gemini AI     | GEMINI_API_KEY     | YES      | YES*  | Note structuring, WhatsApp gen   |
| WhatsApp wa.me       | None               | NO       | YES   | Patient follow-up messaging      |
| Web Speech API       | None               | NO       | YES   | Voice dictation (browser native) |
| Firebase Firestore   | (planned)          | NO YET   | YES*  | Patient data persistence         |
| Firebase Auth        | (planned)          | NO YET   | YES*  | Doctor login / clinic isolation  |
| Firebase Storage     | (planned)          | NO YET   | YES*  | Prescription image uploads       |

*Free tier available with usage limits
