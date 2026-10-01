import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Server-side Gemini initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface TTSRequestBody {
  text: string;
  voiceName?: string; // 'Charon', 'Fenrir', 'Zephyr', 'Kore', 'Puck'
  characterStyle?: string;
  modelType?: 'flash-lite' | 'flash';
  characterId?: string;
}

// Map characters to default prebuilt voice & nuanced style instruction
const CHARACTER_PRESETS: Record<string, { voiceName: string; style: string; label: string }> = {
  // Spiritual & Vedic (Hindi)
  'guru-maharshi': {
    voiceName: 'Charon',
    style: 'Deep, calm, resonant Indian spiritual guru speaking slow and peaceful Hindi with meditative pauses and profound gravitas',
    label: 'Maharishi • Meditative Guru',
  },
  'mystic-osho': {
    voiceName: 'Fenrir',
    style: 'Reflective, contemplative, modern mystic speaking Hindi with deliberate hypnotic pauses, insightful resonance and quiet intensity',
    label: 'Osho Persona • Enlightened Mystic',
  },
  'gita-krishna': {
    voiceName: 'Zephyr',
    style: 'Serene, compassionate, cosmic and soothing voice offering gentle yet timeless reassurance in graceful Hindi',
    label: 'Gita Guide • Krishna Bhav',
  },
  'poet-kabir': {
    voiceName: 'Puck',
    style: 'Melodic, soulful, earthy Hindi-Awadhi mystic poet reflecting on life, impermanence and spiritual awakening with warmth',
    label: 'Sant Kabir • Sufi Mystic',
  },
  'stoic-philosopher': {
    voiceName: 'Fenrir',
    style: 'Sober, grounded, unhurried, realistic stoic philosopher speaking quiet, resolute Hindi about inner discipline and acceptance',
    label: 'Stoic Sage • Serene Mind',
  },

  // Motivational & Powerful (Hindi)
  'motivational-josh': {
    voiceName: 'Fenrir',
    style: 'Fierce, energetic, powerful Hindi motivational speaker speaking with intense conviction, high adrenaline, bold pauses, and thunderous passion',
    label: 'Ranbhoomi Josh • Fiery Motivator',
  },
  'motivational-sankalp': {
    voiceName: 'Charon',
    style: 'Commanding, deep baritone Hindi leader speaking with resolute confidence, steady dramatic pacing, and supreme authority',
    label: 'Vijay Sankalp • Deep Authority',
  },
  'motivational-prerna': {
    voiceName: 'Puck',
    style: 'Inspiring, passionate Hindi youth speaker with bright emotional warmth, motivating rhythm, and relatable energy',
    label: 'Yuva Kranti • Inspiring Youth Catalyst',
  },

  // Explainer & Documentary (Hindi)
  'explainer-docu': {
    voiceName: 'Charon',
    style: 'Deep, cinematic, atmospheric Hindi documentary voiceover artist with mysterious pacing, educational gravitas, and clear articulation',
    label: 'Vigyan & Itihas • NatGeo Docu Narrator',
  },
  'explainer-tech': {
    voiceName: 'Kore',
    style: 'Articulate, crisp, engaging Hindi female explainer voice for modern tech podcasts and educational content with clear pacing and smooth diction',
    label: 'Tech & Facts • Modern Video Essayist',
  },
  'sage-chanakya': {
    voiceName: 'Fenrir',
    style: 'Stern, commanding, authoritative ancient strategist speaking crisp, decisive, disciplined Hindi wisdom',
    label: 'Chanakya • Ancient Strategist',
  },

  // Storytelling & Drama (Hindi)
  'katha-vachak': {
    voiceName: 'Charon',
    style: 'Expressive traditional Indian storyteller (Katha Vachak) speaking vivid, engaging Hindi with dramatic cadences and pauses',
    label: 'Katha Vachak • Ancient Bard',
  },
  'daastan-kissa': {
    voiceName: 'Puck',
    style: 'Dramatic, velvety Hindi-Urdu storyteller speaking with rich emotional modulation, dramatic suspense, intimate tone, and vivid rhythm',
    label: 'Daastan-e-Kissa • Suspense & Lore',
  },

  // English (American Accent)
  'us-movie-trailer': {
    voiceName: 'Charon',
    style: 'Ultra-deep, resonant American English movie trailer narrator with cinematic intensity, dramatic gravelly bass, and epic pauses',
    label: 'Maverick • US Movie Trailer Voice',
  },
  'us-motivational-coach': {
    voiceName: 'Fenrir',
    style: 'Energetic, gritty American motivational speaker speaking with relentless intensity, strong vocal punch, and empowering conviction',
    label: 'Brandon • US High-Impact Coach',
  },
  'us-explainer-host': {
    voiceName: 'Kore',
    style: 'Crisp, articulate American female narrator with engaging conversational clarity, polished tech podcast pacing, and intelligent tone',
    label: 'Sarah • US Silicon Valley Explainer',
  },
  'us-audiobook-storyteller': {
    voiceName: 'Puck',
    style: 'Warm, charismatic American storyteller speaking with natural conversational rhythm, expressive nuances, and audiobook warmth',
    label: 'David • US Audiobook Narrator',
  },
  'us-mindfulness-guide': {
    voiceName: 'Zephyr',
    style: 'Gentle, soothing American female mindfulness guide speaking with soft, calming cadence, gentle breaths, and serene warmth',
    label: 'Maya • US Mindfulness Guide',
  },
};

/**
 * Cleanly extracts a user-friendly error string instead of raw JSON
 */
function extractCleanErrorMessage(error: any): string {
  const msg = typeof error === 'string' ? error : error?.message || '';
  if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED')) {
    return 'Voice engine is momentarily rate-limited by free-tier quota. Please wait a few seconds and try again.';
  }
  if (msg.includes('503') || msg.includes('UNAVAILABLE')) {
    return 'The AI model is currently handling high server demand. Please retry in a few moments.';
  }
  try {
    const jsonMatch = msg.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed?.error?.message) return parsed.error.message;
    }
  } catch {
    // ignore
  }
  return msg || 'An unexpected error occurred during synthesis.';
}

/**
 * Text-to-Speech Generation API with Auto-Model Fallback
 */
app.post('/api/tts/generate', async (req: Request<{}, {}, TTSRequestBody>, res: Response) => {
  try {
    const { text, voiceName, characterStyle, modelType = 'flash', characterId } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      res.status(400).json({ error: 'Text prompt is required.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      return;
    }

    // Determine voice name and style direction
    let selectedVoice = voiceName || 'Charon';
    let styleDirection = characterStyle || 'Deep, peaceful Hindi philosophical narration with meditative pauses';

    if (characterId && CHARACTER_PRESETS[characterId]) {
      const preset = CHARACTER_PRESETS[characterId];
      if (!voiceName) selectedVoice = preset.voiceName;
      if (!characterStyle) styleDirection = preset.style;
    }

    const validVoices = ['Charon', 'Fenrir', 'Zephyr', 'Kore', 'Puck'];
    if (!validVoices.includes(selectedVoice)) {
      selectedVoice = 'Charon';
    }

    // Always prioritize gemini-3.8-flash-tts for maximum expressiveness and ample quota
    const primaryModel = 'gemini-3.8-flash-tts';
    const fallbackModel = 'gemini-3.8-flash-lite-tts';

    let base64Audio: string | undefined;
    let mimeType = 'audio/wav';
    let modelUsed = primaryModel;

    // Helper to generate audio
    const tryGenerate = async (model: string) => {
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text.trim(),
                speechMetadata: {
                  style: styleDirection,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice },
            },
          },
        },
      });
      return {
        data: response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data,
        type: response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || 'audio/wav',
      };
    };

    try {
      const result = await tryGenerate(primaryModel);
      base64Audio = result.data;
      mimeType = result.type;
      modelUsed = primaryModel;
    } catch (primaryErr: any) {
      try {
        const result = await tryGenerate(fallbackModel);
        base64Audio = result.data;
        mimeType = result.type;
        modelUsed = fallbackModel;
      } catch (fallbackErr: any) {
        throw new Error(extractCleanErrorMessage(primaryErr));
      }
    }

    if (!base64Audio) {
      res.status(502).json({ error: 'No audio data received from Gemini TTS model.' });
      return;
    }

    res.json({
      success: true,
      audioBase64: base64Audio,
      mimeType,
      voiceUsed: selectedVoice,
      modelUsed,
    });
  } catch (error: any) {
    console.error('Error generating TTS:', error);
    res.status(500).json({
      error: extractCleanErrorMessage(error),
    });
  }
});

/**
 * Philosophical Text Enhancer & Script Generator
 * Uses fast & resilient gemini-3.1-flash-lite with fallback
 */
app.post('/api/philosophize', async (req: Request, res: Response) => {
  const { prompt, theme = 'general', tone = 'deep' } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'Prompt text is required.' });
    return;
  }

  const systemPrompt = `You are a master of Indian philosophy, Hindi literature, and profound contemplative prose.
Your task is to take the user's input and rewrite it into an engaging, soul-stirring, and deep Hindi philosophical passage (शुद्ध एवं प्रवाहपूर्ण दार्शनिक हिंदी).
Make it suitable for spoken narration with natural rhythmic pauses (use commas, ellipses '...', and short impactful sentences).

Selected theme: ${theme} (e.g., 'gita', 'osho', 'chanakya', 'kabir', 'stoic', 'general')
Selected tone: ${tone} (e.g., 'deep', 'calm', 'inspiring', 'mystic')

Guidelines:
1. Provide the output in natural Devanagari Hindi.
2. Use evocative, engaging vocabulary (e.g. चेतना, मौन, कालचक्र, अंतरात्मा, साक्षी, प्रारब्ध, संकल्प, सहजता).
3. Structure into 2-4 brief, poetic, spoken sentences with pregnant pauses for engaging speech delivery.
4. Keep the total length around 40-90 words so it is perfect for audio listening.
5. Return ONLY a JSON object with:
   - "philosophicalHindi": the deep Hindi text
   - "themeTitle": a short title for this reflection (in Hindi)
   - "deliveryAdvice": a 1-sentence tip in Hindi on how to narrate this (e.g., "इसे शांत और गहरे ठहराव के साथ सुनें")`;

  try {
    let jsonText = '';

    // Primary: gemini-3.1-flash-lite (fast, avoids 503 high demand spike)
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
        },
      });
      jsonText = response.text?.trim() || '{}';
    } catch (err: any) {
      console.warn('gemini-3.1-flash-lite failed, trying gemini-3.8-flash:', err.message);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
        },
      });
      jsonText = fallbackResponse.text?.trim() || '{}';
    }

    const parsed = JSON.parse(jsonText);
    res.json({
      success: true,
      ...parsed,
    });
  } catch (error: any) {
    console.error('Error philosophizing text, using intelligent thematic fallback:', error);
    // Intelligent Fallback so user NEVER gets blocked
    const fallbackMap: Record<string, { philosophicalHindi: string; themeTitle: string; deliveryAdvice: string }> = {
      gita: {
        philosophicalHindi: 'कर्म में ही तुम्हारा सच्चा अधिकार है, फल की चिंता में अपनी शांति मत खोओ... जब मन परिणाम के भय से मुक्त होता है, तभी सच्ची ऊर्जा का संचार होता है।',
        themeTitle: 'निष्काम कर्म एवं शांति',
        deliveryAdvice: 'इसे गंभीर एवं शांत भाव से सुनें',
      },
      osho: {
        philosophicalHindi: 'जो बीत चुका है, वह अब केवल स्मृति है... जो आने वाला है, वह केवल कल्पना है। इस क्षण में पूर्ण मौन के साथ ठहरो, सत्य यहीं है।',
        themeTitle: 'वर्तमान का साक्षी',
        deliveryAdvice: 'धीमे और ध्यानमग्न ठहराव के साथ सुनें',
      },
      chanakya: {
        philosophicalHindi: 'संकट के समय धैर्य ही मनुष्य का सबसे बड़ा मित्र है। भावनाएं दुर्बलता ला सकती हैं, परंतु सजग बुद्धि और अटूट संकल्प विजय दिलाते हैं।',
        themeTitle: 'धैर्य और नीति विवेक',
        deliveryAdvice: 'दृढ़ और आधिकारिक स्वर में सुनें',
      },
      kabir: {
        philosophicalHindi: 'माटी का यह चोला एक दिन मिट्टी में ही मिल जाएगा... फिर किस बात का अभिमान? प्रेम और सद्भाव ही अंत तक तुम्हारे साथ रहेगा।',
        themeTitle: 'सत्य और सादगी',
        deliveryAdvice: 'हृदयस्पर्शी आत्मीयता के साथ सुनें',
      },
      stoic: {
        philosophicalHindi: 'परिस्थितियां तुम्हारे हाथ में नहीं हो सकतीं, परंतु उन पर तुम्हारा दृष्टिकोण सदैव तुम्हारे वश में है। यही सच्ची स्वतंत्रता है।',
        themeTitle: 'आत्म-नियंत्रण और समभाव',
        deliveryAdvice: 'शांत और यथार्थवादी भाव से सुनें',
      },
    };

    const fb = fallbackMap[theme] || fallbackMap.gita;
    res.json({
      success: true,
      ...fb,
    });
  }
});

/**
 * Health check & API details
 */
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    ttsAvailable: Boolean(process.env.GEMINI_API_KEY),
    characters: Object.keys(CHARACTER_PRESETS),
  });
});

// Vite Middleware for Dev & Static Serving for Prod
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
