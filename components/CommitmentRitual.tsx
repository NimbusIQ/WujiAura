import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle, 
  Sparkles, 
  Sprout, 
  Check,
  ShoppingBag,
  Droplets,
  Moon,
  ShieldCheck
} from 'lucide-react';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
  element?: string;
}

interface CommitmentRitualProps {
  actions: ActionItem[];
  commitments: string[];
  onCommit: (id: string) => void;
}

export const CommitmentRitual: React.FC<CommitmentRitualProps> = ({ actions, commitments, onCommit }) => {
  if (!actions || actions.length === 0) {
    return (
      <div className="py-12 glass-panel flex flex-col items-center justify-center text-center px-8 gap-3 border-dashed border-cyan-500/30 bg-[#04141c]/60">
        <Sprout className="w-9 h-9 text-cyan-400 animate-float" />
        <p className="text-xs font-mono text-cyan-300/80">
          Waiting for diagnostic telemetry to prescribe herbal congees & restorative hydration rituals...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-950/80 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-mono font-bold text-white leading-tight">
              Prescribed Regimens & The Rod T Nourishment
            </h4>
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              Hydration &bull; Restorative Sleep &bull; Nourishing Congees
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-950/70 rounded-full border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            {commitments.length}/{actions.length} Completed
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((act) => {
          const isDone = commitments.includes(act.id);
          return (
            <motion.div
              key={act.id}
              whileHover={{ y: -2 }}
              onClick={() => onCommit(act.id)}
              className={`p-5 rounded-2xl cursor-pointer border transition-all relative overflow-hidden flex flex-col justify-between gap-3 ${
                isDone
                  ? 'bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                  : 'bg-[#051820]/75 border-cyan-500/20 hover:border-cyan-400/40 hover:bg-[#07242e]/85'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 rounded-xl bg-slate-900/80 border border-cyan-500/20 shadow-inner">
                    {act.emoji || '🍵'}
                  </span>
                  <div>
                    <h5 className={`text-sm font-bold tracking-wide transition-colors ${
                      isDone ? 'text-emerald-300 line-through' : 'text-white'
                    }`}>
                      {act.title}
                    </h5>
                    {act.element && (
                      <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider">
                        {act.element} Element Formula
                      </span>
                    )}
                  </div>
                </div>

                <div className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all ${
                  isDone 
                    ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_10px_#10b981]' 
                    : 'border-cyan-500/30 text-transparent hover:border-cyan-400'
                }`}>
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              <p className="text-xs text-slate-300 font-light leading-relaxed pl-1">
                {act.description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-cyan-500/10 text-[10px] font-mono text-slate-400">
                <span className="flex items-center gap-1 text-cyan-300">
                  <ShoppingBag className="w-3 h-3 text-cyan-400" />
                  The Rod T Organic Stock
                </span>
                <span className={isDone ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {isDone ? 'Harmonized' : 'Click to Commit'}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
