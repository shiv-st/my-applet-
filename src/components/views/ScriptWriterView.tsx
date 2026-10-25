import React, { useState, useEffect, useRef } from 'react';
import { useCreator } from '../../context/CreatorContext';
import { GamingScript, ScriptSection } from '../../types';
import { estimateScriptDuration, CreatorTone } from '../../utils/creatorMetrics';
import {
  FileText,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Bookmark,
  Download,
  Clock,
  Video,
  Mic,
  Volume2,
  Loader2,
  Sliders
} from 'lucide-react';

const SCRIPT_TYPES = [
  'Gameplay Commentary',
  'Funny Gaming Moments & Chaos',
  'Challenge Video (100 Days / Hardcore)',
  'Tutorial & Step-by-Step Guide',
  'Game Update & Patch Notes',
  'Game Review / Impressions',
  'Livestream Intro & Hype Opener',
  'Video Outro & High-Engagement CTA'
];

const TONES: { id: CreatorTone; label: string; desc: string }[] = [
  { id: 'energetic', label: 'Energetic & Fast', desc: 'Standard upbeat YouTube pacing (160 WPM)' },
  { id: 'hype', label: 'Hype Beast / Extreme', desc: 'High adrenaline, scream reactions (175 WPM)' },
  { id: 'comedic', label: 'Comedic / Sarcastic', desc: 'Meme humor, playful pauses (150 WPM)' },
  { id: 'analytical', label: 'Analytical / Pro', desc: 'Deep dive, calm tactical breakdown (125 WPM)' },
  { id: 'chill', label: 'Chill / Casual Play', desc: 'Relaxed storytelling, cozy vibes (110 WPM)' }
];

const DURATIONS = ['3 Minutes', '5 Minutes', '8 Minutes (Mid-roll Friendly)', '15 Minutes (Deep Play)'];

export const ScriptWriterView: React.FC = () => {
  const {
    prefilledIdea,
    prefilledTitle,
    prefilledGame,
    saveScript,
    savedScripts,
    showToast,
    incrementUsage,
    isUsageLimitReached,
    setIsUpgradeModalOpen
  } = useCreator();

  const [game, setGame] = useState<string>(prefilledGame || (prefilledIdea?.game) || 'Minecraft');
  const [concept, setConcept] = useState<string>(prefilledTitle || (prefilledIdea?.concept) || 'I Survived 100 Days In Hardcore');
  const [scriptType, setScriptType] = useState<string>(SCRIPT_TYPES[0]);
  const [tone, setTone] = useState<CreatorTone>('energetic');
  const [duration, setDuration] = useState<string>(DURATIONS[1]);
  const [language, setLanguage] = useState<string>('English');
  const [audience, setAudience] = useState<string>('General Gamers');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeScript, setActiveScript] = useState<GamingScript | null>(null);

  // Teleprompter State
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState<boolean>(false);
  const [isPrompterScrolling, setIsPrompterScrolling] = useState<boolean>(false);
  const [prompterSpeed, setPrompterSpeed] = useState<number>(1.2);
  const [prompterFontSize, setPrompterFontSize] = useState<number>(24);
  const prompterContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollAnimRef = useRef<number | null>(null);

  // Copy & Export
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  useEffect(() => {
    if (prefilledIdea) {
      setGame(prefilledIdea.game);
      setConcept(prefilledIdea.title + ' — ' + prefilledIdea.concept);
    }
  }, [prefilledIdea]);

  const handleGenerateScript = async () => {
    if (isUsageLimitReached) {
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game,
          concept,
          scriptType,
          tone,
          duration,
          audience,
          language
        })
      });

      const data = await response.json();
      if (data.script) {
        const enriched: GamingScript = {
          ...data.script,
          id: `script-${Date.now()}`,
          game,
          scriptType,
          tone,
          createdAt: new Date().toISOString()
        };
        setActiveScript(enriched);
        incrementUsage();
        showToast('Generated 2-column gaming script!');
      }
    } catch (e) {
      console.error(e);
      showToast('Error generating script', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSection = (index: number, field: keyof ScriptSection, value: string) => {
    if (!activeScript) return;
    const newSections = [...activeScript.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setActiveScript({ ...activeScript, sections: newSections });
  };

  // Teleprompter auto-scroll loop
  useEffect(() => {
    if (isTeleprompterOpen && isPrompterScrolling) {
      const scrollStep = () => {
        if (prompterContainerRef.current) {
          prompterContainerRef.current.scrollTop += prompterSpeed;
        }
        scrollAnimRef.current = requestAnimationFrame(scrollStep);
      };
      scrollAnimRef.current = requestAnimationFrame(scrollStep);
    } else {
      if (scrollAnimRef.current) {
        cancelAnimationFrame(scrollAnimRef.current);
      }
    }
    return () => {
      if (scrollAnimRef.current) cancelAnimationFrame(scrollAnimRef.current);
    };
  }, [isTeleprompterOpen, isPrompterScrolling, prompterSpeed]);

  const handleSaveToVault = () => {
    if (!activeScript) return;
    saveScript(activeScript);
  };

  const handleCopyFullScript = () => {
    if (!activeScript) return;
    const markdown = `# ${activeScript.title}\nGame: ${activeScript.game}\nTone: ${activeScript.tone}\nDuration: ${activeScript.estimatedDuration}\n\n` +
      activeScript.sections.map(s => `## ${s.sectionName}\n[VISUAL]: ${s.visualCues}\n[AUDIO]: ${s.spokenDialogue}\n[SFX]: ${s.soundFx}\n`).join('\n') +
      `\n\n## Outro / Call To Action\n${activeScript.outroCta}`;

    navigator.clipboard.writeText(markdown);
    setCopiedScript(true);
    showToast('Complete script copied to clipboard (Markdown)!');
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleExportTxt = () => {
    if (!activeScript) return;
    const markdown = `# ${activeScript.title}\nGame: ${activeScript.game}\n\n` +
      activeScript.sections.map(s => `## ${s.sectionName}\n[VISUAL]: ${s.visualCues}\n[AUDIO]: ${s.spokenDialogue}\n[SFX]: ${s.soundFx}\n`).join('\n') +
      `\n\n## Outro\n${activeScript.outroCta}`;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeScript.game.toLowerCase()}-script.md`;
    a.click();
    showToast('Script downloaded as .md!');
  };

  // Word count & Duration calculation
  const totalWords = activeScript
    ? activeScript.sections.reduce((acc, s) => acc + s.spokenDialogue.split(/\s+/).filter(Boolean).length, 0)
    : 0;
  const timing = estimateScriptDuration(totalWords, tone);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
          <FileText className="w-3.5 h-3.5" />
          <span>Production-Ready Commentary & Direction</span>
        </div>
        <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
          Gaming Script Writer & Teleprompter
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Generates synchronized 2-column video scripts pairing in-game visual actions with spoken commentary lines, sound effects, and a live teleprompter.
        </p>
      </div>

      {/* Generator Configuration Card */}
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
              placeholder="e.g. Minecraft, GTA V, Valorant"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e101b] border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Video Concept or Challenge
            </label>
            <input
              type="text"
              value={concept}
              onChange={e => setConcept(e.target.value)}
              placeholder="e.g. Surviving 100 days trapped in a lava fortress"
              className="w-full px-4 py-2.5 rounded-xl bg-[#0e101b] border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Script Type & Tone Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Script Format
            </label>
            <select
              value={scriptType}
              onChange={e => setScriptType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none"
            >
              {SCRIPT_TYPES.map(type => (
                <option key={type} value={type} className="bg-[#121422]">
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5">
              Creator Tone & Persona
            </label>
            <select
              value={tone}
              onChange={e => setTone(e.target.value as CreatorTone)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none"
            >
              {TONES.map(t => (
                <option key={t.id} value={t.id} className="bg-[#121422]">
                  {t.label}
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
              {DURATIONS.map(d => (
                <option key={d} value={d} className="bg-[#121422]">
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-400">
            Builds dual-column visual & spoken commentary timeline
          </span>

          <button
            onClick={handleGenerateScript}
            disabled={isLoading || !concept.trim()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-heading font-black text-xs shadow-xl shadow-emerald-600/25 flex items-center gap-2 transition-all disabled:opacity-50 active:scale-95"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scripting Full Video...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Video Script</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Script Workspace */}
      {activeScript && (
        <div className="p-6 rounded-3xl bg-[#121422] border border-emerald-500/20 shadow-2xl space-y-6">
          {/* Script Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  {activeScript.game}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  {activeScript.tone.toUpperCase()}
                </span>
                <span className="text-xs text-slate-400">
                  {totalWords} words • ~{timing.formattedDuration} read time
                </span>
              </div>
              <h2 className="font-heading font-black text-xl text-white">
                {activeScript.title}
              </h2>
            </div>

            {/* Actions: Teleprompter, Copy, Save */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsTeleprompterOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all active:scale-95"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Launch Teleprompter</span>
              </button>

              <button
                onClick={handleCopyFullScript}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Copy Full Script"
                aria-label="Copy full script"
              >
                {copiedScript ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={handleExportTxt}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Download Markdown"
                aria-label="Download markdown script"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={handleSaveToVault}
                className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save to Vault</span>
              </button>
            </div>
          </div>

          {/* Hook Formula Note */}
          {activeScript.hookFormula && (
            <div className="p-3.5 rounded-2xl bg-[#0e101a] border border-cyan-500/20 text-xs text-slate-300">
              <span className="font-bold text-cyan-400">Hook Strategy:</span> {activeScript.hookFormula}
            </div>
          )}

          {/* 2-Column Script Table */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-400" />
                <span>Visuals & Gameplay Screen Cues (Editable)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-emerald-400" />
                <span>Spoken Commentary & Dialogue (Editable)</span>
              </div>
            </div>

            <div className="space-y-4">
              {activeScript.sections.map((section, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#0e101a] border border-white/5 space-y-3 hover:border-emerald-500/20 transition-colors"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="font-heading font-bold text-sm text-emerald-400">
                      {section.sectionName}
                    </span>
                    <span className="text-[11px] text-cyan-300 flex items-center gap-1 font-mono-code">
                      <Volume2 className="w-3 h-3 text-cyan-400" />
                      <span>{section.soundFx}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Visual Cues Edit */}
                    <div>
                      <textarea
                        rows={3}
                        value={section.visualCues}
                        onChange={e => handleUpdateSection(idx, 'visualCues', e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#141624] border border-white/5 text-xs text-slate-300 leading-relaxed focus:outline-none focus:border-purple-400 resize-y"
                      />
                    </div>

                    {/* Spoken Dialogue Edit */}
                    <div>
                      <textarea
                        rows={3}
                        value={section.spokenDialogue}
                        onChange={e => handleUpdateSection(idx, 'spokenDialogue', e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-[#141624] border border-white/5 text-xs text-white leading-relaxed focus:outline-none focus:border-emerald-400 resize-y font-medium"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outro Call to Action */}
          <div className="p-4 rounded-2xl bg-[#0d0f1a] border border-white/5 space-y-1.5">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Outro & High-Engagement Call To Action
            </div>
            <p className="text-xs text-slate-200">
              {activeScript.outroCta}
            </p>
          </div>
        </div>
      )}

      {/* Teleprompter Full-Screen Modal */}
      {isTeleprompterOpen && activeScript && (
        <div className="fixed inset-0 z-50 bg-[#090a10] flex flex-col p-6 animate-in fade-in duration-200">
          {/* Prompter Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                Live Teleprompter
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {activeScript.title}
              </h2>
            </div>

            {/* Controls: Play/Pause, Speed, Font Size, Close */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#141624] px-3 py-1.5 rounded-xl border border-white/10">
                <span className="text-xs text-slate-400">Speed:</span>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={prompterSpeed}
                  onChange={e => setPrompterSpeed(parseFloat(e.target.value))}
                  className="w-20 accent-purple-500"
                />
                <span className="text-xs font-mono-code text-white">{prompterSpeed}x</span>
              </div>

              <div className="flex items-center gap-2 bg-[#141624] px-3 py-1.5 rounded-xl border border-white/10">
                <span className="text-xs text-slate-400">Size:</span>
                <input
                  type="range"
                  min="18"
                  max="44"
                  value={prompterFontSize}
                  onChange={e => setPrompterFontSize(parseInt(e.target.value, 10))}
                  className="w-16 accent-purple-500"
                />
              </div>

              <button
                onClick={() => setIsPrompterScrolling(!isPrompterScrolling)}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  isPrompterScrolling
                    ? 'bg-amber-500 hover:bg-amber-400 text-black'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/30'
                }`}
              >
                {isPrompterScrolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPrompterScrolling ? 'Pause' : 'Auto-Scroll'}</span>
              </button>

              <button
                onClick={() => {
                  if (prompterContainerRef.current) prompterContainerRef.current.scrollTop = 0;
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white"
                title="Restart"
                aria-label="Restart teleprompter"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsTeleprompterOpen(false);
                  setIsPrompterScrolling(false);
                }}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold"
              >
                Exit Prompter
              </button>
            </div>
          </div>

          {/* Scrolling Content Area */}
          <div
            ref={prompterContainerRef}
            className="flex-1 overflow-y-auto py-16 px-4 max-w-3xl mx-auto w-full space-y-12 select-none"
            style={{ fontSize: `${prompterFontSize}px`, lineHeight: 1.6 }}
          >
            {activeScript.sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <div className="text-sm font-bold uppercase tracking-widest text-emerald-400 pb-1 border-b border-emerald-500/20">
                  {section.sectionName}
                </div>
                <div className="text-sm text-cyan-300 italic font-mono-code">
                  [ACTION]: {section.visualCues}
                </div>
                <div className="font-semibold text-white">
                  {section.spokenDialogue}
                </div>
              </div>
            ))}

            <div className="space-y-2 pt-6 border-t border-white/10">
              <div className="text-sm font-bold uppercase tracking-widest text-amber-400">
                Outro & CTA
              </div>
              <div className="font-semibold text-slate-200">
                {activeScript.outroCta}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
