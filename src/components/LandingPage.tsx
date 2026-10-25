import React from 'react';
import { useCreator } from '../context/CreatorContext';
import {
  Gamepad2,
  Sparkles,
  Zap,
  Flame,
  ArrowRight,
  CheckCircle2,
  Type,
  Image,
  FileText,
  Calendar,
  BarChart3,
  Bot,
  Play,
  Star,
  Users,
  Shield,
  Clock,
  Compass
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, setIsUpgradeModalOpen } = useCreator();

  const features = [
    {
      icon: Sparkles,
      title: 'AI Video Idea Generator',
      desc: 'Algorithm-tailored concepts for Minecraft, GTA V, Valorant, BGMI, and more with instant opening hooks and retention pacing.',
      color: 'from-purple-500/20 to-purple-500/5',
      border: 'border-purple-500/30',
      iconColor: 'text-purple-400'
    },
    {
      icon: Type,
      title: 'High-CTR Title Studio',
      desc: 'Curiosity-driven, challenge, and funny titles analyzed for mobile truncation (<60 chars) and YouTube algorithm clickability.',
      color: 'from-cyan-500/20 to-cyan-500/5',
      border: 'border-cyan-500/30',
      iconColor: 'text-cyan-400'
    },
    {
      icon: Image,
      title: 'Thumbnail Canvas Studio',
      desc: 'Visual composition generator plus an interactive 16:9 canvas editor with bold 3D text, gamer stickers, and mobile feed preview.',
      color: 'from-pink-500/20 to-pink-500/5',
      border: 'border-pink-500/30',
      iconColor: 'text-pink-400'
    },
    {
      icon: Flame,
      title: 'YouTube Shorts Assistant',
      desc: '0-3 second retention hooks, scene-by-scene visual cues, trending caption styles, and a long-form to shorts repurposer.',
      color: 'from-red-500/20 to-red-500/5',
      border: 'border-red-500/30',
      iconColor: 'text-red-400'
    },
    {
      icon: FileText,
      title: 'Dual-Column Script Writer',
      desc: 'Synchronized visual gameplay cues and spoken dialogue with a built-in scrolling Teleprompter for smooth commentary.',
      color: 'from-emerald-500/20 to-emerald-500/5',
      border: 'border-emerald-500/30',
      iconColor: 'text-emerald-400'
    },
    {
      icon: Calendar,
      title: 'Content Pipeline & Calendar',
      desc: 'Visual publishing calendar with status tracking from initial idea to scripting, recording, editing, and scheduled upload.',
      color: 'from-indigo-500/20 to-indigo-500/5',
      border: 'border-indigo-500/30',
      iconColor: 'text-indigo-400'
    }
  ];

  const testimonials = [
    {
      name: 'Kaelen "Volt" Rivers',
      channel: 'VoltPlayz (480K Subs)',
      game: 'Minecraft & Roblox',
      quote: 'GameCreator AI cut my packaging time in half. The 0-3s hook suggestions alone lifted my Shorts retention from 62% to 84%.'
    },
    {
      name: 'Maya "Valkyrie" Chen',
      channel: 'MayaClutches (210K Subs)',
      game: 'Valorant & Apex Legends',
      quote: 'The dual-column script writer with teleprompter mode is unbeatable. I no longer stumble through commentary or forget B-roll cues.'
    },
    {
      name: 'Rohit Sharma',
      channel: 'DesiGamerz (920K Subs)',
      game: 'BGMI & Free Fire',
      quote: 'The 500-char tag meter and title A/B simulator help our entire 4-person video team stay aligned on every upload.'
    }
  ];

  return (
    <div className="w-full bg-[#0b0d14] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 border-b border-purple-500/10">
        {/* Ambient neon backdrop gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/15 to-cyan-500/20 blur-[130px] pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Built Specifically For Gaming YouTubers & Streamers</span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.08] max-w-4xl mx-auto">
            Plan, Script & Package{' '}
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
              Viral Gaming Videos
            </span>{' '}
            in Minutes
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The all-in-one AI production suite for gaming creators. Generate unstoppable hooks, high-CTR titles, 3D thumbnails, dual-column scripts, and keep your channel calendar packed.
          </p>

          {/* Call to action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-heading font-extrabold text-base shadow-xl shadow-purple-600/30 active:scale-95 transition-all flex items-center justify-center gap-2.5"
            >
              <span>Launch Creator Studio</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCurrentView('ideas')}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#141728] hover:bg-[#1d2138] border border-white/10 hover:border-purple-500/30 text-slate-200 font-bold text-sm transition-all flex items-center justify-center gap-2"
            >
              <Gamepad2 className="w-4 h-4 text-purple-400" />
              <span>Try Video Idea Engine</span>
            </button>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-8 border-t border-white/5">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-white">10,000+</div>
              <div className="text-xs text-slate-400 mt-0.5">Gaming Creators</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-purple-400">4.2M+</div>
              <div className="text-xs text-slate-400 mt-0.5">Video Views Planned</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-cyan-400">8.9%</div>
              <div className="text-xs text-slate-400 mt-0.5">Avg Video CTR</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">No-Slop Originality</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Deep Dive Grid */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-white">
            Everything A Gaming YouTuber Needs
          </h2>
          <p className="text-slate-400 text-sm mt-3">
            Stop switching between generic notes, messy documents, and random tools. Keep your entire channel pipeline under one roof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className={`relative rounded-3xl p-6 bg-gradient-to-b ${f.color} border ${f.border} transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 group`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0f111d] border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className={`w-6 h-6 ${f.iconColor}`} />
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Tool Teaser Preview */}
      <section className="py-16 bg-[#0e101b] border-y border-purple-500/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-4">
                <Compass className="w-3.5 h-3.5" />
                <span>Next-Gen Content Packaging</span>
              </div>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-white leading-tight">
                Turn Raw Ideas Into High-Retention Masterpieces
              </h2>
              <p className="text-slate-300 text-sm mt-4 leading-relaxed">
                Gaming YouTube is about the first 30 seconds and the thumbnail click. GameCreator AI crafts psychological hooks, pacing notes, and thumbnail compositions tailored specifically to games like Minecraft, GTA V, Valorant, and Roblox.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Calculates YouTube mobile truncation threshold (&lt;60 chars)</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dual-column scripts with synchronized visual actions & commentary</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Built-in Teleprompter with scrolling speed control</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>500-Character YouTube tag budget tracker</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
                >
                  <span>Explore All 10 Tools</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mock Visual Card Preview */}
            <div className="lg:w-1/2 w-full">
              <div className="rounded-2xl bg-[#141626] border border-purple-500/30 p-5 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-mono-code text-slate-400 ml-2">packaging_preview.ts</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    High CTR: 92%
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#0d0f1b] border border-white/5">
                    <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider mb-1">
                      Target Title
                    </div>
                    <div className="text-sm font-bold text-white">
                      I Survived 100 Days In Hardcore Minecraft [Day 1-50]
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span>Length: 51 / 60 chars (Safe)</span>
                      <span className="text-cyan-400">Power words: "100 Days", "Hardcore"</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0d0f1b] border border-white/5">
                    <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                      0-3 Second Hook
                    </div>
                    <div className="text-xs text-slate-200 italic">
                      "Look at my health bar. One single mistake, and literally 40 hours of building disappears forever."
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0d0f1b] border border-white/5">
                    <div className="text-[11px] font-bold text-pink-400 uppercase tracking-wider mb-1">
                      Thumbnail Focus
                    </div>
                    <div className="text-xs text-slate-300">
                      High-contrast split: Wooden Shack (Day 1) vs Glowing Obsidian Fortress (Day 100) with 3D text "DAY 1 vs 100".
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="font-heading font-black text-3xl text-white">Loved By Gaming Creators</h2>
          <p className="text-slate-400 text-sm mt-2">
            See how creators use GameCreator AI to publish with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#131522] border border-white/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic mb-6">"{t.quote}"</p>
              </div>
              <div className="pt-4 border-t border-white/5">
                <div className="text-sm font-bold text-white">{t.name}</div>
                <div className="text-xs text-purple-400">{t.channel}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{t.game}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 border-t border-purple-500/20 bg-gradient-to-r from-purple-950/40 via-[#121424] to-cyan-950/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-white">
            Ready to Supercharge Your YouTube Channel?
          </h2>
          <p className="text-slate-300 text-sm mt-3 max-w-xl mx-auto">
            Join thousands of gaming creators who plan, package, and script higher-performing videos with GameCreator AI.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-heading font-black text-sm shadow-xl shadow-purple-600/30 transition-all flex items-center gap-2"
            >
              <span>Get Started In Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
