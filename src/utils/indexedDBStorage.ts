/**
 * IndexedDB Storage Engine for KayBiT_WhatsApp Code Workbench
 * Provides robust client-side persistence for user-authored code snippets,
 * module progress tracking, test execution logs, and engineering notes.
 */

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'mastered';

export interface UserSnippetRecord {
  languageId: string;
  languageName: string;
  codeFile: string;
  customCode: string;
  originalCode: string;
  isCustomized: boolean;
  notes: string;
  lastModified: number;
  version: number;
  savedParams?: Record<string, any>;
}

export interface LanguageProgressRecord {
  languageId: string;
  languageName: string;
  trackId: string;
  status: ProgressStatus;
  completedAt?: number | null;
  lastAttemptAt?: number;
  testRunsCount: number;
  checklist: {
    reviewedArchitecture: boolean;
    customizedCode: boolean;
    executedHarness: boolean;
    verifiedOutput: boolean;
    reviewedAiExplanation: boolean;
  };
  notes: string;
  rating?: number;
}

export interface ExecutionLogRecord {
  id?: number;
  languageId: string;
  languageName: string;
  timestamp: number;
  status: 'success' | 'warning' | 'error';
  executionTimeMs: number;
  memoryUsedMb: number;
  logs: string[];
  outputData: Record<string, any>;
  inputParams: Record<string, any>;
  isCustomCode: boolean;
}

export interface WorkbenchBackupData {
  version: number;
  exportDate: string;
  appName: string;
  snippets: Record<string, UserSnippetRecord>;
  progress: Record<string, LanguageProgressRecord>;
  executionLogs: ExecutionLogRecord[];
}

const DB_NAME = 'KayBiT_CodeWorkbench_v1';
const DB_VERSION = 1;

const STORES = {
  SNIPPETS: 'user_snippets',
  PROGRESS: 'language_progress',
  LOGS: 'execution_logs',
  SETTINGS: 'general_settings',
} as const;

// In-Memory Fallback Cache if IndexedDB is unavailable
const memoryFallback = {
  snippets: new Map<string, UserSnippetRecord>(),
  progress: new Map<string, LanguageProgressRecord>(),
  logs: [] as ExecutionLogRecord[],
  settings: new Map<string, any>(),
};

let dbInstance: IDBDatabase | null = null;
let isIndexedDBAvailable: boolean | null = null;

/**
 * Check if IndexedDB is available and supported in current environment
 */
export function checkIndexedDBSupport(): boolean {
  if (isIndexedDBAvailable !== null) return isIndexedDBAvailable;
  try {
    if (typeof window === 'undefined' || !window.indexedDB) {
      isIndexedDBAvailable = false;
      return false;
    }
    isIndexedDBAvailable = true;
    return true;
  } catch (err) {
    console.warn('IndexedDB check failed, falling back to local cache', err);
    isIndexedDBAvailable = false;
    return false;
  }
}

/**
 * Open or retrieve the existing IndexedDB connection
 */
export function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      return resolve(dbInstance);
    }

    if (!checkIndexedDBSupport()) {
      return reject(new Error('IndexedDB is not supported or accessible in this environment.'));
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Store 1: User snippets (keyed by languageId)
        if (!db.objectStoreNames.contains(STORES.SNIPPETS)) {
          const snippetStore = db.createObjectStore(STORES.SNIPPETS, { keyPath: 'languageId' });
          snippetStore.createIndex('lastModified', 'lastModified', { unique: false });
          snippetStore.createIndex('isCustomized', 'isCustomized', { unique: false });
        }

        // Store 2: Language learning progress (keyed by languageId)
        if (!db.objectStoreNames.contains(STORES.PROGRESS)) {
          const progressStore = db.createObjectStore(STORES.PROGRESS, { keyPath: 'languageId' });
          progressStore.createIndex('status', 'status', { unique: false });
          progressStore.createIndex('trackId', 'trackId', { unique: false });
        }

        // Store 3: Test execution logs (auto-increment id)
        if (!db.objectStoreNames.contains(STORES.LOGS)) {
          const logStore = db.createObjectStore(STORES.LOGS, { keyPath: 'id', autoIncrement: true });
          logStore.createIndex('languageId', 'languageId', { unique: false });
          logStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Store 4: Workbench Settings
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        dbInstance = (event.target as IDBOpenDBRequest).result;
        dbInstance.onversionchange = () => {
          dbInstance?.close();
          dbInstance = null;
        };
        resolve(dbInstance);
      };

      request.onerror = (event) => {
        console.error('IndexedDB open error:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };

      request.onblocked = () => {
        console.warn('IndexedDB open blocked by other tab.');
      };
    } catch (err) {
      reject(err);
    }
  });
}

/* ==========================================================================
   User Snippet Store Operations
   ========================================================================== */

/**
 * Retrieve user custom snippet record for a language
 */
export async function getSnippetRecord(languageId: string): Promise<UserSnippetRecord | null> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORES.SNIPPETS, 'readonly');
      const store = tx.objectStore(STORES.SNIPPETS);
      const req = store.get(languageId);

      req.onsuccess = () => {
        resolve(req.result || null);
      };
      req.onerror = () => {
        resolve(memoryFallback.snippets.get(languageId) || null);
      };
    });
  } catch (err) {
    return memoryFallback.snippets.get(languageId) || null;
  }
}

/**
 * Retrieve all saved user snippets from IndexedDB
 */
export async function getAllSnippetRecords(): Promise<Record<string, UserSnippetRecord>> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORES.SNIPPETS, 'readonly');
      const store = tx.objectStore(STORES.SNIPPETS);
      const req = store.getAll();

      req.onsuccess = () => {
        const results: Record<string, UserSnippetRecord> = {};
        const records: UserSnippetRecord[] = req.result || [];
        records.forEach((rec) => {
          results[rec.languageId] = rec;
        });
        resolve(results);
      };
      req.onerror = () => {
        const fallbackResults: Record<string, UserSnippetRecord> = {};
        memoryFallback.snippets.forEach((v, k) => {
          fallbackResults[k] = v;
        });
        resolve(fallbackResults);
      };
    });
  } catch (err) {
    const fallbackResults: Record<string, UserSnippetRecord> = {};
    memoryFallback.snippets.forEach((v, k) => {
      fallbackResults[k] = v;
    });
    return fallbackResults;
  }
}

/**
 * Save or update a user custom snippet into IndexedDB
 */
export async function saveSnippetRecord(record: UserSnippetRecord): Promise<void> {
  // Update memory fallback
  memoryFallback.snippets.set(record.languageId, record);

  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SNIPPETS, 'readwrite');
      const store = tx.objectStore(STORES.SNIPPETS);
      const req = store.put(record);

      req.onsuccess = () => resolve();
      req.onerror = (e) => reject((e.target as IDBRequest).error);
    });
  } catch (err) {
    console.warn('Failed saving snippet to IndexedDB, stored in memory cache', err);
  }
}

/**
 * Reset a snippet back to default original code in IndexedDB
 */
export async function deleteSnippetRecord(languageId: string): Promise<void> {
  memoryFallback.snippets.delete(languageId);
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SNIPPETS, 'readwrite');
      const store = tx.objectStore(STORES.SNIPPETS);
      const req = store.delete(languageId);

      req.onsuccess = () => resolve();
      req.onerror = (e) => reject((e.target as IDBRequest).error);
    });
  } catch (err) {
    console.warn('Failed deleting snippet from IndexedDB', err);
  }
}

/* ==========================================================================
   Language Progress Store Operations
   ========================================================================== */

/**
 * Retrieve progress record for a language
 */
export async function getProgressRecord(languageId: string): Promise<LanguageProgressRecord | null> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORES.PROGRESS, 'readonly');
      const store = tx.objectStore(STORES.PROGRESS);
      const req = store.get(languageId);

      req.onsuccess = () => {
        resolve(req.result || null);
      };
      req.onerror = () => {
        resolve(memoryFallback.progress.get(languageId) || null);
      };
    });
  } catch (err) {
    return memoryFallback.progress.get(languageId) || null;
  }
}

/**
 * Retrieve all progress records across all languages
 */
export async function getAllProgressRecords(): Promise<Record<string, LanguageProgressRecord>> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORES.PROGRESS, 'readonly');
      const store = tx.objectStore(STORES.PROGRESS);
      const req = store.getAll();

      req.onsuccess = () => {
        const results: Record<string, LanguageProgressRecord> = {};
        const records: LanguageProgressRecord[] = req.result || [];
        records.forEach((rec) => {
          results[rec.languageId] = rec;
        });
        resolve(results);
      };
      req.onerror = () => {
        const fallbackResults: Record<string, LanguageProgressRecord> = {};
        memoryFallback.progress.forEach((v, k) => {
          fallbackResults[k] = v;
        });
        resolve(fallbackResults);
      };
    });
  } catch (err) {
    const fallbackResults: Record<string, LanguageProgressRecord> = {};
    memoryFallback.progress.forEach((v, k) => {
      fallbackResults[k] = v;
    });
    return fallbackResults;
  }
}

/**
 * Save or update progress for a language
 */
export async function saveProgressRecord(record: LanguageProgressRecord): Promise<void> {
  memoryFallback.progress.set(record.languageId, record);

  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.PROGRESS, 'readwrite');
      const store = tx.objectStore(STORES.PROGRESS);
      const req = store.put(record);

      req.onsuccess = () => resolve();
      req.onerror = (e) => reject((e.target as IDBRequest).error);
    });
  } catch (err) {
    console.warn('Failed saving progress to IndexedDB, stored in memory cache', err);
  }
}

/* ==========================================================================
   Execution Logs Operations
   ========================================================================== */

/**
 * Append an execution log entry to IndexedDB
 */
export async function saveExecutionLogRecord(log: ExecutionLogRecord): Promise<void> {
  memoryFallback.logs.unshift(log);
  if (memoryFallback.logs.length > 50) {
    memoryFallback.logs.pop();
  }

  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.LOGS, 'readwrite');
      const store = tx.objectStore(STORES.LOGS);
      const req = store.add(log);

      req.onsuccess = () => resolve();
      req.onerror = (e) => reject((e.target as IDBRequest).error);
    });
  } catch (err) {
    console.warn('Failed saving execution log to IndexedDB', err);
  }
}

/**
 * Get recent execution logs (optionally filtered by language)
 */
export async function getRecentExecutionLogs(languageId?: string, limit: number = 20): Promise<ExecutionLogRecord[]> {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORES.LOGS, 'readonly');
      const store = tx.objectStore(STORES.LOGS);
      const req = store.getAll();

      req.onsuccess = () => {
        let logs: ExecutionLogRecord[] = req.result || [];
        if (languageId) {
          logs = logs.filter((l) => l.languageId === languageId);
        }
        logs.sort((a, b) => b.timestamp - a.timestamp);
        resolve(logs.slice(0, limit));
      };
      req.onerror = () => {
        let logs = [...memoryFallback.logs];
        if (languageId) {
          logs = logs.filter((l) => l.languageId === languageId);
        }
        logs.sort((a, b) => b.timestamp - a.timestamp);
        resolve(logs.slice(0, limit));
      };
    });
  } catch (err) {
    let logs = [...memoryFallback.logs];
    if (languageId) {
      logs = logs.filter((l) => l.languageId === languageId);
    }
    logs.sort((a, b) => b.timestamp - a.timestamp);
    return logs.slice(0, limit);
  }
}

/**
 * Clear execution logs for a specific language or all logs
 */
export async function clearExecutionLogs(languageId?: string): Promise<void> {
  if (!languageId) {
    memoryFallback.logs = [];
  } else {
    memoryFallback.logs = memoryFallback.logs.filter((l) => l.languageId !== languageId);
  }

  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.LOGS, 'readwrite');
      const store = tx.objectStore(STORES.LOGS);

      if (!languageId) {
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = (e) => reject((e.target as IDBRequest).error);
      } else {
        const req = store.openCursor();
        req.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
          if (cursor) {
            if (cursor.value.languageId === languageId) {
              cursor.delete();
            }
            cursor.continue();
          } else {
            resolve();
          }
        };
        req.onerror = (e) => reject((e.target as IDBRequest).error);
      }
    });
  } catch (err) {
    console.warn('Failed clearing execution logs in IndexedDB', err);
  }
}

/* ==========================================================================
   Full Backup, Restore & Reset Operations
   ========================================================================== */

/**
 * Export all workbench data from IndexedDB into a single JSON object
 */
export async function exportAllWorkbenchData(): Promise<WorkbenchBackupData> {
  const snippets = await getAllSnippetRecords();
  const progress = await getAllProgressRecords();
  const logs = await getRecentExecutionLogs(undefined, 100);

  return {
    version: 1,
    appName: 'KayBiT_WhatsApp Multi-Language Engineering Workbench',
    exportDate: new Date().toISOString(),
    snippets,
    progress,
    executionLogs: logs,
  };
}

/**
 * Import a previously exported backup into IndexedDB
 */
export async function importWorkbenchData(backup: WorkbenchBackupData): Promise<boolean> {
  if (!backup || !backup.snippets || !backup.progress) {
    throw new Error('Invalid backup format');
  }

  try {
    const db = await getDB();

    // 1. Restore snippets
    const snippetTx = db.transaction(STORES.SNIPPETS, 'readwrite');
    const snippetStore = snippetTx.objectStore(STORES.SNIPPETS);
    for (const key of Object.keys(backup.snippets)) {
      const rec = backup.snippets[key];
      snippetStore.put(rec);
      memoryFallback.snippets.set(rec.languageId, rec);
    }

    // 2. Restore progress
    const progressTx = db.transaction(STORES.PROGRESS, 'readwrite');
    const progressStore = progressTx.objectStore(STORES.PROGRESS);
    for (const key of Object.keys(backup.progress)) {
      const rec = backup.progress[key];
      progressStore.put(rec);
      memoryFallback.progress.set(rec.languageId, rec);
    }

    // 3. Restore execution logs if present
    if (Array.isArray(backup.executionLogs)) {
      const logTx = db.transaction(STORES.LOGS, 'readwrite');
      const logStore = logTx.objectStore(STORES.LOGS);
      for (const log of backup.executionLogs) {
        logStore.add(log);
        memoryFallback.logs.unshift(log);
      }
    }

    return true;
  } catch (err) {
    console.error('Failed importing workbench data into IndexedDB', err);
    throw err;
  }
}

/**
 * Clear all workbench stores in IndexedDB (Full Factory Reset)
 */
export async function resetAllWorkbenchData(): Promise<void> {
  memoryFallback.snippets.clear();
  memoryFallback.progress.clear();
  memoryFallback.logs = [];

  try {
    const db = await getDB();
    const stores = [STORES.SNIPPETS, STORES.PROGRESS, STORES.LOGS];
    for (const storeName of stores) {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = (e) => reject((e.target as IDBRequest).error);
      });
    }
  } catch (err) {
    console.warn('Failed clearing IndexedDB stores', err);
  }
}
