import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  GamingIdea,
  GamingTitle,
  GamingScript,
  ThumbnailConcept,
  ShortsPackage,
  ContentCalendarItem,
  ChannelPerformance,
  CreatorTier,
  AnimeThemeId
} from '../types';
import { DEFAULT_THEME_ID } from '../utils/animeThemes';

export type AppView =
  | 'landing'
  | 'dashboard'
  | 'ideas'
  | 'titles'
  | 'thumbnails'
  | 'shorts'
  | 'scripts'
  | 'seo'
  | 'calendar'
  | 'analytics'
  | 'coach'
  | 'vault'
  | 'gmail';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

interface CreatorContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  tier: CreatorTier;
  setTier: (tier: CreatorTier) => void;
  dailyUsageCount: number;
  incrementUsage: () => void;
  isUsageLimitReached: boolean;
  
  // Pipeline Transfer state
  prefilledIdea: GamingIdea | null;
  setPrefilledIdea: (idea: GamingIdea | null) => void;
  prefilledTitle: string;
  setPrefilledTitle: (t: string) => void;
  prefilledGame: string;
  setPrefilledGame: (g: string) => void;

  // Saved Vault Collections
  savedIdeas: GamingIdea[];
  saveIdea: (idea: GamingIdea) => void;
  removeIdea: (id: string) => void;

  savedTitles: GamingTitle[];
  saveTitle: (title: GamingTitle) => void;
  removeTitle: (id: string) => void;

  savedScripts: GamingScript[];
  saveScript: (script: GamingScript) => void;
  removeScript: (id: string) => void;

  savedThumbnails: ThumbnailConcept[];
  saveThumbnail: (concept: ThumbnailConcept) => void;
  removeThumbnail: (id: string) => void;

  // Content Calendar
  calendarItems: ContentCalendarItem[];
  addCalendarItem: (item: Omit<ContentCalendarItem, 'id' | 'createdAt'>) => void;
  updateCalendarItem: (id: string, updates: Partial<ContentCalendarItem>) => void;
  deleteCalendarItem: (id: string) => void;

  // Channel Analytics
  channelStats: ChannelPerformance;
  updateChannelStats: (updates: Partial<ChannelPerformance>) => void;

  // Server & AI status
  hasGeminiKey: boolean;
  serverStatusChecked: boolean;
  isDemoMode: boolean;

  // UI Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Upgrade Modal
  isUpgradeModalOpen: boolean;
  setIsUpgradeModalOpen: (open: boolean) => void;

  // Anime Theme & Background Translucency
  animeTheme: AnimeThemeId;
  setAnimeTheme: (theme: AnimeThemeId) => void;
  bgTranslucency: 'subtle' | 'balanced' | 'vivid';
  setBgTranslucency: (val: 'subtle' | 'balanced' | 'vivid') => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
}

const CreatorContext = createContext<CreatorContextType | undefined>(undefined);

const INITIAL_CALENDAR_ITEMS: ContentCalendarItem[] = [
  {
    id: 'cal-1',
    title: 'I Survived 100 Days In Hardcore Minecraft (Day 1-50)',
    game: 'Minecraft',
    contentType: 'Long-form (16:9)',
    status: 'Scheduled',
    scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    targetTime: '15:00',
    notes: 'Include end-screen cards linking to next episode. Pinned comment on world seed.',
    reminderSet: true,
    tasks: [
      { name: 'Gameplay recorded', completed: true },
      { name: 'Audio voiceover mixed', completed: true },
      { name: 'Thumbnail exported at 1440p', completed: true },
      { name: 'YouTube description & timestamps ready', completed: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'cal-2',
    title: 'The 1 Valorant Setting That Gives Instant Aimbot #shorts',
    game: 'Valorant',
    contentType: 'Short-form (9:16)',
    status: 'Editing',
    scheduledDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    targetTime: '18:00',
    notes: 'Pacing test: keep under 40 seconds. Add sound fx on crosshair zoom.',
    reminderSet: false,
    tasks: [
      { name: 'Clip extracted', completed: true },
      { name: 'Word-by-word captions', completed: false }
    ],
    createdAt: new Date().toISOString()
  }
];

const INITIAL_CHANNEL_STATS: ChannelPerformance = {
  channelName: 'ViperX Gaming',
  handle: '@ViperXGames',
  primaryGame: 'Minecraft & Valorant',
  subscribers: 28450,
  totalViews: 1420900,
  views30Days: 148500,
  avgWatchTimeMin: 5.8,
  avgCtrPercent: 8.4,
  totalVideos: 42,
  dataSource: 'Manual Log',
  recentVideos: [
    {
      id: 'v-1',
      title: 'I Survived 100 Days In Hardcore Minecraft (Day 1-50)',
      game: 'Minecraft',
      format: 'Long-form',
      views: 48200,
      ctr: 9.2,
      retention: 54,
      publishDate: '2025-05-10'
    },
    {
      id: 'v-2',
      title: 'This Valorant Trick Feels Completely Illegal #shorts',
      game: 'Valorant',
      format: 'Shorts',
      views: 89400,
      ctr: 11.5,
      retention: 78,
      publishDate: '2025-05-14'
    },
    {
      id: 'v-3',
      title: 'We Tested 10 GTA V Myths In 2025',
      game: 'GTA V',
      format: 'Long-form',
      views: 31200,
      ctr: 7.1,
      retention: 48,
      publishDate: '2025-05-02'
    }
  ]
};

export const CreatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [tier, setTier] = useState<CreatorTier>('Pro Creator');
  const [dailyUsageCount, setDailyUsageCount] = useState<number>(() => {
    const saved = localStorage.getItem('gc_daily_usage');
    return saved ? parseInt(saved, 10) : 3;
  });

  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  const [serverStatusChecked, setServerStatusChecked] = useState<boolean>(false);

  // Pipeline transfers
  const [prefilledIdea, setPrefilledIdea] = useState<GamingIdea | null>(null);
  const [prefilledTitle, setPrefilledTitle] = useState<string>('');
  const [prefilledGame, setPrefilledGame] = useState<string>('Minecraft');

  // Vault state with localStorage persistence
  const [savedIdeas, setSavedIdeas] = useState<GamingIdea[]>(() => {
    const data = localStorage.getItem('gc_saved_ideas');
    return data ? JSON.parse(data) : [];
  });

  const [savedTitles, setSavedTitles] = useState<GamingTitle[]>(() => {
    const data = localStorage.getItem('gc_saved_titles');
    return data ? JSON.parse(data) : [];
  });

  const [savedScripts, setSavedScripts] = useState<GamingScript[]>(() => {
    const data = localStorage.getItem('gc_saved_scripts');
    return data ? JSON.parse(data) : [];
  });

  const [savedThumbnails, setSavedThumbnails] = useState<ThumbnailConcept[]>(() => {
    const data = localStorage.getItem('gc_saved_thumbnails');
    return data ? JSON.parse(data) : [];
  });

  const [calendarItems, setCalendarItems] = useState<ContentCalendarItem[]>(() => {
    const data = localStorage.getItem('gc_calendar_items');
    return data ? JSON.parse(data) : INITIAL_CALENDAR_ITEMS;
  });

  const [channelStats, setChannelStats] = useState<ChannelPerformance>(() => {
    const data = localStorage.getItem('gc_channel_stats');
    return data ? JSON.parse(data) : INITIAL_CHANNEL_STATS;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);

  const [animeTheme, setAnimeThemeState] = useState<AnimeThemeId>(() => {
    const themeVersion = localStorage.getItem('gc_theme_v3');
    const saved = localStorage.getItem('gc_anime_theme');
    // Ensure new White & Golden Brown theme takes effect immediately for this update
    if (themeVersion !== 'v3') {
      localStorage.setItem('gc_theme_v3', 'v3');
      localStorage.setItem('gc_anime_theme', DEFAULT_THEME_ID);
      return DEFAULT_THEME_ID;
    }
    if (saved && (saved === 'golden_goku' || saved === 'gojo' || saved === 'naruto' || saved === 'goku' || saved === 'cyber')) {
      return saved as AnimeThemeId;
    }
    return DEFAULT_THEME_ID;
  });

  const setAnimeTheme = (theme: AnimeThemeId) => {
    setAnimeThemeState(theme);
    localStorage.setItem('gc_anime_theme', theme);
  };

  const [bgTranslucency, setBgTranslucencyState] = useState<'subtle' | 'balanced' | 'vivid'>(() => {
    const saved = localStorage.getItem('gc_bg_translucency');
    if (saved === 'subtle' || saved === 'balanced' || saved === 'vivid') {
      return saved;
    }
    return 'balanced';
  });

  const setBgTranslucency = (val: 'subtle' | 'balanced' | 'vivid') => {
    setBgTranslucencyState(val);
    localStorage.setItem('gc_bg_translucency', val);
  };

  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

  // Fetch server status on mount
  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        setHasGeminiKey(Boolean(data.hasGeminiKey));
        setServerStatusChecked(true);
      })
      .catch(() => {
        setHasGeminiKey(false);
        setServerStatusChecked(true);
      });
  }, []);

  // Save to localStorage effects
  useEffect(() => {
    localStorage.setItem('gc_saved_ideas', JSON.stringify(savedIdeas));
  }, [savedIdeas]);

  useEffect(() => {
    localStorage.setItem('gc_saved_titles', JSON.stringify(savedTitles));
  }, [savedTitles]);

  useEffect(() => {
    localStorage.setItem('gc_saved_scripts', JSON.stringify(savedScripts));
  }, [savedScripts]);

  useEffect(() => {
    localStorage.setItem('gc_saved_thumbnails', JSON.stringify(savedThumbnails));
  }, [savedThumbnails]);

  useEffect(() => {
    localStorage.setItem('gc_calendar_items', JSON.stringify(calendarItems));
  }, [calendarItems]);

  useEffect(() => {
    localStorage.setItem('gc_channel_stats', JSON.stringify(channelStats));
  }, [channelStats]);

  useEffect(() => {
    localStorage.setItem('gc_daily_usage', dailyUsageCount.toString());
  }, [dailyUsageCount]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const incrementUsage = () => {
    setDailyUsageCount(prev => prev + 1);
  };

  const isUsageLimitReached = tier === 'Free' && dailyUsageCount >= 10;

  const saveIdea = (idea: GamingIdea) => {
    if (savedIdeas.some(i => i.id === idea.id)) {
      showToast('Idea is already in your vault!', 'info');
      return;
    }
    setSavedIdeas(prev => [idea, ...prev]);
    showToast(`Saved "${idea.title.slice(0, 30)}..." to Vault!`);
  };

  const removeIdea = (id: string) => {
    setSavedIdeas(prev => prev.filter(i => i.id !== id));
    showToast('Removed from vault', 'info');
  };

  const saveTitle = (title: GamingTitle) => {
    if (savedTitles.some(t => t.id === title.id || t.title === title.title)) {
      showToast('Title is already saved!', 'info');
      return;
    }
    setSavedTitles(prev => [title, ...prev]);
    showToast('Title saved to your collection!');
  };

  const removeTitle = (id: string) => {
    setSavedTitles(prev => prev.filter(t => t.id !== id));
    showToast('Title removed', 'info');
  };

  const saveScript = (script: GamingScript) => {
    setSavedScripts(prev => {
      const filtered = prev.filter(s => s.id !== script.id);
      return [script, ...filtered];
    });
    showToast('Script saved to your vault!');
  };

  const removeScript = (id: string) => {
    setSavedScripts(prev => prev.filter(s => s.id !== id));
    showToast('Script removed', 'info');
  };

  const saveThumbnail = (concept: ThumbnailConcept) => {
    if (savedThumbnails.some(c => c.id === concept.id)) {
      showToast('Thumbnail concept already saved!', 'info');
      return;
    }
    setSavedThumbnails(prev => [concept, ...prev]);
    showToast('Thumbnail concept saved to Vault!');
  };

  const removeThumbnail = (id: string) => {
    setSavedThumbnails(prev => prev.filter(c => c.id !== id));
    showToast('Thumbnail concept removed', 'info');
  };

  const addCalendarItem = (item: Omit<ContentCalendarItem, 'id' | 'createdAt'>) => {
    const newItem: ContentCalendarItem = {
      ...item,
      id: 'cal-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setCalendarItems(prev => [newItem, ...prev]);
    showToast(`Scheduled "${newItem.title.slice(0, 25)}..." on calendar!`);
  };

  const updateCalendarItem = (id: string, updates: Partial<ContentCalendarItem>) => {
    setCalendarItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    showToast('Calendar updated');
  };

  const deleteCalendarItem = (id: string) => {
    setCalendarItems(prev => prev.filter(item => item.id !== id));
    showToast('Removed scheduled item', 'info');
  };

  const updateChannelStats = (updates: Partial<ChannelPerformance>) => {
    setChannelStats(prev => ({ ...prev, ...updates }));
    showToast('Channel performance saved');
  };

  return (
    <CreatorContext.Provider
      value={{
        currentView,
        setCurrentView,
        tier,
        setTier,
        dailyUsageCount,
        incrementUsage,
        isUsageLimitReached,
        prefilledIdea,
        setPrefilledIdea,
        prefilledTitle,
        setPrefilledTitle,
        prefilledGame,
        setPrefilledGame,
        savedIdeas,
        saveIdea,
        removeIdea,
        savedTitles,
        saveTitle,
        removeTitle,
        savedScripts,
        saveScript,
        removeScript,
        savedThumbnails,
        saveThumbnail,
        removeThumbnail,
        calendarItems,
        addCalendarItem,
        updateCalendarItem,
        deleteCalendarItem,
        channelStats,
        updateChannelStats,
        hasGeminiKey,
        serverStatusChecked,
        isDemoMode: !hasGeminiKey,
        toasts,
        showToast,
        removeToast,
        isUpgradeModalOpen,
        setIsUpgradeModalOpen,
        animeTheme,
        setAnimeTheme,
        bgTranslucency,
        setBgTranslucency,
        isThemeModalOpen,
        setIsThemeModalOpen
      }}
    >
      {children}
    </CreatorContext.Provider>
  );
};

export const useCreator = () => {
  const context = useContext(CreatorContext);
  if (!context) {
    throw new Error('useCreator must be used within a CreatorProvider');
  }
  return context;
};
