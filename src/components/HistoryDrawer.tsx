import React from 'react';
import { X, Play, Trash2, Download, History, Volume2 } from 'lucide-react';
import { AudioHistoryItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: AudioHistoryItem[];
  onPlayItem: (item: AudioHistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onPlayItem,
  onDeleteItem,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const downloadItem = (item: AudioHistoryItem) => {
    const a = document.createElement('a');
    a.href = `data:${item.mimeType};base64,${item.audioBase64}`;
    const cleanName = item.characterName.replace(/[\/\s]/g, '_');
    a.download = `VaaniDarshan_${cleanName}_${item.id}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#10121a] border-l border-white/10 shadow-2xl p-5 flex flex-col justify-between">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Voice Generation Archive
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between py-2.5 text-xs text-neutral-400">
              <span>Saved clips: {history.length}</span>
              {history.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-3 py-2 pr-1">
            {history.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center text-neutral-500">
                <Volume2 className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-sm">No saved audio clips yet</p>
                <p className="text-xs text-neutral-600 mt-1">
                  Audio tracks generated in this studio are automatically archived here
                </p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-neutral-900/70 border border-neutral-800 hover:border-neutral-700 transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-amber-300">
                      {item.characterName}
                    </span>
                    <span className="text-neutral-500 font-mono text-[10px]">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>

                  <p className="text-xs font-devanagari text-neutral-300 line-clamp-2 leading-relaxed">
                    "{item.text}"
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <button
                      onClick={() => onPlayItem(item)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Play</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => downloadItem(item)}
                        className="p-1.5 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        title="Download .WAV"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1.5 rounded-md hover:bg-red-500/10 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 text-center">
            <p className="text-[11px] text-neutral-500">
              Archived locally in your browser storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
