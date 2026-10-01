import React from 'react';
import { Sparkles, History, BookOpen, Radio, Instagram, Share2, ExternalLink, Crown } from 'lucide-react';

interface NavbarProps {
  historyCount: number;
  onOpenHistory: () => void;
  onOpenPresets: () => void;
  onOpenShare: () => void;
  onOpenPricing: () => void;
  isProUser: boolean;
  isGenerating: boolean;
}

const INSTAGRAM_URL = 'https://www.instagram.com/hemant_yt__?stkn=cWlqdjM4emwyZmUw';

export const Navbar: React.FC<NavbarProps> = ({
  historyCount,
  onOpenHistory,
  onOpenPresets,
  onOpenShare,
  onOpenPricing,
  isProUser,
  isGenerating,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#0b0c10]/90 border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand identity & Clickable "MADE BY HEMANT" Instagram Badge */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 shadow-lg shadow-amber-500/20 text-white font-bold text-lg border border-amber-400/30">
            <span className="font-devanagari text-xl">वा</span>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0b0c10] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-white font-cinzel">
                Vaani Darshan
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/25">
                AI Voice Studio
              </span>

              {/* Clickable Instagram Link "MADE BY HEMANT" */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 px-3 py-0.8 rounded-full bg-gradient-to-r from-pink-500/20 via-rose-500/20 to-amber-500/20 border border-pink-500/40 hover:border-pink-400 text-[10px] font-extrabold uppercase tracking-wider text-pink-200 hover:text-white transition-all shadow-sm shadow-pink-500/10 cursor-pointer hover:scale-102"
                title="Connect with Hemant on Instagram"
              >
                <Instagram className="w-3 h-3 text-pink-400 group-hover:rotate-12 transition-transform" />
                <span>MADE BY HEMANT</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-70 group-hover:opacity-100" />
              </a>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              Hindi & American English Voice Engine • Motivational, Explainer & Spiritual Personas
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 font-mono">
            <Radio className={`w-3.5 h-3.5 ${isGenerating ? 'text-amber-400 animate-spin' : 'text-emerald-400'}`} />
            <span>{isGenerating ? 'Synthesizing...' : 'Gemini 3.8 Active'}</span>
          </div>

          {/* Preset Library Button */}
          <button
            onClick={onOpenPresets}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 text-xs font-medium text-neutral-200 transition-colors cursor-pointer"
            title="Browse wisdom & speech scripts"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Presets</span>
          </button>

          {/* Pricing & Subscription Button */}
          <button
            onClick={onOpenPricing}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isProUser
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/10'
            }`}
            title="View Subscription Plans & Commercial Licenses"
          >
            <Crown className={`w-3.5 h-3.5 ${isProUser ? 'text-emerald-400 fill-emerald-400' : 'text-amber-400 fill-amber-400'}`} />
            <span>{isProUser ? 'Pro Member' : 'Pricing'}</span>
          </button>

          {/* Social Share Button */}
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/15 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-500/30 text-xs font-semibold text-amber-300 transition-all cursor-pointer"
            title="Share with friends on WhatsApp, X, Instagram..."
          >
            <Share2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Share</span>
          </button>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/40 text-xs font-medium text-neutral-200 transition-colors cursor-pointer"
            title="Saved Voice Clips"
          >
            <History className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
