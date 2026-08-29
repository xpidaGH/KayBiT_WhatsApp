import React from 'react';
import { 
  Smartphone, 
  Network, 
  Server, 
  Database, 
  Terminal, 
  CheckCircle2, 
  ArrowRight, 
  Code2, 
  Zap,
  Shield,
  Clock,
  Layers
} from 'lucide-react';
import { EngineeringTrack, TrackId, ProgrammingLanguageInfo } from '../types';

interface TrackNavigatorProps {
  tracks: EngineeringTrack[];
  selectedTrackId: TrackId;
  onSelectTrack: (trackId: TrackId) => void;
  onSelectLanguage: (language: ProgrammingLanguageInfo) => void;
  onOpenSimulatorForTrack?: (trackId: TrackId) => void;
}

export const TrackNavigator: React.FC<TrackNavigatorProps> = ({
  tracks,
  selectedTrackId,
  onSelectTrack,
  onSelectLanguage,
  onOpenSimulatorForTrack,
}) => {
  const currentTrack = tracks.find((t) => t.id === selectedTrackId) || tracks[0];

  const getTrackIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className={className} />;
      case 'Network':
        return <Network className={className} />;
      case 'Server':
        return <Server className={className} />;
      case 'Database':
        return <Database className={className} />;
      case 'Terminal':
        return <Terminal className={className} />;
      default:
        return <Layers className={className} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 5 Tracks Ribbon Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {tracks.map((track, idx) => {
          const isSelected = track.id === selectedTrackId;
          return (
            <button
              key={track.id}
              id={`track-card-${track.id}`}
              onClick={() => onSelectTrack(track.id)}
              className={`p-4 rounded-xl text-left border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? `bg-slate-800/90 border-emerald-500/60 shadow-lg shadow-emerald-500/5 ring-1 ring-emerald-500/30`
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {getTrackIcon(track.iconName, 'w-4 h-4')}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 font-medium">
                    TRACK 0{idx + 1}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-100 line-clamp-1 mb-1">
                  {track.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {track.objective}
                </p>
              </div>

              {/* Language Pills in Track Card */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-1">
                {track.languages.map((lang) => (
                  <span
                    key={lang.id}
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                      isSelected
                        ? 'bg-slate-950/80 text-emerald-300 border-emerald-500/20'
                        : 'bg-slate-950/50 text-slate-400 border-slate-800'
                    }`}
                  >
                    {lang.name}
                  </span>
                ))}
              </div>

              {isSelected && (
                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-emerald-500/20 to-transparent pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Track Detailed Blueprint Panel */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                {getTrackIcon(currentTrack.iconName, 'w-5 h-5')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-100">{currentTrack.title}</h2>
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {currentTrack.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{currentTrack.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950/60 border border-slate-800 px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs">
              <Zap className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">Performance Target</span>
                <span className="font-semibold text-slate-200">{currentTrack.performanceTarget}</span>
              </div>
            </div>

            {onOpenSimulatorForTrack && (
              <button
                onClick={() => onOpenSimulatorForTrack(currentTrack.id)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
              >
                <span>Simulate Track Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 2-Column: Responsibilities vs. Challenges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-950/40 rounded-xl p-4 border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Core Architectural Responsibilities</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {currentTrack.architectureResponsibilities.map((resp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-950/40 rounded-xl p-4 border border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-400" />
              <span>Engineering Constraints & Scaling Challenges</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {currentTrack.keyChallenges.map((chal, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                  <span>{chal}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Microservices & Languages Showcase within this Track */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
              Assigned Microservices & Language Implementations ({currentTrack.languages.length})
            </h3>
            <span className="text-xs text-slate-400">
              Click any language to inspect runnable code & unit tests
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {currentTrack.languages.map((lang) => (
              <div
                key={lang.id}
                id={`lang-card-${lang.id}`}
                className="bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-4 transition-all hover:bg-slate-900/90 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                          {lang.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {lang.category}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-emerald-400/90 mt-0.5">
                        {lang.roleTitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang.description}
                  </p>

                  {/* Why Chosen Callout */}
                  <div className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-800/80 text-[11px] text-slate-400">
                    <strong className="text-slate-300 font-semibold">Why this language? </strong>
                    {lang.whyChosen}
                  </div>

                  {/* Key Concepts Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {lang.keyConcepts.map((concept, cIdx) => (
                      <span
                        key={cIdx}
                        className="text-[10px] bg-slate-800/70 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700/50"
                      >
                        {concept}
                      </span>
                    ))}
                  </div>

                  {/* Live Metrics Grid */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/60">
                    {lang.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="bg-slate-900/40 p-2 rounded border border-slate-800/40 text-center">
                        <span className="block text-[10px] text-slate-400 truncate">{m.label}</span>
                        <span className="font-mono text-xs font-bold text-slate-200">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500">
                    {lang.codeFile}
                  </span>
                  <button
                    onClick={() => onSelectLanguage(lang)}
                    className="text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1 hover:underline"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Open in Code Lab</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inter-Service Protocols & Contracts */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Inter-Track Protocol Contracts</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentTrack.interServiceContracts.map((contract, cIdx) => (
              <div
                key={cIdx}
                className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{contract.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {contract.protocol}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{contract.description}</p>
                <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono pt-1">
                  <span>→ Interfaces with:</span>
                  <span className="text-emerald-400 font-semibold">{contract.counterpart}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
