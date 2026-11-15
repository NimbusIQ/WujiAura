
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState, useRef } from 'react';
import { 
  ArrowDownTrayIcon, 
  PlusIcon, 
  ViewColumnsIcon, 
  DocumentIcon, 
  CodeBracketIcon, 
  XMarkIcon,
  PlayIcon,
  CommandLineIcon,
  EyeIcon,
  CpuChipIcon,
  FolderIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  CubeIcon,
  ServerIcon,
  BeakerIcon
} from '@heroicons/react/24/outline';
import { Creation } from './CreationHistory';

interface LivePreviewProps {
  creation: Creation | null;
  isLoading: boolean;
  isFocused: boolean;
  onReset: () => void;
}

// Add type definition for the global pdfjsLib
declare global {
  interface Window {
    pdfjsLib: any;
  }
}

const TerminalLine = ({ text, delay }: { text: string, delay: number }) => {
    const [visible, setVisible] = useState(false);
    
    useEffect(() => {
        const timeout = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timeout);
    }, [delay]);

    if (!visible) return null;

    return (
        <div className="font-mono text-xs text-green-400/80 mb-1 flex items-center">
            <span className="text-zinc-600 mr-2 min-w-[60px]">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
            <ChevronRightIcon className="w-3 h-3 mr-1 text-green-600" />
            <span className="typing-effect">{text}</span>
        </div>
    );
};

const PdfRenderer = ({ dataUrl }: { dataUrl: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderPdf = async () => {
      if (!window.pdfjsLib) {
        setError("PDF library not initialized");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Load the document
        const loadingTask = window.pdfjsLib.getDocument(dataUrl);
        const pdf = await loadingTask.promise;
        
        // Get the first page
        const page = await pdf.getPage(1);
        
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        
        // Calculate scale to make it look good (High DPI)
        const viewport = page.getViewport({ scale: 2.0 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        setLoading(false);
      } catch (err) {
        console.error("Error rendering PDF:", err);
        setError("Could not render PDF preview.");
        setLoading(false);
      }
    };

    renderPdf();
  }, [dataUrl]);

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-zinc-500 p-6 text-center">
            <DocumentIcon className="w-12 h-12 mb-3 opacity-50 text-red-400" />
            <p className="text-sm mb-2 text-red-400/80">{error}</p>
        </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-zinc-900/50">
        {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        )}
        <canvas 
            ref={canvasRef} 
            className={`max-w-full max-h-full object-contain shadow-xl border border-zinc-800/50 rounded transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
        />
    </div>
  );
};

const FileTreeItem = ({ label, icon: Icon, active = false, color = "text-zinc-400" }: { label: string, icon: any, active?: boolean, color?: string }) => (
    <div className={`flex items-center px-3 py-1.5 text-xs cursor-pointer ${active ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
        <Icon className={`w-4 h-4 mr-2 ${color}`} />
        <span>{label}</span>
    </div>
);

export const LivePreview: React.FC<LivePreviewProps> = ({ creation, isLoading, isFocused, onReset }) => {
    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
    const [showSplitView, setShowSplitView] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    
    // Editor State
    const [code, setCode] = useState('');
    const [executedCode, setExecutedCode] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Sync state when creation changes
    useEffect(() => {
        if (creation?.html) {
            setCode(creation.html);
            setExecutedCode(creation.html);
            // Default to split view if there's an image
            if (creation.originalImage) {
                setShowSplitView(true);
            } else {
                setShowSplitView(false);
            }
            setActiveTab('preview');
        }
    }, [creation]);

    // Reset when loading starts
    useEffect(() => {
        if (isLoading) {
            setActiveTab('preview');
        }
    }, [isLoading]);

    const handleRunCode = () => {
        setExecutedCode(code);
        setActiveTab('preview');
    };

    const handleExport = () => {
        if (!creation) return;
        // Update creation with currently edited code before exporting
        const exportData = {
            ...creation,
            html: code
        };
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${creation.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_artifact.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Calculate line numbers
    const lineNumbers = code.split('\n').map((_, i) => i + 1);

    const handleEditorScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
       // Sync gutter scroll? No, typically gutter is sticky or handled by same scroll container
       // For this simple implementation, we'll let them scroll together if we wrap them
    };

  return (
    <div
      className={`
        fixed z-40 flex flex-col
        rounded-lg overflow-hidden border border-zinc-800 bg-[#18181b] shadow-2xl
        transition-all duration-700 cubic-bezier(0.2, 0.8, 0.2, 1)
        ${isFocused
          ? 'inset-0 sm:inset-4 opacity-100 scale-100'
          : 'top-1/2 left-1/2 w-[90%] h-[60%] -translate-x-1/2 -translate-y-1/2 opacity-0 scale-95 pointer-events-none'
        }
      `}
    >
      {/* Workbench Toolbar */}
      <div className="bg-[#18181b] flex items-center justify-between border-b border-zinc-800 shrink-0 h-10 px-3 select-none">
        {/* Left: Window Controls & Project Name */}
        <div className="flex items-center space-x-4">
           <div className="flex space-x-2 group/controls mr-2">
                <button 
                  onClick={onReset}
                  className="w-3 h-3 rounded-full bg-zinc-600 group-hover/controls:bg-red-500 hover:!bg-red-600 transition-colors flex items-center justify-center focus:outline-none"
                  title="Close Project"
                />
                <div className="w-3 h-3 rounded-full bg-zinc-600 group-hover/controls:bg-yellow-500 transition-colors"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-600 group-hover/controls:bg-green-500 transition-colors"></div>
           </div>
           
           <div className="hidden sm:flex items-center space-x-2 text-zinc-500 text-xs font-mono">
               <span className="text-blue-400 font-bold">IDX</span>
               <span className="text-zinc-700">/</span>
               <span>{isLoading ? 'Generating...' : creation?.name || 'Untitled'}</span>
           </div>
        </div>
        
        {/* Center: Omni-search / Status */}
        <div className="hidden md:flex items-center px-3 py-1 bg-zinc-900 rounded border border-zinc-800 text-zinc-500 text-xs font-mono w-64 justify-between">
            <span className="flex items-center gap-2">
                <ServerIcon className="w-3 h-3" />
                {isLoading ? 'Compiling...' : 'localhost:3000'}
            </span>
            <div className="flex items-center space-x-1">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end space-x-3">
             {activeTab === 'code' && (
                <button 
                    onClick={handleRunCode}
                    className="flex items-center space-x-1 text-xs font-bold text-green-500 hover:text-green-400 transition-colors"
                >
                    <PlayIcon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Run</span>
                </button>
            )}
            
            <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-1 rounded text-zinc-500 hover:text-zinc-300 ${sidebarOpen ? 'bg-zinc-800 text-zinc-200' : ''}`}
                title="Toggle Sidebar"
            >
                <ViewColumnsIcon className="w-4 h-4" />
            </button>

             <button 
                onClick={handleExport}
                className="text-zinc-500 hover:text-blue-400 transition-colors"
                title="Export"
            >
                <ArrowDownTrayIcon className="w-4 h-4" />
            </button>
             <button 
                onClick={onReset}
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
             >
                New
            </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden bg-[#1e1e1e]">
        
        {/* Sidebar (Explorer) */}
        {sidebarOpen && (
            <div className="w-48 sm:w-64 bg-[#18181b] border-r border-zinc-800 flex flex-col flex-shrink-0 animate-in slide-in-from-left-5 duration-200">
                <div className="p-2 text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Explorer</div>
                
                {/* File Tree */}
                <div className="flex-1 overflow-y-auto">
                    <div className="mb-4">
                        <div className="flex items-center px-2 py-1 text-xs font-medium text-zinc-400 hover:bg-zinc-800/50 cursor-pointer">
                            <ChevronDownIcon className="w-3 h-3 mr-1" />
                            <span className="uppercase tracking-wide font-bold">Project</span>
                        </div>
                        <FileTreeItem label="index.html" icon={CodeBracketIcon} active={activeTab === 'code'} color="text-orange-500" />
                        <FileTreeItem label="readme.md" icon={DocumentIcon} />
                        <FileTreeItem label="preview" icon={EyeIcon} active={activeTab === 'preview'} color="text-blue-400" />
                    </div>

                    <div className="mb-4">
                         <div className="flex items-center px-2 py-1 text-xs font-medium text-zinc-400 hover:bg-zinc-800/50 cursor-pointer">
                            <ChevronDownIcon className="w-3 h-3 mr-1" />
                            <span className="uppercase tracking-wide font-bold">Tech Stack</span>
                        </div>
                        <FileTreeItem label="Tailwind CSS" icon={CubeIcon} color="text-cyan-400" />
                        <FileTreeItem label="React 19" icon={CubeIcon} color="text-blue-500" />
                        <FileTreeItem label="Heroicons" icon={CubeIcon} color="text-purple-400" />
                        <FileTreeItem label="Google Fonts" icon={CubeIcon} color="text-yellow-400" />
                    </div>
                </div>

                {/* Sidebar Footer */}
                <div className="p-2 border-t border-zinc-800">
                     <div className="flex items-center text-xs text-zinc-500">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                        Connected to Cloud
                     </div>
                </div>
            </div>
        )}

        {/* Editor/Preview Area */}
        <div className="flex-1 flex flex-col relative min-w-0 bg-[#1e1e1e]">
             {/* Tabs */}
             <div className="flex items-center bg-[#18181b] border-b border-zinc-800">
                 <button
                    onClick={() => setActiveTab('preview')}
                    className={`flex items-center space-x-2 px-4 py-2 text-xs border-r border-zinc-800 min-w-[100px] ${activeTab === 'preview' ? 'bg-[#1e1e1e] text-blue-400 border-t-2 border-t-blue-500' : 'text-zinc-500 hover:bg-[#1e1e1e]/50 hover:text-zinc-300'}`}
                 >
                     <EyeIcon className="w-3.5 h-3.5" />
                     <span>Preview</span>
                 </button>
                 <button
                    onClick={() => setActiveTab('code')}
                    className={`flex items-center space-x-2 px-4 py-2 text-xs border-r border-zinc-800 min-w-[100px] ${activeTab === 'code' ? 'bg-[#1e1e1e] text-orange-400 border-t-2 border-t-orange-500' : 'text-zinc-500 hover:bg-[#1e1e1e]/50 hover:text-zinc-300'}`}
                 >
                     <CodeBracketIcon className="w-3.5 h-3.5" />
                     <span>index.html</span>
                 </button>
             </div>

            {/* Content */}
            <div className="flex-1 relative overflow-hidden">
                {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 w-full bg-[#09090b]">
                        <div className="w-full max-w-2xl font-mono">
                            <div className="flex items-center space-x-3 mb-6 border-b border-zinc-800 pb-4">
                                <CpuChipIcon className="w-6 h-6 text-blue-500 animate-spin-slow" />
                                <span className="text-zinc-100 text-sm font-bold tracking-wider">GEMINI BUILD KERNEL // v3.1</span>
                            </div>

                            <div className="h-64 bg-black/50 rounded-lg border border-zinc-800 p-4 overflow-hidden relative shadow-inner">
                                <div className="absolute inset-0 bg-scanline pointer-events-none opacity-10"></div>
                                <TerminalLine text="Initializing virtual environment..." delay={100} />
                                <TerminalLine text="Analyzing visual input vectors..." delay={800} />
                                <TerminalLine text="Detecting UI components and layout constraints..." delay={1600} />
                                <TerminalLine text="Configuring Tailwind CSS compiler..." delay={2200} />
                                <TerminalLine text="Wiring tech stack dependencies..." delay={2800} />
                                <TerminalLine text="Synthesizing HTML5 structure..." delay={3400} />
                                <TerminalLine text="Injecting JavaScript interactivity modules..." delay={4200} />
                                <TerminalLine text="Hydrating application root..." delay={5000} />
                                <TerminalLine text="Build successful. Launching preview." delay={5800} />
                            </div>
                            
                            <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-600 uppercase tracking-widest">
                                <span>Memory: 64MB / 128MB</span>
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                                    Compiling
                                </span>
                            </div>
                        </div>
                    </div>
                ) : creation ? (
                    <>
                        {activeTab === 'preview' ? (
                            <div className="flex w-full h-full">
                                {/* Split View: Left Panel (Original Image) */}
                                {showSplitView && creation.originalImage && (
                                    <div className="w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-zinc-800 bg-[#0c0c0e] relative flex flex-col shrink-0">
                                        <div className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur text-zinc-400 text-[10px] font-mono uppercase px-2 py-1 rounded border border-zinc-800 flex items-center">
                                            <DocumentIcon className="w-3 h-3 mr-1" />
                                            Source Input
                                        </div>
                                        <div className="absolute top-4 right-4 z-10">
                                            <button 
                                                onClick={() => setShowSplitView(false)}
                                                className="bg-black/80 text-zinc-400 hover:text-white p-1 rounded border border-zinc-800"
                                                title="Close Split View"
                                            >
                                                <XMarkIcon className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div className="w-full h-full p-6 flex items-center justify-center overflow-hidden">
                                            {creation.originalImage.startsWith('data:application/pdf') ? (
                                                <PdfRenderer dataUrl={creation.originalImage} />
                                            ) : (
                                                <img 
                                                    src={creation.originalImage} 
                                                    alt="Original Input" 
                                                    className="max-w-full max-h-full object-contain shadow-xl border border-zinc-800/50 rounded"
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* App Preview Panel */}
                                <div className={`relative h-full bg-white transition-all duration-500 ${showSplitView && creation.originalImage ? 'w-full md:w-1/2 h-1/2 md:h-full' : 'w-full'}`}>
                                    <iframe
                                        title="Gemini Live Preview"
                                        srcDoc={executedCode}
                                        className="w-full h-full"
                                        sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin"
                                    />
                                    {!showSplitView && creation.originalImage && (
                                         <div className="absolute bottom-4 left-4 z-10">
                                            <button 
                                                onClick={() => setShowSplitView(true)}
                                                className="bg-zinc-900/80 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full border border-zinc-700 hover:border-blue-500 shadow-lg flex items-center gap-2 transition-all"
                                            >
                                                <ViewColumnsIcon className="w-3 h-3" />
                                                Show Source
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* Enhanced Code Editor */
                            <div className="flex w-full h-full overflow-hidden">
                                {/* Line Numbers */}
                                <div className="hidden sm:block w-12 bg-[#1e1e1e] border-r border-zinc-800 text-right pr-3 pt-4 text-zinc-600 font-mono text-sm select-none overflow-hidden">
                                    {lineNumbers.map(n => (
                                        <div key={n} className="leading-relaxed">{n}</div>
                                    ))}
                                </div>
                                {/* Editor Area */}
                                <div className="flex-1 relative">
                                    <textarea 
                                        ref={textareaRef}
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        className="w-full h-full bg-[#1e1e1e] text-zinc-300 font-mono text-sm p-4 outline-none resize-none leading-relaxed"
                                        spellCheck={false}
                                        autoComplete="off"
                                        autoCapitalize="off"
                                    />
                                </div>
                            </div>
                        )}
                    </>
                ) : null}
            </div>
            
            {/* Status Bar */}
            <div className="bg-[#007acc] text-white px-3 py-1 text-[10px] flex items-center justify-between shrink-0 font-mono">
                <div className="flex items-center space-x-3">
                    <span className="flex items-center gap-1"><BeakerIcon className="w-3 h-3" /> GEMINI-3-PRO-PREVIEW</span>
                    <span>•</span>
                    <span>Ready</span>
                </div>
                <div className="flex items-center space-x-3">
                    <span>HTML</span>
                    <span>UTF-8</span>
                    <span>Ln {lineNumbers.length}, Col 1</span>
                </div>
            </div>

        </div>
      </div>
      
      <style>{`
        .bg-scanline {
            background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
            background-size: 100% 4px;
        }
        .typing-effect {
            overflow: hidden;
            white-space: nowrap;
            animation: typing 0.5s steps(40, end);
        }
        @keyframes typing {
            from { width: 0 }
            to { width: 100% }
        }
      `}</style>
    </div>
  );
};
