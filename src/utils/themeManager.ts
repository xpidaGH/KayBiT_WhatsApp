export type ThemePresetId = 
  | 'editorial'
  | 'technical'
  | 'warm'
  | 'elegant-dark'
  | 'vibrant';

export interface ThemePreset {
  id: ThemePresetId;
  name: string;
  tagline: string;
  description: string;
  fontFamily: string;
  fontName: string;
  isDark: boolean;
  colors: {
    bg: string;
    surface: string;
    surfaceElevated: string;
    border: string;
    text: string;
    textMuted: string;
    accent: string;
    accentSecondary: string;
  };
  cardRadius: string;
  buttonRadius: string;
  density: 'compact' | 'comfortable' | 'spacious';
  previewBadge: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'editorial',
    name: 'Editorial & Refined',
    tagline: 'Serif typography & generous whitespace',
    description: 'Literary clarity with classic serif heading typography, clean light parchment background, and serene spacious layout.',
    fontFamily: '"Newsreader", "Georgia", "Cambria", "Times New Roman", serif',
    fontName: 'Serif (Newsreader / Georgia)',
    isDark: false,
    colors: {
      bg: '#faf8f5',
      surface: '#ffffff',
      surfaceElevated: '#f4ede4',
      border: '#e7ded2',
      text: '#1c1917',
      textMuted: '#78716c',
      accent: '#9a3412',
      accentSecondary: '#b45309',
    },
    cardRadius: '4px',
    buttonRadius: '4px',
    density: 'spacious',
    previewBadge: 'Editorial Light',
  },
  {
    id: 'technical',
    name: 'Technical & Systematic',
    tagline: 'Monospace grid & high-density data',
    description: 'Engineered for systems architects with crisp monospace typefaces, high-density telemetry, visible grid lines, and matrix green highlights.',
    fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace',
    fontName: 'Monospace (JetBrains Mono / Consolas)',
    isDark: true,
    colors: {
      bg: '#080c10',
      surface: '#0d1117',
      surfaceElevated: '#161b22',
      border: '#30363d',
      text: '#e6edf3',
      textMuted: '#8b949e',
      accent: '#2ea043',
      accentSecondary: '#58a6ff',
    },
    cardRadius: '2px',
    buttonRadius: '2px',
    density: 'compact',
    previewBadge: 'High-Density Grid',
  },
  {
    id: 'warm',
    name: 'Warm & Approachable',
    tagline: 'Pastel cards & soft rounded corners',
    description: 'Friendly, warm aesthetic with gentle pastel peach accents, rounded pill buttons, soft card elevations, and human-centered design.',
    fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif',
    fontName: 'Soft Sans (Plus Jakarta / System)',
    isDark: false,
    colors: {
      bg: '#fdf8f4',
      surface: '#ffffff',
      surfaceElevated: '#fef0e4',
      border: '#fed7aa',
      text: '#431407',
      textMuted: '#9a3412',
      accent: '#ea580c',
      accentSecondary: '#f97316',
    },
    cardRadius: '16px',
    buttonRadius: '9999px',
    density: 'comfortable',
    previewBadge: 'Warm Pastel',
  },
  {
    id: 'elegant-dark',
    name: 'Elegant Dark',
    tagline: 'Sleek dark mode with tailored high contrast',
    description: 'Signature obsidian dark mode with tailored high-contrast accents, deep slate panels, and glowing emerald & sky telemetry indicators.',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    fontName: 'Inter / Modern Sans',
    isDark: true,
    colors: {
      bg: '#020617',
      surface: '#0f172a',
      surfaceElevated: '#1e293b',
      border: '#334155',
      text: '#f8fafc',
      textMuted: '#94a3b8',
      accent: '#10b981',
      accentSecondary: '#38bdf8',
    },
    cardRadius: '8px',
    buttonRadius: '8px',
    density: 'comfortable',
    previewBadge: 'Midnight Studio',
  },
  {
    id: 'vibrant',
    name: 'Vibrant Palette',
    tagline: 'High-energy, bold color schemes',
    description: 'Dynamic neon punch with vivid magenta and electric cyan highlights, bold contrasts, and futuristic cyber aesthetics.',
    fontFamily: '"Outfit", system-ui, sans-serif',
    fontName: 'Outfit / Bold Sans',
    isDark: true,
    colors: {
      bg: '#090714',
      surface: '#120d26',
      surfaceElevated: '#1e143f',
      border: '#7c3aed',
      text: '#ffffff',
      textMuted: '#c4b5fd',
      accent: '#ec4899',
      accentSecondary: '#06b6d4',
    },
    cardRadius: '12px',
    buttonRadius: '10px',
    density: 'comfortable',
    previewBadge: 'Electric Cyber',
  },
];

const STORAGE_THEME_KEY = 'kaybit_active_theme_preset';

export function getActiveThemePreset(): ThemePreset {
  try {
    const savedId = localStorage.getItem(STORAGE_THEME_KEY) as ThemePresetId | null;
    if (savedId) {
      const match = THEME_PRESETS.find((t) => t.id === savedId);
      if (match) return match;
    }
  } catch (e) {
    console.error('Failed to get saved theme preset:', e);
  }
  // Default to Elegant Dark
  return THEME_PRESETS.find((t) => t.id === 'elegant-dark') || THEME_PRESETS[3];
}

export function applyThemePreset(theme: ThemePreset): void {
  const root = document.documentElement;
  
  // Set data-theme attribute
  root.setAttribute('data-theme', theme.id);

  // Synchronize base dark/light class
  if (theme.isDark) {
    root.classList.add('dark');
    root.classList.remove('light');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }

  // Inject CSS Variables dynamically
  root.style.setProperty('--studio-bg', theme.colors.bg);
  root.style.setProperty('--studio-surface', theme.colors.surface);
  root.style.setProperty('--studio-surface-elevated', theme.colors.surfaceElevated);
  root.style.setProperty('--studio-border', theme.colors.border);
  root.style.setProperty('--studio-text', theme.colors.text);
  root.style.setProperty('--studio-text-muted', theme.colors.textMuted);
  root.style.setProperty('--studio-accent', theme.colors.accent);
  root.style.setProperty('--studio-accent-secondary', theme.colors.accentSecondary);
  root.style.setProperty('--studio-font', theme.fontFamily);
  root.style.setProperty('--studio-radius', theme.cardRadius);
  root.style.setProperty('--studio-btn-radius', theme.buttonRadius);

  // Persist to localStorage
  try {
    localStorage.setItem(STORAGE_THEME_KEY, theme.id);
  } catch (e) {
    console.error('Failed to save theme preset to localStorage:', e);
  }
}
