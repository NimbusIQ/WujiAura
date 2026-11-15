import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Activity, 
  Heart, 
  Wind, 
  Droplet, 
  Flame, 
  Mountain, 
  Shield, 
  RefreshCw,
  Radio,
  Eye,
  Maximize2
} from 'lucide-react';

interface VisualizerProps {
  data: any;
  view?: 'HOLOGRAPHIC' | 'DATA' | 'WUXING' | 'TELEMETRY';
}

interface OrganMetric {
  name: string;
  chinese: string;
  element: 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
  qiLevel: number;
  harmonicState: string;
  meridian: string;
  color: string;
  glow: string;
}

const DEFAULT_ORGANS: OrganMetric[] = [
  { name: 'Heart', chinese: '心', element: 'Fire', qiLevel: 88, harmonicState: 'Shen Radiant', meridian: 'HT (Shaoyin)', color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.4)' },
  { name: 'Liver', chinese: '肝', element: 'Wood', qiLevel: 74, harmonicState: 'Smoothing Qi', meridian: 'LV (Jueyin)', color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
  { name: 'Spleen', chinese: '脾', element: 'Earth', qiLevel: 82, harmonicState: 'Transforming', meridian: 'SP (Taiyin)', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
  { name: 'Lungs', chinese: '肺', element: 'Metal', qiLevel: 91, harmonicState: 'Wei Qi Shield', meridian: 'LU (Taiyin)', color: '#e2e8f0', glow: 'rgba(226, 232, 240, 0.4)' },
  { name: 'Kidney', chinese: '肾', element: 'Water', qiLevel: 79, harmonicState: 'Jing Reservoir', meridian: 'KI (Shaoyin)', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' }
];

const WUXING_ELEMENTS = [
  { key: 'Wood', label: 'WOOD', chinese: '木', icon: Wind, color: '#10b981', glow: 'rgba(16, 185, 129, 0.5)', organ: 'Liver', angle: -90 },
  { key: 'Fire', label: 'FIRE', chinese: '火', icon: Flame, color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.5)', organ: 'Heart', angle: -18 },
  { key: 'Earth', label: 'EARTH', chinese: '土', icon: Mountain, color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)', organ: 'Spleen', angle: 54 },
  { key: 'Metal', label: 'METAL', chinese: '金', icon: Shield, color: '#e2e8f0', glow: 'rgba(226, 232, 240, 0.5)', organ: 'Lungs', angle: 126 },
  { key: 'Water', label: 'WATER', chinese: '水', icon: Droplet, color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.5)', organ: 'Kidney', angle: 198 },
];

export const TCMVisualizer: React.FC<VisualizerProps> = ({ data, view = 'HOLOGRAPHIC' }) => {
  const [activeElement, setActiveElement] = useState<string>('Wood');
  const [pulseTime, setPulseTime] = useState<number>(0);
  const [selectedOrgan, setSelectedOrgan] = useState<OrganMetric>(DEFAULT_ORGANS[1]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseTime(t => (t + 1) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const syndrome = data?.syndrome || {};
  const wuxingInsights = data?.wuxingInsights || [];

  return (
    <div className="w-full space-y-6">
      
      {/* 🌟 HOLOGRAPHIC DIAGNOSTICS STAGE (As featured in the reference image) */}
      <div className="relative glass-panel bg-gradient-to-b from-[#051820]/90 via-[#07242e]/80 to-[#030e14]/95 border border-cyan-500/30 p-6 md:p-8 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        
        {/* Ambient Holographic Light Rings & Grid */}
        <div className="absolute inset-0 bg-hologram-grid opacity-20 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute top-10 right-20 w-72 h-72 rounded-full bg-emerald-500/5 blur-[90px] pointer-events-none"></div>

        {/* Top Header Strip: Modern TCM Organ Diagnostics (健生讲诊疗) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 font-mono text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-bold tracking-widest uppercase">Holographic Bio-Field</span>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-chinese font-bold text-lg text-emerald-400 tracking-wider">健生讲诊疗</span>
                <div className="h-4 w-[1px] bg-cyan-500/40"></div>
                <h3 className="font-sans font-extrabold text-base md:text-lg tracking-wider text-white uppercase flex items-center gap-2">
                  Modern TCM <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Organ Diagnostics</span>
                </h3>
              </div>
              <p className="text-[11px] font-mono text-cyan-200/60 uppercase tracking-widest">
                Real-Time Zang-Fu Meridian Telemetry &bull; Five Elements Sheng-Ke Vector Matrix
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-cyan-500/30 text-[11px] text-cyan-300 font-mono">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Cun-Guan-Chi: Synchronized</span>
            </div>
            <div className="text-right font-mono text-[10px] text-slate-400">
              <span className="text-emerald-400 font-bold">Shen Resonance</span>: 96.4%
            </div>
          </div>
        </div>

        {/* Center Tri-Fold Cockpit: Left Organ Table, Center Hologram Body, Right Telemetry Monitors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 relative z-10">

          {/* LEFT CONSOLE (4 Cols): ZANG-FU ORGANS (Heart, Liver, Spleen, Lungs, Kidney) */}
          <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300">
                  Zang-Fu Organs
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Harmonic Qi Index</span>
            </div>

            <div className="space-y-2.5">
              {DEFAULT_ORGANS.map((organ) => {
                const isSelected = selectedOrgan.name === organ.name;
                return (
                  <motion.button
                    key={organ.name}
                    onClick={() => setSelectedOrgan(organ)}
                    whileHover={{ x: 3 }}
                    className={`w-full p-3.5 rounded-2xl text-left transition-all border flex items-center justify-between relative overflow-hidden ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
                        : 'bg-[#061e27]/60 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#092934]/70'
                    }`}
                  >
                    {/* Active side indicator glow */}
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-emerald-400 shadow-[0_0_10px_#22d3ee]"></div>
                    )}

                    <div className="flex items-center gap-3 pl-1">
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-chinese font-bold text-sm shadow-md"
                        style={{ backgroundColor: `${organ.color}20`, color: organ.color, border: `1px solid ${organ.color}40` }}
                      >
                        {organ.chinese}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white tracking-wide">{organ.name}</span>
                          <span 
                            className="px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded"
                            style={{ backgroundColor: `${organ.color}20`, color: organ.color }}
                          >
                            {organ.element}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 block">{organ.meridian}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-white flex items-center justify-end gap-1">
                        <span style={{ color: organ.color }}>{organ.qiLevel}</span>
                        <span className="text-[10px] text-slate-500">%</span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-300/80">{organ.harmonicState}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Organ Inspector Snippet */}
            <div className="p-3.5 rounded-2xl bg-[#04161d]/80 border border-cyan-500/20 text-xs font-mono text-slate-300">
              <div className="flex items-center justify-between text-[10px] text-cyan-400 mb-1">
                <span>ACTIVE ORGAN PROBE</span>
                <span className="text-emerald-400">{selectedOrgan.name} Channel</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300 font-sans">
                Dominant Zang Qi: {selectedOrgan.name} governs somatic regulation. Maintain balance through hydrated rest, congee, and targeted acupressure.
              </p>
            </div>
          </div>

          {/* CENTER STAGE (4 Cols): HOLOGRAPHIC MERIDIAN HUMAN & WUXING SPHERE */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center relative min-h-[380px] p-4">
            
            {/* Concentric Rotating Holographic Qi Rings */}
            <div className="absolute w-72 h-72 rounded-full border border-cyan-500/20 border-dashed animate-spin-slow"></div>
            <div className="absolute w-60 h-60 rounded-full border border-emerald-500/20 border-dotted animate-reverse-spin"></div>
            <div className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-cyan-500/10 to-emerald-500/10 blur-xl"></div>

            {/* Five Elements Orbit Nodes */}
            <svg viewBox="0 0 300 300" className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              {/* Connecting Generating Sheng Lines */}
              {WUXING_ELEMENTS.map((el, i) => {
                const nextEl = WUXING_ELEMENTS[(i + 1) % WUXING_ELEMENTS.length];
                const r = 115;
                const x1 = 150 + r * Math.cos((el.angle * Math.PI) / 180);
                const y1 = 150 + r * Math.sin((el.angle * Math.PI) / 180);
                const x2 = 150 + r * Math.cos((nextEl.angle * Math.PI) / 180);
                const y2 = 150 + r * Math.sin((nextEl.angle * Math.PI) / 180);

                return (
                  <g key={`cycle-${el.key}`}>
                    <line 
                      x1={x1} y1={y1} x2={x2} y2={y2} 
                      stroke="#06b6d4" 
                      strokeWidth="1.2" 
                      strokeDasharray="4 3" 
                      strokeOpacity="0.4" 
                    />
                    <circle cx={(x1 + x2) / 2} cy={(y1 + y2) / 2} r="2" fill="#22d3ee" className="animate-ping" />
                  </g>
                );
              })}
            </svg>

            {/* Five Elements Node Beacons */}
            {WUXING_ELEMENTS.map((el) => {
              const r = 115;
              const x = 150 + r * Math.cos((el.angle * Math.PI) / 180);
              const y = 150 + r * Math.sin((el.angle * Math.PI) / 180);
              const isSelected = activeElement === el.key;

              return (
                <button
                  key={el.key}
                  onClick={() => setActiveElement(el.key)}
                  style={{ left: `${(x / 300) * 100}%`, top: `${(y / 300) * 100}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 flex flex-col items-center transition-transform hover:scale-110`}
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-chinese font-bold text-xs transition-all shadow-lg ${
                      isSelected 
                        ? 'ring-4 ring-cyan-400 scale-110' 
                        : 'border border-cyan-500/30'
                    }`}
                    style={{ backgroundColor: '#061a22', color: el.color, boxShadow: `0 0 15px ${el.glow}` }}
                  >
                    {el.chinese}
                  </div>
                  <span className="text-[9px] font-mono font-bold tracking-wider mt-1 text-cyan-200/80 group-hover:text-cyan-300">
                    {el.label}
                  </span>
                </button>
              );
            })}

            {/* Holographic Human Body Silhouette with glowing energy channel */}
            <div className="relative z-10 flex flex-col items-center pointer-events-none">
              <svg viewBox="0 0 120 220" className="w-28 h-52 text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
                {/* Holographic Head */}
                <circle cx="60" cy="22" r="14" fill="none" stroke="#22d3ee" strokeWidth="1.8" />
                <circle cx="60" cy="22" r="6" fill="#10b981" opacity="0.6" className="animate-pulse" />
                
                {/* Baihui Point Top Crown */}
                <circle cx="60" cy="8" r="2.5" fill="#f59e0b" />

                {/* Spine & Ren / Du Meridian Energy Core */}
                <line x1="60" y1="36" x2="60" y2="135" stroke="#22d3ee" strokeWidth="2.5" strokeDasharray="3 2" />
                
                {/* Torso & Zang-Fu Organ Illuminations */}
                <path d="M 40 46 L 80 46 L 74 125 L 46 125 Z" fill="none" stroke="#22d3ee" strokeWidth="1.4" opacity="0.7" />
                
                {/* Heart (Fire) */}
                <circle cx="56" cy="62" r="5" fill="#f43f5e" opacity="0.85" className="animate-pulse" />
                {/* Liver (Wood) */}
                <circle cx="67" cy="78" r="5.5" fill="#10b981" opacity="0.85" />
                {/* Spleen (Earth) */}
                <circle cx="50" cy="80" r="4.5" fill="#f59e0b" opacity="0.85" />
                {/* Lungs (Metal) */}
                <ellipse cx="60" cy="54" rx="14" ry="7" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 2" />
                {/* Kidneys (Water) */}
                <circle cx="53" cy="95" r="4" fill="#06b6d4" opacity="0.85" />
                <circle cx="67" cy="95" r="4" fill="#06b6d4" opacity="0.85" />
                
                {/* Dantian Energy Core (Navel) */}
                <circle cx="60" cy="110" r="4" fill="#f59e0b" className="animate-ping" opacity="0.5" />
                <circle cx="60" cy="110" r="3" fill="#f59e0b" />

                {/* Arms & Hands */}
                <path d="M 40 48 L 22 92 L 18 120" fill="none" stroke="#22d3ee" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M 80 48 L 98 92 L 102 120" fill="none" stroke="#22d3ee" strokeWidth="1.4" strokeLinecap="round" />
                
                {/* Legs & Feet */}
                <path d="M 50 125 L 44 180 L 38 210" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 70 125 L 76 180 L 82 210" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />

                {/* Yongquan Point on Soles */}
                <circle cx="38" cy="210" r="2" fill="#06b6d4" />
                <circle cx="82" cy="210" r="2" fill="#06b6d4" />
              </svg>

              {/* Holographic Projector Pedestal */}
              <div className="w-36 h-4 rounded-full bg-cyan-500/20 border border-cyan-400/50 shadow-[0_0_20px_#06b6d4] mt-1 relative flex items-center justify-center">
                <div className="w-20 h-1 rounded-full bg-cyan-300 animate-pulse"></div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <span className="text-[10px] font-mono tracking-widest text-emerald-300 uppercase px-3 py-1 rounded-full bg-[#062029]/80 border border-emerald-500/30">
                Active Node: {activeElement} Element
              </span>
            </div>
          </div>

          {/* RIGHT CONSOLE (4 Cols): PULSE WAVEFORM & TONGUE ENERGY TELEMETRY */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* 1. PULSE WAVEFORM ANALYSIS (As featured in the reference image) */}
            <div className="p-4 rounded-2xl bg-[#04161d]/80 border border-cyan-500/25 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300">
                    Pulse Waveform Analysis
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 animate-pulse">72 BPM</span>
              </div>

              {/* Oscillogram Canvas Simulation */}
              <div className="h-24 w-full bg-[#020b0f] rounded-xl border border-cyan-500/20 p-2 relative overflow-hidden flex items-center">
                {/* Oscillogram grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d410_1px,transparent_1px),linear-gradient(to_bottom,#06b6d410_1px,transparent_1px)] bg-[size:12px_12px]"></div>

                {/* Simulated Arterial Pulse Wave with Cun, Guan, Chi harmonics */}
                <svg viewBox="0 0 300 60" className="w-full h-full relative z-10">
                  <path
                    d={`M 0 30 Q 20 30 35 12 Q 45 48 55 30 Q 75 30 90 10 Q 100 50 110 30 Q 135 30 150 14 Q 160 46 170 30 Q 195 30 210 10 Q 220 50 230 30 Q 255 30 270 12 Q 280 48 290 30 L 300 30`}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="hologram-pulse"
                  />
                </svg>

                {/* Scanner bar */}
                <div 
                  className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent pointer-events-none"
                  style={{ left: `${pulseTime}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
                <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20">
                  <div className="text-slate-400">Cun (寸)</div>
                  <div className="text-cyan-300 font-bold">Moderate</div>
                </div>
                <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20">
                  <div className="text-slate-400">Guan (关)</div>
                  <div className="text-emerald-400 font-bold">Wiry / Qi</div>
                </div>
                <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/20">
                  <div className="text-slate-400">Chi (尺)</div>
                  <div className="text-amber-400 font-bold">Root Deep</div>
                </div>
              </div>
            </div>

            {/* 2. TONGUE ENERGY MAPPING (As featured in the reference image) */}
            <div className="p-4 rounded-2xl bg-[#04161d]/80 border border-cyan-500/25 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300">
                    Tongue Energy Mapping
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">Spectral Coating</span>
              </div>

              {/* Tongue Thermal Topography */}
              <div className="flex items-center gap-4 bg-[#020b0f] p-3 rounded-xl border border-cyan-500/20">
                <div className="w-20 h-24 rounded-full bg-gradient-to-b from-rose-950 via-red-800 to-amber-900 border border-rose-500/40 relative flex items-center justify-center overflow-hidden shadow-inner shrink-0">
                  {/* Heart Tip (Redness) */}
                  <div className="absolute top-1 w-8 h-5 rounded-full bg-rose-500/60 blur-[3px]"></div>
                  {/* Center Spleen (White/Yellow Damp Coating) */}
                  <div className="w-9 h-11 rounded-xl bg-amber-200/40 blur-[4px]"></div>
                  {/* Margin Liver/Gallbladder */}
                  <div className="absolute left-1 top-4 bottom-4 w-2 bg-emerald-500/30 blur-[2px]"></div>
                  <div className="absolute right-1 top-4 bottom-4 w-2 bg-emerald-500/30 blur-[2px]"></div>
                </div>

                <div className="flex-1 space-y-1.5 font-mono text-[10px]">
                  <div className="flex justify-between border-b border-cyan-500/15 pb-1">
                    <span className="text-slate-400">Body Color:</span>
                    <span className="text-white font-bold">Pale Red</span>
                  </div>
                  <div className="flex justify-between border-b border-cyan-500/15 pb-1">
                    <span className="text-slate-400">Coating:</span>
                    <span className="text-amber-300 font-bold">Thin White-Yellow</span>
                  </div>
                  <div className="flex justify-between border-b border-cyan-500/15 pb-1">
                    <span className="text-slate-400">Moisture:</span>
                    <span className="text-cyan-300 font-bold">Moderate Hydrated</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Clinical Focus:</span>
                    <span className="text-emerald-400 font-bold">Clear Liver Fire</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Master Yu / Wuji Shen Diagnostic Hypothesis Footnote */}
        <div className="mt-6 pt-4 border-t border-cyan-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-cyan-300 font-bold uppercase">Clinical Diagnostic Hypothesis:</span>
            <span className="text-slate-300 font-sans italic">
              {syndrome.name ? `${syndrome.name} – ${syndrome.hypothesis}` : "Energetic equilibrium verified across Five Elements network. Liver Qi harmonizing smoothly."}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-bold text-[10px]">
              The Rod T Prescriptions Available
            </span>
          </div>
        </div>

      </div>

      {/* Wu Xing Insights Feed if Available */}
      {wuxingInsights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wuxingInsights.map((insight: string, idx: number) => (
            <div key={idx} className="glass-card p-4 flex items-start gap-3 border border-cyan-500/20 bg-[#051820]/70">
              <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">Wuxing Harmonizer</span>
                <p className="text-xs text-slate-200 font-light mt-0.5 leading-relaxed italic">
                  "{insight}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
