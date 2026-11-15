import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Layers,
  Scan,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Code,
  Copy,
  Check,
  TrendingUp,
  Droplets,
  Lock,
  ArrowRight
} from 'lucide-react';
import {
  BarrierIntakeInput,
  CulturalProfile,
  FacialZone,
  ConciergeDossier,
  COHORT_FINANCIAL_BENCHMARK,
  computeIsotropicLossMatrix,
  runConciergePipeline
} from '../services/constitutionEngine';

interface ConciergeEngineProps {
  onSyncConcierge?: (dossier: ConciergeDossier) => void;
}

const ZONE_OPTIONS: { id: FacialZone; label: string; region: string }[] = [
  { id: 'yintang_forehead', label: 'Yintang & Forehead', region: 'Liver / Upper Burner' },
  { id: 'malar_cheeks', label: 'Malar Cheeks', region: 'Stomach / Lung Boundary' },
  { id: 'nose_tzone', label: 'Nose & T-Zone', region: 'Spleen-Stomach Damp' },
  { id: 'chin_jawline', label: 'Chin & Jawline', region: 'Endocrine / Lower Burner' },
  { id: 'infraorbital_eyes', label: 'Infraorbital Under-Eye', region: 'Kidney Jing / Marrow' }
];

const CULTURAL_PROFILES: CulturalProfile[] = [
  'Standard',
  'Halal',
  'Kosher',
  'Vegetarian',
  'Strict Ayurvedic'
];

export const ConciergeEngine: React.FC<ConciergeEngineProps> = ({ onSyncConcierge }) => {
  const [intake, setIntake] = useState<BarrierIntakeInput>({
    zone: 'malar_cheeks',
    tewlLevel: 'Elevated',
    overCleansing: true,
    pomadeOcclusion: false,
    contactFriction: true,
    spleenDeficiencyRisk: true,
    culturalProfile: 'Standard',
    testBlockedHerb: 'none'
  });

  const [sigma, setSigma] = useState<number>(6.5);
  const [r0, setR0] = useState<number>(0.62);
  const [showJson, setShowJson] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  const lossMatrix = useMemo(() => computeIsotropicLossMatrix(sigma, r0), [sigma, r0]);
  const dossier = useMemo(() => runConciergePipeline(intake), [intake]);

  const conciergeJsonPayload = useMemo(
    () => ({
      tcm_observation: dossier.layer2ConstitutionalPattern.tcm_observation,
      pattern: dossier.layer2ConstitutionalPattern.pattern,
      layer1_barrier_audit: dossier.layer1BarrierAudit,
      dietary_therapy: dossier.dietary_therapy,
      safety_note: dossier.safety_note,
      affiliate_basket: {
        items: dossier.affiliateBasket.items.map((item) => ({
          partner: item.partner,
          product: item.name,
          price_usd: item.price,
          take_rate_pct: Math.round(item.takeRate * 100)
        })),
        gmv_usd: dossier.affiliateBasket.totalGMV,
        net_commission_usd: dossier.affiliateBasket.netAffiliateRevenue,
        blended_take_rate_pct: dossier.affiliateBasket.blendedTakeRate
      }
    }),
    [dossier]
  );

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(conciergeJsonPayload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="w-full space-y-6">
      <div className="glass-panel p-6 md:p-8 bg-gradient-to-br from-[#04161d]/95 via-[#062029]/90 to-[#030e14]/95 border border-cyan-500/30 rounded-3xl space-y-6 relative overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-cyan-500/20 pb-5">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)] shrink-0">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-widest">
                  Observe &rarr; Understand &rarr; Act
                </span>
                <h3 className="font-sans font-extrabold text-lg md:text-xl tracking-wide text-white uppercase">
                  Dr. Yu Private Concierge{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                    Dual-Layer Wellness Engine
                  </span>
                </h3>
              </div>
              <p className="text-xs font-mono text-cyan-200/75 mt-1">
                Layer 1 Cutaneous Barrier Audit &bull; Layer 2 OpenTCM Constitutional Patterning &bull; Spleen &amp; DILI Guardrails &bull; Affiliate Broker
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowJson((v) => !v)}
              className="px-3.5 py-2 rounded-xl bg-[#020b0f] border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:border-cyan-400 flex items-center gap-1.5 transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
              {showJson ? 'Hide Concierge JSON' : 'Inspect JSON Schema'}
            </button>
            {onSyncConcierge && (
              <button
                type="button"
                onClick={() => onSyncConcierge(dossier)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-xs font-mono font-bold flex items-center gap-1.5 hover:brightness-110 shadow-md shadow-cyan-600/25 border border-cyan-400/40"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Sync Concierge Plan
              </button>
            )}
          </div>
        </div>

        {/* 5-Stage Sovereign Pipeline Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {dossier.pipelineStages.map((st, idx) => (
            <div
              key={st.stage}
              className={`p-3 rounded-2xl border transition-all ${
                st.status === 'intercepted'
                  ? 'bg-amber-950/35 border-amber-400/50'
                  : 'bg-[#031118]/85 border-cyan-500/25'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase">
                <span className="text-cyan-400">
                  {idx + 1}. {st.stage}
                </span>
                {st.status === 'intercepted' ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <p className="text-[11px] text-slate-300 mt-1.5 leading-snug">{st.summary}</p>
            </div>
          ))}
        </div>

        {/* Main 3-Column Interactive Stage */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* COL 1: OBSERVE — VISION CORE (14x14 ViT Isotropic Loss + Intake Controls) */}
          <div className="xl:col-span-4 p-5 rounded-2xl bg-[#030e14]/90 border border-cyan-500/25 space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Scan className="w-4 h-4 text-cyan-400" /> 1. Observe (Vision Core)
              </span>
              <span className="text-[10px] font-mono text-slate-400">MeFEm 2&times;max(w,h)</span>
            </div>

            {/* Facial Zone Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase block">
                Target Anatomical Region
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {ZONE_OPTIONS.map((z) => (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setIntake((prev) => ({ ...prev, zone: z.id }))}
                    className={`px-3 py-2 rounded-xl text-left text-xs border transition-all flex items-center justify-between ${
                      intake.zone === z.id
                        ? 'bg-cyan-950/90 border-cyan-400 text-white shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                        : 'bg-[#051820]/60 border-cyan-500/15 text-slate-300 hover:border-cyan-500/40'
                    }`}
                  >
                    <span className="font-semibold">{z.label}</span>
                    <span className="text-[10px] font-mono text-cyan-300">{z.region}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 14x14 ViT Patch Grid Isotropic Sigmoidal Loss Visualizer */}
            <div className="p-3.5 rounded-xl bg-[#020b0f] border border-cyan-500/20 space-y-2.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-cyan-300 font-bold">14&times;14 ViT Isotropic Loss</span>
                <span className="text-emerald-400">Dim = {dossier.visionMetrics.normalizedDim}px</span>
              </div>

              <div
                className="grid gap-[2px] w-full max-w-[210px] mx-auto aspect-square p-1.5 rounded-lg bg-slate-950 border border-cyan-500/20"
                style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}
              >
                {lossMatrix.flatMap((row, rIdx) =>
                  row.map((weight, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      title={`Patch (${cIdx},${rIdx}) weight: ${weight}`}
                      className="rounded-[2px] transition-colors"
                      style={{
                        backgroundColor: `rgba(34, 211, 238, ${Math.max(0.08, weight)})`
                      }}
                    />
                  ))
                )}
              </div>

              <div className="text-[10px] font-mono text-slate-400 text-center">
                {dossier.visionMetrics.lossFormula}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] font-mono text-slate-400">
                <div>
                  <div className="flex justify-between">
                    <span>&sigma; Steepness</span>
                    <span className="text-cyan-300 tabular-nums">{sigma.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min={2}
                    max={12}
                    step={0.5}
                    value={sigma}
                    onChange={(e) => setSigma(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 h-1 bg-slate-800 rounded"
                  />
                </div>
                <div>
                  <div className="flex justify-between">
                    <span>r&#8320; Radius</span>
                    <span className="text-cyan-300 tabular-nums">{r0.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min={0.3}
                    max={0.9}
                    step={0.02}
                    value={r0}
                    onChange={(e) => setR0(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 h-1 bg-slate-800 rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* COL 2: UNDERSTAND — DUAL-LAYER DIAGNOSTIC & SAFETY GUARDRAILS */}
          <div className="xl:col-span-4 p-5 rounded-2xl bg-[#030e14]/90 border border-cyan-500/25 space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" /> 2. Understand (Dual-Layer)
              </span>
              <span className="text-[10px] font-mono text-emerald-400">OpenTCM GraphRAG</span>
            </div>

            {/* Layer 1 Controls */}
            <div className="p-3.5 rounded-xl bg-[#051820]/80 border border-cyan-500/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5" /> Layer 1: Cutaneous Barrier
                </span>
                <select
                  value={intake.tewlLevel}
                  onChange={(e) =>
                    setIntake((prev) => ({
                      ...prev,
                      tewlLevel: e.target.value as BarrierIntakeInput['tewlLevel']
                    }))
                  }
                  className="bg-[#020b0f] border border-cyan-500/30 rounded-lg px-2 py-1 text-[10px] font-mono text-cyan-200"
                >
                  <option value="Low">TEWL: Low</option>
                  <option value="Moderate">TEWL: Moderate</option>
                  <option value="Elevated">TEWL: Elevated</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: 'overCleansing', label: 'Over-Cleansing' },
                  { key: 'pomadeOcclusion', label: 'Hairline Pomade' },
                  { key: 'contactFriction', label: 'Phone/Pillow Friction' }
                ].map((toggle) => {
                  const active = Boolean(intake[toggle.key as keyof BarrierIntakeInput]);
                  return (
                    <button
                      key={toggle.key}
                      type="button"
                      onClick={() =>
                        setIntake((prev) => ({
                          ...prev,
                          [toggle.key]: !prev[toggle.key as keyof BarrierIntakeInput]
                        }))
                      }
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-colors ${
                        active
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                          : 'bg-[#020b0f] border-slate-700 text-slate-400'
                      }`}
                    >
                      {toggle.label}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                {dossier.layer1BarrierAudit.tewlAssessment}
              </p>
              <p className="text-[11px] text-cyan-200/80 font-mono">
                Protocol: {dossier.layer1BarrierAudit.barrierProtocol}
              </p>
            </div>

            {/* Layer 2 Constitutional Finding */}
            <div className="p-3.5 rounded-xl bg-[#051820]/80 border border-emerald-500/25 space-y-2">
              <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase block">
                Layer 2: Constitutional &amp; Endocrine Pattern
              </span>
              <div className="text-sm font-bold text-white">
                {dossier.layer2ConstitutionalPattern.pattern}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {dossier.layer2ConstitutionalPattern.tcm_observation}
              </p>
              <div className="text-[11px] font-mono text-cyan-300">
                Wu Xing: {dossier.layer2ConstitutionalPattern.wuXingCycle}
              </div>
              <div className="text-[11px] text-slate-400 italic">
                Endocrine Note: {dossier.layer2ConstitutionalPattern.endocrineCorrelation}
              </div>
            </div>

            {/* Safety Guardrails & Cultural Filter Controls */}
            <div className="p-3.5 rounded-xl bg-[#020b0f] border border-amber-500/30 space-y-2.5">
              <span className="text-[11px] font-mono font-bold text-amber-300 uppercase flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Safety &amp; Cultural Guardrails
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-mono text-slate-400 uppercase block mb-1">
                    Cultural / Religious Filter
                  </label>
                  <select
                    value={intake.culturalProfile}
                    onChange={(e) =>
                      setIntake((prev) => ({
                        ...prev,
                        culturalProfile: e.target.value as CulturalProfile
                      }))
                    }
                    className="w-full bg-[#051820] border border-cyan-500/30 rounded-lg px-2 py-1.5 text-[11px] font-mono text-white"
                  >
                    {CULTURAL_PROFILES.map((cp) => (
                      <option key={cp} value={cp}>
                        {cp}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-mono text-slate-400 uppercase block mb-1">
                    Toxicology Guard Test
                  </label>
                  <select
                    value={intake.testBlockedHerb}
                    onChange={(e) =>
                      setIntake((prev) => ({
                        ...prev,
                        testBlockedHerb: e.target.value as BarrierIntakeInput['testBlockedHerb']
                      }))
                    }
                    className="w-full bg-[#051820] border border-cyan-500/30 rounded-lg px-2 py-1.5 text-[11px] font-mono text-white"
                  >
                    <option value="none">Nominal (Safe Herbs)</option>
                    <option value="ku_lian_pi">Simulate Ku Lian Pi (DILI)</option>
                    <option value="senna_laxative">Simulate Senna Laxative</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center justify-between text-xs font-mono text-slate-200 cursor-pointer pt-1">
                <span>Spleen Safety Shield (Block Cold/Raw)</span>
                <input
                  type="checkbox"
                  checked={intake.spleenDeficiencyRisk}
                  onChange={(e) =>
                    setIntake((prev) => ({ ...prev, spleenDeficiencyRisk: e.target.checked }))
                  }
                  className="accent-emerald-400 w-4 h-4"
                />
              </label>

              {dossier.interceptions.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {dossier.interceptions.map((hit, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-amber-950/45 border border-amber-400/40 text-[11px] space-y-0.5"
                    >
                      <div className="font-mono font-bold text-amber-300 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                        <span>{hit.guardrail}: Blocked "{hit.blockedItem}"</span>
                      </div>
                      <p className="text-slate-300">{hit.reason}</p>
                      <p className="text-emerald-300 font-mono flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" /> Safe Swap: {hit.safeReplacement}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* COL 3: ACT — AUTOMATED AFFILIATE BROKER & COHORT UNIT ECONOMICS */}
          <div className="xl:col-span-4 p-5 rounded-2xl bg-[#030e14]/90 border border-cyan-500/25 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2.5">
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-amber-400" /> 3. Act (Affiliate Broker)
                </span>
                <span className="text-[10px] font-mono text-emerald-400">
                  {dossier.affiliateBasket.blendedTakeRate}% Blended Take
                </span>
              </div>

              {/* Guarded Basket Items */}
              <div className="space-y-2.5">
                {dossier.affiliateBasket.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#051820]/80 border border-cyan-500/20 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-cyan-300 font-bold">{item.partner}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                        {Math.round(item.takeRate * 100)}% Take Rate
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-xs font-bold text-white">{item.name}</span>
                      <span className="text-xs font-mono font-bold text-amber-300 tabular-nums shrink-0">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">{item.rationale}</p>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      Marker: {item.mappedMarker} &bull; Nature: {item.thermalNature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Active Cart Economics */}
              <div className="p-3.5 rounded-xl bg-[#020b0f] border border-cyan-500/25 grid grid-cols-3 gap-2 text-center font-mono">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block">Basket GMV</span>
                  <span className="text-sm font-bold text-white tabular-nums">
                    ${dossier.affiliateBasket.totalGMV.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block">Net Commission</span>
                  <span className="text-sm font-bold text-emerald-400 tabular-nums">
                    ${dossier.affiliateBasket.netAffiliateRevenue.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block">Take Rate</span>
                  <span className="text-sm font-bold text-cyan-300 tabular-nums">
                    {dossier.affiliateBasket.blendedTakeRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* 1,000-Scan Cohort Financial Proof-of-Concept */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/35 to-cyan-950/35 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-300 uppercase">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> 1,000-Scan Cohort Validation
                </span>
                <span>AOV ${COHORT_FINANCIAL_BENCHMARK.aov.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[9px] text-slate-400 block">Cohort GMV</span>
                  <strong className="text-white tabular-nums">
                    ${COHORT_FINANCIAL_BENCHMARK.gmv.toLocaleString()}
                  </strong>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block">Net Revenue</span>
                  <strong className="text-emerald-400 tabular-nums">
                    ${COHORT_FINANCIAL_BENCHMARK.netRevenue.toLocaleString()}
                  </strong>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block">Net / Scan</span>
                  <strong className="text-cyan-300 tabular-nums">
                    ${COHORT_FINANCIAL_BENCHMARK.netRevenuePerScan.toFixed(2)}
                  </strong>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-snug">{dossier.safety_note}</p>
            </div>
          </div>
        </div>

        {/* Collapsible Dr. Yu Private Concierge JSON Schema */}
        {showJson && (
          <div className="p-4 rounded-2xl bg-[#020b0f] border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-300 uppercase">
                Dr. Yu Private Concierge Output Schema (JSON)
              </span>
              <button
                type="button"
                onClick={handleCopyJson}
                className="px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-500/30 text-xs font-mono text-cyan-200 flex items-center gap-1.5"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedJson ? 'Copied' : 'Copy JSON'}
              </button>
            </div>
            <pre className="text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-72 leading-relaxed">
              {JSON.stringify(conciergeJsonPayload, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
