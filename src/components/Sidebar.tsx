import React from 'react';
import { useCreator, AppView } from '../context/CreatorContext';
import {
  LayoutDashboard,
  Lightbulb,
  Type,
  Image,
  Flame,
  FileText,
  Search,
  Calendar,
  BarChart3,
  Bot,
  Bookmark,
  Sparkles,
  ChevronRight,
  Mail
} from 'lucide-react';

interface NavItem {
  id: AppView;
  label: string;
  badge?: string | number;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  category: 'core' | 'planning' | 'analytics';
}

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, savedIdeas, calendarItems, savedScripts, animeTheme } = useCreator();
  const isGolden = animeTheme === 'golden_goku';

  const totalVaultItems = savedIdeas.length + savedScripts.length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Studio Dashboard',
      icon: LayoutDashboard,
      accent: isGolden ? 'text-amber-400' : 'text-purple-400',
      category: 'core'
    },
    {
      id: 'ideas',
      label: 'AI Video Ideas',
      badge: 'Hot',
      icon: Lightbulb,
      accent: 'text-amber-400',
      category: 'core'
    },
    {
      id: 'titles',
      label: 'Title Generator & CTR',
      icon: Type,
      accent: 'text-cyan-400',
      category: 'core'
    },
    {
      id: 'thumbnails',
      label: 'Thumbnail Studio',
      badge: 'Canvas',
      icon: Image,
      accent: 'text-pink-400',
      category: 'core'
    },
    {
      id: 'shorts',
      label: 'YouTube Shorts AI',
      badge: '9:16',
      icon: Flame,
      accent: 'text-red-400',
      category: 'core'
    },
    {
      id: 'scripts',
      label: 'Gaming Script Writer',
      badge: 'Teleprompter',
      icon: FileText,
      accent: 'text-emerald-400',
      category: 'core'
    },
    {
      id: 'seo',
      label: 'YouTube SEO & Tags',
      icon: Search,
      accent: 'text-blue-400',
      category: 'planning'
    },
    {
      id: 'calendar',
      label: 'Content Calendar',
      badge: calendarItems.length > 0 ? calendarItems.length : undefined,
      icon: Calendar,
      accent: 'text-indigo-400',
      category: 'planning'
    },
    {
      id: 'gmail',
      label: 'Creator Mail & Brands',
      badge: 'Gmail',
      icon: Mail,
      accent: 'text-red-400',
      category: 'planning'
    },
    {
      id: 'analytics',
      label: 'Channel Performance',
      icon: BarChart3,
      accent: 'text-emerald-400',
      category: 'analytics'
    },
    {
      id: 'coach',
      label: 'AI Content Coach',
      badge: 'Smart',
      icon: Bot,
      accent: 'text-purple-400',
      category: 'analytics'
    },
    {
      id: 'vault',
      label: 'Saved Vault',
      badge: totalVaultItems > 0 ? totalVaultItems : undefined,
      icon: Bookmark,
      accent: 'text-amber-300',
      category: 'planning'
    }
  ];

  return (
    <aside className={`w-full lg:w-64 shrink-0 flex flex-col justify-between p-3 lg:min-h-[calc(100vh-4rem)] transition-colors ${
      isGolden
        ? 'bg-[#100c07]/80 backdrop-blur-xl border-r border-amber-500/20'
        : 'bg-[#0d0e19] border-r border-purple-500/15'
    }`}>
      <div className="space-y-6">
        {/* Navigation Groups */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Creation Toolkit
          </div>
          <nav className="space-y-1" aria-label="Main Navigation">
            {navItems.filter(item => item.category === 'core').map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                    isActive
                      ? isGolden
                        ? 'bg-amber-500/15 text-white border border-amber-400/40 shadow-sm shadow-amber-500/20'
                        : 'bg-purple-600/20 text-white border border-purple-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${
                      isActive ? (isGolden ? 'text-amber-300' : 'text-purple-400') : item.accent
                    } group-hover:scale-110 transition-transform`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? isGolden ? 'bg-amber-500 text-black' : 'bg-purple-500 text-white'
                          : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Planning & Strategy
          </div>
          <nav className="space-y-1">
            {navItems.filter(item => item.category === 'planning').map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                    isActive
                      ? isGolden
                        ? 'bg-amber-500/15 text-white border border-amber-400/40 shadow-sm shadow-amber-500/20'
                        : 'bg-purple-600/20 text-white border border-purple-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${
                      isActive ? (isGolden ? 'text-amber-300' : 'text-purple-400') : item.accent
                    } group-hover:scale-110 transition-transform`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? isGolden ? 'bg-amber-500 text-black' : 'bg-purple-500 text-white'
                          : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Analytics & Coach
          </div>
          <nav className="space-y-1">
            {navItems.filter(item => item.category === 'analytics').map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                    isActive
                      ? isGolden
                        ? 'bg-amber-500/15 text-white border border-amber-400/40 shadow-sm shadow-amber-500/20'
                        : 'bg-purple-600/20 text-white border border-purple-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${
                      isActive ? (isGolden ? 'text-amber-300' : 'text-purple-400') : item.accent
                    } group-hover:scale-110 transition-transform`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? isGolden ? 'bg-amber-500 text-black' : 'bg-purple-500 text-white'
                          : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mini Creator Tip Box */}
      <div className={`mt-6 p-3 rounded-2xl border transition-colors ${
        isGolden
          ? 'bg-gradient-to-br from-amber-950/40 via-[#181109] to-[#120d07] border-amber-500/25'
          : 'bg-gradient-to-br from-purple-950/40 to-indigo-950/20 border-purple-500/20'
      }`}>
        <div className={`flex items-center gap-2 mb-1.5 text-xs font-bold ${
          isGolden ? 'text-amber-300' : 'text-purple-300'
        }`}>
          <Sparkles className={`w-3.5 h-3.5 ${isGolden ? 'text-amber-300' : 'text-cyan-400'}`} />
          <span>YouTube Pro Tip</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Design your thumbnail and title <span className={isGolden ? 'text-amber-300 font-semibold' : 'text-cyan-300 font-semibold'}>before</span> recording. It shapes your video hook!
        </p>
      </div>
    </aside>
  );
};
