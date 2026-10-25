import React, { useState } from 'react';
import { useCreator } from '../../context/CreatorContext';
import { ChannelPerformance } from '../../types';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Clock,
  Percent,
  Video,
  Edit2,
  CheckCircle2,
  ShieldCheck,
  Radio,
  ExternalLink,
  Flame,
  X
} from 'lucide-react';

export const ChannelAnalyticsView: React.FC = () => {
  const { channelStats, updateChannelStats, showToast } = useCreator();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [channelName, setChannelName] = useState(channelStats.channelName);
  const [handle, setHandle] = useState(channelStats.handle);
  const [subscribers, setSubscribers] = useState(channelStats.subscribers);
  const [views30Days, setViews30Days] = useState(channelStats.views30Days);
  const [avgCtrPercent, setAvgCtrPercent] = useState(channelStats.avgCtrPercent);
  const [avgWatchTimeMin, setAvgWatchTimeMin] = useState(channelStats.avgWatchTimeMin);

  const handleSaveMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    updateChannelStats({
      channelName,
      handle,
      subscribers: Number(subscribers),
      views30Days: Number(views30Days),
      avgCtrPercent: Number(avgCtrPercent),
      avgWatchTimeMin: Number(avgWatchTimeMin),
      dataSource: 'Manual Log'
    });
    setIsEditModalOpen(false);
  };

  const handleToggleApiMode = () => {
    const nextSource = channelStats.dataSource === 'Verified OAuth' ? 'Manual Log' : 'Verified OAuth';
    updateChannelStats({ dataSource: nextSource });
    showToast(`Data source switched to: ${nextSource}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Channel Health & Benchmarks</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
            Channel Performance Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Track your views, average watch retention, and CTR click metrics. Enter statistics manually or view verified channel benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Edit Channel Stats</span>
          </button>
        </div>
      </div>

      {/* Verified Source Disclaimer Badge */}
      <div className="p-4 rounded-2xl bg-[#121422] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">
            Current Data Source:{' '}
            <strong className="text-white">{channelStats.dataSource}</strong> for{' '}
            <span className="text-purple-300 font-bold">{channelStats.channelName}</span>
          </span>
        </div>
        <button
          onClick={handleToggleApiMode}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5"
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Toggle OAuth Simulated Connect</span>
        </button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#121422] border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Subscribers</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {channelStats.subscribers.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">+1,240 in last 30d</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121422] border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>30-Day Views</span>
            <Eye className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {channelStats.views30Days.toLocaleString()}
          </div>
          <div className="text-[11px] text-cyan-300 font-medium">Across 42 published uploads</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121422] border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average CTR</span>
            <Percent className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {channelStats.avgCtrPercent}%
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">Above gaming baseline (5.0%)</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121422] border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg Watch Duration</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {channelStats.avgWatchTimeMin}m
          </div>
          <div className="text-[11px] text-amber-300 font-medium">54% avg audience retention</div>
        </div>
      </div>

      {/* Visual Chart: 30-Day Growth & Format Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area SVG */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#121422] border border-white/10 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                30-Day Channel View Velocity
              </h3>
              <p className="text-xs text-slate-400">Daily impression & view trajectory</p>
            </div>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
              +14.2% Growth
            </span>
          </div>

          {/* Clean SVG Area Chart */}
          <div className="h-44 w-full relative pt-2">
            <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.05)" strokeDasharray="4" />

              {/* Path Area */}
              <polygon
                points="0,110 50,95 100,105 150,75 200,85 250,55 300,60 350,40 400,48 450,25 500,20 500,150 0,150"
                fill="url(#chartGrad)"
              />
              {/* Stroke */}
              <polyline
                fill="none"
                stroke="#a855f7"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,110 50,95 100,105 150,75 200,85 250,55 300,60 350,40 400,48 450,25 500,20"
              />
              {/* Highlight Nodes */}
              <circle cx="250" cy="55" r="4" fill="#06b6d4" />
              <circle cx="450" cy="25" r="4" fill="#06b6d4" />
              <circle cx="500" cy="20" r="5" fill="#a855f7" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 font-mono-code pt-1">
            <span>Day 1</span>
            <span>Day 10</span>
            <span>Day 20</span>
            <span>Today (Peak 8.4K views/day)</span>
          </div>
        </div>

        {/* Format Comparison: Long-form vs Shorts */}
        <div className="p-6 rounded-3xl bg-[#121422] border border-white/10 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-white mb-1">
              Format Performance Benchmark
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Comparing your long-form videos vs vertical Shorts.
            </p>

            <div className="space-y-4">
              {/* Long-form */}
              <div className="p-3.5 rounded-2xl bg-[#0e101a] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-purple-400" />
                    <span>Long-Form (16:9)</span>
                  </span>
                  <span className="font-mono-code text-cyan-300">Avg 39.7K views</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Higher Ad revenue (RPM $4.20) & core subscriber loyalty.
                </div>
              </div>

              {/* Shorts */}
              <div className="p-3.5 rounded-2xl bg-[#0e101a] border border-white/5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-red-400" />
                    <span>Shorts (9:16)</span>
                  </span>
                  <span className="font-mono-code text-red-300">Avg 89.4K views</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Exceptional discovery engine: drives 65% of all new subscribers.
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200">
            Recommendation: Maintain a 1:2 ratio (1 long video + 2 Shorts weekly).
          </div>
        </div>
      </div>

      {/* Video Publishing History Table */}
      <div className="p-6 rounded-3xl bg-[#121422] border border-white/10 shadow-xl space-y-4">
        <h3 className="font-heading font-bold text-base text-white">
          Recent Upload History & Metrics
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-bold">Video Title</th>
                <th className="pb-3 font-bold">Game</th>
                <th className="pb-3 font-bold">Format</th>
                <th className="pb-3 font-bold">Views</th>
                <th className="pb-3 font-bold">CTR</th>
                <th className="pb-3 font-bold">Retention</th>
                <th className="pb-3 font-bold">Published</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {channelStats.recentVideos.map(v => (
                <tr key={v.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 font-bold text-white max-w-xs truncate">{v.title}</td>
                  <td className="py-3 text-cyan-300 font-semibold">{v.game}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      v.format === 'Shorts' ? 'bg-red-500/20 text-red-300' : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {v.format}
                    </span>
                  </td>
                  <td className="py-3 font-mono-code text-white">{v.views.toLocaleString()}</td>
                  <td className="py-3 font-mono-code text-emerald-400">{v.ctr}%</td>
                  <td className="py-3 font-mono-code text-amber-300">{v.retention}%</td>
                  <td className="py-3 text-slate-400">{v.publishDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Channel Stats Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0f111d] border border-purple-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-heading font-black text-lg text-white">
                Edit Channel Stats
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
                aria-label="Close edit channel stats"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMetrics} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 mb-1">Channel Name</label>
                <input
                  type="text"
                  value={channelName}
                  onChange={e => setChannelName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141624] border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1">Handle</label>
                <input
                  type="text"
                  value={handle}
                  onChange={e => setHandle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141624] border border-white/10 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Subscribers</label>
                  <input
                    type="number"
                    value={subscribers}
                    onChange={e => setSubscribers(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#141624] border border-white/10 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">30-Day Views</label>
                  <input
                    type="number"
                    value={views30Days}
                    onChange={e => setViews30Days(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#141624] border border-white/10 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-400 mb-1">Average CTR (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={avgCtrPercent}
                    onChange={e => setAvgCtrPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#141624] border border-white/10 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-400 mb-1">Avg Watch Time (min)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={avgWatchTimeMin}
                    onChange={e => setAvgWatchTimeMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-[#141624] border border-white/10 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  Save Metrics
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
