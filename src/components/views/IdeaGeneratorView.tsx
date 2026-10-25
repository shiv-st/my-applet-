import React, { useState } from 'react';
import { useCreator } from '../../context/CreatorContext';
import { GamingIdea, VideoFormat } from '../../types';
import {
  Lightbulb,
  Sparkles,
  Bookmark,
  FileText,
  Type,
  Image,
  Calendar,
  Copy,
  Clock,
  Target,
  Flame,
  Check,
  ChevronRight,
  Loader2,
  Gamepad2
} from 'lucide-react';

const POPULAR_GAMES = [
  'Minecraft',
  'GTA V',
  'Valorant',
  'BGMI',
  'Free Fire',
  'Roblox',
  'Fortnite',
  'Apex Legends',
  'Elden Ring',
  'Call of Duty'
];

const CONTENT_TYPES = [
  'Challenges (100 Days / Hardcore)',
  'Funny Moments & Glitches',
  'Tutorials & Pro Guides',
  'Ranked Gameplay & Clutches',
  'Tips & Tricks / Mythbusting',
  'Game Updates & Secrets',
  'Reactions & Tier Lists',
  'Livestream Highlights'
];

const AUDIENCES = [
  'Teens & Young Adults (High Energy)',
  'Competitive / Ranked Players',
  'Casual & Broad Gaming Fans',
  'Kids & Family Friendly'
];

const LANGUAGES = ['English', 'Hindi', 'Spanish', 'Portuguese', 'French', 'German', 'Indonesian'];

export const IdeaGeneratorView: React.FC = () => {
  const {
    saveIdea,
    savedIdeas,
    setCurrentView,
    setPrefilledIdea,
    setPrefilledTitle,
    setPrefilledGame,
    addCalendarItem,
    showToast,
    incrementUsage,
    isUsageLimitReached,
    setIsUpgradeModalOpen
  } = useCreator();

  const [selectedGame, setSelectedGame] = useState<string>('Minecraft');
  const [customGame, setCustomGame] = useState<string>('');
  const [contentType, setContentType] = useState<string>(CONTENT_TYPES[0]);
  const [audience, setAudience] = useState<string>(AUDIENCES[0]);
  const [language, setLanguage] = useState<string>('English');
  const [format, setFormat] = useState<VideoFormat>('Long-form (16:9)');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<GamingIdea[]>([]);
  const [copiedHookId, setCopiedHookId] = useState<string | null>(null);

  const activeGame = customGame.trim() || selectedGame;

  const handleGenerate = async () => {
    if (isUsageLimitReached) {
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game: activeGame,
          contentType,
          audience,
          language,
          format,
          count: 3
        })
      });

      const data = await response.json();
      if (data.ideas && Array.isArray(data.ideas)) {
        const enriched = data.ideas.map((item: any, idx: number) => ({
          ...item,
          id: item.id || `idea-${Date.now()}-${idx}`,
          game: activeGame,
          format,
          createdAt: new Date().toISOString()
        }));
        setGeneratedIdeas(enriched);
        incrementUsage();
        if (data.isDemoMode && data.message) {
          showToast(data.message, 'info');
        } else {
          showToast(`Generated 3 high-impact ideas for ${activeGame}!`);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Error generating ideas. Try again.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyHook = (id: string, hook: string) => {
    navigator.clipboard.writeText(hook);
    setCopiedHookId(id);
    showToast('Opening hook copied to clipboard!');
    setTimeout(() => setCopiedHookId(null), 2500);
  };

  const handleSendToScript = (idea: GamingIdea) => {
    setPrefilledIdea(idea);
    setPrefilledTitle(idea.title);
    setPrefilledGame(idea.game);
    setCurrentView('scripts');
    showToast(`Loaded "${idea.title.slice(0, 30)}..." into Script Writer!`);
  };

  const handleSendToTitles = (idea: GamingIdea) => {
    setPrefilledTitle(idea.title);
    setPrefilledGame(idea.game);
    setCurrentView('titles');
  };

  const handleSendToThumbnails = (idea: GamingIdea) => {
    setPrefilledTitle(idea.title);
    setPrefilledGame(idea.game);
    setCurrentView('thumbnails');
  };

  const handleQuickSchedule = (idea: GamingIdea) => {
    const nextDate = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];
    addCalendarItem({
      title: idea.title,
      game: idea.game,
      contentType: idea.format,
      status: 'Idea',
      scheduledDate: nextDate,
      notes: `Hook: ${idea.hook}`,
      reminderSet: true
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Retention-First Idea Engine</span>
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
          AI Gaming Video Idea Generator
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Craft high-CTR video concepts engineered for the YouTube algorithm with opening hooks, scene structures, and viewer psychology triggers.
        </p>
      </div>

      {/* Configuration Form Card */}
      <div className="p-6 rounded-3xl bg-[#121422] border border-white/10 shadow-xl space-y-6">
        {/* Game Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Select Game
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {POPULAR_GAMES.map(game => (
              <button
                key={game}
                onClick={() => {
                  setSelectedGame(game);
                  setCustomGame('');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedGame === game && !customGame
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-400'
                    : 'bg-[#181b2e] text-slate-300 hover:bg-[#20243d] border border-white/5'
                }`}
              >
                {game}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Or type a custom game name (e.g. Helldivers 2, Palworld, CS2)..."
              value={customGame}
              onChange={e => setCustomGame(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e101b] border border-white/10 focus:border-purple-500 text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 4-Column Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Content Type */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Content Genre
            </label>
            <select
              value={contentType}
              onChange={e => setContentType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              {CONTENT_TYPES.map(type => (
                <option key={type} value={type} className="bg-[#121422]">
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Target Audience
            </label>
            <select
              value={audience}
              onChange={e => setAudience(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              {AUDIENCES.map(aud => (
                <option key={aud} value={aud} className="bg-[#121422]">
                  {aud}
                </option>
              ))}
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Video Language
            </label>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang} className="bg-[#121422]">
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Video Format
            </label>
            <div className="flex rounded-xl bg-[#0e101b] p-1 border border-white/10">
              <button
                onClick={() => setFormat('Long-form (16:9)')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  format === 'Long-form (16:9)'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                16:9 Long
              </button>
              <button
                onClick={() => setFormat('Short-form (9:16)')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  format === 'Short-form (9:16)'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                9:16 Shorts
              </button>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-2 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Generates 3 algorithm-optimized video blueprints</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-heading font-black text-xs shadow-xl shadow-purple-600/30 flex items-center gap-2 transition-all disabled:opacity-50 active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Synthesizing Ideas...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Video Ideas</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Ideas Cards */}
      {generatedIdeas.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg text-white">
              Generated Video Blueprints for <span className="text-cyan-300">{activeGame}</span>
            </h2>
            <span className="text-xs text-slate-400">
              {generatedIdeas.length} ideas available
            </span>
          </div>

          <div className="space-y-5">
            {generatedIdeas.map((idea, index) => {
              const isSaved = savedIdeas.some(i => i.id === idea.id);

              return (
                <div
                  key={idea.id}
                  className="p-6 rounded-3xl bg-[#121422] border border-purple-500/20 hover:border-purple-500/40 shadow-xl transition-all space-y-4"
                >
                  {/* Top Bar: Title & Badges */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-white/5">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {idea.game}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          {idea.format}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            idea.difficulty === 'Epic'
                              ? 'bg-red-500/20 text-red-300'
                              : idea.difficulty === 'Hard'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}
                        >
                          {idea.difficulty} Difficulty
                        </span>
                      </div>
                      <h3 className="font-heading font-black text-lg sm:text-xl text-white">
                        {idea.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => saveIdea(idea)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                        isSaved
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                      }`}
                      aria-label="Save idea to vault"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{isSaved ? 'In Vault' : 'Save to Vault'}</span>
                    </button>
                  </div>

                  {/* Concept Summary */}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {idea.concept}
                  </p>

                  {/* Hook Callout Box */}
                  <div className="p-4 rounded-2xl bg-[#0d0f1b] border border-cyan-500/20 relative">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-cyan-400" />
                        <span>0-3 Second Opening Hook</span>
                      </span>
                      <button
                        onClick={() => handleCopyHook(idea.id, idea.hook)}
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1 p-1 rounded"
                        aria-label="Copy opening hook"
                      >
                        {copiedHookId === idea.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Copy Hook</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-cyan-100 font-medium italic">
                      {idea.hook}
                    </p>
                  </div>

                  {/* 2-Column: Video Structure Timeline & Psychological Appeal */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Structure */}
                    <div className="p-3.5 rounded-2xl bg-[#0e101a] border border-white/5">
                      <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Suggested Video Structure</span>
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-300">
                        {idea.structure.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Psychology & Audience */}
                    <div className="p-3.5 rounded-2xl bg-[#0e101a] border border-white/5 space-y-3">
                      <div>
                        <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5" />
                          <span>Target Viewer Persona</span>
                        </div>
                        <p className="text-xs text-slate-300">{idea.targetAudience}</p>
                      </div>

                      <div>
                        <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider mb-1">
                          Why Viewers Click & Stay
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {idea.appealReason}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Pipeline Ribbon */}
                  <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-slate-500">Pipeline Actions:</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleSendToScript(idea)}
                        className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Write Script</span>
                      </button>

                      <button
                        onClick={() => handleSendToTitles(idea)}
                        className="px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-200 text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <Type className="w-3.5 h-3.5" />
                        <span>Generate Titles</span>
                      </button>

                      <button
                        onClick={() => handleSendToThumbnails(idea)}
                        className="px-3 py-1.5 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 text-pink-200 text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <Image className="w-3.5 h-3.5" />
                        <span>Plan Thumbnail</span>
                      </button>

                      <button
                        onClick={() => handleQuickSchedule(idea)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Schedule on Calendar</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
