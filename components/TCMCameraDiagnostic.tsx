import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  RefreshCw, 
  Heart, 
  Droplet, 
  Check, 
  Sparkles, 
  ShieldAlert, 
  Sparkles as SparkleIcon,
  ShoppingBag,
  Scan,
  Compass,
  Activity
} from 'lucide-react';

interface TCMCameraDiagnosticProps {
  onDiagnosticComplete: (insights: any) => void;
  masteryMode: 'YU' | 'WUJI';
}

interface Specimen {
  id: string;
  name: string;
  type: 'drinking' | 'fast_food' | 'lack_veg' | 'balanced';
  description: string;
  imageUrl: string;
  features: string[];
  findings: {
    status: string;
    elements: string[];
    needs: string[];
    foods: string[];
    soldAtRodT: boolean;
    acupuncture: string[];
    qiAwarded: number;
  };
}

const SPECIMENS: Specimen[] = [
  {
    id: 'specimen-drinking',
    name: 'Frequent Drinking & Stress Strain',
    type: 'drinking',
    description: 'Flushed malar region, micro-red capillaries on nose, and yellowing sclera indicating liver tension.',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
    features: ['Malar cheek redness', 'Telangiectasia near nose', 'Liver zone (glabella) furrow'],
    findings: {
      status: 'Liver Fire Flare-up due to dietary/alcohol damp-heat accumulation.',
      elements: ['Excess Wood (Liver)', 'Fire Overplay'],
      needs: ['Water hydration', 'Liver clearing diet', 'Rest and meditation'],
      foods: ['Lemon-infused mineral elixir', 'Chrysanthemum flower tea', 'Pear pulp drink'],
      soldAtRodT: true,
      acupuncture: ['LV3 (Taichong)', 'Yintang'],
      qiAwarded: 15
    }
  },
  {
    id: 'specimen-fastfood',
    name: 'High-Fat / Fast Food Strain',
    type: 'fast_food',
    description: 'Swollen lower eyelids, greasiness along T-zone, and dull yellow skin tone from digestive dampness.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    features: ['T-zone lipid accumulation', 'Infraorbital puffiness', 'Stomach heat blush'],
    findings: {
      status: 'Spleen-Stomach Damp-Heat retention resulting from processed greases.',
      elements: ['Stagnant Earth (Spleen)', 'Dampness Turbidity'],
      needs: ['Electrolyte water balance', 'Digestive reboot', 'Early sleep cycle'],
      foods: ['Barley & mung bean broth', 'Hawthorn berry tisane', 'Steamed lotus root with millet'],
      soldAtRodT: true,
      acupuncture: ['ST36 (Zusanli)', 'SP9 (Yinlingquan)'],
      qiAwarded: 20
    }
  },
  {
    id: 'specimen-noveg',
    name: 'Vegetable Deficiency & Sallow Qi',
    type: 'lack_veg',
    description: 'Pale, dry lips with lack of lustre, sallow complexion, and visible fatigue under ocular zones.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    features: ['Pale lip vermillion border', 'Sallow cheek tone', 'Qi blood deficiency shadows'],
    findings: {
      status: 'Blood & Yin Deficiency due to insufficient chlorophyll & green micronutrient intake.',
      elements: ['Deficient Earth (Spleen)', 'Depleted Water (Kidney)'],
      needs: ['Deep fluid replenishment', 'Nutrient-rich restorative meals', 'Restorative sleep'],
      foods: ['Spinach & wild black sesame soup', 'Wolfberry and red date congee', 'Steamed green cabbage elixir'],
      soldAtRodT: true,
      acupuncture: ['SP6 (Sanyinjiao)', 'BL20 (Pishu)'],
      qiAwarded: 25
    }
  },
  {
    id: 'specimen-balanced',
    name: 'Harmonious Equilibrium (Target Specimen)',
    type: 'balanced',
    description: 'Radiant shen, moist lips, balanced peach undertones, and clear ocular sclera without stagnation.',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
    features: ['Vibrant Shen eye clarity', 'Equilibrated complexion', 'Supple hydration'],
    findings: {
      status: 'Yin-Yang Equilibrium with harmonious Zang-Fu Qi circulation.',
      elements: ['Harmonized Five Elements', 'Sovereign Shen'],
      needs: ['Maintain hydration', 'Preserve seasonal circadian rhythm', 'Clean nourishing foods'],
      foods: ['Mild goji seed green tea', 'Pure mountain spring water', 'Five-grain porridge'],
      soldAtRodT: true,
      acupuncture: ['RN12 (Zhongwan)', 'DU20 (Baihui)'],
      qiAwarded: 10
    }
  }
];

export const TCMCameraDiagnostic: React.FC<TCMCameraDiagnosticProps> = ({ 
  onDiagnosticComplete,
  masteryMode 
}) => {
  const [selectedSpecimen, setSelectedSpecimen] = useState<Specimen>(SPECIMENS[0]);
  const [useCamera, setUseCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [committedActions, setCommittedActions] = useState<string[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setUseCamera(true);
      }
    } catch (err) {
      console.error(err);
      setCameraError("Camera access denied or unequipped. You may continue with clinical specimens.");
      setUseCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setUseCamera(false);
  };

  const snapPhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 400;
      canvas.height = video.videoHeight || 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const triggerDiagnostic = () => {
    setIsProcessing(true);
    setDiagnosticResult(null);

    setTimeout(() => {
      const activeFindings = selectedSpecimen.findings;
      const customResult = {
        title: selectedSpecimen.name,
        type: selectedSpecimen.type,
        status: activeFindings.status,
        elements: activeFindings.elements,
        needs: activeFindings.needs,
        recommendedFoods: activeFindings.foods,
        soldAtRodT: activeFindings.soldAtRodT,
        acupressure: activeFindings.acupuncture,
        qiAwarded: activeFindings.qiAwarded,
        timestamp: new Date().toLocaleTimeString(),
        overlayMark: selectedSpecimen.type
      };
      
      setDiagnosticResult(customResult);
      setIsProcessing(false);
      
      onDiagnosticComplete({
        syndrome: {
          name: customResult.title,
          hypothesis: `${customResult.status} The image scan of the face organs indicates the need for water, rest, and a positive diet and drink regimen.`,
          metrics: [
            { label: 'Qi Flow Status', value: selectedSpecimen.type === 'balanced' ? 95 : 62, sub: '%' },
            { label: 'Moisture Balance', value: selectedSpecimen.type === 'drinking' ? 38 : 78, sub: '%' },
            { label: 'Detox Vitality', value: selectedSpecimen.type === 'fast_food' ? 45 : 82, sub: '%' }
          ]
        },
        wuxingInsights: [
          `Detected imbalance zone: ${customResult.elements.join(" & ")}.`,
          `Diagnosis indicates the absolute necessity of water, restorative hydration, organic congee & teas.`
        ],
        regimen: {
          actions: customResult.recommendedFoods.map((f, i) => ({
            id: `rod-t-food-${i}`,
            title: `Recommended: ${f}`,
            description: customResult.soldAtRodT 
              ? `This highly active healing food is prepared fresh and sold at The Rod T.`
              : `Use this nutrient to restore homeostasis.`,
            emoji: i === 0 ? "🧉" : i === 1 ? "🍲" : "🥗",
            element: customResult.elements[0] || "Earth"
          }))
        }
      });
    }, 1800);
  };

  const handleCommitAction = (actionId: string) => {
    if (!committedActions.includes(actionId)) {
      setCommittedActions(prev => [...prev, actionId]);
    }
  };

  const ZONES = [
    { id: 'forehead', name: 'Forehead Zone', organ: 'Bladder / Metabolism', info: 'Linked to digestive toxins and general stress.', top: '15%', left: '50%' },
    { id: 'glabella', name: 'Between Brows (Glabella)', organ: 'Liver (肝) Zone', info: 'Tension, deep lines indicate alcohol or anger fire stagnation.', top: '35%', left: '50%' },
    { id: 'cheeks', name: 'Cheekbones Zone', organ: 'Lungs (肺) Zone', info: 'Skin tone here indicates respiratory exhaustion.', top: '50%', left: '30%' },
    { id: 'cheeks-r', name: 'Right Cheek Zone', organ: 'Spleen / Stomach', info: 'Yellowing or splotches indicate fast-food stress.', top: '50%', left: '70%' },
    { id: 'nose', name: 'Nose Tip', organ: 'Heart (心) Zone', info: 'Broken vessels represent high circulation stress.', top: '48%', left: '50%' },
    { id: 'jawline', name: 'Chin & Jawline', organ: 'Kidneys / Adrenals', info: 'Acne indicates hormonal and adrenal blockages.', top: '75%', left: '50%' }
  ];

  return (
    <div className="glass-panel p-6 md:p-8 space-y-6 relative overflow-hidden bg-[#04141c]/90 border border-cyan-500/25">
      <div className="absolute top-0 right-0 p-4">
        <span className="px-3 py-1 bg-cyan-950/80 text-cyan-300 text-[10px] font-mono font-bold tracking-widest uppercase rounded-full border border-cyan-400/40 shadow-sm">
          Vision AI &bull; Mien Shiang Engine
        </span>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="font-mono text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <Scan className="w-6 h-6 text-cyan-400 animate-pulse" />
            Mien Shiang Diagnostics <span className="text-xs font-mono font-normal text-cyan-400/70">[Complexion Hologram]</span>
          </h2>
          <p className="text-xs text-slate-300 font-light mt-1 max-w-xl leading-relaxed">
            Capture or choose a facial specimen to run the multi-agent Zang-Fu organ diagnostic engine. Maps clinical signs of drinking, fast food, bloating, and vegetable deficiency.
          </p>
        </div>

        {cameraError && (
          <div className="p-4 bg-cyan-950/50 rounded-2xl border border-cyan-500/30 flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-xs text-cyan-200 leading-normal font-light">{cameraError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* CAMERA / VIEWER STAGE */}
          <div className="space-y-4">
            <div className="relative aspect-square max-w-[340px] mx-auto rounded-3xl overflow-hidden bg-[#020b0f] shadow-2xl border border-cyan-500/30">
              {useCamera ? (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  <div className="absolute inset-0 border border-cyan-400/30 rounded-3xl pointer-events-none" />
                </>
              ) : capturedImage ? (
                <div className="relative w-full h-full">
                  <img src={capturedImage} className="w-full h-full object-cover" alt="Captured Face" />
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {activeZone && (
                      <circle 
                        cx={ZONES.find(z => z.id === activeZone)?.left === '50%' ? '170' : '220'}
                        cy="170"
                        r="35"
                        fill="rgba(6, 182, 212, 0.2)"
                        stroke="#06b6d4"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                        className="animate-pulse"
                      />
                    )}
                  </svg>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <img src={selectedSpecimen.imageUrl} className="w-full h-full object-cover filter brightness-90" alt="Specimen Face" />
                  
                  {/* Interactive Dot Highlights Mapping */}
                  <div className="absolute inset-0">
                    {ZONES.map((zone) => (
                      <button
                        key={zone.id}
                        onClick={() => setActiveZone(activeZone === zone.id ? null : zone.id)}
                        className={`absolute w-3.5 h-3.5 rounded-full -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 ${
                          activeZone === zone.id 
                            ? 'bg-emerald-400 ring-8 ring-emerald-400/30 scale-125 shadow-[0_0_12px_#10b981]' 
                            : 'bg-cyan-400 ring-4 ring-slate-900/80 hover:bg-emerald-300 hover:scale-110 shadow-[0_0_8px_#06b6d4]'
                        }`}
                        style={{ top: zone.top, left: zone.left }}
                        title={zone.name}
                      >
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#020b0f]/95 border border-cyan-500/40 text-cyan-200 rounded-lg text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                          {zone.organ}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Shutter Animation effect */}
              {isProcessing && (
                <div className="absolute inset-0 bg-[#020b0f]/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-widest animate-pulse">
                      Spectrometric Facial Analysis...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Target Area Details Box */}
            <AnimatePresence mode="wait">
              {activeZone && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-cyan-950/60 border border-cyan-500/30 p-4 rounded-2xl text-xs font-mono"
                >
                  <p className="font-bold text-white flex items-center gap-1.5 leading-none">
                    <Heart className="w-3.5 h-3.5 text-cyan-400" />
                    {ZONES.find(z => z.id === activeZone)?.name} — {ZONES.find(z => z.id === activeZone)?.organ}
                  </p>
                  <p className="text-slate-300 font-light mt-1.5 leading-relaxed">
                    {ZONES.find(z => z.id === activeZone)?.info}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ACTION PILLS FOR MEDIA CAPTURE */}
            <div className="flex gap-2 justify-center">
              {useCamera ? (
                <>
                  <button 
                    onClick={snapPhoto}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-full text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-cyan-600/30"
                  >
                    <Check className="w-3.5 h-3.5" /> Snap Photograph
                  </button>
                  <button 
                    onClick={stopCamera}
                    className="px-4 py-2 bg-slate-900 text-slate-300 hover:bg-slate-800 rounded-full text-xs font-mono font-bold uppercase tracking-wider border border-cyan-500/30"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  onClick={startCamera}
                  className="px-4 py-2 bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-500/40 rounded-full text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm"
                >
                  <Camera className="w-4 h-4 text-cyan-400" /> Enable Laptop Camera
                </button>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* SPECIMENS SELECTOR BAR */}
          <div className="space-y-4">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              Selectable Test Specimens
            </span>
            <div className="grid grid-cols-1 gap-2.5">
              {SPECIMENS.map((specimen) => (
                <button
                  key={specimen.id}
                  onClick={() => {
                    setSelectedSpecimen(specimen);
                    setCapturedImage(null);
                    setUseCamera(false);
                    setDiagnosticResult(null);
                  }}
                  className={`p-3 rounded-2xl flex items-center gap-3 text-left transition-all border ${
                    selectedSpecimen.id === specimen.id
                      ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'bg-[#051820]/70 hover:bg-[#07242e]/80 border-cyan-500/20'
                  }`}
                >
                  <img src={specimen.imageUrl} className="w-12 h-12 rounded-xl object-cover border border-cyan-500/30 shrink-0" alt="Specimen" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-mono font-bold text-white leading-tight">{specimen.name}</p>
                    <p className="text-[10px] text-slate-400 font-light truncate mt-0.5">{specimen.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <button 
              onClick={triggerDiagnostic}
              disabled={isProcessing}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-2xl text-xs font-mono font-bold uppercase tracking-widest hover:brightness-110 disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 border border-cyan-300/40"
            >
              <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
              Analyze Physical Indicators
            </button>
          </div>
        </div>

        {/* ANALYSIS OUTCOME & THE ROD T COUPLING */}
        <AnimatePresence>
          {diagnosticResult && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 border-t border-cyan-500/20 pt-6 space-y-6"
            >
              <div className="p-6 bg-[#051820]/85 border border-cyan-500/30 rounded-3xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-950 rounded-xl border border-cyan-400/40">
                    <SparkleIcon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-mono text-base font-bold text-white leading-tight">
                      Vision AI Scan Outcome: Harmonization Complete
                    </h3>
                    <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mt-0.5">
                      Zheng Syndrome Differentiation Results
                    </p>
                  </div>
                </div>

                {/* THE NEED CONSTRAINTS */}
                <div className="p-4 bg-[#020b0f]/80 rounded-2xl border border-cyan-500/20 space-y-2 font-mono">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                    <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                    Indicated Systemic Requirements:
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-light mt-1">
                    The image scan of the face organs indicates the absolute urgent need for{' '}
                    <span className="font-bold underline text-cyan-400">water (proper hydration)</span>,{' '}
                    <span className="font-bold underline text-emerald-400">adequate physical rest</span>, and{' '}
                    <span className="font-bold underline text-teal-300">a positive organic diet plus drink congee regimen</span>.
                  </p>
                </div>

                {/* THE ROD T COUPLING AND SUGGESTIONS */}
                {diagnosticResult.soldAtRodT && (
                  <div className="p-4 bg-cyan-950/40 rounded-2xl border border-cyan-500/30 space-y-3 font-mono">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 leading-none">
                      <ShoppingBag className="w-4 h-4 text-cyan-400" />
                      Dietary Purchases at The Rod T:
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      Since your face scan suggests traces of <strong className="text-cyan-200">{formattedPathogenDescription(diagnosticResult.type)}</strong>, 
                      the recommended cooling, antioxidant, and clearing foods below are certified organic and{' '}
                      <strong className="text-white">sold directly at the local Rod T wellness grocery counter</strong>.
                    </p>

                    {/* FOOD ITEM GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      {diagnosticResult.recommendedFoods.map((food: string, idx: number) => (
                        <div key={idx} className="p-3 bg-[#020b0f]/80 rounded-xl border border-cyan-500/25 flex flex-col justify-between group relative overflow-hidden">
                          <span className="text-xs font-mono font-bold text-white leading-snug">{food}</span>
                          <span className="text-[10px] text-cyan-400 font-medium block mt-1 uppercase tracking-wider">The Rod T Stock</span>
                          
                          <button
                            onClick={() => handleCommitAction(`commit-${idx}`)}
                            className={`mt-2 w-full py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase transition-all flex items-center justify-center gap-1 ${
                              committedActions.includes(`commit-${idx}`)
                                ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                                : 'bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/30 text-cyan-300'
                            }`}
                          >
                            {committedActions.includes(`commit-${idx}`) ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" /> Committed
                              </>
                            ) : (
                              'Commit to Diet'
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-2 text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">
                  <div>Element Imbalance: <span className="text-cyan-300">{diagnosticResult.elements.join(" / ")}</span></div>
                  <div className="hidden sm:block text-slate-600">|</div>
                  <div>Recommended Points: <span className="text-emerald-300">{diagnosticResult.acupressure.join(", ")}</span></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

function formattedPathogenDescription(type: string): string {
  switch (type) {
    case 'drinking':
      return 'frequent alcohol intake or liver damp-heat stagnation';
    case 'fast_food':
      return 'high-fat diet, fried fast food, or digestive grease stress';
    case 'lack_veg':
      return 'lack of vegetable fibers and blood building green nutrients';
    default:
      return 'systemic imbalance';
  }
}
