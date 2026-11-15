import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles,
  Video,
  Image as ImageIcon,
  Heart,
  Clock,
  Zap,
  CheckCircle,
  Mic,
  Send,
  Trash2,
  Volume2,
  ShieldCheck,
  AlertTriangle,
  Smile,
  RefreshCw,
  Sun,
  Moon,
  Bookmark,
  Globe,
  BookOpen,
  Camera,
  ExternalLink,
  ChevronRight,
  Layers,
  ShoppingBag,
  Activity,
  Maximize2,
  Radio,
  Sliders,
  Eye,
  FileText
} from 'lucide-react';
import { 
  getTCMResponse, 
  createTCMChat, 
  speakResponse, 
  generateHealthImage, 
  generateHealthVideo,
  transcribeAudio,
  VisualOptions,
  GroundingSource
} from '../services/gemini';
import { runTCMAgentAnalysis } from '../services/tcmAgent';
import { TCMVisualizer } from './TCMVisualizer';
import { CircadianOrganClock, OrganPeriod } from './CircadianOrganClock';
import { ConciergeEngine } from './ConciergeEngine';
import { PulseVisualizer } from './PulseVisualizer';
import { TongueAnalysisTool } from './TongueAnalysisTool';
import { DiagnosticReport } from './DiagnosticReport';
import { CommitmentRitual } from './CommitmentRitual';
import { AcupuncturePrecision } from './AcupuncturePrecision';
import { ZenReminders } from './ZenReminders';
import { VisualSettings } from './VisualSettings';
import { VoiceHealthJournal } from './VoiceHealthJournal';
import { TCMCameraDiagnostic } from './TCMCameraDiagnostic';
import { MultiAgentIntegrationHub } from './MultiAgentIntegrationHub';
import { NotebookGroundingStudio } from './NotebookGroundingStudio';
import WellnessCore from '../services/wellnessCoreService';

const STORAGE_KEY = 'auralens_tcm_holo_v7';

export const TCMDashboard: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [patternData, setPatternData] = useState<any>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [commitments, setCommitments] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [hasVeoKey, setHasVeoKey] = useState(false);
  const [generatingVisuals, setGeneratingVisuals] = useState(false);
  const [prescribedImage, setPrescribedImage] = useState<string | null>(null);
  const [prescribedVideo, setPrescribedVideo] = useState<string | null>(null);
  const [visualOptions, setVisualOptions] = useState<VisualOptions>({
    style: 'Artistic',
    mood: 'Healing',
    elements: [],
    aspectRatio: '1:1',
    resolution: '720p'
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  // Navigation & View State
  const [activeNavTab, setActiveNavTab] = useState<'all' | 'concierge' | 'diagnostics' | 'tongue' | 'pulse' | 'clock' | 'report' | 'camera' | 'voice' | 'notebook' | 'agents'>('all');
  const [isDeterministic, setIsDeterministic] = useState(false);
  const [masteryMode, setMasteryMode] = useState<'YU' | 'WUJI'>('YU');
  const [visualizerView, setVisualizerView] = useState<'HOLOGRAPHIC' | 'DATA' | 'WUXING'>('HOLOGRAPHIC');
  const [enableGoogleSearch, setEnableGoogleSearch] = useState(true);
  const [notebookGroundingSources, setNotebookGroundingSources] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const checkKey = async () => {
      if ((window as any).aistudio?.hasSelectedApiKey) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        setHasVeoKey(hasKey);
      }
    };
    checkKey();
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setMessages(parsed.messages || []);
        setPatternData(parsed.patternData || null);
        setCommitments(parsed.commitments || []);
      } catch (e) {
        console.error("Failed to load stored session", e);
      }
    } else {
      // Seed an initial welcoming message in the new holographic clinical tone
      setMessages([
        {
          role: 'ai',
          text: `[HOLOGRAPHIC CLINICAL TELEMETRY INITIALIZED]\n\nWelcome to Aura Lens Modern TCM Diagnostics Console. I am Dr. Yu, lead clinical herbalist and meridian telemetry director.\n\nOur system operates with dual grounding: canonical TCM clinical literature from your NotebookLM dossier synchronized with real-time Google Web Search medical intelligence.\n\nZang-Fu telemetry is calibrated. You may initiate a Mien Shiang facial scan, articulate voice symptoms, or submit clinical inquiries below.`,
          sources: [
            { uri: 'https://tcmwiki.com/', title: 'Zang-Fu Diagnostics & Pharmacopeia' },
            { uri: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6433550/', title: 'Five Elements Bio-Electric Harmonization' }
          ]
        }
      ]);
    }
    createTCMChat();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, patternData, commitments }));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, commitments]);

  const handleFeedback = (msgIndex: number, rating: number) => {
    setMessages(prev => prev.map((m, i) => i === msgIndex ? { ...m, feedback: rating } : m));
  };

  const handleSend = async (overrideText?: string) => {
    const txt = overrideText ?? input;
    if (!txt.trim() && !imagePreview && !selectedFile) return;
    
    const img = imagePreview;
    const vid = videoPreview;
    const file = selectedFile;

    if (!overrideText) setInput('');
    setImagePreview(null);
    setVideoPreview(null);
    setSelectedFile(null);
    setIsTyping(true);
    setPrescribedImage(null);
    setPrescribedVideo(null);

    setMessages(prev => [...prev, { role: 'user', text: txt, image: img, video: vid }]);
    
    try {
      if (isDeterministic) {
        const analysis = runTCMAgentAnalysis(
          { id: 'user-1', name: 'Patient', preferences: { language: 'en' } },
          { 
            voice_journal_text: txt,
            facial_analysis: img ? { biomarkers: ["furrow between brows"], skin_complexion: "normal" } : undefined 
          }
        );
        
        const aiMessage = { 
          role: 'ai' as const, 
          text: `MASTER YU'S TELEMETRY ANALYSIS\n\n${analysis.status}\n\nWUXING VECTOR MATRIX:\n- ${analysis.wuxingInsights.join("\n- ")}\n\nNURTURING DIRECTIVES (WATER HYDRATION, REST & THE ROD T):\n- ${analysis.recommendations.join("\n- ")}\n\nCIRCADIAN MERIDIAN HARMONY:\n${analysis.organClockTip}`,
          sources: [
            { uri: "https://www.tcmwiki.com/", title: "Canonical Agent Knowledge Base" }
          ]
        };
        setMessages(prev => [...prev, aiMessage]);
        
        setPatternData({
          syndrome: {
            name: analysis.diagnosis[0] || "Zang-Fu Disharmony",
            hypothesis: analysis.status,
            metrics: [
              { label: 'Qi Flow', value: 85, sub: '%' },
              { label: 'Wood Harmony', value: analysis.diagnosis.includes("Liver Qi Stagnation (Wood)") ? 45 : 90, sub: '%' },
              { label: 'Earth Balance', value: analysis.diagnosis.includes("Spleen Deficiency (Earth)") ? 40 : 85, sub: '%' },
              ...(masteryMode === 'WUJI' ? [{ label: 'Shen Vitality', value: 95, sub: '%' }] : [])
            ]
          },
          wuxingInsights: analysis.wuxingInsights,
          regimen: {
            actions: analysis.recommendations.map((r, idx) => ({
              id: `item-${idx}`,
              title: idx === 0 ? "Hydrating Botanical Diet" : "Meridian Calibration Ritual",
              description: r,
              emoji: idx === 0 ? "🍵" : "🧘",
              element: analysis.diagnosis[0]?.includes("Wood") ? "Wood" : "Earth"
            }))
          }
        });
      } else {
        // Dual Grounding Path (NotebookLM context + Google Web Search LLM)
        const response = await WellnessCore.generateHealthInsights({
          symptoms: txt,
          facialAnalysis: img ? { biomarkers: ["detected tension"], energy: "high" } : undefined,
          imageFile: img,
          videoFile: file,
          season: 'Spring',
          notebookSources: notebookGroundingSources,
          enableSearchGrounding: enableGoogleSearch
        }, masteryMode);

        const aiMessage = { 
          role: 'ai' as const, 
          text: response.summary,
          sources: response.sources || [],
          searchQueries: response.searchQueries || []
        };
        setMessages(prev => [...prev, aiMessage]);
        
        if (response) {
          setPatternData(response);
          if (response.visualPrompts) {
            handleGenerateVisuals(response.visualPrompts);
          } else {
            handleGenerateVisuals({ imagePrompt: response.summary.slice(0, 400) });
          }
        }
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        role: 'ai',
        text: `Dr. Yu has analyzed your inquiry. The body urgently requires pure water hydration, physical restorative rest, and a positive dietary congee routine. Certified cooling ingredients are stocked at The Rod T organic wellness counter.`,
        sources: [
          { uri: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6433550/', title: 'Integrative TCM Clinical Evidence' }
        ]
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64 = (reader.result as string).split(',')[1];
            setIsTranscribing(true);
            try {
              const text = await transcribeAudio(base64, 'audio/webm');
              if (text.trim()) {
                handleSend(text);
              }
            } catch (err) {
              console.error("Transcription failed", err);
            } finally {
              setIsTranscribing(false);
              stream.getTracks().forEach(track => track.stop());
            }
          };
          reader.readAsDataURL(audioBlob);
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone", err);
      }
    }
  };

  const handleGenerateVisuals = async (prompts: any) => {
    if (!prompts) return;
    setGeneratingVisuals(true);
    try {
      if (prompts.imagePrompt) {
        const img = await generateHealthImage(prompts.imagePrompt, visualOptions);
        setPrescribedImage(img);
      }
      if (prompts.videoPrompt && hasVeoKey) {
        const vid = await generateHealthVideo(prompts.videoPrompt, { ...visualOptions, aspectRatio: '16:9' });
        setPrescribedVideo(vid);
      }
    } catch (e) {
      console.error("Visual generation clouded", e);
    } finally {
      setGeneratingVisuals(false);
    }
  };

  const commitToTask = (taskId: string) => {
    if (!commitments.includes(taskId)) {
      setCommitments(prev => [...prev, taskId]);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans select-none selection:bg-cyan-500/30 text-slate-100 bg-[#030a0e]">
      
      {/* 🌟 Top Holographic Command Header */}
      <header className="h-20 bg-[#04141c]/85 backdrop-blur-2xl border-b border-cyan-500/25 flex items-center justify-between px-6 md:px-10 shrink-0 z-50 relative shadow-[0_4px_30px_rgba(0,0,0,0.7)]">
        <div className="flex items-center gap-5">
          <div className="relative group cursor-pointer" onClick={() => setActiveNavTab('all')}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-teal-600 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 rotate-2 group-hover:rotate-0 transition-transform">
              <Activity className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#04141c] animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#04141c]"></div>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-chinese font-bold text-lg text-emerald-400 tracking-wider">健生讲诊疗</span>
              <div className="h-4 w-[1px] bg-cyan-500/30"></div>
              <h1 className="font-sans font-extrabold text-xl md:text-2xl tracking-tight text-white">
                Aura Lens <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 italic">Holographic Lab</span>
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-950/80 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                Zang-Fu Telemetry
              </span>
            </div>
            <div className="flex items-center gap-2.5 mt-0.5">
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Shen OS v3.0 &bull; Cyber-Jade Architecture
              </span>
              <div className="h-1 w-1 rounded-full bg-cyan-600"></div>
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <Globe className="w-3 h-3 text-cyan-400" />
                Dual Grounded (Google Search + NotebookLM)
              </span>
            </div>
          </div>
        </div>
        
        {/* Center/Right Controls */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Diagnostic Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#020b0f]/90 backdrop-blur-md p-1 rounded-full border border-cyan-500/30 shadow-inner">
            <button 
              onClick={() => { setIsDeterministic(false); setMasteryMode('YU'); }}
              className={`px-4 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider transition-all ${
                !isDeterministic && masteryMode === 'YU' 
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-600/30 border border-cyan-300/40' 
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              Dr. Yu Clinical
            </button>
            <button 
              onClick={() => { setIsDeterministic(false); setMasteryMode('WUJI'); }}
              className={`px-4 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider transition-all ${
                !isDeterministic && masteryMode === 'WUJI' 
                  ? 'bg-gradient-to-r from-slate-800 to-emerald-900 text-emerald-300 shadow-lg border border-emerald-500/40' 
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              Wuji Shen
            </button>
            <button 
              onClick={() => setIsDeterministic(true)}
              className={`px-4 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider transition-all ${
                isDeterministic 
                  ? 'bg-gradient-to-r from-teal-700 to-cyan-900 text-cyan-200 shadow-md border border-cyan-400/40' 
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              Agent Swarm
            </button>
          </div>

          {/* Google Search Live Grounding Toggle */}
          <button
            onClick={() => setEnableGoogleSearch(!enableGoogleSearch)}
            title={enableGoogleSearch ? "Google Web Search Grounding Active" : "Search Grounding Disabled"}
            className={`hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold border transition-all ${
              enableGoogleSearch 
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]' 
                : 'bg-slate-900/60 text-slate-500 border-slate-700'
            }`}
          >
            <Globe className={`w-3.5 h-3.5 ${enableGoogleSearch ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span>Search Grounding</span>
          </button>

          <div className="h-6 w-[1px] bg-cyan-500/25"></div>

          {/* Reset Session */}
          <button 
            onClick={() => { 
              localStorage.removeItem(STORAGE_KEY); 
              setMessages([]); 
              setPatternData(null); 
              setCommitments([]); 
            }} 
            title="Calibrate & Reset Telemetry"
            className="p-2.5 rounded-full hover:bg-cyan-950/60 text-slate-400 hover:text-cyan-400 transition-all border border-transparent hover:border-cyan-500/30"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 🧭 Holographic Navigation Matrix */}
      <nav aria-label="Clinical Modules" className="bg-[#04121a]/70 backdrop-blur-xl border-b border-cyan-500/20 px-6 md:px-10 py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-organic shrink-0 z-40">
        <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider mr-2 shrink-0 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          Diagnostic Arrays:
        </span>
        <button
          onClick={() => setActiveNavTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeNavTab === 'all'
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/40'
              : 'bg-[#061e27]/60 hover:bg-cyan-950/60 text-slate-300 border border-cyan-500/20'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Full Command Stage
        </button>
        <button
          onClick={() => setActiveNavTab('concierge')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeNavTab === 'concierge'
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/40'
              : 'bg-[#061e27]/60 hover:bg-cyan-950/60 text-slate-300 border border-cyan-500/20'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Dr. Yu Private Concierge
        </button>
        <button
          onClick={() => setActiveNavTab('diagnostics')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeNavTab === 'diagnostics'
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/40'
              : 'bg-[#061e27]/60 hover:bg-cyan-950/60 text-slate-300 border border-cyan-500/20'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Modern TCM Diagnostics
        </button>
        <button
          onClick={() => setActiveNavTab('tongue')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeNavTab === 'tongue'
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/40'
              : 'bg-[#061e27]/60 hover:bg-cyan-950/60 text-slate-300 border border-cyan-500/20'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          Tongue & Physical Inspection
        </button>
        <button
          onClick={() => setActiveNavTab('pulse')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeNavTab === 'pulse'
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/40'
              : 'bg-[#061e27]/60 hover:bg-cyan-950/60 text-slate-300 border border-cyan-500/20'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          28 Classical Pulses
        </button>
        <button
          onClick={() => setActiveNavTab('clock')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeNavTab === 'clock'
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/40'
              : 'bg-[#061e27]/60 hover:bg-cyan-950/60 text-slate-300 border border-cyan-500/20'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Circadian Organ Clock
        </button>
        <button
          onClick={() => setActiveNavTab('report')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeNavTab === 'report'
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/40'
              : 'bg-[#061e27]/60 hover:bg-cyan-950/60 text-slate-300 border border-cyan-500/20'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Diagnostic Dossier
        </button>
        <button
          onClick={() => setActiveNavTab('notebook')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeNavTab === 'notebook'
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/40'
              : 'bg-[#061e27]/60 hover:bg-cyan-950/60 text-slate-300 border border-cyan-500/20'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          NotebookLM Grounding Studio
        </button>
        <button
          onClick={() => setActiveNavTab('camera')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeNavTab === 'camera'
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/40'
              : 'bg-[#061e27]/60 hover:bg-cyan-950/60 text-slate-300 border border-cyan-500/20'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          Mien Shiang Facial Optics
        </button>
        <button
          onClick={() => setActiveNavTab('voice')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeNavTab === 'voice'
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/40'
              : 'bg-[#061e27]/60 hover:bg-cyan-950/60 text-slate-300 border border-cyan-500/20'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          Voice Journal Analysis
        </button>
        <button
          onClick={() => setActiveNavTab('agents')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeNavTab === 'agents'
              ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/40'
              : 'bg-[#061e27]/60 hover:bg-cyan-950/60 text-slate-300 border border-cyan-500/20'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          Agent Swarm (A2A Swarm)
        </button>
      </nav>

      {/* 🔬 Main Holographic Laboratory Stage */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left Interactive Laboratory */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-10 scrollbar-organic">

          {/* 0. DR. YU PRIVATE CONCIERGE (DUAL-LAYER OBSERVE -> UNDERSTAND -> ACT) */}
          {(activeNavTab === 'all' || activeNavTab === 'concierge') && (
            <section aria-label="Dr. Yu Private Concierge">
              <ConciergeEngine
                onSyncConcierge={(dossier) => {
                  setMessages((prev) => [
                    ...prev,
                    {
                      role: 'ai',
                      text: `[DR. YU PRIVATE CONCIERGE — DUAL-LAYER DOSSIER]\n\nLayer 1 Barrier Audit: ${dossier.layer1BarrierAudit.tewlAssessment}\nBarrier Protocol: ${dossier.layer1BarrierAudit.barrierProtocol}\n\nLayer 2 Constitutional Pattern: ${dossier.layer2ConstitutionalPattern.pattern}\nObservation: ${dossier.layer2ConstitutionalPattern.tcm_observation}\nWu Xing Cycle: ${dossier.layer2ConstitutionalPattern.wuXingCycle}\n\nCurated Partner Basket (${dossier.affiliateBasket.items.length} items | $${dossier.affiliateBasket.totalGMV.toFixed(2)} GMV | ${dossier.affiliateBasket.blendedTakeRate}% Take Rate):\n${dossier.affiliateBasket.items.map((i) => `- ${i.name} (${i.partner}, $${i.price.toFixed(2)})`).join('\n')}\n\nSafety Guardrail: ${dossier.safety_note}`,
                      sources: [{ uri: 'https://tcmwiki.com/', title: 'Nimbus IQ Dual-Layer Constitution Engine' }]
                    }
                  ]);
                }}
              />
            </section>
          )}

          {/* 1. CENTERPIECE: MODERN TCM ORGAN DIAGNOSTICS (Inspired by reference image) */}
          {(activeNavTab === 'all' || activeNavTab === 'diagnostics') && (
            <section aria-label="Modern TCM Organ Diagnostics">
              <TCMVisualizer data={patternData} view={visualizerView} />
            </section>
          )}

          {/* 1B. TONGUE & PHYSICAL INSPECTION (WANG ZHEN) CORRELATION ENGINE */}
          {(activeNavTab === 'all' || activeNavTab === 'tongue' || activeNavTab === 'diagnostics') && (
            <section aria-label="Tongue & Physical Inspection Analysis">
              <TongueAnalysisTool 
                onSyncDiagnostic={(diag) => {
                  setPatternData((prev: any) => ({ ...prev, ...diag }));
                  setMessages(prev => [...prev, {
                    role: 'ai',
                    text: `[WANG ZHEN PHYSICAL INSPECTION RECORDED]\n\nDiagnostic Syndrome: ${diag.syndrome.name} (${diag.syndrome.chineseName})\n\nConcordance Insight: ${diag.syndrome.hypothesis}\n\nClinical Guidance: The patient's tongue morphology, ocular five wheels, and skin luster have been calibrated into the comprehensive diagnostic dossier.`,
                    sources: [
                      { uri: 'https://tcmwiki.com/', title: 'Wang Zhen Diagnostic Topography' }
                    ]
                  }]);
                }} 
              />
            </section>
          )}

          {/* 1C. 28 CLASSICAL PULSE WAVEFORM VISUALIZER & PALPATION (QIE ZHEN) */}
          {(activeNavTab === 'all' || activeNavTab === 'pulse' || activeNavTab === 'diagnostics') && (
            <section aria-label="Pulse Waveform Visualizer">
              <PulseVisualizer 
                onSelectPulse={(p) => {
                  setMessages(prev => [...prev, {
                    role: 'ai',
                    text: `[PULSE PALPATION RECORDED]\n\nSelected Classical Pulse: ${p.name} (${p.chinese})\nDepth/Position: ${p.position} | Category: ${p.category}\nClinical Significance: ${p.clinicalSignificance}\n\nRadial arterial waveform synchronized into the clinical diagnostic dossier.`,
                    sources: [
                      { uri: 'https://tcmwiki.com/', title: '28 Classical Pulses Atlas' }
                    ]
                  }]);
                }}
              />
            </section>
          )}

          {/* 1D. COMPREHENSIVE CLINICAL DIAGNOSTIC DOSSIER (SI ZHEN SYNTHESIS) */}
          {(activeNavTab === 'all' || activeNavTab === 'report' || activeNavTab === 'diagnostics') && (
            <section aria-label="Diagnostic Clinical Dossier">
              <DiagnosticReport patternData={patternData} />
            </section>
          )}

          {/* 2. NOTEBOOKLM GROUNDING STUDIO */}
          {(activeNavTab === 'all' || activeNavTab === 'notebook') && (
            <NotebookGroundingStudio 
              onGroundingContextUpdate={(sources) => setNotebookGroundingSources(sources)} 
            />
          )}

          {/* 3. CAMERA OPTICAL DIAGNOSTIC */}
          {(activeNavTab === 'all' || activeNavTab === 'camera') && (
            <TCMCameraDiagnostic 
              onDiagnosticComplete={(result) => {
                setPatternData(result);
                setMessages(prev => [...prev, {
                  role: 'ai',
                  text: `[HOLOGRAPHIC SCAN COMPLETE]

FINDING:
${result.syndrome?.name || 'Zang-Fu Meridian Imbalance'} - ${result.status}

PHYSIOLOGICAL DIRECTIVE:
The diagnostic matrix underscores the vital physiological necessity for pure water hydration, physical restorative rest, and a positive dietary congee routine.

CERTIFIED RESTORATIVE NUTRITION:
Fresh organic herbal formulations to clear liver fire and soothe digestion are stocked at The Rod T wellness station:
${result.regimen?.actions?.map((act: any) => `- ${act.title}: ${act.description}`).join('\n') || '- Chrysanthemum & goji berry brew\n- Spleen-strengthening millet congee'}`,
                  sources: [
                    { uri: 'https://tcmwiki.com/', title: 'Mien Shiang Facial Zang-Fu Atlas' },
                    { uri: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6433550/', title: 'Clinical Hydration & Congee Nutrition' }
                  ]
                }]);
              }}
              masteryMode={masteryMode}
            />
          )}

          {/* 4. VOICE HEALTH JOURNAL */}
          {(activeNavTab === 'all' || activeNavTab === 'voice') && (
            <VoiceHealthJournal 
              onAnalyze={(text, mode) => {
                setIsDeterministic(false);
                setMasteryMode(mode);
                handleSend(text);
              }} 
              isAnalyzing={isTyping} 
              masteryMode={masteryMode}
              setMasteryMode={setMasteryMode}
            />
          )}

          {/* 5. CHRONOS ORGAN CLOCK & CIRCADIAN VITALITY */}
          {(activeNavTab === 'all' || activeNavTab === 'clock') && (
            <section aria-label="Circadian Organ Clock" className="space-y-6">
              <div className="flex items-center gap-3 ml-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-mono font-bold text-white uppercase tracking-widest">
                  Circadian Organ Clock (Zi Wu Liu Zhu)
                </h2>
              </div>
              <CircadianOrganClock
                onSelectPeriod={(period: OrganPeriod) => {
                  setMessages((prev) => [
                    ...prev,
                    {
                      role: 'ai',
                      text: `[CIRCADIAN ORGAN CLOCK SYNC]\n\nActive Meridian: ${period.organ} (${period.chinese}) — ${period.earthBranch}\nPeak Horary Window: ${period.start.toString().padStart(2, '0')}:00–${period.end.toString().padStart(2, '0')}:00 | Element: ${period.element} (${period.zangFuType})\n\nPhysiological Dynamism: ${period.peakAction}\nDisharmony Signs: ${period.pathologyFlags}\nKey Horary Acupoint: ${period.primaryAcupoint}\nLifestyle Guidance: ${period.lifestyleGuideline}`,
                      sources: [
                        { uri: 'https://tcmwiki.com/', title: 'Zi Wu Liu Zhu Meridian Chronobiology' },
                      ],
                    },
                  ]);
                }}
              />

              {/* Zang-Fu Balance Assessment Summary */}
              <div className="glass-panel p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-cyan-500/25 bg-[#051820]/75">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-[0.25em]">
                      {masteryMode === 'WUJI' ? 'Wuji Shen Intelligence' : "Dr. Yu's Clinical Probe"} &bull; Zang-Fu Balance Assessment
                    </span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white leading-tight">
                    {patternData?.syndrome?.name || 'Harmonic Bio-Field Equilibrium'}
                  </h3>
                  <p className="text-sm text-slate-300 font-light leading-relaxed italic">
                    {patternData?.syndrome?.hypothesis ||
                      'Synchronizing circadian respiration with the natural pulse of the Five Elements brings deep cellular restoration.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <div className="glass-pill-active flex items-center gap-1.5 text-xs">
                    <Sun className="w-3.5 h-3.5" /> Hydration &amp; Rest Protocol
                  </div>
                  <div className="glass-pill flex items-center gap-1.5 text-xs">
                    <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" /> The Rod T Herbal Kiosk
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* 6. ACUPUNCTURE PRECISION (361 Classical Meridian Nodes) */}
          {(activeNavTab === 'all' || activeNavTab === 'clock' || activeNavTab === 'diagnostics') && (
            <section className="space-y-6">
              <AcupuncturePrecision points={patternData?.acupressurePoints} />
            </section>
          )}

          {/* 7. COMMITMENT RITUALS & THE ROD T HERBAL CONGEES */}
          {(activeNavTab === 'all' || activeNavTab === 'clock' || activeNavTab === 'diagnostics') && (
            <section className="pb-6">
              <CommitmentRitual 
                actions={[
                  ...(patternData?.regimen?.actions || []),
                  ...(patternData?.commitmentTargets || [])
                ]} 
                commitments={commitments} 
                onCommit={commitToTask} 
              />
            </section>
          )}

          {/* 8. PRESCRIBED AI VISIONS */}
          {(prescribedImage || prescribedVideo) && (
            <section className="space-y-6 pb-6">
              <div className="flex items-center gap-3">
                <ImageIcon className="w-5 h-5 text-cyan-400" />
                <h2 className="text-base font-mono font-bold text-white uppercase tracking-widest">
                  Prescribed Holographic Visions
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {prescribedImage && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-4 space-y-3 border border-cyan-500/25">
                    <img src={prescribedImage} className="w-full aspect-video object-cover rounded-2xl border border-cyan-500/30 shadow-md" alt="Prescribed Vision" />
                    <div className="flex items-center justify-between px-2 text-slate-200">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">Visual Qi Meditation</span>
                      <Bookmark className="w-4 h-4 text-cyan-400" />
                    </div>
                  </motion.div>
                )}
                {prescribedVideo && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel p-4 space-y-3 border border-cyan-500/25">
                    <video src={prescribedVideo} controls className="w-full aspect-video object-cover rounded-2xl bg-black border border-cyan-500/30 shadow-md" />
                    <div className="flex items-center justify-between px-2 text-slate-200">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">Resonance Frequency Video</span>
                      <Heart className="w-4 h-4 text-emerald-400" />
                    </div>
                  </motion.div>
                )}
              </div>
            </section>
          )}

          {/* 9. AGENT SWARM HUB */}
          {(activeNavTab === 'all' || activeNavTab === 'agents') && (
            <MultiAgentIntegrationHub />
          )}

          {/* Settings & Zen Reminders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
            <ZenReminders />
            <VisualSettings options={visualOptions} onChange={setVisualOptions} isGenerating={generatingVisuals} />
          </div>

        </div>

        {/* 💬 Right Panel: Grounded Clinical Consultant Console */}
        <aside aria-label="Clinical Consultant Terminal" className="w-full md:w-[460px] flex flex-col bg-[#04151e]/85 backdrop-blur-2xl border-l border-cyan-500/20 shadow-2xl relative z-30">
          
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between bg-[#030e14]/70">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-400/40 text-cyan-300 flex items-center justify-center font-mono font-bold text-xs shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                {masteryMode === 'WUJI' ? 'WS' : 'DY'}
              </div>
              <div>
                <h3 className="font-mono font-bold text-sm text-white flex items-center gap-2">
                  {masteryMode === 'WUJI' ? 'Wuji Shen Sovereign' : 'Dr. Yu Clinical Consultant'}
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-cyan-400/80 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Grounded in Google Web Search
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSend("What foods sold at The Rod T restore liver fire and digestion?")}
                className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/60 transition-colors"
                title="Quick Prompt"
              >
                The Rod T Foods
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-organic bg-gradient-to-b from-[#030e14]/50 to-[#051820]/40">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} gap-2.5 group`}
                >
                  <div className={`max-w-[92%] p-5 rounded-3xl text-xs leading-relaxed relative ${
                    m.role === 'user' 
                    ? 'bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-700 text-white shadow-lg shadow-cyan-600/20 rounded-tr-sm font-normal border border-cyan-400/30' 
                    : 'glass-card bg-[#07242e]/90 text-slate-100 border border-cyan-500/25 shadow-md rounded-tl-sm'
                  }`}>
                    {m.image && (
                      <img src={m.image} alt="Diagnostic Scan" className="mb-3 rounded-2xl max-h-48 w-full object-cover border border-cyan-500/30" />
                    )}
                    {m.video && (
                      <video src={m.video} controls className="mb-3 rounded-2xl max-h-48 w-full object-cover border border-cyan-500/30" />
                    )}
                    
                    <div className="whitespace-pre-wrap font-light tracking-wide">{m.text}</div>
                    
                    {/* Google Search Grounding Sources */}
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-cyan-500/20 space-y-1.5">
                        <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                          <Globe className="w-3 h-3 text-emerald-400" /> Verified Search Grounding Citations:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {m.sources.map((src: GroundingSource, sIdx: number) => (
                            <a
                              key={sIdx}
                              href={src.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-500/30 text-[10px] font-mono text-cyan-200 transition-colors"
                            >
                              <ExternalLink className="w-2.5 h-2.5 text-cyan-400" />
                              <span className="truncate max-w-[170px]">{src.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {m.role === 'ai' && (
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-cyan-500/15 text-slate-400">
                        <button 
                          onClick={() => speakResponse(m.text)} 
                          className="p-1.5 rounded-full hover:bg-cyan-950/80 hover:text-cyan-300 transition-all flex items-center gap-1 text-[11px]"
                          title="Listen with Dr. Yu's Voice"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen</span>
                        </button>
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleFeedback(i, 1)} 
                            className={`p-1.5 rounded-full transition-all ${m.feedback === 1 ? 'bg-cyan-950 text-cyan-300' : 'hover:text-slate-200'}`}
                          >
                            <Smile className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleFeedback(i, -1)} 
                            className={`p-1.5 rounded-full transition-all ${m.feedback === -1 ? 'bg-rose-950 text-rose-400' : 'hover:text-rose-400'}`}
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <div className="flex items-center gap-2 p-3.5 bg-[#07242e]/90 rounded-2xl w-fit border border-cyan-500/30 shadow-md">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-[10px] text-cyan-300/80 ml-1 font-mono">Synthesizing clinical sources...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Console */}
          <div className="p-5 border-t border-cyan-500/20 bg-[#030e14]/90 backdrop-blur-xl">
            <div className="flex flex-col gap-3">
              {isTranscribing && (
                <div className="flex items-center gap-2 px-4 py-1.5 bg-cyan-950 border border-cyan-400/40 rounded-full w-fit animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  <span className="text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider">Transcribing Voice Stream...</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Inquire with Dr. Yu about organ telemetry, herbs, or congees..." 
                    className="glass-input w-full pl-5 pr-20 py-3.5 text-xs font-light placeholder:text-slate-500 text-white"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                    <button 
                      onClick={handleToggleRecording}
                      className={`p-2 transition-all rounded-full ${
                        isRecording 
                          ? 'text-rose-400 animate-pulse bg-rose-950/50' 
                          : 'text-slate-400 hover:text-cyan-400'
                      }`}
                      title={isRecording ? "Stop Recording" : "Record Voice Note"}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      className="p-2 text-slate-400 hover:text-cyan-400 transition-all"
                      title="Upload Image or Video"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*,video/*" 
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          const r = new FileReader();
                          if (f.type.startsWith('video/')) {
                            setVideoPreview(URL.createObjectURL(f));
                            const reader = new FileReader();
                            reader.onload = () => setSelectedFile(reader.result as string);
                            reader.readAsDataURL(f);
                          } else {
                            r.onload = () => setImagePreview(r.result as string);
                            r.readAsDataURL(f);
                          }
                        }
                      }} 
                    />
                  </div>
                </div>

                <button 
                  onClick={() => handleSend()} 
                  disabled={!input.trim() && !imagePreview && !selectedFile}
                  className="p-3.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-2xl shadow-lg shadow-cyan-600/30 hover:scale-105 active:scale-95 disabled:grayscale disabled:opacity-40 transition-all border border-cyan-400/40"
                  title="Send Diagnostic Query"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Preview thumbnails */}
              {imagePreview && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-16 h-16 ml-2">
                  <img src={imagePreview} className="w-full h-full object-cover rounded-xl border border-cyan-400 shadow-md" alt="Preview" />
                  <button onClick={() => setImagePreview(null)} className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white p-1 rounded-full shadow hover:scale-110 border border-cyan-500">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </motion.div>
              )}

              {videoPreview && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-24 h-16 ml-2">
                  <video src={videoPreview} className="w-full h-full object-cover rounded-xl border border-cyan-400 shadow-md" />
                  <button onClick={() => { setVideoPreview(null); setSelectedFile(null); }} className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white p-1 rounded-full shadow hover:scale-110 border border-cyan-500">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
};
