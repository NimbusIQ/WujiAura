
import React from 'react';
import { motion } from 'motion/react';
import { Sliders, Camera, Film, Palette, Maximize, Loader2 } from 'lucide-react';
import { VisualOptions } from '../services/gemini';

interface VisualSettingsProps {
  options: VisualOptions;
  onChange: (options: VisualOptions) => void;
  isGenerating?: boolean;
}

export const VisualSettings: React.FC<VisualSettingsProps> = ({ options, onChange, isGenerating }) => {
  const styles = ['Artistic', 'Photorealistic', 'Ethereal', 'Anatomical', 'Cyberpunk'];
  const moods = ['Healing', 'Energetic', 'Calm', 'Mystical'];
  const ratios = ['1:1', '16:9', '9:16', '4:3'];

  return (
    <div className="space-y-8 p-6 bg-white rounded-[32px] border border-stone-100 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sliders className="w-5 h-5 text-[#c5a059]" />
          <h2 className="text-lg font-serif font-bold text-stone-800 uppercase tracking-widest">Aura Optics</h2>
        </div>
        {isGenerating && <Loader2 className="w-4 h-4 text-[#c5a059] animate-spin" />}
      </div>

      <div className="space-y-6">
        {/* Style Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">
            <Palette className="w-3 h-3" />
            Visual Style
          </div>
          <div className="flex flex-wrap gap-2">
            {styles.map(style => (
              <button
                key={style}
                onClick={() => onChange({ ...options, style })}
                className={`px-4 py-2 rounded-full text-[11px] transition-all border ${
                  options.style === style 
                    ? 'bg-stone-900 border-stone-900 text-white shadow-lg' 
                    : 'bg-white border-stone-100 text-stone-500 hover:border-stone-200'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Mood Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">
            <Camera className="w-3 h-3" />
            Energy Mood
          </div>
          <div className="flex flex-wrap gap-2">
            {moods.map(mood => (
              <button
                key={mood}
                onClick={() => onChange({ ...options, mood })}
                className={`px-4 py-2 rounded-full text-[11px] transition-all border ${
                  options.mood === mood 
                    ? 'bg-[#c5a059] border-[#c5a059] text-white shadow-lg' 
                    : 'bg-white border-stone-100 text-stone-500 hover:border-stone-200'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">
            <Maximize className="w-3 h-3" />
            Composition
          </div>
          <div className="grid grid-cols-4 gap-2">
            {ratios.map(ratio => (
              <button
                key={ratio}
                //@ts-ignore
                onClick={() => onChange({ ...options, aspectRatio: ratio })}
                className={`py-3 rounded-2xl text-[10px] font-serif border transition-all ${
                  options.aspectRatio === ratio
                    ? 'bg-stone-50 border-stone-200 text-stone-900 font-bold'
                    : 'bg-white border-stone-100 text-stone-400'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-stone-50">
          <div className="flex items-center gap-3 text-stone-400 text-[10px] italic">
            <Film className="w-3 h-3" />
            Video synthesis consumes high Qi (Compute Tokens).
          </div>
        </div>
      </div>
    </div>
  );
};
