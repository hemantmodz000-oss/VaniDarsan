import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  ExternalLink,
  MessageCircle,
  Twitter,
  Linkedin,
  Instagram,
  Sparkles,
} from 'lucide-react';
import { CharacterVoice } from '../types';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCharacter: CharacterVoice;
  currentText: string;
}

const INSTAGRAM_URL = 'https://www.instagram.com/hemant_yt__?stkn=cWlqdjM4emwyZmUw';

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  activeCharacter,
  currentText,
}) => {
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://vaanidarshan.app';
  const shareTitle = `Listen to this engaging ${activeCharacter.language === 'en' ? 'American English' : 'Hindi'} voiceover (${activeCharacter.hindiTitle}) on Vaani Darshan - Made by Hemant!`;
  const snippet = currentText ? `"${currentText.slice(0, 140)}${currentText.length > 140 ? '...' : ''}"` : '';

  const shareTextFormatted = `${shareTitle}\n\n${snippet}\n\nBuilt by Hemant: ${INSTAGRAM_URL}\nTry it here: ${currentUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyFullPost = async () => {
    try {
      await navigator.clipboard.writeText(shareTextFormatted);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vaani Darshan - Built by Hemant',
          text: shareTextFormatted,
          url: currentUrl,
        });
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopyFullPost();
    }
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTextFormatted)}`,
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'bg-neutral-800 hover:bg-neutral-700 text-white',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle + '\n' + snippet)}&url=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: 'Telegram',
      icon: Send,
      color: 'bg-sky-600 hover:bg-sky-500 text-white',
      url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTextFormatted)}`,
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-600 text-white',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#10121a] border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-amber-500/10 overflow-hidden flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Share Vaani Darshan
              </h3>
              <p className="text-xs text-neutral-400">
                Share this voiceover and voice generator with friends
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

        {/* Creator Highlight Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              H
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                  MADE BY HEMANT
                </span>
                <Sparkles className="w-3 h-3 text-amber-400" />
              </div>
              <p className="text-[11px] text-neutral-300">
                Creator & Developer • @hemant_yt__
              </p>
            </div>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Follow</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
          </a>
        </div>

        {/* Preview of Share Content */}
        <div className="p-3 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-neutral-400">
            <span>Voice: <strong className="text-neutral-200">{activeCharacter.hindiTitle}</strong></span>
            <span className="font-mono text-[10px] text-amber-400">{activeCharacter.categoryBadge}</span>
          </div>
          {snippet && (
            <p className="text-xs text-neutral-300 italic line-clamp-2">
              {snippet}
            </p>
          )}
        </div>

        {/* Social Platforms Grid */}
        <div>
          <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Share via Platforms:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {socialLinks.map((platform) => {
              const Icon = platform.icon;
              return (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-all shadow-sm ${platform.color} cursor-pointer hover:scale-102`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{platform.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick Copy Link & Full Post */}
        <div className="pt-2 border-t border-white/5 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 text-xs font-mono bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-neutral-400 select-all outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-amber-500/40 text-xs font-semibold transition-colors shrink-0 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={handleCopyFullPost}
              className="text-xs text-amber-400 hover:text-amber-300 underline flex items-center gap-1 cursor-pointer"
            >
              {copiedQuote ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedQuote ? 'Full Post Copied!' : 'Copy Formatted Text & Instagram Link'}</span>
            </button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="text-xs px-3 py-1 rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 font-medium cursor-pointer"
              >
                Device Share
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
