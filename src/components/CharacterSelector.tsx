import React, { useState } from 'react';
import { CharacterVoice, VoiceCategory } from '../types';
import { PHILOSOPHY_CHARACTERS } from '../data/characters';
import { Volume2, CheckCircle2, Sparkles, Loader2, Globe, Flame, Lightbulb, BookMarked, Film } from 'lucide-react';

interface CharacterSelectorProps {
  selectedCharacter: CharacterVoice;
  onSelectCharacter: (char: CharacterVoice) => void;
  onPreviewVoice: (char: CharacterVoice) => void;
  previewingId: string | null;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  selectedCharacter,
  onSelectCharacter,
  onPreviewVoice,
  previewingId,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Voices', icon: Sparkles, count: PHILOSOPHY_CHARACTERS.length },
    { id: 'motivational', label: 'Motivational (Hindi)', icon: Flame, count: PHILOSOPHY_CHARACTERS.filter((c) => c.category === 'motivational').length },
    { id: 'explainer', label: 'Explainer & Tech (Hindi)', icon: Lightbulb, count: PHILOSOPHY_CHARACTERS.filter((c) => c.category === 'explainer').length },
    { id: 'spiritual', label: 'Spiritual & Philosophy', icon: BookMarked, count: PHILOSOPHY_CHARACTERS.filter((c) => c.category === 'spiritual').length },
    { id: 'storytelling', label: 'Storytelling & Lore', icon: Film, count: PHILOSOPHY_CHARACTERS.filter((c) => c.category === 'storytelling').length },
    { id: 'american-english', label: 'American English (US)', icon: Globe, count: PHILOSOPHY_CHARACTERS.filter((c) => c.category === 'american-english').length },
  ];

  const filteredCharacters = filterCategory === 'all'
    ? PHILOSOPHY_CHARACTERS
    : PHILOSOPHY_CHARACTERS.filter((c) => c.category === filterCategory);

  return (
    <div className="space-y-4">
      {/* Category Header & Filter Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Choose Voice Category & Persona
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400">
              {filteredCharacters.length} Voices
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Select high-impact Hindi motivational speakers, documentary explainers, spiritual gurus, or US American voices
          </p>
        </div>

        {/* Filter Pills with Icons & Count */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = filterCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/10'
                    : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-neutral-500'}`} />
                <span>{cat.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-950/60 font-mono text-neutral-400">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Character Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredCharacters.map((char) => {
          const isSelected = selectedCharacter.id === char.id;
          const isPreviewing = previewingId === char.id;

          return (
            <div
              key={char.id}
              onClick={() => onSelectCharacter(char)}
              className={`group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? `bg-gradient-to-b ${char.colorScheme.bg} border-amber-400/80 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40`
                  : 'bg-neutral-900/60 hover:bg-neutral-900 border-neutral-800/80 hover:border-neutral-700'
              }`}
            >
              {/* Category Badge & Language Tag */}
              <div className="flex items-center justify-between gap-1 mb-2.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-950/80 text-amber-300 border border-amber-500/20 uppercase tracking-wider">
                  {char.categoryBadge}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    char.language === 'en'
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                      : 'bg-orange-500/15 text-orange-300 border border-orange-500/30'
                  }`}>
                    {char.language === 'en' ? 'US English' : 'Hindi'}
                  </span>

                  {isSelected && (
                    <div className="text-amber-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                {/* Avatar and Title */}
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-2xl p-2 rounded-xl bg-neutral-950/70 border border-white/5 flex items-center justify-center shrink-0 shadow-inner">
                    {char.avatarIcon}
                  </div>
                  <div className="pr-2">
                    <h3 className="font-semibold text-sm text-neutral-100 leading-snug group-hover:text-amber-200 transition-colors">
                      {char.hindiTitle}
                    </h3>
                    <p className={`text-[11px] font-medium ${char.colorScheme.accent}`}>
                      {char.role}
                    </p>
                  </div>
                </div>

                {/* Tone Tag */}
                <div className="mb-2">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-neutral-950/80 text-neutral-300 border border-white/5">
                    {char.tone}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-300/90 leading-relaxed mb-3 line-clamp-2">
                  {char.description}
                </p>
              </div>

              <div>
                {/* Voice specs tags & preview button */}
                <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2.5 border-t border-white/5 mt-auto">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-neutral-950/80 border border-white/5 text-neutral-300">
                    Engine: {char.geminiVoice}
                  </span>

                  {/* Sample Preview button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPreviewVoice(char);
                    }}
                    disabled={isPreviewing}
                    className="flex items-center gap-1 text-[11px] font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-md transition-colors border border-amber-500/20 cursor-pointer disabled:opacity-60"
                    title="Listen to voice sample"
                  >
                    {isPreviewing ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Playing...</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3" />
                        <span>Sample</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
