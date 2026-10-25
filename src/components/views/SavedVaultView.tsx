import React, { useState } from 'react';
import { useCreator } from '../../context/CreatorContext';
import {
  Bookmark,
  Lightbulb,
  Type,
  FileText,
  Image,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  Copy,
  Check
} from 'lucide-react';

export const SavedVaultView: React.FC = () => {
  const {
    savedIdeas,
    removeIdea,
    savedTitles,
    removeTitle,
    savedScripts,
    removeScript,
    savedThumbnails,
    removeThumbnail,
    setCurrentView,
    setPrefilledIdea,
    setPrefilledTitle,
    setPrefilledGame,
    showToast
  } = useCreator();

  const [activeCategory, setActiveCategory] = useState<'all' | 'ideas' | 'titles' | 'scripts' | 'thumbnails'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredIdeas = savedIdeas.filter(i =>
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTitles = savedTitles.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredScripts = savedScripts.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredThumbnails = savedThumbnails.filter(th =>
    th.recommendedText.toLowerCase().includes(searchQuery.toLowerCase()) ||
    th.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = savedIdeas.length + savedTitles.length + savedScripts.length + savedThumbnails.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold mb-2">
          <Bookmark className="w-3.5 h-3.5" />
          <span>Creator Asset Vault</span>
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
          Saved Ideas, Titles, Scripts & Thumbnails
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Your personal library of saved gaming concepts, scripts, and high-CTR titles.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#121422] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[#0e101b] border border-white/5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === 'all' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({totalItems})
          </button>
          <button
            onClick={() => setActiveCategory('ideas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === 'ideas' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Ideas ({savedIdeas.length})
          </button>
          <button
            onClick={() => setActiveCategory('titles')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === 'titles' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Titles ({savedTitles.length})
          </button>
          <button
            onClick={() => setActiveCategory('scripts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === 'scripts' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Scripts ({savedScripts.length})
          </button>
          <button
            onClick={() => setActiveCategory('thumbnails')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === 'thumbnails' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Thumbnails ({savedThumbnails.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved assets..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 rounded-xl bg-[#0e101b] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {totalItems === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#121422] border border-white/10 space-y-4">
          <Bookmark className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="font-heading font-bold text-lg text-white">Your Vault is Empty</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Click "Save to Vault" on any idea, title, or script you generate to organize your collection here.
          </p>
          <button
            onClick={() => setCurrentView('ideas')}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30"
          >
            Generate Your First Idea
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Saved Ideas Section */}
          {(activeCategory === 'all' || activeCategory === 'ideas') && filteredIdeas.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-sm text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                <span>Saved Video Ideas ({filteredIdeas.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredIdeas.map(idea => (
                  <div
                    key={idea.id}
                    className="p-5 rounded-2xl bg-[#121422] border border-white/5 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                          {idea.game}
                        </span>
                        <button
                          onClick={() => removeIdea(idea.id)}
                          className="p-1 text-slate-500 hover:text-red-400"
                          title="Remove from vault"
                          aria-label="Remove idea from vault"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{idea.title}</h4>
                      <p className="text-xs text-slate-300 line-clamp-2">{idea.concept}</p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">{idea.format}</span>
                      <button
                        onClick={() => {
                          setPrefilledIdea(idea);
                          setCurrentView('scripts');
                        }}
                        className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        <span>Open in Script Writer</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Titles Section */}
          {(activeCategory === 'all' || activeCategory === 'titles') && filteredTitles.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-sm text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Type className="w-4 h-4" />
                <span>Saved Titles ({filteredTitles.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredTitles.map(t => (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl bg-[#121422] border border-white/5 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5 max-w-sm truncate">
                      <span className="text-[10px] font-bold text-cyan-300 uppercase">{t.game}</span>
                      <div className="text-xs font-bold text-white truncate">{t.title}</div>
                      <span className="text-[10px] text-slate-400">{t.characterCount} chars</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleCopy(t.id, t.title)}
                        className="p-1.5 text-slate-400 hover:text-white"
                        title="Copy Title"
                        aria-label="Copy title"
                      >
                        {copiedId === t.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => removeTitle(t.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400"
                        title="Delete"
                        aria-label="Delete title"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved Scripts Section */}
          {(activeCategory === 'all' || activeCategory === 'scripts') && filteredScripts.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading font-bold text-sm text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Saved Scripts ({filteredScripts.length})</span>
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {filteredScripts.map(script => (
                  <div
                    key={script.id}
                    className="p-5 rounded-2xl bg-[#121422] border border-white/5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          {script.game}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {script.sections.length} scene sections
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{script.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Tone: {script.tone} • Duration: {script.estimatedDuration}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => removeScript(script.id)}
                        className="p-2 text-slate-500 hover:text-red-400"
                        title="Delete script"
                        aria-label="Delete script"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
