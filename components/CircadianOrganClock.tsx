import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Clock,
  Activity,
  Sparkles,
  Sliders,
  RotateCcw,
  Compass,
  AlertTriangle,
  ShoppingBag,
  Sun,
  Moon,
  ArrowRight,
  Zap,
  Waves
} from 'lucide-react';

export interface OrganPeriod {
  start: number;
  end: number;
  midpoint: number;
  organ: string;
  chinese: string;
  earthBranch: string;
  element: 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
  zangFuType: 'Zang (Yin Solid)' | 'Fu (Yang Hollow)';
  pairedOrgan: string;
  emoji: string;
  color: string;
  glow: string;
  yinYang: 'Yang (Daylight Active)' | 'Yin (Night Consolidation)';
  peakAction: string;
  ebbOpposite: string;
  pathologyFlags: string;
  lifestyleGuideline: string;
  theRodTNutrition: string;
  primaryAcupoint: string;
}

export const ORGAN_PERIODS: OrganPeriod[] = [
  {
    start: 23, end: 1, midpoint: 0, organ: 'Gallbladder', chinese: '胆经', earthBranch: '子时 (Zi)',
    element: 'Wood', zangFuType: 'Fu (Yang Hollow)', pairedOrgan: 'Liver (肝)', emoji: '⚡', color: '#34d399', glow: 'rgba(52, 211, 153, 0.4)',
    yinYang: 'Yin (Night Consolidation)',
    peakAction: 'Initial deep sleep phase, cellular DNA repair, bile fluid generation, and moral/decision-making courage.',
    ebbOpposite: 'Heart (11:00 - 13:00)',
    pathologyFlags: 'Insomnia, indecisiveness, waking with a bitter taste in the mouth, midnight migraine, or rib-side tightness.',
    lifestyleGuideline: 'Must be in deep sleep before 23:00. Avoid late-night snacking, alcohol, and blue light screens.',
    theRodTNutrition: 'Organic Chamomile & Sour Jujube Seed (Suan Zao Ren) tea from The Rod T.',
    primaryAcupoint: 'GB-34 (Yanglingquan) - Relaxes sinews and clears damp-heat.'
  },
  {
    start: 1, end: 3, midpoint: 2, organ: 'Liver', chinese: '肝经', earthBranch: '丑时 (Chou)',
    element: 'Wood', zangFuType: 'Zang (Yin Solid)', pairedOrgan: 'Gallbladder (胆)', emoji: '🌳', color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)',
    yinYang: 'Yin (Night Consolidation)',
    peakAction: 'Blood detoxification, deep hepatic renewal, storing Blood in the liver, and smoothing internal emotional Qi.',
    ebbOpposite: 'Small Intestine (13:00 - 15:00)',
    pathologyFlags: 'Waking alert between 1–3 AM, irritability, dream-disturbed sleep, rising Liver Fire, dry eyes upon waking.',
    lifestyleGuideline: 'Deep unconscious sleep is non-negotiable so stored blood returns to the liver to be cleansed.',
    theRodTNutrition: 'Organic Goji berry and Chrysanthemum infusion from The Rod T organic counter.',
    primaryAcupoint: 'LR-3 (Taichong) - Soothes constrained Qi and anchors Liver Fire.'
  },
  {
    start: 3, end: 5, midpoint: 4, organ: 'Lungs', chinese: '肺经', earthBranch: '寅时 (Yin)',
    element: 'Metal', zangFuType: 'Zang (Yin Solid)', pairedOrgan: 'Large Intestine (大肠)', emoji: '💨', color: '#e2e8f0', glow: 'rgba(226, 232, 240, 0.4)',
    yinYang: 'Yin (Night Consolidation)',
    peakAction: 'Deep cellular oxygenation, distribution of defensive Wei Qi across meridians, and regulating water passages.',
    ebbOpposite: 'Bladder (15:00 - 17:00)',
    pathologyFlags: 'Waking with sudden dry cough, grief or sadness, chest congestion, or early-morning asthma exacerbation.',
    lifestyleGuideline: 'Maintain warm bedroom air. Practice gentle diaphragmatic breathing upon awakening; avoid cold drafts.',
    theRodTNutrition: 'Steamed Asian pear with organic Tremella (snow fungus) from The Rod T.',
    primaryAcupoint: 'LU-9 (Taiyuan) - Tonifies Lung Qi and strengthens vascular pulsation.'
  },
  {
    start: 5, end: 7, midpoint: 6, organ: 'Large Intestine', chinese: '大肠经', earthBranch: '卯时 (Mao)',
    element: 'Metal', zangFuType: 'Fu (Yang Hollow)', pairedOrgan: 'Lungs (肺)', emoji: '🌿', color: '#cbd5e1', glow: 'rgba(203, 213, 225, 0.4)',
    yinYang: 'Yang (Daylight Active)',
    peakAction: 'Somatic awakening, physiological peristalsis, elimination of metabolic waste, and morning mucosal hydration.',
    ebbOpposite: 'Kidneys (17:00 - 19:00)',
    pathologyFlags: 'Constipation, sluggish morning bowel movement, abdominal bloating, or skin blemishes.',
    lifestyleGuideline: 'Drink 300–500ml of warm pure water immediately upon waking. Do not rush the morning evacuation.',
    theRodTNutrition: 'Warm water with soaked chia seeds and organic stewed prunes from The Rod T.',
    primaryAcupoint: 'LI-4 (Hegu) - Clears heat, stimulates peristalsis, and expels wind.'
  },
  {
    start: 7, end: 9, midpoint: 8, organ: 'Stomach', chinese: '胃经', earthBranch: '辰时 (Chen)',
    element: 'Earth', zangFuType: 'Fu (Yang Hollow)', pairedOrgan: 'Spleen (脾)', emoji: '🥣', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)',
    yinYang: 'Yang (Daylight Active)',
    peakAction: 'Highest digestive enzyme activity; optimal assimilation of warm, nourishing Gu Qi (food essence).',
    ebbOpposite: 'Pericardium (19:00 - 21:00)',
    pathologyFlags: 'Skipping breakfast leads to Stomach Fire, acid reflux, morning nausea, or mid-morning energy crashes.',
    lifestyleGuideline: 'Eat a warm, nutrient-dense breakfast (congee, oatmeal, poached eggs). Avoid cold iced smoothies.',
    theRodTNutrition: 'Freshly prepared Millet & Chinese Mountain Yam (Shan Yao) Congee from The Rod T.',
    primaryAcupoint: 'ST-36 (Zusanli) - Renowned longevity point; fortifies Stomach and overall Qi.'
  },
  {
    start: 9, end: 11, midpoint: 10, organ: 'Spleen', chinese: '脾经', earthBranch: '巳时 (Si)',
    element: 'Earth', zangFuType: 'Zang (Yin Solid)', pairedOrgan: 'Stomach (胃)', emoji: '🌾', color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.4)',
    yinYang: 'Yang (Daylight Active)',
    peakAction: 'Transformation of digested food essence into pure Blood and Qi; peak cognitive focus and muscle tone.',
    ebbOpposite: 'Triple Burner (21:00 - 23:00)',
    pathologyFlags: 'Brain fog, heavy limbs, craving sweets, loose stools, or post-prandial fatigue.',
    lifestyleGuideline: 'Peak hours for high-focus intellectual work. Avoid cold drinks; sip warm water or light roasted tea.',
    theRodTNutrition: 'Warm roasted barley tea and lotus seed infusion from The Rod T.',
    primaryAcupoint: 'SP-6 (Sanyinjiao) - Harmonizes Spleen, Liver, and Kidney Yin meridians.'
  },
  {
    start: 11, end: 13, midpoint: 12, organ: 'Heart', chinese: '心经', earthBranch: '午时 (Wu)',
    element: 'Fire', zangFuType: 'Zang (Yin Solid)', pairedOrgan: 'Small Intestine (小肠)', emoji: '❤️', color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)',
    yinYang: 'Yang (Daylight Active)',
    peakAction: 'Solar zenith & peak Yang Qi; blood circulation, radiant Shen (spirit), clarity, and cardiovascular vigor.',
    ebbOpposite: 'Gallbladder (23:00 - 01:00)',
    pathologyFlags: 'Palpitations, sudden midday anxiety, restlessness, flushed face, or rapid/irregular pulse.',
    lifestyleGuideline: 'Enjoy a light, wholesome lunch followed by a 15–20 minute eyes-closed restorative rest to nourish Heart Yin.',
    theRodTNutrition: 'Organic red date & lotus seed broth, or calming wild rose tea from The Rod T.',
    primaryAcupoint: 'HT-7 (Shenmen) - Calms the Spirit (Shen), relieves anxiety, and steadies heart rhythm.'
  },
  {
    start: 13, end: 15, midpoint: 14, organ: 'Small Intestine', chinese: '小肠经', earthBranch: '未时 (Wei)',
    element: 'Fire', zangFuType: 'Fu (Yang Hollow)', pairedOrgan: 'Heart (心)', emoji: '🏺', color: '#fb7185', glow: 'rgba(251, 113, 133, 0.4)',
    yinYang: 'Yang (Daylight Active)',
    peakAction: 'Separating the clear (pure nutrients) from the turbid (metabolic waste); micro-nutrient absorption.',
    ebbOpposite: 'Liver (01:00 - 03:00)',
    pathologyFlags: 'Poor nutrient absorption, post-lunch bloating, gas, mild dehydration, or neck and shoulder stiffness.',
    lifestyleGuideline: 'Hydrate steadily with warm water to assist nutrient distribution. Take a gentle mindful stroll.',
    theRodTNutrition: 'Organic hawthorn berry & roasted malt digestive tea from The Rod T.',
    primaryAcupoint: 'SI-3 (Houxi) - Opens the Governing Vessel, releases neck and upper back tension.'
  },
  {
    start: 15, end: 17, midpoint: 16, organ: 'Bladder', chinese: '膀胱经', earthBranch: '申时 (Shen)',
    element: 'Water', zangFuType: 'Fu (Yang Hollow)', pairedOrgan: 'Kidneys (肾)', emoji: '💧', color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.4)',
    yinYang: 'Yang (Daylight Active)',
    peakAction: 'Fluid balance, excretion of liquid metabolic wastes, spinal cerebrospinal nourishment, and secondary energy peak.',
    ebbOpposite: 'Lungs (03:00 - 05:00)',
    pathologyFlags: 'Afternoon energy slump, burning or frequent urination, lower back soreness, or afternoon tension headache.',
    lifestyleGuideline: 'Drink pure water or light green tea. Ideal window for physical exercise or completing demanding tasks.',
    theRodTNutrition: 'Organic corn silk & dandelion root cleansing infusion from The Rod T.',
    primaryAcupoint: 'BL-23 (Shenshu) - Nourishes Kidney Water and fortifies the lumbar spine.'
  },
  {
    start: 17, end: 19, midpoint: 18, organ: 'Kidneys', chinese: '肾经', earthBranch: '酉时 (You)',
    element: 'Water', zangFuType: 'Zang (Yin Solid)', pairedOrgan: 'Bladder (膀胱)', emoji: '🌊', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)',
    yinYang: 'Yin (Night Consolidation)',
    peakAction: 'Consolidation of Jing (primordial essence), bone marrow nourishment, endocrine recovery, and adrenal rest.',
    ebbOpposite: 'Large Intestine (05:00 - 07:00)',
    pathologyFlags: 'Twilight exhaustion, lower back chill, cold extremities, tinnitus, or unexplained fear sensations.',
    lifestyleGuideline: 'Transition from active labor to domestic stillness. Enjoy a light, warm dinner without excess salt.',
    theRodTNutrition: 'Black bean, walnut, and black sesame congee from The Rod T.',
    primaryAcupoint: 'KI-3 (Taixi) - Primary Yuan-Source point to tonify both Kidney Yin and Yang.'
  },
  {
    start: 19, end: 21, midpoint: 20, organ: 'Pericardium', chinese: '心包经', earthBranch: '戌时 (Xu)',
    element: 'Fire', zangFuType: 'Zang (Yin Solid)', pairedOrgan: 'Triple Burner (三焦)', emoji: '🛡️', color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)',
    yinYang: 'Yin (Night Consolidation)',
    peakAction: 'Heart protector shield, vascular ease, circulating emotional warmth, and parasympathetic wind-down.',
    ebbOpposite: 'Stomach (07:00 - 09:00)',
    pathologyFlags: 'Tightness in the chest, emotional hyper-reactivity, palpitations when resting, or inability to unwind.',
    lifestyleGuideline: 'Spend calm time with loved ones, read, or practice gentle Yin yoga and meditation. Avoid intense cardio.',
    theRodTNutrition: 'Warm golden milk with organic turmeric, ginger, and raw honey from The Rod T.',
    primaryAcupoint: 'PC-6 (Neiguan) - Legendary chest opener; harmonizes emotions and settles the stomach.'
  },
  {
    start: 21, end: 23, midpoint: 22, organ: 'Triple Burner', chinese: '三焦经', earthBranch: '亥时 (Hai)',
    element: 'Fire', zangFuType: 'Fu (Yang Hollow)', pairedOrgan: 'Pericardium (心包)', emoji: '🔥', color: '#f97316', glow: 'rgba(249, 115, 22, 0.4)',
    yinYang: 'Yin (Night Consolidation)',
    peakAction: 'Thermoregulation across Upper, Middle, and Lower cavities; lymphatic drainage and endocrine equilibrium.',
    ebbOpposite: 'Spleen (09:00 - 11:00)',
    pathologyFlags: 'Alternating chills and flushes, restlessness, lymphatic puffiness, or delayed sleep onset.',
    lifestyleGuideline: 'Prepare for sleep. Dim household lights and take a warm herbal foot soak to draw Yang downward.',
    theRodTNutrition: 'Warm mugwort & ginger foot-soak herbal sachets from The Rod T wellness station.',
    primaryAcupoint: 'TB-5 (Waiguan) - Expels exterior heat and unblocks the Triple Burner waterways.'
  }
];

function polarToCartesian(cx: number, cy: number, radius: number, angleDegFromTop: number) {
  const rad = ((angleDegFromTop - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function createWedgePath(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startDeg: number,
  endDeg: number
) {
  const p1 = polarToCartesian(cx, cy, outerRadius, startDeg);
  const p2 = polarToCartesian(cx, cy, outerRadius, endDeg);
  const p3 = polarToCartesian(cx, cy, innerRadius, endDeg);
  const p4 = polarToCartesian(cx, cy, innerRadius, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;

  return [
    `M ${p1.x} ${p1.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ');
}

function computeMeridianQiActivity(midpointHour: number, decimalHour: number): number {
  const rawDiff = Math.abs(decimalHour - midpointHour);
  const dist = Math.min(rawDiff, 24 - rawDiff); // 0 to 12 hours
  const norm = (1 + Math.cos((dist / 12) * Math.PI)) / 2;
  return Math.round(8 + 92 * Math.pow(norm, 1.35));
}

function formatHourMinute(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

interface CircadianOrganClockProps {
  onSelectPeriod?: (period: OrganPeriod) => void;
}

export const CircadianOrganClock: React.FC<CircadianOrganClockProps> = ({ onSelectPeriod }) => {
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const [scrubMinutes, setScrubMinutes] = useState<number | null>(null);
  const [isLiveSync, setIsLiveSync] = useState(true);
  const [hoveredOrgan, setHoveredOrgan] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const liveHour = currentTime.getHours();
  const liveMinute = currentTime.getMinutes();
  const liveSecond = currentTime.getSeconds();
  const liveTotalMinutes = liveHour * 60 + liveMinute;

  const effectiveTotalMinutes = scrubMinutes !== null ? scrubMinutes : liveTotalMinutes;
  const effectiveHour = Math.floor(effectiveTotalMinutes / 60);
  const effectiveMinute = effectiveTotalMinutes % 60;
  const decimalHour = effectiveTotalMinutes / 60 + (isLiveSync ? liveSecond / 3600 : 0);

  const activeIndex = useMemo(() => {
    const idx = ORGAN_PERIODS.findIndex((p) => {
      if (p.start < p.end) return effectiveHour >= p.start && effectiveHour < p.end;
      return effectiveHour >= p.start || effectiveHour < p.end;
    });
    return idx >= 0 ? idx : 0;
  }, [effectiveHour]);

  const activePeriod = ORGAN_PERIODS[activeIndex];
  const nextPeriod = ORGAN_PERIODS[(activeIndex + 1) % 12];
  const ebbPeriod = ORGAN_PERIODS[(activeIndex + 6) % 12];

  // Progress inside the active 2-hour window
  const hoursIntoWindow = (decimalHour - activePeriod.start + 24) % 24;
  const windowProgressPct = Math.min(100, Math.max(0, Math.round((hoursIntoWindow / 2) * 100)));
  const minutesRemaining = Math.max(0, Math.round((2 - hoursIntoWindow) * 60));

  // True 24-hour clock hand rotation (00:00 is straight up = 0 deg, 12:00 is straight down = 180 deg)
  const handAngleDeg = (decimalHour / 24) * 360;
  const ebbAngleDeg = (handAngleDeg + 180) % 360;

  // Dynamic Qi activity across all 12 Zang-Fu meridians for the effective time of day
  const meridianActivities = useMemo(() => {
    return ORGAN_PERIODS.map((p, idx) => ({
      period: p,
      idx,
      activity: computeMeridianQiActivity(p.midpoint, decimalHour),
    }));
  }, [decimalHour]);

  const handleSelectPeriod = (period: OrganPeriod) => {
    const targetMinutes = period.midpoint * 60;
    setScrubMinutes(targetMinutes);
    setIsLiveSync(false);
    onSelectPeriod?.(period);
  };

  const handleScrubMinutes = (mins: number) => {
    setScrubMinutes(mins);
    setIsLiveSync(false);
  };

  const handleResetToLive = () => {
    setScrubMinutes(null);
    setIsLiveSync(true);
  };

  // Continuous 24h Yang/Yin Qi wave curve points for the circadian activity timeline
  const waveChartPoints = useMemo(() => {
    const width = 600;
    const height = 84;
    const points: string[] = [];
    for (let h = 0; h <= 24; h += 0.5) {
      const x = (h / 24) * width;
      // Solar Yang curve peaks at 12:00 (Heart), troughs at 00:00 (Gallbladder)
      const yangFactor = (1 - Math.cos((h / 24) * Math.PI * 2)) / 2;
      const y = height - 10 - yangFactor * (height - 24);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return points;
  }, []);

  const cursorX = (decimalHour / 24) * 600;
  const cursorYangFactor = (1 - Math.cos((decimalHour / 24) * Math.PI * 2)) / 2;
  const cursorY = 84 - 10 - cursorYangFactor * (84 - 24);

  const cx = 180;
  const cy = 180;

  const isDaylight = effectiveHour >= 6 && effectiveHour < 18;

  return (
    <div className="w-full space-y-6">
      {/* Main Holographic Circadian Organ Clock Panel */}
      <div className="glass-panel p-5 md:p-6 bg-gradient-to-br from-[#04161d]/95 via-[#062029]/85 to-[#030e14]/95 border border-cyan-500/30 rounded-3xl relative overflow-hidden shadow-2xl">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-25 transition-colors duration-700"
          style={{ backgroundColor: activePeriod.color }}
        />

        {/* Top Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-2xl border flex items-center justify-center shadow-lg transition-colors duration-500"
              style={{
                backgroundColor: `${activePeriod.color}18`,
                borderColor: `${activePeriod.color}66`,
                color: activePeriod.color,
                boxShadow: `0 0 22px ${activePeriod.glow}`,
              }}
            >
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-chinese font-bold text-lg text-emerald-400 tracking-wider">
                  子午流注 · 十二时辰脏腑生物钟
                </span>
                <div className="h-4 w-[1px] bg-cyan-500/40 hidden sm:block" />
                <h3 className="font-sans font-extrabold text-lg md:text-xl tracking-wider text-white uppercase">
                  Circadian Organ{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                    Meridian Clock
                  </span>
                </h3>
              </div>
              <p className="text-xs font-mono text-cyan-200/70 tracking-widest uppercase mt-0.5">
                24-Hour Zang-Fu Qi Flow &bull; Real-Time Meridian Dominance &bull; Peak vs. Polar Ebb
              </p>
            </div>
          </div>

          {/* Live Sync & Digital Chronometer */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleResetToLive}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-all border ${
                isLiveSync
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-900/70 text-cyan-300 border-cyan-500/30 hover:bg-cyan-950/60'
              }`}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isLiveSync ? 'text-emerald-400' : ''}`} />
              <span>{isLiveSync ? 'Live Time Synced' : 'Return to Live Time'}</span>
            </button>

            <div className="px-3.5 py-1.5 rounded-full bg-[#020b0f] border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2 tabular-nums">
              {isDaylight ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-indigo-300" />
              )}
              <span>
                {isLiveSync
                  ? `${liveHour.toString().padStart(2, '0')}:${liveMinute.toString().padStart(2, '0')}:${liveSecond
                      .toString()
                      .padStart(2, '0')}`
                  : `${formatHourMinute(effectiveTotalMinutes)} (Scrubbed)`}
              </span>
            </div>
          </div>
        </div>

        {/* Active Triad Telemetry Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5 relative z-10">
          <div
            className="p-3.5 rounded-2xl border bg-[#031118]/90 flex items-center justify-between"
            style={{ borderColor: `${activePeriod.color}55` }}
          >
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                Peak Qi Flow Now ({activePeriod.earthBranch})
              </span>
              <div className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                <span className="font-chinese text-lg" style={{ color: activePeriod.color }}>
                  {activePeriod.chinese}
                </span>
                <span>{activePeriod.organ}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {activePeriod.start.toString().padStart(2, '0')}:00–{activePeriod.end.toString().padStart(2, '0')}:00 &bull;{' '}
                {windowProgressPct}% elapsed ({minutesRemaining}m left)
              </span>
            </div>
            <div className="text-right font-mono">
              <span className="text-2xl font-extrabold tabular-nums" style={{ color: activePeriod.color }}>
                {meridianActivities[activeIndex].activity}%
              </span>
              <span className="block text-[9px] uppercase text-slate-400">Qi Surge</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSelectPeriod(nextPeriod)}
            className="p-3.5 rounded-2xl border border-cyan-500/25 bg-[#031118]/75 hover:border-cyan-400/50 transition-all flex items-center justify-between text-left"
          >
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold flex items-center gap-1">
                <ArrowRight className="w-3 h-3" /> Rising Next ({nextPeriod.earthBranch})
              </span>
              <div className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                <span className="font-chinese text-lg" style={{ color: nextPeriod.color }}>
                  {nextPeriod.chinese}
                </span>
                <span>{nextPeriod.organ}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Opens {nextPeriod.start.toString().padStart(2, '0')}:00–{nextPeriod.end.toString().padStart(2, '0')}:00
              </span>
            </div>
            <div className="text-right font-mono">
              <span className="text-xl font-bold text-cyan-300 tabular-nums">
                {meridianActivities[(activeIndex + 1) % 12].activity}%
              </span>
              <span className="block text-[9px] uppercase text-slate-400">Ascending</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleSelectPeriod(ebbPeriod)}
            className="p-3.5 rounded-2xl border border-slate-700/60 bg-[#031118]/75 hover:border-slate-500 transition-all flex items-center justify-between text-left"
          >
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                12h Polar Ebb / Rest ({ebbPeriod.earthBranch})
              </span>
              <div className="text-base font-bold text-slate-200 flex items-center gap-2 mt-0.5">
                <span className="font-chinese text-lg text-slate-400">{ebbPeriod.chinese}</span>
                <span>{ebbPeriod.organ}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Peak is {ebbPeriod.start.toString().padStart(2, '0')}:00–{ebbPeriod.end.toString().padStart(2, '0')}:00
              </span>
            </div>
            <div className="text-right font-mono">
              <span className="text-xl font-bold text-slate-400 tabular-nums">
                {meridianActivities[(activeIndex + 6) % 12].activity}%
              </span>
              <span className="block text-[9px] uppercase text-slate-500">Low Tide</span>
            </div>
          </button>
        </div>

        {/* Center Stage: 24-Hour SVG Meridian Dial (Left) + Chrono-Intelligence Dossier (Right) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-6 relative z-10">
          {/* LEFT: TRUE 24-HOUR SVG MERIDIAN WHEEL & TIME SCRUBBER */}
          <div className="xl:col-span-5 flex flex-col items-center justify-between p-5 bg-[#030e14]/90 rounded-2xl border border-cyan-500/30">
            <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              <span>00:00 Midnight (Top)</span>
              <span>12:00 Solar Zenith (Bottom)</span>
            </div>

            <div className="relative w-full max-w-[360px] aspect-square flex items-center justify-center">
              <svg viewBox="0 0 360 360" className="w-full h-full overflow-visible select-none">
                <defs>
                  <radialGradient id="dialCoreGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#08242e" />
                    <stop offset="100%" stopColor="#020b0f" />
                  </radialGradient>
                  <filter id="organGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Outer Day/Night Yin-Yang Hemisphere Rings */}
                {/* Daylight Yang Arc (06:00 = 90deg to 18:00 = 270deg, bottom half) */}
                <path
                  d={`M ${polarToCartesian(cx, cy, 168, 90).x} ${polarToCartesian(cx, cy, 168, 90).y} A 168 168 0 0 1 ${polarToCartesian(cx, cy, 168, 270).x} ${polarToCartesian(cx, cy, 168, 270).y}`}
                  fill="none"
                  stroke="rgba(245, 158, 11, 0.35)"
                  strokeWidth="3"
                  strokeDasharray="4 4"
                />
                {/* Night Yin Arc (18:00 = 270deg to 06:00 = 90deg, top half) */}
                <path
                  d={`M ${polarToCartesian(cx, cy, 168, 270).x} ${polarToCartesian(cx, cy, 168, 270).y} A 168 168 0 0 1 ${polarToCartesian(cx, cy, 168, 90).x} ${polarToCartesian(cx, cy, 168, 90).y}`}
                  fill="none"
                  stroke="rgba(56, 189, 248, 0.35)"
                  strokeWidth="3"
                  strokeDasharray="4 4"
                />

                {/* 12 Interactive Meridian Wedges */}
                {ORGAN_PERIODS.map((period, idx) => {
                  const centerDeg = idx * 30;
                  const startDeg = centerDeg - 14.2;
                  const endDeg = centerDeg + 14.2;
                  const isSelected = activeIndex === idx;
                  const isEbb = (activeIndex + 6) % 12 === idx;
                  const isHovered = hoveredOrgan === period.organ;
                  const activity = meridianActivities[idx].activity;

                  const outerR = isSelected ? 158 : isHovered ? 154 : 150;
                  const innerR = 72;
                  const pathD = createWedgePath(cx, cy, innerR, outerR, startDeg, endDeg);
                  const labelPos = polarToCartesian(cx, cy, 126, centerDeg);
                  const hourPos = polarToCartesian(cx, cy, 94, centerDeg);

                  return (
                    <g
                      key={period.organ}
                      onClick={() => handleSelectPeriod(period)}
                      onMouseEnter={() => setHoveredOrgan(period.organ)}
                      onMouseLeave={() => setHoveredOrgan(null)}
                      className="cursor-pointer transition-all duration-200"
                    >
                      <path
                        d={pathD}
                        fill={
                          isSelected
                            ? `${period.color}40`
                            : isEbb
                            ? 'rgba(15, 23, 42, 0.7)'
                            : isHovered
                            ? `${period.color}25`
                            : 'rgba(6, 26, 36, 0.82)'
                        }
                        stroke={isSelected ? period.color : isHovered ? period.color : 'rgba(34, 211, 238, 0.22)'}
                        strokeWidth={isSelected ? 2 : 1}
                        filter={isSelected ? 'url(#organGlow)' : undefined}
                      />

                      {/* Activity arc indicator along outer rim of each wedge */}
                      <path
                        d={createWedgePath(
                          cx,
                          cy,
                          148,
                          152,
                          startDeg + 1,
                          startDeg + 1 + ((endDeg - startDeg - 2) * activity) / 100
                        )}
                        fill={period.color}
                        opacity={isSelected ? 0.95 : 0.45}
                      />

                      <text
                        x={labelPos.x}
                        y={labelPos.y - 3}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={isSelected ? '#ffffff' : period.color}
                        fontSize={isSelected ? '13' : '11.5'}
                        fontWeight="700"
                        className="font-chinese pointer-events-none"
                      >
                        {period.chinese.replace('经', '')}
                      </text>
                      <text
                        x={labelPos.x}
                        y={labelPos.y + 10}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={isSelected ? '#e2e8f0' : '#94a3b8'}
                        fontSize="7.5"
                        className="font-mono pointer-events-none uppercase"
                      >
                        {period.organ.slice(0, 6)}
                      </text>
                      <text
                        x={hourPos.x}
                        y={hourPos.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={isSelected ? '#22d3ee' : '#64748b'}
                        fontSize="7.5"
                        className="font-mono pointer-events-none"
                      >
                        {period.start}h
                      </text>
                    </g>
                  );
                })}

                {/* Polar Ebb Opposite Axis Line */}
                {(() => {
                  const pPeak = polarToCartesian(cx, cy, 142, handAngleDeg);
                  const pEbb = polarToCartesian(cx, cy, 142, ebbAngleDeg);
                  return (
                    <line
                      x1={pEbb.x}
                      y1={pEbb.y}
                      x2={pPeak.x}
                      y2={pPeak.y}
                      stroke="rgba(148, 163, 184, 0.35)"
                      strokeWidth="1.2"
                      strokeDasharray="3 4"
                    />
                  );
                })()}

                {/* Center Core Circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r="64"
                  fill="url(#dialCoreGrad)"
                  stroke="rgba(34, 211, 238, 0.4)"
                  strokeWidth="1.5"
                />

                {/* 24-Hour Precision Needle Hand */}
                {(() => {
                  const tip = polarToCartesian(cx, cy, 142, handAngleDeg);
                  const tail = polarToCartesian(cx, cy, 22, ebbAngleDeg);
                  return (
                    <g className="pointer-events-none">
                      <line
                        x1={tail.x}
                        y1={tail.y}
                        x2={tip.x}
                        y2={tip.y}
                        stroke={activePeriod.color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        filter="url(#organGlow)"
                      />
                      <circle cx={tip.x} cy={tip.y} r="4.5" fill={activePeriod.color} stroke="#020b0f" strokeWidth="1.5" />
                    </g>
                  );
                })()}

                {/* Center Readout */}
                <text
                  x={cx}
                  y={cy - 14}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="8.5"
                  className="font-mono uppercase tracking-widest"
                >
                  {activePeriod.earthBranch}
                </text>
                <text
                  x={cx}
                  y={cy + 5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="18"
                  fontWeight="800"
                  className="font-mono tabular-nums"
                >
                  {formatHourMinute(effectiveTotalMinutes)}
                </text>
                <text
                  x={cx}
                  y={cy + 22}
                  textAnchor="middle"
                  fill={activePeriod.color}
                  fontSize="10"
                  fontWeight="700"
                  className="font-sans"
                >
                  {activePeriod.organ}
                </text>
                <text
                  x={cx}
                  y={cy + 34}
                  textAnchor="middle"
                  fill="#22d3ee"
                  fontSize="8"
                  className="font-mono"
                >
                  {activePeriod.element} · {windowProgressPct}%
                </text>

                {/* Cardinal Hour Markers */}
                <text x={cx} y="10" textAnchor="middle" fill="#64748b" fontSize="8.5" className="font-mono">
                  00:00
                </text>
                <text x="348" y={cy + 3} textAnchor="end" fill="#fbbf24" fontSize="8.5" className="font-mono">
                  06:00
                </text>
                <text x={cx} y="355" textAnchor="middle" fill="#f43f5e" fontSize="8.5" className="font-mono">
                  12:00
                </text>
                <text x="12" y={cy + 3} textAnchor="start" fill="#38bdf8" fontSize="8.5" className="font-mono">
                  18:00
                </text>
              </svg>
            </div>

            {/* 24-Hour Minute-Precision Time Scrubber & Presets */}
            <div className="w-full mt-3 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                  24h Circadian Scrubber:
                </span>
                <span className="text-cyan-300 font-bold tabular-nums">
                  {formatHourMinute(effectiveTotalMinutes)} ({activePeriod.earthBranch})
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={1439}
                step={15}
                value={effectiveTotalMinutes}
                onChange={(e) => handleScrubMinutes(parseInt(e.target.value, 10))}
                aria-label="Scrub circadian clock hour"
                className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
                {[
                  { label: '00:00 Midnight', mins: 0 },
                  { label: '02:00 Liver', mins: 120 },
                  { label: '06:00 Dawn', mins: 360 },
                  { label: '12:00 Noon', mins: 720 },
                  { label: '18:00 Dusk', mins: 1080 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleScrubMinutes(preset.mins)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono border transition-colors ${
                      Math.abs(effectiveTotalMinutes - preset.mins) < 30 && !isLiveSync
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                        : 'bg-[#051822] border-cyan-500/20 text-slate-400 hover:text-cyan-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: CHRONO-INTELLIGENCE DOSSIER & MERIDIAN ACTIVITY TELEMETRY */}
          <div className="xl:col-span-7 flex flex-col justify-between space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePeriod.organ}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-[#062029]/95 via-[#04161d]/90 to-[#020b0f] border border-cyan-400/40 space-y-4 shadow-xl"
              >
                {/* Organ Banner Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/25 pb-3.5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-chinese font-bold text-xl shadow-lg border shrink-0"
                      style={{
                        backgroundColor: `${activePeriod.color}20`,
                        borderColor: `${activePeriod.color}60`,
                        color: activePeriod.color,
                        boxShadow: `0 0 20px ${activePeriod.glow}`,
                      }}
                    >
                      {activePeriod.chinese.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-lg font-bold text-white font-sans">
                          {activePeriod.organ} Meridian ({activePeriod.chinese})
                        </h4>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase"
                          style={{ backgroundColor: `${activePeriod.color}25`, color: activePeriod.color }}
                        >
                          {activePeriod.element} Element
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-cyan-500/25 text-cyan-300">
                          {activePeriod.zangFuType}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-cyan-300 block mt-0.5">
                        {activePeriod.earthBranch} &bull; Peak:{' '}
                        {activePeriod.start.toString().padStart(2, '0')}:00–{activePeriod.end.toString().padStart(2, '0')}
                        :00 &bull; Biao-Li Pair: {activePeriod.pairedOrgan}
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right font-mono text-xs">
                    <span className="text-[10px] uppercase text-slate-400 block">Diurnal Polarity</span>
                    <span className="text-emerald-400 font-bold">{activePeriod.yinYang}</span>
                  </div>
                </div>

                {/* Window Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>2-Hour Horary Meridian Window Progress</span>
                    <span className="text-cyan-300 tabular-nums">
                      {windowProgressPct}% ({minutesRemaining} min until {nextPeriod.organ})
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-cyan-500/20">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${windowProgressPct}%`,
                        background: `linear-gradient(90deg, ${activePeriod.color}, #22d3ee)`,
                      }}
                    />
                  </div>
                </div>

                {/* Biological & Energetic Peak Function */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                    Peak Physiological &amp; Energetic Dynamism
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">{activePeriod.peakAction}</p>
                </div>

                {/* Clinical Pathology Warnings */}
                <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-400 font-mono font-bold text-[10px] uppercase">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Pathological Disharmony Warning Signs</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs leading-relaxed">{activePeriod.pathologyFlags}</p>
                </div>

                {/* Chrono-Living Directive & Nutrition */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/25 space-y-1">
                    <span className="text-[10px] text-cyan-400 uppercase font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Circadian Lifestyle Discipline
                    </span>
                    <p className="text-slate-300 font-sans text-[11px] leading-snug">
                      {activePeriod.lifestyleGuideline}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/25 space-y-1">
                    <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" /> The Rod T Herbal &amp; Congee Diet
                    </span>
                    <p className="text-slate-300 font-sans text-[11px] leading-snug">
                      {activePeriod.theRodTNutrition}
                    </p>
                  </div>
                </div>

                {/* Acupoint & Sync Button */}
                <div className="p-3 rounded-xl bg-[#020b0f] border border-cyan-500/20 text-xs font-mono flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>HORARY ACUPOINT:</span>
                    <strong className="text-white">{activePeriod.primaryAcupoint}</strong>
                  </div>
                  {onSelectPeriod && (
                    <button
                      type="button"
                      onClick={() => onSelectPeriod(activePeriod)}
                      className="px-3 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-200 text-[11px] font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Zap className="w-3 h-3 text-cyan-400" />
                      Sync to Consultant
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* 24-Hour Yin/Yang Circadian Qi Wave Timeline */}
            <div className="p-4 rounded-2xl bg-[#030e14]/90 border border-cyan-500/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                  <Waves className="w-3.5 h-3.5" /> 24-Hour Diurnal Yang-Yin Qi Oscillation Curve
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {isDaylight ? 'Yang Ascent / Daylight Peak' : 'Yin Consolidation / Deep Restoration'}
                </span>
              </div>
              <svg viewBox="0 0 600 84" className="w-full h-20 overflow-visible">
                <defs>
                  <linearGradient id="qiWaveFill" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#34d399" stopOpacity="0.25" />
                    <stop offset="25%" stopColor="#f59e0b" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#f43f5e" stopOpacity="0.35" />
                    <stop offset="75%" stopColor="#06b6d4" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#34d399" stopOpacity="0.25" />
                  </linearGradient>
                </defs>
                {/* Baseline */}
                <line x1="0" y1="74" x2="600" y2="74" stroke="rgba(148,163,184,0.2)" strokeWidth="1" />
                {/* Area under curve */}
                <polygon
                  points={`0,74 ${waveChartPoints.join(' ')} 600,74`}
                  fill="url(#qiWaveFill)"
                />
                {/* Wave Stroke */}
                <polyline
                  points={waveChartPoints.join(' ')}
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2"
                />
                {/* Current time cursor */}
                <line
                  x1={cursorX}
                  y1="4"
                  x2={cursorX}
                  y2="76"
                  stroke={activePeriod.color}
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
                <circle cx={cursorX} cy={cursorY} r="4.5" fill={activePeriod.color} stroke="#020b0f" strokeWidth="1.5" />
                {/* Hour ticks */}
                {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => (
                  <text
                    key={h}
                    x={(h / 24) * 600}
                    y="83"
                    textAnchor={h === 0 ? 'start' : h === 24 ? 'end' : 'middle'}
                    fill="#64748b"
                    fontSize="8"
                    className="font-mono"
                  >
                    {h.toString().padStart(2, '0')}h
                  </text>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Live 12 Zang-Fu Meridian Qi Activity Matrix */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 px-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300">
              Live Zang-Fu Meridian Activity Spectrum ({formatHourMinute(effectiveTotalMinutes)})
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Click any meridian card to inspect its peak 2-hour window
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {meridianActivities.map(({ period, idx, activity }) => {
            const isSelected = activeIndex === idx;
            const isEbb = (activeIndex + 6) % 12 === idx;
            return (
              <button
                key={period.organ}
                type="button"
                onClick={() => handleSelectPeriod(period)}
                className={`p-3 rounded-xl text-left transition-all border flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-cyan-950/90 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : isEbb
                    ? 'bg-[#030e14]/60 border-slate-700/60 hover:border-slate-500 text-slate-400'
                    : 'bg-[#04161d]/75 border-cyan-500/20 hover:border-cyan-500/45 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400 tabular-nums">
                    {period.start.toString().padStart(2, '0')}-{period.end.toString().padStart(2, '0')}h
                  </span>
                  <span style={{ color: period.color }} className="font-bold">
                    {period.element}
                  </span>
                </div>

                <div className="font-chinese font-bold text-sm text-white flex items-baseline justify-between gap-1">
                  <span>{period.chinese}</span>
                  <span className="text-[11px] font-mono tabular-nums" style={{ color: period.color }}>
                    {activity}%
                  </span>
                </div>

                <div className="text-[11px] font-sans text-slate-300 truncate">{period.organ}</div>

                <div className="h-1 w-full rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${activity}%`, backgroundColor: period.color }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
