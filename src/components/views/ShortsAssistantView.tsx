import React, { useState } from 'react';
import { useCreator } from '../../context/CreatorContext';
import { ShortsPackage } from '../../types';
import {
  Flame,
  Sparkles,
  Copy,
  Check,
  Calendar,
  Layers,
  Clock,
  Volume2,
  Video,
  Hash,
  Repeat,
  Loader2,
  ArrowRight
} from 'lucide-react';

const SHORTS_ANGLES = [
  'Fast-Paced Mythbuster (0-3s Hook)',
  'Insane 1v5 Clutch / Suspense',
  'Hidden Glitch / Secret Setting',
  'Funny Server Fail / Chaos',
  'Speedrun Trick'
];

export const ShortsAssistantView: React.FC = () => {
  const {
    prefilledGame,
    prefilledTitle,
    addCalendarItem,
    showToast,
    incrementUsage,
    isUsageLimitReached,
    setIsUpgradeModalOpen
  } = useCreator();

  const [game, setGame] = useState<string>(prefilledGame || 'Valorant');
  const [topic, setTopic] = useState<string>(prefilledTitle || 'The 1 Secret Setting That Removes Input Lag');
  const [angle, setAngle] = useState<string>(SHORTS_ANGLES[0]);
  const [duration, setDuration] = useState<string>('45 Seconds');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shortsData, setShortsData] = useState<ShortsPackage | null>(null);

  // Repurposer state
  const [longFormConcept, setLongFormConcept] = useState<string>('');
  const [repurposedIdeas, setRepurposedIdeas] = useState<string[]>([]);
  const [isRepurposing, setIsRepurposing] = useState<boolean>(false);

  // Copy states
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleGenerateShorts = async () => {
    if (isUsageLimitReached) {
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-shorts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game,
          topic,
          angle,
          duration
        })
      });

      const data = await response.json();
      if (data.shorts) {
        setShortsData({
          ...data.shorts,
          id: `shorts-${Date.now()}`,
          game,
          createdAt: new Date().toISOString()
        });
        incrementUsage();
        showToast('Vertical 9:16 Shorts package generated!');
      }
    } catch (e) {
      console.error(e);
      showToast('Error generating Shorts', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepurpose = () => {
    if (!longFormConcept.trim()) return;
    setIsRepurposing(true);
    setTimeout(() => {
      setRepurposedIdeas([
        `Clip 1: The First 3-Minute Disaster ("The exact second our ${game} run was doomed")`,
        `Clip 2: The Secret Trick Isolated ("How we pulled off the impossible glitch at 8:40")`,
        `Clip 3: The Climax 1v1 Reaction ("Watch my friend's instant reaction to losing everything")`
      ]);
      setIsRepurposing(false);
      showToast('Extracted 3 Shorts concepts from your long-form premise!');
    }, 600);
  };

  const handleCopyText = (type: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    showToast(`Copied ${type} to clipboard!`);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleAddToCalendar = () => {
    if (!shortsData) return;
    const nextDate = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
    addCalendarItem({
      title: shortsData.shortTitle,
      game: shortsData.game,
      contentType: 'Short-form (9:16)',
      status: 'Scripting',
      scheduledDate: nextDate,
      notes: `Hook: ${shortsData.retentionHook}`,
      reminderSet: true
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-bold mb-2">
          <Flame className="w-3.5 h-3.5" />
          <span>High-Retention Vertical Studio</span>
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
          YouTube Shorts Assistant & Repurposer
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Engineered for the 0-3s retention swipe test. Crafts scene-by-scene visual cues, dynamic caption styles, trending audio pacing, and viral hashtag packs.
        </p>
      </div>

      {/* Main Generator Card */}
      <div className="p-6 rounded-3xl bg-[#121422] border border-white/10 shadow-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Game
            </label>
            <input
              type="text"
              value={game}
              onChange={e => setGame(e.target.value)}
              placeholder="e.g. Valorant, Minecraft, BGMI"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e101b] border border-white/10 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Shorts Premise or Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Secret setting pros don't show, insane clutch"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e101b] border border-white/10 text-sm text-white focus:outline-none focus:border-red-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Style Angle
            </label>
            <select
              value={angle}
              onChange={e => setAngle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none"
            >
              {SHORTS_ANGLES.map(a => (
                <option key={a} value={a} className="bg-[#121422]">
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Target Duration
            </label>
            <select
              value={duration}
              onChange={e => setDuration(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none"
            >
              <option value="30 Seconds" className="bg-[#121422]">30 Seconds (Ultra-Fast Pacing)</option>
              <option value="45 Seconds" className="bg-[#121422]">45 Seconds (Sweet Spot)</option>
              <option value="59 Seconds" className="bg-[#121422]">59 Seconds (Story Arc)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400">
            Builds 0-3s hook, timestamps, visual direction & tags
          </span>

          <button
            onClick={handleGenerateShorts}
            disabled={isLoading || !topic.trim()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-heading font-black text-xs shadow-xl shadow-red-600/25 flex items-center gap-2 transition-all disabled:opacity-50 active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scripting 9:16 Short...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Shorts Package</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Shorts Result */}
      {shortsData && (
        <div className="p-6 rounded-3xl bg-[#121422] border border-red-500/20 shadow-2xl space-y-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300">
                  {shortsData.game}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  9:16 Vertical
                </span>
              </div>
              <h2 className="font-heading font-black text-xl text-white">
                {shortsData.shortTitle}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddToCalendar}
                className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Schedule Short</span>
              </button>
            </div>
          </div>

          {/* Retention Hook Highlight */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 to-[#141624] border border-red-500/30 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-red-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                <span>Critical 0-3s Swipe Killer Hook</span>
              </span>
              <button
                onClick={() => handleCopyText('Hook', shortsData.retentionHook)}
                className="text-slate-400 hover:text-white flex items-center gap-1 p-1"
                aria-label="Copy swipe killer hook"
              >
                {copiedType === 'Hook' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{copiedType === 'Hook' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-sm font-semibold text-white italic">
              "{shortsData.retentionHook}"
            </p>
          </div>

          {/* Scene-by-Scene Script Breakdown */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-sm text-slate-300 uppercase tracking-wider">
              Scene-by-Scene Pacing & Voiceover
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {shortsData.scenes.map((scene, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#0e101a] border border-white/5 space-y-2 hover:border-red-500/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono-code font-bold text-red-400 px-2 py-0.5 rounded bg-red-500/10">
                      {scene.timestamp}
                    </span>
                    <span className="text-[11px] text-cyan-300 flex items-center gap-1 font-mono-code">
                      <Volume2 className="w-3 h-3" />
                      <span>{scene.soundCue}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">
                        Visual Action / Camera Zoom
                      </div>
                      <div className="text-xs text-slate-300 mt-0.5">
                        {scene.visualAction}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">
                        Spoken Dialogue
                      </div>
                      <div className="text-xs text-white font-medium mt-0.5">
                        "{scene.voiceover}"
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-[11px] text-amber-300">
                    <span className="font-bold">Caption Style:</span>
                    <span>{scene.captionStyle}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hashtag & Description Pack */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#0d0f1a] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-purple-400" />
                  <span>Hashtag Pack</span>
                </span>
                <button
                  onClick={() => handleCopyText('Hashtags', shortsData.recommendedHashtags.join(' '))}
                  className="text-slate-400 hover:text-white flex items-center gap-1"
                  aria-label="Copy hashtags"
                >
                  {copiedType === 'Hashtags' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span className="text-[11px]">{copiedType === 'Hashtags' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs text-cyan-300 font-mono-code">
                {shortsData.recommendedHashtags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-white/5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0d0f1a] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Shorts Description</span>
                <button
                  onClick={() => handleCopyText('Description', shortsData.description)}
                  className="text-slate-400 hover:text-white flex items-center gap-1"
                  aria-label="Copy description"
                >
                  {copiedType === 'Description' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span className="text-[11px]">{copiedType === 'Description' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-300 whitespace-pre-line line-clamp-3">
                {shortsData.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Long-form to Shorts Repurposing Tool */}
      <div className="p-6 rounded-3xl bg-[#121422] border border-purple-500/20 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <Repeat className="w-5 h-5 text-purple-400" />
          <h3 className="font-heading font-bold text-base text-white">
            Long-Video to Shorts Repurposer
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Paste your 15-minute video outline or transcript, and let the AI find the 3 highest-impact viral clips to extract.
        </p>

        <textarea
          rows={3}
          value={longFormConcept}
          onChange={e => setLongFormConcept(e.target.value)}
          placeholder="Paste long-form video concept, summary, or timestamp moments here..."
          className="w-full p-3 rounded-2xl bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
        />

        <div className="flex justify-end">
          <button
            onClick={handleRepurpose}
            disabled={isRepurposing || !longFormConcept.trim()}
            className="px-5 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all flex items-center gap-2"
          >
            {isRepurposing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Extract 3 Shorts Clips</span>
          </button>
        </div>

        {repurposedIdeas.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-white/5">
            {repurposedIdeas.map((idea, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#0e101a] border border-white/5 flex items-center justify-between gap-3 text-xs text-slate-200"
              >
                <span>{idea}</span>
                <button
                  onClick={() => {
                    setTopic(idea);
                    showToast('Transferred clip to Shorts Generator!');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-red-600/20 text-red-300 text-[10px] font-bold hover:bg-red-600/30"
                >
                  Use This Clip
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
