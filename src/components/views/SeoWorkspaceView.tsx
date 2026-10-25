import React, { useState } from 'react';
import { useCreator } from '../../context/CreatorContext';
import { calculateTagBudget } from '../../utils/creatorMetrics';
import {
  Search,
  Sparkles,
  Copy,
  Check,
  CheckSquare,
  Square,
  AlertCircle,
  Hash,
  MessageSquare,
  ListOrdered,
  FileText,
  Loader2,
  ShieldAlert
} from 'lucide-react';

export const SeoWorkspaceView: React.FC = () => {
  const {
    prefilledGame,
    prefilledTitle,
    showToast,
    incrementUsage,
    isUsageLimitReached,
    setIsUpgradeModalOpen
  } = useCreator();

  const [game, setGame] = useState<string>(prefilledGame || 'Minecraft');
  const [title, setTitle] = useState<string>(prefilledTitle || 'I Survived 100 Days In Hardcore');
  const [concept, setConcept] = useState<string>('Surviving 100 days with strict handicaps');
  const [targetKeywords, setTargetKeywords] = useState<string>('minecraft 100 days, hardcore survival, tips');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [seoData, setSeoData] = useState<any | null>(null);

  // Editable Tag List
  const [tagInput, setTagInput] = useState<string>('minecraft, minecraft hardcore, 100 days, gaming, tips, lets play');
  const [checklistState, setChecklistState] = useState<Record<number, boolean>>({});
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const tagBudget = calculateTagBudget(tagInput);

  const handleGenerateSeo = async () => {
    if (isUsageLimitReached) {
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game,
          title,
          concept,
          targetKeywords
        })
      });

      const data = await response.json();
      if (data.seo) {
        setSeoData(data.seo);
        if (data.seo.tagList) {
          setTagInput(data.seo.tagList.join(', '));
        }
        incrementUsage();
        showToast('Generated YouTube SEO description & tag budget!');
      }
    } catch (e) {
      console.error(e);
      showToast('Error generating SEO package', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (sectionName: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    showToast(`Copied ${sectionName} to clipboard!`);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const toggleChecklistItem = (idx: number) => {
    setChecklistState(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold mb-2">
          <Search className="w-3.5 h-3.5" />
          <span>YouTube Algorithm Packaging</span>
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
          YouTube SEO Workspace & Upload Checklist
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Format high-ranking video descriptions, chapters, pinned comments, and tags staying strictly within YouTube's 500-character budget.
        </p>
      </div>

      {/* Inputs Card */}
      <div className="p-6 rounded-3xl bg-[#121422] border border-white/10 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Game
            </label>
            <input
              type="text"
              value={game}
              onChange={e => setGame(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Video Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1.5">
            Focus Search Keywords (comma-separated)
          </label>
          <input
            type="text"
            value={targetKeywords}
            onChange={e => setTargetKeywords(e.target.value)}
            placeholder="e.g. gameplay, walkthrough, update review, guide"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          {/* Data Disclaimer notice */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>AI search suggestions are algorithmic models, not live YouTube Search Volume API.</span>
          </div>

          <button
            onClick={handleGenerateSeo}
            disabled={isLoading || !title.trim()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-heading font-black text-xs shadow-xl shadow-blue-600/25 flex items-center gap-2 transition-all disabled:opacity-50 active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Optimizing SEO Metadata...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate SEO Package</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tag Budget Optimizer Gauge */}
      <div className="p-6 rounded-3xl bg-[#121422] border border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-cyan-400" />
            <h3 className="font-heading font-bold text-base text-white">
              YouTube 500-Character Tag Budget Meter
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                tagBudget.exceededLimit
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : tagBudget.remainingChars < 50
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-cyan-500/20 text-cyan-300'
              }`}
            >
              {tagBudget.totalChars} / 500 characters used ({tagBudget.remainingChars} remaining)
            </span>

            <button
              onClick={() => handleCopy('Tags', tagBudget.formattedCommaString)}
              className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
            >
              {copiedSection === 'Tags' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'Tags' ? 'Copied' : 'Copy Tags'}</span>
            </button>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-[#0e101a] overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              tagBudget.exceededLimit
                ? 'bg-red-500'
                : tagBudget.totalChars > 420
                ? 'bg-emerald-400'
                : 'bg-cyan-400'
            }`}
            style={{ width: `${Math.min(100, (tagBudget.totalChars / 500) * 100)}%` }}
          />
        </div>

        <textarea
          rows={3}
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          placeholder="Comma-separated tags (e.g. minecraft, hardcore, 100 days)..."
          className="w-full p-3 rounded-2xl bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono-code"
        />

        <div className="flex flex-wrap gap-1.5 pt-1">
          {tagBudget.validTags.map((tag, i) => (
            <span
              key={i}
              className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* SEO Description & Chapters */}
      {seoData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Description Block */}
          <div className="p-6 rounded-3xl bg-[#121422] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Formatted YouTube Description</span>
              </span>
              <button
                onClick={() => handleCopy('Description', seoData.description)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'Description' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSection === 'Description' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <textarea
              rows={12}
              value={seoData.description}
              onChange={e => setSeoData({ ...seoData, description: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#0e101b] border border-white/10 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-blue-400 whitespace-pre-wrap font-mono-code"
            />
          </div>

          {/* Right Column: Search Phrases & Pinned Comments */}
          <div className="space-y-6">
            {/* Search Queries */}
            <div className="p-6 rounded-3xl bg-[#121422] border border-white/10 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Search className="w-4 h-4 text-cyan-400" />
                <span>Target Search Queries Viewers Type</span>
              </div>
              <div className="space-y-1.5">
                {seoData.searchPhrases?.map((phrase: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#0e101a] border border-white/5 text-xs text-slate-200 flex items-center justify-between"
                  >
                    <span>{phrase}</span>
                    <button
                      onClick={() => handleCopy('Phrase', phrase)}
                      className="text-slate-400 hover:text-white p-1"
                      aria-label="Copy search phrase"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pinned Comment Prompts */}
            <div className="p-6 rounded-3xl bg-[#121422] border border-white/10 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>Pinned Comment Engagement Prompts</span>
              </div>
              <div className="space-y-2">
                {seoData.pinnedCommentPrompt?.map((prompt: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#0e101a] border border-white/5 text-xs text-slate-200 flex items-start justify-between gap-2"
                  >
                    <p className="italic leading-relaxed">{prompt}</p>
                    <button
                      onClick={() => handleCopy('Pinned Comment', prompt)}
                      className="text-slate-400 hover:text-white p-1 shrink-0"
                      aria-label="Copy pinned comment"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pre-Upload Quality Checklist */}
      <div className="p-6 rounded-3xl bg-[#121422] border border-purple-500/20 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-purple-400" />
            <h3 className="font-heading font-bold text-base text-white">
              Pre-Upload Verification Checklist
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {Object.values(checklistState).filter(Boolean).length} / 6 tasks verified
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'Thumbnail text verified at 100px mobile feed size (clear & legible)',
            'Title is strictly under 60 characters to avoid YouTube mobile clipping',
            'First 3-5 seconds delivers the exact hook promised by thumbnail',
            'Voiceover audio balanced cleanly over background music / sound effects',
            'End-screens & interactive video cards configured in YouTube Studio',
            'Pinned engagement question ready to paste right after publish'
          ].map((item, idx) => {
            const isChecked = !!checklistState[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleChecklistItem(idx)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  isChecked
                    ? 'bg-purple-950/20 border-purple-500/40 text-white'
                    : 'bg-[#0e101a] border-white/5 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <span className={`text-xs ${isChecked ? 'line-through text-slate-400' : ''}`}>
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
