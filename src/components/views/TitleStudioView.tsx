import React, { useState, useEffect } from 'react';
import { useCreator } from '../../context/CreatorContext';
import { GamingTitle } from '../../types';
import { analyzeTitleCTR } from '../../utils/creatorMetrics';
import {
  Type,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  AlertTriangle,
  Flame,
  ArrowRight,
  Loader2,
  Split,
  Eye,
  Sliders,
  CheckCircle2
} from 'lucide-react';

const STYLES = [
  { id: 'curiosity', label: 'Curiosity-Driven', desc: 'Creates an urgent question in viewer mind' },
  { id: 'challenge', label: 'Challenge-Based', desc: '100 days, extreme handicaps, survival stakes' },
  { id: 'funny', label: 'Funny & Comedic', desc: 'Chaos, fail montages, accidental griefing' },
  { id: 'educational', label: 'Educational / Pro Tips', desc: 'Hidden mechanics, secret settings' },
  { id: 'competitive', label: 'Competitive / Ranked', desc: 'High ranks, tournament underdog runs' },
  { id: 'story', label: 'Story-Driven / Mystery', desc: 'Server histories, investigative deep dives' }
];

export const TitleStudioView: React.FC = () => {
  const {
    prefilledTitle,
    prefilledGame,
    saveTitle,
    savedTitles,
    showToast,
    incrementUsage,
    isUsageLimitReached,
    setIsUpgradeModalOpen
  } = useCreator();

  const [game, setGame] = useState<string>(prefilledGame || 'Minecraft');
  const [concept, setConcept] = useState<string>(prefilledTitle || 'Surviving in Hardcore Mode');
  const [selectedStyle, setSelectedStyle] = useState<string>('challenge');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [titles, setTitles] = useState<GamingTitle[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // A/B Comparison state
  const [titleA, setTitleA] = useState<string>('I Survived 100 Days In Hardcore Minecraft');
  const [titleB, setTitleB] = useState<string>('The Secret Minecraft Dimension Nobody Found');

  // Load prefilled if present
  useEffect(() => {
    if (prefilledTitle) {
      setConcept(prefilledTitle);
    }
    if (prefilledGame) {
      setGame(prefilledGame);
    }
  }, [prefilledTitle, prefilledGame]);

  const handleGenerate = async () => {
    if (isUsageLimitReached) {
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game,
          concept,
          style: selectedStyle,
          count: 6
        })
      });

      const data = await response.json();
      if (data.titles && Array.isArray(data.titles)) {
        const enriched: GamingTitle[] = data.titles.map((t: any, idx: number) => ({
          id: t.id || `title-${Date.now()}-${idx}`,
          game,
          title: t.title,
          style: t.style || selectedStyle,
          characterCount: t.title.length,
          estimatedCTR: t.estimatedCTR || 85,
          tagline: t.tagline || 'Optimized for high CTR',
          createdAt: new Date().toISOString()
        }));
        setTitles(enriched);
        if (enriched.length >= 2) {
          setTitleA(enriched[0].title);
          setTitleB(enriched[1].title);
        }
        incrementUsage();
        showToast(`Generated ${enriched.length} titles for ${game}!`);
      }
    } catch (e) {
      console.error(e);
      showToast('Error generating titles. Try again.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Title copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleTitleChange = (id: string, newText: string) => {
    setTitles(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              title: newText,
              characterCount: newText.length
            }
          : t
      )
    );
  };

  const analysisA = analyzeTitleCTR(titleA);
  const analysisB = analyzeTitleCTR(titleB);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-2">
          <Type className="w-3.5 h-3.5" />
          <span>YouTube CTR Optimization</span>
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
          AI Gaming Title Generator & CTR Analyzer
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Craft titles that spark intense curiosity without false clickbait. Automatically checks the 60-character mobile truncation threshold and power-word psychological weight.
        </p>
      </div>

      {/* Input Configuration Card */}
      <div className="p-6 rounded-3xl bg-[#121422] border border-white/10 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Game Name
            </label>
            <input
              type="text"
              value={game}
              onChange={e => setGame(e.target.value)}
              placeholder="e.g. Minecraft, GTA V, Valorant"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e101b] border border-white/10 focus:border-cyan-500 text-sm text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Video Concept or Premise
            </label>
            <input
              type="text"
              value={concept}
              onChange={e => setConcept(e.target.value)}
              placeholder="e.g. Surviving 100 days with only a wooden sword"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e101b] border border-white/10 focus:border-cyan-500 text-sm text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Style Selector Buttons */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Target Formula Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {STYLES.map(style => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`p-3 rounded-xl text-left transition-all border ${
                  selectedStyle === style.id
                    ? 'bg-cyan-600/20 border-cyan-400 text-white shadow-md shadow-cyan-600/20'
                    : 'bg-[#0e101b] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-[#151726]'
                }`}
              >
                <div className="text-xs font-bold">{style.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400">
            Generates 6 algorithmic variations with character meter
          </span>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !concept.trim()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-heading font-black text-xs shadow-xl shadow-cyan-600/25 flex items-center gap-2 transition-all disabled:opacity-50 active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Crafting High-CTR Titles...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Gaming Titles</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Titles List */}
      {titles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-lg text-white">Generated Gaming Titles</h2>
            <span className="text-xs text-slate-400">Click any title to edit text directly</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {titles.map(item => {
              const analysis = analyzeTitleCTR(item.title);
              const isSaved = savedTitles.some(t => t.title === item.title);

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#121422] border border-white/5 hover:border-cyan-500/30 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.title}
                        onChange={e => handleTitleChange(item.id, e.target.value)}
                        className="w-full bg-transparent text-sm sm:text-base font-bold text-white focus:outline-none focus:border-b border-cyan-400 pb-1"
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCopy(item.id, item.title)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        title="Copy Title"
                        aria-label="Copy title"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => saveTitle(item)}
                        className={`p-2 rounded-xl transition-colors ${
                          isSaved
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300'
                        }`}
                        title="Save to Vault"
                        aria-label="Save title"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setTitleA(item.title)}
                        className="px-2.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-xs font-semibold"
                        title="Set as Title A for comparison"
                      >
                        Set as A
                      </button>
                      <button
                        onClick={() => setTitleB(item.title)}
                        className="px-2.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-semibold"
                        title="Set as Title B for comparison"
                      >
                        Set as B
                      </button>
                    </div>
                  </div>

                  {/* Metrics Badge Row */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[11px] ${
                        analysis.score >= 80
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : analysis.score >= 60
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      CTR Score: {analysis.score}/100 ({analysis.rating})
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                        analysis.isMobileTruncated
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {item.characterCount} chars {analysis.isMobileTruncated && '⚠️ Mobile Truncation!'}
                    </span>

                    {analysis.powerWordsDetected.length > 0 && (
                      <span className="text-[11px] text-purple-300 font-medium">
                        Triggers: "{analysis.powerWordsDetected.join(', ')}"
                      </span>
                    )}

                    <span className="text-[11px] text-slate-500 italic ml-auto">
                      {item.tagline}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* A/B Comparison Simulator Card */}
      <div className="p-6 rounded-3xl bg-[#121422] border border-purple-500/20 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <Split className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                YouTube Feed A/B Comparison Simulator
              </h3>
              <p className="text-xs text-slate-400">
                Compare two titles side-by-side inside the YouTube mobile browse layout.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Option A */}
          <div className="p-5 rounded-2xl bg-[#0e101a] border border-purple-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                Candidate Title A
              </span>
              <span className="text-xs font-bold text-emerald-400">
                Score: {analysisA.score}/100
              </span>
            </div>

            <input
              type="text"
              value={titleA}
              onChange={e => setTitleA(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#141626] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
            />

            {/* Mobile Feed Mock */}
            <div className="rounded-xl bg-[#141626] p-3 border border-white/5 space-y-2">
              <div className="aspect-video w-full rounded-lg bg-gradient-to-tr from-purple-900 to-indigo-900 flex items-center justify-center text-xs font-bold text-slate-300">
                16:9 Thumbnail Mockup
              </div>
              <div className="flex gap-2.5 pt-1">
                <div className="w-7 h-7 rounded-full bg-purple-600 shrink-0 flex items-center justify-center text-xs font-bold text-white">
                  G
                </div>
                <div>
                  <div className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {titleA}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Your Channel • 142K views • 2 days ago
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Length: {analysisA.charCount} chars ({analysisA.isMobileTruncated ? 'Over 60 limit' : 'Under 60 limit'})</span>
              </div>
              {analysisA.feedback.map((f, i) => (
                <div key={i} className="text-slate-400">• {f}</div>
              ))}
            </div>
          </div>

          {/* Option B */}
          <div className="p-5 rounded-2xl bg-[#0e101a] border border-cyan-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                Candidate Title B
              </span>
              <span className="text-xs font-bold text-emerald-400">
                Score: {analysisB.score}/100
              </span>
            </div>

            <input
              type="text"
              value={titleB}
              onChange={e => setTitleB(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#141626] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
            />

            {/* Mobile Feed Mock */}
            <div className="rounded-xl bg-[#141626] p-3 border border-white/5 space-y-2">
              <div className="aspect-video w-full rounded-lg bg-gradient-to-tr from-cyan-900 to-indigo-900 flex items-center justify-center text-xs font-bold text-slate-300">
                16:9 Thumbnail Mockup
              </div>
              <div className="flex gap-2.5 pt-1">
                <div className="w-7 h-7 rounded-full bg-cyan-600 shrink-0 flex items-center justify-center text-xs font-bold text-white">
                  G
                </div>
                <div>
                  <div className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {titleB}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Your Channel • 142K views • 2 days ago
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Length: {analysisB.charCount} chars ({analysisB.isMobileTruncated ? 'Over 60 limit' : 'Under 60 limit'})</span>
              </div>
              {analysisB.feedback.map((f, i) => (
                <div key={i} className="text-slate-400">• {f}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
