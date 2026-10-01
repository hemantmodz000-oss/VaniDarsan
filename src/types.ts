export type VoiceName = 'Charon' | 'Fenrir' | 'Zephyr' | 'Kore' | 'Puck';

export type VoiceCategory =
  | 'spiritual'
  | 'motivational'
  | 'explainer'
  | 'storytelling'
  | 'american-english';

export interface CharacterVoice {
  id: string;
  name: string;
  hindiTitle: string;
  role: string;
  tone: string;
  description: string;
  avatarIcon: string;
  language: 'hi' | 'en';
  colorScheme: {
    border: string;
    bg: string;
    accent: string;
    glow: string;
  };
  geminiVoice: VoiceName;
  stylePrompt: string;
  sampleQuote: string;
  category: VoiceCategory;
  categoryBadge: string;
}

export interface PresetQuote {
  id: string;
  title: string;
  category: string;
  source: string;
  hindiText: string;
  language?: 'hi' | 'en';
  meaning?: string;
  recommendedCharacterId: string;
}

export interface AudioHistoryItem {
  id: string;
  timestamp: number;
  text: string;
  characterId: string;
  characterName: string;
  voiceName: VoiceName;
  audioBase64: string;
  mimeType: string;
  language?: 'hi' | 'en';
  duration?: number;
}
