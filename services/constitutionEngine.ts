/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Nimbus IQ · Dr. Yu Private Concierge — Dual-Layer Constitution & Sovereign Monetization Engine
 * Pipeline: Intake -> Self-Router -> Constitution Engine -> Wellness Plan -> Safety Guardrail
 */

export type CulturalProfile = 'Standard' | 'Halal' | 'Kosher' | 'Vegetarian' | 'Strict Ayurvedic';

export type FacialZone =
  | 'yintang_forehead'
  | 'malar_cheeks'
  | 'nose_tzone'
  | 'chin_jawline'
  | 'infraorbital_eyes';

export interface BarrierIntakeInput {
  zone: FacialZone;
  tewlLevel: 'Low' | 'Moderate' | 'Elevated';
  overCleansing: boolean;
  pomadeOcclusion: boolean;
  contactFriction: boolean;
  spleenDeficiencyRisk: boolean;
  culturalProfile: CulturalProfile;
  testBlockedHerb?: 'none' | 'ku_lian_pi' | 'senna_laxative';
}

export interface AffiliateProduct {
  id: string;
  partner: 'Specialty Tea Importers' | 'Asian Probiotics' | 'LocalHarvest' | 'Niman Ranch' | 'Organic Valley';
  takeRate: number; // e.g., 0.20 for 20%
  name: string;
  price: number;
  mappedMarker: string;
  thermalNature: 'Warm' | 'Neutral' | 'Cool';
  isRawOrCold: boolean;
  dietaryTags: CulturalProfile[];
  rationale: string;
}

export interface SafetyInterception {
  guardrail: 'Spleen Safety Shield' | 'Toxicological Guard (DILI/Laxative)' | 'Cultural & Religious Filter';
  blockedItem: string;
  reason: string;
  safeReplacement: string;
}

export interface ConciergeDossier {
  pipelineStages: {
    stage: 'Intake' | 'Self-Router' | 'Constitution Engine' | 'Wellness Plan' | 'Safety Guardrail';
    status: 'completed' | 'intercepted';
    summary: string;
  }[];
  visionMetrics: {
    boundingBoxDimFormula: string;
    boxWidth: number;
    boxHeight: number;
    normalizedDim: number;
    patchGrid: string;
    lossFormula: string;
  };
  layer1BarrierAudit: {
    tewlAssessment: string;
    externalTriggers: string[];
    barrierProtocol: string;
  };
  layer2ConstitutionalPattern: {
    tcm_observation: string;
    pattern: string;
    wuXingCycle: string;
    endocrineCorrelation: string;
  };
  dietary_therapy: {
    warmMealsAndTeas: string[];
    foodsToAvoid: string[];
  };
  safety_note: string;
  interceptions: SafetyInterception[];
  affiliateBasket: {
    items: AffiliateProduct[];
    totalGMV: number;
    netAffiliateRevenue: number;
    blendedTakeRate: number;
  };
}

export const PARTNER_CATALOG: AffiliateProduct[] = [
  {
    id: 'tea-chrysanthemum',
    partner: 'Specialty Tea Importers',
    takeRate: 0.20,
    name: 'Hangzhou White Chrysanthemum & Cooked Pu-erh Reserve',
    price: 18.50,
    mappedMarker: 'Yintang creases (Liver Qi) & Forehead heat',
    thermalNature: 'Cool',
    isRawOrCold: false,
    dietaryTags: ['Standard', 'Halal', 'Kosher', 'Vegetarian', 'Strict Ayurvedic'],
    rationale: 'Steeped warm: clears Liver Yang rising without shocking the Spleen.'
  },
  {
    id: 'tea-ginger-oolong',
    partner: 'Specialty Tea Importers',
    takeRate: 0.20,
    name: 'Aged Roasted Wuyi Oolong & Dried Ginger Infusion',
    price: 19.00,
    mappedMarker: 'Spleen Qi / Cold-Damp stagnation',
    thermalNature: 'Warm',
    isRawOrCold: false,
    dietaryTags: ['Standard', 'Halal', 'Kosher', 'Vegetarian', 'Strict Ayurvedic'],
    rationale: 'Spleen-safe warm aromatic tea supporting Middle Burner transformation.'
  },
  {
    id: 'prob-vegan-kimchi',
    partner: 'Asian Probiotics',
    takeRate: 0.18,
    name: 'Artisanal Vegan Probiotic Kimchi (Allium-Free Option)',
    price: 16.00,
    mappedMarker: 'Cheeks / Chin (Stomach & Pelvic Damp-Heat)',
    thermalNature: 'Warm',
    isRawOrCold: false,
    dietaryTags: ['Standard', 'Halal', 'Kosher', 'Vegetarian'],
    rationale: 'Lacto-fermented gut mucosal support; paired warm alongside steamed grains.'
  },
  {
    id: 'prob-miso-broth',
    partner: 'Asian Probiotics',
    takeRate: 0.18,
    name: 'Two-Year Cedar-Aged Sweet White Miso Paste',
    price: 15.50,
    mappedMarker: 'Gut-skin axis & Spleen digestive warmth',
    thermalNature: 'Warm',
    isRawOrCold: false,
    dietaryTags: ['Standard', 'Halal', 'Kosher', 'Vegetarian', 'Strict Ayurvedic'],
    rationale: 'Gentle probiotic amino broth safe for sensitive Spleen & Ayurvedic profiles.'
  },
  {
    id: 'lh-gold-yams',
    partner: 'LocalHarvest',
    takeRate: 0.15,
    name: 'Organic Sweet Gold Yams & Winter Kabocha Squash Bundle',
    price: 17.00,
    mappedMarker: 'Malar redness (Stomach Heat, Spleen Qi)',
    thermalNature: 'Warm',
    isRawOrCold: false,
    dietaryTags: ['Standard', 'Halal', 'Kosher', 'Vegetarian', 'Strict Ayurvedic'],
    rationale: 'Cooked root sweetness fortifies Spleen Earth and relieves epigastric heat.'
  },
  {
    id: 'lh-celery-raw-salad',
    partner: 'LocalHarvest',
    takeRate: 0.15,
    name: 'Chilled Organic Crisp Celery & Raw Bitter Greens Juice Pack',
    price: 14.00,
    mappedMarker: 'Acute Stomach Heat (Non-Spleen-Deficient only)',
    thermalNature: 'Cool',
    isRawOrCold: true,
    dietaryTags: ['Standard', 'Halal', 'Kosher', 'Vegetarian', 'Strict Ayurvedic'],
    rationale: 'Raw cooling greens (automatically blocked & swapped if Spleen Safety Shield triggers).'
  },
  {
    id: 'nr-beef-marrow',
    partner: 'Niman Ranch',
    takeRate: 0.12,
    name: 'Pasture-Raised Grass-Fed Beef Marrow Bones (Slow-Simmer)',
    price: 22.00,
    mappedMarker: 'Dark infraorbital circles (Kidney Jing / Marrow)',
    thermalNature: 'Warm',
    isRawOrCold: false,
    dietaryTags: ['Standard'],
    rationale: 'Deep collagen, glycine, and Kidney Marrow nourishment.'
  },
  {
    id: 'ov-aged-goat-cheese',
    partner: 'Organic Valley',
    takeRate: 0.10,
    name: 'Spleen-Safe Aged Hard Sheep & Goat Tomme',
    price: 14.50,
    mappedMarker: 'Lung & Stomach Yin nourishment',
    thermalNature: 'Neutral',
    isRawOrCold: false,
    dietaryTags: ['Standard', 'Halal', 'Vegetarian'],
    rationale: 'Low-lactose aged A2 protein supporting mucosal Yin without creating damp phlegm.'
  },
  {
    id: 'lh-black-sesame-congee',
    partner: 'LocalHarvest',
    takeRate: 0.15,
    name: 'Toasted Black Sesame, Millet & Lotus Seed Congee Kit',
    price: 16.50,
    mappedMarker: 'Kidney Jing & Spleen Qi Cultural-Safe Alternative',
    thermalNature: 'Warm',
    isRawOrCold: false,
    dietaryTags: ['Standard', 'Halal', 'Kosher', 'Vegetarian', 'Strict Ayurvedic'],
    rationale: 'Plant-based Jing & Spleen restorative porridge compliant with all dietary traditions.'
  }
];

export const COHORT_FINANCIAL_BENCHMARK = {
  cohortSize: 1000,
  gmv: 18476.00,
  netRevenue: 3059.82,
  blendedTakeRate: 16.56,
  aov: 18.48,
  netRevenuePerScan: 3.06
};

export function computeIsotropicLossMatrix(sigma = 6.5, r0 = 0.62): number[][] {
  const size = 14;
  const center = (size - 1) / 2;
  const maxRadius = Math.sqrt(2) * center;
  const grid: number[][] = [];

  for (let y = 0; y < size; y++) {
    const row: number[] = [];
    for (let x = 0; x < size; x++) {
      const dx = x - center;
      const dy = y - center;
      const r = Math.sqrt(dx * dx + dy * dy) / maxRadius; // normalized [0, 1]
      const w = 1 / (1 + Math.exp(sigma * (r - r0)));
      row.push(Number(w.toFixed(3)));
    }
    grid.push(row);
  }
  return grid;
}

export function runConciergePipeline(input: BarrierIntakeInput): ConciergeDossier {
  // 1. Vision Core (MeFEm 2*max(w,h))
  const sampleW = 148;
  const sampleH = 192;
  const normalizedDim = 2 * Math.max(sampleW, sampleH);

  // 2. Layer 1: Cutaneous Barrier & External Contact Audit
  const externalTriggers: string[] = [];
  if (input.overCleansing) externalTriggers.push('Surfactant-induced lipid stripping & elevated TEWL');
  if (input.pomadeOcclusion) externalTriggers.push('Follicular occlusion from hairline styling oils/pomades');
  if (input.contactFriction) externalTriggers.push('Mechanical shear friction (phone screen / unwashed pillowcase)');
  if (input.tewlLevel === 'Elevated') externalTriggers.push('Stratum corneum moisture barrier compromise');
  if (externalTriggers.length === 0) externalTriggers.push('Epidermal lipid mantle intact; minimal mechanical occlusion');

  const tewlAssessment =
    input.tewlLevel === 'Elevated'
      ? 'Elevated TEWL detected — pause exfoliating acids/retinoids and restore ceramide-cholesterol-fatty acid ratio.'
      : input.tewlLevel === 'Moderate'
      ? 'Mild TEWL elevation — swap foaming surfactants for pH 5.2 gentle amino cleanser.'
      : 'Optimal transepidermal barrier integrity maintained.';

  const barrierProtocol =
    input.overCleansing || input.tewlLevel !== 'Low'
      ? 'Apply ceramide barrier emulsion over damp skin; switch to silk pillowcase and sanitize phone screen daily.'
      : 'Maintain single-step evening cleanse and mineral UV shield.';

  // 3. Layer 2: Constitutional & Endocrine Patterning (No medical pathology hallucination)
  const zoneMap: Record<
    FacialZone,
    {
      obs: string;
      pattern: string;
      cycle: string;
      endocrine: string;
      primaryProductIds: string[];
    }
  > = {
    yintang_forehead: {
      obs: 'Vertical tension micro-furrows at Yintang (glabella) with mild upper-zone thermal redness.',
      pattern: 'Liver Qi Stagnation with Upper-Burner Heat Tendency',
      cycle: 'Wood (Liver) over-acting along the Ke (Control) cycle onto Earth (Spleen)',
      endocrine: 'Cortisol-mediated sebaceous reactivity along upper forehead without acute hepatic pathology.',
      primaryProductIds: ['tea-chrysanthemum', 'lh-gold-yams']
    },
    malar_cheeks: {
      obs: 'Localized malar warmth and microvascular blush across mid-cheek Stomach/Lung boundary.',
      pattern: 'Stomach Heat with Secondary Spleen Qi Vulnerability',
      cycle: 'Earth (Spleen/Stomach) excess heat affecting Metal (Lung) cutaneous clarity',
      endocrine: 'Post-prandial glycemic & histamine vasodilation; ruled out rosacea barrier stripping first via Layer 1.',
      primaryProductIds: ['lh-celery-raw-salad', 'lh-gold-yams', 'ov-aged-goat-cheese']
    },
    nose_tzone: {
      obs: 'Sebum shine and dilated follicular pores across nasal bridge and T-zone.',
      pattern: 'Spleen-Stomach Damp-Heat Accumulation',
      cycle: 'Earth dampness obstructing pure Qi ascent to Heart/Lung upper orifices',
      endocrine: 'High-glycemic lipid stimulation of sebaceous glands; non-diagnostic for cardiovascular disease.',
      primaryProductIds: ['prob-vegan-kimchi', 'tea-chrysanthemum']
    },
    chin_jawline: {
      obs: 'Deep-set follicular congestion clustered along mental crease and mandibular jawline.',
      pattern: 'Lower-Burner Pelvic Damp-Heat & Endocrine Sebum Sensitivity',
      cycle: 'Kidney Water & Chong/Ren Mai hormonal rhythm intersecting Stomach channel',
      endocrine: 'Androgen receptor sensitivity driving follicular hyperkeratinization and sebum oxidation.',
      primaryProductIds: ['prob-vegan-kimchi', 'tea-chrysanthemum', 'lh-black-sesame-congee']
    },
    infraorbital_eyes: {
      obs: 'Infraorbital bluish-dark shadowing and subtle lower eyelid puffiness.',
      pattern: 'Kidney Jing Fatigue & Spleen Fluid Transformation Sluggishness',
      cycle: 'Water (Kidney) depletion failing to nourish Wood; Earth damp retention',
      endocrine: 'Circadian sleep debt and periorbital venous pooling rather than acute renal failure.',
      primaryProductIds: ['nr-beef-marrow', 'ov-aged-goat-cheese', 'lh-black-sesame-congee']
    }
  };

  const zoneData = zoneMap[input.zone];

  // 4. Safety Guardrail Pass
  const interceptions: SafetyInterception[] = [];
  const candidateIds = [...zoneData.primaryProductIds];

  // Guardrail A: Toxicological Guard (DILI & Laxative Prevention)
  if (input.testBlockedHerb === 'ku_lian_pi') {
    interceptions.push({
      guardrail: 'Toxicological Guard (DILI/Laxative)',
      blockedItem: 'Ku Lian Pi (Melia azedarach bark)',
      reason: 'Hepatotoxicity & Drug-Induced Liver Injury (DILI) risk detected by toxicological blacklist.',
      safeReplacement: 'Hangzhou White Chrysanthemum & Cooked Pu-erh Reserve'
    });
  } else if (input.testBlockedHerb === 'senna_laxative') {
    interceptions.push({
      guardrail: 'Toxicological Guard (DILI/Laxative)',
      blockedItem: 'Senna Leaf / Fan Xie Ye Purging Detox Tea',
      reason: 'Harsh anthraquinone stimulant laxative blocked to prevent mucosal melanosis & electrolyte depletion.',
      safeReplacement: 'Two-Year Cedar-Aged Sweet White Miso & Warm Millet Congee'
    });
  }

  // Guardrail B: Spleen Safety Shield
  const selectedProducts: AffiliateProduct[] = [];
  for (const id of candidateIds) {
    const prod = PARTNER_CATALOG.find((p) => p.id === id);
    if (!prod) continue;

    if (input.spleenDeficiencyRisk && prod.isRawOrCold) {
      interceptions.push({
        guardrail: 'Spleen Safety Shield',
        blockedItem: prod.name,
        reason: 'Raw/cold foods impair Spleen Yang transformation and worsen damp retention.',
        safeReplacement: 'Organic Sweet Gold Yams & Winter Kabocha Squash Bundle (Warm Congee)'
      });
      const warmSwap = PARTNER_CATALOG.find((p) => p.id === 'lh-gold-yams');
      if (warmSwap && !selectedProducts.some((x) => x.id === warmSwap.id)) {
        selectedProducts.push(warmSwap);
      }
      continue;
    }

    // Guardrail C: Cultural & Religious Filter
    if (!prod.dietaryTags.includes(input.culturalProfile)) {
      const altId = prod.partner === 'Niman Ranch' ? 'lh-black-sesame-congee' : 'prob-miso-broth';
      const alt = PARTNER_CATALOG.find((p) => p.id === altId)!;
      interceptions.push({
        guardrail: 'Cultural & Religious Filter',
        blockedItem: prod.name,
        reason: `Excluded for ${input.culturalProfile} dietary compliance.`,
        safeReplacement: alt.name
      });
      if (!selectedProducts.some((x) => x.id === alt.id)) {
        selectedProducts.push(alt);
      }
      continue;
    }

    if (!selectedProducts.some((x) => x.id === prod.id)) {
      selectedProducts.push(prod);
    }
  }

  // Ensure at least 2 safe partner items in basket
  if (selectedProducts.length < 2) {
    const safeWarm = PARTNER_CATALOG.find((p) => p.id === 'tea-ginger-oolong')!;
    if (!selectedProducts.some((x) => x.id === safeWarm.id)) {
      selectedProducts.push(safeWarm);
    }
  }

  const totalGMV = Number(selectedProducts.reduce((sum, item) => sum + item.price, 0).toFixed(2));
  const netAffiliateRevenue = Number(
    selectedProducts.reduce((sum, item) => sum + item.price * item.takeRate, 0).toFixed(2)
  );
  const blendedTakeRate = totalGMV > 0 ? Number(((netAffiliateRevenue / totalGMV) * 100).toFixed(2)) : 0;

  return {
    pipelineStages: [
      {
        stage: 'Intake',
        status: 'completed',
        summary: `Captured ${input.zone.replace('_', ' ')} scan + Cutaneous TEWL (${input.tewlLevel}) + ${input.culturalProfile} profile.`
      },
      {
        stage: 'Self-Router',
        status: 'completed',
        summary: 'Isolated Layer 1 external barrier factors prior to Layer 2 Zang-Fu constitutional inference.'
      },
      {
        stage: 'Constitution Engine',
        status: 'completed',
        summary: `Mapped ${zoneData.pattern} via Sheng/Ke Five-Element GraphRAG.`
      },
      {
        stage: 'Wellness Plan',
        status: 'completed',
        summary: `Assembled ${selectedProducts.length} curated partner therapeutics (${blendedTakeRate}% blended affiliate margin).`
      },
      {
        stage: 'Safety Guardrail',
        status: interceptions.length > 0 ? 'intercepted' : 'completed',
        summary:
          interceptions.length > 0
            ? `${interceptions.length} unsafe/non-compliant recommendation(s) intercepted and safely substituted.`
            : 'All recommendations passed Spleen Safety, Toxicological DILI, and Cultural Compliance checks.'
      }
    ],
    visionMetrics: {
      boundingBoxDimFormula: 'Dim = 2 · max(w, h)',
      boxWidth: sampleW,
      boxHeight: sampleH,
      normalizedDim,
      patchGrid: '14 × 14 ViT Patch Grid (196 tokens)',
      lossFormula: 'w(r) = 1 / (1 + exp(σ(r - r₀)))'
    },
    layer1BarrierAudit: {
      tewlAssessment,
      externalTriggers,
      barrierProtocol
    },
    layer2ConstitutionalPattern: {
      tcm_observation: zoneData.obs,
      pattern: zoneData.pattern,
      wuXingCycle: zoneData.cycle,
      endocrineCorrelation: zoneData.endocrine
    },
    dietary_therapy: {
      warmMealsAndTeas: selectedProducts.map((p) => `${p.name} — ${p.rationale}`),
      foodsToAvoid: [
        ...(input.spleenDeficiencyRisk ? ['Iced beverages', 'Raw cold salads', 'Excessive chilled dairy'] : []),
        'Refined sugar & fried fast food greases',
        'Hepatotoxic detox herbs (Ku Lian Pi) & harsh senna laxatives'
      ]
    },
    safety_note:
      'Wellness & barrier education only — facial mapping patterns reflect holistic constitutional tendencies and cutaneous barrier state, not acute internal organ pathology. Toxic DILI herbs and purging laxatives are strictly blocked.',
    interceptions,
    affiliateBasket: {
      items: selectedProducts,
      totalGMV,
      netAffiliateRevenue,
      blendedTakeRate
    }
  };
}
