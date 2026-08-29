import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Filter,
  Layers,
  ShieldCheck,
  Award,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Search,
  Download,
  RotateCcw,
  ArrowRight,
  Code2,
  Share2,
  Info,
  Check,
  Target,
  Sliders
} from 'lucide-react';
import { CAPSTONE_MILESTONES } from '../data/curriculumData';
import { ENGINEERING_TRACKS } from '../data/tracksData';
import { CapstoneMilestone, TrackId, ProgrammingLanguageInfo } from '../types';

interface ProjectTimelineProps {
  onSelectTrack?: (trackId: TrackId) => void;
  onSelectLanguageById?: (langId: string) => void;
  onSelectSprintIdx?: (sprintIdx: number) => void;
}

type TaskStatus = 'completed' | 'in_progress' | 'review' | 'blocked' | 'scheduled';

interface TimelineTask {
  id: string;
  sprintIdx: number;
  sprintName: string;
  week: number;
  startDay: number;
  endDay: number;
  trackId: TrackId;
  trackName: string;
  deliverable: string;
  languageFocus: string[];
  status: TaskStatus;
  progressPercent: number;
  dependencies: string[];
  criticalPath: boolean;
}

const TRACK_COLORS: Record<TrackId, {
  border: string;
  bg: string;
  text: string;
  barBg: string;
  barBorder: string;
  barHover: string;
  dot: string;
}> = {
  frontend: {
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    barBg: 'bg-gradient-to-r from-cyan-600 to-cyan-500',
    barBorder: 'border-cyan-400/50',
    barHover: 'hover:from-cyan-500 hover:to-cyan-400',
    dot: 'bg-cyan-400',
  },
  networking: {
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    barBg: 'bg-gradient-to-r from-emerald-600 to-teal-500',
    barBorder: 'border-emerald-400/50',
    barHover: 'hover:from-emerald-500 hover:to-teal-400',
    dot: 'bg-emerald-400',
  },
  backend: {
    border: 'border-indigo-500/30',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    barBg: 'bg-gradient-to-r from-indigo-600 to-blue-500',
    barBorder: 'border-indigo-400/50',
    barHover: 'hover:from-indigo-500 hover:to-blue-400',
    dot: 'bg-indigo-400',
  },
  data: {
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    barBg: 'bg-gradient-to-r from-amber-600 to-orange-500',
    barBorder: 'border-amber-400/50',
    barHover: 'hover:from-amber-500 hover:to-orange-400',
    dot: 'bg-amber-400',
  },
  devops: {
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    barBg: 'bg-gradient-to-r from-purple-600 to-rose-500',
    barBorder: 'border-purple-400/50',
    barHover: 'hover:from-purple-500 hover:to-rose-400',
    dot: 'bg-purple-400',
  },
};

// Initial base timeline tasks derived from the 5 Capstone Milestones
function buildInitialTasks(): TimelineTask[] {
  const tasks: TimelineTask[] = [];

  CAPSTONE_MILESTONES.forEach((milestone, sIdx) => {
    const baseWeek = milestone.week;
    const startDayBase = (baseWeek - 1) * 7 + 1;

    milestone.deliverablesByTrack.forEach((deliv, dIdx) => {
      // Offset slightly to demonstrate realistic stagger inside the 7-day sprint
      const dayOffset = (dIdx % 3);
      const startDay = startDayBase + dayOffset;
      const endDay = Math.min(startDayBase + 6, startDay + 4 + (dIdx % 2));

      // Determine initial simulated status based on sprint (Sprint 1 done, Sprint 2 in progress)
      let initialStatus: TaskStatus = 'scheduled';
      let progress = 0;
      if (sIdx === 0) {
        initialStatus = 'completed';
        progress = 100;
      } else if (sIdx === 1) {
        if (dIdx <= 2) {
          initialStatus = 'completed';
          progress = 100;
        } else if (dIdx === 3) {
          initialStatus = 'in_progress';
          progress = 65;
        } else {
          initialStatus = 'in_progress';
          progress = 40;
        }
      } else if (sIdx === 2) {
        if (dIdx === 0) {
          initialStatus = 'in_progress';
          progress = 15;
        } else {
          initialStatus = 'scheduled';
          progress = 0;
        }
      }

      // Dependencies linking
      const dependencies: string[] = [];
      if (sIdx > 0) {
        dependencies.push(`Sprint 0${sIdx} - Track ${deliv.trackName.split(' ')[0]}`);
      }

      tasks.push({
        id: `task-${sIdx}-${deliv.trackId}-${dIdx}`,
        sprintIdx: sIdx,
        sprintName: milestone.sprint,
        week: milestone.week,
        startDay,
        endDay,
        trackId: deliv.trackId,
        trackName: deliv.trackName,
        deliverable: deliv.deliverable,
        languageFocus: deliv.languageFocus,
        status: initialStatus,
        progressPercent: progress,
        dependencies,
        criticalPath: deliv.trackId === 'networking' || deliv.trackId === 'frontend' || sIdx === 4,
      });
    });
  });

  return tasks;
}

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  onSelectTrack,
  onSelectLanguageById,
  onSelectSprintIdx,
}) => {
  const [tasks, setTasks] = useState<TimelineTask[]>(buildInitialTasks);
  const [currentDayMarker, setCurrentDayMarker] = useState<number>(11); // Day 11 is mid-Sprint 2
  const [viewMode, setViewMode] = useState<'track_gantt' | 'sprint_waterfall' | 'critical_path'>('track_gantt');
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<TrackId | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTaskModal, setActiveTaskModal] = useState<TimelineTask | null>(null);
  const [highlightCriticalOnly, setHighlightCriticalOnly] = useState<boolean>(false);
  const [exportedToast, setExportedToast] = useState<boolean>(false);

  // Sprints configuration for the timeline headers
  const sprints = useMemo(() => {
    return CAPSTONE_MILESTONES.map((m, idx) => ({
      idx,
      sprint: m.sprint,
      week: m.week,
      title: m.title,
      theme: m.theme,
      startDay: (m.week - 1) * 7 + 1,
      endDay: m.week * 7,
      integrationGate: m.crossTrackIntegrationGate,
      rubric: m.rubric,
    }));
  }, []);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (selectedTrackFilter !== 'all' && task.trackId !== selectedTrackFilter) {
        return false;
      }
      if (statusFilter !== 'all' && task.status !== statusFilter) {
        return false;
      }
      if (highlightCriticalOnly && !task.criticalPath) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesDeliverable = task.deliverable.toLowerCase().includes(q);
        const matchesTrack = task.trackName.toLowerCase().includes(q);
        const matchesLang = task.languageFocus.some((l) => l.toLowerCase().includes(q));
        if (!matchesDeliverable && !matchesTrack && !matchesLang) {
          return false;
        }
      }
      return true;
    });
  }, [tasks, selectedTrackFilter, statusFilter, highlightCriticalOnly, searchQuery]);

  // Overall statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const review = tasks.filter((t) => t.status === 'review').length;
    const scheduled = tasks.filter((t) => t.status === 'scheduled').length;
    const overallProgress = Math.round(
      tasks.reduce((sum, t) => sum + t.progressPercent, 0) / (total || 1)
    );

    // Active sprint based on currentDayMarker
    const currentSprintIdx = Math.min(4, Math.max(0, Math.floor((currentDayMarker - 1) / 7)));
    const currentSprint = CAPSTONE_MILESTONES[currentSprintIdx];

    return {
      total,
      completed,
      inProgress,
      review,
      scheduled,
      overallProgress,
      currentSprintIdx,
      currentSprint,
    };
  }, [tasks, currentDayMarker]);

  // Handle task status update
  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          let progress = t.progressPercent;
          if (newStatus === 'completed') progress = 100;
          if (newStatus === 'scheduled') progress = 0;
          if (newStatus === 'in_progress' && progress === 0) progress = 50;
          if (newStatus === 'review') progress = 90;
          return { ...t, status: newStatus, progressPercent: progress };
        }
        return t;
      })
    );
    if (activeTaskModal && activeTaskModal.id === taskId) {
      setActiveTaskModal((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleExportSchedule = () => {
    const dataStr = JSON.stringify(
      {
        project: 'KayBiT_WhatsApp Multi-Language Capstone',
        sprints: CAPSTONE_MILESTONES,
        timelineTasks: tasks,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
    navigator.clipboard.writeText(dataStr);
    setExportedToast(true);
    setTimeout(() => setExportedToast(false), 2500);
  };

  const handleResetTasks = () => {
    setTasks(buildInitialTasks());
    setCurrentDayMarker(11);
  };

  // Group tasks by Track for Track Gantt Mode
  const tasksByTrack = useMemo(() => {
    const map: Record<TrackId, TimelineTask[]> = {
      frontend: [],
      networking: [],
      backend: [],
      data: [],
      devops: [],
    };
    filteredTasks.forEach((t) => {
      if (map[t.trackId]) {
        map[t.trackId].push(t);
      }
    });
    return map;
  }, [filteredTasks]);

  // Group tasks by Sprint for Sprint Waterfall Mode
  const tasksBySprint = useMemo(() => {
    const map: Record<number, TimelineTask[]> = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
    };
    filteredTasks.forEach((t) => {
      if (map[t.sprintIdx]) {
        map[t.sprintIdx].push(t);
      }
    });
    return map;
  }, [filteredTasks]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Sprint Velocity Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400 border border-emerald-500/30 shadow-inner">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-100">
                  Capstone Project Timeline & Gantt Sprint Planner
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  5 Sprints • 35 Days
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  5 Engineering Tracks
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Visual Gantt roadmap mapping deliverables, cross-track integration gates, and multi-language milestones across 5 intensive sprint cycles.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap self-start lg:self-auto">
            <button
              onClick={handleExportSchedule}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              {exportedToast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{exportedToast ? 'Copied JSON Plan!' : 'Share / Export Plan'}</span>
            </button>
            <button
              onClick={handleResetTasks}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-700/80 flex items-center gap-1.5 transition-all"
              title="Reset tasks to default schedule"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Sprint Summary Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-800/80">
          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium block">Overall Progress</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-slate-100">{stats.overallProgress}%</span>
              <span className="text-[10px] text-emerald-400">({stats.completed}/{stats.total} Done)</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.overallProgress}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium block">Active Milestone</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {stats.currentSprint.sprint}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Day {currentDayMarker}/35</span>
            </div>
            <span className="text-[10px] text-slate-500 block truncate mt-0.5">
              {stats.currentSprint.theme}
            </span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium block">In Progress</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-bold text-cyan-400">{stats.inProgress}</span>
              <span className="text-[10px] text-slate-400">tracks active</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Under active coding</span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium block">Integration Gates</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-bold text-amber-400">
                {stats.currentSprintIdx + 1} / 5
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-[10px] text-slate-500 block truncate mt-0.5">
              Gate {stats.currentSprintIdx + 1} in testing
            </span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium block">Critical Path Tasks</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-bold text-purple-400">
                {tasks.filter((t) => t.criticalPath).length}
              </span>
              <span className="text-[10px] text-slate-400">vital nodes</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Zero-slack blockers</span>
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[11px] text-slate-400 font-medium block">Language Stacks</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-lg font-bold text-slate-200">20 / 20</span>
              <Code2 className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">100% curriculum coverage</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Timeline Scrubber */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        {/* Row 1: View Modes & Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* View Mode Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('track_gantt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'track_gantt'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Track Swimlane Gantt</span>
            </button>
            <button
              onClick={() => setViewMode('sprint_waterfall')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'sprint_waterfall'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Sprint Waterfall View</span>
            </button>
            <button
              onClick={() => setViewMode('critical_path')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'critical_path'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Integration Gates & Path</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deliverables, languages..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Track Filter */}
            <select
              value={selectedTrackFilter}
              onChange={(e) => setSelectedTrackFilter(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option value="all">All 5 Tracks</option>
              <option value="frontend">Frontend & Mobile</option>
              <option value="networking">Networking & Edge</option>
              <option value="backend">Distributed Backend</option>
              <option value="data">Database & Storage</option>
              <option value="devops">DevOps & Chaos</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed (100%)</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Under Review</option>
              <option value="scheduled">Scheduled</option>
            </select>

            {/* Critical Path Toggle */}
            <button
              onClick={() => setHighlightCriticalOnly(!highlightCriticalOnly)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                highlightCriticalOnly
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Critical Only</span>
            </button>
          </div>
        </div>

        {/* Row 2: Simulated "Today" Time Scrubber Slider */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-200">
                Simulate Current Calendar Date / Scrubber:
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold text-xs border border-emerald-500/20">
                Day {currentDayMarker} of 35 (Sprint 0{Math.floor((currentDayMarker - 1) / 7) + 1}, Week {Math.floor((currentDayMarker - 1) / 7) + 1})
              </span>
            </div>
            <div className="flex gap-1">
              {[1, 7, 14, 21, 28, 35].map((d) => (
                <button
                  key={d}
                  onClick={() => setCurrentDayMarker(d)}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-colors ${
                    currentDayMarker === d
                      ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  D{d}
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center">
            <input
              type="range"
              min="1"
              max="35"
              step="1"
              value={currentDayMarker}
              onChange={(e) => setCurrentDayMarker(parseInt(e.target.value))}
              className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer transition-all"
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-500 px-1">
            <span>Day 1 (Sprint 1 Start)</span>
            <span>Day 7 (Gate 1)</span>
            <span>Day 14 (Gate 2)</span>
            <span>Day 21 (Gate 3)</span>
            <span>Day 28 (Gate 4)</span>
            <span>Day 35 (Final Defense)</span>
          </div>
        </div>
      </div>

      {/* Main Gantt Canvas based on Active View Mode */}
      {viewMode === 'track_gantt' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Track Swimlane Gantt Chart</span>
                <span className="text-xs font-normal text-slate-400">(Parallel 5-Track Execution)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Horizontal time bars represent deliverables across 35 calendar days. Click any bar to inspect task details or update progress.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Completed
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> In Progress
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> Scheduled
              </span>
            </div>
          </div>

          {/* Timeline Table Container */}
          <div className="overflow-x-auto pb-4 no-scrollbar">
            <div className="min-w-[950px] space-y-3">
              {/* Header Columns for Sprints & Weeks */}
              <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-400">
                <div className="col-span-3 text-slate-300 pl-2">Engineering Track & Lead</div>
                <div className="col-span-9 grid grid-cols-5 gap-2 text-center">
                  {sprints.map((s) => {
                    const isCurrentSprint = Math.floor((currentDayMarker - 1) / 7) === s.idx;
                    return (
                      <div
                        key={s.idx}
                        className={`p-2 rounded-xl border text-left transition-all ${
                          isCurrentSprint
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="font-bold">{s.sprint}</span>
                          <span>Wk {s.week}</span>
                        </div>
                        <div className="text-[10px] text-slate-300 truncate font-sans mt-0.5">
                          {s.theme}
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                          Days {s.startDay}–{s.endDay}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Relative Track Rows */}
              {(['frontend', 'networking', 'backend', 'data', 'devops'] as TrackId[]).map((trackId) => {
                if (selectedTrackFilter !== 'all' && selectedTrackFilter !== trackId) return null;
                const trackTasks = tasksByTrack[trackId] || [];
                const styling = TRACK_COLORS[trackId];
                const trackDef = ENGINEERING_TRACKS.find((t) => t.id === trackId);

                return (
                  <div
                    key={trackId}
                    className="grid grid-cols-12 gap-2 items-center bg-slate-950/60 border border-slate-800/80 rounded-xl p-2.5 hover:border-slate-700 transition-all"
                  >
                    {/* Left: Track Info */}
                    <div className="col-span-3 pr-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${styling.dot}`} />
                        <span className="text-xs font-bold text-slate-200 line-clamp-1">
                          {trackDef?.title || trackId}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {trackTasks.length} Deliverables
                        </span>
                        {onSelectTrack && (
                          <button
                            onClick={() => onSelectTrack(trackId)}
                            className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
                          >
                            <span>Inspect</span>
                            <ChevronRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right: 5-Sprint Gantt Bars Canvas */}
                    <div className="col-span-9 relative min-h-[56px] bg-slate-900/60 rounded-lg p-1.5 border border-slate-800/60 flex items-center">
                      {/* Day Grid Lines */}
                      <div className="absolute inset-0 grid grid-cols-5 pointer-events-none opacity-20 divide-x divide-slate-700" />

                      {/* Current Day Scrubber Line */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10 pointer-events-none shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                        style={{
                          left: `${((currentDayMarker - 1) / 34) * 100}%`,
                        }}
                      >
                        <div className="absolute -top-1.5 -translate-x-1/2 px-1 py-0.2 rounded bg-rose-600 text-white font-mono text-[8px] font-bold">
                          D{currentDayMarker}
                        </div>
                      </div>

                      {/* Render Gantt Bars for this track */}
                      <div className="relative w-full h-9">
                        {trackTasks.map((task) => {
                          // Calculate position percentage across 35 days
                          const leftPct = ((task.startDay - 1) / 35) * 100;
                          const widthPct = Math.max(8, ((task.endDay - task.startDay + 1) / 35) * 100);

                          let statusBadge = 'bg-slate-700 text-slate-300';
                          if (task.status === 'completed') statusBadge = 'bg-emerald-500 text-slate-950 font-bold';
                          if (task.status === 'in_progress') statusBadge = 'bg-cyan-500 text-slate-950 font-bold';
                          if (task.status === 'review') statusBadge = 'bg-amber-400 text-slate-950 font-bold';

                          return (
                            <div
                              key={task.id}
                              onClick={() => setActiveTaskModal(task)}
                              className={`absolute top-0 h-9 rounded-lg p-1.5 cursor-pointer shadow-md transition-all border flex items-center justify-between text-xs overflow-hidden group ${
                                task.status === 'completed'
                                  ? `${styling.barBg} ${styling.barBorder} text-white`
                                  : task.status === 'in_progress'
                                  ? `${styling.barBg} ${styling.barBorder} text-white ring-1 ring-cyan-400/50`
                                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                              }`}
                              style={{
                                left: `${leftPct}%`,
                                width: `${widthPct}%`,
                              }}
                              title={`${task.sprintName}: ${task.deliverable}`}
                            >
                              {/* Progress overlay fill */}
                              <div
                                className="absolute inset-y-0 left-0 bg-white/15 pointer-events-none transition-all"
                                style={{ width: `${task.progressPercent}%` }}
                              />

                              <div className="relative z-10 flex items-center gap-1.5 min-w-0 pr-1">
                                {task.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-white flex-shrink-0" />}
                                {task.status === 'in_progress' && <Play className="w-3 h-3 text-cyan-200 fill-cyan-200 flex-shrink-0" />}
                                <span className="font-semibold text-[11px] truncate leading-tight">
                                  {task.sprintName.replace('Sprint ', 'S')}: {task.deliverable}
                                </span>
                              </div>

                              <div className="relative z-10 hidden sm:flex items-center gap-1 flex-shrink-0">
                                {task.languageFocus.slice(0, 1).map((lang, lIdx) => (
                                  <span
                                    key={lIdx}
                                    className="text-[9px] font-mono px-1 py-0.2 rounded bg-black/40 text-slate-200"
                                  >
                                    {lang.split(' ')[0]}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Waterfall Sprints Mode */}
      {viewMode === 'sprint_waterfall' && (
        <div className="space-y-4">
          {sprints.map((sprint) => {
            const sprintTasks = tasksBySprint[sprint.idx] || [];
            const isCurrent = Math.floor((currentDayMarker - 1) / 7) === sprint.idx;
            const completedCount = sprintTasks.filter((t) => t.status === 'completed').length;
            const totalCount = sprintTasks.length;
            const sprintPct = Math.round((completedCount / (totalCount || 1)) * 100);

            return (
              <div
                key={sprint.idx}
                className={`bg-slate-900/90 border rounded-2xl p-6 shadow-xl transition-all ${
                  isCurrent
                    ? 'border-emerald-500/50 ring-1 ring-emerald-500/20'
                    : 'border-slate-800'
                }`}
              >
                {/* Sprint Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 font-mono font-bold text-sm border border-emerald-500/20">
                      {sprint.sprint}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-100">{sprint.title}</h3>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            CURRENT SPRINT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{sprint.theme} • Week {sprint.week} (Days {sprint.startDay}–{sprint.endDay})</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-200 font-mono">{sprintPct}% Done</span>
                      <span className="text-[10px] text-slate-500 block">({completedCount}/{totalCount} Deliverables)</span>
                    </div>
                    <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${sprintPct}%` }}
                      />
                    </div>
                    {onSelectSprintIdx && (
                      <button
                        onClick={() => onSelectSprintIdx(sprint.idx)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 flex items-center gap-1"
                      >
                        <span>Syllabus</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sprint Deliverables Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
                  {sprintTasks.map((task) => {
                    const styling = TRACK_COLORS[task.trackId];
                    return (
                      <div
                        key={task.id}
                        onClick={() => setActiveTaskModal(task)}
                        className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3.5 space-y-2.5 hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-[11px] font-bold ${styling.text}`}>
                              {task.trackName}
                            </span>
                            <span
                              className={`text-[9px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                                task.status === 'completed'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : task.status === 'in_progress'
                                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {task.status.replace('_', ' ')}
                            </span>
                          </div>

                          <p className="text-xs text-slate-200 leading-relaxed font-medium">
                            {task.deliverable}
                          </p>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-900">
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>Days {task.startDay}–{task.endDay}</span>
                            <div className="flex gap-1 flex-wrap">
                              {task.languageFocus.map((lang, lIdx) => (
                                <span
                                  key={lIdx}
                                  className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-emerald-300 border border-slate-800"
                                >
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Progress bar inside card */}
                          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all"
                              style={{ width: `${task.progressPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cross-Track Integration Gate Banner */}
                <div className="bg-slate-950/90 rounded-xl p-3.5 border border-emerald-500/30 flex items-start gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        {sprint.sprint} Integration Gate (Blocking Milestone)
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">Day {sprint.endDay} Gate Check</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {sprint.integrationGate}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Critical Path & Integration Gates Mode */}
      {viewMode === 'critical_path' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>Critical Path & Multi-Track Contract Verification Chain</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              End-to-end integration dependency chain where cross-track contracts gate the progression of subsequent sprints.
            </p>
          </div>

          <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-8">
            {sprints.map((sprint, idx) => {
              const isPassed = currentDayMarker > sprint.endDay;
              const isCurrent = currentDayMarker >= sprint.startDay && currentDayMarker <= sprint.endDay;

              return (
                <div key={sprint.idx} className="relative group">
                  {/* Timeline Node Icon */}
                  <div
                    className={`absolute -left-[35px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isPassed
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg'
                        : isCurrent
                        ? 'bg-rose-500 border-rose-400 text-white shadow-lg animate-pulse'
                        : 'bg-slate-900 border-slate-700 text-slate-500'
                    }`}
                  >
                    {isPassed ? (
                      <Check className="w-4 h-4 font-bold" />
                    ) : (
                      <span className="text-xs font-mono font-bold">{idx + 1}</span>
                    )}
                  </div>

                  {/* Milestone Card */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-400 font-mono">
                            {sprint.sprint} (Days {sprint.startDay}–{sprint.endDay})
                          </span>
                          <span className="text-xs text-slate-400 font-medium">{sprint.theme}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-100 mt-0.5">{sprint.title}</h4>
                      </div>
                      <span
                        className={`text-xs font-mono px-2.5 py-1 rounded-full self-start sm:self-auto font-semibold ${
                          isPassed
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : isCurrent
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {isPassed ? 'Gate Verified' : isCurrent ? 'Active Evaluation' : 'Upcoming'}
                      </span>
                    </div>

                    {/* Gate Description */}
                    <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 text-xs space-y-1">
                      <span className="font-bold text-amber-400 block flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" />
                        <span>Integration Criteria & Wire Contract Test:</span>
                      </span>
                      <p className="text-slate-300 leading-relaxed">{sprint.integrationGate}</p>
                    </div>

                    {/* Rubric Weights */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      {sprint.rubric.slice(0, 3).map((r, rIdx) => (
                        <div key={rIdx} className="bg-slate-900/50 p-2 rounded border border-slate-800/80 text-[11px]">
                          <div className="flex justify-between font-medium text-slate-300">
                            <span className="truncate">{r.criteria}</span>
                            <span className="text-amber-400 font-mono">{r.weight}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Task Inspection & Progress Update Modal */}
      {activeTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
                    {activeTaskModal.sprintName} • Week {activeTaskModal.week}
                  </span>
                  <span className="text-xs text-slate-400">Days {activeTaskModal.startDay}–{activeTaskModal.endDay}</span>
                </div>
                <h3 className="text-base font-bold text-slate-100 mt-1.5">
                  {activeTaskModal.trackName}
                </h3>
              </div>
              <button
                onClick={() => setActiveTaskModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  Sprint Deliverable Specification
                </span>
                <p className="text-slate-200 text-sm leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  {activeTaskModal.deliverable}
                </p>
              </div>

              {/* Language Stack Focus */}
              <div className="space-y-1.5">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  Language Runtimes & Compilers Involved
                </span>
                <div className="flex gap-1.5 flex-wrap">
                  {activeTaskModal.languageFocus.map((lang, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 text-emerald-300 font-mono text-xs border border-emerald-500/30 flex items-center gap-1.5"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>{lang}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Update Task Status */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  Update Student Milestone Status
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['scheduled', 'in_progress', 'completed'] as TaskStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateTaskStatus(activeTaskModal.id, st)}
                      className={`p-2 rounded-xl border text-xs font-semibold capitalize transition-all ${
                        activeTaskModal.status === st
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-bold'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setActiveTaskModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
