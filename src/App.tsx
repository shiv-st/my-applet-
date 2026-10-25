/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CreatorProvider, useCreator } from './context/CreatorContext';
import { ANIME_THEMES } from './utils/animeThemes';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { ToastContainer } from './components/ToastContainer';
import { UpgradeModal } from './components/UpgradeModal';
import { AnimeThemeSwitcher } from './components/AnimeThemeSwitcher';
import { GitHubExportModal } from './components/GitHubExportModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { IdeaGeneratorView } from './components/views/IdeaGeneratorView';
import { TitleStudioView } from './components/views/TitleStudioView';
import { ThumbnailStudioView } from './components/views/ThumbnailStudioView';
import { ShortsAssistantView } from './components/views/ShortsAssistantView';
import { ScriptWriterView } from './components/views/ScriptWriterView';
import { SeoWorkspaceView } from './components/views/SeoWorkspaceView';
import { ContentCalendarView } from './components/views/ContentCalendarView';
import { ChannelAnalyticsView } from './components/views/ChannelAnalyticsView';
import { AiCoachView } from './components/views/AiCoachView';
import { SavedVaultView } from './components/views/SavedVaultView';
import { GmailCreatorView } from './components/views/GmailCreatorView';

const WorkspaceShell: React.FC = () => {
  const { currentView } = useCreator();

  if (currentView === 'landing') {
    return (
      <main className="w-full relative z-10">
        <LandingPage />
      </main>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] w-full relative z-10">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Studio Viewport */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'ideas' && <IdeaGeneratorView />}
        {currentView === 'titles' && <TitleStudioView />}
        {currentView === 'thumbnails' && <ThumbnailStudioView />}
        {currentView === 'shorts' && <ShortsAssistantView />}
        {currentView === 'scripts' && <ScriptWriterView />}
        {currentView === 'seo' && <SeoWorkspaceView />}
        {currentView === 'calendar' && <ContentCalendarView />}
        {currentView === 'analytics' && <ChannelAnalyticsView />}
        {currentView === 'coach' && <AiCoachView />}
        {currentView === 'vault' && <SavedVaultView />}
        {currentView === 'gmail' && <GmailCreatorView />}
      </main>
    </div>
  );
};

const BackgroundAtmosphere: React.FC = () => {
  const { animeTheme, bgTranslucency } = useCreator();
  const theme = ANIME_THEMES[animeTheme] || ANIME_THEMES.golden_goku;

  // Compute opacity based on bgTranslucency setting
  const opacityValue = (() => {
    if (bgTranslucency === 'subtle') return 0.35;
    if (bgTranslucency === 'vivid') return 0.72;
    // Default balanced
    return theme.bgOpacity || 0.54;
  })();

  const isGolden = theme.id === 'golden_goku';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {theme.bgImageUrl ? (
        <>
          {/* High-res anime character background with translucent visibility */}
          <div
            key={theme.id}
            className="absolute inset-0 bg-cover bg-no-repeat transition-all duration-700 ease-in-out scale-100"
            style={{
              backgroundImage: `url(${theme.bgImageUrl})`,
              backgroundPosition: isGolden ? 'center 15%' : 'center center',
              opacity: opacityValue,
              filter: isGolden
                ? 'contrast(1.18) saturate(1.15) brightness(1.02)'
                : 'contrast(1.15) brightness(0.9)'
            }}
          />
          
          {/* Multi-stop atmospheric vignette calibrated to ensure translucency while preserving readability */}
          {isGolden ? (
            <>
              {/* Warm golden-brown & amber vignette - allows Goku's aura and silhouette to shine through */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#100c07]/45 via-[#0e0905]/60 to-[#090603]/85" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_25%,_transparent_25%,_#0a0704_85%)]" />

              {/* Ultra Instinct Celestial White Ki Aura Spotlight */}
              <div
                className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[450px] rounded-full blur-[140px] opacity-20 pointer-events-none"
                style={{ backgroundColor: '#ffffff' }}
              />

              {/* Golden Brown Aura on flank */}
              <div
                className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[130px] opacity-30 pointer-events-none"
                style={{ backgroundColor: '#d97706' }}
              />
              <div
                className="absolute top-1/3 left-1/5 w-[450px] h-[450px] rounded-full blur-[120px] opacity-20 pointer-events-none"
                style={{ backgroundColor: '#38bdf8' }}
              />
            </>
          ) : (
            <>
              {/* Deep dark multi-stop vignette for other themes */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0b0d14]/70 via-[#0b0d14]/85 to-[#0b0d14]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_transparent_20%,_#0b0d14_85%)]" />

              {/* Character-specific aura glow */}
              <div
                className="absolute top-0 right-1/4 w-[600px] h-[500px] rounded-full blur-[140px] opacity-25 pointer-events-none"
                style={{ backgroundColor: theme.primaryColor }}
              />
            </>
          )}
        </>
      ) : (
        <>
          {/* Cyber dark geometric grid */}
          <div className="absolute inset-0 bg-[#0b0d14]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute top-0 right-1/3 w-[500px] h-[400px] rounded-full blur-[130px] bg-indigo-600/10 pointer-events-none" />
        </>
      )}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { animeTheme, isThemeModalOpen, setIsThemeModalOpen, isGitHubModalOpen, setIsGitHubModalOpen } = useCreator();
  const isGolden = animeTheme === 'golden_goku';

  return (
    <div
      data-theme={animeTheme}
      className={`min-h-screen text-slate-100 flex flex-col font-sans relative transition-colors duration-500 ${
        isGolden
          ? 'bg-[#090704] selection:bg-amber-500/30 selection:text-amber-100'
          : 'bg-[#0b0d14] selection:bg-purple-600/40 selection:text-white'
      }`}
    >
      <BackgroundAtmosphere />
      <Navbar />
      <WorkspaceShell />
      <ToastContainer />
      <UpgradeModal />
      <AnimeThemeSwitcher isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />
      <GitHubExportModal isOpen={isGitHubModalOpen} onClose={() => setIsGitHubModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <CreatorProvider>
      <AppContent />
    </CreatorProvider>
  );
}
