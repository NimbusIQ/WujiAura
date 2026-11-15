import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Cpu, 
  BookOpen, 
  Layers, 
  Terminal, 
  Zap, 
  Copy, 
  Check, 
  Download, 
  Play, 
  RefreshCw, 
  Share2, 
  Database, 
  Code, 
  Sparkles, 
  MessageSquare, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ListFilter
} from 'lucide-react';
import { 
  TCMMCPServer, 
  A2ARouter, 
  NotebookLMExporter, 
  ADKOrchestrator 
} from '../services/multiAgentIntegration';
import { retrieveRelevantPoints } from '../services/tcmVectorCore';

export const MultiAgentIntegrationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mcp' | 'a2a' | 'notebooklm' | 'adk' | 'rag'>('mcp');

  // MCP State
  const [mcpServer] = useState(() => new TCMMCPServer());
  const [selectedMcpTool, setSelectedMcpTool] = useState<string>('analyze_mien_shiang');
  const [mcpInputJson, setMcpInputJson] = useState<string>(
    JSON.stringify({ facial_biomarkers: ["furrow between brows", "redness on nose tip"], complexion: "sallow" }, null, 2)
  );
  const [mcpOutput, setMcpOutput] = useState<string | null>(null);
  const [mcpLoading, setMcpLoading] = useState<boolean>(false);
  const [copiedMcpConfig, setCopiedMcpConfig] = useState<boolean>(false);

  // A2A State
  const [a2aRouter] = useState(() => new A2ARouter());
  const [a2aAction, setA2aAction] = useState<'DELEGATE_DIAGNOSIS' | 'DEBATE_FINDING'>('DELEGATE_DIAGNOSIS');
  const [a2aResult, setA2aResult] = useState<any | null>(null);
  const [a2aExecuting, setA2aExecuting] = useState<boolean>(false);

  // NotebookLM State
  const [notebookExporter] = useState(() => new NotebookLMExporter());
  const [patientName, setPatientName] = useState<string>('Jane Doe');
  const [notebookBundle, setNotebookBundle] = useState<any | null>(null);
  const [copiedNotebookMarkdown, setCopiedNotebookMarkdown] = useState<boolean>(false);

  // ADK State
  const [adkOrchestrator] = useState(() => new ADKOrchestrator(`adk-task-${Date.now()}`));
  const [adkSteps, setAdkSteps] = useState<any[]>([]);
  const [triggerContradiction, setTriggerContradiction] = useState<boolean>(false);

  // RAG State
  const [ragQuery, setRagQuery] = useState<string>('fatigue with digestive bloating and anxiety');
  const [ragResults, setRagResults] = useState<any[]>([]);
  const [ragLoading, setRagLoading] = useState<boolean>(false);

  // MCP Tool Execution
  const handleExecuteMcpTool = async () => {
    setMcpLoading(true);
    setMcpOutput(null);
    try {
      const parsedArgs = JSON.parse(mcpInputJson);
      const res = await mcpServer.callTool(selectedMcpTool, parsedArgs);
      setMcpOutput(JSON.stringify(res, null, 2));
    } catch (err: any) {
      setMcpOutput(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setMcpLoading(false);
    }
  };

  // Copy MCP Server Config snippet
  const copyMcpConfig = () => {
    const config = {
      mcpServers: {
        "nimbus-tcm-agent": {
          command: "node",
          args: ["/dist/server.cjs"],
          env: {
            GEMINI_API_KEY: "YOUR_GEMINI_API_KEY"
          }
        }
      }
    };
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopiedMcpConfig(true);
    setTimeout(() => setCopiedMcpConfig(false), 2000);
  };

  // Execute A2A Delegation
  const handleRunA2A = async () => {
    setA2aExecuting(true);
    setA2aResult(null);
    setTimeout(async () => {
      const res = await a2aRouter.handleMessage({
        message_id: `msg-${Date.now()}`,
        sender_agent_id: "external-diagnostic-agent",
        recipient_agent_id: "dr-yu-tcm-core",
        action: a2aAction,
        payload: {
          biomarkers: ["furrow between brows", "flushed malar cheeks"],
          reported_symptoms: "Fatigue after meals and trouble sleeping"
        },
        timestamp: new Date().toISOString()
      });
      setA2aResult(res);
      setA2aExecuting(false);
    }, 1200);
  };

  // Generate NotebookLM Bundle
  const handleGenerateNotebookLM = () => {
    const bundle = notebookExporter.generateSourceBundle(
      patientName,
      [
        "Felt tired and heavy in the afternoons.",
        "Had trouble digesting oily fast food yesterday.",
        "Noticeable vertical lines between brows in facial photo scan."
      ],
      {
        syndrome: { name: "Liver Qi Stagnation with Spleen Dampness" },
        status: "Image scan indicates urgent need for water, physical rest, and a positive diet regimen.",
        elements: ["Wood (Liver)", "Earth (Spleen)"]
      }
    );
    setNotebookBundle(bundle);
  };

  // Copy Markdown Source Bundle
  const copyNotebookMarkdown = () => {
    if (!notebookBundle) return;
    const fullMarkdown = notebookBundle.source_documents
      .map((d: any) => `---\n# DOCUMENT: ${d.title}\n${d.content_markdown}\n`)
      .join("\n\n");
    navigator.clipboard.writeText(fullMarkdown);
    setCopiedNotebookMarkdown(true);
    setTimeout(() => setCopiedNotebookMarkdown(false), 2000);
  };

  // ADK Step Execution
  const handleAdkStep = async (stepName: string) => {
    const res = await adkOrchestrator.executeStep(stepName, {
      timestamp: new Date().toISOString(),
      contradiction_detected: triggerContradiction
    });
    setAdkSteps(prev => [...prev, res]);
    if (triggerContradiction) {
      setTriggerContradiction(false);
    }
  };

  // Hybrid RAG Query
  const handleRunRAG = async () => {
    setRagLoading(true);
    try {
      const points = await retrieveRelevantPoints(ragQuery, 4);
      setRagResults(points);
    } catch (err) {
      console.error(err);
    } finally {
      setRagLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 md:p-8 space-y-6 relative overflow-hidden my-8 bg-[#04141c]/90 border border-cyan-500/25 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-cyan-950/90 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5 border border-cyan-400/40 shadow-sm">
              <Sparkles className="w-3 h-3 text-cyan-400" /> Multi-Agent Integration Hub
            </span>
            <span className="text-xs text-slate-400 font-mono">v2.8 Enterprise Protocol</span>
          </div>
          <h2 className="font-mono text-xl md:text-2xl font-bold text-white mt-2">
            A2A, MCP, NotebookLM, ADK & Hybrid RAG Engine
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl mt-1">
            Connect Dr. Yu and Nimbus TCM services to external AI agents, NotebookLM notebooks, Model Context Protocol (MCP) clients, Antigravity ADK orchestrators, and vector stores.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1.5 bg-[#020b0f] p-1.5 rounded-2xl border border-cyan-500/30">
          <button
            onClick={() => setActiveTab('mcp')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'mcp' 
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/30' 
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> MCP Server
          </button>
          <button
            onClick={() => setActiveTab('a2a')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'a2a' 
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/30' 
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" /> A2A Protocol
          </button>
          <button
            onClick={() => setActiveTab('notebooklm')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'notebooklm' 
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/30' 
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" /> NotebookLM
          </button>
          <button
            onClick={() => setActiveTab('adk')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'adk' 
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/30' 
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-teal-300" /> ADK Engine
          </button>
          <button
            onClick={() => setActiveTab('rag')}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'rag' 
                ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-sm shadow-cyan-600/30 border border-cyan-400/30' 
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-amber-400" /> Hybrid RAG
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="mt-6">
        {/* TAB 1: MCP SERVER */}
        {activeTab === 'mcp' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 p-4 bg-cyan-950/40 rounded-2xl border border-cyan-500/30">
              <div className="space-y-1">
                <h3 className="text-sm font-mono font-bold text-cyan-300 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" /> Model Context Protocol (MCP) Server Endpoint
                </h3>
                <p className="text-xs text-slate-300">
                  Exposes standard JSON-RPC tools (`tools/list`, `tools/call`), resources, and prompts for Claude Desktop, Gemini, Antigravity, and Cursor.
                </p>
              </div>
              <button
                onClick={copyMcpConfig}
                className="px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 hover:brightness-110 transition-all shrink-0 border border-cyan-400/30"
              >
                {copiedMcpConfig ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedMcpConfig ? 'Config Copied!' : 'Copy mcpServers Config'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tool Execution Panel */}
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  Interactive MCP Tool Execution
                </span>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-300 block">Select MCP Tool</label>
                  <select
                    value={selectedMcpTool}
                    onChange={(e) => {
                      setSelectedMcpTool(e.target.value);
                      if (e.target.value === 'analyze_mien_shiang') {
                        setMcpInputJson(JSON.stringify({ facial_biomarkers: ["furrow between brows", "redness on nose tip"], complexion: "sallow" }, null, 2));
                      } else if (e.target.value === 'query_tcm_rag') {
                        setMcpInputJson(JSON.stringify({ symptoms: "insomnia with dry mouth and digestive bloating", limit: 3 }, null, 2));
                      } else if (e.target.value === 'get_rod_t_dietary_prescriptions') {
                        setMcpInputJson(JSON.stringify({ pathogen_type: "drinking" }, null, 2));
                      } else if (e.target.value === 'calculate_organ_clock_peak') {
                        setMcpInputJson(JSON.stringify({ hour: 9 }, null, 2));
                      }
                    }}
                    className="w-full p-3 bg-[#020b0f] border border-cyan-500/30 rounded-xl text-xs font-mono text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  >
                    {mcpServer.getTools().map(t => (
                      <option key={t.name} value={t.name}>
                        {t.name} — {t.description.substring(0, 50)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-300 block">JSON-RPC Tool Input Arguments</label>
                  <textarea
                    rows={6}
                    value={mcpInputJson}
                    onChange={(e) => setMcpInputJson(e.target.value)}
                    className="w-full p-3 bg-[#020b0f] text-cyan-300 font-mono text-xs rounded-xl border border-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>

                <button
                  onClick={handleExecuteMcpTool}
                  disabled={mcpLoading}
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md shadow-cyan-600/30 border border-cyan-400/30"
                >
                  {mcpLoading ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <Play className="w-4 h-4 text-emerald-300" />}
                  Execute Tool via MCP Protocol
                </button>
              </div>

              {/* JSON Output Viewer */}
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                  MCP JSON-RPC Output Response
                </span>
                <div className="bg-[#020b0f] text-cyan-200 p-4 rounded-2xl font-mono text-xs h-[280px] overflow-y-auto border border-cyan-500/30">
                  {mcpOutput ? (
                    <pre className="whitespace-pre-wrap text-emerald-400 leading-relaxed">{mcpOutput}</pre>
                  ) : (
                    <p className="text-slate-500 italic">Select a tool and click 'Execute Tool via MCP Protocol' to view output JSON...</p>
                  )}
                </div>

                <div className="p-3 bg-cyan-950/30 rounded-xl border border-cyan-500/20 text-[11px] font-mono text-slate-300 space-y-1">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Standard MCP Resources Registered
                  </p>
                  <p>• <code className="text-cyan-300 font-bold">tcm://knowledge-base/wuxing</code> — Five Elements Matrix</p>
                  <p>• <code className="text-cyan-300 font-bold">tcm://vendors/rod-t-inventory</code> — Organic Kiosk Inventory</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: A2A PROTOCOL */}
        {activeTab === 'a2a' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="p-4 bg-cyan-950/40 rounded-2xl border border-cyan-500/30 space-y-1">
              <h3 className="text-sm font-mono font-bold text-cyan-300 flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" /> Agent-to-Agent (A2A) Protocol Router
              </h3>
              <p className="text-xs text-slate-300">
                Enables peer-to-peer delegation, state-delta syncing, and multi-agent consensus debate between specialized autonomous agents.
              </p>
            </div>

            {/* Registered A2A Agents Grid */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Registered Ecosystem A2A Agents</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {a2aRouter.getAgents().map(ag => (
                  <div key={ag.agent_id} className="p-4 bg-[#051820]/75 border border-cyan-500/25 rounded-2xl space-y-2.5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-mono font-bold text-white">{ag.agent_name}</span>
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-bold rounded-full shrink-0">Active</span>
                      </div>
                      <p className="text-[10px] font-mono text-slate-400">
                        Role: <span className="font-semibold text-cyan-300">{ag.role}</span> &bull; ID: <span className="text-slate-300">{ag.agent_id}</span>
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">{ag.description}</p>
                      <div className="p-2.5 rounded-xl bg-[#020b0f] border border-cyan-500/20 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-cyan-400">System Instruction</span>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(ag.system_instruction)}
                            className="text-[9px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            <Copy className="w-2.5 h-2.5" /> Copy
                          </button>
                        </div>
                        <p className="text-[11px] font-mono text-slate-300 leading-relaxed">{ag.system_instruction}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {ag.capabilities.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-900 border border-cyan-500/20 text-cyan-200 text-[9px] font-mono rounded-md">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Simulator */}
            <div className="p-6 bg-[#020b0f] text-white rounded-2xl space-y-4 border border-cyan-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Trigger A2A Delegation Workflow
                </span>
                <div className="flex gap-2 font-mono text-xs">
                  <button
                    onClick={() => setA2aAction('DELEGATE_DIAGNOSIS')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      a2aAction === 'DELEGATE_DIAGNOSIS' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-cyan-500/20'
                    }`}
                  >
                    Delegate Diagnosis
                  </button>
                  <button
                    onClick={() => setA2aAction('DEBATE_FINDING')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      a2aAction === 'DEBATE_FINDING' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-cyan-500/20'
                    }`}
                  >
                    Multi-Agent Debate
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleRunA2A}
                  disabled={a2aExecuting}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:brightness-110 text-white font-mono font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 transition-all border border-cyan-400/30"
                >
                  {a2aExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 text-emerald-300" />}
                  Dispatch A2A Handshake
                </button>
              </div>

              {a2aResult && (
                <div className="p-4 bg-[#051820]/90 border border-cyan-500/30 rounded-xl space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-cyan-300 border-b border-cyan-500/20 pb-2">
                    <span>Status: {a2aResult.status}</span>
                    <span className="text-[10px] text-slate-400">Protocol: A2A/v1.0</span>
                  </div>
                  {a2aResult.consensus_finding && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-emerald-200 text-xs leading-relaxed">
                      <strong className="text-emerald-400 block mb-1">Synthesized Consensus Finding:</strong>
                      {a2aResult.consensus_finding}
                    </div>
                  )}
                  <div className="space-y-1 pt-1">
                    <span className="text-cyan-400 text-[10px] uppercase font-bold block">Individual Agent State Responses:</span>
                    <pre className="text-slate-300 text-[11px] overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(a2aResult.agent_responses, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 3: NOTEBOOKLM */}
        {activeTab === 'notebooklm' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="p-4 bg-cyan-950/40 rounded-2xl border border-cyan-500/30 space-y-1">
              <h3 className="text-sm font-mono font-bold text-cyan-300 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" /> NotebookLM Source Bundle Exporter
              </h3>
              <p className="text-xs text-slate-300">
                Exports structured Markdown source packs, Q&A pairs, and Audio Overview deep dive scripts optimized for Google's NotebookLM ingest engine.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#051820]/75 p-4 rounded-2xl border border-cyan-500/25">
              <div className="flex-1 w-full">
                <label className="text-xs font-mono text-slate-300 block mb-1">Patient/Subject Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-2.5 bg-[#020b0f] border border-cyan-500/30 rounded-xl text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
              <button
                onClick={handleGenerateNotebookLM}
                className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 self-end shrink-0 border border-cyan-400/30"
              >
                <Sparkles className="w-4 h-4 text-emerald-300" /> Generate NotebookLM Source Pack
              </button>
            </div>

            {notebookBundle && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    Source Documents Bundle ({notebookBundle.source_documents.length} Files Generated)
                  </span>
                  <button
                    onClick={copyNotebookMarkdown}
                    className="px-3 py-1.5 bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 hover:bg-cyan-900/80 transition-all"
                  >
                    {copiedNotebookMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedNotebookMarkdown ? 'Markdown Copied!' : 'Copy All Sources to Clipboard'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {notebookBundle.source_documents.map((doc: any) => (
                    <div key={doc.document_id} className="p-4 bg-[#051820]/80 border border-cyan-500/25 rounded-2xl space-y-3 shadow-sm flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[9px] font-mono font-bold rounded">
                          {doc.type}
                        </span>
                        <h4 className="font-mono text-sm font-bold text-white leading-snug">{doc.title}</h4>
                      </div>
                      <div className="bg-[#020b0f] p-3 rounded-xl border border-cyan-500/20 text-[11px] font-mono text-slate-300 h-[140px] overflow-y-auto">
                        <pre className="whitespace-pre-wrap">{doc.content_markdown}</pre>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-[#020b0f] text-cyan-200 rounded-2xl border border-cyan-500/30 space-y-2">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" /> NotebookLM Deep Dive Audio Overview Script
                  </span>
                  <p className="text-xs font-mono leading-relaxed text-slate-300 italic bg-cyan-950/30 p-3 rounded-xl border border-cyan-500/20">
                    "{notebookBundle.audio_overview_script}"
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 4: ADK ENGINE */}
        {activeTab === 'adk' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="p-4 bg-cyan-950/40 rounded-2xl border border-cyan-500/30 space-y-1">
              <h3 className="text-sm font-mono font-bold text-cyan-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" /> Antigravity Agent Development Kit (ADK) Engine
              </h3>
              <p className="text-xs text-slate-300">
                Micro-task orchestrator featuring execution loops, self-reflection check, and state management rewinds (rollbacks).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => handleAdkStep('Facial Biomarker Ingestion')}
                className="p-4 bg-[#051820]/75 hover:bg-[#07242e] border border-cyan-500/25 rounded-2xl text-left space-y-1 transition-all"
              >
                <span className="text-xs font-mono font-bold text-white block">Step 1: Parse Biomarkers</span>
                <span className="text-[10px] font-mono text-slate-400 block">Extract Mien Shiang organ coordinates</span>
              </button>

              <button
                onClick={() => handleAdkStep('Voice Journal Sentiment Analysis')}
                className="p-4 bg-[#051820]/75 hover:bg-[#07242e] border border-cyan-500/25 rounded-2xl text-left space-y-1 transition-all"
              >
                <span className="text-xs font-mono font-bold text-white block">Step 2: Voice Analysis</span>
                <span className="text-[10px] font-mono text-slate-400 block">Compute emotional Qi frequency</span>
              </button>

              <div className="p-4 bg-cyan-950/60 border border-cyan-500/30 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white">Step 3: Self-Reflection</span>
                  <label className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={triggerContradiction}
                      onChange={(e) => setTriggerContradiction(e.target.checked)}
                      className="rounded border-cyan-500/40 bg-slate-900 text-cyan-500"
                    />
                    Inject Contradiction
                  </label>
                </div>
                <button
                  onClick={() => handleAdkStep('Diagnostic Synthesis & Reflection')}
                  className="w-full py-1.5 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg text-xs font-mono font-bold hover:brightness-110 transition-all shadow-sm"
                >
                  Execute Synthesis
                </button>
              </div>
            </div>

            {/* ADK Timeline */}
            <div className="p-4 bg-[#020b0f] text-slate-200 rounded-2xl space-y-3 border border-cyan-500/30">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                ADK State Management Timeline ({adkSteps.length} Events)
              </span>

              {adkSteps.length === 0 ? (
                <p className="text-xs font-mono text-slate-500 italic p-3">Click any step above to execute ADK state transitions...</p>
              ) : (
                <div className="space-y-2">
                  {adkSteps.map((st, i) => (
                    <div key={i} className={`p-3 rounded-xl font-mono text-xs border ${
                      st.status === 'REWOUND'
                        ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                        : 'bg-[#051820] border-cyan-500/30 text-emerald-400'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span>Event #{st.step || i + 1} - Status: {st.status}</span>
                        <span className="text-[10px] text-slate-400">ID: {st.task_id}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] mt-1">{st.result || `Restored state to step ${st.targetStep}`}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 5: HYBRID RAG */}
        {activeTab === 'rag' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="p-4 bg-cyan-950/40 rounded-2xl border border-cyan-500/30 space-y-1">
              <h3 className="text-sm font-mono font-bold text-cyan-300 flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" /> Vector RAG Engine & Classical Knowledge Graph
              </h3>
              <p className="text-xs text-slate-300">
                Calculates cosine similarities over vectorized TCM points, element linkages, and classical symptom indications.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
                placeholder="Enter symptoms or organ disharmony..."
                className="flex-1 p-3 bg-[#020b0f] border border-cyan-500/30 rounded-xl text-xs font-mono text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <button
                onClick={handleRunRAG}
                disabled={ragLoading}
                className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-2 shrink-0 border border-cyan-400/30 shadow-md shadow-cyan-600/30"
              >
                {ragLoading ? <RefreshCw className="w-4 h-4 animate-spin text-white" /> : <Play className="w-4 h-4 text-emerald-300" />}
                Query Vector RAG
              </button>
            </div>

            {/* RAG Results */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">Vector Search Matches</span>
              {ragResults.length === 0 ? (
                <p className="text-xs font-mono text-slate-400 italic p-4 bg-[#051820]/60 rounded-2xl border border-cyan-500/20">
                  Click 'Query Vector RAG' to perform semantic retrieval...
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ragResults.map((res: any) => (
                    <div key={res.point.id} className="p-4 bg-[#051820]/80 border border-cyan-500/25 rounded-2xl space-y-2 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-white">
                          Point {res.point.id} ({res.point.name})
                        </span>
                        <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 font-mono text-[10px] font-bold rounded-full border border-cyan-500/30">
                          Similarity: {(res.score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-mono">
                        Meridian: <strong className="text-cyan-300">{res.point.meridian}</strong> ({res.point.element} Element)
                      </p>
                      <div className="pt-1">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Indications:</span>
                        <p className="text-xs text-slate-200 mt-0.5 font-mono">{res.point.indications.join(", ")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
