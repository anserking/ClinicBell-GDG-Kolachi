import { Router } from 'express';

const router = Router();

// Helper to call OpenRouter API with verified OpenRouter model IDs
const callOpenRouter = async (messages: any[]): Promise<any | null> => {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY || '';
  if (!apiKey || apiKey === 'your_google_gemini_api_key_here') {
    console.warn('[OpenRouter API] No API Key provided in environment variables.');
    return null;
  }

  // Active verified OpenRouter model IDs
  const candidateModels = [
    'google/gemini-3.6-flash',
    'google/gemini-3.5-flash-lite',
    'google/gemini-2.5-flash',
    'openrouter/auto'
  ];

  for (const model of candidateModels) {
    try {
      console.log(`[OpenRouter API] Calling OpenRouter with model ${model}...`);
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://clinicbell.netlify.app',
          'X-Title': 'ClinicBell'
        },
        body: JSON.stringify({
          model,
          messages,
          response_format: { type: 'json_object' }
        })
      });

      if (res.ok) {
        const json = await res.json();
        const contentStr = json?.choices?.[0]?.message?.content || '{}';
        try {
          return JSON.parse(contentStr);
        } catch (e) {
          console.warn('[OpenRouter API] Response content was string, not JSON:', contentStr);
          return { prescription: contentStr, text: contentStr };
        }
      } else {
        const errText = await res.text();
        console.warn(`[OpenRouter API] Model ${model} returned HTTP ${res.status}: ${errText}. Trying fallback model...`);
      }
    } catch (err: any) {
      console.warn(`[OpenRouter API] Exception calling ${model}:`, err?.message || err);
    }
  }

  console.error('[OpenRouter API] All candidate models failed to return a response.');
  return null;
};

// GET Route handlers to prevent 404/Cannot GET errors in browser testing
router.get('/parse-note', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'ClinicBell AI Note Parsing API',
    usage: 'Send HTTP POST with JSON body { "noteText": "..." }'
  });
});

router.get('/scan-prescription', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'ClinicBell Gemini Vision OCR API',
    usage: 'Send HTTP POST with JSON body { "imageBase64": "data:image/jpeg;base64,..." }'
  });
});

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
      return res.json({
        diagnosis: 'Clinical Examination',
        prescription: noteText,
        advice: 'Take medications as directed.',
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
    return res.json({
      diagnosis: 'Clinical Examination',
      prescription: req.body?.noteText || 'Prescription recorded.',
      advice: 'Follow care instructions.',
      whatsappMessage: `Assalam-o-Alaikum ${req.body?.patientName || 'Patient'}, this is GDGDemo Hospital following up on your visit today.`
    });
  }
});

// AI Vision Route: Decipher Handwritten Doctor Prescription Image (Multimodal OCR)
router.post('/scan-prescription', async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'imageBase64 string is required' });
    }

    // Ensure intact Data URI format
    const fullImageDataUri = imageBase64.startsWith('data:')
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`;

    const visionPrompt = `You are an expert medical OCR specialist trained in deciphering handwritten doctor notes, prescriptions, and medical slips.
Examine this image carefully. Transcribe and decipher all handwritten patient details, medical diagnosis, and prescribed medications.

Format response into valid JSON with keys:
{
  "diagnosis": "Deciphered medical condition or main text read from image",
  "prescription": "Formatted list of prescribed medications or deciphered text read from image",
  "advice": "General patient advice or care instructions"
}`;

    const parsed = await callOpenRouter([
      {
        role: 'user',
        content: [
          { type: 'text', text: visionPrompt },
          {
            type: 'image_url',
            image_url: {
              url: fullImageDataUri
            }
          }
        ]
      }
    ]);

    if (!parsed) {
      return res.json({
        diagnosis: 'Prescription OCR Image Read',
        prescription: 'Deciphered Image Content:\n1. Check OPENROUTER_API_KEY environment variable on Render backend to enable live AI vision OCR.',
        advice: 'Verify OPENROUTER_API_KEY setting.'
      });
    }

    return res.json({
      diagnosis: parsed.diagnosis || 'Prescription OCR Image Read',
      prescription: parsed.prescription || parsed.text || 'Deciphered text from image.',
      advice: parsed.advice || 'Follow instructions on prescription.'
    });
  } catch (error: any) {
    console.error('Error scanning prescription image with OpenRouter Gemini Vision:', error);
    return res.json({
      diagnosis: 'Prescription OCR Processing Error',
      prescription: 'Unable to process image. Please ensure the image is clear and try again.',
      advice: 'Retake photo if needed.'
    });
  }
});

export default router;
