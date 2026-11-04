import React, { useState, useRef, useEffect } from 'react';
import { 
  Clock, 
  Trash2, 
  ArrowRight, 
  Code2, 
  Layers, 
  GraduationCap, 
  MessageSquare,
  Network,
  PlayCircle,
  GitFork,
  Activity,
  Database,
  X,
  ChevronDown
} from 'lucide-react';
import { 
  RecentSearchItem, 
  getRecentSearches, 
  removeRecentSearch, 
  clearRecentSearches 
} from '../utils/recentSearches';
import { AppTabId } from './Header';
import { ProgrammingLanguageInfo, TrackId } from '../types';

interface RecentSearchesDropdownProps {
  onSelectTab: (tab: AppTabId) => void;
  onSelectLanguage: (language: ProgrammingLanguageInfo) => void;
  onSelectTrack: (trackId: TrackId) => void;
  onSelectMilestone: (sprintIdx: number) => void;
}

export const RecentSearchesDropdown: React.FC<RecentSearchesDropdownProps> = ({
  onSelectTab,
  onSelectLanguage,
  onSelectTrack,
  onSelectMilestone,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [items, setItems] = useState<RecentSearchItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const refreshItems = () => {
    setItems(getRecentSearches());
  };

  useEffect(() => {
    refreshItems();
    // Listen to storage event or custom event for cross-component sync
    const handleStorageChange = () => refreshItems();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('kaybit_recent_searches_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('kaybit_recent_searches_updated', handleStorageChange);
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item: RecentSearchItem) => {
    setIsOpen(false);
    if (item.type === 'tab' && item.data.tabId) {
      onSelectTab(item.data.tabId as AppTabId);
    } else if (item.type === 'language' && item.data.language) {
      onSelectLanguage(item.data.language);
    } else if (item.type === 'track' && item.data.trackId) {
      onSelectTrack(item.data.trackId);
    } else if (item.type === 'milestone' && typeof item.data.sprintIdx === 'number') {
      onSelectMilestone(item.data.sprintIdx);
    } else if (item.type === 'language' && item.data.trackId) {
      onSelectTrack(item.data.trackId);
    }
  };

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = removeRecentSearch(id);
    setItems(updated);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearRecentSearches();
    setItems([]);
  };

  const getItemIcon = (type: string, tabId?: string) => {
    if (type === 'tab') {
      switch (tabId) {
        case 'whatsapp': return <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />;
        case 'architecture_diagram': return <Network className="w-3.5 h-3.5 text-sky-400" />;
        case 'blueprint': return <Layers className="w-3.5 h-3.5 text-indigo-400" />;
        case 'simulator': return <PlayCircle className="w-3.5 h-3.5 text-amber-400" />;
        case 'code': return <Code2 className="w-3.5 h-3.5 text-rose-400" />;
        case 'topology': return <GitFork className="w-3.5 h-3.5 text-emerald-400" />;
        case 'health': return <Activity className="w-3.5 h-3.5 text-cyan-400" />;
        case 'database': return <Database className="w-3.5 h-3.5 text-teal-400" />;
        case 'curriculum': return <GraduationCap className="w-3.5 h-3.5 text-purple-400" />;
        default: return <Clock className="w-3.5 h-3.5 text-slate-400" />;
      }
    }
    if (type === 'language') return <Code2 className="w-3.5 h-3.5 text-emerald-400" />;
    if (type === 'track') return <Layers className="w-3.5 h-3.5 text-sky-400" />;
    if (type === 'milestone') return <GraduationCap className="w-3.5 h-3.5 text-amber-400" />;
    return <Clock className="w-3.5 h-3.5 text-slate-400" />;
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Math.max(0, Date.now() - timestamp);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return 'Recently';
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {/* Header Button */}
      <button
        id="btn-recent-searches"
        onClick={() => {
          refreshItems();
          setIsOpen((prev) => !prev);
        }}
        className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer border shadow-sm ${
          isOpen
            ? 'bg-slate-800 text-white border-emerald-500/50 ring-1 ring-emerald-500/30'
            : 'bg-slate-800/80 hover:bg-slate-750 text-slate-300 border-slate-700 hover:border-slate-600'
        }`}
        title="View last 5 navigation items and language lookups"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Clock className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">Recent</span>
        <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          {items.length}
        </span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl shadow-emerald-950/50 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Recent Searches & Views</span>
            </div>
            {items.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer"
                title="Clear all recent searches"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* List of Last 5 Items */}
          <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-5 text-center text-xs text-slate-500">
                No recent searches yet. Search for a language or click a tab to track history.
              </div>
            ) : (
              items.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="p-2.5 hover:bg-slate-800/60 transition-colors flex items-center justify-between gap-2.5 cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700/60 shrink-0 group-hover:border-emerald-500/40">
                      {getItemIcon(item.type, item.data.tabId)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-200 truncate group-hover:text-emerald-400 transition-colors">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                        <span className="capitalize">{item.subtitle || item.type}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(item.timestamp)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => handleRemove(e, item.id)}
                      className="p-1 rounded text-slate-500 hover:text-slate-300 hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      title="Remove from history"
                      aria-label="Remove item"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2 bg-slate-950/60 border-t border-slate-800/80 text-[10px] text-slate-500 text-center">
            Persisted in localStorage • Click to jump instantly
          </div>
        </div>
      )}
    </div>
  );
};
