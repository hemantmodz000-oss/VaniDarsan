import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CharacterSelector } from './components/CharacterSelector';
import { TextStudio } from './components/TextStudio';
import { AudioPlayer } from './components/AudioPlayer';
import { PhilosophizeModal } from './components/PhilosophizeModal';
import { PresetLibraryModal } from './components/PresetLibraryModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SocialShareModal } from './components/SocialShareModal';
import { PricingModal } from './components/PricingModal';
import { PHILOSOPHY_CHARACTERS } from './data/characters';
import { PRESET_PHILOSOPHICAL_QUOTES } from './data/presetQuotes';
import { CharacterVoice, AudioHistoryItem, PresetQuote } from './types';
import { AlertCircle, Flame, Info, Sparkles, Instagram, ExternalLink, Share2, Globe, Lightbulb, Crown } from 'lucide-react';

const STORAGE_KEY = 'vaani_darshan_history_v1';
const PRO_STORAGE_KEY = 'vaani_darshan_is_pro_v1';
const INSTAGRAM_URL = 'https://www.instagram.com/hemant_yt__?stkn=cWlqdjM4emwyZmUw';

export default function App() {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterVoice>(
    PHILOSOPHY_CHARACTERS[0]
  );
  const [text, setText] = useState<string>(
    PRESET_PHILOSOPHICAL_QUOTES[0].hindiText
  );
  const [modelType, setModelType] = useState<'flash-lite' | 'flash'>('flash');

  // Audio Player State
  const [currentAudioBase64, setCurrentAudioBase64] = useState<string | null>(null);
  const [currentMimeType, setCurrentMimeType] = useState<string>('audio/wav');
  const [playedCharacter, setPlayedCharacter] = useState<CharacterVoice>(
    PHILOSOPHY_CHARACTERS[0]
  );
  const [playedText, setPlayedText] = useState<string>('');
  const [activeModelUsed, setActiveModelUsed] = useState<string>('gemini-3.8-flash-tts');

  // Loading & Preview States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals & Drawers
  const [isPhilosophizeOpen, setIsPhilosophizeOpen] = useState<boolean>(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isPricingOpen, setIsPricingOpen] = useState<boolean>(false);

  // Pro Subscription State
  const [isProUser, setIsProUser] = useState<boolean>(() => {
    try {
      return localStorage.getItem(PRO_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const handleUpgradeToPro = () => {
    setIsProUser(true);
    try {
      localStorage.setItem(PRO_STORAGE_KEY, 'true');
    } catch (e) {
      console.warn('Pro state save failed:', e);
    }
  };

  // Local History
  const [history, setHistory] = useState<AudioHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save history to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 30)));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [history]);

  // Main Audio Generation
  const handleGenerateAudio = async (customStyle?: string) => {
    if (!text.trim()) {
      setErrorMessage('Please enter text before generating speech.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          voiceName: selectedCharacter.geminiVoice,
          characterStyle: customStyle || selectedCharacter.stylePrompt,
          modelType,
          characterId: selectedCharacter.id,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate audio.');
      }

      setCurrentAudioBase64(data.audioBase64);
      setCurrentMimeType(data.mimeType || 'audio/wav');
      setPlayedCharacter(selectedCharacter);
      setPlayedText(text.trim());
      setActiveModelUsed(data.modelUsed || 'Gemini 3.8 TTS');

      // Add to history
      const newItem: AudioHistoryItem = {
        id: String(Date.now()),
        timestamp: Date.now(),
        text: text.trim(),
        characterId: selectedCharacter.id,
        characterName: selectedCharacter.hindiTitle,
        voiceName: selectedCharacter.geminiVoice,
        audioBase64: data.audioBase64,
        mimeType: data.mimeType || 'audio/wav',
        language: selectedCharacter.language,
      };

      setHistory((prev) => [newItem, ...prev]);
    } catch (err: any) {
      console.error('Audio Generation Error:', err);
      setErrorMessage(
        err.message || 'An error occurred during audio synthesis. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Preview character sample quote
  const handlePreviewVoice = async (char: CharacterVoice) => {
    setPreviewingId(char.id);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: char.sampleQuote,
          voiceName: char.geminiVoice,
          characterStyle: char.stylePrompt,
          modelType: 'flash',
          characterId: char.id,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Unable to stream sample audio.');
      }

      setCurrentAudioBase64(data.audioBase64);
      setCurrentMimeType(data.mimeType || 'audio/wav');
      setPlayedCharacter(char);
      setPlayedText(char.sampleQuote);
      setActiveModelUsed(data.modelUsed || 'gemini-3.8-flash-tts');
    } catch (err: any) {
      console.error('Preview error:', err);
      setErrorMessage(`Sample playback failed: ${err.message}`);
    } finally {
      setPreviewingId(null);
    }
  };

  // Select quote from Preset Library
  const handleSelectPresetQuote = (quote: PresetQuote, character: CharacterVoice) => {
    setText(quote.hindiText);
    setSelectedCharacter(character);
  };

  // Play item from history drawer
  const handlePlayHistoryItem = (item: AudioHistoryItem) => {
    setCurrentAudioBase64(item.audioBase64);
    setCurrentMimeType(item.mimeType);
    const matchedChar =
      PHILOSOPHY_CHARACTERS.find((c) => c.id === item.characterId) || selectedCharacter;
    setPlayedCharacter(matchedChar);
    setPlayedText(item.text);
    setIsHistoryOpen(false);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#eaeaea] flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Navbar with MADE BY HEMANT Instagram link & Share button */}
      <Navbar
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        isProUser={isProUser}
        isGenerating={isGenerating}
      />

      {/* Main Studio Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/40 via-neutral-900/80 to-stone-950/60 border border-amber-500/20 p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl space-y-3.5">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Next-Gen Speech Studio • Hindi & American English</span>
              </div>

              {/* Prominent MADE BY HEMANT Instagram link */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/20 via-rose-500/20 to-amber-500/20 border border-pink-500/40 hover:border-pink-400 text-pink-200 hover:text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer hover:scale-102"
                title="Follow Hemant on Instagram"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-400 group-hover:rotate-12 transition-transform" />
                <span>MADE BY HEMANT</span>
                <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100" />
              </a>

              {/* Pricing Button shortcut */}
              <button
                onClick={() => setIsPricingOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-xs font-semibold text-amber-300 transition-colors cursor-pointer"
              >
                <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>{isProUser ? 'Pro Member' : 'Pricing Plans'}</span>
              </button>

              {/* Share Button shortcut */}
              <button
                onClick={() => setIsShareOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-300 transition-colors cursor-pointer"
              >
                <Share2 className="w-3 h-3 text-amber-400" />
                <span>Share App</span>
              </button>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug font-cinzel">
              Powerful Voice Generator with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200">
                Motivational, Explainer & Spiritual Personas
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-3xl">
              Generate impactful, emotional, and authentic voiceovers across 5 distinct categories: <strong className="text-white">Motivational Speeches</strong>, <strong className="text-white">Documentary & Tech Explainers</strong>, <strong className="text-white">Vedic & Spiritual Gurus</strong>, <strong className="text-white">Dramatic Storytelling</strong>, and <strong className="text-sky-300">American English Accents</strong>.
            </p>
          </div>
        </section>

        {/* Global Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-red-400 hover:text-white underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Character Selector Section */}
        <section>
          <CharacterSelector
            selectedCharacter={selectedCharacter}
            onSelectCharacter={setSelectedCharacter}
            onPreviewVoice={handlePreviewVoice}
            previewingId={previewingId}
          />
        </section>

        {/* Two-Column Studio Layout: Script Studio (Left) & Audio Player (Right) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Script Editor */}
          <div className="lg:col-span-7 space-y-4">
            <TextStudio
              text={text}
              onChangeText={setText}
              selectedCharacter={selectedCharacter}
              modelType={modelType}
              onChangeModelType={setModelType}
              onGenerate={handleGenerateAudio}
              isGenerating={isGenerating}
              onOpenPhilosophize={() => setIsPhilosophizeOpen(true)}
              onOpenPresets={() => setIsPresetsOpen(true)}
            />
          </div>

          {/* Right Column: Audio Stage & Player */}
          <div className="lg:col-span-5 space-y-4">
            <AudioPlayer
              audioBase64={currentAudioBase64}
              mimeType={currentMimeType}
              character={playedCharacter}
              text={playedText}
              modelUsed={activeModelUsed}
              onOpenShare={() => setIsShareOpen(true)}
            />

            {/* Practical Voiceover Tips Card */}
            <div className="p-4 rounded-2xl bg-neutral-900/40 border border-white/5 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>Tips for Generating Maximum Vocal Impact:</span>
              </div>
              <ul className="text-[11px] text-neutral-400 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-neutral-200">For Motivational Voices:</strong> Use exclamation marks and short fiery phrases for maximum adrenaline.
                </li>
                <li>
                  <strong className="text-neutral-200">For Documentary & Explainers:</strong> Use ellipses <code className="text-amber-300">...</code> to create curiosity and dramatic pauses before key revelations.
                </li>
                <li>
                  <strong className="text-neutral-200">For American English:</strong> Type natural conversational English sentences or Hollywood trailer lines.
                </li>
                <li>
                  <strong className="text-neutral-200">For Spiritual & Guru Voices:</strong> Add <code className="text-amber-300">&lt;breath&gt;</code> for soothing inhalation cues and meditative pace.
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Modals & Drawers */}
      <SocialShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        activeCharacter={playedCharacter}
        currentText={playedText || text}
      />

      <PhilosophizeModal
        isOpen={isPhilosophizeOpen}
        onClose={() => setIsPhilosophizeOpen(false)}
        onApplyText={(newText) => setText(newText)}
      />

      <PresetLibraryModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectQuote={handleSelectPresetQuote}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onPlayItem={handlePlayHistoryItem}
        onDeleteItem={handleDeleteHistoryItem}
        onClearAll={handleClearHistory}
      />

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        isProUser={isProUser}
        onUpgradeToPro={handleUpgradeToPro}
      />

      {/* Footer with MADE BY HEMANT Instagram link */}
      <footer className="mt-12 border-t border-white/5 py-6 px-4 text-center text-xs text-neutral-400 space-y-2">
        <div className="flex items-center justify-center gap-2 flex-wrap font-medium">
          <span>Vaani Darshan Voice Studio</span>
          <span>•</span>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-400 hover:text-pink-300 font-bold tracking-wider inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>MADE BY HEMANT (@hemant_yt__)</span>
          </a>
          <span>•</span>
          <span className="text-neutral-500">
            Powered by Gemini 3.8 Flash TTS
          </span>
        </div>
        <p className="text-[11px] text-neutral-600">
          Professional Voice Synthesis in Hindi & American English across Motivational, Explainer, Spiritual & Storytelling genres.
        </p>
      </footer>
    </div>
  );
}
