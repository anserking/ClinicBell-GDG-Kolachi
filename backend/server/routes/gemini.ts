import { Router } from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const router = Router();

// Initialize Gemini API dynamically per request or global instance
const getAiInstance = () => {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

// AI Route: Parse doctor note/dictation into structured clinical record & WhatsApp message
router.post('/parse-note', async (req, res) => {
  try {
    const { noteText, patientName, previousDiagnosis } = req.body;

    if (!noteText || typeof noteText !== 'string') {
      return res.status(400).json({ error: 'noteText is required' });
    }

    const ai = getAiInstance();

    if (!ai) {
      // Fallback structuring if API key is not set
      return res.json({
        diagnosis: 'General Examination',
        prescription: noteText,
        advice: 'Take medications as directed and stay hydrated.',
        whatsappMessage: `Assalam-o-Alaikum ${patientName || 'Patient'}, this is GDGDemo Hospital following up on your visit today. How are you feeling now? Please let us know if you need any assistance.`
      });
    }

    const prompt = `You are a clinical AI assistant for a medical doctor at GDGDemo Hospital in Karachi, Pakistan.
Analyze the following raw doctor note/dictation for patient "${patientName || 'Patient'}":
"${noteText}"

${previousDiagnosis ? `Patient history notes: ${previousDiagnosis}` : ''}

Extract and format into clean structured data:
1. Diagnosis: Short, clear medical condition (e.g. "Acute Viral Bronchitis")
2. Prescription: Structured medication list with dosage, frequency (e.g. Panadol 500mg 1-1-1 x 3 days)
3. Advice: Simple patient instructions
4. WhatsApp Follow-up Message: A warm, polite, professional follow-up check-in message in respectful Urdu/English mix (e.g., beginning with "Assalam-o-Alaikum...") asking about their recovery and offering help.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { type: Type.STRING, description: 'Medical diagnosis' },
            prescription: { type: Type.STRING, description: 'Medication list with dosage and frequency' },
            advice: { type: Type.STRING, description: 'Patient care instructions' },
            whatsappMessage: { type: Type.STRING, description: 'Polite Urdu/English WhatsApp check-in message' }
          },
          required: ['diagnosis', 'prescription', 'whatsappMessage']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      diagnosis: parsed.diagnosis || 'Clinical Diagnosis',
      prescription: parsed.prescription || noteText,
      advice: parsed.advice || 'Follow prescription as advised.',
      whatsappMessage:
        parsed.whatsappMessage ||
        `Assalam-o-Alaikum ${patientName || 'Patient'}, this is GDGDemo Hospital. Hope you are recovering well since your visit.`
    });
  } catch (error: any) {
    console.error('Error parsing note with Gemini:', error);
    return res.status(500).json({
      error: 'Failed to process note via AI',
      details: error?.message || 'Unknown error'
    });
  }
});

// AI Vision Route: Decipher Handwritten Doctor Prescription Image (Multimodal OCR)
router.post('/scan-prescription', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'imageBase64 string is required' });
    }

    const ai = getAiInstance();

    if (!ai) {
      return res.json({
        diagnosis: 'Deciphered Doctor Handwritten Note',
        prescription: '1. Tab Paracetamol 500mg — (1-1-1) After meals x 3 days\n2. Syr Hydryllin — 2 tsp thrice daily x 5 days',
        advice: 'Rest and increase fluid intake.',
        medicines: [
          { name: 'Tab Paracetamol 500mg', frequency: '1-1-1', duration: '3 days', instructions: 'After meals' },
          { name: 'Syr Hydryllin', frequency: '1-1-1', duration: '5 days', instructions: 'After meals' }
        ]
      });
    }

    // Strip base64 prefix if present
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const visionPrompt = `You are a medical OCR specialist trained in deciphering challenging, messy handwritten doctor prescriptions and clinical shorthand notes.
Examine this prescription image carefully. Extract and decipher all handwritten patient details, medical diagnosis, and prescribed medications.

Format response into clean JSON with:
1. diagnosis: Deciphered medical condition (e.g., "Acute Bronchitis & Pharyngitis")
2. prescription: Formatted medication list (e.g., "1. Tab Panadol 500mg (1-1-1) after meals x 3 days")
3. advice: Care instructions
4. medicines: An array of structured medicine items with fields:
   - name: Medicine name and strength
   - frequency: Dose timing (e.g. "1-1-1", "1-0-1", "PRN")
   - duration: Days (e.g. "3 days", "5 days")
   - instructions: Timings (e.g. "After meals", "At bedtime")`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            mimeType,
            data: cleanBase64
          }
        },
        visionPrompt
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnosis: { type: Type.STRING },
            prescription: { type: Type.STRING },
            advice: { type: Type.STRING },
            medicines: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  frequency: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  instructions: { type: Type.STRING }
                },
                required: ['name', 'frequency', 'duration', 'instructions']
              }
            }
          },
          required: ['diagnosis', 'prescription', 'medicines']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error scanning prescription image with Gemini Vision:', error);
    return res.status(500).json({
      error: 'Failed to decipher handwritten prescription image',
      details: error?.message || 'Unknown error'
    });
  }
});

export default router;
