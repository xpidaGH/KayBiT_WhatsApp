import React from 'react';
import { 
  X, 
  Monitor, 
  Smartphone, 
  Globe, 
  Download, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { KbtBrandLogo } from './KbtBrandLogo';

interface BrandAssetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandAssetsModal: React.FC<BrandAssetsModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = React.useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText('npm run tauri icon ./public/assets/kbt-logo-transparent.png');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-emerald-950/50 p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <KbtBrandLogo size="md" variant="web-header" />
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                KBT Multiplatform Brand Icon Integration
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  v2.4 Production
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Green/Yellow Cyber Spider Emblem configured for Desktop, Mobile & Web Title Bars
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close brand assets modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Use-Case Previews */}
        <div className="mt-6 space-y-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target Platform Viewport Sizing & Title Bar Layouts</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Desktop Title Bar (Windows / macOS) */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Monitor className="w-4 h-4 text-sky-400" />
                    Desktop Title Bar
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">24px • 32px</span>
                </div>

                {/* macOS / Windows Window Preview Simulation */}
                <div className="bg-slate-900 rounded-lg border border-slate-800 p-2 shadow-inner">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-300">
                      <KbtBrandLogo variant="desktop-titlebar" size="xs" />
                      <span className="truncate max-w-[100px]">KayBiT Studio</span>
                    </div>
                    <div className="w-8" />
                  </div>
                  <div className="py-3 px-2 text-[10px] text-slate-500 text-center font-mono">
                    macOS .dmg / Windows .msi binary
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400">
                <span className="text-emerald-400 font-medium">Tauri v2 Config:</span> `.ico` for Win32 SmartScreen & `.icns` for macOS Cocoa AppKit.
              </div>
            </div>

            {/* 2. Mobile App Bar (iOS / Android) */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    Mobile App Bar
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">36px • Squircle</span>
                </div>

                {/* Mobile App Bar Simulation */}
                <div className="bg-slate-900 rounded-lg border border-slate-800 p-2 shadow-inner">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 pb-1">
                    <span>9:41</span>
                    <div className="w-3 h-1.5 rounded-sm border border-slate-500" />
                  </div>
                  <div className="flex items-center gap-2.5 py-1.5 px-2 bg-slate-950/60 rounded-md border border-slate-800">
                    <KbtBrandLogo variant="mobile-appbar" size="md" />
                    <div className="leading-tight">
                      <div className="text-xs font-bold text-slate-200">KayBiT Mobile</div>
                      <div className="text-[9px] text-emerald-400">Online • End-to-End Encrypted</div>
                    </div>
                  </div>
                  <div className="py-2 px-2 text-[10px] text-slate-500 text-center font-mono">
                    iOS .ipa / Android .aab
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400">
                <span className="text-emerald-400 font-medium">Adaptive Vectors:</span> Smooth superellipse squircle with foreground/background layers.
              </div>
            </div>

            {/* 3. Web Header Bar (Web Browsers / Web Apps) */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-3">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-amber-400" />
                    Web Header Bar
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">40px • Ambient Glow</span>
                </div>

                {/* Web Header Simulation */}
                <div className="bg-slate-900 rounded-lg border border-slate-800 p-2 shadow-inner">
                  <div className="flex items-center gap-2 bg-slate-950/80 rounded-md p-1.5 border border-slate-800">
                    <div className="flex items-center gap-1 text-slate-500 text-[10px] px-1 font-mono">
                      https://app.kaybit.io
                    </div>
                  </div>
                  <div className="flex items-center gap-2 py-2 px-2 mt-1.5">
                    <KbtBrandLogo variant="web-header" size="lg" />
                    <div>
                      <div className="text-xs font-bold text-slate-100">KayBiT_WhatsApp</div>
                      <div className="text-[9px] text-slate-400">Web App Browser View</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-400">
                <span className="text-emerald-400 font-medium">Vite PWA Manifest:</span> 192x192 & 512x512 transparent PNG with SVG squircle mask.
              </div>
            </div>
          </div>

          {/* Full High-Resolution Asset & Tauri Icon Generator Command */}
          <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="shrink-0 flex flex-col items-center gap-2">
                <KbtBrandLogo size="xl" showGlow={true} />
                <span className="text-[10px] text-slate-400 font-mono">512 x 512 Master Asset</span>
              </div>

              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="text-sm font-bold text-slate-200">
                    Production Export Workflow (from KBT Integration Guide)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    The standalone high-resolution asset is mapped to <code className="text-emerald-400 bg-slate-900 px-1 py-0.5 rounded">/public/assets/kbt-logo-transparent.png</code>. Run the automatic icon generator to compile all required sizes for Windows <code className="text-sky-300">.msi</code> and macOS <code className="text-sky-300">.dmg</code>:
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400">
                  <div className="flex items-center gap-2 overflow-x-auto">
                    <Terminal className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>npm run tauri icon ./public/assets/kbt-logo-transparent.png</span>
                  </div>
                  <button
                    onClick={handleCopyCmd}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
                    title="Copy command"
                  >
                    {copiedCmd ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href="/assets/kbt-logo.png"
                    download="kbt-app-logo-master.png"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PNG (512px)
                  </a>
                  <span className="text-xs text-slate-500">
                    Includes automatic squircle superellipse curvature via CSS mask.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
