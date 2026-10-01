import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  Feather,
  Trash2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { CharacterVoice } from '../types';

interface TextStudioProps {
  text: string;
  onChangeText: (text: string) => void;
  selectedCharacter: CharacterVoice;
  modelType: 'flash-lite' | 'flash';
  onChangeModelType: (model: 'flash-lite' | 'flash') => void;
  onGenerate: (customStyle?: string) => void;
  isGenerating: boolean;
  onOpenPhilosophize: () => void;
  onOpenPresets: () => void;
}

export const TextStudio: React.FC<TextStudioProps> = ({
  text,
  onChangeText,
  selectedCharacter,
  modelType,
  onChangeModelType,
  onGenerate,
  isGenerating,
  onOpenPhilosophize,
  onOpenPresets,
}) => {
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [customStyle, setCustomStyle] = useState<string>('');

  const insertPacing = (snippet: string) => {
    onChangeText(text ? `${text} ${snippet} ` : `${snippet} `);
  };

  const handleClear = () => {
    onChangeText('');
  };

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const estimatedSeconds = Math.max(1, Math.round((words / 115) * 60));

  return (
    <div className="rounded-2xl bg-neutral-900/60 border border-white/10 p-5 shadow-xl relative backdrop-blur-sm space-y-4">
      {/* Studio Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Feather className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Hindi Script & Speech Studio
            </h3>
            <p className="text-[11px] text-neutral-400">
              Active Persona: <span className="text-amber-300 font-semibold">{selectedCharacter.hindiTitle}</span>
            </p>
          </div>
        </div>

        {/* AI & Preset Library actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPhilosophize}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-amber-500/20 hover:from-purple-500/30 hover:to-amber-500/30 text-amber-200 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer shadow-sm shadow-amber-500/5 hover:scale-102"
            title="Convert any idea into profound Hindi philosophical prose"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>AI Philosophize</span>
          </button>

          <button
            type="button"
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs transition-colors cursor-pointer"
            title="Browse timeless wisdom quotes"
          >
            <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">Preset Library</span>
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Type or paste your Hindi speech script here... (e.g. 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन... हे मानव, तुम्हारा अधिकार केवल निष्ठापूर्वक कर्म करने में है, उसके फल में नहीं।')"
          rows={5}
          className="w-full rounded-xl bg-neutral-950/80 border border-neutral-800 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50 p-4 text-sm sm:text-base text-neutral-100 placeholder:text-neutral-600 outline-none transition-all font-devanagari resize-y min-h-[140px] leading-relaxed shadow-inner"
        />

        {/* Clear Button */}
        {text && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute bottom-3 right-3 p-1.5 rounded-md bg-neutral-900/80 hover:bg-neutral-800 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
            title="Clear text"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Pacing & Rhythm helpers bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-neutral-500 text-[11px] font-medium mr-1">
            Add Pacing:
          </span>
          <button
            type="button"
            onClick={() => insertPacing('...')}
            className="px-2.5 py-1 rounded-md bg-neutral-950 hover:bg-neutral-800 border border-white/5 hover:border-amber-500/30 text-neutral-300 font-mono text-[11px] transition-colors cursor-pointer"
            title="Inserts a reflective pause"
          >
            + ... [Pause]
          </button>
          <button
            type="button"
            onClick={() => insertPacing('<breath>')}
            className="px-2.5 py-1 rounded-md bg-neutral-950 hover:bg-neutral-800 border border-white/5 hover:border-amber-500/30 text-neutral-300 font-mono text-[11px] transition-colors cursor-pointer"
            title="Inserts an audible breath"
          >
            + &lt;breath&gt; [Inhale]
          </button>
          <button
            type="button"
            onClick={() => insertPacing(',')}
            className="px-2.5 py-1 rounded-md bg-neutral-950 hover:bg-neutral-800 border border-white/5 hover:border-amber-500/30 text-neutral-300 font-mono text-[11px] transition-colors cursor-pointer"
            title="Inserts a comma pause"
          >
            + , [Comma]
          </button>
        </div>

        {/* Word Counter & Estimate */}
        <div className="flex items-center gap-3 text-[11px] text-neutral-400 font-mono">
          <span>{words} words • {chars} characters</span>
          <span className="text-amber-400/90 font-sans">
            Est. Duration: ~{estimatedSeconds}s
          </span>
        </div>
      </div>

      {/* Advanced Direction / Model Settings Accordion */}
      <div className="pt-2 border-t border-white/5">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span>Advanced Model Engine & Style Direction</span>
          {showAdvanced ? (
            <ChevronUp className="w-3.5 h-3.5 ml-1" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 ml-1" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-3 p-3.5 rounded-xl bg-neutral-950/70 border border-white/5 space-y-3 animate-in fade-in">
            {/* Model Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Gemini TTS Model:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div
                  onClick={() => onChangeModelType('flash')}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    modelType === 'flash'
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold font-mono">gemini-3.8-flash-tts</p>
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">Recommended</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Flagship expressive voice model with deep vocal nuances & emotional resonance
                  </p>
                </div>

                <div
                  onClick={() => onChangeModelType('flash-lite')}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    modelType === 'flash-lite'
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <p className="text-xs font-bold font-mono">gemini-3.8-flash-lite-tts</p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    High-efficiency standard TTS model (Auto-switches to Flash if rate-limited)
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Voice Style Prompt Direction */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Speech Style Prompt Direction:
                </label>
                <button
                  type="button"
                  onClick={() => setCustomStyle('')}
                  className="text-[10px] text-amber-400 hover:underline"
                >
                  Reset to Persona Default
                </button>
              </div>
              <input
                type="text"
                value={customStyle || selectedCharacter.stylePrompt}
                onChange={(e) => setCustomStyle(e.target.value)}
                placeholder="e.g. Deep resonant Indian sage with profound pauses and serene tone"
                className="w-full text-xs font-mono rounded-lg bg-neutral-900 border border-neutral-800 p-2.5 text-neutral-200 focus:border-amber-500/50 outline-none"
              />
              <p className="text-[10px] text-neutral-500 mt-1">
                Guides Gemini's acoustic prosody, inflection, rhythm, and tone.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Action Generate Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => onGenerate(customStyle || selectedCharacter.stylePrompt)}
          disabled={isGenerating || !text.trim()}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 hover:from-amber-400 hover:via-orange-500 hover:to-amber-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-amber-500/20 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating Philosophical Voice...</span>
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5" />
              <span>Generate Hindi Voice ({selectedCharacter.hindiTitle.split('•')[0].trim()})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
