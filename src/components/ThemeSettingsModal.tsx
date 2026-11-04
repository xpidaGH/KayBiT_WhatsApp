import React, { useEffect } from 'react';
import { 
  X, 
  Palette, 
  Check, 
  Sparkles, 
  SlidersHorizontal, 
  Type, 
  SunMedium, 
  MoonStar, 
  Grid3X3,
  BookOpenText,
  HeartHandshake,
  Flame
} from 'lucide-react';
import { THEME_PRESETS, ThemePreset, ThemePresetId, applyThemePreset } from '../utils/themeManager';

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeThemeId: ThemePresetId;
  onSelectTheme: (theme: ThemePreset) => void;
}

export const ThemeSettingsModal: React.FC<ThemeSettingsModalProps> = ({
  isOpen,
  onClose,
  activeThemeId,
  onSelectTheme,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (theme: ThemePreset) => {
    // Dynamically update app's CSS variables instantly
    applyThemePreset(theme);
    onSelectTheme(theme);
    // Close modal instantly as required
    onClose();
  };

  const getThemeIcon = (id: ThemePresetId) => {
    switch (id) {
      case 'editorial':
        return <BookOpenText className="w-5 h-5 text-amber-700" />;
      case 'technical':
        return <Grid3X3 className="w-5 h-5 text-emerald-400" />;
      case 'warm':
        return <HeartHandshake className="w-5 h-5 text-orange-500" />;
      case 'elegant-dark':
        return <MoonStar className="w-5 h-5 text-sky-400" />;
      case 'vibrant':
        return <Flame className="w-5 h-5 text-pink-500" />;
      default:
        return <Palette className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-settings-title"
    >
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-emerald-950/50 p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20 text-white shrink-0">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 id="theme-settings-title" className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Theme Settings & Studio Variations
              </h2>
              <p className="text-xs text-slate-400">
                Choose from 5 distinct UI design systems. Updates typography, CSS variables, and colors instantly.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close theme settings modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Grid */}
        <div className="mt-6 space-y-3.5">
          {THEME_PRESETS.map((preset) => {
            const isSelected = activeThemeId === preset.id;
            return (
              <div
                key={preset.id}
                role="button"
                tabIndex={0}
                onClick={() => handleSelect(preset)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(preset);
                  }
                }}
                className={`p-4 rounded-xl border transition-all text-left cursor-pointer relative group flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-emerald-500 bg-slate-800/90 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500'
                    : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/50 hover:border-slate-700'
                }`}
              >
                {/* Left details */}
                <div className="flex items-start gap-3.5 flex-1">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${
                    preset.isDark 
                      ? 'bg-slate-900 border-slate-700/80' 
                      : 'bg-amber-50/90 border-amber-200'
                  }`}>
                    {getThemeIcon(preset.id)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-100 group-hover:text-emerald-400 transition-colors">
                        {preset.name}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {preset.previewBadge}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Type className="w-3 h-3 text-slate-500" />
                        {preset.fontName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                      {preset.description}
                    </p>
                  </div>
                </div>

                {/* Right: Color swatches & Selection indicator */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  {/* Swatches preview */}
                  <div className="flex items-center gap-1.5 p-1.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span 
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm" 
                      style={{ backgroundColor: preset.colors.bg }}
                      title={`Background: ${preset.colors.bg}`}
                    />
                    <span 
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm" 
                      style={{ backgroundColor: preset.colors.surface }}
                      title={`Surface: ${preset.colors.surface}`}
                    />
                    <span 
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm" 
                      style={{ backgroundColor: preset.colors.accent }}
                      title={`Accent: ${preset.colors.accent}`}
                    />
                    <span 
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm" 
                      style={{ backgroundColor: preset.colors.border }}
                      title={`Border: ${preset.colors.border}`}
                    />
                  </div>

                  {/* Active button indicator */}
                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-white'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </>
                    ) : (
                      <span>Apply</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info & clean close button */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Theme choice persists automatically via localStorage.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
