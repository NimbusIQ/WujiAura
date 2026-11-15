import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Radio, 
  Zap, 
  CheckCircle, 
  Info,
  Waves,
  RefreshCw,
  Compass
} from 'lucide-react';

export interface PulseProfile {
  id: string;
  name: string;
  chinese: string;
  category: 'Harmonious' | 'Heat' | 'Cold' | 'Deficiency' | 'Excess' | 'Stasis';
  bpm: number;
  tension: number; // 0 to 1
  width: number; // 0 to 1
  smoothness: number; // 0 to 1 (1 = smooth slippery, 0 = choppy)
  dicroticDepth: number; // 0 to 1
  description: string;
  clinicalSignificance: string;
  sensoryMetaphor: string;
  color: string;
}

export const CLASSICAL_PULSES: PulseProfile[] = [
  {
    id: 'ping',
    name: 'Normal Harmonious Pulse',
    chinese: '平脉 (Ping Mai)',
    category: 'Harmonious',
    bpm: 72,
    tension: 0.5,
    width: 0.5,
    smoothness: 0.85,
    dicroticDepth: 0.5,
    description: 'Calm, gentle, unhurried (4 beats per breath), supple with clear stomach Qi, spirit (Shen), and root (Gen).',
    clinicalSignificance: 'Physiological equilibrium, vibrant Wei Qi, well-nourished Zang-Fu organs.',
    sensoryMetaphor: 'Like a spring breeze stirring willows; resilient yet yielding beneath the fingers.',
    color: '#10b981'
  },
  {
    id: 'hua',
    name: 'Slippery / Rolling Pulse',
    chinese: '滑脉 (Hua Mai)',
    category: 'Excess',
    bpm: 78,
    tension: 0.45,
    width: 0.75,
    smoothness: 1.0,
    dicroticDepth: 0.65,
    description: 'Smooth, round, and flowing; arrives and departs fluidly with buoyant bounce.',
    clinicalSignificance: 'Phlegm-damp accumulation, food stagnation, intense metabolic heat, or healthy pregnancy.',
    sensoryMetaphor: 'Like pearls rolling continuously in a smooth jade basin (如盘走珠).',
    color: '#06b6d4'
  },
  {
    id: 'xian',
    name: 'Wiry / String-Taut Pulse',
    chinese: '弦脉 (Xian Mai)',
    category: 'Excess',
    bpm: 76,
    tension: 0.95,
    width: 0.4,
    smoothness: 0.6,
    dicroticDepth: 0.25,
    description: 'Straight, taut, and long; hits the fingers forcefully with sharp edge resistance.',
    clinicalSignificance: 'Liver/Gallbladder Qi Stagnation, pain syndromes, emotional suppression, hypertension.',
    sensoryMetaphor: 'Like feeling the taut, vibrating string of a tuned musical zither (如按琴弦).',
    color: '#34d399'
  },
  {
    id: 'fu',
    name: 'Floating / Superficial Pulse',
    chinese: '浮脉 (Fu Mai)',
    category: 'Harmonious',
    bpm: 75,
    tension: 0.6,
    width: 0.7,
    smoothness: 0.7,
    dicroticDepth: 0.55,
    description: 'Distinct and forceful under light touch on the surface; weakens when pressed deeply.',
    clinicalSignificance: 'Exterior Wind-Cold or Wind-Heat invasion; defensive Wei Qi mobilized to fight pathogens.',
    sensoryMetaphor: 'Like a light piece of wood floating gracefully on water (如水漂木).',
    color: '#38bdf8'
  },
  {
    id: 'chen',
    name: 'Deep / Sunken Pulse',
    chinese: '沉脉 (Chen Mai)',
    category: 'Cold',
    bpm: 68,
    tension: 0.7,
    width: 0.45,
    smoothness: 0.65,
    dicroticDepth: 0.4,
    description: 'Barely felt with light or moderate touch; felt distinctly only when pressed deeply near the bone.',
    clinicalSignificance: 'Interior pattern, Yang Qi latency, internal Cold, or deep organic stagnation.',
    sensoryMetaphor: 'Like a heavy stone submerged deep in a calm river bed (如石投水).',
    color: '#6366f1'
  },
  {
    id: 'shu',
    name: 'Rapid Pulse',
    chinese: '数脉 (Shu Mai)',
    category: 'Heat',
    bpm: 98,
    tension: 0.7,
    width: 0.55,
    smoothness: 0.8,
    dicroticDepth: 0.6,
    description: 'Rapid frequency (>90 BPM, 5-6 beats per breath), quick ascension and rapid transition.',
    clinicalSignificance: 'Interior Heat syndrome, Yin deficiency with empty heat, acute inflammation or fever.',
    sensoryMetaphor: 'Like rapid drumbeats accelerating during a military advance.',
    color: '#f43f5e'
  },
  {
    id: 'chi',
    name: 'Slow Pulse',
    chinese: '迟脉 (Chi Mai)',
    category: 'Cold',
    bpm: 52,
    tension: 0.4,
    width: 0.5,
    smoothness: 0.6,
    dicroticDepth: 0.45,
    description: 'Slow frequency (<60 BPM, less than 4 beats per breath), sluggish circulation velocity.',
    clinicalSignificance: 'Interior Cold syndrome, Spleen-Kidney Yang deficiency, accumulation of cold damp.',
    sensoryMetaphor: 'Like a cold mountain stream freezing into slow viscous slush.',
    color: '#0284c7'
  },
  {
    id: 'xi',
    name: 'Thin / Thready Pulse',
    chinese: '细脉 (Xi Mai)',
    category: 'Deficiency',
    bpm: 74,
    tension: 0.35,
    width: 0.2,
    smoothness: 0.75,
    dicroticDepth: 0.3,
    description: 'Extremely thin and narrow like a fine silk thread, yet continuous and clearly defined.',
    clinicalSignificance: 'Qi and Blood deficiency, Yin fluid depletion, chronic exhaustion or overwork.',
    sensoryMetaphor: 'Like touching a fine, taut silk thread suspended in gentle air (细如丝线).',
    color: '#f59e0b'
  },
  {
    id: 'hong',
    name: 'Surging / Flooding Pulse',
    chinese: '洪脉 (Hong Mai)',
    category: 'Heat',
    bpm: 88,
    tension: 0.8,
    width: 0.95,
    smoothness: 0.9,
    dicroticDepth: 0.8,
    description: 'Broad, voluminous, and powerful; arrives like a giant cresting wave and recedes gently.',
    clinicalSignificance: 'Extreme interior Yang heat, Yangming channel fever, vigorous febrile response.',
    sensoryMetaphor: 'Like giant ocean breakers surging onto the shore with thunderous presence (如大浪平地翻起).',
    color: '#fb7185'
  },
  {
    id: 'se',
    name: 'Choppy / Hesitant Pulse',
    chinese: '涩脉 (Se Mai)',
    category: 'Stasis',
    bpm: 65,
    tension: 0.6,
    width: 0.35,
    smoothness: 0.15,
    dicroticDepth: 0.2,
    description: 'Rough, fine, and hesitant; feels jagged, irregular, and strained under palpation.',
    clinicalSignificance: 'Blood stasis, severe Qi stagnation, depletion of Jing essence, or microvascular obstruction.',
    sensoryMetaphor: 'Like a serrated knife gently scraping against rough green bamboo (如轻刀刮竹).',
    color: '#a855f7'
  }
];

export interface RadialPosition {
  key: 'cun' | 'guan' | 'chi';
  name: string;
  chinese: string;
  leftOrgan: string;
  leftElement: string;
  rightOrgan: string;
  rightElement: string;
  depthFocus: string;
}

export const RADIAL_POSITIONS: RadialPosition[] = [
  {
    key: 'cun',
    name: 'Cun (Inch)',
    chinese: '寸位',
    leftOrgan: 'Heart (心)',
    leftElement: 'Fire',
    rightOrgan: 'Lungs (肺)',
    rightElement: 'Metal',
    depthFocus: 'Upper Burner (Shang Jiao) & Thoracic Viscera'
  },
  {
    key: 'guan',
    name: 'Guan (Gate)',
    chinese: '关位',
    leftOrgan: 'Liver & Gallbladder (肝胆)',
    leftElement: 'Wood',
    rightOrgan: 'Spleen & Stomach (脾胃)',
    rightElement: 'Earth',
    depthFocus: 'Middle Burner (Zhong Jiao) & Digestive Assimilation'
  },
  {
    key: 'chi',
    name: 'Chi (Foot)',
    chinese: '尺位',
    leftOrgan: 'Kidney Yin (肾阴)',
    leftElement: 'Water',
    rightOrgan: 'Kidney Yang & Mingmen (肾阳/命门)',
    rightElement: 'Water/Fire',
    depthFocus: 'Lower Burner (Xia Jiao) & Jing Essence Roots'
  }
];

interface PulseVisualizerProps {
  onSelectPulse?: (pulse: PulseProfile) => void;
  selectedPulseId?: string;
}

export const PulseVisualizer: React.FC<PulseVisualizerProps> = ({ 
  onSelectPulse,
  selectedPulseId = 'ping'
}) => {
  const [activePulse, setActivePulse] = useState<PulseProfile>(
    CLASSICAL_PULSES.find(p => p.id === selectedPulseId) || CLASSICAL_PULSES[0]
  );
  const [selectedHand, setSelectedHand] = useState<'left' | 'right'>('left');
  const [activePosition, setActivePosition] = useState<'cun' | 'guan' | 'chi'>('guan');
  const [palpationDepth, setPalpationDepth] = useState<'superficial' | 'moderate' | 'deep'>('moderate');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [timeOffset, setTimeOffset] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Update internal pulse when prop changes
  useEffect(() => {
    const found = CLASSICAL_PULSES.find(p => p.id === selectedPulseId);
    if (found) setActivePulse(found);
  }, [selectedPulseId]);

  // Handle pulse selection
  const handleSelectPulse = (pulse: PulseProfile) => {
    setActivePulse(pulse);
    if (onSelectPulse) onSelectPulse(pulse);
  };

  // Sound metronome effect
  useEffect(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const intervalMs = (60 / activePulse.bpm) * 1000;
      const interval = setInterval(() => {
        if (!soundEnabled || !ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(activePulse.category === 'Heat' ? 440 : 220, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      }, intervalMs);

      return () => clearInterval(interval);
    } catch (e) {
      console.error("Audio pulse initialization error", e);
    }
  }, [soundEnabled, activePulse]);

  // Real-time Canvas Waveform Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let localTime = 0;

    const render = () => {
      localTime += 0.04;
      setTimeOffset(localTime);

      const w = canvas.width;
      const h = canvas.height;

      // Clear with dark glass background
      ctx.fillStyle = '#020b0f';
      ctx.fillRect(0, 0, w, h);

      // Draw Oscilloscope Grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < w; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Center Baseline
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Compute Waveform based on active pulse properties
      const period = (60 / activePulse.bpm) * 70; // cycle length in pixels
      const baselineY = h * 0.55;
      const amplitude = (h * 0.35) * (palpationDepth === 'deep' ? 1.15 : palpationDepth === 'superficial' ? 0.8 : 1.0);

      // Begin drawing the pulse curve
      ctx.beginPath();
      ctx.strokeStyle = activePulse.color;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = activePulse.color;
      ctx.shadowBlur = 10;

      for (let x = 0; x < w; x++) {
        // Normalized cycle position 0 to 1
        const cycleProgress = ((x + localTime * 80) % period) / period;
        
        let y = baselineY;

        // Arterial waveform morphology:
        // P-wave (Percussion wave): systolic rise
        // T-wave (Tidal wave): reflection peak
        // D-wave (Dicrotic wave) after dicrotic notch
        if (cycleProgress < 0.22) {
          // Sharp Systolic P-Wave Rise & Fall
          const t = cycleProgress / 0.22;
          const pPeak = Math.sin(t * Math.PI);
          // If wiry, crest is sharper and higher tension
          const tensionFactor = activePulse.tension > 0.7 ? Math.pow(pPeak, 1.4) : pPeak;
          y -= pPeak * amplitude * (1 + activePulse.tension * 0.3);
        } else if (cycleProgress < 0.40) {
          // Tidal Wave (T-wave reflection)
          const t = (cycleProgress - 0.22) / 0.18;
          const tPeak = Math.sin(t * Math.PI) * 0.45;
          y -= tPeak * amplitude;
        } else if (cycleProgress < 0.52) {
          // Dicrotic Notch (Incisura)
          const t = (cycleProgress - 0.40) / 0.12;
          const notchDip = Math.sin(t * Math.PI) * (0.25 * activePulse.dicroticDepth);
          y += notchDip * amplitude;
        } else if (cycleProgress < 0.75) {
          // Dicrotic Wave (Diastolic runoff)
          const t = (cycleProgress - 0.52) / 0.23;
          const dPeak = Math.sin(t * Math.PI) * (0.35 * activePulse.dicroticDepth);
          y -= dPeak * amplitude;
        } else {
          // Diastolic Runoff to Baseline
          const t = (cycleProgress - 0.75) / 0.25;
          const runOff = (1 - t) * 0.05;
          y -= runOff * amplitude;
        }

        // Add texture roughness if choppy (Se Mai)
        if (activePulse.smoothness < 0.5) {
          const jitter = (Math.random() - 0.5) * (1 - activePulse.smoothness) * 12;
          y += jitter;
        }

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Reset shadow blur
      ctx.shadowBlur = 0;

      // Draw Glowing Scanner Head
      const scanX = (localTime * 80) % w;
      const grad = ctx.createLinearGradient(scanX - 30, 0, scanX, 0);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0.25)');
      ctx.fillStyle = grad;
      ctx.fillRect(scanX - 30, 0, 30, h);

      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(scanX, 0);
      ctx.lineTo(scanX, h);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [activePulse, palpationDepth]);

  const activePosData = RADIAL_POSITIONS.find(p => p.key === activePosition)!;
  const currentOrgan = selectedHand === 'left' ? activePosData.leftOrgan : activePosData.rightOrgan;
  const currentElement = selectedHand === 'left' ? activePosData.leftElement : activePosData.rightElement;

  return (
    <div className="w-full space-y-6">
      
      {/* Top Banner & Telemetry Header */}
      <div className="glass-panel p-6 bg-gradient-to-r from-[#04161d]/90 via-[#062029]/80 to-[#030e14]/95 border border-cyan-500/30 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-chinese font-bold text-lg text-emerald-400 tracking-wider">切诊·脉诊仪</span>
                <div className="h-4 w-[1px] bg-cyan-500/40"></div>
                <h3 className="font-sans font-extrabold text-lg md:text-xl tracking-wider text-white uppercase">
                  Arterial Pulse Waveform <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Visualizer</span>
                </h3>
              </div>
              <p className="text-xs font-mono text-cyan-200/70 tracking-widest uppercase mt-0.5">
                28 Classical TCM Pulses &bull; Cun-Guan-Chi Radial Palpation &bull; Real-Time Arterial Oscilloscopy
              </p>
            </div>
          </div>

          {/* Quick Sound & Depth Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-all border ${
                soundEnabled 
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                  : 'bg-slate-900/60 text-slate-400 border-slate-700'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? 'Acoustic Pulse Active' : 'Mute Pulse'}</span>
            </button>

            <div className="px-3 py-1 rounded-full bg-[#020b0f] border border-cyan-500/30 text-xs font-mono text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{activePulse.bpm} BPM</span>
            </div>
          </div>
        </div>

        {/* 🔬 Oscilloscope Canvas & Waveform Readout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 relative z-10">
          
          {/* Main Oscilloscope Screen (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 bg-[#020b0f] shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]">
              {/* Top HUD Stats Overlay */}
              <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono pointer-events-none z-20">
                <div className="flex items-center gap-3">
                  <span className="text-cyan-300 font-bold bg-[#04161d]/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    CHANNEL: RADIAL ARTERY
                  </span>
                  <span className="text-emerald-400">P-WAVE / T-WAVE / DICROTIC</span>
                </div>
                <div className="text-slate-400 bg-[#04161d]/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  DEPTH: <span className="text-cyan-300 uppercase font-bold">{palpationDepth}</span>
                </div>
              </div>

              {/* Canvas Waveform */}
              <canvas
                ref={canvasRef}
                width={700}
                height={220}
                className="w-full h-56 block cursor-crosshair"
              />

              {/* Bottom Oscilloscope Footnote */}
              <div className="p-3 bg-[#030e14]/90 border-t border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
                <div className="flex items-center gap-4 text-slate-300">
                  <span>Elasticity: <strong className="text-cyan-300">{(activePulse.tension * 100).toFixed(0)}%</strong></span>
                  <span>Volume: <strong className="text-emerald-400">{(activePulse.width * 100).toFixed(0)}%</strong></span>
                  <span>Shen Clarity: <strong className="text-amber-300">{(activePulse.smoothness * 100).toFixed(0)}%</strong></span>
                </div>
                <div className="text-cyan-400 font-bold">
                  {activePulse.chinese} &bull; {activePulse.name}
                </div>
              </div>
            </div>

            {/* Depth Palpation Slider & Controls */}
            <div className="p-4 rounded-2xl bg-[#04141c]/80 border border-cyan-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Palpation Depth (浮中沉):
                </span>
              </div>
              <div className="flex items-center gap-2 bg-[#020b0f] p-1 rounded-xl border border-cyan-500/30">
                <button
                  onClick={() => setPalpationDepth('superficial')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    palpationDepth === 'superficial'
                      ? 'bg-cyan-600 text-white shadow'
                      : 'text-slate-400 hover:text-cyan-300'
                  }`}
                >
                  Superficial (浮取 - Skin/Wei)
                </button>
                <button
                  onClick={() => setPalpationDepth('moderate')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    palpationDepth === 'moderate'
                      ? 'bg-cyan-600 text-white shadow'
                      : 'text-slate-400 hover:text-cyan-300'
                  }`}
                >
                  Moderate (中取 - Vessels/Qi)
                </button>
                <button
                  onClick={() => setPalpationDepth('deep')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    palpationDepth === 'deep'
                      ? 'bg-cyan-600 text-white shadow'
                      : 'text-slate-400 hover:text-cyan-300'
                  }`}
                >
                  Deep (沉取 - Bone/Yin)
                </button>
              </div>
            </div>
          </div>

          {/* Cun, Guan, Chi Anatomical Palpation Hub (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-[#04141c]/90 border border-cyan-500/25 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300">
                    Radial Position Array
                  </h4>
                </div>
                {/* Hand Switcher */}
                <div className="flex items-center gap-1 bg-[#020b0f] p-1 rounded-lg border border-cyan-500/20">
                  <button
                    onClick={() => setSelectedHand('left')}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${
                      selectedHand === 'left' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Left Hand
                  </button>
                  <button
                    onClick={() => setSelectedHand('right')}
                    className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${
                      selectedHand === 'right' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Right Hand
                  </button>
                </div>
              </div>

              {/* Cun, Guan, Chi Selector Nodes */}
              <div className="space-y-2.5">
                {RADIAL_POSITIONS.map(pos => {
                  const isSelected = activePosition === pos.key;
                  const organ = selectedHand === 'left' ? pos.leftOrgan : pos.rightOrgan;
                  const element = selectedHand === 'left' ? pos.leftElement : pos.rightElement;

                  return (
                    <button
                      key={pos.key}
                      onClick={() => setActivePosition(pos.key)}
                      className={`w-full p-3 rounded-xl text-left transition-all border flex items-center justify-between ${
                        isSelected
                          ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                          : 'bg-[#061e27]/50 border-cyan-500/20 hover:border-cyan-500/40 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-chinese font-bold text-xs ${
                          isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-cyan-950/60 text-cyan-300'
                        }`}>
                          {pos.chinese.slice(0, 1)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{pos.name}</span>
                            <span className="text-[10px] font-mono font-normal text-cyan-400/80">{pos.chinese}</span>
                          </div>
                          <span className="text-[11px] font-mono text-emerald-400">{organ}</span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-900/80 text-cyan-300 border border-cyan-500/20">
                        {element}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Palpation Target Focus */}
              <div className="p-3.5 rounded-xl bg-[#020b0f] border border-cyan-500/20 text-xs font-mono space-y-1.5">
                <div className="flex items-center justify-between text-cyan-400 text-[10px]">
                  <span>ACTIVE BIO-FIELD TARGET:</span>
                  <span className="text-emerald-400 font-bold">{selectedHand.toUpperCase()} {activePosData.name.toUpperCase()}</span>
                </div>
                <div className="text-slate-200 font-sans text-xs">
                  Probing <strong className="text-cyan-300">{currentOrgan}</strong> ({currentElement} Element).
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {activePosData.depthFocus}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Sensory Metaphor & Classical Clinical Analysis */}
        <div className="mt-6 p-5 rounded-2xl bg-[#04161d]/80 border border-cyan-500/25 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
              Classical Sensory Metaphor (经意象)
            </span>
            <p className="text-slate-200 font-serif italic text-sm leading-relaxed">
              "{activePulse.sensoryMetaphor}"
            </p>
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
              Clinical Syndrome Indication (辨证意义)
            </span>
            <p className="text-slate-300 font-sans leading-relaxed">
              {activePulse.clinicalSignificance}
            </p>
          </div>
        </div>

      </div>

      {/* 28 Classical Pulses Catalog Selector Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-cyan-300">
              Select Classical TCM Pulse Waveform Archetype:
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Click any pulse to simulate arterial dynamics</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CLASSICAL_PULSES.map(pulse => {
            const isSelected = activePulse.id === pulse.id;
            return (
              <motion.button
                key={pulse.id}
                onClick={() => handleSelectPulse(pulse)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-3 rounded-2xl text-left transition-all border relative overflow-hidden flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-cyan-950/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                    : 'bg-[#04161d]/70 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#062029]/80'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-400/10 rounded-bl-full pointer-events-none"></div>
                )}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span 
                      className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: `${pulse.color}20`, color: pulse.color }}
                    >
                      {pulse.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{pulse.bpm} BPM</span>
                  </div>
                  <div className="font-chinese font-bold text-base text-white">{pulse.chinese}</div>
                  <div className="text-[11px] font-sans font-bold text-slate-200 truncate mt-0.5">{pulse.name}</div>
                </div>
                <div className="mt-2 text-[10px] font-mono text-cyan-300/80 truncate">
                  {pulse.description.slice(0, 32)}...
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
