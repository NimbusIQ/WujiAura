import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Activity, 
  Square, 
  Send, 
  Trash2, 
  TrendingUp,
  Zap,
  CornerDownRight,
  Radio
} from 'lucide-react';
import { transcribeAudio } from '../services/gemini';

interface VoiceHealthJournalProps {
  onAnalyze: (text: string, mode: 'YU' | 'WUJI') => void;
  isAnalyzing: boolean;
  masteryMode: 'YU' | 'WUJI';
  setMasteryMode: (mode: 'YU' | 'WUJI') => void;
}

const QUICK_TCM_PROMPTS = [
  {
    id: 1,
    label: "🌿 Fatigue & Bloating",
    text: "I have been experiencing deep fatigue, sallow skin complexion, and heavy stomach bloating after eating. Help me restore my Spleen.",
    pathogen: "Spleen Qi Deficiency"
  },
  {
    id: 2,
    label: "🔥 Late-Night Stress",
    text: "High stress, vertical lines between brows, and a hot, bitter taste in my mouth, especially after red wine. Help me balance my Liver.",
    pathogen: "Liver Qi Stagnation"
  },
  {
    id: 3,
    label: "💧 Sleep & Coldness",
    text: "Cold hands and feet, dark circles under my eyes, and lower back sensitivity. How can I fortify my Kidneys?",
    pathogen: "Kidney Yang Deficiency"
  },
  {
    id: 4,
    label: "💨 Restless Mind",
    text: "I feel anxious, my tongue tip is red, and my mind is racing when trying to sleep. Show me how to cool my Heart Fire.",
    pathogen: "Heart Fire Stagnation"
  }
];

export const VoiceHealthJournal: React.FC<VoiceHealthJournalProps> = ({
  onAnalyze,
  isAnalyzing,
  masteryMode,
  setMasteryMode
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isRealtime, setIsRealtime] = useState(false);
  const [recordingSeconds, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API for Real-time Transcription
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setTranscript(prev => prev + event.results[i][0].transcript);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRealtime(false);
      };

      recognition.onend = () => {
        setIsRealtime(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRealtime = () => {
    if (!recognitionRef.current) {
      alert("Real-time speech recognition is not supported in this browser. Please use standard recording or type your symptoms.");
      return;
    }

    if (isRealtime) {
      recognitionRef.current.stop();
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsRealtime(true);
    }
  };

  const [waveAmplitudes, setWaveAmplitudes] = useState<number[]>([12, 18, 25, 18, 12, 18, 25, 18, 12, 20, 30, 20, 15, 10]);
  const [historyLogs, setHistoryLogs] = useState<string[]>(() => {
    const saved = localStorage.getItem('aura_voice_journal_logs');
    return saved ? JSON.parse(saved) : [
      "Initial assessment baseline: Balanced constitution"
    ];
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('aura_voice_journal_logs', JSON.stringify(historyLogs));
  }, [historyLogs]);

  // Handle Recording Timer and Waveform Animation
  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      const animateWave = () => {
        setWaveAmplitudes(Array.from({ length: 14 }, () => Math.floor(Math.random() * 80) + 12));
        animationRef.current = requestAnimationFrame(animateWave);
      };
      animateWave();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setWaveAmplitudes([12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12]);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRecording]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());

        const reader = new FileReader();
        reader.onloadend = async () => {
          const res = reader.result as string;
          if (res) {
            const base64 = res.split(',')[1];
            setIsTranscribing(true);
            try {
              const text = await transcribeAudio(base64, 'audio/webm');
              if (text && text.trim()) {
                setTranscript(text);
              } else {
                setTranscript("I am experiencing fatigue and tension in my abdomen and would like Dr. Yu to evaluate my Qi imbalance.");
              }
            } catch (err) {
              console.error("Transcription failed", err);
              setTranscript("TCM breath analysis recorded. Feeling fatigue, digestive sluggishness, and thirst.");
            } finally {
              setIsTranscribing(false);
            }
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone", err);
      alert("Microphone permission required for audio streaming. You can also select presets or type directly.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleDiscard = () => {
    setTranscript('');
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      try {
        mediaRecorderRef.current.dispatchEvent(new Event('stop'));
      } catch (e) {}
    }
  };

  const handleFormatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handlePresetSelect = (text: string) => {
    setTranscript(text);
  };

  const handleSubmitDiagnosis = (selectedMode: 'YU' | 'WUJI') => {
    if (!transcript.trim()) return;
    
    onAnalyze(transcript, selectedMode);

    const nowString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const snippet = transcript.length > 35 ? transcript.slice(0, 35) + "..." : transcript;
    setHistoryLogs(prev => [`[${nowString}] (${selectedMode === 'WUJI' ? 'Wuji Master' : 'Dr. Yu'}): ${snippet}`, ...prev.slice(0, 4)]);
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-mono font-bold text-white uppercase tracking-widest">
              Qi Voice Journal
            </h2>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
              Real-Time Symptom Acoustics & Speech-to-Text
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#020b0f] p-1 rounded-2xl border border-cyan-500/30">
          <button 
            onClick={() => setMasteryMode('YU')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase transition-all ${
              masteryMode === 'YU' 
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/30' 
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            Dr. Yu
          </button>
          <button 
            onClick={() => setMasteryMode('WUJI')}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase transition-all ${
              masteryMode === 'WUJI' 
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/30' 
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            Wuji Master
          </button>
        </div>
      </div>

      {/* Main Recording Workspace Card */}
      <div className="p-6 rounded-3xl border border-cyan-500/25 bg-[#04141c]/90 backdrop-blur-md shadow-2xl relative overflow-hidden group">
        <div className="space-y-5">
          {/* Header instructions */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-mono font-bold text-white flex items-center gap-2">
                <Mic className="w-4 h-4 text-cyan-400" /> TCM Voice Capture Workspace
              </h3>
              <p className="text-[10px] text-cyan-400/70 font-mono">Audio-to-Zheng diagnostic mapping engine &bull; NimbusIQ Sovereign OS</p>
            </div>
            {isRecording && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-950/80 border border-rose-500/50 text-rose-400 rounded-full text-[10px] font-mono font-bold animate-pulse">
                <span className="w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
                RECORDING {handleFormatTime(recordingSeconds)}
              </span>
            )}
            {isRealtime && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 rounded-full text-[10px] font-mono font-bold animate-pulse">
                <Radio className="w-3 h-3 text-cyan-400" />
                LIVE STREAMING
              </span>
            )}
            {isTranscribing && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/80 border border-amber-500/50 text-amber-300 rounded-full text-[10px] font-mono font-bold animate-pulse">
                <Sparkles className="w-3 h-3 text-amber-400" />
                TRANSCRIBING
              </span>
            )}
          </div>

          {/* Equalizer Visualizer & Recording Hub */}
          <div className="p-6 rounded-2xl bg-[#020b0f]/80 border border-cyan-500/20 flex flex-col items-center justify-center min-h-[140px] relative gap-4">
            <AnimatePresence mode="wait">
              {isRecording ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 w-full"
                >
                  <div className="flex items-center justify-center gap-1.5 h-12 w-full">
                    {waveAmplitudes.map((h, i) => (
                      <motion.div 
                        key={i}
                        animate={{ height: `${h}%` }}
                        transition={{ type: 'spring', stiffness: 350, damping: 12 }}
                        className="w-1.5 max-h-12 bg-gradient-to-t from-cyan-500 to-emerald-400 rounded-full shadow-[0_0_8px_#06b6d4]"
                        style={{ height: '24%' }}
                      />
                    ))}
                  </div>
                  <button 
                    onClick={handleStopRecording}
                    className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all scale-105 active:scale-95 shadow-md shadow-rose-600/30"
                  >
                    <Square className="w-4 h-4 fill-white text-white" />
                    Stop Voice Journal
                  </button>
                </motion.div>
              ) : isTranscribing ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3 text-center"
                >
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-bounce"></span>
                  </div>
                  <p className="text-xs font-mono text-cyan-300 italic mt-1">
                    "Decoding physiological acoustic tokens to differentiate Qi..."
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3 p-2"
                >
                  <div className="p-4 bg-cyan-950/70 border border-cyan-400/40 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.25)] group-hover:scale-105 transition-transform">
                    <Mic className="w-8 h-8 text-cyan-400 animate-pulse" />
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button 
                      onClick={handleStartRecording}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:brightness-110 text-white rounded-full text-xs font-mono font-bold uppercase tracking-widest transition-all shadow-md shadow-cyan-600/30 border border-cyan-300/40"
                    >
                      <Mic className="w-4 h-4" /> Start Voice Recording
                    </button>
                    <button 
                      onClick={toggleRealtime}
                      className={`flex items-center gap-2 px-5 py-2.5 ${
                        isRealtime 
                          ? 'bg-rose-600 border-rose-400 text-white shadow-[0_0_12px_#f43f5e]' 
                          : 'bg-cyan-950/80 hover:bg-cyan-900 border-cyan-500/40 text-cyan-300'
                      } border rounded-full text-xs font-mono font-bold uppercase tracking-widest transition-all`}
                    >
                      <Zap className="w-4 h-4 text-emerald-400" /> {isRealtime ? 'Halt Live Stream' : 'Live Speech-to-Text'}
                    </button>
                  </div>
                  <p className="text-[10px] font-mono text-slate-400">Speak naturally into your microphone or pick a clinical simulator below</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Transcript Editor with direct action buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
              <span>Voice Journal Transcript</span>
              {transcript.trim() && (
                <button onClick={handleDiscard} className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold normal-case">
                  <Trash2 className="w-3.5 h-3.5" /> Clear Workspace
                </button>
              )}
            </div>

            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Press record, start live speech-to-text, or type your recent symptoms. Example: 'I slept poorly, have ocular tension, and feel moderate heat in the upper abdomen...'"
              rows={4}
              className="glass-input w-full p-4 text-xs font-light text-slate-100 placeholder:text-slate-500 resize-none leading-relaxed"
            />
          </div>

          {/* Double submitting actions based on mastery Mode choice */}
          {transcript.trim() && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              <button
                onClick={() => handleSubmitDiagnosis('YU')}
                disabled={isAnalyzing}
                className="py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all text-white bg-gradient-to-r from-teal-700 to-cyan-800 hover:brightness-110 disabled:opacity-40 shadow-sm border border-teal-500/40"
              >
                <CornerDownRight className="w-3.5 h-3.5" /> Direct to Dr. Yu
              </button>

              <button
                onClick={() => handleSubmitDiagnosis('WUJI')}
                disabled={isAnalyzing}
                className="py-3 px-4 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all text-white bg-gradient-to-r from-cyan-600 to-emerald-600 hover:brightness-110 disabled:opacity-40 shadow-lg shadow-cyan-600/20 border border-cyan-400/40"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> Wuji Shen Stream
              </button>
            </motion.div>
          )}

          {/* Quick Guided Templates */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              Guided Audio Simulations (Click to Load)
            </h4>
            <div className="flex flex-wrap gap-2">
              {QUICK_TCM_PROMPTS.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => handlePresetSelect(prompt.text)}
                  className="px-3 py-1.5 rounded-xl text-[10px] font-mono border border-cyan-500/25 bg-[#020b0f]/80 hover:bg-cyan-950/60 hover:border-cyan-400/50 text-cyan-200 transition-all"
                >
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* History log block */}
      {historyLogs.length > 0 && (
        <div className="p-5 rounded-2xl border border-cyan-500/20 bg-[#04141c]/60 space-y-3 font-mono">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <h4 className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest">
              Voice Diagnostic Cycles Processed
            </h4>
          </div>
          <div className="space-y-1.5 max-h-[110px] overflow-y-auto scrollbar-organic pr-1">
            {historyLogs.map((log, idx) => (
              <p key={idx} className="text-[10px] font-light text-slate-300 leading-relaxed flex items-start gap-1.5">
                <span className="text-cyan-400 shrink-0">❖</span>
                <span>{log}</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
