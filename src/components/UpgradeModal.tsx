import React from 'react';
import { useCreator } from '../context/CreatorContext';
import { CreatorTier } from '../types';
import { Check, Crown, Zap, Shield, Sparkles, X } from 'lucide-react';

export const UpgradeModal: React.FC = () => {
  const { isUpgradeModalOpen, setIsUpgradeModalOpen, tier, setTier, showToast } = useCreator();

  if (!isUpgradeModalOpen) return null;

  const tiers: {
    id: CreatorTier;
    name: string;
    price: string;
    period: string;
    badge?: string;
    description: string;
    features: string[];
    isPopular?: boolean;
    buttonText: string;
  }[] = [
    {
      id: 'Free',
      name: 'Starter Creator',
      price: '$0',
      period: 'forever',
      description: 'Ideal for weekend gaming hobbyists and new streamers starting their first channel.',
      features: [
        '10 AI Generations per day',
        'Video Idea Generator (Basic)',
        'Title Generator & CTR Score',
        'Personal Content Calendar',
        'Manual Channel Stats Tracking',
        'Community Support'
      ],
      buttonText: tier === 'Free' ? 'Current Plan' : 'Select Free Plan'
    },
    {
      id: 'Pro Creator',
      name: 'Pro YouTuber',
      price: '$19',
      period: 'per month',
      badge: 'Most Popular',
      isPopular: true,
      description: 'Designed for active gaming creators publishing 2-5 videos or Shorts per week.',
      features: [
        'Unlimited AI Generations',
        'Full Gaming Script Writer (2-Column)',
        'Built-in Teleprompter / Presenter Mode',
        'Thumbnail Canvas Studio (1080p Export)',
        'YouTube Shorts AI Repurposer',
        '500-Char YouTube Tag Budget Optimizer',
        'AI Content Coach & Strategy Radar',
        'Priority Server Compute'
      ],
      buttonText: tier === 'Pro Creator' ? 'Current Plan' : 'Switch to Pro'
    },
    {
      id: 'Studio',
      name: 'Studio / Team',
      price: '$49',
      period: 'per month',
      description: 'For multi-channel networks, esports teams, and gaming media companies.',
      features: [
        'Everything in Pro Creator',
        'Multi-channel Profile Switching',
        'Team Collaboration & Shared Vault',
        'High-Res 4K Thumbnail Visualizer',
        'Custom AI Voice / Persona Calibration',
        'Direct YouTube Analytics API Connect',
        'Dedicated 24/7 Creator Strategist'
      ],
      buttonText: tier === 'Studio' ? 'Current Plan' : 'Switch to Studio'
    }
  ];

  const handleSelectTier = (newTier: CreatorTier) => {
    setTier(newTier);
    setIsUpgradeModalOpen(false);
    showToast(`Successfully switched to ${newTier} plan!`, 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0f111d] border border-purple-500/30 shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsUpgradeModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Scale Your Gaming Channel</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-white">
            Simple, Transparent Creator Pricing
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            No locked features behind fake walls. Toggle between plans to test the full workspace limits.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map(t => {
            const isCurrent = tier === t.id;
            return (
              <div
                key={t.id}
                className={`relative rounded-2xl p-6 flex flex-col justify-between transition-all ${
                  t.isPopular
                    ? 'bg-gradient-to-b from-purple-900/30 to-[#121424] border-2 border-purple-500 shadow-xl shadow-purple-600/20'
                    : 'bg-[#141624] border border-white/10 hover:border-purple-500/30'
                }`}
              >
                {t.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                    {t.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading font-bold text-lg text-white">{t.name}</h3>
                    {t.id === 'Studio' && <Crown className="w-4 h-4 text-amber-300" />}
                    {t.id === 'Pro Creator' && <Zap className="w-4 h-4 text-cyan-400" />}
                  </div>

                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">{t.description}</p>

                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-black text-white">{t.price}</span>
                    <span className="text-xs text-slate-400">/{t.period}</span>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-300 mb-6">
                    {t.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSelectTier(t.id)}
                  disabled={isCurrent}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-white/10 text-slate-400 cursor-default'
                      : t.isPopular
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {isCurrent ? 'Current Active Tier' : t.buttonText}
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust & Architecture Note */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Production SaaS Architecture with Secure Server-Side Proxying</span>
          </div>
          <span>Cancel anytime. No lock-in contracts.</span>
        </div>
      </div>
    </div>
  );
};
