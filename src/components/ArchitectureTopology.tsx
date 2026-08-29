import React, { useState } from 'react';
import { 
  GitFork, 
  Smartphone, 
  Network, 
  Server, 
  Database, 
  Terminal, 
  ArrowRight, 
  Radio, 
  Layers, 
  Activity,
  Zap,
  Lock,
  Cpu
} from 'lucide-react';
import { TrackId, ProgrammingLanguageInfo } from '../types';

interface ArchitectureTopologyProps {
  onSelectLanguageById: (langId: string) => void;
}

interface TopologyNode {
  id: string;
  langId: string;
  name: string;
  trackId: TrackId;
  role: string;
  tech: string;
  connections: string[];
  protocol: string;
  latencyTarget: string;
  status: 'active' | 'optimal';
}

export const ArchitectureTopology: React.FC<ArchitectureTopologyProps> = ({
  onSelectLanguageById,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-go-edge');

  const nodes: TopologyNode[] = [
    {
      id: 'node-flutter',
      langId: 'dart_flutter',
      name: 'Flutter UI Client',
      trackId: 'frontend',
      role: 'Cross-platform reactive UI & message cache',
      tech: 'Dart / Flutter / Impeller',
      connections: ['node-native-bridge', 'node-ts-crypto'],
      protocol: 'Reactive BLoC Streams',
      latencyTarget: '<8.3ms (120 FPS)',
      status: 'optimal',
    },
    {
      id: 'node-native-bridge',
      langId: 'kotlin_swift_native',
      name: 'Native HAL Bridge',
      trackId: 'frontend',
      role: 'CameraX/AVFoundation & Background WakeLocks',
      tech: 'Kotlin / Swift / NDK',
      connections: ['node-cpp-media'],
      protocol: 'MethodChannel IPC',
      latencyTarget: '<2.0ms',
      status: 'active',
    },
    {
      id: 'node-ts-crypto',
      langId: 'typescript_js_crypto',
      name: 'Signal Double Ratchet',
      trackId: 'frontend',
      role: 'End-to-end cryptographic state & key derivation',
      tech: 'TypeScript / WebCrypto',
      connections: ['node-rust-codec'],
      protocol: 'X3DH + AES-256-GCM',
      latencyTarget: '<3.5ms',
      status: 'optimal',
    },
    {
      id: 'node-rust-codec',
      langId: 'rust_packet_parser',
      name: 'Zero-Copy Codec',
      trackId: 'networking',
      role: 'Zero-allocation Protobuf & TLV binary framing',
      tech: 'Rust / SIMD / Nom',
      connections: ['node-go-edge'],
      protocol: 'Custom TLV / Protobuf v3',
      latencyTarget: '<0.15µs',
      status: 'optimal',
    },
    {
      id: 'node-go-edge',
      langId: 'go_edge_gateway',
      name: 'Edge Gateway Cluster',
      trackId: 'networking',
      role: '1M TCP/WebSocket connection manager & epoll loop',
      tech: 'Go (Golang) / Epoll',
      connections: ['node-java-identity', 'node-python-spam', 'node-scylla-ledger', 'node-kafka-bus'],
      protocol: 'WSS / TLS 1.3 / gRPC',
      latencyTarget: '<2.0ms',
      status: 'optimal',
    },
    {
      id: 'node-cpp-media',
      langId: 'c_cpp_media_streaming',
      name: 'WebRTC Media Engine',
      trackId: 'networking',
      role: 'Low-latency UDP/RTP streaming & jitter buffer',
      tech: 'C / C++ / SRTP / Opus',
      connections: ['node-csharp-transcoder'],
      protocol: 'RTP / RTCP / WebRTC',
      latencyTarget: '<18ms',
      status: 'active',
    },
    {
      id: 'node-java-identity',
      langId: 'java_scala_identity',
      name: 'Identity & Graph Service',
      trackId: 'backend',
      role: 'User authentication, social graph & ACL permissions',
      tech: 'Java (Spring) + Scala (Akka)',
      connections: ['node-postgres-acid'],
      protocol: 'gRPC / HTTP/2',
      latencyTarget: '<4.5ms',
      status: 'optimal',
    },
    {
      id: 'node-python-spam',
      langId: 'python_spam_moderation',
      name: 'AI Moderation Pipeline',
      trackId: 'backend',
      role: 'Spam BERT classification & bot anomaly scoring',
      tech: 'Python / FastAPI / Celery / ONNX',
      connections: ['node-ruby-admin'],
      protocol: 'REST / Celery Redis Broker',
      latencyTarget: '<8.5ms',
      status: 'optimal',
    },
    {
      id: 'node-csharp-transcoder',
      langId: 'csharp_media_transcoding',
      name: 'Media Transcoding Worker',
      trackId: 'backend',
      role: 'Async video compression & WebP thumbnails',
      tech: 'C# (.NET Core) / ImageSharp',
      connections: ['node-scylla-ledger'],
      protocol: 'S3 Multipart / Task Parallel',
      latencyTarget: '<80ms async',
      status: 'active',
    },
    {
      id: 'node-ruby-admin',
      langId: 'ruby_php_admin_console',
      name: 'Admin Web Console & Billing',
      trackId: 'backend',
      role: 'Trust & safety dashboard, moderation & Stripe billing',
      tech: 'Ruby (Rails) + PHP (Laravel)',
      connections: ['node-postgres-acid'],
      protocol: 'HTTPS / Webhooks',
      latencyTarget: '<30ms SSR',
      status: 'optimal',
    },
    {
      id: 'node-postgres-acid',
      langId: 'sql_postgresql',
      name: 'Relational Store (PostgreSQL)',
      trackId: 'data',
      role: 'Users, credentials, group memberships & ACID rules',
      tech: 'PostgreSQL 16 / PgBouncer',
      connections: ['node-cobol-legacy'],
      protocol: 'PostgreSQL Wire Protocol',
      latencyTarget: '<2.0ms',
      status: 'optimal',
    },
    {
      id: 'node-scylla-ledger',
      langId: 'nosql_cassandra_scylla',
      name: 'Distributed Message Ledger',
      trackId: 'data',
      role: 'Append-heavy time-series message storage (TWCS)',
      tech: 'ScyllaDB / Cassandra (C++ Seastar)',
      connections: ['node-r-telemetry'],
      protocol: 'CQL v4 (LOCAL_QUORUM)',
      latencyTarget: '<1.5ms',
      status: 'optimal',
    },
    {
      id: 'node-r-telemetry',
      langId: 'r_matlab_telemetry',
      name: 'Telemetry & Queuing Models',
      trackId: 'data',
      role: 'Erlang-C queue delay modeling & survival curves',
      tech: 'R / MATLAB Statistical Engines',
      connections: ['node-bash-infra'],
      protocol: 'Stochastic Simulation Scripts',
      latencyTarget: '<0.05s analysis',
      status: 'optimal',
    },
    {
      id: 'node-cobol-legacy',
      langId: 'cobol_assembly_legacy',
      name: 'Enterprise Mainframe & ASM',
      trackId: 'data',
      role: 'COBOL copybook verification & Assembly CRC32',
      tech: 'COBOL 85 + x86_64 Assembly',
      connections: [],
      protocol: 'EBCDIC Fixed-Width Records',
      latencyTarget: '3 cycles/byte',
      status: 'optimal',
    },
    {
      id: 'node-bash-infra',
      langId: 'bash_shell_provisioning',
      name: 'Linux Kernel & DevOps Host',
      trackId: 'devops',
      role: '1M socket sysctl kernel tuning & health probes',
      tech: 'Bash / Shell / systemd',
      connections: ['node-pwsh-cicd'],
      protocol: 'POSIX / sysctl.conf',
      latencyTarget: 'Continuous supervision',
      status: 'optimal',
    },
    {
      id: 'node-pwsh-cicd',
      langId: 'powershell_cicd_automation',
      name: 'CI/CD & Workstation Runner',
      trackId: 'devops',
      role: 'Multi-platform container matrix & test runner',
      tech: 'PowerShell Core 7+ / Docker',
      connections: [],
      protocol: 'GitHub Actions / Azure Pipelines',
      latencyTarget: '<4m full matrix build',
      status: 'optimal',
    },
  ];

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[4];

  const getTrackBadge = (trackId: TrackId) => {
    switch (trackId) {
      case 'frontend':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'networking':
        return 'bg-sky-500/10 text-sky-300 border-sky-500/20';
      case 'backend':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'data':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
      case 'devops':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Topology Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <GitFork className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              Distributed Microservices Topology Graph
            </h2>
            <p className="text-xs text-slate-400">
              Interactive system map connecting all 5 engineering tiers, 20 languages, and inter-service communication protocols
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Topology Node Visualizer (Left 8 cols) & Deep Dive Inspector (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800 text-slate-400">
            <span>Select any microservice node to inspect interface contracts</span>
            <span className="flex items-center gap-1 text-emerald-400 font-mono">
              <Activity className="w-3.5 h-3.5" /> 16 Service Nodes Active
            </span>
          </div>

          {/* Tier-by-Tier Node Grid */}
          <div className="space-y-6">
            {/* 1. Client & Presentation Tier */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                Tier 1: Client & Native Presentation Tier (Frontend Track)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {nodes.slice(0, 3).map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedNodeId === node.id
                        ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg ring-1 ring-emerald-500/30'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs">{node.name}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-300/80 block">{node.tech}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1 mt-1">{node.role}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Edge & Networking Tier */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">
                Tier 2: High-Throughput Edge & Real-Time Gateway (Networking Track)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {nodes.slice(3, 6).map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedNodeId === node.id
                        ? 'bg-sky-500/20 border-sky-500 text-white shadow-lg ring-1 ring-sky-500/30'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs">{node.name}</span>
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-mono text-sky-300/80 block">{node.tech}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1 mt-1">{node.role}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Microservices & Business Logic Tier */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                Tier 3: Distributed Microservices & Logic (Backend Track)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {nodes.slice(6, 10).map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedNodeId === node.id
                        ? 'bg-amber-500/20 border-amber-500 text-white shadow-lg ring-1 ring-amber-500/30'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs truncate">{node.name}</span>
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                    </div>
                    <span className="text-[10px] font-mono text-amber-300/80 block truncate">{node.tech}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1 mt-1">{node.role}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Data & Analytical Storage Tier */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">
                Tier 4: Storage Architecture & Analytical Modeling (Data Track)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {nodes.slice(10, 14).map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedNodeId === node.id
                        ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500/30'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs truncate">{node.name}</span>
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    </div>
                    <span className="text-[10px] font-mono text-indigo-300/80 block truncate">{node.tech}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1 mt-1">{node.role}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 5. DevOps & Automation Tier */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
                Tier 5: Infrastructure & Automation Tier (DevOps Track)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {nodes.slice(14, 16).map((node) => (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      selectedNodeId === node.id
                        ? 'bg-rose-500/20 border-rose-500 text-white shadow-lg ring-1 ring-rose-500/30'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs">{node.name}</span>
                      <span className="w-2 h-2 rounded-full bg-rose-400" />
                    </div>
                    <span className="text-[10px] font-mono text-rose-300/80 block">{node.tech}</span>
                    <span className="text-[10px] text-slate-400 line-clamp-1 mt-1">{node.role}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Node Deep Dive Inspector (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="pb-4 border-b border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getTrackBadge(selectedNode.trackId)}`}>
                  {selectedNode.trackId.toUpperCase()} TRACK
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Optimal
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100">{selectedNode.name}</h3>
              <p className="text-xs text-slate-400 font-mono">{selectedNode.tech}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">
                  Responsibility in Ecosystem
                </span>
                <p className="text-slate-300 leading-relaxed">{selectedNode.role}</p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Communication Protocol:</span>
                <span className="font-mono font-semibold text-sky-400 text-[11px]">
                  {selectedNode.protocol}
                </span>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Target Latency:</span>
                <span className="font-mono font-semibold text-emerald-400 text-[11px]">
                  {selectedNode.latencyTarget}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={() => onSelectLanguageById(selectedNode.langId)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Inspect Source Code in Lab</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
