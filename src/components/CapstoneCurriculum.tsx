import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  FileCode, 
  Copy, 
  Check, 
  Award,
  Users,
  Terminal,
  ArrowRight,
  Clock,
  BookOpen
} from 'lucide-react';
import { CAPSTONE_MILESTONES, PROTOBUF_SPECIFICATION } from '../data/curriculumData';
import { ProjectTimeline } from './ProjectTimeline';
import { TrackId, ProgrammingLanguageInfo } from '../types';

interface CapstoneCurriculumProps {
  selectedSprintIdx?: number;
  onSelectSprintIdx?: (idx: number) => void;
  onSelectTrack?: (trackId: TrackId) => void;
  onSelectLanguageById?: (langId: string) => void;
}

export const CapstoneCurriculum: React.FC<CapstoneCurriculumProps> = ({
  selectedSprintIdx: externalSprintIdx,
  onSelectSprintIdx,
  onSelectTrack,
  onSelectLanguageById,
}) => {
  const [internalSprintIdx, setInternalSprintIdx] = useState<number>(0);
  const [protoCopied, setProtoCopied] = useState<boolean>(false);
  const [curriculumViewMode, setCurriculumViewMode] = useState<'timeline' | 'syllabus' | 'contract'>('timeline');

  const selectedSprintIdx = externalSprintIdx !== undefined ? externalSprintIdx : internalSprintIdx;
  const setSelectedSprintIdx = (idx: number) => {
    if (onSelectSprintIdx) {
      onSelectSprintIdx(idx);
    }
    setInternalSprintIdx(idx);
  };

  const currentSprint = CAPSTONE_MILESTONES[selectedSprintIdx] || CAPSTONE_MILESTONES[0];

  const handleCopyProto = () => {
    navigator.clipboard.writeText(PROTOBUF_SPECIFICATION);
    setProtoCopied(true);
    setTimeout(() => setProtoCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* View Switcher Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              Capstone Planning, Timeline & Syllabus
            </h2>
            <p className="text-xs text-slate-400">
              Interactive Gantt roadmap and academic milestones across 5 sprints & 20 languages.
            </p>
          </div>
        </div>

        {/* View Mode Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setCurriculumViewMode('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              curriculumViewMode === 'timeline'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Project Timeline (Gantt)</span>
          </button>
          <button
            onClick={() => setCurriculumViewMode('syllabus')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              curriculumViewMode === 'syllabus'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Syllabus & Rubrics</span>
          </button>
          <button
            onClick={() => setCurriculumViewMode('contract')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              curriculumViewMode === 'contract'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Protobuf Wire Contract</span>
          </button>
        </div>
      </div>

      {/* Render Active View Mode */}
      {curriculumViewMode === 'timeline' && (
        <ProjectTimeline
          onSelectTrack={onSelectTrack}
          onSelectLanguageById={onSelectLanguageById}
          onSelectSprintIdx={(idx) => {
            setSelectedSprintIdx(idx);
            setCurriculumViewMode('syllabus');
          }}
        />
      )}

      {curriculumViewMode === 'syllabus' && (
        <div className="space-y-6">
          {/* Sprints Horizontal Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {CAPSTONE_MILESTONES.map((milestone, idx) => {
              const isSelected = selectedSprintIdx === idx;
              return (
                <button
                  key={milestone.sprint}
                  onClick={() => setSelectedSprintIdx(idx)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {milestone.sprint}
                      </span>
                      <span className="text-[10px] text-slate-500">Week {milestone.week}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-100 line-clamp-1 mb-1">
                      {milestone.theme}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {milestone.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Sprint Deliverables Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 cols: Track Deliverables */}
            <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <div className="pb-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {currentSprint.sprint} • Week {currentSprint.week}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{currentSprint.theme}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mt-1">{currentSprint.title}</h3>
                </div>
              </div>

              {/* Deliverables per Engineering Track */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Student Track Deliverables Matrix
                </h4>
                <div className="space-y-3">
                  {currentSprint.deliverablesByTrack.map((deliv, dIdx) => (
                    <div
                      key={dIdx}
                      className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{deliv.trackName}</span>
                        <div className="flex gap-1 flex-wrap">
                          {deliv.languageFocus.map((lang, lIdx) => (
                            <span
                              key={lIdx}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-300 border border-slate-700"
                            >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{deliv.deliverable}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cross-Track Integration Gate */}
              <div className="bg-slate-950/90 rounded-xl p-4 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Cross-Track Integration Gate (Blocking Milestone)</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {currentSprint.crossTrackIntegrationGate}
                </p>
              </div>
            </div>

            {/* Right 4 cols: Sprint Rubric & Grading */}
            <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Sprint Evaluation Rubric</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">100 Pts Total</span>
                </div>

                <div className="space-y-3">
                  {currentSprint.rubric.map((r, rIdx) => (
                    <div
                      key={rIdx}
                      className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-200">{r.criteria}</span>
                        <span className="font-mono text-amber-400 font-semibold">{r.weight}%</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{r.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <span className="text-slate-200 font-bold block">Peer Architecture Reviews</span>
                <p>Each student team reviews at least 2 pull requests from opposing tracks to ensure zero-copy protocol conformity.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {curriculumViewMode === 'contract' && (
        /* Protobuf Specification Contract Explorer */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-slate-100">
                  Canonical Protocol Buffer Wire Contract (message.proto)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                The single source of truth binary interface agreed upon across all 5 engineering tracks.
              </p>
            </div>

            <button
              onClick={handleCopyProto}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-all self-start sm:self-auto"
            >
              {protoCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{protoCopied ? 'Copied Contract!' : 'Copy Protobuf Schema'}</span>
            </button>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 max-h-[400px] overflow-y-auto no-scrollbar">
            <pre className="text-sky-300/90 whitespace-pre-wrap">{PROTOBUF_SPECIFICATION}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
