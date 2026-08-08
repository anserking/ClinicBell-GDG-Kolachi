import { Router } from 'express';

const router = Router();

// Helper to call OpenRouter API with google/gemini-2.0-flash-001 model
const callOpenRouter = async (messages: any[]): Promise<any | null> => {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY || '';
  if (!apiKey || apiKey === 'your_google_gemini_api_key_here') {
    return null;
  }

  console.log('[OpenRouter API] Calling OpenRouter with model google/gemini-2.0-flash-001...');
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://clinicbell.netlify.app',
      'X-Title': 'ClinicBell'
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-001',
      messages,
      response_format: { type: 'json_object' }
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error('[OpenRouter API Error]:', res.status, errText);
    throw new Error(`OpenRouter API responded with status ${res.status}: ${errText}`);
  }

  const json = await res.json();
  const contentStr = json?.choices?.[0]?.message?.content || '{}';
  try {
    return JSON.parse(contentStr);
  } catch (e) {
    console.warn('[OpenRouter API] Failed to parse JSON response content:', contentStr);
    return { text: contentStr };
  }
};

// AI Route: Parse doctor note/dictation into structured clinical record & WhatsApp message
router.post('/parse-note', async (req, res) => {
  try {
    const { noteText, patientName, previousDiagnosis } = req.body;

    if (!noteText || typeof noteText !== 'string') {
      return res.status(400).json({ error: 'noteText is required' });
    }

    const prompt = `You are a clinical AI assistant for a medical doctor at GDGDemo Hospital in Karachi, Pakistan.
Analyze the following raw doctor note/dictation for patient "${patientName || 'Patient'}":
"${noteText}"

${previousDiagnosis ? `Patient history notes: ${previousDiagnosis}` : ''}

Extract and return clean JSON with:
{
  "diagnosis": "Short medical condition (e.g. Acute Viral Bronchitis)",
  "prescription": "Structured medication list with dosage, frequency (e.g. Panadol 500mg 1-1-1 x 3 days)",
  "advice": "Simple patient care instructions",
  "whatsappMessage": "A warm, polite, professional follow-up check-in message in respectful Urdu/English mix (e.g., beginning with Assalam-o-Alaikum...) asking about recovery and offering help."
}`;

    const parsed = await callOpenRouter([
      { role: 'system', content: 'You are a professional medical AI assistant. Respond ONLY with valid JSON.' },
      { role: 'user', content: prompt }
    ]);

    if (!parsed) {
      // Fallback structuring if API key is not set
      return res.json({
        diagnosis: 'General Examination',
        prescription: noteText,
        advice: 'Take medications as directed and stay hydrated.',
        whatsappMessage: `Assalam-o-Alaikum ${patientName || 'Patient'}, this is GDGDemo Hospital following up on your visit today. How are you feeling now? Please let us know if you need any assistance.`
      });
    }

    return res.json({
      diagnosis: parsed.diagnosis || 'Clinical Diagnosis',
      prescription: parsed.prescription || noteText,
      advice: parsed.advice || 'Follow prescription as advised.',
      whatsappMessage:
        parsed.whatsappMessage ||
        `Assalam-o-Alaikum ${patientName || 'Patient'}, this is GDGDemo Hospital. Hope you are recovering well since your visit.`
    });
  } catch (error: any) {
    console.error('Error parsing note with OpenRouter Gemini:', error);
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

    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const visionPrompt = `You are a medical OCR specialist trained in deciphering challenging, messy handwritten doctor prescriptions and clinical shorthand notes.
Examine this prescription image carefully. Extract and decipher all handwritten patient details, medical diagnosis, and prescribed medications.

Format response into valid JSON with keys:
{
  "diagnosis": "Deciphered medical condition (e.g., Acute Bronchitis & Pharyngitis)",
  "prescription": "Formatted medication list (e.g., 1. Tab Panadol 500mg (1-1-1) after meals x 3 days)",
  "advice": "Care instructions",
  "medicines": [
    {
      "name": "Medicine name and strength",
      "frequency": "Dose timing (e.g. 1-1-1, 1-0-1, PRN)",
      "duration": "Days (e.g. 3 days, 5 days)",
      "instructions": "Timings (e.g. After meals, At bedtime)"
    }
  ]
}`;

    const parsed = await callOpenRouter([
      {
        role: 'user',
        content: [
          { type: 'text', text: visionPrompt },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${cleanBase64}`
            }
          }
        ]
      }
    ]);

    if (!parsed) {
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

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error scanning prescription image with OpenRouter Gemini Vision:', error);
    return res.status(500).json({
      error: 'Failed to decipher handwritten prescription image',
      details: error?.message || 'Unknown error'
    });
  }
});

export default router;
