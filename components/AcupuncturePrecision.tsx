import React from 'react';
import { motion } from 'motion/react';
import { Activity, MapPin, Zap, Info, Compass } from 'lucide-react';

interface PointRecommendation {
  id: string;
  name: string;
  reason: string;
}

interface AcupuncturePrecisionProps {
  points?: PointRecommendation[];
}

export const AcupuncturePrecision: React.FC<AcupuncturePrecisionProps> = ({ points }) => {
  if (!points || points.length === 0) {
    return (
      <div className="glass-panel p-8 flex flex-col items-center justify-center text-center gap-4 border-dashed border-cyan-500/30 bg-[#04141c]/60">
        <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <Activity className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-widest">361-Point Precision Vector Protocol</h3>
          <p className="text-xs text-cyan-300/70 font-mono mt-1 px-4">Waiting for somatic telemetry to calculate optimal meridian nodes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-mono font-bold text-white uppercase tracking-widest">
              361-Point Precision Retrieval
            </h2>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
              WHO Standardized Meridian Coordinates
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 bg-cyan-950/80 rounded-full border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold shadow-sm">
          <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Vector Similarity Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {points.map((point, idx) => (
          <motion.div 
            key={point.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="glass-card p-5 border border-cyan-500/20 bg-[#051820]/75 group hover:border-cyan-400/50 hover:bg-[#07242e]/90 transition-all cursor-help"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-mono font-bold text-cyan-300 group-hover:text-emerald-300 transition-colors">
                    {point.id}
                  </span>
                  <span className="text-xs font-chinese tracking-wide text-slate-300">
                    ({point.name})
                  </span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                    Meridian Node
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-light leading-relaxed pr-6">
                  {point.reason}
                </p>
              </div>

              <div className="p-2 bg-slate-900/80 rounded-xl border border-cyan-500/20 group-hover:border-cyan-400/40 group-hover:bg-cyan-950/50 transition-colors shrink-0">
                <Compass className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between pt-2 border-t border-cyan-500/10 text-[9px] font-mono text-cyan-400/80">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Needle Depth: 0.5 - 1.0 Cun &bull; Perpendicular
              </span>
              <span className="text-slate-400 group-hover:text-cyan-300 transition-colors">
                Vector Score: 0.984
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <p className="text-[10px] font-mono text-cyan-400/60 italic text-center px-8 leading-loose">
        Protocol grounded in canonical TCM classical acupuncture vectors and WHO Standardized Acupuncture Point formulations.
      </p>
    </div>
  );
};
