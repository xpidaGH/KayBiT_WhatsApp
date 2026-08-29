import React, { useState, useEffect } from 'react';
import { 
  Database, 
  X, 
  Download, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  HardDrive, 
  FileCode, 
  CheckSquare, 
  Clock, 
  RefreshCw,
  Sparkles,
  Layers
} from 'lucide-react';
import { 
  exportAllWorkbenchData, 
  importWorkbenchData, 
  resetAllWorkbenchData, 
  getAllSnippetRecords, 
  getAllProgressRecords, 
  getRecentExecutionLogs,
  WorkbenchBackupData 
} from '../utils/indexedDBStorage';

interface WorkbenchStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRestored: () => void;
}

export const WorkbenchStorageModal: React.FC<WorkbenchStorageModalProps> = ({
  isOpen,
  onClose,
  onDataRestored,
}) => {
  const [stats, setStats] = useState<{
    snippetsCount: number;
    customizedCount: number;
    progressCount: number;
    completedCount: number;
    masteredCount: number;
    logsCount: number;
    estimatedSizeBytes: number;
  }>({
    snippetsCount: 0,
    customizedCount: 0,
    progressCount: 0,
    completedCount: 0,
    masteredCount: 0,
    logsCount: 0,
    estimatedSizeBytes: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  const loadStorageStats = async () => {
    try {
      setIsLoading(true);
      const snippets = await getAllSnippetRecords();
      const progress = await getAllProgressRecords();
      const logs = await getRecentExecutionLogs(undefined, 200);

      const customizedCount = Object.values(snippets).filter((s) => s.isCustomized).length;
      const completedCount = Object.values(progress).filter((p) => p.status === 'completed').length;
      const masteredCount = Object.values(progress).filter((p) => p.status === 'mastered').length;

      const rawJson = JSON.stringify({ snippets, progress, logs });
      const estimatedSizeBytes = new Blob([rawJson]).size;

      setStats({
        snippetsCount: Object.keys(snippets).length,
        customizedCount,
        progressCount: Object.keys(progress).length,
        completedCount,
        masteredCount,
        logsCount: logs.length,
        estimatedSizeBytes,
      });
    } catch (err) {
      console.error('Error loading storage stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadStorageStats();
      setStatusMessage(null);
      setShowConfirmReset(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExportBackup = async () => {
    try {
      setIsLoading(true);
      const backupData = await exportAllWorkbenchData();
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kaybit_codeworkbench_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatusMessage({
        type: 'success',
        text: 'Workbench backup successfully exported from IndexedDB!',
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'Failed to export backup data from IndexedDB.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setIsLoading(true);
        const json = JSON.parse(event.target?.result as string) as WorkbenchBackupData;
        await importWorkbenchData(json);
        await loadStorageStats();
        onDataRestored();
        setStatusMessage({
          type: 'success',
          text: `Successfully imported ${Object.keys(json.snippets || {}).length} snippets & ${Object.keys(json.progress || {}).length} progress records into IndexedDB!`,
        });
      } catch (err) {
        console.error('Import error:', err);
        setStatusMessage({
          type: 'error',
          text: 'Invalid or corrupt backup JSON file. Please verify format.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
    // Reset file input value so user can re-import same file if needed
    e.target.value = '';
  };

  const handleFullReset = async () => {
    try {
      setIsLoading(true);
      await resetAllWorkbenchData();
      await loadStorageStats();
      onDataRestored();
      setShowConfirmReset(false);
      setStatusMessage({
        type: 'info',
        text: 'IndexedDB cache cleared. All snippets and progress reset to defaults.',
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'Failed to clear IndexedDB stores.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        id="indexeddb-storage-modal"
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl space-y-0"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                IndexedDB Storage Manager
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Client-Side Persistent Cache
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Manage cached user-authored snippets, study progress, and test logs.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto no-scrollbar">
          {/* Status Alert Banner */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-950/50 border-rose-500/30 text-rose-300'
                  : 'bg-sky-950/50 border-sky-500/30 text-sky-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : statusMessage.type === 'error' ? (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              ) : (
                <Sparkles className="w-4 h-4 shrink-0 text-sky-400" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Database Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Custom Code</span>
                <FileCode className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-lg font-bold text-slate-100">{stats.customizedCount} / 20</p>
              <p className="text-[10px] text-slate-500">Snippets Modified</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Completed</span>
                <CheckSquare className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <p className="text-lg font-bold text-slate-100">{stats.completedCount + stats.masteredCount} / 20</p>
              <p className="text-[10px] text-slate-500">{stats.masteredCount} Mastered</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Execution Logs</span>
                <Clock className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-lg font-bold text-slate-100">{stats.logsCount}</p>
              <p className="text-[10px] text-slate-500">Test Runs Cached</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Estimated Size</span>
                <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <p className="text-lg font-bold text-slate-100">{formatBytes(stats.estimatedSizeBytes)}</p>
              <p className="text-[10px] text-slate-500">IndexedDB Payload</p>
            </div>
          </div>

          {/* Explanation Card */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Layers className="w-4 h-4" />
              <span>How IndexedDB Persistence Works:</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Every edit you make in the Code Workbench—including custom code implementations, 
              engineering notes, module completion checkboxes, and test execution histories—is automatically 
              cached inside your browser’s isolated IndexedDB store (<code className="text-emerald-300 bg-slate-900 px-1 py-0.5 rounded border border-slate-800">KayBiT_CodeWorkbench_v1</code>). 
              Your authored code remains intact across page refreshes and browser sessions without requiring an external database server.
            </p>
          </div>

          {/* Backup & Restore Controls */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Backup, Restore & Migration
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Export Button */}
              <button
                id="btn-export-indexeddb-backup"
                onClick={handleExportBackup}
                disabled={isLoading}
                className="p-3 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/50 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors block">
                      Export JSON Backup
                    </span>
                    <span className="text-[11px] text-slate-500">Download all custom code & progress</span>
                  </div>
                </div>
              </button>

              {/* Import Button */}
              <label
                id="btn-import-indexeddb-backup"
                className="p-3 bg-slate-950 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/50 rounded-xl text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-200 group-hover:text-sky-400 transition-colors block">
                      Import JSON Backup
                    </span>
                    <span className="text-[11px] text-slate-500">Restore snippets from a file</span>
                  </div>
                </div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Reset / Clear Section */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Cache Maintenance
            </h4>

            {!showConfirmReset ? (
              <button
                id="btn-trigger-reset-indexeddb"
                onClick={() => setShowConfirmReset(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-950 border border-rose-900/40 text-rose-400 hover:bg-rose-950/30 hover:border-rose-700/60 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear IndexedDB Cache & Reset to Defaults</span>
              </button>
            ) : (
              <div className="bg-rose-950/40 border border-rose-800/60 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Are you sure you want to reset all cached snippets and progress?</span>
                </div>
                <p className="text-[11px] text-rose-300/80">
                  This action will erase all customized code in IndexedDB and restore the official 20 language reference implementations.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFullReset}
                    disabled={isLoading}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Store: KayBiT_CodeWorkbench_v1</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
