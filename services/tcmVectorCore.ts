
import { GoogleGenAI } from "@google/genai";
import { TCM_POINTS, TCMPoint, MERIDIAN_COUPLES } from "./tcmData";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const EMBEDDING_MODEL = "gemini-embedding-2-preview";

export interface RetrievalResult {
  point: TCMPoint;
  score: number;
}

/**
 * Normalizes point data into a searchable string for the vector model.
 */
function stringifyPoint(point: TCMPoint): string {
  return `Point ${point.id} (${point.name}) on the ${point.meridian} meridian (${point.element} element). 
  Commonly used for ${point.indications.join(", ")}. 
  Functions include: ${point.functions.join(", ")}.`;
}

/**
 * Computes cosine similarity between two vectors.
 */
function cosineSimilarity(v1: number[], v2: number[]): number {
  let dotProduct = 0;
  let mA = 0;
  let mB = 0;
  for (let i = 0; i < v1.length; i++) {
    dotProduct += v1[i] * v2[i];
    mA += v1[i] * v1[i];
    mB += v2[i] * v2[i];
  }
  mA = Math.sqrt(mA);
  mB = Math.sqrt(mB);
  return dotProduct / (mA * mB);
}

// Simple in-memory cache for point embeddings to avoid redundant calls
let cachedPointEmbeddings: { id: string; vector: number[] }[] | null = null;

export async function initializePointVectors(): Promise<void> {
  if (cachedPointEmbeddings) return;

  console.log("Vectorizing TCM Point Knowledge Graph...");
  const vectors = await Promise.all(
    TCM_POINTS.map(async (point) => {
      const response = await ai.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: [{ parts: [{ text: stringifyPoint(point) }] }]
      });
      const embeddings = response.embeddings as any;
      const vector = Array.isArray(embeddings) ? embeddings[0].values : embeddings.values;
      return { id: point.id, vector };
    })
  );
  
  cachedPointEmbeddings = vectors;
  console.log("Vectorization complete.");
}

/**
 * Finds the most relevant acupuncture points based on a symptom description.
 * Propagates scores through meridian couples and elements.
 */
export async function retrieveRelevantPoints(symptoms: string, limit: number = 3): Promise<RetrievalResult[]> {
  await initializePointVectors();

  const sympRes = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: [{ parts: [{ text: symptoms }] }]
  });
  
  const embeddings = sympRes.embeddings as any;
  const sympVector = Array.isArray(embeddings) ? embeddings[0].values : embeddings.values;

  const results: RetrievalResult[] = cachedPointEmbeddings!.map(item => {
    const point = TCM_POINTS.find(p => p.id === item.id)!;
    const baseScore = cosineSimilarity(sympVector, item.vector);
    
    // Pattern Fusion: Boost related meridians if the symptom mentions them
    let boost = 0;
    const lowerSymptoms = symptoms.toLowerCase();
    
    // Meridian Boost
    if (lowerSymptoms.includes(point.meridian.toLowerCase())) boost += 0.05;
    
    // Element Boost
    if (lowerSymptoms.includes(point.element.toLowerCase())) boost += 0.05;

    return { point, score: baseScore + boost };
  });

  // Sort and return top N
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Meridian Propagation: Expands a set of points to their coupled partners.
 */
export function expandToCoupledPoints(results: RetrievalResult[]): RetrievalResult[] {
  const expanded = [...results];
  
  results.forEach(res => {
    const couple = MERIDIAN_COUPLES[res.point.meridian];
    if (couple) {
      // Find prominent point on coupled meridian (e.g. Yuan-Source)
      const partner = TCM_POINTS.find(p => p.meridian === couple && p.category.includes("Yuan-Source"));
      if (partner && !expanded.find(e => e.point.id === partner.id)) {
        expanded.push({ point: partner, score: res.score * 0.8 }); // Lower weight but suggested
      }
    }
  });

  return expanded.sort((a, b) => b.score - a.score);
}
