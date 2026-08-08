---
name: clinicbell-project-skills
description: >
  Core technical skills, patterns, and conventions for the ClinicBell / Sehat Loop project.
  Triggers when working on any feature, bug fix, component, or server-side code in this
  React + Express + Gemini AI healthcare management application.
---

# ClinicBell / Sehat Loop — Project Skills

## 1. Tech Stack at a Glance

| Layer         | Technology                              | Notes                                        |
|---------------|-----------------------------------------|----------------------------------------------|
| Frontend      | React 19 + TypeScript                   | Vite SPA, functional components + hooks only |
| Styling       | TailwindCSS v4 + custom CSS vars        | CSS tokens in src/index.css                  |
| Icons         | lucide-react                            | All icons from this single library           |
| Animation     | motion (Framer Motion v12)              | Use sparingly for micro-interactions         |
| Backend       | Express 4 + tsx dev runner              | Single server.ts at project root             |
| AI            | @google/genai v2.4 (Gemini)             | Model: gemini-3.6-flash                      |
| Build         | Vite (frontend) + esbuild (server CJS)  | npm run dev runs both via tsx server.ts      |

---

## 2. Project File Structure

```
/
├── server.ts                 # Express server + Gemini API routes
├── index.html                # Vite entry point
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env.example              # GEMINI_API_KEY, APP_URL
├── src/
│   ├── main.tsx              # ReactDOM.createRoot entry
│   ├── App.tsx               # Root state + view routing
│   ├── index.css             # Design tokens + global styles
│   ├── types.ts              # Shared TypeScript interfaces
│   ├── data/
│   │   └── initialData.ts    # Seed mock patients + followups
│   └── components/
│       ├── Sidebar.tsx       # Left nav (desktop + mobile drawer)
│       ├── Topbar.tsx        # Sticky search header
│       ├── PatientCard.tsx   # Queue card — torn prescription slip motif
│       ├── PatientDrawer.tsx # Full-screen right drawer per patient
│       ├── NewPatientModal.tsx # Check-in modal
│       ├── FollowupsView.tsx # Followup log table + filter
│       └── SettingsView.tsx  # Clinic configuration form
└── .agents/
    └── skills/
        └── clinicbell-skills/
            └── SKILL.md      # This file
```

---

## 3. State Management Pattern

All state lives in App.tsx — no external store (Redux/Zustand).
Props are passed explicitly. Follow this pattern for all new features:

```tsx
// Pattern: lift state, pass handlers down as props
const [patients, setPatients] = useState<Patient[]>(initialPatients);

const handleUpdatePatient = (updated: Patient) => {
  setPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
};
```

- Do NOT introduce a global store without team discussion.
- Use useState + prop drilling for now; it is a hackathon, keep it simple.
- initialData.ts is the seed source — real persistence would require a DB (Firebase planned).

---

## 4. TypeScript Types (src/types.ts)

### Patient
```ts
interface Patient {
  id: string;           // e.g. "P-1001"
  name: string;
  phone: string;        // Pakistan format "+92 3XX XXXXXXX"
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  status: PatientStatus; // 'new' | 'due' | 'sent' | 'completed'
  note: string;          // Latest clinical note / chief complaint
  visitsCount: number;
  lastVisit: string;     // Human-readable, e.g. "Today", "2 weeks ago"
  history: VisitRecord[];
  followupEnabled?: boolean;
  followupDelay?: string; // "3 days" | "1 week" | "2 weeks" | "3 weeks"
  followupMessage?: string; // WhatsApp message text
  checkedInAt?: string;  // e.g. "09:15 AM"
}
```

### VisitRecord
```ts
interface VisitRecord {
  id: string;
  date: string;          // "08 Aug 2026"
  text: string;          // Full clinical note
  diagnosis?: string;    // Short e.g. "Seasonal Influenza"
  prescription?: string; // Medication list
  doctorName?: string;
}
```

### FollowupRecord
```ts
interface FollowupRecord {
  id: string;            // "F-2001"
  patientId: string;
  patientName: string;
  phone: string;
  diagnosisSummary: string;
  sendDate: string;      // Human-readable
  status: 'due' | 'sent' | 'scheduled' | 'cancelled';
  delay: string;
  customMessage?: string;
}
```

### ActiveView
```ts
type ActiveView = 'today' | 'patients' | 'followups' | 'settings';
```

---

## 5. Design System Tokens

All colours are defined as CSS variables in src/index.css:

| Token             | Hex       | Use                              |
|-------------------|-----------|----------------------------------|
| --bg              | #F4F7F6   | Page background                  |
| --surface         | #FFFFFF   | Card / modal background          |
| --border          | #DCE6E2   | All borders                      |
| --ink             | #142420   | Primary text                     |
| --ink-soft        | #4E6259   | Secondary text                   |
| --ink-faint       | #7C8F87   | Placeholder / label text         |
| --teal            | #0F5C56   | Primary action colour            |
| --teal-dark       | #0A413D   | Hover state for teal             |
| --teal-tint       | #E5F0EE   | Teal chip / badge background     |
| --whatsapp        | #25D366   | WhatsApp green                   |
| --whatsapp-dark   | #1DA851   | WhatsApp hover                   |
| --whatsapp-tint   | #E9FAF0   | WhatsApp badge background        |
| --amber           | #C98A2C   | Warning / "due" status           |
| --amber-tint      | #FBF1DE   | Warning badge background         |

### Typography
- Display/Headings: Fraunces (serif) — class .font-serif-display
- Body: Inter (sans-serif) — default body font
- Monospace/Tabular: IBM Plex Mono — class .font-mono-tabular

### Signature Motif
The .tear-edge CSS class renders a torn prescription-slip paper edge on PatientCards. Keep this in all card components.

---

## 6. AI Integration Pattern (Gemini)

The AI is invoked only server-side via POST /api/gemini/parse-note.

Request body:
```json
{
  "noteText": "raw doctor dictation string",
  "patientName": "Sana Malik",
  "previousDiagnosis": "optional past history text"
}
```

Response schema (JSON-mode enforced):
```json
{
  "diagnosis": "Acute Viral Bronchitis",
  "prescription": "Augmentin 625mg b.i.d x 5 days, Panadol Extra 2 tabs t.i.d",
  "advice": "Rest, fluids, avoid cold drinks",
  "whatsappMessage": "Assalam-o-Alaikum Sana Ji..."
}
```

Fallback: If GEMINI_API_KEY is missing, the server returns a stub response so the UI never breaks.

Frontend call (PatientDrawer.tsx -> handleAiStructure):
```tsx
const response = await fetch('/api/gemini/parse-note', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ noteText, patientName, previousDiagnosis })
});
```

---

## 7. WhatsApp Integration Pattern

WhatsApp is opened via the wa.me deep link — no API key needed:

```ts
const handleSendWhatsApp = (patient: Patient, customMsg?: string) => {
  const rawPhone = patient.phone.replace(/[^0-9]/g, '');
  const cleanPhone = rawPhone.startsWith('92') ? rawPhone : `92${rawPhone.replace(/^0/, '')}`;
  const text = encodeURIComponent(customMsg || patient.followupMessage || defaultMsg);
  window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  // then update patient.status = 'sent'
};
```

- Always strip non-digits, then ensure Pakistan country code 92.
- Update patient status to 'sent' and matching FollowupRecord.status after send.

---

## 8. Voice Dictation Pattern

Voice input is handled in PatientDrawer.tsx using the Web Speech API:

```ts
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';
recognition.onresult = (event) => { /* update audioTranscript state */ };
recognition.start();
```

- If mic access fails (sandbox / hardware blocked), a simulated transcript is injected as fallback.
- MediaRecorder runs in parallel for future audio upload support.
- A CSS waveform visualizer uses Math.sin() animation during recording.

---

## 9. Patient ID & Follow-up ID Conventions

- Patient IDs: P-XXXX (random 4-digit, e.g. P-1001)
- Visit IDs: v-XXXX (last 4 digits of Date.now())
- Follow-up IDs: F-XXXX (last 4 digits of Date.now())

---

## 10. Status Badge Colour Map

| Status      | Background  | Text      | Meaning                    |
|-------------|-------------|-----------|----------------------------|
| new         | #E5F0EE    | #0A413D   | First visit / checked in   |
| due         | #FBF1DE    | #C98A2C   | Follow-up overdue/pending  |
| sent        | #E9FAF0    | #1DA851   | WhatsApp message sent      |
| completed   | gray-100   | gray-600   | Case closed                |

---

## 11. Component Patterns to Follow

- All components are named exports (not default exports), except App.tsx.
- Pass event handlers as on* props (e.g. onSelect, onClose, onUpdatePatient).
- Use React.FC<Props> typing for all components.
- Avoid useContext and useReducer — keep it simple for the hackathon.
- Mobile responsiveness: use md: breakpoint for desktop layout switch.
- Mobile sidebar is a conditional overlay with isMobileSidebarOpen state in App.

---

## 12. Server Architecture

server.ts (Express) runs both API and Vite dev middleware on port 3000:

```
GET  /api/health             -> health check
POST /api/gemini/parse-note  -> Gemini AI note parser
*    (all other routes)      -> Vite SPA / static files
```

- Dev: npm run dev runs tsx server.ts (hot-reload via Vite middleware)
- Prod: Vite builds to dist/, server compiled to dist/server.cjs via esbuild

---

## 13. Adding a New View

1. Add the new view key to ActiveView type in types.ts
2. Add navigation item in Sidebar.tsx
3. Create src/components/NewView.tsx
4. Add conditional render block in App.tsx main content area
5. Pass required state/handlers as props

---

## 14. Adding a New API Route

1. Add the route handler in server.ts before the Vite middleware catch-all
2. Use async/await with try/catch
3. Always include a fallback response when GEMINI_API_KEY is absent
4. Call from frontend using fetch('/api/your-route', ...)
