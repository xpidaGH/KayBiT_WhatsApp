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
import { ENGINEERING_TRACKS } from './data/tracksData';
import { TrackId, ProgrammingLanguageInfo } from './types';
import { CAPSTONE_MILESTONES, PROTOBUF_SPECIFICATION } from './data/curriculumData';
import { getAllSnippetRecords, getAllProgressRecords } from './utils/indexedDBStorage';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('kaybit_theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return 'dark';
  });

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

  // Synchronize Theme with Document Element
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
    localStorage.setItem('kaybit_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + L: Toggle Theme
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'l' || e.key === 'L')) {
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
          setActiveTab(tabMap[e.key]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  // Jump from track navigator or search to code workbench
  const handleSelectLanguage = (lang: ProgrammingLanguageInfo) => {
    setSelectedTrackId(lang.trackId);
    setSelectedLanguage(lang);
    setActiveTab('code');
  };

  // Jump to track blueprint from search
  const handleSelectTrack = (trackId: TrackId) => {
    setSelectedTrackId(trackId);
    setActiveTab('blueprint');
  };

  // Jump to curriculum milestone sprint from search
  const handleSelectMilestone = (sprintIdx: number) => {
    setSelectedSprintIdx(sprintIdx);
    setActiveTab('curriculum');
  };

  // Jump to specific language by ID from packet simulator or topology graph
  const handleSelectLanguageById = (langId: string) => {
    for (const track of ENGINEERING_TRACKS) {
      const found = track.languages.find((l) => l.id === langId);
      if (found) {
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
      indexedDBCachedSnippets: cachedSnippets,
      indexedDBProgress: cachedProgress,
      architectureTracks: ENGINEERING_TRACKS.map((track) => ({
        id: track.id,
        title: track.title,
        languages: track.languages.map((l) => {
          const custom = cachedSnippets[l.id];
          return {
            name: l.name,
            role: l.roleTitle,
            file: l.codeFile,
            snippet: custom?.isCustomized ? custom.customCode : l.codeSnippet,
            isCustomized: !!custom?.isCustomized,
            progressStatus: cachedProgress[l.id]?.status || 'not_started',
          };
        }),
      })),
      curriculum: CAPSTONE_MILESTONES,
      protobufContract: PROTOBUF_SPECIFICATION,
    };

    const blob = new Blob([JSON.stringify(bundleData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kaybit_whatsapp_capstone_bundle.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Main Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAiTutor={() => {
          setCodeContextForAi(null);
          setIsAiTutorOpen(true);
        }}
        onExportBundle={handleExportBundle}
        onOpenUserGuide={handleOpenUserGuide}
        onSelectLanguage={handleSelectLanguage}
        onSelectTrack={handleSelectTrack}
        onSelectMilestone={handleSelectMilestone}
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
            onSelectLanguage={setSelectedLanguage}
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

        {activeTab === 'database' && <DatabaseBenchmarker />}

        {activeTab === 'curriculum' && (
          <CapstoneCurriculum
            selectedSprintIdx={selectedSprintIdx}
            onSelectSprintIdx={setSelectedSprintIdx}
            onSelectTrack={handleSelectTrack}
            onSelectLanguageById={handleSelectLanguageById}
          />
        )}
      </main>


      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">KayBiT_WhatsApp Capstone Studio</span>
            <span>•</span>
            <span>5 Engineering Tracks • 20 Programming Languages</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <button
              onClick={() => handleOpenUserGuide('guide')}
              className="hover:text-emerald-400 underline decoration-slate-700 underline-offset-2 transition-colors cursor-pointer"
            >
              User Guide
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenUserGuide('installation')}
              className="hover:text-sky-400 underline decoration-slate-700 underline-offset-2 transition-colors cursor-pointer"
            >
              Native Install Guide (APK/EXE/DMG)
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
