import React, { useState, useRef, useEffect } from 'react';
import { useCreator } from '../../context/CreatorContext';
import { ThumbnailConcept } from '../../types';
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Copy,
  Check,
  Eye,
  Sliders,
  Palette,
  Type,
  Layers,
  Bookmark,
  Smartphone,
  Monitor,
  Flame,
  Loader2
} from 'lucide-react';

const PRESET_BACKGROUNDS = [
  {
    id: 'nether',
    name: 'Nether Storm',
    style: 'linear-gradient(135deg, #1f0202 0%, #7f1d1d 50%, #ea580c 100%)',
    vignette: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.8) 100%)'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    style: 'linear-gradient(135deg, #09090b 0%, #581c87 50%, #06b6d4 100%)',
    vignette: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.85) 100%)'
  },
  {
    id: 'radiant',
    name: 'Radiant Valor',
    style: 'linear-gradient(135deg, #030712 0%, #1e1b4b 50%, #4338ca 100%)',
    vignette: 'radial-gradient(circle, transparent 35%, rgba(0,0,0,0.8) 100%)'
  },
  {
    id: 'toxic',
    name: 'Toxic Glitch',
    style: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #10b981 100%)',
    vignette: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.85) 100%)'
  },
  {
    id: 'gold',
    name: 'Golden Champion',
    style: 'linear-gradient(135deg, #1c1917 0%, #78350f 50%, #eab308 100%)',
    vignette: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.85) 100%)'
  }
];

const PRESET_BADGES = [
  '100 DAYS',
  'IMPOSSIBLE?!',
  'WORLD RECORD',
  'DON\'T DO THIS',
  'BANNED?',
  'NEW UPDATE',
  'VS'
];

export const ThumbnailStudioView: React.FC = () => {
  const {
    prefilledTitle,
    prefilledGame,
    saveThumbnail,
    savedThumbnails,
    showToast,
    incrementUsage,
    isUsageLimitReached,
    setIsUpgradeModalOpen
  } = useCreator();

  const [activeTab, setActiveTab] = useState<'canvas' | 'concepts'>('canvas');
  const [game, setGame] = useState<string>(prefilledGame || 'Minecraft');
  const [title, setTitle] = useState<string>(prefilledTitle || 'I Survived 100 Days In Hardcore');
  const [conceptNotes, setConceptNotes] = useState<string>('Extreme survival challenge with glowing cyan armor');

  // Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedBg, setSelectedBg] = useState<string>(PRESET_BACKGROUNDS[0].id);
  const [customBgUrl, setCustomBgUrl] = useState<string>('');
  
  // Text Overlay State
  const [overlayText, setOverlayText] = useState<string>('100 DAYS?!');
  const [fontSize, setFontSize] = useState<number>(76);
  const [textColor, setTextColor] = useState<string>('#fde047'); // YouTube yellow
  const [strokeColor, setStrokeColor] = useState<string>('#000000');
  const [strokeWidth, setStrokeWidth] = useState<number>(10);
  const [textRotation, setTextRotation] = useState<number>(-4);
  const [posX, setPosX] = useState<number>(640);
  const [posY, setPosY] = useState<number>(360);
  const [selectedBadge, setSelectedBadge] = useState<string>('WORLD RECORD');
  const [showBadge, setShowBadge] = useState<boolean>(true);
  const [showVignette, setShowVignette] = useState<boolean>(true);

  // Mobile In-Feed Simulator state
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);

  // AI Concepts state
  const [isLoadingConcepts, setIsLoadingConcepts] = useState<boolean>(false);
  const [concepts, setConcepts] = useState<ThumbnailConcept[]>([]);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // Redraw Canvas
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed 1280x720 canvas
    canvas.width = 1280;
    canvas.height = 720;

    // Draw Background
    const bgPreset = PRESET_BACKGROUNDS.find(b => b.id === selectedBg) || PRESET_BACKGROUNDS[0];
    
    // Create gradient
    const grad = ctx.createLinearGradient(0, 0, 1280, 720);
    if (selectedBg === 'nether') {
      grad.addColorStop(0, '#1a0505');
      grad.addColorStop(0.5, '#7f1d1d');
      grad.addColorStop(1, '#ea580c');
    } else if (selectedBg === 'cyberpunk') {
      grad.addColorStop(0, '#09090b');
      grad.addColorStop(0.5, '#4c1d95');
      grad.addColorStop(1, '#06b6d4');
    } else if (selectedBg === 'radiant') {
      grad.addColorStop(0, '#020617');
      grad.addColorStop(0.5, '#1e1b4b');
      grad.addColorStop(1, '#3b82f6');
    } else if (selectedBg === 'toxic') {
      grad.addColorStop(0, '#022c22');
      grad.addColorStop(0.5, '#064e3b');
      grad.addColorStop(1, '#10b981');
    } else {
      grad.addColorStop(0, '#1c1917');
      grad.addColorStop(0.5, '#78350f');
      grad.addColorStop(1, '#eab308');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1280, 720);

    // Dynamic grid particle patterns for gaming feel
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1280; x += 60) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 720);
      ctx.stroke();
    }
    for (let y = 0; y < 720; y += 60) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1280, y);
      ctx.stroke();
    }

    // Vignette
    if (showVignette) {
      const radial = ctx.createRadialGradient(640, 360, 200, 640, 360, 750);
      radial.addColorStop(0, 'rgba(0,0,0,0)');
      radial.addColorStop(1, 'rgba(0,0,0,0.85)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, 1280, 720);
    }

    // Top Badge if enabled
    if (showBadge && selectedBadge) {
      ctx.save();
      ctx.translate(180, 90);
      ctx.rotate(-0.06);

      // Badge backdrop
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.roundRect(-120, -30, 240, 60, 12);
      ctx.fill();

      // Badge stroke
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Badge Text
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 28px "Outfit", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedBadge, 0, 0);
      ctx.restore();
    }

    // Draw Center Overlay Text with 3D Outline
    if (overlayText.trim()) {
      ctx.save();
      ctx.translate(posX, posY);
      ctx.rotate((textRotation * Math.PI) / 180);

      ctx.font = `900 ${fontSize}px "Outfit", "Bebas Neue", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Drop shadow glow
      ctx.shadowColor = 'rgba(0,0,0,0.9)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetX = 6;
      ctx.shadowOffsetY = 8;

      // Outer Thick Stroke
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth * 2;
      ctx.lineJoin = 'miter';
      ctx.miterLimit = 2;
      ctx.strokeText(overlayText.toUpperCase(), 0, 0);

      // Fill Color
      ctx.fillStyle = textColor;
      ctx.fillText(overlayText.toUpperCase(), 0, 0);
      ctx.restore();
    }
  };

  useEffect(() => {
    drawCanvas();
  }, [selectedBg, overlayText, fontSize, textColor, strokeColor, strokeWidth, textRotation, posX, posY, showBadge, selectedBadge, showVignette]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${game.toLowerCase()}-thumbnail-1280x720.png`;
    a.click();
    showToast('Thumbnail exported as high-res 1280x720 PNG!');
  };

  const handleGenerateConcepts = async () => {
    if (isUsageLimitReached) {
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsLoadingConcepts(true);
    try {
      const response = await fetch('/api/generate-thumbnail-concept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game,
          title,
          concept: conceptNotes
        })
      });

      const data = await response.json();
      if (data.data?.concepts && Array.isArray(data.data.concepts)) {
        const enriched = data.data.concepts.map((c: any, idx: number) => ({
          ...c,
          id: `thumb-${Date.now()}-${idx}`,
          game,
          createdAt: new Date().toISOString()
        }));
        setConcepts(enriched);
        incrementUsage();
        showToast('Generated 3 YouTube thumbnail visual strategies!');
      }
    } catch (e) {
      console.error(e);
      showToast('Error generating thumbnail concepts', 'warning');
    } finally {
      setIsLoadingConcepts(false);
    }
  };

  const handleApplyConceptToCanvas = (concept: ThumbnailConcept) => {
    setOverlayText(concept.recommendedText);
    setActiveTab('canvas');
    showToast(`Applied "${concept.recommendedText}" to Thumbnail Canvas!`);
  };

  const handleCopyPrompt = (id: string, promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPromptId(id);
    showToast('Image prompt copied to clipboard!');
    setTimeout(() => setCopiedPromptId(null), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold mb-2">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Packaging & Clickability Studio</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
            Thumbnail Concept & Canvas Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Design bold YouTube-style gaming thumbnails with 3D text strokes, high-contrast backdrops, and mobile feed legibility inspection.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 rounded-xl bg-[#121422] border border-white/10 shrink-0">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'canvas'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Canvas Workspace
          </button>
          <button
            onClick={() => setActiveTab('concepts')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'concepts'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Concept Engine
          </button>
        </div>
      </div>

      {activeTab === 'canvas' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Canvas Viewport & Simulator */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-3xl bg-[#121422] border border-white/10 shadow-2xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">16:9 Canvas (1280x720)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    YouTube Ready
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMobilePreview(!isMobilePreview)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isMobilePreview
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{isMobilePreview ? 'Canvas View' : 'Mobile Feed Test'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/30 active:scale-95 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PNG</span>
                  </button>
                </div>
              </div>

              {/* Render Canvas or Mobile Feed Mock */}
              {!isMobilePreview ? (
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-purple-500/20 flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                /* Mobile Feed Legibility Test */
                <div className="p-6 rounded-2xl bg-[#090a10] border border-cyan-500/30 space-y-4">
                  <div className="text-xs text-cyan-300 font-bold flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <span>Simulated YouTube Mobile Feed (Smartphone Screen View)</span>
                  </div>
                  <div className="max-w-xs mx-auto rounded-2xl bg-[#141624] p-3 border border-white/10 space-y-2 shadow-2xl">
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                      <canvas
                        ref={canvasRef}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex gap-2.5 pt-1">
                      <div className="w-7 h-7 rounded-full bg-purple-600 shrink-0 flex items-center justify-center text-xs font-bold text-white">
                        V
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white line-clamp-2">
                          {title}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          ViperX Gaming • 85K views • 4 hours ago
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 text-center">
                    Rule of thumb: If your thumbnail text cannot be read on this 100px-wide card, increase font size or reduce to 2-3 words.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Controls Panel */}
          <div className="p-6 rounded-3xl bg-[#121422] border border-white/10 shadow-xl space-y-5">
            <h3 className="font-heading font-bold text-base text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Canvas Styling Controls</span>
            </h3>

            {/* Background Theme */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">
                Atmosphere Background
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_BACKGROUNDS.map(bg => (
                  <button
                    key={bg.id}
                    onClick={() => setSelectedBg(bg.id)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      selectedBg === bg.id
                        ? 'border-purple-400 bg-purple-600/20 text-white font-bold'
                        : 'border-white/5 bg-[#0e101a] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs">{bg.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Overlay Text Input */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">
                Thumbnail Text (Keep to 2-4 Words)
              </label>
              <input
                type="text"
                value={overlayText}
                onChange={e => setOverlayText(e.target.value)}
                placeholder="e.g. 100 DAYS?!, IMPOSSIBLE"
                className="w-full px-3 py-2 rounded-xl bg-[#0e101b] border border-white/10 text-sm font-bold text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Color Pickers */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Text Fill
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={e => setTextColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono-code text-slate-300">{textColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">
                  Outline Stroke
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={strokeColor}
                    onChange={e => setStrokeColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono-code text-slate-300">{strokeColor}</span>
                </div>
              </div>
            </div>

            {/* Sliders: Size, Stroke Width, Rotation */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Font Size</span>
                  <span className="font-mono-code">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="120"
                  value={fontSize}
                  onChange={e => setFontSize(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>3D Outline Thickness</span>
                  <span className="font-mono-code">{strokeWidth}px</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="20"
                  value={strokeWidth}
                  onChange={e => setStrokeWidth(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Angle Rotation</span>
                  <span className="font-mono-code">{textRotation}°</span>
                </div>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  value={textRotation}
                  onChange={e => setTextRotation(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Vertical Position (Y)</span>
                  <span className="font-mono-code">{posY}px</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="600"
                  value={posY}
                  onChange={e => setPosY(parseInt(e.target.value, 10))}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>

            {/* Stickers & Badges */}
            <div className="pt-2 border-t border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400">Corner Gaming Badge</span>
                <button
                  onClick={() => setShowBadge(!showBadge)}
                  className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
                >
                  {showBadge ? 'Hide' : 'Show'}
                </button>
              </div>

              {showBadge && (
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_BADGES.map(b => (
                    <button
                      key={b}
                      onClick={() => setSelectedBadge(b)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        selectedBadge === b
                          ? 'bg-red-600 text-white'
                          : 'bg-[#0e101a] text-slate-400 hover:text-slate-200 border border-white/5'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* AI Concept Generator Tab */
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#121422] border border-white/10 shadow-xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  Game
                </label>
                <input
                  type="text"
                  value={game}
                  onChange={e => setGame(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none"
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
                  className="w-full px-3 py-2 rounded-xl bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  Concept / Visual Elements
                </label>
                <input
                  type="text"
                  value={conceptNotes}
                  onChange={e => setConceptNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e101b] border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleGenerateConcepts}
                disabled={isLoadingConcepts}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-heading font-black text-xs shadow-xl shadow-pink-600/25 flex items-center gap-2 transition-all disabled:opacity-50 active:scale-95"
              >
                {isLoadingConcepts ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Planning Visual Compositions...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate 3 Thumbnail Concepts</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Concepts Grid */}
          {concepts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {concepts.map(c => {
                const isSaved = savedThumbnails.some(item => item.id === c.id);

                return (
                  <div
                    key={c.id}
                    className="p-6 rounded-3xl bg-[#121422] border border-pink-500/20 hover:border-pink-500/40 shadow-xl flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500/20 text-pink-300">
                          {c.name}
                        </span>
                        <button
                          onClick={() => saveThumbnail(c)}
                          className={`p-1.5 rounded-lg ${
                            isSaved ? 'text-amber-300' : 'text-slate-400 hover:text-white'
                          }`}
                          title="Save to Vault"
                          aria-label="Save thumbnail concept"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-[#0e101a] border border-white/5">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">
                          Recommended Thumbnail Text
                        </div>
                        <div className="text-xl font-heading font-black text-amber-300 mt-1">
                          "{c.recommendedText}"
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-slate-300">
                        <div>
                          <span className="text-slate-400 font-medium">Focal Point:</span> {c.focalPoint}
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Expression:</span> {c.emotionOrAction}
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Color Palette:</span> {c.colorPalette}
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Composition Tip:</span> {c.compositionTip}
                        </div>
                      </div>

                      {/* Ready-to-copy AI Image Prompt */}
                      <div className="p-3 rounded-xl bg-[#090b14] border border-white/5 space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-bold text-cyan-400 uppercase">
                          <span>AI Art Generation Prompt</span>
                          <button
                            onClick={() => handleCopyPrompt(c.id, c.aiImagePrompt)}
                            className="flex items-center gap-1 text-slate-400 hover:text-white"
                            aria-label="Copy AI art generation prompt"
                          >
                            {copiedPromptId === c.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedPromptId === c.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-3 font-mono-code leading-relaxed">
                          {c.aiImagePrompt}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplyConceptToCanvas(c)}
                      className="w-full py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all"
                    >
                      Apply Text to Canvas Workspace
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
