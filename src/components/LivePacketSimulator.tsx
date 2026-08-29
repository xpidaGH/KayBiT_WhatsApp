import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Lock, 
  ShieldCheck, 
  Smartphone, 
  Network, 
  Server, 
  Database, 
  Terminal, 
  CheckCircle, 
  AlertTriangle, 
  Cpu, 
  Radio, 
  ArrowRight,
  Info,
  Clock,
  Zap,
  Activity
} from 'lucide-react';
import { PacketHop, TrackId } from '../types';

interface LivePacketSimulatorProps {
  onSelectLanguageById?: (langId: string) => void;
}

export const LivePacketSimulator: React.FC<LivePacketSimulatorProps> = ({
  onSelectLanguageById,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentHopIndex, setCurrentHopIndex] = useState<number>(0);
  const [messageType, setMessageType] = useState<'text' | 'media' | 'voice'>('text');
  const [networkProfile, setNetworkProfile] = useState<'5g' | '4g_lte' | 'high_loss' | 'offline'>('4g_lte');
  const [inputText, setInputText] = useState<string>('Hello! Let us review the distributed architecture today.');
  const [senderUser, setSenderUser] = useState<string>('Alice (Student Lead)');
  const [recipientUser, setRecipientUser] = useState<string>('Bob (Core Architect)');

  const getMultiplier = () => {
    switch (networkProfile) {
      case '5g':
        return 0.7;
      case 'high_loss':
        return 2.4;
      case 'offline':
        return 1.0;
      default:
        return 1.0;
    }
  };

  const mult = getMultiplier();

  const packetHops: PacketHop[] = [
    {
      id: 'hop-1',
      stepNumber: 1,
      trackId: 'frontend',
      serviceName: 'Mobile Client UI & BLoC Stream',
      language: 'Dart / Flutter',
      protocol: 'Reactive Stream / Impeller',
      action: 'Optimistic UI Message Render',
      payloadState: 'Plaintext in UI State',
      latencyMs: +(8.3 * mult).toFixed(2),
      details: {
        title: 'Flutter Impeller Widget Rendering',
        description:
          'The user types a message. Flutter creates a ChatMessageModel with optimistic status PENDING and renders it at 120 FPS without waiting for network ACK.',
        dataSnapshot: {
          clientUuid: `msg_${Math.random().toString(36).substr(2, 9)}`,
          conversationWith: recipientUser,
          content: inputText,
          fpsTarget: '120 Hz',
          renderedDurationMs: 4.2,
        },
      },
    },
    {
      id: 'hop-2',
      stepNumber: 2,
      trackId: 'frontend',
      serviceName: 'Native OS Platform Channel',
      language: 'Kotlin (Android) / Swift (iOS)',
      protocol: 'MethodChannel Binary IPC',
      action: 'Hardware WakeLock & Codec Acquired',
      payloadState: 'Raw Native Frame Buffer',
      latencyMs: +(1.2 * mult).toFixed(2),
      details: {
        title: 'Native Android WakeLock & Surface Interop',
        description:
          'Flutter invokes native platform channel. Android acquires a PARTIAL_WAKE_LOCK to prevent CPU sleep during background dispatch, and binds CameraX/Audio HAL.',
        dataSnapshot: {
          wakeLockStatus: 'PARTIAL_WAKE_LOCK_ACQUIRED',
          timeoutAllowedMs: 60000,
          hardwareCodec: 'NV12_MEDIA_CODEC_HEVC',
          osThreadPriority: 'THREAD_PRIORITY_URGENT_AUDIO',
        },
      },
    },
    {
      id: 'hop-3',
      stepNumber: 3,
      trackId: 'frontend',
      serviceName: 'Signal Double Ratchet Cryptographic Engine',
      language: 'TypeScript / JavaScript',
      protocol: 'Signal Protocol (X3DH + AES-256-GCM)',
      action: 'End-to-End Cryptographic Encryption',
      payloadState: 'Encrypted Ciphertext Envelope',
      latencyMs: +(3.2 * mult).toFixed(2),
      details: {
        title: 'Signal Double Ratchet Step & Key Derivation',
        description:
          'Advances the sending symmetric ratchet using HKDF-SHA256, generates a fresh Curve25519 ephemeral key, and encrypts payload with AES-256-GCM + 128-bit authentication tag.',
        securityState: 'Zero-Knowledge E2EE Guaranteed',
        dataSnapshot: {
          ephemeralPublicKey: '0x4F89A1B022C394...',
          nonceIV: '0x99A41C908871',
          ciphertext: btoa(inputText).substring(0, 36) + '== [ENCRYPTED]',
          ratchetStep: 17,
          forwardSecrecy: 'ENABLED',
        },
      },
    },
    {
      id: 'hop-4',
      stepNumber: 4,
      trackId: 'networking',
      serviceName: 'Zero-Copy Packet Serializer',
      language: 'Rust',
      protocol: 'Zero-Copy Protobuf / Custom TLV',
      action: 'Zero-Copy Binary Framing & Checksum',
      payloadState: 'Binary Framed Packet &[u8]',
      latencyMs: +(0.14 * mult).toFixed(2),
      details: {
        title: 'Rust Zero-Copy Serialization',
        description:
          'Parses and serializes the binary message into a contiguous byte buffer with magic header 0x4B42 and SIMD AVX2-accelerated CRC32 checksum with 0 heap allocations.',
        dataSnapshot: {
          magicHeader: '0x4B42 (KayBiT)',
          packetOpcode: '0x01 (CHAT_MESSAGE)',
          payloadBytes: inputText.length + 64,
          crc32Checksum: '0x88BC991A',
          heapAllocations: '0 bytes (Stack Borrowed)',
        },
      },
    },
    {
      id: 'hop-5',
      stepNumber: 5,
      trackId: 'networking',
      serviceName: 'High-Throughput Edge Gateway Cluster',
      language: 'Go (Golang)',
      protocol: 'WSS / TLS 1.3 / Epoll Loop',
      action: 'Socket Ingress & Connection State Verification',
      payloadState: 'TCP Stream Handshake Verified',
      latencyMs: +(1.8 * mult).toFixed(2),
      details: {
        title: 'Go Goroutine Edge Routing & Epoll Multiplexing',
        description:
          'Edge gateway node holds connection in epoll loop. Verifies sender JWT session token, resets heartbeat idle timer, and routes framed envelope to backend Kafka message broker.',
        dataSnapshot: {
          edgeNodeId: 'edge-cluster-eu-west-04',
          activeNodeConns: '984,210 active',
          tlsVersion: 'TLSv1.3 (ChaCha20-Poly1305)',
          routingHop: 'Forwarded to Kafka Cluster Topic: chat.inbound.v1',
        },
      },
    },
    {
      id: 'hop-6',
      stepNumber: 6,
      trackId: 'backend',
      serviceName: 'Distributed Identity Graph & ML Anti-Spam',
      language: 'Java (Spring) + Python (Celery ML)',
      protocol: 'gRPC / Akka Cluster & ONNX Runtime',
      action: 'Group ACL Evaluation & ML Spam Scoring',
      payloadState: 'Validated & Cleared for Delivery',
      latencyMs: +(7.5 * mult).toFixed(2),
      details: {
        title: 'Java Graph Permissions & Python AI Spam Evaluation',
        description:
          'Java Akka Actor verifies sender is not blocked and has write permissions in the recipient group. Concurrently, Python ML worker evaluates spam risk score (<0.02) in 6.8ms.',
        dataSnapshot: {
          graphTraversalLatency: '1.4ms',
          permissionStatus: 'PERMITTED_WRITER',
          mlSpamRiskScore: '0.014 (CLEARED)',
          moderationAction: 'ALLOW_DELIVERY',
        },
      },
    },
    {
      id: 'hop-7',
      stepNumber: 7,
      trackId: 'data',
      serviceName: 'Distributed Message Ledger & Relational Store',
      language: 'NoSQL (ScyllaDB) + SQL (PostgreSQL)',
      protocol: 'CQL v4 (TWCS) + PostgreSQL Wire',
      action: 'Append-Heavy Ledger Commit & Membership Update',
      payloadState: 'Durably Persisted on Disk (RF=3)',
      latencyMs: +(2.4 * mult).toFixed(2),
      details: {
        title: 'ScyllaDB High-Speed Append & Postgres Sync',
        description:
          'Encrypted ciphertext appended to ScyllaDB wide-column table with compound key ((conversation_id, epoch), timeuuid) under LOCAL_QUORUM consistency across 3 availability zones.',
        dataSnapshot: {
          keyspace: 'kaybit_messages',
          compactionStrategy: 'TimeWindowCompaction (TWCS)',
          consistencyLevel: 'LOCAL_QUORUM (2/3 ACKs)',
          postgresMetadataSync: 'COMMITTED (ACID)',
        },
      },
    },
    {
      id: 'hop-8',
      stepNumber: 8,
      trackId: 'networking',
      serviceName: 'WebRTC Media Streaming & Real-Time Push',
      language: 'C / C++ (Media) + C# (Transcoder)',
      protocol: 'SRTP / Opus Audio / APNs Push',
      action: 'Jitter Buffer Smoothing & Recipient Delivery',
      payloadState: 'Decrypted by Recipient Client',
      latencyMs: +(2.8 * mult).toFixed(2),
      details: {
        title: 'C++ Jitter Buffer Playback & Push Notification',
        description:
          'If active, packet dispatched to recipient WebSocket socket. If backgrounded, silent high-priority Apple Push Notification (APNs) / Firebase Cloud Messaging (FCM) is triggered.',
        dataSnapshot: {
          recipientSocketState: 'CONNECTED_ACTIVE',
          audioJitterBufferMOS: '4.38 (High Fidelity)',
          deliveryReceiptEmitted: 'DELIVERY_STATUS_DELIVERED',
        },
      },
    },
    {
      id: 'hop-9',
      stepNumber: 9,
      trackId: 'devops',
      serviceName: 'Infrastructure Telemetry & Health Probe',
      language: 'Bash / Shell + R / MATLAB',
      protocol: 'Prometheus Metrics / Erlang-C Models',
      action: 'Real-Time QoS Telemetry & Latency Accounting',
      payloadState: 'End-to-End Delivery Confirmed',
      latencyMs: +(0.5 * mult).toFixed(2),
      details: {
        title: 'DevOps Latency Accounting & Erlang-C QoS Validation',
        description:
          'Prometheus exporter registers the full end-to-end trip time. R mathematical model updates the CDF survival distribution curve for SLA compliance.',
        dataSnapshot: {
          totalEndToEndMs: (26.34 * mult).toFixed(2),
          p99SlaCompliant: 'TRUE (<50ms limit)',
          healthStatus: 'HEALTH_OK (All 5 Tracks Green)',
        },
      },
    },
  ];

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentHopIndex < packetHops.length - 1) {
          setCurrentHopIndex((prev) => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, 1200);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentHopIndex, packetHops.length]);

  const currentHop = packetHops[currentHopIndex];
  const totalElapsedLatency = packetHops
    .slice(0, currentHopIndex + 1)
    .reduce((acc, curr) => acc + curr.latencyMs, 0);

  const getTrackColor = (trackId: TrackId) => {
    switch (trackId) {
      case 'frontend':
        return 'emerald';
      case 'networking':
        return 'sky';
      case 'backend':
        return 'amber';
      case 'data':
        return 'indigo';
      case 'devops':
        return 'rose';
    }
  };

  const getTrackIcon = (trackId: TrackId) => {
    switch (trackId) {
      case 'frontend':
        return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'networking':
        return <Network className="w-4 h-4 text-sky-400" />;
      case 'backend':
        return <Server className="w-4 h-4 text-amber-400" />;
      case 'data':
        return <Database className="w-4 h-4 text-indigo-400" />;
      case 'devops':
        return <Terminal className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Controls Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Radio className="w-5 h-5 animate-pulse" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-100">
                  End-to-End Packet Flow Simulator
                </h2>
                <p className="text-xs text-slate-400">
                  Trace how an encrypted message travels through all 5 tracks and 20 language microservices
                </p>
              </div>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center gap-3">
            <button
              id="btn-play-pause-sim"
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                isPlaying
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause Simulation' : 'Auto Play Packet'}</span>
            </button>

            <button
              id="btn-step-forward"
              onClick={() => {
                setIsPlaying(false);
                if (currentHopIndex < packetHops.length - 1) {
                  setCurrentHopIndex((prev) => prev + 1);
                }
              }}
              disabled={currentHopIndex >= packetHops.length - 1}
              className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-xl text-slate-200 border border-slate-700 text-xs transition-all"
              title="Next Hop"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              id="btn-reset-sim"
              onClick={() => {
                setIsPlaying(false);
                setCurrentHopIndex(0);
              }}
              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-200 border border-slate-700 text-xs transition-all"
              title="Restart from Step 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Input Parameters Config */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Message Payload Type</label>
            <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              {(['text', 'media', 'voice'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setMessageType(t);
                    setCurrentHopIndex(0);
                  }}
                  className={`py-1.5 rounded-lg font-semibold uppercase text-[10px] transition-all ${
                    messageType === t
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Network Profile</label>
            <select
              value={networkProfile}
              onChange={(e) => {
                setNetworkProfile(e.target.value as any);
                setCurrentHopIndex(0);
              }}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="5g">5G Ultra-Low Latency (0.7x)</option>
              <option value="4g_lte">4G LTE Standard (1.0x)</option>
              <option value="high_loss">3G Network with Jitter (2.4x)</option>
              <option value="offline">Simulated Offline Outbox</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Sender & Recipient</label>
            <input
              type="text"
              value={senderUser}
              onChange={(e) => setSenderUser(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs font-medium"
              placeholder="Sender"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1.5">Message Content</label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 text-xs font-medium"
              placeholder="Enter message text"
            />
          </div>
        </div>
      </div>

      {/* Progress Stepper Line */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center min-w-[760px] justify-between relative px-2">
          {/* Connector Line */}
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 z-0" />
          <div
            className="absolute left-8 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 transition-all duration-500 z-0"
            style={{
              width: `${(currentHopIndex / (packetHops.length - 1)) * 92}%`,
            }}
          />

          {packetHops.map((hop, idx) => {
            const isPassed = idx < currentHopIndex;
            const isCurrent = idx === currentHopIndex;
            return (
              <button
                key={hop.id}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentHopIndex(idx);
                }}
                className={`relative z-10 flex flex-col items-center group cursor-pointer transition-transform ${
                  isCurrent ? 'scale-110' : ''
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                    isCurrent
                      ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20 font-black'
                      : isPassed
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-950 text-slate-500 border border-slate-800'
                  }`}
                >
                  {isPassed ? <CheckCircle className="w-4 h-4" /> : `0${hop.stepNumber}`}
                </div>
                <span className="text-[10px] font-mono text-slate-400 mt-2 font-semibold truncate max-w-[80px] text-center">
                  {hop.language.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Inspection Grid (Current Hop vs Live State) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Hop Deep-Dive */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                {getTrackIcon(currentHop.trackId)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                    Hop 0{currentHop.stepNumber} of 0{packetHops.length}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {currentHop.protocol}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100">{currentHop.serviceName}</h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-mono">Hop Latency</span>
                <span className="text-sm font-bold font-mono text-emerald-400">
                  +{currentHop.latencyMs} ms
                </span>
              </div>
            </div>
          </div>

          {/* Hop Description & Technical Action */}
          <div className="space-y-3">
            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">
                  {currentHop.details.title}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-semibold">
                  Language: {currentHop.language}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentHop.details.description}
              </p>
            </div>
          </div>

          {/* Live Data Snapshot / Memory Inspector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-sky-400" />
                <span>Microservice Memory & Payload State Inspector</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Payload State: <strong className="text-slate-200">{currentHop.payloadState}</strong>
              </span>
            </div>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
              <pre className="text-emerald-400/90 leading-relaxed">
                {JSON.stringify(currentHop.details.dataSnapshot, null, 2)}
              </pre>
            </div>
          </div>

          {/* Quick jump to code button */}
          {onSelectLanguageById && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  const langId =
                    currentHop.language.toLowerCase().includes('flutter')
                      ? 'dart_flutter'
                      : currentHop.language.toLowerCase().includes('kotlin')
                      ? 'kotlin_swift_native'
                      : currentHop.language.toLowerCase().includes('typescript')
                      ? 'typescript_js_crypto'
                      : currentHop.language.toLowerCase().includes('rust')
                      ? 'rust_packet_parser'
                      : currentHop.language.toLowerCase().includes('go')
                      ? 'go_edge_gateway'
                      : currentHop.language.toLowerCase().includes('python')
                      ? 'python_spam_moderation'
                      : currentHop.language.toLowerCase().includes('scylla')
                      ? 'nosql_cassandra_scylla'
                      : currentHop.language.toLowerCase().includes('c++')
                      ? 'c_cpp_media_streaming'
                      : 'bash_shell_provisioning';
                  onSelectLanguageById(langId);
                }}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1.5"
              >
                <span>Inspect {currentHop.language} Source Code in Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right 1 Col: Cumulative Pipeline Metrics & Security Envelope */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Cumulative Pipeline Telemetry</span>
            </h3>

            {/* Total Latency Meter */}
            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Ingress-to-Delivery:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {totalElapsedLatency.toFixed(2)} ms
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, (totalElapsedLatency / 35) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 block text-right font-mono">
                Target SLA: &lt; 50.0 ms (P99)
              </span>
            </div>

            {/* Security Guarantee Card */}
            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">Zero-Knowledge Security</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Neither the Go Edge Gateway, the Kafka broker, nor the ScyllaDB ledger ever sees plaintext message content. Keys remain exclusively on client device RAM.
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Algorithm:</span>
                <span className="text-emerald-300 font-semibold">AES-256-GCM + X3DH</span>
              </div>
            </div>

            {/* Hop Breakdown Mini List */}
            <div className="space-y-1.5 max-h-[160px] overflow-y-auto no-scrollbar pt-2">
              {packetHops.map((h, i) => (
                <div
                  key={h.id}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentHopIndex(i);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] flex items-center justify-between cursor-pointer transition-all ${
                    i === currentHopIndex
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : i < currentHopIndex
                      ? 'text-slate-300 hover:bg-slate-800/60'
                      : 'text-slate-500'
                  }`}
                >
                  <span className="truncate max-w-[140px]">
                    0{h.stepNumber}. {h.language.split(' ')[0]}
                  </span>
                  <span className="font-mono text-[10px]">+{h.latencyMs}ms</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Click any hop in the top timeline or list to inspect its intermediate state.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
