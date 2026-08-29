import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Code2, 
  Play, 
  Copy, 
  Check, 
  Terminal, 
  Download, 
  Sparkles, 
  Cpu, 
  Clock, 
  HardDrive, 
  AlertCircle,
  FileCode,
  Layers,
  HelpCircle,
  Filter,
  Search,
  X,
  Box,
  FunctionSquare,
  Server,
  Zap,
  CheckCircle2,
  Database,
  ArrowRight,
  ShieldCheck,
  Binary,
  RotateCcw,
  Save,
  Edit3,
  BookOpen,
  History,
  GitCompare,
  Star,
  CheckSquare,
  Square,
  Trash2,
  Share2
} from 'lucide-react';
import { 
  EngineeringTrack, 
  ProgrammingLanguageInfo, 
  SimulatedExecutionResult,
  ProgressStatus,
  UserSnippetRecord,
  LanguageProgressRecord
} from '../types';
import { 
  PARADIGM_DEFINITIONS, 
  ParadigmFilterId, 
  getLanguageParadigmMeta, 
  matchesParadigmFilter,
  LANGUAGE_PARADIGMS 
} from '../data/paradigmsData';
import {
  getSnippetRecord,
  getAllSnippetRecords,
  saveSnippetRecord,
  deleteSnippetRecord,
  getProgressRecord,
  getAllProgressRecords,
  saveProgressRecord,
  saveExecutionLogRecord,
  getRecentExecutionLogs,
  clearExecutionLogs,
  ExecutionLogRecord
} from '../utils/indexedDBStorage';
import { WorkbenchStorageModal } from './WorkbenchStorageModal';

interface CodeWorkbenchProps {
  tracks: EngineeringTrack[];
  selectedLanguage: ProgrammingLanguageInfo;
  onSelectLanguage: (language: ProgrammingLanguageInfo) => void;
  onAskAiWithCode: (langName: string, snippet: string) => void;
}

export type WorkbenchViewTab = 'editor' | 'diff' | 'notes' | 'history';
export type ProgressFilterOption = 'all' | 'customized' | 'completed' | 'in_progress' | 'not_started';

export const CodeWorkbench: React.FC<CodeWorkbenchProps> = ({
  tracks,
  selectedLanguage,
  onSelectLanguage,
  onAskAiWithCode,
}) => {
  // Navigation & Filtering State
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedParadigm, setSelectedParadigm] = useState<ParadigmFilterId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<string>('all');
  const [progressFilter, setProgressFilter] = useState<ProgressFilterOption>('all');

  // IndexedDB Data State
  const [allSnippetsCache, setAllSnippetsCache] = useState<Record<string, UserSnippetRecord>>({});
  const [allProgressCache, setAllProgressCache] = useState<Record<string, LanguageProgressRecord>>({});
  const [executionLogs, setExecutionLogs] = useState<ExecutionLogRecord[]>([]);
  const [isStorageModalOpen, setIsStorageModalOpen] = useState<boolean>(false);

  // Active Language Editor State
  const [editorTab, setEditorTab] = useState<WorkbenchViewTab>('editor');
  const [editorMode, setEditorMode] = useState<'custom' | 'reference'>('custom');
  const [authoredCode, setAuthoredCode] = useState<string>(selectedLanguage.codeSnippet);
  const [userNotes, setUserNotes] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<number | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Parameters & Sandbox Execution State
  const [activeParams, setActiveParams] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    selectedLanguage.inputParameters?.forEach((param) => {
      initial[param.id] = param.defaultValue;
    });
    return initial;
  });

  const [execResult, setExecResult] = useState<SimulatedExecutionResult | null>(() => {
    if (selectedLanguage.runFunction) {
      return selectedLanguage.runFunction(activeParams);
    }
    return null;
  });

  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // Textarea Ref for handling tab indentations and line numbers
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Flatten all 20 languages
  const allLanguages = useMemo(() => {
    return tracks.flatMap((t) => t.languages);
  }, [tracks]);

  // Load all IndexedDB records on mount
  const refreshIndexedDBData = async () => {
    try {
      const snippets = await getAllSnippetRecords();
      const progress = await getAllProgressRecords();
      setAllSnippetsCache(snippets);
      setAllProgressCache(progress);

      // Load execution logs for selected language
      const logs = await getRecentExecutionLogs(selectedLanguage.id, 25);
      setExecutionLogs(logs);

      // Initialize current language state
      const currentSnippet = snippets[selectedLanguage.id];
      if (currentSnippet && currentSnippet.isCustomized) {
        setAuthoredCode(currentSnippet.customCode);
        setUserNotes(currentSnippet.notes || '');
        setLastSavedTimestamp(currentSnippet.lastModified);
        if (currentSnippet.savedParams) {
          setActiveParams(currentSnippet.savedParams);
        }
      } else {
        setAuthoredCode(selectedLanguage.codeSnippet);
        const currentProg = progress[selectedLanguage.id];
        setUserNotes(currentProg?.notes || '');
        setLastSavedTimestamp(null);
      }
    } catch (err) {
      console.warn('Error loading IndexedDB data:', err);
    }
  };

  useEffect(() => {
    refreshIndexedDBData();
  }, []);

  // When selectedLanguage changes, load its snippet & progress from IndexedDB
  useEffect(() => {
    const currentSnippet = allSnippetsCache[selectedLanguage.id];
    const currentProg = allProgressCache[selectedLanguage.id];

    if (currentSnippet && currentSnippet.isCustomized) {
      setAuthoredCode(currentSnippet.customCode);
      setUserNotes(currentSnippet.notes || currentProg?.notes || '');
      setLastSavedTimestamp(currentSnippet.lastModified);
      if (currentSnippet.savedParams) {
        setActiveParams(currentSnippet.savedParams);
      } else {
        const initial: Record<string, any> = {};
        selectedLanguage.inputParameters?.forEach((param) => {
          initial[param.id] = param.defaultValue;
        });
        setActiveParams(initial);
      }
    } else {
      setAuthoredCode(selectedLanguage.codeSnippet);
      setUserNotes(currentProg?.notes || '');
      setLastSavedTimestamp(null);
      const initial: Record<string, any> = {};
      selectedLanguage.inputParameters?.forEach((param) => {
        initial[param.id] = param.defaultValue;
      });
      setActiveParams(initial);
    }

    setSaveStatus('saved');
    setShowResetConfirm(false);

    // Load recent execution logs for this language
    getRecentExecutionLogs(selectedLanguage.id, 25).then((logs) => {
      setExecutionLogs(logs);
    });

    // Run default simulation
    if (selectedLanguage.runFunction) {
      const initialParams: Record<string, any> = {};
      selectedLanguage.inputParameters?.forEach((p) => {
        initialParams[p.id] = p.defaultValue;
      });
      setExecResult(selectedLanguage.runFunction(initialParams));
    } else {
      setExecResult(null);
    }
  }, [selectedLanguage.id]);

  // Current Language Progress Record Helper
  const currentProgress = useMemo<LanguageProgressRecord>(() => {
    return (
      allProgressCache[selectedLanguage.id] || {
        languageId: selectedLanguage.id,
        languageName: selectedLanguage.name,
        trackId: selectedLanguage.trackId,
        status: 'not_started',
        testRunsCount: 0,
        checklist: {
          reviewedArchitecture: false,
          customizedCode: false,
          executedHarness: false,
          verifiedOutput: false,
          reviewedAiExplanation: false,
        },
        notes: '',
        rating: 0,
      }
    );
  }, [allProgressCache, selectedLanguage]);

  // Check if current snippet has custom modifications vs reference
  const isCustomized = useMemo(() => {
    return authoredCode.trim() !== selectedLanguage.codeSnippet.trim();
  }, [authoredCode, selectedLanguage.codeSnippet]);

  // Auto-Save code & notes changes to IndexedDB (debounced)
  const triggerAutoSave = (newCode: string, newNotes: string, newParams?: Record<string, any>) => {
    setSaveStatus('unsaved');
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus('saving');
      const now = Date.now();
      const customized = newCode.trim() !== selectedLanguage.codeSnippet.trim();

      const record: UserSnippetRecord = {
        languageId: selectedLanguage.id,
        languageName: selectedLanguage.name,
        codeFile: selectedLanguage.codeFile,
        customCode: newCode,
        originalCode: selectedLanguage.codeSnippet,
        isCustomized: customized,
        notes: newNotes,
        lastModified: now,
        version: (allSnippetsCache[selectedLanguage.id]?.version || 0) + 1,
        savedParams: newParams || activeParams,
      };

      await saveSnippetRecord(record);
      setAllSnippetsCache((prev) => ({ ...prev, [selectedLanguage.id]: record }));
      setLastSavedTimestamp(now);
      setSaveStatus('saved');

      // If user started modifying code, auto-advance progress from 'not_started' to 'in_progress'
      if (customized && currentProgress.status === 'not_started') {
        handleUpdateProgressStatus('in_progress', { customizedCode: true });
      }
    }, 800);
  };

  // Handle explicit manual save
  const handleManualSave = async () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    setSaveStatus('saving');
    const now = Date.now();
    const customized = authoredCode.trim() !== selectedLanguage.codeSnippet.trim();

    const record: UserSnippetRecord = {
      languageId: selectedLanguage.id,
      languageName: selectedLanguage.name,
      codeFile: selectedLanguage.codeFile,
      customCode: authoredCode,
      originalCode: selectedLanguage.codeSnippet,
      isCustomized: customized,
      notes: userNotes,
      lastModified: now,
      version: (allSnippetsCache[selectedLanguage.id]?.version || 0) + 1,
      savedParams: activeParams,
    };

    await saveSnippetRecord(record);
    setAllSnippetsCache((prev) => ({ ...prev, [selectedLanguage.id]: record }));
    setLastSavedTimestamp(now);
    setSaveStatus('saved');
  };

  // Handle code change in editor
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setAuthoredCode(val);
    triggerAutoSave(val, userNotes);
  };

  // Handle notes change
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setUserNotes(val);
    triggerAutoSave(authoredCode, val);

    // Also update progress record notes
    const updatedProgress: LanguageProgressRecord = {
      ...currentProgress,
      notes: val,
    };
    saveProgressRecord(updatedProgress);
    setAllProgressCache((prev) => ({ ...prev, [selectedLanguage.id]: updatedProgress }));
  };

  // Handle Tab key in code editor for standard 2-space indentation
  const handleKeyDownInEditor = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      const updated = val.substring(0, start) + '  ' + val.substring(end);
      setAuthoredCode(updated);
      triggerAutoSave(updated, userNotes);

      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Revert custom code back to reference code in IndexedDB
  const handleResetToDefault = async () => {
    await deleteSnippetRecord(selectedLanguage.id);
    setAuthoredCode(selectedLanguage.codeSnippet);
    setLastSavedTimestamp(null);
    setSaveStatus('saved');
    setShowResetConfirm(false);

    setAllSnippetsCache((prev) => {
      const copy = { ...prev };
      delete copy[selectedLanguage.id];
      return copy;
    });
  };

  // Update Language Progress Status in IndexedDB
  const handleUpdateProgressStatus = async (
    newStatus: ProgressStatus, 
    checklistUpdates?: Partial<LanguageProgressRecord['checklist']>
  ) => {
    const updated: LanguageProgressRecord = {
      ...currentProgress,
      status: newStatus,
      completedAt: newStatus === 'completed' || newStatus === 'mastered' ? Date.now() : currentProgress.completedAt,
      lastAttemptAt: Date.now(),
      checklist: {
        ...currentProgress.checklist,
        ...(checklistUpdates || {}),
      },
    };

    await saveProgressRecord(updated);
    setAllProgressCache((prev) => ({ ...prev, [selectedLanguage.id]: updated }));
  };

  // Toggle individual checklist items
  const handleToggleChecklistItem = async (key: keyof LanguageProgressRecord['checklist']) => {
    const newChecklist = {
      ...currentProgress.checklist,
      [key]: !currentProgress.checklist[key],
    };

    // If all items checked, auto-advance to completed
    const allChecked = Object.values(newChecklist).every(Boolean);
    const newStatus: ProgressStatus = allChecked && currentProgress.status === 'not_started' 
      ? 'completed' 
      : currentProgress.status === 'not_started' 
      ? 'in_progress' 
      : currentProgress.status;

    const updated: LanguageProgressRecord = {
      ...currentProgress,
      status: newStatus,
      checklist: newChecklist,
      completedAt: allChecked ? Date.now() : currentProgress.completedAt,
    };

    await saveProgressRecord(updated);
    setAllProgressCache((prev) => ({ ...prev, [selectedLanguage.id]: updated }));
  };

  // Update Rating
  const handleSetRating = async (rating: number) => {
    const updated: LanguageProgressRecord = {
      ...currentProgress,
      rating: currentProgress.rating === rating ? 0 : rating,
    };
    await saveProgressRecord(updated);
    setAllProgressCache((prev) => ({ ...prev, [selectedLanguage.id]: updated }));
  };

  // Compute Overall Workbench Progress Statistics
  const overallProgressStats = useMemo(() => {
    const total = allLanguages.length; // 20
    let completedCount = 0;
    let masteredCount = 0;
    let inProgressCount = 0;
    let customizedSnippetsCount = 0;

    allLanguages.forEach((lang) => {
      const prog = allProgressCache[lang.id];
      if (prog) {
        if (prog.status === 'mastered') masteredCount++;
        else if (prog.status === 'completed') completedCount++;
        else if (prog.status === 'in_progress') inProgressCount++;
      }
      if (allSnippetsCache[lang.id]?.isCustomized) {
        customizedSnippetsCount++;
      }
    });

    const percent = Math.round(((completedCount + masteredCount) / total) * 100);

    return {
      total,
      completedCount,
      masteredCount,
      inProgressCount,
      customizedSnippetsCount,
      percent,
    };
  }, [allLanguages, allProgressCache, allSnippetsCache]);

  // Compute stats for each paradigm filter
  const paradigmStats = useMemo(() => {
    const counts: Record<ParadigmFilterId, number> = {
      all: allLanguages.length,
      oop: 0,
      functional: 0,
      systems: 0,
      managed: 0,
      concurrent: 0,
      declarative: 0,
    };

    allLanguages.forEach((lang) => {
      const meta = LANGUAGE_PARADIGMS[lang.id];
      if (meta) {
        meta.paradigms.forEach((p) => {
          if (counts[p] !== undefined) {
            counts[p]++;
          }
        });
      }
    });

    return counts;
  }, [allLanguages]);

  // Filter languages by Paradigm, Track, Progress Status, and Search Query
  const filteredTracks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tracks
      .map((track) => {
        if (selectedTrackFilter !== 'all' && track.id !== selectedTrackFilter) {
          return { ...track, languages: [] };
        }

        const matchingLangs = track.languages.filter((lang) => {
          // Paradigm filter
          const matchesParadigm = matchesParadigmFilter(lang.id, selectedParadigm);
          if (!matchesParadigm) return false;

          // Progress filter
          const prog = allProgressCache[lang.id];
          const isCustom = allSnippetsCache[lang.id]?.isCustomized;
          if (progressFilter === 'customized' && !isCustom) return false;
          if (progressFilter === 'completed' && prog?.status !== 'completed' && prog?.status !== 'mastered') return false;
          if (progressFilter === 'in_progress' && prog?.status !== 'in_progress') return false;
          if (progressFilter === 'not_started' && prog && prog.status !== 'not_started') return false;

          // Search query filter
          if (!query) return true;

          const meta = LANGUAGE_PARADIGMS[lang.id];
          const matchesName = lang.name.toLowerCase().includes(query);
          const matchesFile = lang.codeFile.toLowerCase().includes(query);
          const matchesRole = lang.roleTitle.toLowerCase().includes(query);
          const matchesConcepts = lang.keyConcepts.some((c) => c.toLowerCase().includes(query));
          const matchesParadigmLabels = meta?.paradigmLabels.some((p) => p.toLowerCase().includes(query));
          const matchesPrimary = meta?.primaryParadigm.toLowerCase().includes(query);

          return (
            matchesName ||
            matchesFile ||
            matchesRole ||
            matchesConcepts ||
            matchesParadigmLabels ||
            matchesPrimary
          );
        });

        return {
          ...track,
          languages: matchingLangs,
        };
      })
      .filter((track) => track.languages.length > 0);
  }, [tracks, selectedParadigm, selectedTrackFilter, progressFilter, searchQuery, allProgressCache, allSnippetsCache]);

  const totalFilteredCount = useMemo(() => {
    return filteredTracks.reduce((acc, t) => acc + t.languages.length, 0);
  }, [filteredTracks]);

  // Active language paradigm metadata
  const currentParadigmMeta = useMemo(() => {
    return getLanguageParadigmMeta(selectedLanguage.id);
  }, [selectedLanguage.id]);

  // Related peers sharing the active paradigm
  const relatedParadigmPeers = useMemo(() => {
    if (selectedParadigm === 'all') {
      const primary = currentParadigmMeta.paradigms[0] || 'all';
      return allLanguages.filter(
        (l) => l.id !== selectedLanguage.id && matchesParadigmFilter(l.id, primary)
      ).slice(0, 4);
    }
    return allLanguages.filter(
      (l) => l.id !== selectedLanguage.id && matchesParadigmFilter(l.id, selectedParadigm)
    ).slice(0, 4);
  }, [allLanguages, selectedLanguage.id, selectedParadigm, currentParadigmMeta]);

  // Handle language selection from sidebar
  const handleSelectLanguage = (lang: ProgrammingLanguageInfo) => {
    onSelectLanguage(lang);
  };

  const handleParamChange = (id: string, value: any) => {
    const updated = { ...activeParams, [id]: value };
    setActiveParams(updated);
    triggerAutoSave(authoredCode, userNotes, updated);
  };

  // Run Test Simulation with active parameters & save log to IndexedDB
  const handleRunSimulation = () => {
    setIsExecuting(true);
    setTimeout(async () => {
      if (selectedLanguage.runFunction) {
        const res = selectedLanguage.runFunction(activeParams);
        setExecResult(res);

        // Record execution into IndexedDB
        const logEntry: ExecutionLogRecord = {
          languageId: selectedLanguage.id,
          languageName: selectedLanguage.name,
          timestamp: Date.now(),
          status: res.status,
          executionTimeMs: res.executionTimeMs,
          memoryUsedMb: res.memoryUsedMb,
          logs: res.logs,
          outputData: res.outputData,
          inputParams: activeParams,
          isCustomCode: isCustomized,
        };

        await saveExecutionLogRecord(logEntry);
        setExecutionLogs((prev) => [logEntry, ...prev.slice(0, 24)]);

        // Update progress test run count & mark harness executed
        const newRunsCount = (currentProgress.testRunsCount || 0) + 1;
        const newStatus = currentProgress.status === 'not_started' ? 'in_progress' : currentProgress.status;
        const updatedProg: LanguageProgressRecord = {
          ...currentProgress,
          testRunsCount: newRunsCount,
          status: newStatus,
          lastAttemptAt: Date.now(),
          checklist: {
            ...currentProgress.checklist,
            executedHarness: true,
            verifiedOutput: res.status === 'success',
          },
        };
        await saveProgressRecord(updatedProg);
        setAllProgressCache((prev) => ({ ...prev, [selectedLanguage.id]: updatedProg }));
      }
      setIsExecuting(false);
    }, 250);
  };

  const handleClearLogsForCurrentLanguage = async () => {
    await clearExecutionLogs(selectedLanguage.id);
    setExecutionLogs([]);
  };

  const handleCopyCode = () => {
    const codeToCopy = editorMode === 'custom' ? authoredCode : selectedLanguage.codeSnippet;
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const codeToDownload = editorMode === 'custom' ? authoredCode : selectedLanguage.codeSnippet;
    const element = document.createElement('a');
    const file = new Blob([codeToDownload], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = selectedLanguage.codeFile.split('/').pop() || 'code.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getParadigmIcon = (iconName: string) => {
    switch (iconName) {
      case 'Box':
        return <Box className="w-3.5 h-3.5" />;
      case 'FunctionSquare':
        return <FunctionSquare className="w-3.5 h-3.5" />;
      case 'Cpu':
        return <Cpu className="w-3.5 h-3.5" />;
      case 'Server':
        return <Server className="w-3.5 h-3.5" />;
      case 'Zap':
        return <Zap className="w-3.5 h-3.5" />;
      case 'Terminal':
        return <Terminal className="w-3.5 h-3.5" />;
      default:
        return <Layers className="w-3.5 h-3.5" />;
    }
  };

  // Helper to generate line numbers for editor
  const lineNumbers = useMemo(() => {
    const text = editorMode === 'custom' ? authoredCode : selectedLanguage.codeSnippet;
    const lines = text.split('\n').length;
    return Array.from({ length: lines }, (_, i) => i + 1);
  }, [authoredCode, selectedLanguage.codeSnippet, editorMode]);

  return (
    <div className="space-y-6">
      {/* =========================================================================
          Top IndexedDB Progress Dashboard & Paradigm Taxonomy Filter Bar
         ========================================================================= */}
      <div 
        id="code-paradigm-filter-bar"
        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4"
      >
        {/* Top Progress & IndexedDB Status Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                  KayBiT Multi-Language Engineering Workbench
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  IndexedDB Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Author code, run test harnesses, and track learning progress—persisted client-side via IndexedDB.
              </p>
            </div>
          </div>

          {/* Workbench Progress Metrics & Storage Modal Trigger */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Progress summary stats */}
            <div className="flex items-center gap-3 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-mono block">Progress</span>
                <span className="font-bold text-emerald-400">
                  {overallProgressStats.completedCount + overallProgressStats.masteredCount} / 20 Completed
                </span>
              </div>
              <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-sky-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${overallProgressStats.percent}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-slate-300">{overallProgressStats.percent}%</span>
            </div>

            {/* Storage Manager Button */}
            <button
              id="btn-open-indexeddb-modal"
              onClick={() => setIsStorageModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Open IndexedDB Storage & Backup Manager"
            >
              <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
              <span>Storage Manager</span>
              {overallProgressStats.customizedSnippetsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                  {overallProgressStats.customizedSnippetsCount} saved
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Progress Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[11px] text-slate-500 font-mono uppercase mr-1">Status:</span>
            {[
              { id: 'all', label: 'All Modules', count: allLanguages.length },
              { id: 'customized', label: 'Customized in IndexedDB', count: overallProgressStats.customizedSnippetsCount },
              { id: 'completed', label: 'Completed / Mastered', count: overallProgressStats.completedCount + overallProgressStats.masteredCount },
              { id: 'in_progress', label: 'In Progress', count: overallProgressStats.inProgressCount },
            ].map((pf) => (
              <button
                key={pf.id}
                onClick={() => setProgressFilter(pf.id as ProgressFilterOption)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer border shrink-0 ${
                  progressFilter === pf.id
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span>{pf.label}</span>
                <span className="text-[10px] font-mono px-1 rounded bg-slate-800/80 text-slate-400">
                  {pf.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="code-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search syntax, file, role..."
                className="w-full pl-8 pr-7 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {(selectedParadigm !== 'all' || selectedTrackFilter !== 'all' || progressFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedParadigm('all');
                  setSelectedTrackFilter('all');
                  setProgressFilter('all');
                  setSearchQuery('');
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-all"
                title="Reset all filters"
              >
                <X className="w-3 h-3 text-rose-400" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Paradigm Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
          {PARADIGM_DEFINITIONS.map((pDef) => {
            const isSelected = selectedParadigm === pDef.id;
            const count = paradigmStats[pDef.id];

            return (
              <button
                key={pDef.id}
                id={`btn-paradigm-${pDef.id}`}
                onClick={() => setSelectedParadigm(pDef.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border shrink-0 ${
                  isSelected
                    ? `${pDef.accentBg} ${pDef.borderColor} ${pDef.textColor} shadow-md ring-1 ring-emerald-500/20`
                    : 'bg-slate-950/70 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={pDef.description}
              >
                <span className={isSelected ? pDef.textColor : 'text-slate-500'}>
                  {getParadigmIcon(pDef.iconName)}
                </span>
                <span>{pDef.shortName}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          Main Workspace Grid (Sidebar 3 cols + Main Editor 9 cols)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar: File Tree & Language Navigator (3 cols) */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl flex flex-col max-h-[920px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Microservices & Files
              </span>
            </div>
            <span className="text-[10px] font-mono bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
              {totalFilteredCount} matching
            </span>
          </div>

          {/* Track Filter Select */}
          <div className="text-xs">
            <select
              value={selectedTrackFilter}
              onChange={(e) => setSelectedTrackFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Engineering Tracks (T01 - T05)</option>
              {tracks.map((t, idx) => (
                <option key={t.id} value={t.id}>
                  T0{idx + 1}: {t.title.split('&')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Module List with Status Badges */}
          <div className="space-y-4 overflow-y-auto no-scrollbar pr-1 flex-1">
            {filteredTracks.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 space-y-2 bg-slate-950/50 rounded-xl border border-slate-800/80">
                <AlertCircle className="w-5 h-5 text-amber-400 mx-auto" />
                <p className="font-semibold text-slate-200">No languages match the filter criteria.</p>
                <p className="text-[11px] text-slate-500">Try changing paradigm, status, or search query.</p>
                <button
                  onClick={() => {
                    setSelectedParadigm('all');
                    setSelectedTrackFilter('all');
                    setProgressFilter('all');
                    setSearchQuery('');
                  }}
                  className="mt-2 px-3 py-1 bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-medium hover:bg-emerald-600/30 cursor-pointer"
                >
                  Show All 20 Languages
                </button>
              </div>
            ) : (
              filteredTracks.map((track, tIdx) => (
                <div key={track.id} className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between px-2 py-1 bg-slate-950/40 rounded-lg">
                    <span>{track.title.split('&')[0]}</span>
                    <span className="text-[9px] font-mono text-slate-500">T0{tIdx + 1}</span>
                  </div>

                  <div className="space-y-1">
                    {track.languages.map((lang) => {
                      const isSelected = lang.id === selectedLanguage.id;
                      const pMeta = LANGUAGE_PARADIGMS[lang.id];
                      const prog = allProgressCache[lang.id];
                      const isCustom = allSnippetsCache[lang.id]?.isCustomized;

                      return (
                        <button
                          key={lang.id}
                          id={`code-lang-btn-${lang.id}`}
                          onClick={() => handleSelectLanguage(lang)}
                          className={`w-full text-left px-2.5 py-2 rounded-xl text-xs transition-all flex flex-col gap-1 group border cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-500/15 text-emerald-300 font-semibold border-emerald-500/40 shadow-sm'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2 truncate">
                              {/* Progress icon indicator */}
                              {prog?.status === 'mastered' ? (
                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                              ) : prog?.status === 'completed' ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              ) : prog?.status === 'in_progress' ? (
                                <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                              ) : (
                                <FileCode
                                  className={`w-3.5 h-3.5 shrink-0 ${
                                    isSelected ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                                  }`}
                                />
                              )}
                              <span className="truncate">{lang.name}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              {isCustom && (
                                <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-indigo-950/70 text-indigo-300 border border-indigo-800/50" title="Authored snippet cached in IndexedDB">
                                  Custom
                                </span>
                              )}
                              <span className="text-[9px] font-mono opacity-70 shrink-0 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
                                {lang.codeFile.split('.').pop()}
                              </span>
                            </div>
                          </div>

                          {/* Paradigm Mini Badges */}
                          {pMeta && (
                            <div className="flex items-center gap-1 flex-wrap pl-5 text-[9px]">
                              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700/60 font-mono">
                                {pMeta.primaryParadigm.split('&')[0].trim()}
                              </span>
                              {pMeta.paradigms.includes('systems') && (
                                <span className="px-1.5 py-0.2 rounded bg-rose-950/50 text-rose-300 border border-rose-800/40 font-mono">
                                  Low-Level
                                </span>
                              )}
                              {pMeta.paradigms.includes('functional') && (
                                <span className="px-1.5 py-0.2 rounded bg-emerald-950/50 text-emerald-300 border border-emerald-800/40 font-mono">
                                  FP
                                </span>
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Area: Code Editor & Interactive Test Runner (9 cols) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Active Module Header & Progress Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-slate-100">{selectedLanguage.name}</h2>
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {selectedLanguage.roleTitle}
                  </span>
                  {isCustomized && (
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                      <Edit3 className="w-3 h-3" /> Custom User Implementation
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">{selectedLanguage.codeFile}</p>
              </div>

              {/* Progress Mastery & Status Selector */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <div className="flex items-center bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 gap-1">
                  <span className="text-[10px] text-slate-500 font-mono uppercase mr-1">Status:</span>
                  <select
                    value={currentProgress.status}
                    onChange={(e) => handleUpdateProgressStatus(e.target.value as ProgressStatus)}
                    className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="not_started" className="bg-slate-900 text-slate-300">⚪ Not Started</option>
                    <option value="in_progress" className="bg-slate-900 text-sky-400">🔵 In Progress</option>
                    <option value="completed" className="bg-slate-900 text-emerald-400">🟢 Completed</option>
                    <option value="mastered" className="bg-slate-900 text-amber-400">⭐ Mastered</option>
                  </select>
                </div>

                {/* Rating stars */}
                <div className="flex items-center bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleSetRating(star)}
                      className="text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
                      title={`Rate familiarity: ${star}/5`}
                    >
                      <Star
                        className={`w-3.5 h-3.5 ${
                          (currentProgress.rating || 0) >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Architectural Role & Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-7 text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/60 flex flex-col justify-between">
                <div>
                  <strong className="text-slate-200">Architectural Role: </strong>
                  {selectedLanguage.description}
                </div>
                {lastSavedTimestamp && (
                  <div className="text-[10px] text-slate-500 font-mono pt-2 flex items-center gap-1.5">
                    <Database className="w-3 h-3 text-emerald-400" />
                    <span>Last cached in IndexedDB: {new Date(lastSavedTimestamp).toLocaleTimeString()}</span>
                  </div>
                )}
              </div>

              {/* Interactive Module Checklist (persisted in IndexedDB) */}
              <div className="md:col-span-5 bg-slate-950/50 p-3 rounded-xl border border-slate-800/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                  <span className="font-bold text-slate-200 text-[11px] uppercase tracking-wider">
                    Module Checklist
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    {Object.values(currentProgress.checklist).filter(Boolean).length} / 5 Done
                  </span>
                </div>

                <div className="space-y-1 text-[11px]">
                  <button
                    onClick={() => handleToggleChecklistItem('reviewedArchitecture')}
                    className="w-full flex items-center gap-2 text-left text-slate-300 hover:text-slate-100 cursor-pointer"
                  >
                    {currentProgress.checklist.reviewedArchitecture ? (
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span className={currentProgress.checklist.reviewedArchitecture ? 'line-through opacity-70' : ''}>
                      Architecture & Role Reviewed
                    </span>
                  </button>

                  <button
                    onClick={() => handleToggleChecklistItem('customizedCode')}
                    className="w-full flex items-center gap-2 text-left text-slate-300 hover:text-slate-100 cursor-pointer"
                  >
                    {currentProgress.checklist.customizedCode || isCustomized ? (
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span className={currentProgress.checklist.customizedCode || isCustomized ? 'line-through opacity-70' : ''}>
                      Code Inspected & Authored
                    </span>
                  </button>

                  <button
                    onClick={() => handleToggleChecklistItem('executedHarness')}
                    className="w-full flex items-center gap-2 text-left text-slate-300 hover:text-slate-100 cursor-pointer"
                  >
                    {currentProgress.checklist.executedHarness ? (
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span className={currentProgress.checklist.executedHarness ? 'line-through opacity-70' : ''}>
                      Test Harness Executed ({currentProgress.testRunsCount || 0} runs)
                    </span>
                  </button>

                  <button
                    onClick={() => handleToggleChecklistItem('verifiedOutput')}
                    className="w-full flex items-center gap-2 text-left text-slate-300 hover:text-slate-100 cursor-pointer"
                  >
                    {currentProgress.checklist.verifiedOutput ? (
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span className={currentProgress.checklist.verifiedOutput ? 'line-through opacity-70' : ''}>
                      Heap & Latency Verified
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Language Paradigm & Runtime Specifications Grid */}
            {currentParadigmMeta && (
              <div 
                id="language-paradigm-spec-card"
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <div className="flex items-center gap-2">
                    <Binary className="w-4 h-4 text-sky-400" />
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      Paradigm & Memory Runtime Specification
                    </h4>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {currentParadigmMeta.paradigmLabels.map((pLabel, pIdx) => (
                      <span
                        key={pIdx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                      >
                        {pLabel}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono block uppercase">Primary Paradigm</span>
                    <p className="font-semibold text-slate-200">{currentParadigmMeta.primaryParadigm}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono block uppercase">Memory Model & Safety</span>
                    <p className="font-semibold text-slate-200 line-clamp-2">{currentParadigmMeta.memoryModel}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono block uppercase">Type Invariants</span>
                    <p className="font-semibold text-slate-200 line-clamp-2">{currentParadigmMeta.typeSystem}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] text-slate-500 font-mono block uppercase">Runtime Host</span>
                    <p className="font-semibold text-slate-200 line-clamp-2">{currentParadigmMeta.runtimeEnvironment}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              Interactive Code Editor with IndexedDB Persistence
             ========================================================================= */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl space-y-0">
            {/* Editor Top Navigation Bar */}
            <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                {/* View Tabs */}
                <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 font-medium">
                  <button
                    onClick={() => setEditorTab('editor')}
                    className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      editorTab === 'editor'
                        ? 'bg-slate-800 text-slate-100 font-bold shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Code Editor</span>
                  </button>

                  <button
                    onClick={() => setEditorTab('diff')}
                    className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      editorTab === 'diff'
                        ? 'bg-slate-800 text-slate-100 font-bold shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <GitCompare className="w-3.5 h-3.5 text-sky-400" />
                    <span>Diff View</span>
                  </button>

                  <button
                    onClick={() => setEditorTab('notes')}
                    className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      editorTab === 'notes'
                        ? 'bg-slate-800 text-slate-100 font-bold shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Engineering Notes</span>
                    {userNotes.trim() && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </button>

                  <button
                    onClick={() => setEditorTab('history')}
                    className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                      editorTab === 'history'
                        ? 'bg-slate-800 text-slate-100 font-bold shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <History className="w-3.5 h-3.5 text-indigo-400" />
                    <span>History ({executionLogs.length})</span>
                  </button>
                </div>

                {/* Mode Selector (Custom vs Reference) */}
                {editorTab === 'editor' && (
                  <div className="hidden sm:flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800 text-[11px]">
                    <button
                      onClick={() => setEditorMode('custom')}
                      className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                        editorMode === 'custom'
                          ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Authored Mode
                    </button>
                    <button
                      onClick={() => setEditorMode('reference')}
                      className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                        editorMode === 'reference'
                          ? 'bg-slate-800 text-slate-200 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Reference Mode
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons & Save Indicator */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Save status pill */}
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  {saveStatus === 'saving' ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-spin" />
                      <span className="text-amber-300">Saving to IndexedDB...</span>
                    </>
                  ) : saveStatus === 'unsaved' ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      <span className="text-sky-300">Unsaved edits</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">IndexedDB Synced</span>
                    </>
                  )}
                </div>

                {/* Manual Save Button */}
                <button
                  id="btn-save-codeworkbench-snippet"
                  onClick={handleManualSave}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  title="Force save snippet into IndexedDB"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>

                {/* Reset Snippet Button */}
                {isCustomized && (
                  <button
                    id="btn-reset-snippet-default"
                    onClick={() => setShowResetConfirm(true)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/50 hover:text-rose-300 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1 transition-all cursor-pointer"
                    title="Reset custom edits back to original baseline code"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}

                {/* Copy */}
                <button
                  id="btn-copy-code"
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                {/* Download */}
                <button
                  id="btn-download-file"
                  onClick={handleDownloadFile}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1 transition-all cursor-pointer"
                  title="Download source file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                {/* AI Explain */}
                <button
                  id="btn-ai-explain-code"
                  onClick={() =>
                    onAskAiWithCode(
                      selectedLanguage.name, 
                      editorMode === 'custom' ? authoredCode : selectedLanguage.codeSnippet
                    )
                  }
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white text-xs font-medium shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explain AI</span>
                </button>
              </div>
            </div>

            {/* Reset Confirmation Prompt */}
            {showResetConfirm && (
              <div className="bg-rose-950/60 px-4 py-2.5 border-b border-rose-800/80 flex items-center justify-between text-xs text-rose-200 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Revert custom code in IndexedDB back to baseline reference implementation?</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetToDefault}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Confirm Revert
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Tab 1: Code Editor View */}
            {editorTab === 'editor' && (
              <div className="relative flex bg-slate-950 font-mono text-xs max-h-[460px] overflow-hidden">
                {/* Synchronized Line Numbers */}
                <div className="w-12 py-3 select-none text-right pr-3 bg-slate-950/80 border-r border-slate-800/80 text-slate-600 font-mono text-xs leading-relaxed overflow-hidden">
                  {lineNumbers.map((num) => (
                    <div key={num}>{num}</div>
                  ))}
                </div>

                {/* Main Textarea or Readonly Viewer */}
                {editorMode === 'custom' ? (
                  <textarea
                    ref={textareaRef}
                    id="codeworkbench-custom-editor-textarea"
                    value={authoredCode}
                    onChange={handleCodeChange}
                    onKeyDown={handleKeyDownInEditor}
                    spellCheck={false}
                    className="flex-1 p-3 bg-transparent text-emerald-300/90 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-emerald-500/30 overflow-y-auto no-scrollbar"
                    style={{ minHeight: '380px' }}
                    placeholder="Write or customize implementation here. Changes auto-save to IndexedDB..."
                  />
                ) : (
                  <div className="flex-1 p-3 text-emerald-400/90 font-mono text-xs leading-relaxed overflow-y-auto no-scrollbar bg-slate-950">
                    <pre className="whitespace-pre-wrap">{selectedLanguage.codeSnippet}</pre>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Diff View (Custom vs Reference) */}
            {editorTab === 'diff' && (
              <div className="p-4 max-h-[460px] overflow-y-auto font-mono text-xs leading-relaxed space-y-4 bg-slate-950">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800 font-sans">
                  <span className="font-semibold text-slate-200">
                    Implementation Comparison: Baseline vs. Cached User Code
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {isCustomized ? '⚠️ Code has local customizations' : '✓ Matches baseline reference exactly'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Original Baseline Code
                    </span>
                    <pre className="text-slate-400 text-[11px] whitespace-pre-wrap overflow-x-auto">
                      {selectedLanguage.codeSnippet}
                    </pre>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-xl border border-emerald-900/40 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                      User Authored Code (IndexedDB)
                    </span>
                    <pre className="text-emerald-300/90 text-[11px] whitespace-pre-wrap overflow-x-auto">
                      {authoredCode}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Personal Engineering Notes & Observations */}
            {editorTab === 'notes' && (
              <div className="p-5 max-h-[460px] overflow-y-auto space-y-3 bg-slate-950">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                    <BookOpen className="w-4 h-4" />
                    <span>Personal Engineering Notes & Implementation Observations</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    Persisted into IndexedDB
                  </span>
                </div>

                <textarea
                  id="codeworkbench-user-notes-textarea"
                  value={userNotes}
                  onChange={handleNotesChange}
                  placeholder={`Record your architectural observations, benchmark findings, memory patterns, or optimization notes for ${selectedLanguage.name}...`}
                  className="w-full h-64 p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-amber-500 font-sans leading-relaxed resize-none"
                />
              </div>
            )}

            {/* Tab 4: Execution History Cached in IndexedDB */}
            {editorTab === 'history' && (
              <div className="p-5 max-h-[460px] overflow-y-auto space-y-4 bg-slate-950">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                    <History className="w-4 h-4" />
                    <span>Recent Test Harness Executions (IndexedDB)</span>
                  </div>

                  {executionLogs.length > 0 && (
                    <button
                      onClick={handleClearLogsForCurrentLanguage}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/50 hover:text-rose-300 text-slate-400 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear Log History</span>
                    </button>
                  )}
                </div>

                {executionLogs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 space-y-1">
                    <Clock className="w-6 h-6 mx-auto text-slate-600 mb-2" />
                    <p className="font-semibold text-slate-300">No execution runs recorded yet.</p>
                    <p className="text-[11px]">Click "Execute / Run Logic" below to run test simulations and record them to IndexedDB.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {executionLogs.map((log, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                                log.status === 'success'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {log.status.toUpperCase()}
                            </span>
                            <span className="font-mono text-slate-300 font-semibold">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                            {log.isCustomCode && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/40">
                                Custom Code
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                            <span>{log.executionTimeMs} ms</span>
                            <span>{log.memoryUsedMb} MB</span>
                          </div>
                        </div>

                        <div className="bg-slate-950 p-2 rounded-lg font-mono text-[11px] text-emerald-400/90 space-y-0.5 max-h-24 overflow-y-auto no-scrollbar">
                          {log.logs.slice(0, 3).map((l, lIdx) => (
                            <div key={lIdx}>{l}</div>
                          ))}
                          {log.logs.length > 3 && (
                            <div className="text-slate-500 italic">+ {log.logs.length - 3} more log lines...</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Status Bar */}
            <div className="bg-slate-900/90 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <div className="flex items-center gap-4">
                <span>Lines: {lineNumbers.length}</span>
                <span>Characters: {authoredCode.length}</span>
                <span className="text-emerald-400">{selectedLanguage.architectureLayer}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>{selectedLanguage.protocolStandards.join(' • ')}</span>
              </div>
            </div>
          </div>

          {/* Interactive Parameter Tuner & Unit Test Runner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                  Interactive Test Harness & Execution Sandbox
                </h3>
              </div>

              <button
                id="btn-run-simulation"
                onClick={handleRunSimulation}
                disabled={isExecuting}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isExecuting ? 'Running Test Suite...' : 'Execute / Run Logic'}</span>
              </button>
            </div>

            {/* Dynamic Parameter Inputs for this Language */}
            {selectedLanguage.inputParameters && selectedLanguage.inputParameters.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {selectedLanguage.inputParameters.map((param) => (
                  <div key={param.id} className="space-y-1.5">
                    <label className="block text-slate-400 font-medium">{param.label}</label>
                    {param.type === 'select' ? (
                      <select
                        value={activeParams[param.id] ?? param.defaultValue}
                        onChange={(e) => handleParamChange(param.id, e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-medium"
                      >
                        {param.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : param.type === 'boolean' ? (
                      <label className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!activeParams[param.id]}
                          onChange={(e) => handleParamChange(param.id, e.target.checked)}
                          className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                        />
                        <span>Enable Option</span>
                      </label>
                    ) : (
                      <input
                        type={param.type === 'number' ? 'number' : 'text'}
                        value={activeParams[param.id] ?? param.defaultValue}
                        onChange={(e) =>
                          handleParamChange(
                            param.id,
                            param.type === 'number' ? Number(e.target.value) : e.target.value
                          )
                        }
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-medium"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Simulated Execution Terminal Output */}
            {execResult && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Execution Terminal Logs (IndexedDB Cached)</span>
                  </span>
                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-sky-400" />
                      <span>{execResult.executionTimeMs} ms</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-indigo-400" />
                      <span>{execResult.memoryUsedMb} MB heap</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      {execResult.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5 overflow-x-auto">
                  {execResult.logs.map((log, lIdx) => (
                    <div key={lIdx} className="text-emerald-400/90 leading-relaxed">
                      {log}
                    </div>
                  ))}
                </div>

                {/* Data Return Payload */}
                <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80 font-mono text-[11px] text-slate-400">
                  <span className="text-slate-500 block mb-1 font-semibold">Structured Return Object:</span>
                  <pre className="text-slate-300">{JSON.stringify(execResult.outputData, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Related Paradigm Peers Navigator */}
          {relatedParadigmPeers.length > 0 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Compare Paradigm Peers in Capstone Architecture
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400">
                  Other {selectedParadigm === 'all' ? currentParadigmMeta.primaryParadigm : selectedParadigm.toUpperCase()} languages
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {relatedParadigmPeers.map((peer) => {
                  const pMeta = LANGUAGE_PARADIGMS[peer.id];
                  const prog = allProgressCache[peer.id];

                  return (
                    <button
                      key={peer.id}
                      onClick={() => handleSelectLanguage(peer)}
                      className="p-3 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition-all group flex flex-col justify-between hover:bg-slate-800/40 cursor-pointer"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                            {peer.name}
                          </span>
                          {prog?.status === 'completed' || prog?.status === 'mastered' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors group-hover:translate-x-0.5" />
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{peer.roleTitle}</p>
                      </div>
                      <div className="pt-2 text-[10px] font-mono text-slate-500">
                        {pMeta?.primaryParadigm.split('&')[0]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* IndexedDB Storage & Backup Modal */}
      <WorkbenchStorageModal
        isOpen={isStorageModalOpen}
        onClose={() => setIsStorageModalOpen(false)}
        onDataRestored={() => {
          refreshIndexedDBData();
        }}
      />
    </div>
  );
};
