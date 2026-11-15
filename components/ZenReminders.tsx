import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bell, Clock, Calendar, AlertCircle } from 'lucide-react';

interface Reminder {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
}

export const ZenReminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('aura_zen_reminders');
    return saved ? JSON.parse(saved) : [
      { id: '1', time: '07:00', label: 'Morning Qi Activation (Stomach Meridian)', enabled: true },
      { id: '13:00', time: '13:00', label: 'Mid-day Herbal Tea & Water Hydration', enabled: true },
      { id: '21:00', time: '21:00', label: 'San Jiao Restorative Congee & Rest', enabled: false },
    ];
  });

  useEffect(() => {
    localStorage.setItem('aura_zen_reminders', JSON.stringify(reminders));
  }, [reminders]);

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 px-2">
        <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-mono font-bold text-white uppercase tracking-widest">Circadian Chrono-Schedule</h2>
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">Solar Term Bioclock Synchronization</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {reminders.map((reminder) => (
          <motion.div
            key={reminder.id}
            whileHover={{ scale: 1.01 }}
            className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
              reminder.enabled 
                ? 'bg-[#061e27]/90 border-cyan-500/40 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                : 'bg-[#04141c]/60 border-cyan-950/40 text-slate-400 hover:border-cyan-500/20'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl border ${
                reminder.enabled 
                  ? 'bg-cyan-950/90 border-cyan-400/40 text-cyan-300' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-500'
              }`}>
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${
                  reminder.enabled ? 'text-cyan-400' : 'text-slate-500'
                }`}>
                  {reminder.time} CST
                </span>
                <h3 className="text-sm font-medium text-slate-100">{reminder.label}</h3>
              </div>
            </div>

            <button
              onClick={() => toggleReminder(reminder.id)}
              className={`p-2 rounded-xl border transition-all ${
                reminder.enabled 
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white border-cyan-300/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                  : 'bg-slate-900 border-slate-800 text-slate-600 hover:text-slate-300'
              }`}
            >
              <Bell className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="p-4 bg-cyan-950/30 rounded-2xl flex items-start gap-3 border border-cyan-500/20">
        <AlertCircle className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
        <p className="text-[11px] font-mono text-cyan-200/80 leading-relaxed italic">
          Master Yu synchronizes your schedule with 24 Solar Terms (Jie Qi). Reminders activate sensory meridian cues to maintain unbroken Qi flow.
        </p>
      </div>
    </div>
  );
};
