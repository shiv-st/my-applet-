import React from 'react';
import { useCreator } from '../context/CreatorContext';
import { ANIME_THEMES } from '../utils/animeThemes';
import { AnimeThemeId } from '../types';
import { Sparkles, Check, X, Eye, Sliders } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AnimeThemeSwitcher: React.FC<Props> = ({ isOpen, onClose }) => {
  const { animeTheme, setAnimeTheme, bgTranslucency, setBgTranslucency, showToast } = useCreator();

  if (!isOpen) return null;

  const handleSelect = (id: AnimeThemeId) => {
    setAnimeTheme(id);
    const theme = ANIME_THEMES[id];
    showToast(`Switched theme to ${theme.name} (${theme.character})`, 'info');
  };

  const isCurrentGolden = animeTheme === 'golden_goku';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className={`relative w-full max-w-2xl my-auto max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl p-6 sm:p-8 transition-colors ${
        isCurrentGolden
          ? 'bg-[#120e09] border-amber-500/30'
          : 'bg-[#0f111d] border-white/10'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              isCurrentGolden
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-purple-500/10 border-purple-500/20 text-purple-400'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-black text-xl text-white">Creator Studio Theme Engine</h2>
              <p className="text-xs text-slate-400">Select an anime visual aesthetic & configure background translucency</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            aria-label="Close theme selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Translucency Intensity Selector */}
        <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-xs font-bold text-white">Background Translucency</div>
              <div className="text-[11px] text-slate-400">Control how clearly the background wallpaper shows through</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5">
            {(
              [
                { id: 'subtle', label: 'Subtle 35%' },
                { id: 'balanced', label: 'Balanced 55%' },
                { id: 'vivid', label: 'Vivid 72%' },
              ] as const
            ).map(opt => (
              <button
                key={opt.id}
                onClick={() => {
                  setBgTranslucency(opt.id);
                  showToast(`Background translucency set to ${opt.label}`, 'info');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  bgTranslucency === opt.id
                    ? 'bg-amber-500 text-black font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {(Object.keys(ANIME_THEMES) as AnimeThemeId[]).map(themeId => {
            const item = ANIME_THEMES[themeId];
            const isSelected = animeTheme === themeId;
            const isGoldenTheme = item.id === 'golden_goku';

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`relative text-left rounded-2xl p-4 transition-all overflow-hidden border group ${
                  isSelected
                    ? `${item.borderClass} ${isGoldenTheme ? 'bg-amber-500/10' : 'bg-white/[0.06]'} shadow-xl ${item.glowClass}`
                    : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20'
                }`}
              >
                {/* Background visual snippet */}
                {item.bgImageUrl ? (
                  <div className="absolute inset-0 z-0 opacity-30 group-hover:opacity-50 transition-opacity">
                    <img
                      src={item.bgImageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${
                      isGoldenTheme
                        ? 'from-[#120e09] via-[#120e09]/75 to-transparent'
                        : 'from-[#0f111d] via-[#0f111d]/70 to-transparent'
                    }`} />
                  </div>
                ) : (
                  <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-950/20 via-[#0d0f1a] to-black opacity-40" />
                )}

                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                        {item.anime}
                      </span>
                      {isGoldenTheme && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                          Active Request
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        isGoldenTheme
                          ? 'bg-amber-500/20 border border-amber-400 text-amber-300'
                          : 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-400'
                      }`}>
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-black text-base text-white group-hover:text-amber-200 transition-colors">
                        {item.name}
                      </h3>
                      {/* Color dots for White & Golden Brown */}
                      {isGoldenTheme && (
                        <div className="flex items-center -space-x-1" title="White & Golden Brown palette">
                          <span className="w-2.5 h-2.5 rounded-full bg-white border border-black/40 shadow-sm" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-black/40 shadow-sm" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#78350f] border border-black/40 shadow-sm" />
                        </div>
                      )}
                    </div>
                    <p className={`text-xs font-semibold ${item.accentClass}`}>
                      {item.tagline}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-300 italic line-clamp-2">
                    "{item.quote}"
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>Theme & background translucency persist automatically.</span>
          <button
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl text-white font-bold transition-all text-xs shadow-lg active:scale-95 ${
              isCurrentGolden
                ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 shadow-amber-500/25'
                : 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/25'
            }`}
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
