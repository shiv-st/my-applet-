export type VideoFormat = 'Long-form (16:9)' | 'Short-form (9:16)' | 'Live Stream';

export type ContentStatus = 'Idea' | 'Scripting' | 'Recording' | 'Editing' | 'Scheduled' | 'Published';

export type CreatorTier = 'Free' | 'Pro Creator' | 'Studio';

export interface GamingIdea {
  id: string;
  game: string;
  title: string;
  concept: string;
  hook: string;
  structure: string[];
  targetAudience: string;
  appealReason: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Epic';
  estimatedMinutes: number;
  format: VideoFormat;
  isFavorited?: boolean;
  createdAt: string;
}

export interface GamingTitle {
  id: string;
  game: string;
  title: string;
  style: string;
  characterCount: number;
  estimatedCTR: number;
  tagline: string;
  isSaved?: boolean;
  createdAt: string;
}

export interface ScriptSection {
  sectionName: string;
  visualCues: string;
  spokenDialogue: string;
  soundFx: string;
}

export interface GamingScript {
  id: string;
  game: string;
  title: string;
  scriptType: string;
  tone: string;
  estimatedDuration: string;
  estimatedWordCount: number;
  hookFormula: string;
  sections: ScriptSection[];
  outroCta: string;
  createdAt: string;
}

export interface ShortsScene {
  timestamp: string;
  visualAction: string;
  voiceover: string;
  captionStyle: string;
  soundCue: string;
}

export interface ShortsPackage {
  id: string;
  game: string;
  shortTitle: string;
  retentionHook: string;
  scenes: ShortsScene[];
  recommendedHashtags: string[];
  description: string;
  longFormRepurposeIdea: string;
  createdAt: string;
}

export interface ThumbnailConcept {
  id: string;
  game: string;
  name: string;
  focalPoint: string;
  emotionOrAction: string;
  background: string;
  colorPalette: string;
  recommendedText: string;
  compositionTip: string;
  aiImagePrompt: string;
  createdAt: string;
}

export interface ContentCalendarItem {
  id: string;
  title: string;
  game: string;
  contentType: VideoFormat;
  status: ContentStatus;
  scheduledDate: string; // YYYY-MM-DD
  targetTime?: string;
  notes?: string;
  reminderSet?: boolean;
  tasks?: { name: string; completed: boolean }[];
  createdAt: string;
}

export interface ChannelPerformance {
  channelName: string;
  handle: string;
  primaryGame: string;
  subscribers: number;
  totalViews: number;
  views30Days: number;
  avgWatchTimeMin: number;
  avgCtrPercent: number;
  totalVideos: number;
  dataSource: 'Manual Log' | 'YouTube API (Demo)' | 'Verified OAuth';
  recentVideos: {
    id: string;
    title: string;
    game: string;
    format: 'Long-form' | 'Shorts';
    views: number;
    ctr: number;
    retention: number;
    publishDate: string;
  }[];
}

export interface AiCoachInsight {
  channelHealthSummary: string;
  topRecommendedExperiments: {
    title: string;
    why: string;
    howToMeasure: string;
  }[];
  contentCalendarFeedback: string;
  formatBreakdown: string;
  weeklyActionPlan: string[];
  disclaimer: string;
}

export type AnimeThemeId = 'golden_goku' | 'gojo' | 'naruto' | 'goku' | 'cyber';

export interface AnimeThemeConfig {
  id: AnimeThemeId;
  name: string;
  character: string;
  anime: string;
  quote: string;
  tagline: string;
  primaryColor: string;
  secondaryColor?: string;
  accentClass: string;
  glowClass: string;
  borderClass: string;
  gradientClass: string;
  bgImageUrl?: string;
  themeStyle?: 'golden_brown' | 'purple' | 'orange' | 'cyan' | 'cyber';
  bgOpacity?: number;
}
