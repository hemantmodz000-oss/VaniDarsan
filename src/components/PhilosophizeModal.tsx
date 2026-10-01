import React, { useState } from 'react';
import { X, Sparkles, Feather, Loader2, ArrowRight } from 'lucide-react';

interface PhilosophizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyText: (text: string, title?: string) => void;
}

export const PhilosophizeModal: React.FC<PhilosophizeModalProps> = ({
  isOpen,
  onClose,
  onApplyText,
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [theme, setTheme] = useState<string>('gita');
  const [tone, setTone] = useState<string>('deep');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedResult, setGeneratedResult] = useState<{
    philosophicalHindi: string;
    themeTitle: string;
    deliveryAdvice: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: 'Inner Calm & Chaos', text: 'How to remain peaceful and calm when life is chaotic?' },
    { label: 'Success & Failure', text: 'How to handle failure when all efforts seem in vain?' },
    { label: 'Anger & Forgiveness', text: 'How to master anger and let go of resentment?' },
    { label: 'Time & Vanity', text: 'Why is time fleeting, and what truly matters in life?' },
    { label: 'Desire & Contentment', text: 'How to break the endless trap of desire and find satisfaction?' },
  ];

  const philosophyThemes = [
    { id: 'gita', label: 'Bhagavad Gita', desc: 'Duty, Equanimity & Divine Consciousness' },
    { id: 'osho', label: 'Osho Zen & Witness', desc: 'Present Moment, Silence & Mindfulness' },
    { id: 'chanakya', label: 'Chanakya Neeti', desc: 'Strategic Realism, Self-Discipline & Duty' },
    { id: 'kabir', label: 'Kabir & Sufi Lore', desc: 'Simplicity, Spiritual Longing & Detachment' },
    { id: 'stoic', label: 'Stoic Wisdom', desc: 'Dichotomy of Control & Mental Mastery' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please provide a thought or question.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedResult(null);

    try {
      const response = await fetch('/api/philosophize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, theme, tone }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to transform script.');
      }

      setGeneratedResult({
        philosophicalHindi: data.philosophicalHindi,
        themeTitle: data.themeTitle || 'Philosophical Reflection',
        deliveryAdvice: data.deliveryAdvice || 'Listen with calm and deep pauses',
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during transformation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedResult) {
      onApplyText(generatedResult.philosophicalHindi, generatedResult.themeTitle);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#10121a] border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-amber-500/10 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                AI Philosophy Transformer
              </h3>
              <p className="text-xs text-neutral-400">
                Transform any thought into profound, poetic Hindi script with spoken pauses
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

        {/* Scrollable Content */}
        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
          {/* Quick Inspirations */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Quick Contemplation Ideas:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(q.text)}
                  className="text-xs px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/30 text-neutral-300 hover:text-amber-200 transition-colors cursor-pointer"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Input */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Your Thought, Dilemma, or Topic (English or Hindi):
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. How to find inner peace and master the mind in difficult times..."
              rows={3}
              className="w-full rounded-xl bg-neutral-950 border border-neutral-800 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/50 p-3 text-sm text-neutral-100 placeholder:text-neutral-600 outline-none transition-all resize-none"
            />
          </div>

          {/* School of Philosophy Selection */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Select Philosophical School:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {philosophyThemes.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                    theme === t.id
                      ? 'bg-amber-500/15 border-amber-500/60 text-amber-200'
                      : 'bg-neutral-900/50 hover:bg-neutral-900 border-neutral-800 text-neutral-300'
                  }`}
                >
                  <p className="text-xs font-bold">{t.label}</p>
                  <p className="text-[11px] text-neutral-400">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Generated Result Preview */}
          {generatedResult && (
            <div className="p-4 rounded-xl bg-neutral-950/90 border border-amber-500/40 shadow-inner space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  {generatedResult.themeTitle}
                </span>
                <span className="text-[11px] text-neutral-400">
                  💡 {generatedResult.deliveryAdvice}
                </span>
              </div>
              <p className="text-sm sm:text-base font-devanagari text-neutral-100 leading-relaxed italic border-l-2 border-amber-400 pl-3 py-1">
                "{generatedResult.philosophicalHindi}"
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {!generatedResult ? (
            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-semibold shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Drafting Script...</span>
                </>
              ) : (
                <>
                  <Feather className="w-4 h-4" />
                  <span>Transform into Hindi Philosophy</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleApply}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <span>Use in Voice Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
