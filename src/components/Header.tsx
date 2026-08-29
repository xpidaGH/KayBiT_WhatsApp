import React from 'react';
import { 
  Layers, 
  PlayCircle, 
  Code2, 
  GitFork, 
  Database, 
  GraduationCap, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Server,
  Download,
  BookOpen,
  Smartphone,
  Sun,
  Moon,
  MessageSquare,
  Network
} from 'lucide-react';
import { GlobalSearchBar } from './GlobalSearchBar';
import { ProgrammingLanguageInfo, TrackId } from '../types';

export type AppTabId = 
  | 'whatsapp'
  | 'architecture_diagram'
  | 'blueprint' 
  | 'simulator' 
  | 'code' 
  | 'topology' 
  | 'health' 
  | 'database' 
  | 'curriculum';

interface HeaderProps {
  activeTab: AppTabId;
  setActiveTab: (tab: AppTabId) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenAiTutor: () => void;
  onExportBundle: () => void;
  onOpenUserGuide: (defaultDoc?: 'guide' | 'installation' | 'readme') => void;
  onSelectLanguage: (language: ProgrammingLanguageInfo) => void;
  onSelectTrack: (trackId: TrackId) => void;
  onSelectMilestone: (sprintIdx: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  theme,
  onToggleTheme,
  onOpenAiTutor,
  onExportBundle,
  onOpenUserGuide,
  onSelectLanguage,
  onSelectTrack,
  onSelectMilestone,
}) => {
  const tabs = [
    { id: 'whatsapp', label: 'KayBiT_WhatsApp App', icon: MessageSquare, badge: 'Live Client' },
    { id: 'architecture_diagram', label: 'Integration Diagram', icon: Network, badge: 'Official Blueprint' },
    { id: 'blueprint', label: 'Tracks Blueprint', icon: Layers, count: '5 Tracks' },
    { id: 'simulator', label: 'Packet Flow Simulator', icon: PlayCircle, badge: 'Live E2E' },
    { id: 'code', label: 'Code Lab & Compilers', icon: Code2, count: '20 Languages' },
    { id: 'topology', label: 'System Topology', icon: GitFork, count: 'Microservices' },
    { id: 'health', label: 'System Health & Metrics', icon: Activity, badge: 'Live SLA' },
    { id: 'database', label: 'Storage & Telemetry', icon: Database, count: 'ACID / NoSQL' },
    { id: 'curriculum', label: 'Timeline & Syllabus', icon: GraduationCap, badge: 'Gantt Planner' },
  ] as const;


  return (
    <header id="main-header" className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      {/* Top Banner with Search & Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-sky-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-black tracking-tight text-xl shrink-0">
            KB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
                KayBiT_WhatsApp
              </h1>
              <span className="hidden md:flex px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Multi-Language Architecture
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Distributed Mobile Messaging System • 5 Tracks • 20 Languages
            </p>
          </div>
        </div>

        {/* Global Search Bar (Languages, Tracks, Syllabus) */}
        <GlobalSearchBar
          onSelectLanguage={onSelectLanguage}
          onSelectTrack={onSelectTrack}
          onSelectMilestone={onSelectMilestone}
        />

        {/* Live System Metrics */}
        <div className="hidden xl:flex items-center gap-5 text-xs text-slate-300 bg-slate-950/60 px-3.5 py-1.5 rounded-xl border border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Gateway:</span>
            <span className="font-semibold text-emerald-400">1M Conns (Go)</span>
          </div>
          <div className="w-px h-3 bg-slate-700" />
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400">P99:</span>
            <span className="font-semibold text-sky-400">&lt; 1.8ms</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Light / Dark Mode Toggle Button */}
          <button
            id="btn-theme-toggle"
            onClick={onToggleTheme}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border shadow-sm ${
              theme === 'light'
                ? 'bg-amber-50 hover:bg-amber-100/80 text-amber-900 border-amber-300 shadow-amber-100'
                : 'bg-slate-800/90 hover:bg-slate-750 text-slate-200 border-slate-700 hover:border-slate-600'
            }`}
            title={`Switch to ${theme === 'dark' ? 'Light Theme (Reader Mode)' : 'Dark Theme (Night Studio)'} (Ctrl/Cmd + Shift + L)`}
            aria-label="Toggle light/dark theme"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600/20" />
                <span className="hidden sm:inline font-semibold text-slate-800">Dark Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                <span className="hidden sm:inline font-medium text-slate-300">Light Mode</span>
              </>
            )}
          </button>

          {/* User Guide Button */}
          <button
            id="btn-user-guide"
            onClick={() => onOpenUserGuide('guide')}
            className="px-2.5 sm:px-3 py-1.5 text-xs font-medium text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-950"
            title="Open User Guide & Manual (Ctrl/Cmd + U)"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">User Guide</span>
          </button>

          {/* Native Install & Distribution Guide Button */}
          <button
            id="btn-install-guide"
            onClick={() => onOpenUserGuide('installation')}
            className="hidden md:flex px-3 py-1.5 text-xs font-medium text-sky-300 hover:text-white bg-sky-950/60 hover:bg-sky-900/80 border border-sky-500/40 rounded-lg transition-all items-center gap-1.5 cursor-pointer shadow-sm shadow-sky-950"
            title="Native Apps (Android APK, Windows .exe, macOS .dmg, PWA)"
          >
            <Smartphone className="w-3.5 h-3.5 text-sky-400" />
            <span>Install Native</span>
          </button>

          <button
            id="btn-export-bundle"
            onClick={onExportBundle}
            className="hidden lg:flex px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-all items-center gap-1.5"
            title="Download Capstone Starter Code & Protobuf contracts"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Bundle</span>
          </button>

          <button
            id="btn-ai-tutor"
            onClick={onOpenAiTutor}
            className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 rounded-lg shadow-md shadow-emerald-500/10 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Advisor</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto no-scrollbar border-t border-slate-800/60">
        <div className="flex space-x-1 py-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80 text-emerald-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {'badge' in tab && tab.badge && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {tab.badge}
                  </span>
                )}
                {'count' in tab && tab.count && !isActive && (
                  <span className="text-[10px] text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

