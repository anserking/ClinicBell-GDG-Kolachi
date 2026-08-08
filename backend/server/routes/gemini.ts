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
        whatsappMessage: `Assalam-o-Alaikum ${patientName || 'Patient'}, this is Al-Noor Clinic following up on your visit today. How are you feeling now? Please let us know if you need any assistance.`
      });
    }

    const prompt = `You are a clinical AI assistant for a medical doctor at Al-Noor Clinic in Karachi, Pakistan.
Analyze the following raw doctor note/dictation for patient "${patientName || 'Patient'}":
"${noteText}"

${previousDiagnosis ? `Patient history notes: ${previousDiagnosis}` : ''}

Extract and format into clean structured data:
1. Diagnosis: Short, clear medical condition (e.g. "Acute Viral Bronchitis")
2. Prescription: Structured medication list with dosage, frequency (e.g. Panadol 500mg 1-1-1 x 3 days)
3. Advice: Simple patient instructions
4. WhatsApp Follow-up Message: A warm, polite, professional follow-up check-in message in respectful Urdu/English mix (e.g., beginning with "Assalam-o-Alaikum...") asking about their recovery and offering help.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
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
        `Assalam-o-Alaikum ${patientName || 'Patient'}, this is Al-Noor Clinic. Hope you are recovering well since your visit.`
    });
  } catch (error: any) {
    console.error('Error parsing note with Gemini:', error);
    return res.status(500).json({
      error: 'Failed to process note via AI',
      details: error?.message || 'Unknown error'
    });
  }
});

export default router;
