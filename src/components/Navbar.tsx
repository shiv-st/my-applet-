import React, { useState } from 'react';
import { useCreator } from '../context/CreatorContext';
import { ANIME_THEMES } from '../utils/animeThemes';
import { AnimeThemeSwitcher } from './AnimeThemeSwitcher';
import {
  Gamepad2,
  Sparkles,
  Zap,
  Crown,
  ChevronDown,
  Layers,
  ArrowRight,
  User,
  Radio,
  ExternalLink,
  ShieldCheck,
  Palette,
  Github
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    tier,
    setTier,
    dailyUsageCount,
    hasGeminiKey,
    channelStats,
    setIsUpgradeModalOpen,
    isGitHubModalOpen,
    setIsGitHubModalOpen,
    animeTheme,
    setIsThemeModalOpen,
    showToast
  } = useCreator();

  const [channelDropdownOpen, setChannelDropdownOpen] = useState(false);
  const currentThemeConfig = ANIME_THEMES[animeTheme] || ANIME_THEMES.golden_goku;
  const isGolden = animeTheme === 'golden_goku';

  return (
    <header className={`sticky top-0 z-40 w-full border-b transition-colors backdrop-blur-xl ${
      isGolden
        ? 'border-amber-500/20 bg-[#120e08]/90 shadow-sm shadow-amber-950/20'
        : 'border-purple-500/20 bg-[#0c0d16]/90'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            aria-label="Go to Dashboard"
          >
            <div className={`relative w-10 h-10 rounded-xl p-[1px] shadow-lg transition-all ${
              isGolden
                ? 'bg-gradient-to-tr from-amber-600 via-yellow-500 to-white shadow-amber-500/30 group-hover:shadow-amber-400/50'
                : 'bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 shadow-purple-600/30 group-hover:shadow-purple-500/50'
            }`}>
              <div className={`w-full h-full rounded-[11px] flex items-center justify-center ${
                isGolden ? 'bg-[#181109]' : 'bg-[#0d0f1a]'
              }`}>
                <Gamepad2 className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  isGolden ? 'text-amber-400' : 'text-purple-400'
                }`} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`font-heading font-black text-lg tracking-tight bg-clip-text text-transparent ${
                  isGolden
                    ? 'bg-gradient-to-r from-white via-amber-200 to-amber-400'
                    : 'bg-gradient-to-r from-white via-purple-100 to-cyan-300'
                }`}>
                  GameCreator
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  isGolden
                    ? 'bg-amber-500/20 text-amber-200 border-amber-400/30'
                    : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                }`}>
                  AI
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block -mt-1 font-mono-code">
                Gaming YouTuber Studio
              </span>
            </div>
          </button>

          {/* Quick Landing / Studio View Switcher */}
          <div className={`hidden md:flex items-center p-1 rounded-xl border ${
            isGolden ? 'bg-[#1a130a] border-amber-500/20' : 'bg-[#141726] border-white/5'
          }`}>
            <button
              onClick={() => setCurrentView('landing')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentView === 'landing'
                  ? isGolden ? 'bg-amber-500 text-black font-bold shadow-sm' : 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentView !== 'landing'
                  ? isGolden ? 'bg-amber-500 text-black font-bold shadow-sm' : 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Workspace
            </button>
          </div>
        </div>

        {/* Status Pills & Controls */}
        <div className="flex items-center gap-3">
          {/* AI Engine Status Pill */}
          <div className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${
            isGolden ? 'bg-[#1a130a] border-amber-500/20' : 'bg-[#141726] border-white/10'
          }`}>
            <span
              className={`w-2 h-2 rounded-full ${
                hasGeminiKey ? 'bg-emerald-400 animate-pulse' : isGolden ? 'bg-amber-400' : 'bg-cyan-400'
              }`}
            />
            <span className="text-slate-300">
              {hasGeminiKey ? 'Gemini 3.8 Flash' : 'AI Engine (Calibrated)'}
            </span>
          </div>

          {/* Usage credits badge for Free / Pro */}
          <div className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
            isGolden
              ? 'bg-amber-950/40 border-amber-500/30 text-amber-200'
              : 'bg-purple-950/40 border-purple-500/30 text-purple-300'
          }`}>
            <Zap className={`w-3.5 h-3.5 ${isGolden ? 'text-amber-400' : 'text-cyan-400'}`} />
            <span>
              {tier === 'Free' ? `${dailyUsageCount}/10 Free Credits` : 'Unlimited Pro AI'}
            </span>
          </div>

          {/* Anime Theme Switcher Button */}
          <button
            onClick={() => setIsThemeModalOpen(true)}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs text-slate-200 transition-all active:scale-95 group ${
              isGolden
                ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-200 shadow-sm'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10'
            }`}
            title="Switch Workspace Anime Theme (White & Golden Brown, Gojo, Naruto, Goku, Cyber)"
            aria-label="Switch Anime Theme"
          >
            <Palette className={`w-3.5 h-3.5 group-hover:rotate-45 transition-transform ${
              isGolden ? 'text-amber-400' : 'text-purple-400'
            }`} />
            <span className="hidden sm:inline font-semibold">{currentThemeConfig.character}</span>
            <span
              className="w-2 h-2 rounded-full inline-block shadow-sm"
              style={{ backgroundColor: currentThemeConfig.primaryColor }}
            />
          </button>

          {/* GitHub Sync & Export Button */}
          <button
            onClick={() => setIsGitHubModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs text-slate-200 transition-all active:scale-95 group ${
              isGolden
                ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-200 shadow-sm'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10'
            }`}
            title="Export Code or Sync to GitHub"
            aria-label="GitHub Export"
          >
            <Github className={`w-3.5 h-3.5 group-hover:scale-110 transition-transform ${isGolden ? 'text-amber-400' : 'text-purple-400'}`} />
            <span className="hidden sm:inline font-semibold">GitHub / Export</span>
          </button>

          {/* Tier Badge / Upgrade Button */}
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all text-white shadow-md active:scale-95 ${
              isGolden
                ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 shadow-amber-600/30 text-black font-extrabold'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/25'
            }`}
            aria-label="Manage Subscription Tier"
          >
            <Crown className={`w-3.5 h-3.5 ${isGolden ? 'text-white' : 'text-amber-300'}`} />
            <span>{tier}</span>
          </button>

          {/* Channel / User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setChannelDropdownOpen(!channelDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#141726] hover:bg-[#1c2035] border border-white/10 transition-colors text-xs text-slate-200"
              aria-expanded={channelDropdownOpen}
              aria-label="Creator Profile Menu"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-[11px]">
                {channelStats.channelName[0]}
              </div>
              <span className="font-semibold hidden sm:inline max-w-[100px] truncate">
                {channelStats.channelName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {channelDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#121422] border border-purple-500/20 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="pb-3 border-b border-white/5">
                  <p className="text-xs text-slate-400">Connected Channel</p>
                  <p className="text-sm font-bold text-white truncate">{channelStats.channelName}</p>
                  <p className="text-xs text-purple-400 font-mono-code">{channelStats.handle}</p>
                </div>

                <div className="py-2 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-300 px-2 py-1">
                    <span>Subscribers:</span>
                    <span className="font-bold text-white">{channelStats.subscribers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300 px-2 py-1">
                    <span>Primary Game:</span>
                    <span className="font-medium text-cyan-300">{channelStats.primaryGame}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300 px-2 py-1">
                    <span>Plan:</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                      {tier}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 space-y-1">
                  <button
                    onClick={() => {
                      setCurrentView('analytics');
                      setChannelDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    <span>Channel Settings & Stats</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>
                  <button
                    onClick={() => {
                      setIsThemeModalOpen(true);
                      setChannelDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-white/5 transition-colors"
                  >
                    <span>Change Anime Theme</span>
                    <Palette className="w-3 h-3 text-purple-400" />
                  </button>
                  <button
                    onClick={() => {
                      setIsUpgradeModalOpen(true);
                      setChannelDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-purple-300 hover:bg-purple-500/10 transition-colors font-medium"
                  >
                    <span>Upgrade Subscription</span>
                    <Crown className="w-3 h-3 text-amber-300" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
