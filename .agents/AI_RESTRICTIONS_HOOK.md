# ClinicBell — AI Restrictions & Guardrails Hook

> This file defines the **rules, restrictions, and hard boundaries** that govern what
> the AI (Gemini) can and cannot do in this application.
> These are the guardrails that MUST be enforced in all AI-related features,
> prompts, server routes, and future integrations.

---

## PURPOSE

This project handles real patient medical data. Even in a hackathon MVP,
we must define clear boundaries so the AI behaves responsibly,
does not hallucinate dangerous clinical advice,
and does not violate user privacy.

---

## SECTION 1 — What AI CANNOT Do (Hard Restrictions)

### 1.1 No Autonomous Medical Decisions
The AI MUST NOT:
- Diagnose a condition on its own without doctor input
- Recommend a specific medication dosage without the doctor's raw note as input
- Override or correct a doctor's clinical judgment
- Suggest stopping or changing a current medication regimen

The AI can ONLY structure/format what the doctor has already dictated.
It is a medical scribe, NOT a clinician.

### 1.2 No Direct Patient Communication
The AI MUST NOT:
- Send messages to patients directly (no automated background send)
- Access or modify patient phone numbers
- Open WhatsApp autonomously without doctor confirmation
- Generate a WhatsApp message and send it without the doctor reviewing it first

All WhatsApp messages require a human (doctor) to click the Send button.

### 1.3 No Fabrication of Clinical Data
The AI MUST NOT:
- Invent a diagnosis not derived from the doctor's input note
- Add medications not mentioned in the doctor's dictation
- Create a visit record without explicit "Save to Patient Record" action by the doctor
- Fill in patient history fields (age, gender, conditions) without doctor/receptionist input

### 1.4 No PII in Prompts Beyond Necessary Context
When calling Gemini, the system MUST NOT send:
- Patient date of birth or national ID
- Patient full address or home location
- Payment or insurance information
- Any information beyond: note text, patient first name, and previous diagnosis summary

Currently allowed in prompts (see server.ts):
```
noteText, patientName, previousDiagnosis (text only)
```

### 1.5 No Unsolicited Mental Health Assessments
The AI MUST NOT:
- Automatically flag or diagnose mental health conditions (depression, anxiety)
- Add psychological labels to patient records
- Generate messages that comment on a patient's mental state unless explicitly in doctor's note

### 1.6 No Autonomous Follow-up Scheduling
The AI MUST NOT:
- Automatically schedule a follow-up without doctor setting the delay
- Change the follow-up delay without doctor's confirmation in the UI
- Send bulk messages to multiple patients without individual doctor review

### 1.7 No Internet Access or External Data Fetching
The AI (Gemini) is called server-side only.
The AI MUST NOT be given tools/functions to:
- Search the internet for drug information
- Access external medical databases (DrugBank, RxNorm, etc.)
- Look up patient records from external systems

All context passed to Gemini must come from within the app's own data.

### 1.8 No Storage of Raw AI Prompts Containing Patient Data
The server MUST NOT:
- Log the full prompt text to persistent storage
- Store Gemini API responses in a database with identifiable patient info attached
- Cache AI-generated prescriptions server-side beyond the request lifecycle

(This restriction will apply when a database is added.)

---

## SECTION 2 — What AI CAN Do (Permitted Use Cases)

### 2.1 Structure Doctor Dictation (Primary Use Case)
PERMITTED: Take raw doctor note/dictation as input and return:
- Cleaned diagnosis label
- Structured prescription (medication + dosage + frequency)
- Patient care advice
- WhatsApp follow-up message draft

### 2.2 Generate WhatsApp Message Templates
PERMITTED: Generate a polite, bilingual Urdu/English follow-up message
based on the diagnosis and patient name provided by the doctor.
The message is a DRAFT — doctor must review and click Send.

### 2.3 Format Prescription Output
PERMITTED: Convert freeform prescription text into a structured list format
(e.g. "augmentin 625 twice daily 5 days" -> "Augmentin 625mg 1-0-1 x 5 days")

### 2.4 Summarize Visit History (Planned Feature)
PERMITTED (future): Summarize the patient's visit history into a 2-3 sentence
clinical summary to assist the doctor in reviewing returning patients.

### 2.5 Image-Based Prescription Parsing (Planned Feature)
PERMITTED (future): Accept an uploaded image of a handwritten prescription or
lab report and extract structured text. Still requires doctor review before saving.

---

## SECTION 3 — Prompt Engineering Rules

All Gemini prompts MUST follow these rules:

### Rule P1: Always Set Context as Clinical Scribe
Every system prompt MUST include:
```
You are a clinical AI assistant helping a doctor structure their notes.
You are NOT providing medical advice. You are formatting what the doctor dictates.
```

### Rule P2: JSON Mode Always On
Always use:
```ts
responseMimeType: 'application/json'
responseSchema: { ... }
```
to prevent free-form text hallucination in structured fields.

### Rule P3: Diagnosis Field Must Reflect Input
The `diagnosis` field output must only contain conditions that can be reasonably
inferred from the doctor's note text. If unclear, output "Clinical Examination" as default.

### Rule P4: Prescription Must Not Exceed Input Scope
If the doctor's note mentions only one medication, the AI MUST NOT add additional
medications on its own. The prescription output scope must not exceed the doctor's input.

### Rule P5: WhatsApp Message Must Be Professional and Empathetic
WhatsApp messages MUST:
- Start with "Assalam-o-Alaikum" (respectful Pakistani greeting)
- Identify as the clinic, not as "AI" or "automated system"
- Ask about recovery status
- Offer to help if the patient needs to return
- NOT include specific medical dosage instructions (HIPAA-adjacent caution)
- NOT include any personally identifying data beyond the patient's first name

### Rule P6: Temperature Must Be Low
Use default or low temperature settings to minimize hallucination.
Do NOT use high creativity settings for medical note parsing.

---

## SECTION 4 — Data Privacy Rules

### Rule D1: No Patient Data in Frontend Logs
`console.log()` MUST NOT output patient names, phone numbers, or diagnoses
in production builds. Use `console.warn` for errors only.

### Rule D2: Phone Numbers Must Be Masked in Non-Send Contexts
When displaying phone numbers in UI lists or tables, consider masking middle digits
(e.g. "+92 300 ***4567") in future versions when multi-user access is added.

### Rule D3: No Patient Data in URLs
Do NOT put patient IDs, names, or phone numbers in browser URL query parameters.
Patient selection is managed via React state only (no URL routing for patient records).

### Rule D4: WhatsApp Link Must Not Be Stored
The wa.me URL with encoded patient message MUST NOT be stored in any log or database.
It is generated in-memory and opened via `window.open()` only.

---

## SECTION 5 — Future AI Feature Restrictions (Pre-emptive)

### If adding AI-generated appointment reminders:
- Doctor must set the schedule (day + time), AI only generates the message text
- AI cannot independently decide when to send a reminder
- Bulk sending requires a per-clinic admin approval step

### If adding PCOS/Women's Health AI Module:
- AI can suggest tracking fields (cycle days, symptoms) for doctor review
- AI CANNOT diagnose PCOS or PCOD — these require lab tests + clinical judgment
- AI-generated content for women's health must be reviewed by a medical professional
  before deploying to production

### If adding medication interaction checking:
- Only use verified medical databases (RxNorm, OpenFDA) as data sources
- Never use AI's parametric knowledge alone for drug interaction warnings
- Always show a disclaimer: "Consult a pharmacist or physician for drug interaction advice"

### If adding lab report parsing (image AI):
- Lab reference ranges must come from a verified static dataset, not AI-generated
- AI output from lab image must be labeled "AI-extracted, verify original document"
- Raw lab image MUST NOT be stored without explicit patient consent mechanism

---

## SECTION 6 — Enforcement Checklist

Before shipping any new AI feature, verify:

- [ ] AI cannot act without explicit doctor confirmation
- [ ] Prompt does not include unnecessary PII (beyond name + note text)
- [ ] JSON schema enforces output structure (no freeform hallucination)
- [ ] Fallback exists when GEMINI_API_KEY is missing
- [ ] Error handling catches and gracefully recovers from Gemini API failures
- [ ] WhatsApp send requires manual doctor click (no auto-send)
- [ ] No patient data is logged to console or persistent logs
- [ ] AI-generated content is clearly labeled in UI as "AI-suggested"
- [ ] Doctor can edit AI output before it is saved to patient record
