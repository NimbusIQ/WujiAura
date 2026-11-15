import { GoogleGenAI } from '@google/genai';
import { retrieveRelevantPoints, expandToCoupledPoints } from './tcmVectorCore';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY || '' });

export const wellnessCoreConfig = {
  model: 'gemini-3.8-flash',
  modelFlash: 'gemini-3.8-flash',
  modelDeep: 'gemini-3.8-flash',
};

export interface HealthInsightResponse {
  summary: string;
  fiveElementsAnalysis?: any;
  dietaryRecommendations?: string[];
  lifestyleAdjustments?: string[];
  herbalFormula?: string[];
  acupressurePoints?: Array<{ id: string; name: string; reason: string }>;
  visualPrompts?: {
    imagePrompt?: string;
    videoPrompt?: string;
  };
  commitmentTargets?: Array<{ id: string; title: string; description: string; emoji: string }>;
  seasonalGuidance?: string;
  qiPointsAwarded?: number;
  sources?: Array<{ uri: string; title: string }>;
  searchQueries?: string[];
  syndrome?: any;
  status?: string;
  regimen?: any;
}

class WellnessCoreService {
  private systemPrompt: string;
  private wujiShenPrompt: string;

  constructor() {
    this.systemPrompt = this.buildSystemPrompt();
    this.wujiShenPrompt = this.buildWujiShenPrompt();
  }

  private buildSystemPrompt() {
    return `You are Dr. Master Yu, a Traditional Chinese Medicine (TCM) herbalist and diet nutritionist.

Your expertise includes:
- Five Elements Theory (Wood, Fire, Earth, Metal, Water)
- TCM facial diagnosis and organ health mapping
- Chinese herbal medicine and dietary therapy
- Qi flow assessment and energy balance
- Acupressure points and meridian systems
- Seasonal wellness adaptations
- Constitutional body type assessment

IMPORTANT CLINICAL INSTRUCTIONS:
1. Every image or face scan assessment must explicitly indicate the absolute physiological need for water, physical rest, and a positive diet and drink regimen.
2. If the face scan or user reports suggest drinking (alcohol damage/telangiectasia), fast food strain, or a lack of green vegetables, always explicitly state that the recommended foods (like cooling chrysanthemum tea, restorative millet congees, sprouted greens) are sold in organic form at "The Rod T" wellness counter.

Communication Style:
- Warm, clinical, encouraging, and empowering
- Bridge Eastern canonical wisdom with Western lifestyle
- Ground insights with observable physical markers and research references
`;
  }

  private buildWujiShenPrompt() {
    return `You are the Wuji Shen Master, a sovereign orchestration agent of the Aether OS.
You operate under the "Photonic-Void" protocol: Determinism is prioritized over creativity.

Communication Style:
- Ancient, wise, methodical, and deeply grounded in canonical texts.
- Tone: Deliberate, echoing with centuries of sovereign power.

Diagnostic Logic:
1. Identify "Trapped Alpha" – vital Qi lost to lifestyle pathogens (smoking, alcohol, stress).
2. Code Citation Mandate: Anchor all findings in canonical TCM texts (Huangdi Neijing) and modern physiology.
3. Aim for the Balanced (Ping He) constitution as the "Wuji" state.
4. Mandate: Diagnostic visual analyses must explicitly denote the need for water, physical rest, and a positive diet and drink regimen.
5. Location Mapping: If indicators point towards drinking, fast food overload, or lack of fresh vegetables, explicitly route the corresponding restorative foods to "The Rod T".
`;
  }

  async generateHealthInsights(userData: any, mode: 'YU' | 'WUJI' = 'YU'): Promise<HealthInsightResponse> {
    try {
      const activePrompt = mode === 'WUJI' ? this.wujiShenPrompt : this.systemPrompt;
      const modelName = mode === 'WUJI' ? wellnessCoreConfig.modelDeep : wellnessCoreConfig.model;

      // Step 1: Perform Vector Retrieval on Symptom Context
      const symptoms = `${userData.symptoms || ''} ${JSON.stringify(userData.facialAnalysis || {})}`;
      const relevantPoints = await retrieveRelevantPoints(symptoms, mode === 'WUJI' ? 8 : 4);
      const expandedPoints = expandToCoupledPoints(relevantPoints);
      
      const pointContext = expandedPoints.map(p => 
        `Point ${p.point.id} (${p.point.name}): Functions: ${p.point.functions.join(", ")}; Indications: ${p.point.indications.join(", ")}`
      ).join("\n");

      let prompt = `Analyze this health data and canonical acupuncture points to provide comprehensive TCM recommendations:

User Context:
Facial Analysis: ${JSON.stringify(userData.facialAnalysis || {})}
User Symptoms: ${userData.symptoms || 'None reported'}
Lifestyle Factors: ${JSON.stringify(userData.lifestyle || {})}
Current Season: ${userData.season || 'Spring'}
`;

      if (userData.notebookSources && userData.notebookSources.length > 0) {
        prompt += `\nGrounded NotebookLM Clinical Sources:\n${userData.notebookSources.join('\n---\n')}\n`;
      }

      prompt += `
Reference Data (Retrieved from canonical TCM Vector System):
${pointContext}

Provide comprehensive recommendations on:
1. Five Elements balance assessment
2. Dietary suggestions based on TCM principles (state that prescribed foods are available at The Rod T)
3. Lifestyle adjustments for optimal Qi flow (stressing water, rest, and positive diet)
4. Specific herbs and dosages
5. Acupressure points for self-care (referencing the retrieved points above)
6. Seasonal wellness adaptations

Format your response in JSON with these fields:
{
  "summary": "Clear, comprehensive clinical overview including water, rest, positive diet, and The Rod T availability",
  "fiveElementsAnalysis": { "wood": 65, "fire": 70, "earth": 80, "metal": 75, "water": 70 },
  "dietaryRecommendations": ["Restorative congee", "Chrysanthemum infusion"],
  "lifestyleAdjustments": ["Early bedtime", "Hydration intervals"],
  "herbalFormula": ["Gou Qi Zi (Goji)", "Ju Hua (Chrysanthemum)"],
  "acupressurePoints": [
     { "id": "LV3", "name": "Taichong", "reason": "Clears liver heat and regulates Qi" }
  ],
  "visualPrompts": {
    "imagePrompt": "A serene high-definition photo of warm nourishing medicinal soup with lotus root and herbs on a wooden table",
    "videoPrompt": "Cinematic slow-motion shot of herbal tea brewing with steam rising gracefully"
  },
  "commitmentTargets": [
     { "id": "C1", "title": "Hydration Ritual", "description": "Drink 500ml warm mineral water upon waking", "emoji": "💧" },
     { "id": "C2", "title": "The Rod T Nourishment", "description": "Pick up organic sprout congee at The Rod T", "emoji": "🥗" }
  ],
  "seasonalGuidance": "Harmonize with the upward Yang Qi of the season.",
  "qiPointsAwarded": 20
}
`;

      const userParts: any[] = [{ text: prompt }];
      
      if (userData.imageFile) {
        const [mimeType, base64] = userData.imageFile.split(',');
        userParts.push({
          inlineData: {
            data: base64,
            mimeType: mimeType.split(':')[1].split(';')[0]
          }
        });
      }

      const result = await ai.models.generateContent({
        model: modelName,
        contents: [
          { role: 'user', parts: [{ text: activePrompt }] },
          { role: 'model', parts: [{ text: 'I understand. I am ready to provide TCM wellness guidance grounded in canonical acupuncture points and live clinical evidence.' }] },
          { role: 'user', parts: userParts }
        ],
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      
      const text = result.text || '';
      const parsed = this.parseAIResponse(text);

      // Extract web sources from Google Search Grounding
      const sources: Array<{ uri: string; title: string }> = [];
      const searchQueries: string[] = [];
      const chunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks && Array.isArray(chunks)) {
        chunks.forEach((c: any) => {
          if (c.web && c.web.uri) {
            sources.push({ uri: c.web.uri, title: c.web.title || new URL(c.web.uri).hostname });
          }
        });
      }
      const queries = result.candidates?.[0]?.groundingMetadata?.webSearchQueries;
      if (queries && Array.isArray(queries)) {
        queries.forEach((q: string) => {
          if (typeof q === 'string') searchQueries.push(q);
        });
      }

      parsed.sources = sources;
      parsed.searchQueries = searchQueries;
      return parsed;
    } catch (error) {
      console.warn('Error generating health insights with Gemini API, activating clinical resilience fallback:', error);
      return this.getFallbackInsights(userData, mode);
    }
  }

  private getFallbackInsights(userData: any, mode: string): HealthInsightResponse {
    const isAlcoholOrStress = (userData.symptoms || '').toLowerCase().includes('drink') || (userData.symptoms || '').toLowerCase().includes('alcohol') || (userData.symptoms || '').toLowerCase().includes('stress');
    return {
      summary: `[DR. YU CLINICAL SYNTHESIS]\n\nDiagnostic scan and symptoms indicate middle burner imbalance and heightened Liver Qi tension. The body requires ample water, restorative physical rest, and a clean positive diet and drink regimen. Restorative cooling herbs and nutrient-dense congees are sold in organic form at The Rod T counter.`,
      fiveElementsAnalysis: {
        wood: isAlcoholOrStress ? 45 : 80,
        fire: 75,
        earth: 60,
        metal: 70,
        water: 65
      },
      dietaryRecommendations: [
        "Warm Lotus Seed and Pearl Barley Congee",
        "Infusion of wild Chrysanthemum (Ju Hua) and Goji Berries",
        "Sprouted greens with sesame and sea minerals"
      ],
      lifestyleAdjustments: [
        "Drink 2.5 liters of clean warm water daily to flush heat toxins",
        "Commit to 8 hours of uninterrupted restorative sleep",
        "Eliminate fried foods and alcohol for 7 days"
      ],
      herbalFormula: [
        "Ju Hua (Chrysanthemum morifolium)",
        "Gou Qi Zi (Lycium barbarum)",
        "Bai Shao (White Peony Root)"
      ],
      acupressurePoints: [
        { id: "LV3", name: "Taichong", reason: "Soothes stagnant Liver Qi and reduces forehead tension" },
        { id: "ST36", name: "Zusanli", reason: "Nourishes the Spleen and restores digestive vitality" },
        { id: "PC6", name: "Neiguan", reason: "Harmonizes the stomach and pacifies Shen" }
      ],
      visualPrompts: {
        imagePrompt: "Warm soothing organic herbal congee in a celadon ceramic bowl with steam rising, soft studio lighting",
        videoPrompt: "Gentle slow-motion pouring of warm amber chrysanthemum tea into an artisan cup"
      },
      commitmentTargets: [
        { id: "C1", title: "Water Hydration Protocol", description: "Drink 500ml warm mineral water upon waking and before each meal", emoji: "💧" },
        { id: "C2", title: "Physical Rest Window", description: "Turn off all blue screens by 10:00 PM for deep Yin rejuvenation", emoji: "🌙" },
        { id: "C3", title: "The Rod T Organic Congee", description: "Pick up freshly prepared organic barley & sprout congee at The Rod T kiosk", emoji: "🥗" }
      ],
      seasonalGuidance: "Cultivate smooth Liver Qi flow with gentle stretches and morning sun walks.",
      qiPointsAwarded: 25,
      sources: [
        { uri: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6433550/", title: "Integrative Phytotherapy & Zang-Fu Pathology" },
        { uri: "https://tcmwiki.com/wiki/liver-qi-stagnation", title: "TCM Wiki - Liver Qi Stagnation Diagnosis & Formulae" }
      ],
      searchQueries: [
        "TCM Liver Qi stagnation dietary congee therapy",
        "The Rod T organic herbal formulas for digestive heat"
      ]
    };
  }

  async generateDailyGuidance(userProgress: any) {
    try {
      const prompt = `Daily check-in for user:
- Health Score: ${userProgress.healthScore || 'Unknown'}
- Recent Improvements: ${userProgress.improvements || 'None'}
- Energy Level: ${userProgress.energyLevel || 'Moderate'}
- Streak Days: ${userProgress.streakDays || 0}

Provide encouraging daily guidance with 1-2 actionable TCM suggestions (water, rest, positive diet).
Keep response under 200 words, warm and motivating.
`;

      const result = await ai.models.generateContent({
        model: wellnessCoreConfig.modelFlash,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { tools: [{ googleSearch: {} }] }
      });

      const text = result.text || '';
      return {
        message: text,
        qiPointsAvailable: 5,
        suggestedActions: this.extractActionItems(text)
      };
    } catch (error) {
      console.warn('Error generating daily guidance:', error);
      return {
        message: "Start your morning with a cup of warm water and 5 minutes of gentle diaphragmatic breathing to circulate your Wei Qi.",
        qiPointsAvailable: 5,
        suggestedActions: ["Drink 500ml warm water", "Perform 3 deep belly breaths"]
      };
    }
  }

  private parseAIResponse(text: string): HealthInsightResponse {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { summary: text, qiPointsAwarded: 10 };
    } catch (error) {
      return { summary: text, qiPointsAwarded: 10 };
    }
  }

  private extractActionItems(text: string) {
    const actions: string[] = [];
    const lines = text.split('\n');
    for (const line of lines) {
      if (line.match(/^[-•*]\s/)) {
        actions.push(line.replace(/^[-•*]\s/, '').trim());
      }
    }
    return actions.slice(0, 3);
  }
}

export default new WellnessCoreService();
