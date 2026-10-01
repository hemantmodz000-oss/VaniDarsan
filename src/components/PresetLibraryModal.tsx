import React from 'react';
import { X, BookOpen, ArrowRight } from 'lucide-react';
import { PRESET_PHILOSOPHICAL_QUOTES } from '../data/presetQuotes';
import { PHILOSOPHY_CHARACTERS } from '../data/characters';
import { PresetQuote, CharacterVoice } from '../types';

interface PresetLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuote: (quote: PresetQuote, character: CharacterVoice) => void;
}

export const PresetLibraryModal: React.FC<PresetLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectQuote,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#10121a] border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-amber-500/10 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Curated Philosophical Library
              </h3>
              <p className="text-xs text-neutral-400">
                Timeless teachings from the Bhagavad Gita, Kabir, Osho, Upanishads, and Chanakya
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quotes Grid */}
        <div className="space-y-3 overflow-y-auto pr-1 flex-1">
          {PRESET_PHILOSOPHICAL_QUOTES.map((quote) => {
            const matchedChar =
              PHILOSOPHY_CHARACTERS.find((c) => c.id === quote.recommendedCharacterId) ||
              PHILOSOPHY_CHARACTERS[0];

            return (
              <div
                key={quote.id}
                className="group p-4 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {quote.category}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {quote.source}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-neutral-200">
                    {quote.title}
                  </h4>

                  <p className="text-xs sm:text-sm font-devanagari text-neutral-300 italic line-clamp-2 leading-relaxed">
                    "{quote.hindiText}"
                  </p>

                  {quote.meaning && (
                    <p className="text-[11px] text-neutral-400 flex items-center gap-1">
                      <span className="text-amber-400 font-medium">Essence:</span> {quote.meaning}
                    </p>
                  )}
                </div>

                {/* Recommended Character & Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <span className="text-lg">{matchedChar.avatarIcon}</span>
                    <span className="text-[11px] hidden sm:inline">
                      {matchedChar.hindiTitle.split('•')[0].trim()}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onSelectQuote(quote, matchedChar);
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all group-hover:scale-105 cursor-pointer"
                  >
                    <span>Load Script</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
