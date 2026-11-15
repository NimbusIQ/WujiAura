/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TCMKnowledgeBase {
  wuxing: {
    [key: string]: {
      organ: string;
      facial_zone: string;
      flavor: string;
      season: string;
      generates: string; // Creation Cycle
      controls: string;   // Control Cycle
    };
  };
  organ_disharmonies: {
    [key: string]: {
      facial_biomarker: string;
      symptoms: string[];
      dietary_recommendation: string;
      avoid: string[];
    };
  };
  organ_clock: {
    [key: string]: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  preferences: {
    language: string;
  };
}

export interface MultimodalInputs {
  facial_analysis?: {
    biomarkers: string[];
    skin_complexion: string;
  };
  voice_journal_text: string;
}

export const getTCMKnowledgeBase = (): TCMKnowledgeBase => {
  return {
    wuxing: {
      "Wood": { organ: "Liver", facial_zone: "Forehead/Brows", flavor: "Sour", season: "Spring", generates: "Fire", controls: "Earth" },
      "Fire": { organ: "Heart", facial_zone: "Tongue Tip", flavor: "Bitter", season: "Summer", generates: "Earth", controls: "Metal" },
      "Earth": { organ: "Spleen", facial_zone: "Mouth/Lips", flavor: "Sweet", season: "Late Summer", generates: "Metal", controls: "Water" },
      "Metal": { organ: "Lungs", facial_zone: "Cheeks", flavor: "Pungent", season: "Autumn", generates: "Water", controls: "Wood" },
      "Water": { organ: "Kidneys", facial_zone: "Chin/Under-eye", flavor: "Salty", season: "Winter", generates: "Wood", controls: "Fire" }
    },
    organ_disharmonies: {
      "Liver Qi Stagnation (Wood)": {
        facial_biomarker: "furrow between brows",
        symptoms: ["fatigue", "stomach discomfort", "irritability"],
        dietary_recommendation: "dandelion greens, lemon water, peppermint tea",
        avoid: ["spicy foods", "excessive alcohol"]
      },
      "Heart Heat (Fire)": {
        facial_biomarker: "red tongue tip",
        symptoms: ["anxiety", "insomnia", "palpitations"],
        dietary_recommendation: "lotus seed, lily bulb, bitter melon",
        avoid: ["coffee", "spicy foods", "red meat"]
      },
      "Spleen Deficiency (Earth)": {
        facial_biomarker: "sallow complexion",
        symptoms: ["bloating", "poor digestion", "excessive worry"],
        dietary_recommendation: "sweet potato, pumpkin, oats, ginger tea",
        avoid: ["ice water", "raw foods"]
      }
    },
    organ_clock: {
      "Liver": "1 AM - 3 AM",
      "Spleen": "9 AM - 11 AM",
      "Heart": "11 AM - 1 PM",
      "Stomach": "7 AM - 9 AM",
      "Lung": "3 AM - 5 AM"
    }
  };
};

export const runTCMAgentAnalysis = (userProfile: UserProfile, inputs: MultimodalInputs) => {
  const kb = getTCMKnowledgeBase();
  const facial = inputs.facial_analysis || { biomarkers: [], skin_complexion: 'normal' };
  const symptoms = inputs.voice_journal_text.toLowerCase();
  
  const diagnosis: string[] = [];
  const recommendations: string[] = [];
  const wuxingInsights: string[] = [];
  
  // Rule 1: Liver Qi Stagnation (Wood)
  if (facial.biomarkers.includes("furrow between brows") || symptoms.includes("fatigue")) {
    diagnosis.push("Liver Qi Stagnation (Wood)");
    recommendations.push(kb.organ_disharmonies["Liver Qi Stagnation (Wood)"].dietary_recommendation);
    wuxingInsights.push(`Wood (Liver) is stagnating. According to the Control Cycle, this may over-act on Earth (Spleen), causing the digestion issues you noted.`);
  }
  
  // Rule 2: Heart Heat (Fire)
  if (facial.biomarkers.includes("red tongue tip") || symptoms.includes("anxiety")) {
    diagnosis.push("Heart Heat (Fire)");
    recommendations.push(kb.organ_disharmonies["Heart Heat (Fire)"].dietary_recommendation);
    wuxingInsights.push(`Fire (Heart) is excessive. To balance, consider the Creation Cycle: Earth (Spleen) can help ground this energy.`);
  }

  // Rule 3: Spleen Deficiency (Earth)
  if (facial.biomarkers.includes("sallow complexion") || symptoms.includes("bloating")) {
    diagnosis.push("Spleen Deficiency (Earth)");
    recommendations.push(kb.organ_disharmonies["Spleen Deficiency (Earth)"].dietary_recommendation);
    wuxingInsights.push(`Earth (Spleen) is weak. Since Earth generates Metal (Lungs), you may notice respiratory sensitivity if this persists.`);
  }

  const status = diagnosis.length > 0 
    ? `Dr. Yu's Wuxing Analysis: Detected ${diagnosis.join(", ")}.`
    : "No specific elemental imbalance detected. Your Wuxing cycles appear balanced.";

  return {
    userId: userProfile.id,
    diagnosis,
    recommendations,
    wuxingInsights,
    status,
    organClockTip: `Reminder: The ${kb.organ_clock['Spleen']} time (9 AM - 11 AM) is the Earth phase, critical for nutrient transformation.`
  };
};
