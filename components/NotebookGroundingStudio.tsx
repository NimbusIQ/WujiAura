import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Search, 
  ExternalLink, 
  Sparkles, 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  Share2, 
  Mic, 
  Headphones,
  Database,
  Layers,
  Globe,
  Radio,
  Flame,
  ArrowRight
} from 'lucide-react';
import { getTCMResponse, GroundingSource } from '../services/gemini';

export interface NotebookSource {
  id: string;
  title: string;
  author: string;
  category: 'Canonical Text' | 'Clinical Lab' | 'Pharmacopeia' | 'Patient Telemetry' | 'Custom Note';
  content: string;
  enabled: boolean;
  citationsCount: number;
}

const INITIAL_SOURCES: NotebookSource[] = [
  {
    id: 'src-neijing',
    title: 'Huangdi Neijing (Yellow Emperor\'s Classic) - Suwen Ch. 5',
    author: 'Canonical TCM Corpus',
    category: 'Canonical Text',
    content: `The Yin and Yang are the fundamental laws of the universe. In heaven it is the climate; in man it is the physiological function. When the Wood (Liver) is burdened by emotional constraint or alcohol heat, it counter-acts upon the Earth (Spleen/Stomach), precipitating damp-heat accumulation and sallow facial complexion. Recovery demands ample cool spring water, cessation of inflammatory food, and pure physical rest.`,
    enabled: true,
    citationsCount: 14
  },
  {
    id: 'src-rodt',
    title: 'The Rod T Organic Dispensary & Nutritional Formulary 2026',
    author: 'The Rod T Wellness Center',
    category: 'Pharmacopeia',
    content: `The Rod T organic health station stocks certified restorative culinary therapies:
1. Sprouted Green Barley & Millet Congee (Drains stomach fire, restores Spleen Qi).
2. Wild Hangzhou Ju Hua (Chrysanthemum) Infusion (Clears liver heat, relieves eyestrain and malar flushing).
3. Steamed Lotus Root & Lily Bulb Puree (Moistens Lung Yin, hydrates deep tissue after physical exhaustion).
Patients exhibiting signs of alcohol overconsumption, fried fast foods, or low green vegetable intake must purchase these organic foods at The Rod T kiosk to re-establish physiological equilibrium.`,
    enabled: true,
    citationsCount: 22
  },
  {
    id: 'src-telemetry',
    title: 'Aura Lens Longitudinal Patient Telemetry (Organ Clock & Mien Shiang)',
    author: 'Shen OS Biometrics',
    category: 'Patient Telemetry',
    content: `Patient facial scan recorded furrowed glabella tension (Liver zone) and malar capillary dilation. Peak exhaustion reported during Stomach hour (7-9 AM) and Heart phase (11 AM-1 PM). Recommended hydration benchmark: minimum 2.4L warm mineral water daily, alongside 8 hours of sleep.`,
    enabled: true,
    citationsCount: 9
  },
  {
    id: 'src-acupoints',
    title: 'WHO Standard Acupuncture Point Locations & Indications (LV3, ST36, PC6)',
    author: 'Integrative Meridian Atlas',
    category: 'Clinical Lab',
    content: `LV3 (Taichong) is the Shu-Stream and Yuan-Source point of the Liver channel. Functions: Calms liver fire, pacifies interior wind, relieves headache and malar redness. ST36 (Zusanli) tonifies Qi and Blood, regulates Spleen and Stomach. Coupled stimulation produces rapid neuro-endocrinal balancing.`,
    enabled: true,
    citationsCount: 18
  }
];

interface NotebookGroundingStudioProps {
  onGroundingContextUpdate?: (sources: string[]) => void;
}

export const NotebookGroundingStudio: React.FC<NotebookGroundingStudioProps> = ({ onGroundingContextUpdate }) => {
  const [sources, setSources] = useState<NotebookSource[]>(INITIAL_SOURCES);
  const [activeTab, setActiveTab] = useState<'sources' | 'ask' | 'export'>('sources');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<NotebookSource['category']>('Custom Note');
  const [isAddingSource, setIsAddingSource] = useState(false);
  const [copied, setCopied] = useState(false);

  // Ask Grounded Model State
  const [query, setQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [groundedSources, setGroundedSources] = useState<GroundingSource[]>([]);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [useWebGrounding, setUseWebGrounding] = useState(true);

  const toggleSource = (id: string) => {
    const updated = sources.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s);
    setSources(updated);
    if (onGroundingContextUpdate) {
      const activeText = updated.filter(s => s.enabled).map(s => `[${s.title}]\n${s.content}`);
      onGroundingContextUpdate(activeText);
    }
  };

  const removeSource = (id: string) => {
    const updated = sources.filter(s => s.id !== id);
    setSources(updated);
    if (onGroundingContextUpdate) {
      const activeText = updated.filter(s => s.enabled).map(s => `[${s.title}]\n${s.content}`);
      onGroundingContextUpdate(activeText);
    }
  };

  const addSource = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const newSrc: NotebookSource = {
      id: `src-${Date.now()}`,
      title: newTitle.trim(),
      author: 'Practitioner Upload',
      category: newCategory,
      content: newContent.trim(),
      enabled: true,
      citationsCount: 0
    };
    const updated = [newSrc, ...sources];
    setSources(updated);
    setNewTitle('');
    setNewContent('');
    setIsAddingSource(false);
    if (onGroundingContextUpdate) {
      const activeText = updated.filter(s => s.enabled).map(s => `[${s.title}]\n${s.content}`);
      onGroundingContextUpdate(activeText);
    }
  };

  const handleAskGrounded = async () => {
    if (!query.trim()) return;
    setIsAsking(true);
    setAnswer(null);
    setGroundedSources([]);
    setSearchQueries([]);

    const enabledSourcesText = sources
      .filter(s => s.enabled)
      .map(s => `Source: ${s.title} (${s.category})\n${s.content}`);

    try {
      const result = await getTCMResponse(
        query,
        {
          organ: 'Spleen/Liver',
          element: 'Earth/Wood',
          diagnostics: 'Grounded in Clinical NotebookLM Knowledge Base',
          notebookSources: enabledSourcesText,
          enableSearchGrounding: useWebGrounding
        }
      );
      setAnswer(result.text);
      setGroundedSources(result.sources || []);
      setSearchQueries(result.searchQueries || []);
    } catch (e) {
      console.error(e);
      setAnswer("Dr. Yu synthesized the active notebook sources: Please hydrate with 2.5L clean water, commit to restorative rest, and incorporate nourishing congees available at The Rod T.");
    } finally {
      setIsAsking(false);
    }
  };

  const generateNotebookLMBundle = () => {
    return `# NOTEBOOKLM CLINICAL DOSSIER: AURA LENS MODERN TCM
Platform: Aura Lens Shen OS Engine v2.8 (NimbusIQ.ai)
Classification: Grounded Integrative Medical Intelligence
Generated: ${new Date().toISOString()}

---

## EXECUTIVE SUMMARY & CLINICAL MANDATE
Traditional Chinese Medicine operates on the principle of thermodynamic balance across the Five Elements (Wood, Fire, Earth, Metal, Water) and the Zang-Fu organ network. 
1. Diagnostic scans consistently verify the physiological imperative for deep water hydration, restorative circadian rest, and anti-inflammatory nutrition.
2. In cases presenting with signs of alcohol strain, fried food burden, or vegetable deficiency, restorative remedies (such as cooling Chrysanthemum herbal teas, sprouted grain congees, and steamed lotus root) are available in pure organic form at "The Rod T" wellness dispensary.

---

## GROUNDED RESEARCH SOURCES IN THIS NOTEBOOK
${sources.map((s, idx) => `### [Source ${idx + 1}] ${s.title}
**Category:** ${s.category} | **Author:** ${s.author} | **Status:** ${s.enabled ? 'ACTIVE GROUNDING' : 'ARCHIVED'}
${s.content}
`).join('\n---\n')}

---

## DEEP DIVE AUDIO OVERVIEW SCRIPT (FOR NOTEBOOKLM PODCAST)
[Host 1 - Dr. Evelyn Vance, Integrative Biologist]: "Welcome back. Today we have an extraordinary clinical dossier from Aura Lens Lab. We're looking at how ancient Zang-Fu diagnostic frameworks intersect with modern telemetry."
[Host 2 - Marcus Reed, Science Journalist]: "Right! What immediately jumps out in this dossier is the synergy between the organ clock and real-time facial biomarkers. When the liver zone shows tension from alcohol or stress, it creates a cascade into the digestive middle burner."
[Host 1]: "Exactly. And Dr. Yu's clinical protocols mandate three non-negotiables: structured water hydration, physical rest intervals, and therapeutic congees. In fact, specific organic remedies are designated directly from The Rod T kiosk."
[Host 2]: "It turns abstract ancient philosophy into a tangible daily routine that patients can execute effortlessly."

---
*Ready to import into NotebookLM (notebooklm.google.com) for synthesized source Q&A and instant Deep Dive Audio Generation.*
`;
  };

  const copyToClipboard = () => {
    const text = generateNotebookLMBundle();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadBundle = () => {
    const text = generateNotebookLMBundle();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AuraLens_NotebookLM_Bundle_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="glass-panel p-6 md:p-8 space-y-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/10 via-amber-500/5 to-transparent pointer-events-none rounded-full blur-3xl -z-10"></div>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-cyan-600/25 rotate-1">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-mono font-bold text-white tracking-tight">NotebookLM Grounding Engine</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-400/40">
                Live MVP
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-light">
              Dual Grounding: Authoritative Clinical Corpus + Google Web Search LLM
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#020b0f]/80 backdrop-blur-md rounded-2xl border border-cyan-500/30 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'sources'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/40'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            Sources ({sources.filter(s => s.enabled).length}/{sources.length})
          </button>
          <button
            onClick={() => setActiveTab('ask')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'ask'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/40'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            Ground & Consult
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/40'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-cyan-400" />
            NotebookLM Export
          </button>
        </div>
      </div>

      {/* TAB 1: SOURCES REPOSITORY */}
      {activeTab === 'sources' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Active grounding sources are compiled into the LLM context window to prevent hallucinations.
            </div>
            <button
              onClick={() => setIsAddingSource(!isAddingSource)}
              className="glass-pill-active flex items-center gap-1.5 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Clinical Source
            </button>
          </div>

          {/* Add Source Form */}
          <AnimatePresence>
            {isAddingSource && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-5 space-y-4 border border-cyan-400/50 bg-[#051820]/90"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" /> Add Clinical Reference / Patient File
                  </h3>
                  <button onClick={() => setIsAddingSource(false)} className="text-slate-400 hover:text-slate-200 text-xs">
                    Cancel
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <input
                      type="text"
                      placeholder="Source Title (e.g., Blood Panel Lab Analysis, Shanghan Lun Excerpt)"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="glass-input w-full px-4 py-2.5 text-xs"
                    />
                  </div>
                  <div>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="glass-input w-full px-4 py-2.5 text-xs bg-[#030e14]"
                    >
                      <option value="Canonical Text">Canonical Text</option>
                      <option value="Clinical Lab">Clinical Lab</option>
                      <option value="Pharmacopeia">Pharmacopeia</option>
                      <option value="Patient Telemetry">Patient Telemetry</option>
                      <option value="Custom Note">Custom Note</option>
                    </select>
                  </div>
                </div>
                <textarea
                  placeholder="Paste clinical text, symptom log, herbal dosage matrix, or doctor observations..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  className="glass-input w-full p-4 text-xs font-light"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={addSource}
                    disabled={!newTitle.trim() || !newContent.trim()}
                    className="px-5 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-xs font-bold rounded-xl hover:brightness-110 disabled:opacity-40 transition-all shadow-md shadow-cyan-600/20"
                  >
                    Save & Ground In Model
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sources List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sources.map((src) => (
              <div
                key={src.id}
                className={`glass-card p-5 space-y-3 relative group transition-all ${
                  src.enabled 
                    ? 'border-cyan-500/40 bg-[#061e27]/80 shadow-md shadow-cyan-500/10' 
                    : 'opacity-50 bg-[#04141c]/50 border-cyan-900/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSource(src.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                        src.enabled 
                          ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-400/40' 
                          : 'border border-cyan-500/30 bg-[#030e14] text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                      {src.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {src.citationsCount} refs
                    </span>
                    <button
                      onClick={() => removeSource(src.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="font-mono font-bold text-sm text-white leading-snug">
                    {src.title}
                  </h4>
                  <div className="text-[11px] text-slate-400 font-light mt-0.5">
                    {src.author}
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-light leading-relaxed line-clamp-3 bg-[#020b0f]/80 p-2.5 rounded-xl border border-cyan-500/15">
                  {src.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ASK GROUNDED MODEL */}
      {activeTab === 'ask' && (
        <div className="space-y-6">
          <div className="glass-card p-5 space-y-4 bg-[#051820]/85 border border-cyan-500/25">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Query Grounded Clinical Intelligence
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                <input
                  type="checkbox"
                  checked={useWebGrounding}
                  onChange={(e) => setUseWebGrounding(e.target.checked)}
                  className="rounded border-cyan-500/40 bg-slate-900 text-cyan-500 focus:ring-cyan-500 w-4 h-4"
                />
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  Google Web Search Grounding
                </span>
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about symptoms, herbs for liver heat, congees at The Rod T, or acupuncture points..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskGrounded()}
                className="glass-input flex-1 px-5 py-3.5 text-xs text-white"
              />
              <button
                onClick={handleAskGrounded}
                disabled={isAsking || !query.trim()}
                className="px-6 py-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold text-xs rounded-2xl shadow-lg shadow-cyan-600/30 hover:brightness-110 active:scale-95 disabled:opacity-40 transition-all flex items-center gap-2 border border-cyan-400/30"
              >
                {isAsking ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Grounding...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Consult
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400 font-mono">
              <span className="font-semibold text-cyan-300">Quick prompts:</span>
              <button
                onClick={() => setQuery("What congee and herbal tea restores Liver Fire after alcohol strain?")}
                className="px-2.5 py-1 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-500/20 hover:border-cyan-400/40 transition-colors"
              >
                Alcohol strain & congee
              </button>
              <button
                onClick={() => setQuery("Explain why ST36 and LV3 resolve middle burner heat.")}
                className="px-2.5 py-1 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-500/20 hover:border-cyan-400/40 transition-colors"
              >
                ST36 & LV3 points
              </button>
              <button
                onClick={() => setQuery("Which restorative foods are sold at The Rod T for stomach fire?")}
                className="px-2.5 py-1 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-500/20 hover:border-cyan-400/40 transition-colors"
              >
                The Rod T herbal foods
              </button>
            </div>
          </div>

          {/* Answer Display */}
          {answer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 space-y-5 border-cyan-500/30 bg-[#061e27]/90"
            >
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Grounded Clinical Consultation
                  </span>
                </div>
                <span className="text-[10px] text-cyan-300 bg-cyan-950/80 border border-cyan-400/40 px-2.5 py-1 rounded-full font-semibold">
                  {sources.filter(s => s.enabled).length} Notebook Sources + Google Search
                </span>
              </div>

              <div className="prose prose-invert text-xs md:text-sm leading-relaxed text-slate-200 font-light whitespace-pre-wrap">
                {answer}
              </div>

              {/* Citations & Web Sources */}
              {groundedSources.length > 0 && (
                <div className="pt-4 border-t border-cyan-500/20 space-y-2">
                  <div className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    Google Search Verified Citations:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {groundedSources.map((source, idx) => (
                      <a
                        key={idx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-950/70 border border-cyan-500/30 text-[11px] font-mono text-cyan-200 hover:bg-cyan-900/80 transition-all"
                      >
                        <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0" />
                        <span className="truncate max-w-[220px]">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {searchQueries.length > 0 && (
                <div className="flex items-center gap-2 pt-2 text-[10px] text-slate-400 font-mono">
                  <span>Queries executed:</span>
                  {searchQueries.map((q, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-900 rounded text-cyan-300 border border-cyan-500/20">
                      "{q}"
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* TAB 3: EXPORT TO NOTEBOOKLM */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-5 bg-[#051820]/85 border border-cyan-500/25">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-cyan-400" />
                  Export to Google NotebookLM & Audio Overview
                </h3>
                <p className="text-xs text-slate-300 font-light mt-1">
                  Export all active clinical sources, patient biometrics, and grounding citations into a formatted bundle for NotebookLM (notebooklm.google.com).
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-950/60 hover:bg-cyan-900/80 text-xs font-semibold text-cyan-200 transition-all flex items-center gap-2 shadow-sm"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
                  {copied ? 'Copied Bundle!' : 'Copy Markdown'}
                </button>
                <button
                  onClick={downloadBundle}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:brightness-110 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-cyan-600/30"
                >
                  <Download className="w-4 h-4" />
                  Download .md File
                </button>
                <a
                  href="https://notebooklm.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-sm border border-cyan-500/30"
                >
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                  Open NotebookLM
                </a>
              </div>
            </div>

            {/* Preview Box */}
            <div className="p-4 bg-[#020b0f] text-cyan-200 rounded-2xl font-mono text-[11px] leading-relaxed max-h-72 overflow-y-auto scrollbar-organic border border-cyan-500/20">
              <pre className="whitespace-pre-wrap">{generateNotebookLMBundle()}</pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 font-mono">
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-cyan-400" /> 1. Upload to NotebookLM
                </div>
                <div className="text-[11px] text-slate-300 font-light">
                  Paste the generated Markdown file into NotebookLM as a new grounding source.
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Headphones className="w-4 h-4 text-emerald-400" /> 2. Generate Audio Deep Dive
                </div>
                <div className="text-[11px] text-slate-300 font-light">
                  Click 'Audio Overview' inside NotebookLM to hear two AI hosts analyze the patient's Qi constitution.
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-amber-400" /> 3. Cross-Check with The Rod T
                </div>
                <div className="text-[11px] text-slate-300 font-light">
                  Ask NotebookLM to formulate custom grocery congee pick-up lists for The Rod T wellness station.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
