import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Volume2,
  VolumeX,
  Repeat,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { CharacterVoice } from '../types';

interface AudioPlayerProps {
  audioBase64: string | null;
  mimeType?: string;
  character: CharacterVoice;
  text: string;
  modelUsed?: string;
  onOpenShare?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioBase64,
  mimeType = 'audio/wav',
  character,
  text,
  modelUsed,
  onOpenShare,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  // Convert base64 audio to Blob URL for maximum browser compatibility
  useEffect(() => {
    if (!audioBase64) {
      setAudioSrc(null);
      return;
    }

    try {
      const byteCharacters = atob(audioBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType || 'audio/wav' });
      const objectUrl = URL.createObjectURL(blob);
      setAudioSrc(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } catch (e) {
      console.warn('Blob creation failed, falling back to data URI:', e);
      setAudioSrc(`data:${mimeType || 'audio/wav'};base64,${audioBase64}`);
    }
  }, [audioBase64, mimeType]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (!isLooping) {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioSrc, isLooping]);

  useEffect(() => {
    if (audioSrc && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Playback error or blocked autoplay:', err);
          setIsPlaying(false);
        });
    }
  }, [audioSrc]);

  const togglePlay = () => {
    if (!audioRef.current || !audioSrc) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const toggleLoop = () => {
    const nextState = !isLooping;
    setIsLooping(nextState);
    if (audioRef.current) {
      audioRef.current.loop = nextState;
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioRef.current) {
      audioRef.current.muted = nextMute;
    }
  };

  const handleDownload = () => {
    if (!audioSrc) return;
    const a = document.createElement('a');
    a.href = audioSrc;
    const cleanName = character.name.replace(/[\/\s]/g, '_');
    a.download = `VaaniDarshan_${cleanName}_${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyText = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const barCount = 48;
      const barWidth = width / barCount - 2;

      for (let i = 0; i < barCount; i++) {
        let barHeight = 6;
        if (isPlaying) {
          const wave1 = Math.sin(phase + i * 0.28) * 0.5 + 0.5;
          const wave2 = Math.cos(phase * 1.4 + i * 0.15) * 0.5 + 0.5;
          const energy = (wave1 + wave2) / 2;
          const centerFactor = 1 - Math.abs(i - barCount / 2) / (barCount / 2);
          barHeight = Math.max(6, energy * (height - 10) * (0.4 + 0.6 * centerFactor));
        }

        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isPlaying) {
          gradient.addColorStop(0, '#f59e0b');
          gradient.addColorStop(0.5, '#ea580c');
          gradient.addColorStop(1, '#d97706');
        } else {
          gradient.addColorStop(0, '#3f3f46');
          gradient.addColorStop(1, '#27272a');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      if (isPlaying) {
        phase += 0.08 * playbackRate;
      }
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, playbackRate]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!audioSrc) {
    return (
      <div className="p-6 rounded-2xl bg-neutral-900/40 border border-white/5 text-center flex flex-col items-center justify-center min-h-[220px]">
        <div className="w-12 h-12 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-500 mb-3">
          <Volume2 className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-neutral-300 mb-1">
          Audio Stage Idle
        </h3>
        <p className="text-xs text-neutral-500 max-w-sm">
          Write or select a script above and click "Generate Hindi Voice" or play a sample from any character card.
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#13151f] to-[#0c0d13] border border-amber-500/30 p-5 shadow-xl shadow-amber-500/5">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      {/* Atmospheric Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl p-2 rounded-xl bg-neutral-950/80 border border-amber-500/20 shadow-inner">
            {character.avatarIcon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                Now Playing
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">
                {modelUsed || 'Gemini 3.8 TTS'}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              {character.hindiTitle}
            </h3>
            <p className="text-xs text-neutral-400">
              {character.tone} • Prebuilt Voice: {character.geminiVoice}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyText}
            className="p-2 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
            title="Copy script text"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          {onOpenShare && (
            <button
              onClick={onOpenShare}
              className="p-2 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
              title="Share voiceover on WhatsApp, X, Instagram..."
            >
              <Share2 className="w-4 h-4 text-amber-400" />
            </button>
          )}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-medium transition-colors cursor-pointer"
            title="Download high-quality .WAV file"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download .WAV</span>
          </button>
        </div>
      </div>

      {/* Canvas Visualizer */}
      <div className="relative w-full h-16 bg-neutral-950/90 rounded-xl p-2 border border-white/5 flex items-center justify-center mb-4 overflow-hidden shadow-inner">
        <canvas
          ref={canvasRef}
          width={500}
          height={60}
          className="w-full h-full object-cover"
        />
        {isLooping && (
          <div className="absolute top-2 right-2 text-[10px] font-medium text-amber-400/90 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <Repeat className="w-2.5 h-2.5 animate-spin" /> Loop Mode Active
          </div>
        )}
      </div>

      {/* Progress timeline scrubber */}
      <div className="space-y-1.5 mb-4">
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-[11px] font-mono text-neutral-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls & Tuning Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
        {/* Play / Pause / Replay */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReplay}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
            title="Restart playback"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg shadow-amber-500/25 transition-transform active:scale-95 cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={toggleMute}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Speed and Loop Controls */}
        <div className="flex items-center gap-2">
          {/* Speed Pills */}
          <div className="flex items-center bg-neutral-950/80 p-0.5 rounded-lg border border-white/5 text-xs">
            {[0.75, 1.0, 1.25].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  playbackRate === speed
                    ? 'bg-amber-500/20 text-amber-300 font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title={speed === 0.75 ? 'Meditative Pacing' : speed === 1.25 ? 'Brisk Pacing' : 'Normal Speed'}
              >
                {speed === 0.75 ? '0.75x Meditative' : `${speed}x`}
              </button>
            ))}
          </div>

          {/* Loop button */}
          <button
            onClick={toggleLoop}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isLooping
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border-white/5'
            }`}
            title="Loop audio indefinitely (Ideal for meditation)"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
