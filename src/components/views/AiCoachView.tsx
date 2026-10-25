import React, { useState } from 'react';
import { useCreator } from '../../context/CreatorContext';
import { AiCoachInsight } from '../../types';
import {
  Bot,
  Sparkles,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Loader2,
  RefreshCw,
  Compass,
  Lightbulb
} from 'lucide-react';

export const AiCoachView: React.FC = () => {
  const {
    channelStats,
    savedIdeas,
    calendarItems,
    setCurrentView,
    showToast,
    incrementUsage,
    isUsageLimitReached,
    setIsUpgradeModalOpen
  } = useCreator();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [coachData, setCoachData] = useState<AiCoachInsight | null>(null);

  const handleRunCoachAudit = async () => {
    if (isUsageLimitReached) {
      setIsUpgradeModalOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/content-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelName: channelStats.channelName,
          primaryGame: channelStats.primaryGame,
          savedIdeasCount: savedIdeas.length,
          calendarCount: calendarItems.length,
          recentStats: {
            views30Days: channelStats.views30Days,
            avgCtr: channelStats.avgCtrPercent,
            avgWatchTime: channelStats.avgWatchTimeMin
          }
        })
      });

      const data = await response.json();
      if (data.coach) {
        setCoachData(data.coach);
        incrementUsage();
        showToast('AI Content Coach audit completed!');
      }
    } catch (e) {
      console.error(e);
      showToast('Error auditing channel', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>Strategic Mentor & Pipeline Audit</span>
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">
            AI Content Coach & Strategy Radar
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Synthesizes your saved ideas, publishing schedule, and performance stats into realistic weekly publishing sprints and A/B growth experiments.
          </p>
        </div>

        <button
          onClick={handleRunCoachAudit}
          disabled={isLoading}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-heading font-black text-xs shadow-xl shadow-purple-600/30 flex items-center gap-2 transition-all disabled:opacity-50 active:scale-95"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Pipeline Data...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Run Strategic Audit</span>
            </>
          )}
        </button>
      </div>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#121422] border border-white/5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Channel Pipeline Load</span>
          <div className="text-2xl font-black text-white">{calendarItems.length} Videos Planned</div>
          <p className="text-[11px] text-cyan-300">
            {calendarItems.length < 2 ? '⚠️ Cadence gap alert' : 'Healthy schedule buffer'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#121422] border border-white/5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Saved Ideas Bank</span>
          <div className="text-2xl font-black text-white">{savedIdeas.length} Concepts in Vault</div>
          <p className="text-[11px] text-purple-300">Sufficient seed ideas for 3 weeks</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#121422] border border-white/5 space-y-1">
          <span className="text-xs text-slate-400 font-medium">CTR Benchmark Health</span>
          <div className="text-2xl font-black text-white">{channelStats.avgCtrPercent}% Average</div>
          <p className="text-[11px] text-emerald-400">Above 5% YouTube gaming average</p>
        </div>
      </div>

      {coachData ? (
        <div className="space-y-6">
          {/* Executive Channel Health Summary */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#131525] to-cyan-950/30 border border-purple-500/30 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Executive Strategic Summary</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {coachData.channelHealthSummary}
            </p>
            <div className="pt-2 border-t border-white/5 text-xs text-cyan-300 font-semibold">
              Format Balance: {coachData.formatBreakdown}
            </div>
          </div>

          {/* 3 High-Probability Strategic Experiments */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-base text-white">
              Recommended Packaging & Content Experiments
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {coachData.topRecommendedExperiments.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-[#121422] border border-purple-500/20 hover:border-purple-500/40 shadow-xl flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                      Experiment #{idx + 1}
                    </span>
                    <h4 className="font-heading font-bold text-base text-white">
                      {exp.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {exp.why}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0e101a] border border-white/5 space-y-1 text-xs">
                    <span className="font-bold text-cyan-400">How to Measure:</span>
                    <p className="text-slate-400 text-[11px]">{exp.howToMeasure}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Publishing Sprint Action Plan */}
          <div className="p-6 rounded-3xl bg-[#121422] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <h3 className="font-heading font-bold text-base text-white">
                5-Day Publishing Sprint Action Plan
              </h3>
            </div>

            <div className="space-y-2.5">
              {coachData.weeklyActionPlan.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#0e101a] border border-white/5 flex items-center gap-3 text-xs text-slate-200"
                >
                  <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Disclaimer */}
          <div className="p-4 rounded-2xl bg-[#0d0f1b] border border-white/10 text-xs text-slate-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{coachData.disclaimer}</span>
          </div>
        </div>
      ) : (
        /* Prompt to run audit */
        <div className="p-10 text-center rounded-3xl bg-[#121422] border border-white/10 space-y-4">
          <Bot className="w-12 h-12 text-purple-400 mx-auto" />
          <h2 className="font-heading font-bold text-xl text-white">
            Unlock Actionable Channel Guidance
          </h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click "Run Strategic Audit" above to analyze your current schedule, saved ideas vault, and estimated channel metrics for tactical recommendations.
          </p>
          <button
            onClick={handleRunCoachAudit}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
          >
            Start Channel Audit Now
          </button>
        </div>
      )}
    </div>
  );
};
