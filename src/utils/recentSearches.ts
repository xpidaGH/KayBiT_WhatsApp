import { ProgrammingLanguageInfo, TrackId } from '../types';

export type RecentSearchType = 'tab' | 'language' | 'track' | 'milestone';

export interface RecentSearchItem {
  id: string;
  type: RecentSearchType;
  title: string;
  subtitle: string;
  badge?: string;
  timestamp: number;
  data: {
    tabId?: string;
    language?: ProgrammingLanguageInfo;
    trackId?: TrackId;
    sprintIdx?: number;
  };
}

const STORAGE_KEY = 'kaybit_recent_searches';
const MAX_RECENT_ITEMS = 5;

// Default starter items for initial view
const DEFAULT_RECENT_SEARCHES: RecentSearchItem[] = [
  {
    id: 'tab-whatsapp',
    type: 'tab',
    title: 'KayBiT_WhatsApp Client',
    subtitle: 'Live E2E WhatsApp UI',
    badge: 'Live Tab',
    timestamp: Date.now() - 1000 * 60 * 5,
    data: { tabId: 'whatsapp' },
  },
  {
    id: 'lang-rust',
    type: 'language',
    title: 'Rust',
    subtitle: 'Track 2: Memory-Safe Network Gateway',
    badge: 'Networking',
    timestamp: Date.now() - 1000 * 60 * 15,
    data: { trackId: 'networking' },
  },
  {
    id: 'tab-simulator',
    type: 'tab',
    title: 'Packet Flow Simulator',
    subtitle: 'Real-time Cross-Track Pipeline',
    badge: 'Simulator',
    timestamp: Date.now() - 1000 * 60 * 30,
    data: { tabId: 'simulator' },
  },
  {
    id: 'track-frontend',
    type: 'track',
    title: 'Client & Cross-Platform Track',
    subtitle: 'Kotlin, Swift, Flutter, React',
    badge: 'Track 1',
    timestamp: Date.now() - 1000 * 60 * 60,
    data: { trackId: 'frontend' },
  },
  {
    id: 'milestone-sprint-1',
    type: 'milestone',
    title: 'Sprint 1: Core Networking',
    subtitle: 'Week 1 • Foundations & Handshakes',
    badge: 'Sprint 1',
    timestamp: Date.now() - 1000 * 60 * 120,
    data: { sprintIdx: 0 },
  },
];

export function getRecentSearches(): RecentSearchItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed initial defaults so user has instant interaction
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_RECENT_SEARCHES));
      return DEFAULT_RECENT_SEARCHES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.slice(0, MAX_RECENT_ITEMS);
    }
    return DEFAULT_RECENT_SEARCHES;
  } catch (e) {
    console.error('Failed to parse recent searches from localStorage:', e);
    return DEFAULT_RECENT_SEARCHES;
  }
}

export function saveRecentSearch(item: Omit<RecentSearchItem, 'timestamp'>): RecentSearchItem[] {
  try {
    const existing = getRecentSearches();
    // Remove if already exists with same ID to bump to top
    const filtered = existing.filter((i) => i.id !== item.id);
    const updated: RecentSearchItem[] = [
      {
        ...item,
        timestamp: Date.now(),
      },
      ...filtered,
    ].slice(0, MAX_RECENT_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save recent search to localStorage:', e);
    return [];
  }
}

export function removeRecentSearch(id: string): RecentSearchItem[] {
  try {
    const existing = getRecentSearches();
    const updated = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to remove recent search:', e);
    return [];
  }
}

export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear recent searches:', e);
  }
}
