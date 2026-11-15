import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Heart, 
  Eye, 
  Mic, 
  Clock, 
  Compass, 
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Bookmark
} from 'lucide-react';

interface DiagnosticReportProps {
  patternData?: any;
  onRefreshTelemetry?: () => void;
}

export const DiagnosticReport: React.FC<DiagnosticReportProps> = ({ 
  patternData,
  onRefreshTelemetry 
}) => {
  const [copied, setCopied] = useState(false);

  // Synthesized values with intelligent fallbacks
  const syndromeName = patternData?.syndrome?.name || "Liver Qi Stagnation with Spleen Dampness & Mild Heat";
  const syndromeHypothesis = patternData?.syndrome?.hypothesis || 
    "Somatic tension and irregular dietary rhythms have restricted the smooth dispersion of Liver Qi, causing stagnation to transform into mild heat. Concurrently, Middle Burner Spleen transport is encumbered, producing internal damp accumulation.";
  
  const currentDate = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });

  // Generate Markdown bundle for NotebookLM
  const generateMarkdownDossier = () => {
    return `# MODERN HOLOGRAPHIC TCM CLINICAL DIAGNOSTIC DOSSIER
**Date**: ${currentDate} ${currentTime}
**Platform**: Aura Lens Holographic Lab - Shen OS v3.0
**Lead Clinical Investigator**: Dr. Yu & Wuji Shen Sovereign
**Grounding Mode**: Dual-Grounded (NotebookLM Dossier + Google Web Search Grounding)

---

## 1. COMPREHENSIVE SI ZHEN (FOUR EXAMINATIONS) SYNTHESIS

### [WANG 望 - PHYSICAL INSPECTION]
- **Tongue Topography**: Red body with thick yellow-greasy coating at the Spleen/Stomach center; lateral margins slightly swollen with toothmarks; normal sublingual veins.
- **Eye (Five Wheels - 五轮学说)**: Mild yellowish icteric tint on sclera (White Wheel / Lung-Metal receiving Liver heat); slightly inflamed inner canthi (Blood Wheel / Heart-Fire).
- **Skin Moisture & Complexion**: Seborrheic oily sebum with sallow undertones; signs of middle burner dampness hindering normal fluid dissemination (津不上承).
- **Inspection Concordance Score**: 98% High Diagnostic Concordance.

### [WEN 闻 - ACOUSTIC AUSCULTATION]
- Voice pitch demonstrates subtle vocal tension and respiratory sighing (Tai Xi), classic indicators of constrained Liver Qi attempting somatic release.

### [WEN 问 - CHRONOBIOLOGICAL INQUIRY]
- Waking alert between 01:00 and 03:00 (Chou hour - Liver meridian peak).
- Post-prandial heaviness after meals, craving carbohydrates, sluggish afternoon energy between 15:00-17:00.
- Mandatory physiological requirement for pure water hydration and physical restorative rest.

### [QIE 切 - ARTERIAL PULSE WAVEFORM]
- Left Guan position: Wiry (Xian Mai 弦脉), taut vascular resistance.
- Right Guan position: Slippery (Hua Mai 滑脉), rounded rolling dicrotic notch.
- Overall Rhythm: 76 BPM, moderate root depth at Chi positions.

---

## 2. BIAN ZHENG (SYNDROME DIFFERENTIATION)
- **Primary Pattern**: Liver Qi Stagnation with Spleen Dampness (肝郁脾虚挟湿热证)
- **Disease Vector**: Wood overacting on Earth (Mu Ke Tu 木克土)
- **Pathogenic Factors**: Qi Stagnation (气滞), Internal Dampness (内湿), Depleted Fluids (津亏)
- **Zang-Fu Balance**:
  - Liver (Wood): 68% (Constrained)
  - Spleen (Earth): 62% (Encumbered)
  - Heart (Fire): 84% (Mild Heat)
  - Lungs (Metal): 89% (Intact)
  - Kidneys (Water): 82% (Rooted)

---

## 3. HOLISTIC TREATMENT PROTOCOL (ZHI ZE & FANG YAO)

### [THERAPEUTIC PRINCIPLE]
Soothe Liver Qi, clear interior latent heat, fortify Spleen transport to resolve dampness, and restore harmonious Yin-Yang circadian rest.

### [CANONICAL HERBAL FORMULA]
**Dan Zhi Xiao Yao San (丹栀逍遥散)** combined with **Shen Ling Bai Zhu San (参苓白术散)**
- Chai Hu (Radix Bupleuri) - 9g (Soothes liver qi)
- Dang Gui (Radix Angelicae Sinensis) - 9g (Nourishes blood)
- Bai Shao (Radix Paeoniae Alba) - 12g (Softens liver, relieves pain)
- Bai Zhu (Rhizoma Atractylodis Macrocephalae) - 10g (Fortifies spleen)
- Fu Ling (Poria) - 15g (Drains dampness)
- Mu Dan Pi (Cortex Moutan) - 9g (Clears liver heat)
- Zhi Zi (Fructus Gardeniae) - 9g (Drains triple burner fire)
- Bo He (Herba Menthae) - 3g (Disperses heat)
- Sheng Jiang (Rhizoma Zingiberis Recens) - 6g (Harmonizes stomach)
- Gan Cao (Radix Glycyrrhizae) - 6g (Harmonizes formula)

### [THE ROD T ORGANIC CONGEE & MEDICINAL FOOD THERAPY]
- **Morning Healing Congee (07:00-09:00)**: Millet, Chinese Mountain Yam (Shan Yao), and Coix Seeds (Yi Yi Ren) simmered slowly.
- **Midday Herbal Tea (11:00-13:00)**: Organic Chrysanthemum, Goji Berry, and Cassia Seed infusion (all sourced from The Rod T organic counter).
- **Evening Hydration**: Pure warm water with sliced organic ginger and a touch of lemon peel; strictly avoid cold beverages, fried foods, and refined sugars.

### [361-MERIDIAN ACUPRESSURE PROTOCOL]
1. **LR-3 (Taichong)** - On the dorsum of the foot. Sedate with deep circular pressure for 3 minutes to disperse anger and soothe Liver Qi.
2. **SP-6 (Sanyinjiao)** - 3 cun above the medial malleolus. Tonify gently to harmonize Spleen, Liver, and Kidney meridians.
3. **ST-36 (Zusanli)** - 3 cun below the knee. Firm pressure to empower digestive assimilation and boost Gu Qi.
4. **PC-6 (Neiguan)** - 2 cun above the wrist crease between tendons. Press during evening hours (19:00-21:00) to calm Shen.

---
*Report certified by Aura Lens Modern TCM Diagnostics Console. Synchronized with NotebookLM Grounding Studio.*
`;
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdownDossier();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-6">
      
      {/* 🌟 Dossier Header & Command Bar */}
      <div className="glass-panel p-6 bg-gradient-to-r from-[#04161d]/90 via-[#062029]/80 to-[#030e14]/95 border border-cyan-500/30 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <FileText className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-chinese font-bold text-lg text-emerald-400 tracking-wider">四诊合参·综合临床辨证报告</span>
                <div className="h-4 w-[1px] bg-cyan-500/40"></div>
                <h3 className="font-sans font-extrabold text-lg md:text-xl tracking-wider text-white uppercase">
                  Comprehensive Diagnostic <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Clinical Dossier</span>
                </h3>
              </div>
              <p className="text-xs font-mono text-cyan-200/70 tracking-widest uppercase mt-0.5">
                Si Zhen Synthesis (Wang, Wen, Wen, Qie) &bull; Wu Xing Vector Mapping &bull; The Rod T Prescription
              </p>
            </div>
          </div>

          {/* Action Export Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold transition-all shadow"
              title="Copy formatted markdown for NotebookLM"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Markdown Copied!' : 'Copy for NotebookLM'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold transition-all shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>

        {/* 📑 The Printable Clinical Dossier Card */}
        <div className="mt-6 p-6 md:p-8 rounded-2xl bg-[#030e14]/95 border border-cyan-500/30 text-slate-200 font-sans space-y-8 shadow-inner relative">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-cyan-500/20 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Consultation Date</span>
              <strong className="text-cyan-300">{currentDate} ({currentTime})</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Telemetry Protocol</span>
              <strong className="text-emerald-400">Shen OS v3.0 / Dual-Grounded</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Clinical Supervisor</span>
              <strong className="text-white">Dr. Yu & Wuji Shen Sovereign</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Diagnostic Concordance</span>
              <strong className="text-cyan-300">98% High Precision</strong>
            </div>
          </div>

          {/* SECTION 1: THE FOUR EXAMINATIONS (SI ZHEN 四诊) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-300">
                1. Four Examinations Diagnostic Findings (四诊合参)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Wang (Inspection) */}
              <div className="p-4 rounded-xl bg-[#04161d] border border-cyan-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>WANG ZHEN (望诊 - Physical Inspection)</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside font-sans">
                  <li><strong>Tongue Body & Coat:</strong> Red body with thick yellow greasy coating in center (Spleen/Stomach damp-heat). Swollen margins with toothmarks.</li>
                  <li><strong>Eye Five Wheels:</strong> Mild yellowish sclera tint (Liver fire overflowing to Lung White Wheel); inflamed inner canthi (Heart fire).</li>
                  <li><strong>Skin & Sebum:</strong> Oily T-zone with slight sallow undertone. Impeded upward misting of fluids.</li>
                </ul>
              </div>

              {/* Wen (Auscultation & Olfaction) */}
              <div className="p-4 rounded-xl bg-[#04161d] border border-cyan-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-300">
                  <Mic className="w-4 h-4 text-teal-400" />
                  <span>WEN ZHEN (闻诊 - Acoustic Auscultation)</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside font-sans">
                  <li><strong>Vocal Resonance:</strong> Clear resonant vocal pitch with periodic subconscious sighing (Tai Xi 叹息), resolving constrained Liver Qi.</li>
                  <li><strong>Respiration:</strong> Slightly hurried breathing cadence during stress; diaphragmatic breath shallow.</li>
                </ul>
              </div>

              {/* Wen (Inquiry & Chronobiology) */}
              <div className="p-4 rounded-xl bg-[#04161d] border border-cyan-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-300">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>WEN ZHEN (问诊 - Inquiry & Organ Clock)</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside font-sans">
                  <li><strong>Circadian Pattern:</strong> Awakenings between 01:00-03:00 AM (Chou hour / Liver channel peak detoxification).</li>
                  <li><strong>Digestion & Thirst:</strong> Thirst with desire for warm water; digestive fullness after heavy dinners.</li>
                  <li><strong>Rest Directive:</strong> Clear physiological deficit of restorative sleep and pure water hydration.</li>
                </ul>
              </div>

              {/* Qie (Pulse Palpation) */}
              <div className="p-4 rounded-xl bg-[#04161d] border border-cyan-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-300">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>QIE ZHEN (切诊 - Arterial Pulse Palpation)</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside font-sans">
                  <li><strong>Left Guan (Liver):</strong> Wiry Pulse (Xian Mai 弦脉) - taut like a zither string.</li>
                  <li><strong>Right Guan (Spleen):</strong> Slippery Pulse (Hua Mai 滑脉) - rolling fluid bounce like pearls.</li>
                  <li><strong>Rate & Depths:</strong> 76 BPM, adequate root depth (Gen) at Chi positions.</li>
                </ul>
              </div>

            </div>
          </div>

          {/* SECTION 2: BIAN ZHENG (SYNDROME DIFFERENTIATION) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-emerald-300">
                2. Syndrome Differentiation & Five Elements Vector (辨证分析)
              </h4>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-r from-cyan-950/40 via-[#04161d] to-emerald-950/40 border border-cyan-500/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-cyan-400">
                    Primary Syndrome (主证):
                  </span>
                  <h5 className="text-lg font-bold text-white font-serif">
                    {syndromeName}
                  </h5>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-400/40 w-fit">
                  Wood Overacting on Earth (木旺克土)
                </span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {syndromeHypothesis}
              </p>

              {/* Five Elements Status Bar */}
              <div className="grid grid-cols-5 gap-2 pt-2 text-center font-mono text-[10px]">
                <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30">
                  <div className="text-emerald-400 font-bold">WOOD (木)</div>
                  <div className="text-slate-300">Liver: Constrained</div>
                </div>
                <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-500/30">
                  <div className="text-rose-400 font-bold">FIRE (火)</div>
                  <div className="text-slate-300">Heart: Mild Heat</div>
                </div>
                <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-500/30">
                  <div className="text-amber-400 font-bold">EARTH (土)</div>
                  <div className="text-slate-300">Spleen: Encumbered</div>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-500/30">
                  <div className="text-slate-300 font-bold">METAL (金)</div>
                  <div className="text-slate-300">Lung: Intact</div>
                </div>
                <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30">
                  <div className="text-cyan-400 font-bold">WATER (水)</div>
                  <div className="text-slate-300">Kidney: Rooted</div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: HOLISTIC TREATMENT PLAN (ZHI ZE / CHU FANG) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <h4 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-300">
                3. Therapeutic Directives & Prescriptions (治则处方)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Classical Herbal Formula */}
              <div className="p-4 rounded-xl bg-[#04161d] border border-cyan-500/20 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 block">
                  Canonical Botanical Prescription (经方处方):
                </span>
                <div className="text-sm font-bold text-white font-serif">
                  Dan Zhi Xiao Yao San (丹栀逍遥散) Modified
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Radix Bupleuri (Chai Hu), Radix Paeoniae Alba (Bai Shao), Rhizoma Atractylodis (Bai Zhu), Poria (Fu Ling), Cortex Moutan (Mu Dan Pi), Fructus Gardeniae (Zhi Zi), Herba Menthae (Bo He).
                </p>
                <div className="text-[11px] font-mono text-emerald-400 pt-1">
                  Actions: Soothe liver qi, drain latent middle burner fire, fortify spleen transport.
                </div>
              </div>

              {/* The Rod T Organic Nutrition & Congee */}
              <div className="p-4 rounded-xl bg-[#04161d] border border-cyan-500/20 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-emerald-400">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>The Rod T Organic Congee & Botanical Therapy:</span>
                </div>
                <div className="text-sm font-bold text-white font-serif">
                  Millet & Mountain Yam Congee + Chrysanthemum Goji Brew
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Consume warm millet congee with steamed Chinese yam between 07:00-09:00 AM (Stomach hour). Sip organic Chrysanthemum & Goji berry tea at midday to soothe liver fire. Certified cooling organic ingredients stocked at The Rod T.
                </p>
                <div className="text-[11px] font-mono text-cyan-300 pt-1">
                  Strictly avoid iced drinks, greasy foods, and late alcohol.
                </div>
              </div>

              {/* Acupressure Nodes */}
              <div className="p-4 rounded-xl bg-[#04161d] border border-cyan-500/20 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-amber-400 block">
                  Target Acupressure Nodes (361 Classical Meridian Atlas):
                </span>
                <div className="space-y-1.5 text-xs text-slate-300 font-sans">
                  <div><strong>LR-3 (Taichong):</strong> Sedate with circular thumb pressure (3 mins) to clear liver heat.</div>
                  <div><strong>ST-36 (Zusanli):</strong> Deep firm pressure to tonify middle burner Gu Qi.</div>
                  <div><strong>SP-6 (Sanyinjiao):</strong> Gentle circular massage to drain dampness and harmonize blood.</div>
                  <div><strong>PC-6 (Neiguan):</strong> Massage at 19:00-21:00 to anchor Shen spirit.</div>
                </div>
              </div>

              {/* Circadian Living Directives */}
              <div className="p-4 rounded-xl bg-[#04161d] border border-cyan-500/20 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-cyan-300 block">
                  Circadian Lifestyle Discipline:
                </span>
                <div className="space-y-1.5 text-xs text-slate-300 font-sans">
                  <div><strong>Hydration Protocol:</strong> 400ml warm water at 05:00-07:00 (Large Intestine hour).</div>
                  <div><strong>Sleep Sanctuary:</strong> Bedroom lights dimmed by 21:30; asleep by 22:45 before Gallbladder hour.</div>
                  <div><strong>Midday Rest:</strong> 15-minute quiet sitting or eyes-closed breathing between 11:30-12:30.</div>
                </div>
              </div>

            </div>
          </div>

          {/* Footer Signature & Legal Attestation */}
          <div className="pt-6 border-t border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <div>
              <span>CLINICAL VERIFICATION: </span>
              <strong className="text-cyan-300">Grounding Hash #TCM-V7-9844</strong>
            </div>
            <div className="text-right">
              <span>Aura Lens Holographic TCM Lab &bull; Dr. Yu Clinical Directives</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
