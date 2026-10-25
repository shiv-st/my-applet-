import React, { useState } from 'react';
import { useCreator } from '../../context/CreatorContext';
import {
  DollarSign,
  TrendingUp,
  Award,
  Flame,
  ArrowUpRight,
  Sparkles,
  Zap,
  BarChart2,
  Clock,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Gamepad2,
  ChevronRight,
  ShieldAlert,
  Play
} from 'lucide-react';

// ==========================================
// 1. REVENUE CALCULATOR WIDGET
// ==========================================
export const RevenueCalculatorWidget: React.FC = () => {
  const [monthlyViews, setMonthlyViews] = useState<number>(250000);
  const [rpmRate, setRpmRate] = useState<number>(4.5);
  const [sponsorDealsPerMonth, setSponsorDealsPerMonth] = useState<number>(1);
  const [sponsorCpm, setSponsorCpm] = useState<number>(25);

  const adSenseRevenue = (monthlyViews / 1000) * rpmRate;
  // Estimated avg views per video assuming 4 videos/month
  const avgViewsPerVideo = Math.max(1000, Math.round(monthlyViews / 4));
  const sponsorRevenue = sponsorDealsPerMonth * ((avgViewsPerVideo / 1000) * sponsorCpm);
  const totalMonthlyEarnings = adSenseRevenue + sponsorRevenue;
  const projectedAnnualEarnings = totalMonthlyEarnings * 12;

  const presets = [
    { label: '50K Views', views: 50000 },
    { label: '250K Views', views: 250000 },
    { label: '1M Views', views: 1000000 },
    { label: '3M Views', views: 3000000 },
  ];

  const niches = [
    { name: 'Minecraft / Roblox', rpm: 3.2 },
    { name: 'FPS / Battle Royale', rpm: 4.8 },
    { name: 'Simulators / Tech', rpm: 7.2 },
  ];

  return (
    <div className="rounded-2xl bg-[#0f111d]/90 backdrop-blur-xl border border-white/[0.08] p-5 sm:p-6 shadow-xl relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-white">Creator Revenue Projector</h3>
            <p className="text-[11px] text-slate-400">AdSense RPM + Brand Sponsor Valuation</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-emerald-400/80 font-mono tracking-wider uppercase block">Est. Monthly</span>
          <span className="text-lg font-black text-emerald-400 font-mono">
            ${Math.round(totalMonthlyEarnings).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Preset View Buttons */}
      <div className="flex items-center gap-1.5 mb-4">
        {presets.map(p => (
          <button
            key={p.views}
            onClick={() => setMonthlyViews(p.views)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
              monthlyViews === p.views
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold'
                : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 border border-transparent'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Monthly Views Slider */}
        <div className="space-y-1.5 bg-[#090b14]/60 p-3 rounded-xl border border-white/[0.04]">
          <div className="flex justify-between text-slate-300">
            <span>30-Day Channel Views</span>
            <span className="font-mono text-white font-bold">{monthlyViews.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min={10000}
            max={5000000}
            step={10000}
            value={monthlyViews}
            onChange={(e) => setMonthlyViews(Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
          />
        </div>

        {/* Niche RPM Selector */}
        <div className="space-y-1.5 bg-[#090b14]/60 p-3 rounded-xl border border-white/[0.04]">
          <div className="flex justify-between text-slate-300">
            <span>Estimated Gaming RPM</span>
            <span className="font-mono text-emerald-400 font-bold">${rpmRate.toFixed(2)}</span>
          </div>
          <div className="flex gap-1 pt-0.5">
            {niches.map(n => (
              <button
                key={n.name}
                onClick={() => setRpmRate(n.rpm)}
                className={`flex-1 py-1 text-[10px] rounded text-center truncate px-1 transition-all ${
                  rpmRate === n.rpm
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                    : 'bg-white/[0.02] text-slate-400 hover:text-slate-200'
                }`}
                title={n.name}
              >
                {n.name.split('/')[0]} (${n.rpm})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Breakdown Strip */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] grid grid-cols-3 gap-2 text-center">
        <div className="bg-[#090b14]/40 p-2 rounded-lg">
          <span className="text-[10px] text-slate-400 block">AdSense Share</span>
          <span className="text-xs font-bold text-white font-mono">${Math.round(adSenseRevenue).toLocaleString()}/mo</span>
        </div>
        <div className="bg-[#090b14]/40 p-2 rounded-lg">
          <span className="text-[10px] text-slate-400 block">1x Sponsor Integration</span>
          <span className="text-xs font-bold text-cyan-400 font-mono">${Math.round(sponsorRevenue).toLocaleString()}</span>
        </div>
        <div className="bg-[#090b14]/40 p-2 rounded-lg">
          <span className="text-[10px] text-slate-400 block">Projected 1-Yr ARR</span>
          <span className="text-xs font-bold text-amber-300 font-mono">${Math.round(projectedAnnualEarnings).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. SUBSCRIBER MILESTONE TRACKER WIDGET
// ==========================================
export const SubscriberMilestoneWidget: React.FC = () => {
  const { channelStats } = useCreator();
  const currentSubs = channelStats.subscribers;

  const milestones = [
    { target: 1000, name: 'YouTube Partner (Monetization)', icon: '🥉' },
    { target: 10000, name: '10K Club (Community Authority)', icon: '🥈' },
    { target: 50000, name: '50K Rising Creator', icon: '💎' },
    { target: 100000, name: 'Silver Creator Award (100K)', icon: '🏆' },
    { target: 1000000, name: 'Gold Creator Award (1M)', icon: '👑' },
  ];

  const nextMilestone = milestones.find(m => m.target > currentSubs) || milestones[milestones.length - 1];
  const prevMilestone = [...milestones].reverse().find(m => m.target <= currentSubs)?.target || 0;

  const progressRange = nextMilestone.target - prevMilestone;
  const currentProgress = currentSubs - prevMilestone;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentProgress / progressRange) * 100)));
  const subsNeeded = Math.max(0, nextMilestone.target - currentSubs);

  // Growth rate estimation based on views
  const estimatedMonthlyGain = Math.round(channelStats.views30Days * 0.015);
  const daysToTarget = estimatedMonthlyGain > 0 ? Math.round((subsNeeded / estimatedMonthlyGain) * 30) : 120;

  return (
    <div className="rounded-2xl bg-[#0f111d]/90 backdrop-blur-xl border border-white/[0.08] p-5 sm:p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-white">Road to Creator Silver</h3>
            <p className="text-[11px] text-slate-400">Milestone Velocity & Target Progress</p>
          </div>
        </div>
        <span className="text-xl">{nextMilestone.icon}</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-black text-white font-mono">{currentSubs.toLocaleString()}</span>
            <span className="text-xs text-slate-400 ml-1.5">/ {nextMilestone.target.toLocaleString()} subs</span>
          </div>
          <span className="text-xs font-bold text-amber-400 font-mono">{progressPercent}%</span>
        </div>

        {/* Progress Bar with glow */}
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-[1px] border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-300 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="pt-2 flex items-center justify-between text-xs text-slate-300">
          <span className="text-slate-400">Target: <strong className="text-white">{nextMilestone.name}</strong></span>
          <span className="text-amber-400 font-medium">~{daysToTarget} days remaining</span>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/15 flex items-center gap-2 text-[11px] text-amber-200/90">
          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Velocity: <strong>+{estimatedMonthlyGain.toLocaleString()} subs/mo</strong> based on recent 30-day view conversion.</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. RETENTION CURVE SIMULATOR WIDGET
// ==========================================
export const RetentionCurveWidget: React.FC = () => {
  const [selectedSecond, setSelectedSecond] = useState<number>(5);

  const retentionPoints = [
    { sec: 0, high: 100, avg: 100, poor: 100, label: '0s - Hook Start' },
    { sec: 5, high: 92, avg: 76, poor: 52, label: '5s - Premise Check' },
    { sec: 15, high: 84, avg: 65, poor: 41, label: '15s - First Micro-Payoff' },
    { sec: 30, high: 76, avg: 54, poor: 33, label: '30s - Algorithmic Barrier' },
    { sec: 60, high: 69, avg: 45, poor: 26, label: '60s - Core Narrative' },
  ];

  const currentPoint = retentionPoints.find(p => p.sec === selectedSecond) || retentionPoints[1];

  const tips: Record<number, { title: string; desc: string; danger: string }> = {
    0: {
      title: 'Opening Frame (0s)',
      desc: 'Jump directly into the high-stakes moment or visual transformation. Never start with "Hey guys, welcome back!".',
      danger: 'Slow channel intro animations lose 25% of viewers immediately.'
    },
    5: {
      title: 'Stake Confirmation (5s)',
      desc: 'Confirm the promise in the title/thumbnail. Show the diamond block, the impossible stunt, or the enemy.',
      danger: 'Ambiguity causes viewers to click back to the YouTube feed.'
    },
    15: {
      title: 'Micro-Payoff (15s)',
      desc: 'Give the viewer a quick laugh, close call, or partial answer before introducing the main complication.',
      danger: 'Monotonous commentary without sound effects or camera zooms creates drop-off.'
    },
    30: {
      title: 'Algorithmic Checkpoint (30s)',
      desc: 'If 70%+ of viewers remain at 30 seconds, YouTube will test your video to broader external browse features.',
      danger: 'Dropping below 50% at 30s severely caps impressions.'
    },
    60: {
      title: 'Mid-Game Tension (60s)',
      desc: 'Introduce a ticking clock or escalating rule to sustain attention for the full 10-15 minute duration.',
      danger: 'Aimless wandering or inventory sorting causes boredom.'
    }
  };

  const activeTip = tips[selectedSecond] || tips[5];

  return (
    <div className="rounded-2xl bg-[#0f111d]/90 backdrop-blur-xl border border-white/[0.08] p-5 sm:p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-white">0–30s Retention Simulator</h3>
            <p className="text-[11px] text-slate-400">Algorithmic Drop-Off vs Viral Standard</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> Top 5%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-500 inline-block" /> Avg Gaming
          </span>
        </div>
      </div>

      {/* Timestamp Selector Tabs */}
      <div className="flex items-center gap-1 mb-3">
        {retentionPoints.map(p => (
          <button
            key={p.sec}
            onClick={() => setSelectedSecond(p.sec)}
            className={`flex-1 py-1 text-[11px] rounded-lg font-mono transition-all ${
              selectedSecond === p.sec
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold'
                : 'bg-white/[0.02] text-slate-400 hover:text-slate-200'
            }`}
          >
            {p.sec}s
          </button>
        ))}
      </div>

      {/* SVG Chart Preview */}
      <div className="relative h-28 bg-[#090b14]/70 rounded-xl p-2 border border-white/[0.04] mb-3 flex items-end">
        <svg viewBox="0 0 300 90" className="w-full h-full overflow-visible">
          {/* Grid lines */}
          <line x1="0" y1="20" x2="300" y2="20" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.4" />
          <line x1="0" y1="50" x2="300" y2="50" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.4" />
          
          {/* Average Curve */}
          <path
            d="M 10 10 Q 75 35, 150 48 T 290 62"
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
            strokeDasharray="4 2"
          />

          {/* Viral Curve (Cyan) */}
          <path
            d="M 10 10 Q 75 18, 150 28 T 290 35"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Active Highlight Marker */}
          {selectedSecond === 0 && <circle cx="10" cy="10" r="5" fill="#38bdf8" className="animate-pulse" />}
          {selectedSecond === 5 && <circle cx="75" cy="18" r="5" fill="#38bdf8" className="animate-pulse" />}
          {selectedSecond === 15 && <circle cx="150" cy="28" r="5" fill="#38bdf8" className="animate-pulse" />}
          {selectedSecond === 30 && <circle cx="225" cy="32" r="5" fill="#38bdf8" className="animate-pulse" />}
          {selectedSecond === 60 && <circle cx="290" cy="35" r="5" fill="#38bdf8" className="animate-pulse" />}
        </svg>

        <div className="absolute top-2 right-2 text-[10px] font-mono bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded">
          Viral Target at {selectedSecond}s: <strong className="text-white">{currentPoint.high}%</strong>
        </div>
      </div>

      {/* Dynamic Recommendation at this timestamp */}
      <div className="p-3 rounded-xl bg-cyan-500/[0.05] border border-cyan-500/15 space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{activeTip.title}</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">{activeTip.desc}</p>
        <p className="text-[10px] text-red-300/80 pt-1 flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-red-400 shrink-0" />
          <span>{activeTip.danger}</span>
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 4. LIVE GAMING META RADAR WIDGET
// ==========================================
export const GamingMetaRadarWidget: React.FC = () => {
  const { setCurrentView, setPrefilledGame } = useCreator();

  const trendingGames = [
    {
      game: 'Minecraft 1.21',
      velocity: 'Spiking',
      format: 'Hardcore 100 Days',
      badge: '🔥 Hot',
      color: 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    },
    {
      game: 'GTA V / VI News',
      velocity: 'High',
      format: 'Mythbusters & Modding',
      badge: '⚡ Trending',
      color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'
    },
    {
      game: 'Valorant Episode 9',
      velocity: 'Steady',
      format: 'Ranked Clutch Shorts',
      badge: '🎯 Meta',
      color: 'text-red-400 bg-red-400/10 border-red-400/20'
    },
    {
      game: 'Roblox Rivals',
      velocity: 'Viral',
      format: 'PvP Duels & Secrets',
      badge: '🚀 Breakout',
      color: 'text-purple-400 bg-purple-400/10 border-purple-400/20'
    }
  ];

  const handleLaunchInIdeas = (gameName: string) => {
    setPrefilledGame(gameName);
    setCurrentView('ideas');
  };

  return (
    <div className="rounded-2xl bg-[#0f111d]/90 backdrop-blur-xl border border-white/[0.08] p-5 sm:p-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Gamepad2 className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-white">Gaming Meta Radar</h3>
            <p className="text-[11px] text-slate-400">High-Velocity Algorithmic Niches</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
          Live Pulse
        </span>
      </div>

      <div className="space-y-2.5">
        {trendingGames.map(item => (
          <div
            key={item.game}
            onClick={() => handleLaunchInIdeas(item.game)}
            className="p-2.5 rounded-xl bg-[#090b14]/60 border border-white/[0.04] hover:border-purple-500/30 transition-all flex items-center justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                  {item.game}
                </span>
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${item.color}`}>
                  {item.badge}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Top Format: {item.format}</p>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-purple-400 font-semibold group-hover:translate-x-0.5 transition-transform">
              <span>Generate</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
