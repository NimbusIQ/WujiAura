import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, 
  Droplet, 
  Sparkles, 
  Activity, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ChevronRight, 
  RotateCcw,
  Sliders,
  Maximize2,
  Bookmark
} from 'lucide-react';

export interface TongueState {
  bodyColor: 'pale_red' | 'pale' | 'red' | 'crimson' | 'purple';
  coatingColor: 'thin_white' | 'thick_white_greasy' | 'thin_yellow' | 'thick_yellow_greasy' | 'peeled';
  shape: 'normal' | 'swollen_toothmarks' | 'thin' | 'cracked' | 'stiff';
  moisture: 'normal' | 'dry' | 'wet_slippery';
  sublingualVeins: 'normal' | 'engorged_dark';
  showThermalOverlay: boolean;
  showSublingualView: boolean;
}

export interface EyeState {
  sclera: 'porcelain_white' | 'yellowish' | 'bloodshot' | 'pale_dusky';
  canthi: 'normal_pink' | 'inflamed_red' | 'pale';
  eyelids: 'normal' | 'puffy_edematous' | 'dark_circles';
}

export interface SkinState {
  moisture: 'balanced_hydrated' | 'dry_flaky' | 'oily_greasy' | 'clammy_sweat' | 'puffy_edema';
  complexion: 'radiant_you_shen' | 'sallow_yellow' | 'malar_flush' | 'pale_white' | 'ashen_dark';
}

interface CorrelationResult {
  concordanceScore: number;
  primarySyndrome: string;
  chineseSyndrome: string;
  patternStrength: 'Harmonious' | 'Strong Concordance' | 'Moderate' | 'Complex / Paradoxical';
  clinicalInsight: string;
  correlatingFactors: string[];
  traditionalPhysicianNote: string;
  recommendedHerbalFormula: string;
  theRodTFoodTherapy: string;
}

interface TongueAnalysisToolProps {
  onSyncDiagnostic?: (diagnostic: any) => void;
}

export const TongueAnalysisTool: React.FC<TongueAnalysisToolProps> = ({ onSyncDiagnostic }) => {
  // Tongue State
  const [tongue, setTongue] = useState<TongueState>({
    bodyColor: 'red',
    coatingColor: 'thick_yellow_greasy',
    shape: 'swollen_toothmarks',
    moisture: 'wet_slippery',
    sublingualVeins: 'normal',
    showThermalOverlay: true,
    showSublingualView: false
  });

  // Eye (Five Wheels) State
  const [eye, setEye] = useState<EyeState>({
    sclera: 'yellowish',
    canthi: 'inflamed_red',
    eyelids: 'puffy_edematous'
  });

  // Skin (Moisture & Complexion) State
  const [skin, setSkin] = useState<SkinState>({
    moisture: 'oily_greasy',
    complexion: 'sallow_yellow'
  });

  const [activeZone, setActiveZone] = useState<'tip' | 'center' | 'sides' | 'root'>('center');

  // Compute Cross-Modal Correlation between Tongue + Eye + Skin
  const correlation: CorrelationResult = useMemo(() => {
    // Damp-Heat in Liver/Gallbladder & Spleen
    if (
      (tongue.coatingColor === 'thick_yellow_greasy' || tongue.bodyColor === 'red') &&
      (eye.sclera === 'yellowish' || eye.canthi === 'inflamed_red') &&
      (skin.moisture === 'oily_greasy' || skin.complexion === 'sallow_yellow')
    ) {
      return {
        concordanceScore: 98,
        primarySyndrome: 'Damp-Heat in Liver & Gallbladder with Spleen Encumbrance',
        chineseSyndrome: '肝胆湿热，脾虚湿困证',
        patternStrength: 'Strong Concordance',
        clinicalInsight: 'The thick yellow greasy tongue coating directly confirms internal damp-heat. The icteric yellowish sclera (White Wheel) reflects bile heat overflowing from the Liver-Gallbladder, while the seborrheic oily skin confirms turbid dampness exuding through the skin pores (Pi Mao).',
        correlatingFactors: [
          'Thick Yellow Greasy Tongue: Damp-Heat boiling in Middle/Lower Burners',
          'Yellowish Sclera: Wood/Liver Heat overflowing into the Metal/Lung Wheel',
          'Oily/Greasy Sebum: Pathogenic damp-heat vaporizing outward through the skin'
        ],
        traditionalPhysicianNote: 'A textbook clinical triad. The physician must not treat the skin or eyes locally, but clear liver fire and drain dampness via the urinary and digestive paths.',
        recommendedHerbalFormula: 'Long Dan Xie Gan Tang (龙胆泻肝汤) or Yin Chen Hao Tang',
        theRodTFoodTherapy: 'Steamed bitter melon, mung bean soup, organic barley water, and chrysanthemum tea (all available at The Rod T organic counter).'
      };
    }

    // Spleen Qi Deficiency with Damp Retention
    if (
      (tongue.bodyColor === 'pale' || tongue.shape === 'swollen_toothmarks') &&
      (eye.eyelids === 'puffy_edematous' || eye.sclera === 'pale_dusky') &&
      (skin.moisture === 'puffy_edema' || skin.complexion === 'sallow_yellow' || skin.complexion === 'pale_white')
    ) {
      return {
        concordanceScore: 96,
        primarySyndrome: 'Spleen Qi Deficiency with Internal Fluid Retention & Dampness',
        chineseSyndrome: '脾虚湿困，水湿内停证',
        patternStrength: 'Strong Concordance',
        clinicalInsight: 'Swollen tongue with distinct toothmark indentations demonstrates failing Spleen transport function (Spleen governs muscle volume). Puffy eyelids (Flesh Wheel governed by Spleen) and sallow complexion confirm that nutrient Gu Qi cannot transform into vibrant blood.',
        correlatingFactors: [
          'Swollen Tongue with Teethmarks: Spleen cannot transform water fluids, causing lingual edema',
          'Puffy Eyelids (Flesh Wheel): Spleen weakness manifesting at the upper ocular lids',
          'Sallow/Pale Complexion: Gu Qi deficiency failing to nourish skin and hair'
        ],
        traditionalPhysicianNote: 'The real TCM doctor relies on the teethmarks and eyelid puffiness to rule out external cold; this is fundamentally middle burner metabolic fatigue.',
        recommendedHerbalFormula: 'Shen Ling Bai Zhu San (参苓白术散) or Si Jun Zi Tang',
        theRodTFoodTherapy: 'Warm roasted barley congee, Chinese mountain yam (Shan Yao), lotus seeds, and dried ginger infusions from The Rod T.'
      };
    }

    // Yin Deficiency with Empty Fire
    if (
      (tongue.bodyColor === 'red' || tongue.bodyColor === 'crimson' || tongue.coatingColor === 'peeled') &&
      (eye.canthi === 'inflamed_red' || eye.sclera === 'bloodshot') &&
      (skin.moisture === 'dry_flaky' || skin.complexion === 'malar_flush')
    ) {
      return {
        concordanceScore: 94,
        primarySyndrome: 'Kidney-Stomach Yin Deficiency with Deficient Fire Ascending',
        chineseSyndrome: '胃肾阴虚，虚火上炎证',
        patternStrength: 'Strong Concordance',
        clinicalInsight: 'The crimson or peeled (mirror) tongue reveals severe exhaustion of stomach and kidney Yin fluids. Dry, flaky skin proves that body fluids cannot reach the surface, while the afternoon malar flush and inflamed canthi (Blood Wheel) demonstrate unanchored empty heat flaring upward.',
        correlatingFactors: [
          'Red/Peeled Tongue without Coat: Complete depletion of Stomach/Kidney Yin fluids',
          'Inflamed Canthi (Blood Wheel): Deficient heart/kidney fire irritating ocular capillaries',
          'Dry Flaky Skin with Malar Flush: True Yin fluid deficit with false heat at the cheeks'
        ],
        traditionalPhysicianNote: 'Crucial diagnostic rule: Do NOT prescribe cold, bitter herbs here, as they will further dry the fluids. Nourish Yin with sweet, moistening botanicals.',
        recommendedHerbalFormula: 'Zhi Bai Di Huang Wan (知柏地黄丸) or Sha Shen Mai Dong Tang',
        theRodTFoodTherapy: 'Steamed pear with snow fungus (Tremella), lily bulbs, black sesame paste, and organic goji berries from The Rod T.'
      };
    }

    // Blood Stasis & Stagnation
    if (
      (tongue.bodyColor === 'purple' || tongue.sublingualVeins === 'engorged_dark') &&
      (eye.eyelids === 'dark_circles' || eye.sclera === 'pale_dusky') &&
      (skin.complexion === 'ashen_dark' || skin.moisture === 'dry_flaky')
    ) {
      return {
        concordanceScore: 95,
        primarySyndrome: 'Systemic Qi Stagnation & Blood Stasis',
        chineseSyndrome: '气滞血瘀，络脉痹阻证',
        patternStrength: 'Strong Concordance',
        clinicalInsight: 'Dusky purple tongue body and tortuous, distended sublingual veins provide definitive proof of microcirculatory stagnation. The dark periorbital circles and dry, rough skin (Ji Fu Jia Cuo 肌肤甲错) reflect stagnant blood failing to moisten peripheral tissues.',
        correlatingFactors: [
          'Purple Tongue & Distended Sublingual Veins: Vascular venous pooling and stasis',
          'Dark Periorbital Rings: Blood stasis stagnating around delicate capillary beds of the eyes',
          'Ashen Complexion: Stagnant blood depriving the dermis of fresh oxygenated Qi'
        ],
        traditionalPhysicianNote: 'Sublingual vein inspection under the tongue is the gold standard for validating chronic circulatory stasis that facial skin alone might conceal.',
        recommendedHerbalFormula: 'Xue Fu Zhu Yu Tang (血府逐瘀汤) or Tao Hong Si Wu Tang',
        theRodTFoodTherapy: 'Hawthorn berry tea, organic black fungus (wood ear) stew, rose bud tea, and brown sugar ginger brew from The Rod T.'
      };
    }

    // Paradoxical / Complex Pattern (e.g. Greasy coat with dry skin)
    if (tongue.coatingColor.includes('greasy') && skin.moisture === 'dry_flaky') {
      return {
        concordanceScore: 88,
        primarySyndrome: 'Dampness Obstructing Fluid Distribution (Dry Skin Paradox)',
        chineseSyndrome: '湿遏热伏，津不上承证',
        patternStrength: 'Complex / Paradoxical',
        clinicalInsight: 'A fascinating classical paradox: The tongue displays thick greasy dampness, yet the patient presents with dry, itchy skin. In TCM, heavy dampness encumbers the Middle Burner Qi dynamic, physically trapping fluids below and preventing them from misting upward to nourish the skin (津不上承).',
        correlatingFactors: [
          'Greasy Tongue Coating: Heavy dampness trapped in the interior viscera',
          'Dry Skin Paradox: Dampness blocks the Triple Burner waterways from distributing mist',
          'Sclera / Eye Congestion: Blocked fluid flow producing localized stagnant irritation'
        ],
        traditionalPhysicianNote: 'Untrained practitioners make the mistake of adding moisturizers or heavy tonics, which worsens the dampness. The true physician unblocks the Qi mechanism (Kai Xuan Fei Qi) so the body naturally moisturizes itself.',
        recommendedHerbalFormula: 'San Ren Tang (三仁汤) or Huo Xiang Zheng Qi San',
        theRodTFoodTherapy: 'Aromatic cardamom, coix seed congee, warm tangerine peel (Chen Pi) tea from The Rod T.'
      };
    }

    // Harmonious / Balanced Default
    return {
      concordanceScore: 92,
      primarySyndrome: 'Harmonious Zang-Fu Bio-Field & Wei Qi Equilibrium',
      chineseSyndrome: '阴平阳秘，气血调和证',
      patternStrength: 'Harmonious',
      clinicalInsight: 'Pale red tongue with thin white coating, clear lustrous sclera, and balanced hydrated skin demonstrate optimal autonomic and metabolic harmony. Shen (spirit) is anchored, digestive transformation is robust, and Wei Qi shields the exterior.',
      correlatingFactors: [
        'Pale Red Tongue with Thin White Coat: Ideal balance of physiological Yin, Yang, and Stomach Qi',
        'Clear Porcelain Sclera: Healthy Lung Metal and Liver Wood harmony without toxic heat',
        'Balanced Hydrated Skin: Unimpeded circulation of nutrient Ying and defensive Wei'
      ],
      traditionalPhysicianNote: 'Maintain current seasonal circadian discipline with restorative rest and balanced whole-food congees.',
      recommendedHerbalFormula: 'Bu Zhong Yi Qi Wan or nourishing Astragalus & Jujube Tea',
      theRodTFoodTherapy: 'Nourishing five-grain congee, red dates, goji berries, and organic mountain tea from The Rod T.'
    };
  }, [tongue, eye, skin]);

  // Preset Archetypes for 1-Click Clinical Testing
  const applyPreset = (presetKey: 'damp_heat' | 'spleen_def' | 'yin_def' | 'blood_stasis' | 'harmonious') => {
    switch (presetKey) {
      case 'damp_heat':
        setTongue({
          bodyColor: 'red',
          coatingColor: 'thick_yellow_greasy',
          shape: 'swollen_toothmarks',
          moisture: 'wet_slippery',
          sublingualVeins: 'normal',
          showThermalOverlay: true,
          showSublingualView: false
        });
        setEye({ sclera: 'yellowish', canthi: 'inflamed_red', eyelids: 'puffy_edematous' });
        setSkin({ moisture: 'oily_greasy', complexion: 'sallow_yellow' });
        break;
      case 'spleen_def':
        setTongue({
          bodyColor: 'pale',
          coatingColor: 'thick_white_greasy',
          shape: 'swollen_toothmarks',
          moisture: 'wet_slippery',
          sublingualVeins: 'normal',
          showThermalOverlay: true,
          showSublingualView: false
        });
        setEye({ sclera: 'pale_dusky', canthi: 'pale', eyelids: 'puffy_edematous' });
        setSkin({ moisture: 'puffy_edema', complexion: 'sallow_yellow' });
        break;
      case 'yin_def':
        setTongue({
          bodyColor: 'crimson',
          coatingColor: 'peeled',
          shape: 'cracked',
          moisture: 'dry',
          sublingualVeins: 'normal',
          showThermalOverlay: true,
          showSublingualView: false
        });
        setEye({ sclera: 'bloodshot', canthi: 'inflamed_red', eyelids: 'normal' });
        setSkin({ moisture: 'dry_flaky', complexion: 'malar_flush' });
        break;
      case 'blood_stasis':
        setTongue({
          bodyColor: 'purple',
          coatingColor: 'thin_white',
          shape: 'normal',
          moisture: 'normal',
          sublingualVeins: 'engorged_dark',
          showThermalOverlay: true,
          showSublingualView: true
        });
        setEye({ sclera: 'pale_dusky', canthi: 'normal_pink', eyelids: 'dark_circles' });
        setSkin({ moisture: 'dry_flaky', complexion: 'ashen_dark' });
        break;
      case 'harmonious':
        setTongue({
          bodyColor: 'pale_red',
          coatingColor: 'thin_white',
          shape: 'normal',
          moisture: 'normal',
          sublingualVeins: 'normal',
          showThermalOverlay: false,
          showSublingualView: false
        });
        setEye({ sclera: 'porcelain_white', canthi: 'normal_pink', eyelids: 'normal' });
        setSkin({ moisture: 'balanced_hydrated', complexion: 'radiant_you_shen' });
        break;
    }
  };

  // Sync to general application state
  const handlePushToDiagnosticReport = () => {
    if (onSyncDiagnostic) {
      onSyncDiagnostic({
        syndrome: {
          name: correlation.primarySyndrome,
          chineseName: correlation.chineseSyndrome,
          hypothesis: correlation.clinicalInsight,
          metrics: [
            { label: 'Diagnostic Concordance', value: correlation.concordanceScore, sub: '%' },
            { label: 'Tongue-Eye Correlation', value: 95, sub: '%' },
            { label: 'Skin Luster Index', value: skin.complexion === 'radiant_you_shen' ? 92 : 68, sub: '%' }
          ]
        },
        regimen: {
          actions: [
            { id: 'tongue-1', emoji: '🍵', title: 'Classical Formula Prescription', description: correlation.recommendedHerbalFormula },
            { id: 'tongue-2', emoji: '🥣', title: 'The Rod T Organic Congee', description: correlation.theRodTFoodTherapy },
            { id: 'tongue-3', emoji: '👁️', title: 'Wang Zhen Physical Guidance', description: correlation.traditionalPhysicianNote }
          ]
        },
        wuxingInsights: correlation.correlatingFactors
      });
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* 🌟 Header: Wang Zhen Inspection Suite */}
      <div className="glass-panel p-6 bg-gradient-to-r from-[#04161d]/90 via-[#062029]/80 to-[#030e14]/95 border border-cyan-500/30 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Eye className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-chinese font-bold text-lg text-emerald-400 tracking-wider">望诊·舌目皮形神合参</span>
                <div className="h-4 w-[1px] bg-cyan-500/40"></div>
                <h3 className="font-sans font-extrabold text-lg md:text-xl tracking-wider text-white uppercase">
                  Tongue & Physical Inspection <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Correlation Engine</span>
                </h3>
              </div>
              <p className="text-xs font-mono text-cyan-200/70 tracking-widest uppercase mt-0.5">
                She Zhen (Tongue) &bull; Wu Lun (Five Wheels Eyes) &bull; Skin Moisture & Complexion Concordance
              </p>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 mr-1 hidden sm:inline">
              Clinical Presets:
            </span>
            <button
              onClick={() => applyPreset('damp_heat')}
              className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-950/70 text-amber-300 border border-amber-500/30 hover:bg-amber-900/60 transition-colors"
            >
              Damp-Heat
            </button>
            <button
              onClick={() => applyPreset('spleen_def')}
              className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/60 transition-colors"
            >
              Spleen Qi Def
            </button>
            <button
              onClick={() => applyPreset('yin_def')}
              className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-rose-950/70 text-rose-300 border border-rose-500/30 hover:bg-rose-900/60 transition-colors"
            >
              Yin Def Fire
            </button>
            <button
              onClick={() => applyPreset('blood_stasis')}
              className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-purple-950/70 text-purple-300 border border-purple-500/30 hover:bg-purple-900/60 transition-colors"
            >
              Blood Stasis
            </button>
            <button
              onClick={() => applyPreset('harmonious')}
              className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60 transition-colors"
            >
              Harmonious
            </button>
          </div>
        </div>

        {/* 🔬 Center Stage: Holographic Tongue Inspector (Left) & Cross-Correlation Console (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 relative z-10">
          
          {/* LEFT: TONGUE SPECIMEN & TOPOGRAPHY (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-[#030e14]/90 border border-cyan-500/30 relative overflow-hidden shadow-inner flex flex-col items-center">
              
              {/* Specimen Header Controls */}
              <div className="w-full flex items-center justify-between text-xs font-mono mb-3">
                <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  SHE ZHEN (舌诊) SPECIMEN
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setTongue(prev => ({ ...prev, showThermalOverlay: !prev.showThermalOverlay }))}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                      tongue.showThermalOverlay 
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-400/50 shadow' 
                        : 'bg-slate-900 text-slate-500 border-slate-700'
                    }`}
                  >
                    Thermal Spectral
                  </button>
                  <button
                    onClick={() => setTongue(prev => ({ ...prev, showSublingualView: !prev.showSublingualView }))}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                      tongue.showSublingualView 
                        ? 'bg-purple-950 text-purple-300 border-purple-400/50 shadow' 
                        : 'bg-slate-900 text-slate-500 border-slate-700'
                    }`}
                  >
                    Sublingual Veins
                  </button>
                </div>
              </div>

              {/* Dynamic SVG Tongue Specimen */}
              <div className="relative w-64 h-72 flex items-center justify-center my-2">
                {/* Background Hologram Rings */}
                <div className="absolute inset-0 rounded-full border border-cyan-500/20 border-dashed animate-spin-slow"></div>

                {!tongue.showSublingualView ? (
                  /* DORSAL TONGUE SURFACE VIEW (Dorsum) */
                  <svg viewBox="0 0 200 240" className="w-56 h-64 filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
                    <defs>
                      {/* Dynamic Tongue Body Color Gradient */}
                      <linearGradient id="tongueBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={
                          tongue.bodyColor === 'pale' ? '#fecdd3' :
                          tongue.bodyColor === 'red' ? '#e11d48' :
                          tongue.bodyColor === 'crimson' ? '#9f1239' :
                          tongue.bodyColor === 'purple' ? '#581c87' : '#fb7185'
                        } />
                        <stop offset="100%" stopColor={
                          tongue.bodyColor === 'pale' ? '#fda4af' :
                          tongue.bodyColor === 'red' ? '#be123c' :
                          tongue.bodyColor === 'crimson' ? '#881337' :
                          tongue.bodyColor === 'purple' ? '#3b0764' : '#f43f5e'
                        } />
                      </linearGradient>

                      {/* Coating Texture Gradient */}
                      <radialGradient id="coatingGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={
                          tongue.coatingColor.includes('yellow') ? '#fef08a' : '#f1f5f9'
                        } stopOpacity={tongue.coatingColor.includes('thick') ? '0.85' : '0.4'} />
                        <stop offset="80%" stopColor={
                          tongue.coatingColor.includes('yellow') ? '#fde047' : '#cbd5e1'
                        } stopOpacity={tongue.coatingColor.includes('thick') ? '0.6' : '0.15'} />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Tongue Shape Outline with Toothmarks if active */}
                    <path
                      d={
                        tongue.shape === 'swollen_toothmarks'
                          ? "M 100 220 C 50 220 25 180 28 150 C 24 135 32 120 26 105 C 22 90 30 75 28 60 C 26 40 55 15 100 15 C 145 15 174 40 172 60 C 170 75 178 90 174 105 C 168 120 176 135 172 150 C 175 180 150 220 100 220 Z"
                          : tongue.shape === 'thin'
                          ? "M 100 220 C 65 220 45 170 48 130 C 50 80 70 20 100 20 C 130 20 150 80 152 130 C 155 170 135 220 100 220 Z"
                          : "M 100 220 C 45 220 30 170 32 120 C 35 60 60 18 100 18 C 140 18 165 60 168 120 C 170 170 155 220 100 220 Z"
                      }
                      fill="url(#tongueBodyGrad)"
                      stroke={tongue.bodyColor === 'purple' ? '#a855f7' : '#f43f5e'}
                      strokeWidth="2"
                    />

                    {/* Lingual Central Fissure / Median Sulcus */}
                    <path
                      d={tongue.shape === 'cracked' ? "M 100 45 L 98 120 L 102 165 L 99 195" : "M 100 60 L 100 185"}
                      stroke="#4c0519"
                      strokeWidth={tongue.shape === 'cracked' ? "2.5" : "1"}
                      strokeDasharray={tongue.shape === 'cracked' ? "none" : "3 3"}
                      opacity="0.6"
                    />

                    {/* Secondary Cracks if shape is cracked */}
                    {tongue.shape === 'cracked' && (
                      <g stroke="#4c0519" strokeWidth="1.5" opacity="0.65">
                        <line x1="85" y1="110" x2="100" y2="120" />
                        <line x1="115" y1="115" x2="100" y2="120" />
                        <line x1="80" y1="145" x2="100" y2="155" />
                        <line x1="118" y1="150" x2="100" y2="155" />
                      </g>
                    )}

                    {/* Tongue Coating Layer (except peeled) */}
                    {tongue.coatingColor !== 'peeled' && (
                      <ellipse
                        cx="100"
                        cy="125"
                        rx={tongue.coatingColor.includes('thick') ? "55" : "42"}
                        ry={tongue.coatingColor.includes('thick') ? "70" : "55"}
                        fill="url(#coatingGrad)"
                        className="pointer-events-none"
                      />
                    )}

                    {/* Peeled Patch (Mirror / Geographic) */}
                    {tongue.coatingColor === 'peeled' && (
                      <g>
                        <ellipse cx="100" cy="110" rx="35" ry="45" fill="none" stroke="#fb7185" strokeDasharray="3 2" opacity="0.8" />
                        <circle cx="100" cy="110" r="28" fill="#e11d48" opacity="0.6" />
                        <text x="100" y="114" fill="#ffffff" fontSize="9" textAnchor="middle" fontFamily="monospace">Peeled (剥)</text>
                      </g>
                    )}

                    {/* Thermal Overlay Spectrogram Highlights (Organ Topography) */}
                    {tongue.showThermalOverlay && (
                      <g className="pointer-events-none transition-opacity">
                        {/* Tip: Heart / Lung (Fire) */}
                        <circle cx="100" cy="40" r="18" fill="#f43f5e" opacity="0.35" className="animate-pulse" />
                        {/* Center: Spleen / Stomach (Earth) */}
                        <circle cx="100" cy="120" r="24" fill="#f59e0b" opacity="0.3" />
                        {/* Sides: Liver / Gallbladder (Wood) */}
                        <ellipse cx="48" cy="115" rx="10" ry="32" fill="#10b981" opacity="0.3" />
                        <ellipse cx="152" cy="115" rx="10" ry="32" fill="#10b981" opacity="0.3" />
                        {/* Root: Kidney / Bladder (Water) */}
                        <circle cx="100" cy="190" r="20" fill="#06b6d4" opacity="0.3" />
                      </g>
                    )}

                    {/* Interactive Topography Labels */}
                    <g fontSize="9" fontFamily="sans-serif" fill="#ffffff" fontWeight="bold">
                      <text x="100" y="42" textAnchor="middle" fill="#fecdd3" cursor="pointer" onClick={() => setActiveZone('tip')}>HEART/LUNG</text>
                      <text x="100" y="123" textAnchor="middle" fill="#fef08a" cursor="pointer" onClick={() => setActiveZone('center')}>SPLEEN/STOMACH</text>
                      <text x="48" y="118" textAnchor="middle" fill="#a7f3d0" cursor="pointer" onClick={() => setActiveZone('sides')}>LIVER</text>
                      <text x="152" y="118" textAnchor="middle" fill="#a7f3d0" cursor="pointer" onClick={() => setActiveZone('sides')}>GB</text>
                      <text x="100" y="195" textAnchor="middle" fill="#bae6fd" cursor="pointer" onClick={() => setActiveZone('root')}>KIDNEY/ROOT</text>
                    </g>
                  </svg>
                ) : (
                  /* SUBLINGUAL VEIN VIEW (Underside of tongue) */
                  <svg viewBox="0 0 200 240" className="w-56 h-64 filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
                    {/* Underside of Tongue */}
                    <path
                      d="M 100 210 C 50 210 35 160 38 120 C 40 60 70 20 100 20 C 130 20 160 60 162 120 C 165 160 150 210 100 210 Z"
                      fill="#831843"
                      stroke="#be185d"
                      strokeWidth="2"
                    />
                    {/* Lingual Frenulum (Center ligament) */}
                    <line x1="100" y1="40" x2="100" y2="185" stroke="#fbcfe8" strokeWidth="2.5" />
                    
                    {/* Left & Right Sublingual Veins */}
                    {tongue.sublingualVeins === 'engorged_dark' ? (
                      /* Tortuous, engorged dark purple veins (Blood Stasis) */
                      <g stroke="#3b0764" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.95">
                        <path d="M 86 60 Q 75 90 82 120 T 70 160" />
                        <path d="M 114 60 Q 125 90 118 120 T 130 160" />
                        {/* Petechiae / Stasis varicosities */}
                        <circle cx="76" cy="115" r="3.5" fill="#2e1065" />
                        <circle cx="124" cy="120" r="3.5" fill="#2e1065" />
                      </g>
                    ) : (
                      /* Normal slender pink-purple sublingual veins */
                      <g stroke="#9d174d" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7">
                        <path d="M 88 65 Q 82 110 86 155" />
                        <path d="M 112 65 Q 118 110 114 155" />
                      </g>
                    )}

                    <text x="100" y="32" fill="#f472b6" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                      SUBLINGUAL VEIN ARRAYS
                    </text>
                    <text x="100" y="200" fill="#fbcfe8" fontSize="9" textAnchor="middle" fontFamily="sans-serif">
                      {tongue.sublingualVeins === 'engorged_dark' ? 'Severe Blood Stasis (紫黯曲张)' : 'Normal Microcirculation'}
                    </text>
                  </svg>
                )}
              </div>

              {/* Organ Zone Selected Details */}
              <div className="w-full mt-2 p-2.5 rounded-xl bg-[#020b0f] border border-cyan-500/20 text-[11px] font-mono flex items-center justify-between">
                <div>
                  <span className="text-slate-400">Target Topography: </span>
                  <span className="text-cyan-300 font-bold uppercase">{activeZone} Zone</span>
                </div>
                <span className="text-emerald-400">
                  {activeZone === 'tip' && 'Heart / Lungs & Shen'}
                  {activeZone === 'center' && 'Spleen / Stomach Gu Qi'}
                  {activeZone === 'sides' && 'Liver Qi & Gallbladder'}
                  {activeZone === 'root' && 'Kidney Jing & Intestines'}
                </span>
              </div>
            </div>

            {/* Tongue Biomarker Dropdown Selectors */}
            <div className="p-4 rounded-2xl bg-[#04161d]/80 border border-cyan-500/25 space-y-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-cyan-500/20 pb-2">
                <Sliders className="w-3.5 h-3.5" />
                <span>TONGUE PARAMETER CALIBRATION</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Body Color (舌质):</label>
                  <select 
                    value={tongue.bodyColor}
                    onChange={(e) => setTongue(prev => ({ ...prev, bodyColor: e.target.value as any }))}
                    className="w-full p-2 rounded-xl bg-[#020b0f] border border-cyan-500/30 text-white text-xs"
                  >
                    <option value="pale_red">Pale Red (淡红 - Normal)</option>
                    <option value="pale">Pale (淡白 - Deficiency)</option>
                    <option value="red">Red (红 - Heat)</option>
                    <option value="crimson">Crimson (绛 - Extreme Heat)</option>
                    <option value="purple">Purple (紫 - Stasis)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Coating / Fur (舌苔):</label>
                  <select 
                    value={tongue.coatingColor}
                    onChange={(e) => setTongue(prev => ({ ...prev, coatingColor: e.target.value as any }))}
                    className="w-full p-2 rounded-xl bg-[#020b0f] border border-cyan-500/30 text-white text-xs"
                  >
                    <option value="thin_white">Thin White (薄白 - Normal)</option>
                    <option value="thick_white_greasy">Thick White Greasy (白腻 - Cold Damp)</option>
                    <option value="thin_yellow">Thin Yellow (薄黄 - Mild Heat)</option>
                    <option value="thick_yellow_greasy">Thick Yellow Greasy (黄腻 - Damp-Heat)</option>
                    <option value="peeled">Peeled / Mirror (剥苔 - Yin Depletion)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Shape / Morphology (舌形):</label>
                  <select 
                    value={tongue.shape}
                    onChange={(e) => setTongue(prev => ({ ...prev, shape: e.target.value as any }))}
                    className="w-full p-2 rounded-xl bg-[#020b0f] border border-cyan-500/30 text-white text-xs"
                  >
                    <option value="normal">Normal Supple (正常)</option>
                    <option value="swollen_toothmarks">Swollen / Toothmarks (齿痕 - Spleen Qi Def)</option>
                    <option value="thin">Thin / Atrophic (瘦薄 - Blood Def)</option>
                    <option value="cracked">Cracked / Fissured (裂纹 - Fluid Loss)</option>
                    <option value="stiff">Stiff / Rigid (强硬 - Wind Risk)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Moisture / Fluids (津液):</label>
                  <select 
                    value={tongue.moisture}
                    onChange={(e) => setTongue(prev => ({ ...prev, moisture: e.target.value as any }))}
                    className="w-full p-2 rounded-xl bg-[#020b0f] border border-cyan-500/30 text-white text-xs"
                  >
                    <option value="normal">Normal Lustrous (润)</option>
                    <option value="dry">Dry / Rough (燥 - Fluid Exhaustion)</option>
                    <option value="wet_slippery">Wet / Slippery (滑 - Water Damp)</option>
                  </select>
                </div>
              </div>

              {/* Sublingual Vein Toggle Button */}
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-slate-300">Sublingual Vein Engorgement:</span>
                <button
                  onClick={() => setTongue(prev => ({ 
                    ...prev, 
                    sublingualVeins: prev.sublingualVeins === 'normal' ? 'engorged_dark' : 'normal',
                    showSublingualView: true
                  }))}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                    tongue.sublingualVeins === 'engorged_dark'
                      ? 'bg-purple-950 text-purple-300 border-purple-400'
                      : 'bg-[#020b0f] text-slate-400 border-slate-700'
                  }`}
                >
                  {tongue.sublingualVeins === 'engorged_dark' ? 'Engorged Dark (Stasis)' : 'Normal Pink'}
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: PHYSICAL INSPECTION CORRELATION CONSOLE (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* 1. Eye (Five Wheels) & Skin Parameters Selector Panel */}
            <div className="p-5 rounded-2xl bg-[#04141c]/90 border border-cyan-500/25 space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300">
                    Physical Inspection Variables (Eyes & Skin)
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">Wang Zhen Integration</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Eye (Five Wheels 五轮学说) Controls */}
                <div className="space-y-2.5 p-3.5 rounded-xl bg-[#020b0f] border border-cyan-500/20">
                  <div className="text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>EYE FIVE WHEELS (五轮学说)</span>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Sclera Color (White Wheel - Metal/Lung):</label>
                    <select
                      value={eye.sclera}
                      onChange={(e) => setEye(prev => ({ ...prev, sclera: e.target.value as any }))}
                      className="w-full p-1.5 rounded-lg bg-[#04161d] border border-cyan-500/30 text-white text-xs"
                    >
                      <option value="porcelain_white">Porcelain White (正常 - Healthy)</option>
                      <option value="yellowish">Yellowish / Icteric (黄染 - Damp-Heat / Liver)</option>
                      <option value="bloodshot">Bloodshot / Capillaries (血丝 - Heat / Wind)</option>
                      <option value="pale_dusky">Pale Dusky (暗淡 - Blood Deficiency)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Canthi Corners (Blood Wheel - Fire/Heart):</label>
                    <select
                      value={eye.canthi}
                      onChange={(e) => setEye(prev => ({ ...prev, canthi: e.target.value as any }))}
                      className="w-full p-1.5 rounded-lg bg-[#04161d] border border-cyan-500/30 text-white text-xs"
                    >
                      <option value="normal_pink">Normal Soft Pink (正常)</option>
                      <option value="inflamed_red">Inflamed Bright Red (目眦红赤 - Heart Fire)</option>
                      <option value="pale">Pale Blanched (淡白 - Blood Deficiency)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Eyelids (Flesh Wheel - Earth/Spleen):</label>
                    <select
                      value={eye.eyelids}
                      onChange={(e) => setEye(prev => ({ ...prev, eyelids: e.target.value as any }))}
                      className="w-full p-1.5 rounded-lg bg-[#04161d] border border-cyan-500/30 text-white text-xs"
                    >
                      <option value="normal">Normal (正常)</option>
                      <option value="puffy_edematous">Puffy / Edematous (眼睑浮肿 - Spleen Damp)</option>
                      <option value="dark_circles">Dark Rings / Sunken (眼眶黑 - Stasis/Kidney)</option>
                    </select>
                  </div>
                </div>

                {/* Skin Texture, Moisture & Complexion Controls */}
                <div className="space-y-2.5 p-3.5 rounded-xl bg-[#020b0f] border border-cyan-500/20">
                  <div className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SKIN MOISTURE & LUSTER (皮毛与色诊)</span>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Skin Hydration / Sebum Level:</label>
                    <select
                      value={skin.moisture}
                      onChange={(e) => setSkin(prev => ({ ...prev, moisture: e.target.value as any }))}
                      className="w-full p-1.5 rounded-lg bg-[#04161d] border border-cyan-500/30 text-white text-xs"
                    >
                      <option value="balanced_hydrated">Balanced Hydrated (润泽 - Harmonious)</option>
                      <option value="dry_flaky">Dry / Flaky / Pruritic (干燥起屑 - Yin/Blood Def)</option>
                      <option value="oily_greasy">Oily / Greasy / Seborrheic (油腻 - Damp-Heat)</option>
                      <option value="clammy_sweat">Clammy / Cold Sweat (自汗多 - Yang Def)</option>
                      <option value="puffy_edema">Puffy / Pitting Edema (水肿 - Water Retention)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Facial Complexion Luster (Se Ze 色泽):</label>
                    <select
                      value={skin.complexion}
                      onChange={(e) => setSkin(prev => ({ ...prev, complexion: e.target.value as any }))}
                      className="w-full p-1.5 rounded-lg bg-[#04161d] border border-cyan-500/30 text-white text-xs"
                    >
                      <option value="radiant_you_shen">Radiant / You Shen (有神 - Vibrant Vitality)</option>
                      <option value="sallow_yellow">Sallow Yellow (萎黄 - Spleen Qi Def)</option>
                      <option value="malar_flush">Malar Flush (午后潮红 - Yin Def Fire)</option>
                      <option value="pale_white">Pale White (苍白 - Qi-Blood Def)</option>
                      <option value="ashen_dark">Ashen Dark (晦暗 - Kidney Def / Stasis)</option>
                    </select>
                  </div>

                  {/* Micro Visual Summary Badge */}
                  <div className="pt-2 text-[10px] font-mono text-cyan-300 flex items-center justify-between">
                    <span>Shen Presence:</span>
                    <span className="text-emerald-400 font-bold">
                      {skin.complexion === 'radiant_you_shen' ? 'You Shen (有神 - Intact)' : 'Deficient / Burdened'}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* 2. THE CORRELATION SYNTHESIS MATRIX (The Real Traditional Doctor's Rationale) */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#062029]/95 via-[#04161d]/90 to-[#020b0f] border border-cyan-400/40 space-y-4 shadow-xl">
              
              {/* Header with Concordance Score */}
              <div className="flex items-center justify-between border-b border-cyan-500/25 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                    CROSS-MODAL CONCORDANCE MATRIX (四诊合参·望诊验证)
                  </span>
                  <h4 className="text-base font-bold text-white font-serif mt-0.5">
                    {correlation.primarySyndrome}
                  </h4>
                  <span className="text-xs font-chinese text-emerald-400 font-semibold">{correlation.chineseSyndrome}</span>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-extrabold font-mono text-cyan-300 flex items-center justify-end gap-1">
                    <span>{correlation.concordanceScore}</span>
                    <span className="text-sm font-normal text-slate-400">%</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-400/40">
                    {correlation.patternStrength}
                  </span>
                </div>
              </div>

              {/* Physician's Insight Paragraph */}
              <div className="space-y-2">
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {correlation.clinicalInsight}
                </p>

                {/* Correlating Factors Checklist */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                    Correlating Clinical Biomarkers:
                  </span>
                  {correlation.correlatingFactors.map((factor, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traditional Doctor's Rule of Thumb Note */}
              <div className="p-3.5 rounded-xl bg-[#020b0f]/80 border border-amber-500/30 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-[10px] uppercase">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>TRADITIONAL DOCTOR'S CLINICAL HEURISTIC</span>
                </div>
                <p className="text-slate-300 font-serif italic text-xs leading-relaxed">
                  "{correlation.traditionalPhysicianNote}"
                </p>
              </div>

              {/* Recommended Formula & The Rod T Food Nutrition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/25">
                  <span className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">
                    Canonical Formula (方剂):
                  </span>
                  <div className="text-white font-bold">{correlation.recommendedHerbalFormula}</div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/25">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold block mb-1">
                    The Rod T Congee & Teas:
                  </span>
                  <div className="text-slate-200 text-[11px] leading-snug">{correlation.theRodTFoodTherapy}</div>
                </div>
              </div>

              {/* Action Button: Sync into Diagnostic Dossier */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handlePushToDiagnosticReport}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 text-white font-mono text-xs font-bold shadow-lg shadow-cyan-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 border border-cyan-400/40"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Commit Findings to Comprehensive Diagnostic Dossier</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
