import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  X, 
  Code2, 
  Layers, 
  GraduationCap, 
  ArrowRight, 
  Check, 
  Command,
  FileCode,
  Tag,
  Sparkles,
  Zap,
  ShieldAlert,
  Database
} from 'lucide-react';
import { ENGINEERING_TRACKS } from '../data/tracksData';
import { CAPSTONE_MILESTONES } from '../data/curriculumData';
import { ProgrammingLanguageInfo, TrackId } from '../types';

interface GlobalSearchBarProps {
  onSelectLanguage: (language: ProgrammingLanguageInfo) => void;
  onSelectTrack: (trackId: TrackId) => void;
  onSelectMilestone: (sprintIdx: number) => void;
}

type SearchCategory = 'all' | 'languages' | 'tracks' | 'milestones';

interface SearchResultItem {
  id: string;
  type: 'language' | 'track' | 'milestone';
  title: string;
  subtitle: string;
  badge: string;
  meta?: string;
  color?: string;
  tags?: string[];
  data: any;
}

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  onSelectLanguage,
  onSelectTrack,
  onSelectMilestone,
}) => {
  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isMac, setIsMac] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Detect OS platform for Cmd (⌘) vs Ctrl key symbol
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent || navigator.platform || ''));
    }
  }, []);

  // Flatten all searchable items
  const allSearchItems = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];

    // 1. Engineering Tracks
    ENGINEERING_TRACKS.forEach((track) => {
      items.push({
        id: `track-${track.id}`,
        type: 'track',
        title: track.title,
        subtitle: track.subtitle,
        badge: track.badge,
        meta: `${track.performanceTarget} • ${track.languages.map((l) => l.name).join(', ')}`,
        color: track.accentColor,
        tags: [track.id, 'track', 'architecture', track.title, track.performanceTarget],
        data: track,
      });

      // 2. Languages within tracks
      track.languages.forEach((lang) => {
        items.push({
          id: `lang-${lang.id}`,
          type: 'language',
          title: lang.name,
          subtitle: lang.roleTitle,
          badge: track.badge,
          meta: `${lang.codeFile} • ${lang.keyConcepts.slice(0, 3).join(', ')}`,
          color: track.accentColor,
          tags: [lang.id, lang.name, lang.codeFile, ...lang.keyConcepts, track.title],
          data: lang,
        });
      });
    });

    // 3. Curriculum Milestones
    CAPSTONE_MILESTONES.forEach((milestone, idx) => {
      const trackDeliverablesSummary = milestone.deliverablesByTrack
        .map((d) => `${d.trackName}: ${d.languageFocus.join('/')}`)
        .join(' | ');

      items.push({
        id: `milestone-${milestone.sprint}`,
        type: 'milestone',
        title: `${milestone.sprint}: ${milestone.title}`,
        subtitle: `Week ${milestone.week} • ${milestone.theme}`,
        badge: `Sprint ${milestone.week}`,
        meta: `${milestone.crossTrackIntegrationGate} • ${trackDeliverablesSummary}`,
        tags: [
          milestone.sprint,
          `week ${milestone.week}`,
          milestone.title,
          milestone.theme,
          ...milestone.deliverablesByTrack.flatMap((d) => [d.deliverable, ...d.languageFocus]),
        ],
        data: { milestone, sprintIdx: idx },
      });
    });

    return items;
  }, []);

  // Filter items based on query & category
  const filteredResults = useMemo(() => {
    let list = allSearchItems;

    // Filter by category tab
    if (activeCategory === 'languages') {
      list = list.filter((item) => item.type === 'language');
    } else if (activeCategory === 'tracks') {
      list = list.filter((item) => item.type === 'track');
    } else if (activeCategory === 'milestones') {
      list = list.filter((item) => item.type === 'milestone');
    }

    if (!query.trim()) {
      return list.slice(0, 10); // default quick list
    }

    const q = query.toLowerCase().trim();
    const queryParts = q.split(/\s+/).filter(Boolean);

    return list.filter((item) => {
      const matchAllParts = (targetStr: string) =>
        queryParts.every((part) => targetStr.toLowerCase().includes(part));

      const matchTitle = matchAllParts(item.title);
      const matchSubtitle = matchAllParts(item.subtitle);
      const matchBadge = matchAllParts(item.badge);
      const matchMeta = item.meta ? matchAllParts(item.meta) : false;
      const matchTags = item.tags ? item.tags.some((tag) => matchAllParts(tag)) : false;

      // Deep match on language specific properties
      if (item.type === 'language') {
        const lang = item.data as ProgrammingLanguageInfo;
        const matchConcepts = lang.keyConcepts.some((c) => matchAllParts(c));
        const matchWhy = matchAllParts(lang.whyChosen);
        const matchFile = matchAllParts(lang.codeFile);
        return matchTitle || matchSubtitle || matchBadge || matchMeta || matchTags || matchConcepts || matchWhy || matchFile;
      }

      // Deep match on track specific properties
      if (item.type === 'track') {
        const track = item.data;
        const matchObj = matchAllParts(track.objective);
        return matchTitle || matchSubtitle || matchBadge || matchMeta || matchTags || matchObj;
      }

      // Deep match on milestone deliverables
      if (item.type === 'milestone') {
        const m = item.data.milestone;
        const matchDeliv = m.deliverablesByTrack.some(
          (d: any) =>
            matchAllParts(d.deliverable) ||
            d.languageFocus.some((l: string) => matchAllParts(l))
        );
        return matchTitle || matchSubtitle || matchBadge || matchMeta || matchTags || matchDeliv;
      }

      return matchTitle || matchSubtitle || matchBadge || matchMeta || matchTags;
    });
  }, [allSearchItems, query, activeCategory]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults, activeCategory]);

  // Ensure selected item is scrolled into view in dropdown
  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const selectedEl = listRef.current.querySelector(`#search-item-${filteredResults[selectedIndex]?.id}`) as HTMLElement;
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex, isOpen, filteredResults]);

  // Click outside listener to dismiss search dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Keyboard Shortcuts (Ctrl/Cmd + F, '/', and Esc)
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      // 1. Primary Shortcut: Ctrl/Cmd + F
      if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setIsOpen(true);
      }
      // 2. Alternative Shortcut: '/' when not inside another form field
      else if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setIsOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  const handleSelectItem = (item: SearchResultItem) => {
    setIsOpen(false);
    setQuery('');

    if (item.type === 'language') {
      onSelectLanguage(item.data as ProgrammingLanguageInfo);
    } else if (item.type === 'track') {
      onSelectTrack(item.data.id as TrackId);
    } else if (item.type === 'milestone') {
      onSelectMilestone(item.data.sprintIdx);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelectItem(filteredResults[selectedIndex]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const categories: SearchCategory[] = ['all', 'languages', 'tracks', 'milestones'];
      const nextIdx = (categories.indexOf(activeCategory) + 1) % categories.length;
      setActiveCategory(categories[nextIdx]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  // Dynamic result count calculations
  const counts = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      return {
        all: allSearchItems.length,
        languages: allSearchItems.filter((i) => i.type === 'language').length,
        tracks: allSearchItems.filter((i) => i.type === 'track').length,
        milestones: allSearchItems.filter((i) => i.type === 'milestone').length,
      };
    }
    return {
      all: allSearchItems.filter((i) => i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q) || (i.tags && i.tags.some(t => t.toLowerCase().includes(q)))).length,
      languages: allSearchItems.filter((i) => i.type === 'language' && (i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q) || (i.tags && i.tags.some(t => t.toLowerCase().includes(q))))).length,
      tracks: allSearchItems.filter((i) => i.type === 'track' && (i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q) || (i.tags && i.tags.some(t => t.toLowerCase().includes(q))))).length,
      milestones: allSearchItems.filter((i) => i.type === 'milestone' && (i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q) || (i.tags && i.tags.some(t => t.toLowerCase().includes(q))))).length,
    };
  }, [allSearchItems, query]);

  // Text highlighter helper for crisp matching visualization
  const renderHighlightedText = (text: string, highlightQuery: string) => {
    if (!highlightQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${highlightQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlightQuery.toLowerCase() ? (
            <mark key={i} className="bg-emerald-500/30 text-emerald-200 font-semibold px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const quickFilterPresets = [
    { label: 'Rust Engine', query: 'Rust' },
    { label: 'Go Gateway', query: 'Go' },
    { label: 'Flutter UI', query: 'Flutter' },
    { label: 'Cassandra', query: 'Cassandra' },
    { label: 'Double Ratchet', query: 'Double Ratchet' },
    { label: 'Sprint 1', query: 'Sprint 1' },
    { label: 'Sprint 6', query: 'Sprint 6' },
  ];

  return (
    <div ref={containerRef} className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg z-50">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none transition-colors" />
        <input
          ref={inputRef}
          type="text"
          id="global-search-input"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search tracks, languages, milestones (Ctrl/Cmd + F)..."
          className="w-full bg-slate-950/80 hover:bg-slate-950 text-slate-100 text-xs rounded-xl pl-9 pr-16 py-2 border border-slate-800 focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/30 focus:outline-none transition-all placeholder:text-slate-500 shadow-inner"
        />

        <div className="absolute right-2.5 flex items-center gap-1.5">
          {query ? (
            <button
              type="button"
              id="btn-clear-global-search"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <kbd 
                onClick={() => {
                  inputRef.current?.focus();
                  setIsOpen(true);
                }}
                className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-900 border border-slate-700/80 rounded shadow-sm cursor-pointer hover:border-emerald-500/50 hover:text-emerald-300 transition-colors"
                title="Press Ctrl+F or Cmd+F to search anywhere"
              >
                {isMac ? '⌘' : 'Ctrl+'}F
              </kbd>
            </div>
          )}
        </div>
      </div>

      {/* Floating Search Autocomplete Dropdown */}
      {isOpen && (
        <div 
          id="global-search-dropdown"
          className="absolute left-0 right-0 top-full mt-2 bg-slate-900/95 border border-slate-700/90 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-100 z-50 ring-1 ring-slate-700"
        >
          {/* Category Filter Pills & Tab Switching */}
          <div className="px-3 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                All ({counts.all})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('tracks')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  activeCategory === 'tracks'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Tracks ({counts.tracks})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('languages')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  activeCategory === 'languages'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Code2 className="w-3 h-3" />
                <span>Languages ({counts.languages})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('milestones')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                  activeCategory === 'milestones'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <GraduationCap className="w-3 h-3" />
                <span>Milestones ({counts.milestones})</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-500 font-mono">
              <span>Tab to toggle</span>
            </div>
          </div>

          {/* Quick Preset Filter Chips when query is empty or short */}
          {!query && (
            <div className="px-3 py-2 bg-slate-950/40 border-b border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] text-slate-500 font-medium shrink-0">Popular:</span>
              {quickFilterPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setQuery(preset.query);
                    inputRef.current?.focus();
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-800/90 hover:bg-slate-700 text-[10px] text-slate-300 border border-slate-700 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          {/* Results List with Key Navigation */}
          <div ref={listRef} className="max-h-80 overflow-y-auto p-1.5 space-y-1 no-scrollbar">
            {filteredResults.length > 0 ? (
              filteredResults.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    id={`search-item-${item.id}`}
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-slate-800/95 text-white border border-emerald-500/40 shadow-lg ring-1 ring-emerald-500/20'
                        : 'hover:bg-slate-800/50 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                          item.type === 'language'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : item.type === 'track'
                            ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                            : 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                        }`}
                      >
                        {item.type === 'language' ? (
                          <Code2 className="w-4 h-4" />
                        ) : item.type === 'track' ? (
                          <Layers className="w-4 h-4" />
                        ) : (
                          <GraduationCap className="w-4 h-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-100 truncate">
                            {renderHighlightedText(item.title, query)}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-slate-950 text-slate-400 border border-slate-800 shrink-0">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 truncate leading-tight mt-0.5">
                          {renderHighlightedText(item.subtitle, query)}
                        </p>
                        {item.meta && (
                          <p className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                            {renderHighlightedText(item.meta, query)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                        {item.type === 'language'
                          ? 'Open Code ↵'
                          : item.type === 'track'
                          ? 'View Track ↵'
                          : 'View Milestone ↵'}
                      </span>
                      <ArrowRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isSelected ? 'text-emerald-400 translate-x-1' : 'text-slate-600'
                        }`}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center space-y-2">
                <Search className="w-7 h-7 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-300 font-semibold">
                  No matching results for "{query}"
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Try searching for <span className="text-emerald-300 font-medium">"Rust"</span>, <span className="text-emerald-300 font-medium">"Go Gateway"</span>, <span className="text-emerald-300 font-medium">"Cassandra"</span>, <span className="text-emerald-300 font-medium">"Sprint 2"</span>, or <span className="text-emerald-300 font-medium">"Double Ratchet"</span>.
                </p>
              </div>
            )}
          </div>

          {/* Footer Navigation Hints */}
          <div className="px-3 py-2 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center gap-3">
              <span><kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700 text-slate-300 font-mono">↑↓</kbd> Navigate</span>
              <span><kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700 text-slate-300 font-mono">↵</kbd> Select</span>
              <span><kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700 text-slate-300 font-mono">Tab</kbd> Filter</span>
              <span><kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-700 text-slate-300 font-mono">Esc</kbd> Close</span>
            </div>
            <span className="font-mono text-slate-500 hidden sm:inline">Shortcut: {isMac ? '⌘F' : 'Ctrl+F'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

