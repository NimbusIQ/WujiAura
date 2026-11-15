/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { ClockIcon, ArrowRightIcon, DocumentIcon, PhotoIcon } from '@heroicons/react/24/outline';

export interface Creation {
  id: string;
  name: string;
  html: string;
  originalImage?: string; // Base64 data URL
  timestamp: Date;
}

interface CreationHistoryProps {
  history: Creation[];
  onSelect: (creation: Creation) => void;
}

export const CreationHistory: React.FC<CreationHistoryProps> = ({ history, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex items-center space-x-4 mb-6 px-2">
        <div className="p-1.5 bg-[#1c2521] border border-[#2d3a34] sharp-edge">
          <ClockIcon className="w-4 h-4 text-teal-500" />
        </div>
        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Lab Archive</h2>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-[#2d3a34] to-transparent"></div>
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 bg-teal-500 sharp-edge"></div>
          <div className="w-1.5 h-1.5 bg-slate-800 sharp-edge"></div>
        </div>
      </div>
      
      {/* Horizontal Scroll Container for Compact Layout */}
      <div className="flex overflow-x-auto space-x-8 pb-6 px-2 scrollbar-hide scientific-grid">
        {history.map((item) => {
          const isPdf = item.originalImage?.startsWith('data:application/pdf');
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="group flex-shrink-0 relative flex flex-col text-left w-60 h-36 premium-card sharp-edge transition-all duration-500 hover:border-teal-500 hover:translate-y-[-4px] bg-[#141b18]/80 backdrop-blur-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-6 flex flex-col h-full relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 bg-[#0a0f0d] border border-[#2d3a34] sharp-edge group-hover:border-teal-500/50 transition-all shadow-inner">
                      {isPdf ? (
                          <DocumentIcon className="w-4 h-4 text-slate-500 group-hover:text-teal-500" />
                      ) : item.originalImage ? (
                          <PhotoIcon className="w-4 h-4 text-slate-500 group-hover:text-teal-500" />
                      ) : (
                          <DocumentIcon className="w-4 h-4 text-slate-500 group-hover:text-teal-500" />
                      )}
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-slate-600 group-hover:text-teal-500/70 tracking-tighter block">
                      {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[8px] font-bold text-slate-700 uppercase tracking-widest block mt-1">LOG_ID: {item.id.slice(0, 4)}</span>
                  </div>
                </div>
                
                <div className="mt-auto">
                  <h3 className="text-[11px] font-black text-slate-300 group-hover:text-white truncate uppercase tracking-[0.1em]">
                    {item.name}
                  </h3>
                  <div className="flex items-center space-x-3 mt-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-8px] group-hover:translate-x-0">
                    <span className="text-[9px] font-black text-teal-500 uppercase tracking-[0.2em]">Restore Matrix</span>
                    <div className="w-4 h-[1px] bg-teal-500"></div>
                    <ArrowRightIcon className="w-3 h-3 text-teal-500" />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};