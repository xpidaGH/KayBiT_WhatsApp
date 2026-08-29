import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Activity, 
  Server, 
  Cpu, 
  Wifi, 
  ShieldCheck, 
  Database, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Zap, 
  Play, 
  Pause, 
  Flame, 
  Radio, 
  HardDrive, 
  Clock, 
  Sliders, 
  ArrowUpRight, 
  ArrowDownRight, 
  Terminal, 
  Filter, 
  Download,
  Check,
  RotateCcw,
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';
import { ENGINEERING_TRACKS } from '../data/tracksData';
import { TrackId, ProgrammingLanguageInfo } from '../types';

interface SystemHealthDashboardProps {
  onSelectTrack?: (trackId: TrackId) => void;
  onSelectLanguage?: (lang: ProgrammingLanguageInfo) => void;
}

type TrafficProfile = 'normal' | 'peak' | 'media_burst' | 'chaos';

interface NodeStatus {
  id: string;
  name: string;
  trackId: TrackId;
  language: string;
  role: string;
  status: 'healthy' | 'warning' | 'degraded' | 'recovering';
  cpu: number;
  memory: number;
  latencyMs: number;
  qps: number;
  uptime: string;
  activeSockets: number;
}

interface TelemetryLog {
  id: string;
  timestamp: string;
  trackId: TrackId;
  source: string;
  level: 'info' | 'warn' | 'metric';
  message: string;
  latency?: number;
}

export const SystemHealthDashboard: React.FC<SystemHealthDashboardProps> = ({
  onSelectTrack,
  onSelectLanguage,
}) => {
  // Live Simulation Controls
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [refreshIntervalSec, setRefreshIntervalSec] = useState<number>(2);
  const [trafficProfile, setTrafficProfile] = useState<TrafficProfile>('normal');
  const [chaosEventActive, setChaosEventActive] = useState<boolean>(false);
  const [surgeTimeRemaining, setSurgeTimeRemaining] = useState<number>(0);
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<TrackId | 'all'>('all');
  const [selectedNode, setSelectedNode] = useState<NodeStatus | null>(null);
  const [logFilter, setLogFilter] = useState<'all' | 'warn' | 'metric'>('all');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Time series metrics history (last 20 points)
  const [history, setHistory] = useState<{
    timestamps: string[];
    throughput: number[];
    latencyP99: number[];
    activeConns: number[];
    errorRate: number[];
  }>(() => {
    const initialTimestamps = Array.from({ length: 15 }, (_, i) => {
      const d = new Date(Date.now() - (15 - i) * 2000);
      return d.toTimeString().split(' ')[0];
    });
    return {
      timestamps: initialTimestamps,
      throughput: Array.from({ length: 15 }, () => 480000 + Math.floor(Math.random() * 40000)),
      latencyP99: Array.from({ length: 15 }, () => 1.8 + Math.random() * 0.4),
      activeConns: Array.from({ length: 15 }, () => 2450000 + Math.floor(Math.random() * 20000)),
      errorRate: Array.from({ length: 15 }, () => 0.001 + Math.random() * 0.002),
    };
  });

  // Track Nodes definition
  const [nodes, setNodes] = useState<NodeStatus[]>([
    // Track 1: Client Edge
    { id: 'node-kt-01', name: 'kt-android-edge-01', trackId: 'frontend', language: 'Kotlin', role: 'Android Netty Channel Pool', status: 'healthy', cpu: 28, memory: 42, latencyMs: 14.2, qps: 84000, uptime: '99.99%', activeSockets: 680000 },
    { id: 'node-swift-01', name: 'swift-ios-edge-01', trackId: 'frontend', language: 'Swift', role: 'iOS URLSession WebSocket', status: 'healthy', cpu: 24, memory: 38, latencyMs: 12.8, qps: 72000, uptime: '99.99%', activeSockets: 590000 },
    { id: 'node-flutter-01', name: 'flutter-client-01', trackId: 'frontend', language: 'Dart / Flutter', role: 'Cross-Platform Mesh Client', status: 'healthy', cpu: 32, memory: 48, latencyMs: 16.5, qps: 45000, uptime: '99.98%', activeSockets: 410000 },
    { id: 'node-rn-01', name: 'rn-turbomodule-01', trackId: 'frontend', language: 'React Native', role: 'JSI Hermes Bridge Client', status: 'healthy', cpu: 35, memory: 52, latencyMs: 18.2, qps: 39000, uptime: '99.97%', activeSockets: 380000 },

    // Track 2: Networking & Protocol Layer
    { id: 'node-go-01', name: 'go-epoll-gateway-01', trackId: 'networking', language: 'Go', role: 'Epoll Edge Gateway (1M Conns)', status: 'healthy', cpu: 58, memory: 64, latencyMs: 0.85, qps: 280000, uptime: '100%', activeSockets: 1150000 },
    { id: 'node-rust-01', name: 'rust-tls-tokio-01', trackId: 'networking', language: 'Rust', role: 'Tokio Async TLS 1.3 Decryptor', status: 'healthy', cpu: 44, memory: 26, latencyMs: 0.45, qps: 340000, uptime: '100%', activeSockets: 890000 },
    { id: 'node-cpp-01', name: 'cpp-zerocopy-ring-01', trackId: 'networking', language: 'C++', role: 'Zero-Copy Ring Buffer Shard', status: 'healthy', cpu: 49, memory: 22, latencyMs: 0.18, qps: 410000, uptime: '100%', activeSockets: 620000 },
    { id: 'node-csharp-01', name: 'csharp-kestrel-01', trackId: 'networking', language: 'C#', role: 'ASP.NET Core Socket Dispatcher', status: 'healthy', cpu: 52, memory: 58, latencyMs: 1.12, qps: 190000, uptime: '99.99%', activeSockets: 430000 },

    // Track 3: Core Messaging & Distributed State
    { id: 'node-erlang-01', name: 'beam-otp-session-01', trackId: 'backend', language: 'Erlang/OTP', role: 'BEAM Distributed Session Mailbox', status: 'healthy', cpu: 62, memory: 71, latencyMs: 1.84, qps: 420000, uptime: '100%', activeSockets: 1200000 },
    { id: 'node-java-01', name: 'akka-actor-cluster-01', trackId: 'backend', language: 'Java / Akka', role: 'Virtual Actor Group Sharding', status: 'healthy', cpu: 68, memory: 76, latencyMs: 2.35, qps: 360000, uptime: '99.99%', activeSockets: 940000 },
    { id: 'node-scala-01', name: 'scala-cats-event-01', trackId: 'backend', language: 'Scala', role: 'Cats Effect Stream Publisher', status: 'healthy', cpu: 55, memory: 65, latencyMs: 2.10, qps: 280000, uptime: '99.99%', activeSockets: 510000 },
    { id: 'node-elixir-01', name: 'elixir-phoenix-sync-01', trackId: 'backend', language: 'Elixir', role: 'Presence & Ephemeral State Bus', status: 'healthy', cpu: 46, memory: 54, latencyMs: 1.95, qps: 310000, uptime: '100%', activeSockets: 650000 },

    // Track 4: Persistent Storage & Media Pipeline
    { id: 'node-zig-01', name: 'zig-lsm-commitlog-01', trackId: 'data', language: 'Zig', role: 'LSM-Tree Direct I/O Engine', status: 'healthy', cpu: 38, memory: 18, latencyMs: 0.62, qps: 185000, uptime: '100%', activeSockets: 120000 },
    { id: 'node-py-01', name: 'py-async-faststream-01', trackId: 'data', language: 'Python', role: 'Kafka / Redis CDC Batch Worker', status: 'healthy', cpu: 59, memory: 66, latencyMs: 3.40, qps: 92000, uptime: '99.98%', activeSockets: 45000 },
    { id: 'node-ruby-01', name: 'ruby-sidekiq-media-01', trackId: 'data', language: 'Ruby', role: 'Sidekiq Media Video Transcoder', status: 'healthy', cpu: 74, memory: 81, latencyMs: 8.50, qps: 34000, uptime: '99.95%', activeSockets: 18000 },
    { id: 'node-php-01', name: 'php-admin-governance-01', trackId: 'data', language: 'PHP', role: 'Swoole Governance & Metadata API', status: 'healthy', cpu: 41, memory: 49, latencyMs: 4.80, qps: 28000, uptime: '99.96%', activeSockets: 12000 },

    // Track 5: High-Performance Crypto & Systems
    { id: 'node-asm-01', name: 'asm-simd-ratchet-01', trackId: 'devops', language: 'Assembly (x86_64)', role: 'AVX2 256-bit SIMD Crypto Core', status: 'healthy', cpu: 34, memory: 8, latencyMs: 0.08, qps: 920000, uptime: '100%', activeSockets: 2450000 },
    { id: 'node-haskell-01', name: 'haskell-formal-proof-01', trackId: 'devops', language: 'Haskell', role: 'Cryptographic Protocol Verifier', status: 'healthy', cpu: 42, memory: 28, latencyMs: 0.15, qps: 160000, uptime: '100%', activeSockets: 400000 },
    { id: 'node-ocaml-01', name: 'ocaml-type-safeguard-01', trackId: 'devops', language: 'OCaml', role: 'Deterministic State Engine', status: 'healthy', cpu: 38, memory: 24, latencyMs: 0.12, qps: 180000, uptime: '100%', activeSockets: 420000 },
    { id: 'node-cobol-01', name: 'cobol-ledger-audit-01', trackId: 'devops', language: 'COBOL', role: 'Zero-Variance Financial Ledger', status: 'healthy', cpu: 22, memory: 14, latencyMs: 0.32, qps: 65000, uptime: '100%', activeSockets: 150000 },
  ]);

  // Live Logs
  const [logs, setLogs] = useState<TelemetryLog[]>([
    { id: 'log-1', timestamp: new Date().toTimeString().split(' ')[0], trackId: 'networking', source: 'go-epoll-gateway-01', level: 'info', message: 'Accepted TLS 1.3 socket burst. 1,024,500 persistent descriptors active.', latency: 0.82 },
    { id: 'log-2', timestamp: new Date().toTimeString().split(' ')[0], trackId: 'devops', source: 'asm-simd-ratchet-01', level: 'metric', message: 'AVX2 256-bit vectorized Signal Double Ratchet benchmark: 9.42M key derivations/sec.', latency: 0.08 },
    { id: 'log-3', timestamp: new Date().toTimeString().split(' ')[0], trackId: 'backend', source: 'beam-otp-session-01', level: 'info', message: 'BEAM supervision tree healthy. Actor mailbox depth: 0 dropped, 0 deadlocks.', latency: 1.80 },
    { id: 'log-4', timestamp: new Date().toTimeString().split(' ')[0], trackId: 'data', source: 'zig-lsm-commitlog-01', level: 'metric', message: 'SSTable level-0 compacted to level-1 via direct unbuffered I/O (0.58ms).', latency: 0.58 },
  ]);

  // Real-time ticking simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const nowTime = new Date().toTimeString().split(' ')[0];

      // Multipliers based on traffic profile
      let loadMultiplier = 1.0;
      let latencyMultiplier = 1.0;
      let cpuMultiplier = 1.0;

      if (trafficProfile === 'peak') {
        loadMultiplier = 2.4;
        latencyMultiplier = 1.8;
        cpuMultiplier = 1.4;
      } else if (trafficProfile === 'media_burst') {
        loadMultiplier = 1.6;
        latencyMultiplier = 2.3;
        cpuMultiplier = 1.6;
      } else if (trafficProfile === 'chaos') {
        loadMultiplier = 0.85;
        latencyMultiplier = 3.2;
        cpuMultiplier = 1.3;
      }

      // Decrement surge timer if active
      if (surgeTimeRemaining > 0) {
        setSurgeTimeRemaining((prev) => prev - 1);
        loadMultiplier *= 2.8;
        latencyMultiplier *= 2.2;
        cpuMultiplier *= 1.7;
      }

      // Update Node metrics
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          let jitter = (Math.random() - 0.5) * 0.15;
          let nodeCpu = Math.min(99, Math.max(12, Math.round(node.cpu * (1 + jitter) * cpuMultiplier * 0.7 + (node.cpu * 0.3))));
          let nodeMem = Math.min(96, Math.max(10, Math.round(node.memory * (1 + (Math.random() - 0.5) * 0.05))));
          let nodeLatency = +(node.latencyMs * (1 + (Math.random() - 0.4) * 0.2) * latencyMultiplier).toFixed(2);
          let nodeQps = Math.round(node.qps * (1 + (Math.random() - 0.5) * 0.1) * loadMultiplier);

          // Simulated chaos status on a specific node during chaos mode
          let nodeStatus: NodeStatus['status'] = 'healthy';
          if (chaosEventActive && node.id === 'node-erlang-01') {
            nodeStatus = 'degraded';
            nodeCpu = 94;
            nodeLatency = 14.8;
          } else if (nodeCpu > 85 || nodeLatency > 20) {
            nodeStatus = 'warning';
          }

          return {
            ...node,
            cpu: nodeCpu,
            memory: nodeMem,
            latencyMs: Math.max(0.05, nodeLatency),
            qps: nodeQps,
            status: nodeStatus,
          };
        })
      );

      // Generate random log entry
      const sampleEvents: { trackId: TrackId; source: string; level: TelemetryLog['level']; message: string; latency: number }[] = [
        { trackId: 'networking', source: 'go-epoll-gateway-01', level: 'info', message: `Epoll ring loop dispatched ${Math.floor(25000 * loadMultiplier)} TCP packets with zero socket pool starvation.`, latency: +(0.85 * latencyMultiplier).toFixed(2) },
        { trackId: 'networking', source: 'rust-tls-tokio-01', level: 'metric', message: `TLS 1.3 ChaCha20-Poly1305 handshakes executed at ${(340 * loadMultiplier).toFixed(0)}k sessions/sec.`, latency: +(0.44 * latencyMultiplier).toFixed(2) },
        { trackId: 'backend', source: 'beam-otp-session-01', level: 'info', message: `Erlang actor router delivered chat broadcast to ${(120 * loadMultiplier).toFixed(0)}k active rooms.`, latency: +(1.82 * latencyMultiplier).toFixed(2) },
        { trackId: 'backend', source: 'akka-actor-cluster-01', level: 'metric', message: `Akka cluster rebalance complete: 128 virtual shards healthy with 0 raft split-brain.`, latency: +(2.15 * latencyMultiplier).toFixed(2) },
        { trackId: 'data', source: 'zig-lsm-commitlog-01', level: 'info', message: `Direct I/O flushed commitlog block to NVMe partition (O_DIRECT). Write latency ${(0.61 * latencyMultiplier).toFixed(2)}ms.`, latency: +(0.61 * latencyMultiplier).toFixed(2) },
        { trackId: 'data', source: 'py-async-faststream-01', level: 'metric', message: `FastStream CDC consumer processed ${(95 * loadMultiplier).toFixed(0)}k message events into Cassandra ring.`, latency: +(3.20 * latencyMultiplier).toFixed(2) },
        { trackId: 'devops', source: 'asm-simd-ratchet-01', level: 'metric', message: `x86_64 AVX2 vectorized ratchet computed 512-bit root ratchet updates. Zero heap allocations.`, latency: +(0.08 * latencyMultiplier).toFixed(2) },
        { trackId: 'devops', source: 'cobol-ledger-audit-01', level: 'info', message: `Financial audit cycle reconciled ${(24 * loadMultiplier).toFixed(0)}k debit/credit events. Discrepancy: $0.00.`, latency: +(0.32 * latencyMultiplier).toFixed(2) },
        { trackId: 'frontend', source: 'kt-android-edge-01', level: 'info', message: `Android Netty background socket received FCM push wake. Resume latency 14.1ms.`, latency: +(14.1 * latencyMultiplier).toFixed(2) },
      ];

      const chosenEvent = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      const newLog: TelemetryLog = {
        id: `log-${Date.now()}`,
        timestamp: nowTime,
        trackId: chosenEvent.trackId,
        source: chosenEvent.source,
        level: chosenEvent.level,
        message: chosenEvent.message,
        latency: chosenEvent.latency,
      };

      setLogs((prev) => [newLog, ...prev.slice(0, 39)]);

      // Update time-series history
      setHistory((prev) => {
        const curThroughput = Math.round(520000 * loadMultiplier + (Math.random() - 0.5) * 45000);
        const curLatency = +(1.85 * latencyMultiplier + (Math.random() - 0.4) * 0.3).toFixed(2);
        const curConns = Math.round(2450000 + (Math.random() - 0.5) * 30000);
        const curErrRate = +(chaosEventActive ? 0.042 : 0.0012 + Math.random() * 0.001).toFixed(4);

        return {
          timestamps: [...prev.timestamps.slice(1), nowTime],
          throughput: [...prev.throughput.slice(1), curThroughput],
          latencyP99: [...prev.latencyP99.slice(1), Math.max(0.5, curLatency)],
          activeConns: [...prev.activeConns.slice(1), curConns],
          errorRate: [...prev.errorRate.slice(1), curErrRate],
        };
      });
    }, refreshIntervalSec * 1000);

    return () => clearInterval(interval);
  }, [isRunning, refreshIntervalSec, trafficProfile, chaosEventActive, surgeTimeRemaining]);

  // Aggregate Calculations
  const systemAggregates = useMemo(() => {
    const totalQps = nodes.reduce((sum, n) => sum + n.qps, 0);
    const avgCpu = Math.round(nodes.reduce((sum, n) => sum + n.cpu, 0) / nodes.length);
    const avgMem = Math.round(nodes.reduce((sum, n) => sum + n.memory, 0) / nodes.length);
    const totalSockets = nodes.reduce((sum, n) => sum + n.activeSockets, 0);
    const p99Latency = history.latencyP99[history.latencyP99.length - 1] || 1.85;
    const currentThroughput = history.throughput[history.throughput.length - 1] || 520000;
    const healthyNodesCount = nodes.filter((n) => n.status === 'healthy').length;
    const degradedCount = nodes.filter((n) => n.status !== 'healthy').length;

    return {
      totalQps,
      avgCpu,
      avgMem,
      totalSockets,
      p99Latency,
      currentThroughput,
      healthyNodesCount,
      totalNodes: nodes.length,
      degradedCount,
      availabilityPercent: (
        ((nodes.length - degradedCount * 0.5) / nodes.length) *
        100
      ).toFixed(3),
    };
  }, [nodes, history]);

  // Track Specific Aggregations
  const trackMetrics = useMemo(() => {
    const map: Record<
      TrackId,
      {
        track: (typeof ENGINEERING_TRACKS)[0];
        nodes: NodeStatus[];
        totalQps: number;
        avgLatency: number;
        avgCpu: number;
        status: 'healthy' | 'warning' | 'degraded';
      }
    > = {} as any;

    ENGINEERING_TRACKS.forEach((track) => {
      const trackNodes = nodes.filter((n) => n.trackId === track.id);
      const totalQps = trackNodes.reduce((sum, n) => sum + n.qps, 0);
      const avgLatency = +(
        trackNodes.reduce((sum, n) => sum + n.latencyMs, 0) / (trackNodes.length || 1)
      ).toFixed(2);
      const avgCpu = Math.round(
        trackNodes.reduce((sum, n) => sum + n.cpu, 0) / (trackNodes.length || 1)
      );
      const hasDegraded = trackNodes.some((n) => n.status === 'degraded');
      const hasWarning = trackNodes.some((n) => n.status === 'warning');

      map[track.id] = {
        track,
        nodes: trackNodes,
        totalQps,
        avgLatency,
        avgCpu,
        status: hasDegraded ? 'degraded' : hasWarning ? 'warning' : 'healthy',
      };
    });

    return map;
  }, [nodes]);

  // Filtered nodes
  const filteredNodes = useMemo(() => {
    if (selectedTrackFilter === 'all') return nodes;
    return nodes.filter((n) => n.trackId === selectedTrackFilter);
  }, [nodes, selectedTrackFilter]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (selectedTrackFilter !== 'all' && log.trackId !== selectedTrackFilter) return false;
      if (logFilter === 'warn' && log.level !== 'warn') return false;
      if (logFilter === 'metric' && log.level !== 'metric') return false;
      return true;
    });
  }, [logs, selectedTrackFilter, logFilter]);

  // Actions
  const handleTriggerSurge = () => {
    setSurgeTimeRemaining(10);
  };

  const handleToggleChaos = () => {
    setChaosEventActive((prev) => !prev);
  };

  const handleExportJson = () => {
    const exportData = {
      app: 'KayBiT_WhatsApp Capstone Telemetry',
      generatedAt: new Date().toISOString(),
      aggregates: systemAggregates,
      history,
      nodes,
      recentLogs: logs.slice(0, 20),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kaybit_system_health_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to render sparkline SVG
  const renderSparkline = (data: number[], color: string, height = 36) => {
    if (!data.length) return null;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 160;

    const points = data
      .map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 8) - 4;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg className="w-full h-9 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {/* Fill Area */}
        <polygon
          points={`0,${height} ${points} ${width},${height}`}
          fill={`url(#grad-${color.replace('#', '')})`}
        />
        {/* Line */}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div id="system-health-dashboard" className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Dashboard Top Header & Control Center */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-sky-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Real-Time System Health & Telemetry
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
                      systemAggregates.degradedCount === 0
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        systemAggregates.degradedCount === 0
                          ? 'bg-emerald-400 animate-ping'
                          : 'bg-amber-400 animate-pulse'
                      }`}
                    />
                    {systemAggregates.degradedCount === 0
                      ? '5/5 TRACKS OPERATIONAL (99.999% SLA)'
                      : `${systemAggregates.degradedCount} NODES DEGRADED`}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live latency probes, message throughput vectors, and distributed node availability across all 20 language runtimes.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Play/Pause Toggle */}
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                isRunning
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
              }`}
            >
              {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isRunning ? 'Pause Telemetry' : 'Resume Live'}</span>
            </button>

            {/* Traffic Profile Selector */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => {
                  setTrafficProfile('normal');
                  setChaosEventActive(false);
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  trafficProfile === 'normal'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Normal (320k/s)
              </button>
              <button
                onClick={() => {
                  setTrafficProfile('peak');
                  setChaosEventActive(false);
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  trafficProfile === 'peak'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Peak Rush (1.2M/s)
              </button>
              <button
                onClick={() => {
                  setTrafficProfile('media_burst');
                  setChaosEventActive(false);
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  trafficProfile === 'media_burst'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Media Burst
              </button>
            </div>

            {/* Chaos Simulator Trigger */}
            <button
              onClick={handleToggleChaos}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 border cursor-pointer ${
                chaosEventActive
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-md shadow-rose-950 animate-pulse'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Inject Chaos Monkey network partition and observe Raft rebalancing"
            >
              <Flame className={`w-3.5 h-3.5 ${chaosEventActive ? 'text-rose-400' : 'text-slate-400'}`} />
              <span>{chaosEventActive ? 'Chaos Active' : 'Inject Chaos'}</span>
            </button>

            {/* 10s Surge Spike */}
            <button
              onClick={handleTriggerSurge}
              disabled={surgeTimeRemaining > 0}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                surgeTimeRemaining > 0
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${surgeTimeRemaining > 0 ? 'text-amber-400 animate-spin' : 'text-slate-400'}`} />
              <span>{surgeTimeRemaining > 0 ? `Surging (${surgeTimeRemaining}s)` : '10s Flash Surge'}</span>
            </button>

            {/* Export Telemetry */}
            <button
              onClick={handleExportJson}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
              title="Export Health & Telemetry Metrics JSON"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Global Vital Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Throughput */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Total Ingress Throughput
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Zap className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">
              {(systemAggregates.currentThroughput / 1000).toFixed(1)}k
            </span>
            <span className="text-xs text-slate-400">msgs / sec</span>
          </div>
          <div className="mt-3">
            {renderSparkline(history.throughput, '#10b981')}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Peak: 1.45M msgs/s</span>
            <span className="text-emerald-400 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +12.4% vs baseline
            </span>
          </div>
        </div>

        {/* Card 2: P99 Latency */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              P99 End-to-End Latency
            </span>
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">
              {systemAggregates.p99Latency.toFixed(2)}
            </span>
            <span className="text-xs text-slate-400">ms (P99 Target &lt; 5.0ms)</span>
          </div>
          <div className="mt-3">
            {renderSparkline(history.latencyP99, '#0ea5e9')}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>P50: 0.82ms</span>
            <span className="text-sky-400 flex items-center gap-0.5">
              <ShieldCheck className="w-3 h-3" /> Within SLA Budget
            </span>
          </div>
        </div>

        {/* Card 3: Active Sockets */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Active TCP / Epoll Sockets
            </span>
            <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Radio className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white font-mono">
              {(systemAggregates.totalSockets / 1000000).toFixed(2)}M
            </span>
            <span className="text-xs text-slate-400">Concurrent Conns</span>
          </div>
          <div className="mt-3">
            {renderSparkline(history.activeConns, '#a855f7')}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>Go Epoll + Netty</span>
            <span className="text-purple-400">Zero Socket Starvation</span>
          </div>
        </div>

        {/* Card 4: Cluster Availability */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Cluster Availability SLA
            </span>
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {systemAggregates.availabilityPercent}%
            </span>
            <span className="text-xs text-slate-400">Five Nines SLA</span>
          </div>
          <div className="mt-3">
            {renderSparkline(history.errorRate.map((e) => 1 - e), '#10b981')}
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
            <span>
              {systemAggregates.healthyNodesCount}/{systemAggregates.totalNodes} Nodes Healthy
            </span>
            <span className="text-emerald-400">Error Budget: 99.8%</span>
          </div>
        </div>
      </div>

      {/* 3. 5-Track Real-time Breakdown Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Real-Time Track Health Matrix (5 Engineering Tracks)</span>
          </h3>
          <span className="text-xs text-slate-500">
            Click any track card to inspect architecture responsibilities
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {ENGINEERING_TRACKS.map((track) => {
            const data = trackMetrics[track.id];
            if (!data) return null;

            return (
              <div
                key={track.id}
                onClick={() => onSelectTrack && onSelectTrack(track.id)}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all hover:shadow-xl cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-950 text-slate-300 border border-slate-800">
                      {track.badge}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        data.status === 'healthy'
                          ? 'bg-emerald-400 animate-pulse'
                          : data.status === 'warning'
                          ? 'bg-amber-400'
                          : 'bg-rose-400 animate-ping'
                      }`}
                    />
                  </div>

                  <h4 className="text-xs font-bold text-slate-100 mt-2.5 group-hover:text-emerald-400 transition-colors line-clamp-1">
                    {track.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {track.subtitle}
                  </p>

                  {/* Languages in Track */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {track.languages.map((l) => (
                      <span
                        key={l.id}
                        className="text-[9px] px-1.5 py-0.5 rounded bg-slate-950/80 text-slate-400 border border-slate-800/80 font-mono"
                      >
                        {l.name.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Avg Latency:</span>
                    <span className="font-mono font-bold text-sky-400">
                      {data.avgLatency}ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Throughput:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {(data.totalQps / 1000).toFixed(0)}k/s
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Avg CPU Load:</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            data.avgCpu > 75 ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                          style={{ width: `${data.avgCpu}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-slate-300">
                        {data.avgCpu}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Interactive Node Grid & Live Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: 20-Node Interactive Matrix (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Server className="w-4 h-4 text-sky-400" />
                <span>Microservice Node Availability Matrix (20 Runtimes)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Click any active runtime node to inspect its live socket metrics, CPU load, and thread diagnostics.
              </p>
            </div>

            {/* Filter by Track */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSelectedTrackFilter('all')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
                  selectedTrackFilter === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All (20)
              </button>
              {ENGINEERING_TRACKS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTrackFilter(t.id)}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
                    selectedTrackFilter === t.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t.badge}
                </button>
              ))}
            </div>
          </div>

          {/* Node Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[480px] overflow-y-auto pr-1 no-scrollbar">
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500/80 shadow-lg ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/60 hover:bg-slate-800/40 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-100 truncate">
                          {node.name}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            node.status === 'healthy'
                              ? 'bg-emerald-400'
                              : node.status === 'warning'
                              ? 'bg-amber-400'
                              : 'bg-rose-400 animate-pulse'
                          }`}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {node.role}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                      {node.language}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono">
                    <div>
                      <span className="text-slate-500 block">Latency</span>
                      <span className="text-sky-400 font-bold">{node.latencyMs}ms</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">QPS</span>
                      <span className="text-emerald-400 font-bold">{(node.qps / 1000).toFixed(0)}k/s</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">CPU</span>
                      <span className={node.cpu > 70 ? 'text-amber-400 font-bold' : 'text-slate-300 font-bold'}>
                        {node.cpu}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Node Deep-Dive Inspector or Live Log Stream */}
        <div className="space-y-4">
          {/* Node Inspector Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Node Telemetry Inspector</span>
              </h4>
              {selectedNode && (
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-[11px] text-slate-400 hover:text-slate-200"
                >
                  Clear Selection
                </button>
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-white font-mono">
                      {selectedNode.name}
                    </h5>
                    <p className="text-xs text-slate-400">{selectedNode.role}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    {selectedNode.status.toUpperCase()}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Language:</span>
                    <span className="text-slate-200">{selectedNode.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Track:</span>
                    <span className="text-slate-200 uppercase">{selectedNode.trackId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Active Sockets:</span>
                    <span className="text-purple-400 font-bold">
                      {selectedNode.activeSockets.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Current QPS:</span>
                    <span className="text-emerald-400 font-bold">
                      {selectedNode.qps.toLocaleString()} ops/s
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Probe Latency:</span>
                    <span className="text-sky-400 font-bold">{selectedNode.latencyMs} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Memory RSS:</span>
                    <span className="text-slate-300">{selectedNode.memory}% Allocated</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Historical Uptime:</span>
                    <span className="text-emerald-400">{selectedNode.uptime}</span>
                  </div>
                </div>

                {/* Direct Jump Action */}
                <button
                  onClick={() => {
                    const matchedTrack = ENGINEERING_TRACKS.find((t) => t.id === selectedNode.trackId);
                    const matchedLang = matchedTrack?.languages.find((l) =>
                      l.name.toLowerCase().includes(selectedNode.language.toLowerCase().split(' ')[0])
                    );
                    if (matchedLang && onSelectLanguage) {
                      onSelectLanguage(matchedLang);
                    }
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950"
                >
                  <span>Open {selectedNode.language} Code Workbench</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="py-6 text-center text-slate-500 space-y-1.5">
                <Server className="w-8 h-8 mx-auto text-slate-700" />
                <p className="text-xs text-slate-400 font-medium">Select a node from the matrix</p>
                <p className="text-[11px] text-slate-600">
                  Inspect process heap, sub-millisecond trace latency, and active connection limits.
                </p>
              </div>
            )}
          </div>

          {/* SLA Targets Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>SLA Target Verification</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">P99 Latency &lt; 5.0ms:</span>
                <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> {systemAggregates.p99Latency.toFixed(2)}ms (PASS)
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Zero Message Drop (RPO=0):</span>
                <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 100% Guaranteed
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Cassandra Replica Quorum:</span>
                <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 3/3 Synchronized
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">AVX2 Crypto Verification:</span>
                <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 100% Proven
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Live Telemetry Event Log Stream */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Sub-Millisecond Distributed Telemetry Event Stream
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[10px]">
              <button
                onClick={() => setLogFilter('all')}
                className={`px-2 py-0.5 rounded ${
                  logFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'
                }`}
              >
                All Logs
              </button>
              <button
                onClick={() => setLogFilter('metric')}
                className={`px-2 py-0.5 rounded ${
                  logFilter === 'metric' ? 'bg-slate-800 text-sky-300' : 'text-slate-400'
                }`}
              >
                Metrics
              </button>
              <button
                onClick={() => setLogFilter('warn')}
                className={`px-2 py-0.5 rounded ${
                  logFilter === 'warn' ? 'bg-slate-800 text-amber-300' : 'text-slate-400'
                }`}
              >
                Warnings
              </button>
            </div>

            <button
              onClick={() => {
                const text = logs.map((l) => `[${l.timestamp}] [${l.source}] ${l.message}`).join('\n');
                navigator.clipboard.writeText(text);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              }}
              className="px-2 py-1 text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-800 transition-colors flex items-center gap-1"
            >
              {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Download className="w-3 h-3" />}
              <span>{isCopied ? 'Copied' : 'Copy Logs'}</span>
            </button>
          </div>
        </div>

        <div className="max-h-56 overflow-y-auto space-y-1.5 text-xs no-scrollbar pr-1">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-2.5 py-1 px-2 rounded hover:bg-slate-900/60 transition-colors border-b border-slate-900/40"
            >
              <span className="text-slate-500 shrink-0 text-[11px]">{log.timestamp}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                  log.level === 'warn'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : log.level === 'metric'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {log.source}
              </span>
              <p className="text-slate-300 text-[11px] min-w-0 flex-1 leading-relaxed">
                {log.message}
              </p>
              {log.latency !== undefined && (
                <span className="text-emerald-400 font-bold shrink-0 text-[11px]">
                  {log.latency}ms
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
