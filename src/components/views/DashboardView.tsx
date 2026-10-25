import React, { useState } from 'react';
import { useCreator } from '../../context/CreatorContext';
import { ANIME_THEMES } from '../../utils/animeThemes';
import {
  RevenueCalculatorWidget,
  SubscriberMilestoneWidget,
  RetentionCurveWidget,
  GamingMetaRadarWidget
} from '../widgets/CreatorWidgets';
import {
  Lightbulb,
  Type,
  Image,
  Flame,
  FileText,
  Search,
  Calendar,
  BarChart3,
  Bot,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Bookmark,
  Zap,
  Gamepad2,
  Plus,
  Mail,
  Palette,
  Sliders
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    setCurrentView,
    savedIdeas,
    savedTitles,
    savedScripts,
    calendarItems,
    channelStats,
    tier,
    dailyUsageCount,
    setPrefilledGame,
    setIsUpgradeModalOpen,
    animeTheme,
    setIsThemeModalOpen
  } = useCreator();

  const currentTheme = ANIME_THEMES[animeTheme] || ANIME_THEMES.gojo;

  const upcomingUploads = calendarItems
    .filter(item => item.status !== 'Published')
    .slice(0, 3);

  const tools = [
    {
      id: 'ideas' as const,
      name: 'AI Video Ideas',
      tagline: 'Fresh viral angles & hooks',
      icon: Lightbulb,
      color: 'from-amber-500/10 to-transparent',
      border: 'border-amber-500/20 hover:border-amber-500/40',
      iconColor: 'text-amber-400'
    },
    {
      id: 'titles' as const,
      name: 'Title Studio & CTR',
      tagline: 'High-converting title formulas',
      icon: Type,
      color: 'from-cyan-500/10 to-transparent',
      border: 'border-cyan-500/20 hover:border-cyan-500/40',
      iconColor: 'text-cyan-400'
    },
    {
      id: 'thumbnails' as const,
      name: 'Thumbnail Canvas',
      tagline: '16:9 Canvas & mobile test',
      icon: Image,
      color: 'from-pink-500/10 to-transparent',
      border: 'border-pink-500/20 hover:border-pink-500/40',
      iconColor: 'text-pink-400'
    },
    {
      id: 'shorts' as const,
      name: 'YouTube Shorts AI',
      tagline: '0-3s retention hooks & pacing',
      icon: Flame,
      color: 'from-red-500/10 to-transparent',
      border: 'border-red-500/20 hover:border-red-500/40',
      iconColor: 'text-red-400'
    },
    {
      id: 'scripts' as const,
      name: 'Gaming Script Writer',
      tagline: '2-Column visuals & teleprompter',
      icon: FileText,
      color: 'from-emerald-500/10 to-transparent',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      iconColor: 'text-emerald-400'
    },
    {
      id: 'seo' as const,
      name: 'YouTube SEO & Tags',
      tagline: '500-char budget & checklist',
      icon: Search,
      color: 'from-blue-500/10 to-transparent',
      border: 'border-blue-500/20 hover:border-blue-500/40',
      iconColor: 'text-blue-400'
    },
    {
      id: 'calendar' as const,
      name: 'Content Calendar',
      tagline: 'Organize schedule & deadlines',
      icon: Calendar,
      color: 'from-indigo-500/10 to-transparent',
      border: 'border-indigo-500/20 hover:border-indigo-500/40',
      iconColor: 'text-indigo-400'
    },
    {
      id: 'gmail' as const,
      name: 'Creator Mail & Brands',
      tagline: 'Sponsorship pitches & inbox',
      icon: Mail,
      color: 'from-purple-500/10 to-transparent',
      border: 'border-purple-500/20 hover:border-purple-500/40',
      iconColor: 'text-purple-400'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Atmosphere Banner with Anime Theme Integration */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-[#0e101c]/80 backdrop-blur-xl border border-white/[0.08] shadow-2xl overflow-hidden">
        {/* Soft atmospheric gradient */}
        <div
          className="absolute -right-16 -top-16 w-80 h-80 rounded-full blur-[100px] opacity-30 pointer-events-none"
          style={{ backgroundColor: currentTheme.primaryColor }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono text-slate-400">Workspace Deck</span>
              <span className="text-slate-600">·</span>
              <span className="font-semibold text-slate-300">{channelStats.channelName}</span>
              <span className="text-slate-600">·</span>
              <button
                onClick={() => setIsThemeModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[11px] text-slate-300 transition-colors"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: currentTheme.primaryColor }}
                />
                <span className="font-semibold">{currentTheme.character}</span>
                <span className="text-slate-400">({currentTheme.anime})</span>
                <Palette className="w-3 h-3 text-slate-400 ml-0.5" />
              </button>
            </div>

            <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
              Welcome to the Creator Lab
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              <span className="italic text-slate-400 font-mono text-[11px] block mb-1">
                "{currentTheme.quote}"
              </span>
              You have <span className="text-white font-semibold">{calendarItems.length} videos</span> planned in your pipeline, with <span className="text-cyan-300 font-semibold">{channelStats.subscribers.toLocaleString()} subscribers</span> tracking your channel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentView('ideas')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Generate Video Idea</span>
            </button>
            <button
              onClick={() => setCurrentView('calendar')}
              className="px-4 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-white font-semibold text-xs border border-white/10 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Production Board</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setCurrentView('vault')}
          className="p-5 rounded-2xl bg-[#0f111d]/90 backdrop-blur-xl border border-white/[0.08] hover:border-purple-500/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Vault Ideas</span>
            <Bookmark className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{savedIdeas.length}</div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-mono">
            <span>{savedScripts.length} completed scripts</span>
          </p>
        </div>

        <div
          onClick={() => setCurrentView('calendar')}
          className="p-5 rounded-2xl bg-[#0f111d]/90 backdrop-blur-xl border border-white/[0.08] hover:border-cyan-500/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Scheduled Uploads</span>
            <Calendar className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{calendarItems.length}</div>
          <p className="text-[11px] text-cyan-300 mt-1 font-mono">
            {upcomingUploads.length} in production queue
          </p>
        </div>

        <div
          onClick={() => setCurrentView('analytics')}
          className="p-5 rounded-2xl bg-[#0f111d]/90 backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">30d Velocity Views</span>
            <TrendingUp className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {channelStats.views30Days.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
            <span>CTR {channelStats.avgCtrPercent}% · {channelStats.avgWatchTimeMin}m avg watch</span>
          </p>
        </div>

        <div
          onClick={() => setIsUpgradeModalOpen(true)}
          className="p-5 rounded-2xl bg-[#0f111d]/90 backdrop-blur-xl border border-white/[0.08] hover:border-purple-500/40 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400">Plan Status</span>
            <Zap className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {tier === 'Free' ? `${dailyUsageCount}/10` : 'Pro Access'}
          </div>
          <p className="text-[11px] text-purple-300 mt-1 font-mono">
            {tier === 'Free' ? 'Daily credits remaining' : 'Unlimited AI generations'}
          </p>
        </div>
      </div>

      {/* QUICK LAUNCH TOOLKIT */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-black text-base text-white tracking-tight">
              Gaming Creation Suite
            </h2>
            <span className="text-slate-500 text-xs">· 8 Production Tools</span>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Select a module to launch</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {tools.map(tool => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => setCurrentView(tool.id)}
                className={`p-4 rounded-2xl bg-gradient-to-b ${tool.color} bg-[#0f111d]/80 backdrop-blur-xl border ${tool.border} text-left transition-all hover:-translate-y-1 hover:shadow-xl group focus:outline-none`}
              >
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className={`w-4 h-4 ${tool.iconColor}`} />
                </div>
                <div className="font-heading font-bold text-xs sm:text-sm text-white group-hover:text-purple-300 transition-colors">
                  {tool.name}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {tool.tagline}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CREATOR PERFORMANCE & STRATEGY WIDGETS SECTION */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <h2 className="font-heading font-black text-base text-white tracking-tight">
              Creator Strategy & Financial Telemetry
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Interactive Simulator Widgets</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Widget 1: Revenue Projector */}
          <RevenueCalculatorWidget />

          {/* Widget 2: Milestone Velocity */}
          <SubscriberMilestoneWidget />

          {/* Widget 3: 0-30s Retention Curve */}
          <RetentionCurveWidget />

          {/* Widget 4: Gaming Meta Radar */}
          <GamingMetaRadarWidget />
        </div>
      </div>

      {/* UPCOMING CONTENT QUEUE & AI COACH RECOMMENDATION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Scheduled Videos */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0f111d]/90 backdrop-blur-xl border border-white/[0.08] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <h3 className="font-heading font-bold text-sm text-white">Upcoming Production Queue</h3>
            </div>
            <button
              onClick={() => setCurrentView('calendar')}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
            >
              <span>Full Schedule</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {upcomingUploads.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No videos scheduled yet. Create an idea to start your schedule.
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingUploads.map(item => (
                <div
                  key={item.id}
                  onClick={() => setCurrentView('calendar')}
                  className="p-3.5 rounded-xl bg-[#090b14]/60 border border-white/[0.04] hover:border-purple-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-purple-400 font-mono">
                        {item.game}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.contentType}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-200 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>Target: {item.scheduledDate} {item.targetTime ? `at ${item.targetTime}` : ''}</span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <span
                      className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border ${
                        item.status === 'Scheduled'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : item.status === 'Editing'
                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Coach Sprint Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-950/20 via-[#0f111d] to-[#090b14] border border-white/[0.08] shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-purple-400" />
              <h3 className="font-heading font-bold text-sm text-white">AI Content Coach Sprint</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              "Your recent Short on <strong className="text-cyan-300">{channelStats.primaryGame}</strong> held 78% retention. Test transferring that fast opening hook into a full 10-minute challenge video."
            </p>

            <div className="p-3 rounded-xl bg-black/40 border border-white/[0.04] space-y-2">
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider font-mono">
                Key Growth Checkpoints
              </div>
              <div className="text-xs text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Render thumbnail at 1440p with 3-word focal rule</span>
              </div>
              <div className="text-xs text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Upload Sunday before 3 PM gaming peak traffic</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('coach')}
            className="mt-4 w-full py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <span>Open Channel Audit Deck</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
