import React, { useState, useEffect } from 'react';
import { Header, AppTabId } from './components/Header';
import { WhatsAppMessenger } from './components/WhatsAppMessenger';
import { IntegrationArchitectureViewer } from './components/IntegrationArchitectureViewer';
import { TrackNavigator } from './components/TrackNavigator';
import { LivePacketSimulator } from './components/LivePacketSimulator';
import { CodeWorkbench } from './components/CodeWorkbench';
import { ArchitectureTopology } from './components/ArchitectureTopology';
import { DatabaseBenchmarker } from './components/DatabaseBenchmarker';
import { CapstoneCurriculum } from './components/CapstoneCurriculum';
import { SystemHealthDashboard } from './components/SystemHealthDashboard';
import { GeminiTutorModal } from './components/GeminiTutorModal';
import { UserGuideModal } from './components/UserGuideModal';
import { ThemeSettingsModal } from './components/ThemeSettingsModal';
import { BrandAssetsModal } from './components/BrandAssetsModal';
import { ENGINEERING_TRACKS } from './data/tracksData';
import { TrackId, ProgrammingLanguageInfo } from './types';
import { CAPSTONE_MILESTONES, PROTOBUF_SPECIFICATION } from './data/curriculumData';
import { getAllSnippetRecords, getAllProgressRecords } from './utils/indexedDBStorage';
import { getActiveThemePreset, applyThemePreset, ThemePreset } from './utils/themeManager';
import { saveRecentSearch } from './utils/recentSearches';

export default function App() {
  const [activeThemePreset, setActiveThemePreset] = useState<ThemePreset>(() => getActiveThemePreset());

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return activeThemePreset.isDark ? 'dark' : 'light';
  });

  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [isBrandAssetsOpen, setIsBrandAssetsOpen] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<AppTabId>('whatsapp');

  const [selectedTrackId, setSelectedTrackId] = useState<TrackId>('frontend');
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguageInfo>(
    ENGINEERING_TRACKS[0].languages[0]
  );
  const [selectedSprintIdx, setSelectedSprintIdx] = useState<number>(0);

  const [isAiTutorOpen, setIsAiTutorOpen] = useState<boolean>(false);
  const [codeContextForAi, setCodeContextForAi] = useState<{
    languageName: string;
    snippet: string;
  } | null>(null);

  const [isUserGuideOpen, setIsUserGuideOpen] = useState<boolean>(false);
  const [userGuideDoc, setUserGuideDoc] = useState<'guide' | 'installation' | 'readme'>('guide');

  // Synchronize Active Theme Preset & CSS Variables on Mount & Change
  useEffect(() => {
    applyThemePreset(activeThemePreset);
    setTheme(activeThemePreset.isDark ? 'dark' : 'light');
  }, [activeThemePreset]);

  // Quick light/dark toggler
  const toggleTheme = () => {
    const nextIsDark = theme === 'light';
    setTheme(nextIsDark ? 'dark' : 'light');
    if (nextIsDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('kaybit_theme', nextIsDark ? 'dark' : 'light');
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + T: Theme Settings Modal
      if ((e.ctrlKey || e.metaKey) && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        setIsThemeModalOpen((prev) => !prev);
      }
      // Ctrl/Cmd + Shift + L: Quick Toggle Light/Dark
      else if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        toggleTheme();
      }
      // Ctrl/Cmd + U: User Guide
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        setUserGuideDoc('guide');
        setIsUserGuideOpen((prev) => !prev);
      }
      // Ctrl/Cmd + K: AI Advisor
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsAiTutorOpen((prev) => !prev);
      }
      // Number keys 1-9 for tab switching if no input is focused
      else if (
        ['1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key) &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      ) {
        const tabMap: Record<string, AppTabId> = {
          '1': 'whatsapp',
          '2': 'architecture_diagram',
          '3': 'blueprint',
          '4': 'simulator',
          '5': 'code',
          '6': 'topology',
          '7': 'health',
          '8': 'database',
          '9': 'curriculum',
        };
        if (tabMap[e.key]) {
          const tabId = tabMap[e.key];
          setActiveTab(tabId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme]);

  // Jump from track navigator or search to code workbench
  const handleSelectLanguage = (lang: ProgrammingLanguageInfo) => {
    saveRecentSearch({
      id: `lang-${lang.id}`,
      type: 'language',
      title: lang.name,
      subtitle: lang.roleTitle,
      badge: 'Language',
      data: { language: lang, trackId: lang.trackId },
    });
    window.dispatchEvent(new Event('kaybit_recent_searches_updated'));

    setSelectedTrackId(lang.trackId);
    setSelectedLanguage(lang);
    setActiveTab('code');
  };

  // Jump to track blueprint from search or card
  const handleSelectTrack = (trackId: TrackId) => {
    const track = ENGINEERING_TRACKS.find((t) => t.id === trackId);
    if (track) {
      saveRecentSearch({
        id: `track-${track.id}`,
        type: 'track',
        title: track.title,
        subtitle: track.subtitle,
        badge: 'Track',
        data: { trackId: track.id },
      });
      window.dispatchEvent(new Event('kaybit_recent_searches_updated'));
    }

    setSelectedTrackId(trackId);
    setActiveTab('blueprint');
  };

  // Jump to curriculum milestone sprint from search
  const handleSelectMilestone = (sprintIdx: number) => {
    const milestone = CAPSTONE_MILESTONES[sprintIdx];
    if (milestone) {
      saveRecentSearch({
        id: `milestone-${milestone.sprint}`,
        type: 'milestone',
        title: `${milestone.sprint}: ${milestone.title}`,
        subtitle: `Week ${milestone.week}`,
        badge: 'Sprint',
        data: { sprintIdx },
      });
      window.dispatchEvent(new Event('kaybit_recent_searches_updated'));
    }

    setSelectedSprintIdx(sprintIdx);
    setActiveTab('curriculum');
  };

  // Jump to specific language by ID from packet simulator or topology graph
  const handleSelectLanguageById = (langId: string) => {
    for (const track of ENGINEERING_TRACKS) {
      const found = track.languages.find((l) => l.id === langId);
      if (found) {
        saveRecentSearch({
          id: `lang-${found.id}`,
          type: 'language',
          title: found.name,
          subtitle: found.roleTitle,
          badge: 'Language',
          data: { language: found, trackId: track.id },
        });
        window.dispatchEvent(new Event('kaybit_recent_searches_updated'));

        setSelectedTrackId(track.id);
        setSelectedLanguage(found);
        setActiveTab('code');
        return;
      }
    }
  };

  const handleOpenAiTutorWithCode = (langName: string, snippet: string) => {
    setCodeContextForAi({ languageName: langName, snippet });
    setIsAiTutorOpen(true);
  };

  const handleOpenUserGuide = (doc: 'guide' | 'installation' | 'readme' = 'guide') => {
    setUserGuideDoc(doc);
    setIsUserGuideOpen(true);
  };

  const handleExportBundle = async () => {
    const cachedSnippets = await getAllSnippetRecords();
    const cachedProgress = await getAllProgressRecords();

    const bundleData = {
      project: 'KayBiT_WhatsApp Capstone Studio',
      timestamp: new Date().toISOString(),
      activeThemePreset: activeThemePreset.name,
      indexedDBCachedSnippets: cachedSnippets,
      indexedDBProgress: cachedProgress,
      architectureTracks: ENGINEERING_TRACKS.map((track) => ({
        id: track.id,
        title: track.title,
        languages: track.languages.map((l) => {
          const custom = cachedSnippets[l.id];
          return {
            id: l.id,
            name: l.name,
            codeFile: l.codeFile,
            hasLocalEdits: !!custom,
            currentCode: custom ? custom.customCode : l.codeSnippet,
            performanceTarget: l.metrics[0]?.value || 'N/A',
          };
        }),
      })),
      protobufSpec: PROTOBUF_SPECIFICATION,
      curriculumMilestones: CAPSTONE_MILESTONES,
    };

    const blob = new Blob([JSON.stringify(bundleData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kaybit_whatsapp_capstone_export_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200 theme-transition">
      {/* Universal Header with Recent Searches, Theme Settings & Multiplatform App Icon */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAiTutor={() => setIsAiTutorOpen(true)}
        onExportBundle={handleExportBundle}
        onOpenUserGuide={handleOpenUserGuide}
        onSelectLanguage={handleSelectLanguage}
        onSelectTrack={handleSelectTrack}
        onSelectMilestone={handleSelectMilestone}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onOpenBrandAssets={() => setIsBrandAssetsOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'whatsapp' && (
          <WhatsAppMessenger
            onOpenAiTutorWithContext={(contextText) => {
              setCodeContextForAi({ languageName: 'KayBiT_WhatsApp Multi-Tier Architecture', snippet: contextText });
              setIsAiTutorOpen(true);
            }}
            onNavigateToCode={handleSelectLanguageById}
            onNavigateToDatabase={() => setActiveTab('database')}
          />
        )}

        {activeTab === 'architecture_diagram' && (
          <IntegrationArchitectureViewer
            onNavigateToCode={handleSelectLanguageById}
            onAskAiWithContext={(contextText) => {
              setCodeContextForAi({ languageName: 'Integration Architecture Blueprint', snippet: contextText });
              setIsAiTutorOpen(true);
            }}
          />
        )}

        {activeTab === 'blueprint' && (
          <TrackNavigator
            tracks={ENGINEERING_TRACKS}
            selectedTrackId={selectedTrackId}
            onSelectTrack={setSelectedTrackId}
            onSelectLanguage={handleSelectLanguage}
            onOpenSimulatorForTrack={(trackId) => {
              setSelectedTrackId(trackId);
              setActiveTab('simulator');
            }}
          />
        )}

        {activeTab === 'simulator' && (
          <LivePacketSimulator onSelectLanguageById={handleSelectLanguageById} />
        )}

        {activeTab === 'code' && (
          <CodeWorkbench
            tracks={ENGINEERING_TRACKS}
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleSelectLanguage}
            onAskAiWithCode={handleOpenAiTutorWithCode}
          />
        )}

        {activeTab === 'topology' && (
          <ArchitectureTopology onSelectLanguageById={handleSelectLanguageById} />
        )}

        {activeTab === 'health' && (
          <SystemHealthDashboard
            onSelectTrack={handleSelectTrack}
            onSelectLanguage={handleSelectLanguage}
          />
        )}

        {activeTab === 'database' && (
          <DatabaseBenchmarker />
        )}

        {activeTab === 'curriculum' && (
          <CapstoneCurriculum
            selectedSprintIdx={selectedSprintIdx}
            onSelectSprintIdx={setSelectedSprintIdx}
            onSelectTrack={handleSelectTrack}
            onSelectLanguageById={handleSelectLanguageById}
          />
        )}
      </main>

      {/* Global Studio Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 py-4 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">KayBiT_WhatsApp Capstone Studio</span>
            <span>•</span>
            <span>Theme: <strong className="text-emerald-400">{activeThemePreset.name}</strong></span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Theme Variations
            </button>
            <span>•</span>
            <button
              onClick={() => setIsBrandAssetsOpen(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Brand App Icons
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenUserGuide('guide')}
              className="hover:text-slate-200 underline decoration-slate-700 underline-offset-2 transition-colors cursor-pointer"
            >
              System Docs
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenUserGuide('installation')}
              className="hover:text-slate-200 underline decoration-slate-700 underline-offset-2 transition-colors cursor-pointer"
            >
              Native Build Matrix
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenUserGuide('readme')}
              className="hover:text-slate-200 underline decoration-slate-700 underline-offset-2 transition-colors cursor-pointer"
            >
              README
            </button>
          </div>
        </div>
      </footer>

      {/* Theme Settings Modal (5 Distinct UI Variations) */}
      <ThemeSettingsModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        activeThemeId={activeThemePreset.id}
        onSelectTheme={(theme) => setActiveThemePreset(theme)}
      />

      {/* Multiplatform Brand Logo & App Icon Preview Modal */}
      <BrandAssetsModal
        isOpen={isBrandAssetsOpen}
        onClose={() => setIsBrandAssetsOpen(false)}
      />

      {/* User Guide & Installation Documentation Modal */}
      <UserGuideModal
        isOpen={isUserGuideOpen}
        onClose={() => setIsUserGuideOpen(false)}
        defaultTab={userGuideDoc}
      />

      {/* AI Architecture Tutor Modal */}
      <GeminiTutorModal
        isOpen={isAiTutorOpen}
        onClose={() => setIsAiTutorOpen(false)}
        initialCodeContext={codeContextForAi}
      />
    </div>
  );
}
