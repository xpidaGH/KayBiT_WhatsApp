import React, { useState } from 'react';
import { 
  Layers, 
  Smartphone, 
  Network, 
  Server, 
  Database, 
  Terminal, 
  ArrowRight, 
  ArrowDown, 
  Play, 
  Sparkles, 
  Cpu, 
  Lock, 
  CheckCircle2, 
  Activity, 
  Radio, 
  Zap, 
  FileCode, 
  HardDrive, 
  Code2, 
  ShieldCheck, 
  Check, 
  Copy,
  ExternalLink
} from 'lucide-react';

interface IntegrationArchitectureViewerProps {
  onNavigateToCode?: (languageId: string) => void;
  onAskAiWithContext?: (contextText: string) => void;
}

export const IntegrationArchitectureViewer: React.FC<IntegrationArchitectureViewerProps> = ({
  onNavigateToCode,
  onAskAiWithContext,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-flutter');
  const [simulationRunning, setSimulationRunning] = useState<boolean>(false);
  const [activeSimStep, setActiveSimStep] = useState<number | null>(null);
  const [simScenario, setSimScenario] = useState<'text_message' | 'media_upload' | 'auth_login'>('text_message');
  const [viewMode, setViewMode] = useState<'interactive' | 'ascii'>('interactive');
  const [copiedAscii, setCopiedAscii] = useState<boolean>(false);

  const rawAsciiDiagram = `
                 +---------------------------------------+
                 |       Flutter Mobile Client           |
                 |  (Dart UI / Native Kotlin & Swift)    |
                 +-------------------+-------------------+
                                     |
                         gRPC / WebSockets / UDP
                                     |
                                     v
                 +-------------------+-------------------+
                 |    Go / Rust Gateway & Edge Nodes     |
                 +-------+-----------------------+-------+
                         |                       |
                Internal RPC (gRPC)         Message Queue
                         |                       |
                         v                       v
        +----------------+----------------+    +-+------------------------------+
        |   Distributed Microservices     |    | | Asynchronous Processors      |
        |  (Java, C#, Ruby, PHP, Python)  |    | | (C# Transcoding / Python ML) |
        +--------+---------------+--------+    +-+--------------+---------------+
                 |               |                              |
               Reads           Writes                         Writes
                 |               |                              |
                 v               v                              v
        +--------+----+ +--------+--------+            +--------+-------+
        | PostgreSQL  | | Cassandra NoSQL |            | Object Storage |
        | (SQL Auth)  | | (Chat History)  |            | (Media Files)  |
        +-------------+ +-----------------+            +----------------+
  `.trim();

  // Tier specifications and details
  const nodeDetails: Record<string, {
    title: string;
    tier: string;
    languages: string[];
    primaryLangId: string;
    protocol: string;
    role: string;
    responsibilities: string[];
    codePreview: string;
    metrics: { label: string; value: string }[];
  }> = {
    'node-flutter': {
      title: 'Flutter Mobile Client',
      tier: 'Client Tier (Mobile UI & Hardware Bridge)',
      languages: ['Dart (Flutter UI / BLoC)', 'Kotlin (Android Camera2/HAL)', 'Swift (iOS AVFoundation/ARC)', 'C (Libsodium Ratchet)'],
      primaryLangId: 'dart_flutter',
      protocol: 'Reactive Streams & Signal Double Ratchet',
      role: 'Cross-platform mobile client delivering 120 FPS UI, local SQLite caching, and end-to-end cryptographic state.',
      responsibilities: [
        'Render reactive chat UI and optimistic local message state in Dart BLoC',
        'Direct hardware audio/camera access via Kotlin Camera2 and Swift AVFoundation',
        'Derive ephemeral Curve25519 session keys and sign payloads with C Libsodium ratchet',
        'Maintain offline SQLite database cache for instant chat launch',
      ],
      codePreview: `// Dart BLoC State Handler
class ChatBloc extends Bloc<ChatEvent, ChatState> {
  final SignalRatchetService crypto;
  final WebSocketClient gateway;

  Future<void> onSendMessage(SendMessageEvent event) async {
    final encrypted = await crypto.encrypt(event.text);
    gateway.sendBinary(encrypted.toProtobufBytes());
    emit(MessageOptimisticallyAdded(event.toLocal()));
  }
}`,
      metrics: [
        { label: 'UI Frame Budget', value: '< 8.3ms (120 FPS)' },
        { label: 'Local Encryption Latency', value: '0.8ms (Curve25519)' },
        { label: 'Memory Footprint', value: '42 MB RSS' },
      ],
    },
    'node-transport': {
      title: 'Transport Layer (gRPC / WebSockets / UDP)',
      tier: 'Networking & Ingress Wire Protocol',
      languages: ['Go (Epoll WebSockets)', 'Rust (Zero-Copy Parser)', 'C++ (WebRTC UDP)'],
      primaryLangId: 'go_edge',
      protocol: 'gRPC / TLS 1.3 WebSockets / WebRTC RTP UDP',
      role: 'Bidirectional streaming transport multiplexing text messages, media upload streams, and low-latency audio/video calls.',
      responsibilities: [
        'Establish persistent TLS 1.3 WebSocket connections with 0-RTT resumption',
        'Stream real-time WebRTC audio (Opus 48kHz) and video (VP9) packets over UDP jitter buffers',
        'gRPC binary channel multiplexing for internal microservice control planes',
      ],
      codePreview: `// Go Epoll Transport Handler
func (g *EdgeGateway) HandleConnection(fd int) {
  conn := epoll.Accept(fd)
  go func() {
    for frame := range conn.ReadWebSocketFrames() {
      rustParser.DecodeProtobufZeroCopy(frame.Payload)
    }
  }()
}`,
      metrics: [
        { label: 'Handshake Time', value: '< 1.5ms TLS 1.3' },
        { label: 'UDP Jitter Target', value: '< 15ms' },
        { label: 'Connection Capacity', value: '1M Active Conns' },
      ],
    },
    'node-gateway': {
      title: 'Go / Rust Gateway & Edge Nodes',
      tier: 'Edge Ingress & Framing Layer',
      languages: ['Go (Golang)', 'Rust (Nom / SIMD)'],
      primaryLangId: 'rust_codec',
      protocol: 'Custom Binary Protobuf v3 Framing',
      role: 'High-throughput ingress cluster managing 1M concurrent client sockets and parsing Protobuf frames with zero memory allocations.',
      responsibilities: [
        'Maintain Go epoll event loop scaling over millions of long-lived socket connections',
        'Rust zero-copy parsing of binary frame headers in 0.12µs without heap allocations',
        'Authenticate incoming JWT tokens and demux packets into internal gRPC streams vs. Message Queues',
      ],
      codePreview: `// Rust Zero-Copy Nom Parser
#[inline(always)]
pub fn parse_frame<'a>(input: &'a [u8]) -> IResult<&'a [u8], WireHeader<'a>> {
  let (rem, magic) = tag(b"KAYBIT")(input)?;
  let (rem, (msg_type, payload_len)) = tuple((be_u16, be_u32))(rem)?;
  let (rem, payload) = take(payload_len)(rem)?;
  Ok((rem, WireHeader { msg_type, payload }))
}`,
      metrics: [
        { label: 'Parse Time', value: '0.12 µs / packet' },
        { label: 'CPU Overhead', value: '< 12% @ 100k msg/s' },
        { label: 'Allocations', value: '0 Heap Allocations' },
      ],
    },
    'node-microservices': {
      title: 'Distributed Microservices',
      tier: 'Core Business Logic Tier',
      languages: ['Java (gRPC Netty / Loom)', 'C# (Services)', 'Ruby (OAuth2)', 'PHP (Admin)', 'Python (APIs)'],
      primaryLangId: 'java_grpc',
      protocol: 'Internal gRPC & Akka Cluster Messaging',
      role: 'Synchronous microservice fleet handling user presence, group memberships, OAuth2 tokens, and relational consistency.',
      responsibilities: [
        'Java Netty gRPC services track user presence, typing indicators, and session states',
        'Ruby OAuth2 service validates JWT tokens and client cryptographic credentials',
        'Coordinate ACID transactions for user registration, blocks, and privacy settings',
      ],
      codePreview: `// Java gRPC Presence Service
@GrpcService
public class PresenceServiceImpl extends PresenceServiceGrpc.PresenceServiceImplBase {
  @Override
  public void reportHeartbeat(HeartbeatRequest req, StreamObserver<Ack> response) {
    redisCluster.setex("user:" + req.getUserId() + ":online", 60, "true");
    response.onNext(Ack.newBuilder().setStatus(OK).build());
    response.onCompleted();
  }
}`,
      metrics: [
        { label: 'gRPC Internal Latency', value: '< 1.2ms' },
        { label: 'GC Pause', value: '0.0ms (Java ZGC)' },
        { label: 'Throughput', value: '250k RPS / Node' },
      ],
    },
    'node-async': {
      title: 'Asynchronous Processors',
      tier: 'Worker & Machine Learning Tier',
      languages: ['C# (.NET FFmpeg Worker)', 'Python (PyTorch RoBERTa ML)'],
      primaryLangId: 'csharp_media',
      protocol: 'RabbitMQ / Kafka Streaming Consumers',
      role: 'Decoupled asynchronous worker fleet for media transcoding, video chunking, and AI anti-spam NLP classification.',
      responsibilities: [
        'C# .NET worker consumes raw media from RabbitMQ, executing zero-allocation FFmpeg Opus/H.265 transcoding',
        'Python RoBERTa ML model performs real-time spam and phishing detection in 8.2ms',
        'Upload transcoded media streams into S3/MinIO Object Storage',
      ],
      codePreview: `// C# FFmpeg Transcoding Worker
public async Task ProcessMediaChunkAsync(ReadOnlyMemory<byte> rawVideo) {
  using var scope = _arrayPool.Rent(rawVideo.Length);
  var transcoded = await _ffmpeg.TranscodeToH265ChunkAsync(scope.Memory);
  await _s3Storage.PutObjectAsync("media-bucket", transcoded);
}`,
      metrics: [
        { label: 'Video Chunk Transcode', value: '140ms / 4K segment' },
        { label: 'ML Inference Latency', value: '8.2ms (PyTorch RoBERTa)' },
        { label: 'Queue Backlog', value: '0.0ms delay' },
      ],
    },
    'node-postgres': {
      title: 'PostgreSQL (SQL Auth & User Directory)',
      tier: 'Relational ACID Storage',
      languages: ['PostgreSQL (SQL / PL/pgSQL)'],
      primaryLangId: 'postgresql_sql',
      protocol: 'PostgreSQL Wire Protocol (Port 5432)',
      role: 'ACID-compliant relational store holding user identities, password hashes, contact books, and privacy configurations.',
      responsibilities: [
        'Store user accounts, hashed credentials, and X3DH pre-key encryption identity records',
        'Execute relational queries for contact discovery and friend recommendations',
        'Guarantee ACID isolation for session token revocations and privacy blocklists',
      ],
      codePreview: `-- PostgreSQL Schema for E2EE Identity
CREATE TABLE user_e2ee_keys (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  identity_key BYTEA NOT NULL,
  signed_prekey BYTEA NOT NULL,
  prekey_signature BYTEA NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`,
      metrics: [
        { label: 'ACID Query Latency', value: '0.8ms' },
        { label: 'Connection Pooling', value: 'PgBouncer 500 conns' },
        { label: 'Replication Lag', value: '< 2.0ms' },
      ],
    },
    'node-cassandra': {
      title: 'Cassandra NoSQL (Chat History)',
      tier: 'Distributed Wide-Column Storage',
      languages: ['ScyllaDB / Apache Cassandra (CQL)'],
      primaryLangId: 'scylladb_cql',
      protocol: 'Native CQL Binary Protocol (Port 9042)',
      role: 'Horizontally scalable, masterless distributed ledger optimized for ultra-high write throughput of time-series messages.',
      responsibilities: [
        'Store billions of encrypted chat messages partitioned by chat_id and sorted by timestamp',
        'Deliver sub-2ms write latency with LSM SSTables and Write-Ahead Logging (WAL)',
        'Zero single point of failure with masterless ring sharding and multi-datacenter replication',
      ],
      codePreview: `-- Cassandra Message Ledger Schema
CREATE TABLE chat_messages (
  chat_id UUID,
  bucket_date DATE,
  message_id TIMEUUID,
  sender_id UUID,
  encrypted_payload BLOB,
  ratchet_key_id TEXT,
  PRIMARY KEY ((chat_id, bucket_date), message_id)
) WITH CLUSTERING ORDER BY (message_id DESC);`,
      metrics: [
        { label: 'Write Latency (P99)', value: '1.8ms (LSM SSTable)' },
        { label: 'Write IOPS', value: '150,000 IOPS' },
        { label: 'Replication Factor', value: '3 (Local Quorum)' },
      ],
    },
    'node-s3': {
      title: 'Object Storage (Media Files)',
      tier: 'Encrypted Blob Storage',
      languages: ['MinIO / AWS S3 Compatible Object Storage'],
      primaryLangId: 'csharp_media',
      protocol: 'HTTPS REST S3 API',
      role: 'Scalable cloud object storage storing encrypted photos, voice notes, video segments, and documents.',
      responsibilities: [
        'Store immutable encrypted media blobs referenced by Cassandra chat message pointers',
        'Support HTTP range requests for instant video and voice note seeking',
        'Direct pre-signed URL uploads bypassing intermediate application servers',
      ],
      codePreview: `// MinIO / S3 Media Put Object
PUT /kaybit-media-blobs/voice_notes/2026/08/voice_9918.opus HTTP/1.1
Host: s3.kaybit.internal
Content-Type: audio/opus
x-amz-server-side-encryption: AES256
Content-Length: 421900`,
      metrics: [
        { label: 'Blob Upload Latency', value: '12ms' },
        { label: 'Availability', value: '99.999999999%' },
        { label: 'Bandwidth', value: '10 Gbps Edge Uplink' },
      ],
    },
  };

  const selectedData = nodeDetails[selectedNodeId] || nodeDetails['node-flutter'];

  // Run full simulation through the diagram
  const handleRunSimulation = () => {
    setSimulationRunning(true);
    setActiveSimStep(1); // Flutter

    setTimeout(() => {
      setActiveSimStep(2); // Transport
      setTimeout(() => {
        setActiveSimStep(3); // Go / Rust Gateway
        setTimeout(() => {
          setActiveSimStep(4); // Internal RPC / Async Processor
          setTimeout(() => {
            setActiveSimStep(5); // Storage Tier (Postgres / Cassandra / S3)
            setTimeout(() => {
              setActiveSimStep(null);
              setSimulationRunning(false);
            }, 800);
          }, 600);
        }, 500);
      }, 500);
    }, 400);
  };

  const handleCopyAscii = () => {
    navigator.clipboard.writeText(rawAsciiDiagram);
    setCopiedAscii(true);
    setTimeout(() => setCopiedAscii(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Header */}
      <div 
        id="integration-diagram-banner"
        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                KayBiT_WhatsApp Integration Architecture
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                Official Blueprint
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive 5-tier distributed messaging architecture connecting Flutter down to Go/Rust, Java/C#, and Cassandra/S3.
            </p>
          </div>
        </div>

        {/* View Switcher & Test Trigger */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'interactive'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Interactive Topology
            </button>
            <button
              onClick={() => setViewMode('ascii')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'ascii'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ASCII Blueprint
            </button>
          </div>

          <button
            id="btn-run-diagram-simulation"
            onClick={handleRunSimulation}
            disabled={simulationRunning}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{simulationRunning ? 'Simulating Trace...' : 'Simulate Packet Flow'}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          Main Architecture Grid: Diagram (7 cols) + Selected Node Inspector (5 cols)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: The Interactive Diagram */}
        <div className="lg:col-span-7 space-y-4">
          {viewMode === 'ascii' ? (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Raw ASCII Integration Schema
                </span>
                <button
                  onClick={handleCopyAscii}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  {copiedAscii ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAscii ? 'Copied' : 'Copy ASCII'}</span>
                </button>
              </div>
              <pre className="text-emerald-400 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto p-2 bg-slate-950/80 rounded-xl">
                {rawAsciiDiagram}
              </pre>
            </div>
          ) : (
            <div 
              id="interactive-architecture-diagram"
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Interactive Architectural Flow
                </span>
                <span className="text-[11px] text-slate-400">Click any block to inspect source & metrics</span>
              </div>

              {/* Diagram Node 1: Flutter Mobile Client */}
              <button
                id="arch-node-flutter"
                onClick={() => setSelectedNodeId('node-flutter')}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer relative group ${
                  selectedNodeId === 'node-flutter'
                    ? 'bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/50'
                    : activeSimStep === 1
                    ? 'bg-emerald-500/30 border-emerald-400 shadow-xl'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold text-slate-100">
                      Flutter Mobile Client
                    </span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                    Dart UI / Native Kotlin & Swift
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Cross-platform reactive UI, BLoC state, X3DH Double Ratchet encryption & local SQLite database.
                </p>
                {activeSimStep === 1 && (
                  <span className="absolute top-2 right-2 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                )}
              </button>

              {/* Connection 1: gRPC / WebSockets / UDP */}
              <button
                id="arch-node-transport"
                onClick={() => setSelectedNodeId('node-transport')}
                className={`w-full py-2.5 px-4 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  selectedNodeId === 'node-transport'
                    ? 'bg-sky-500/20 border-sky-500 text-sky-300 ring-1 ring-sky-500'
                    : activeSimStep === 2
                    ? 'bg-sky-500/30 border-sky-400 text-white'
                    : 'bg-slate-950/50 border-slate-800/80 text-sky-400 hover:bg-slate-950'
                }`}
              >
                <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-xs font-mono font-bold">gRPC / WebSockets / UDP</span>
                <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
              </button>

              {/* Diagram Node 2: Go / Rust Gateway & Edge Nodes */}
              <button
                id="arch-node-gateway"
                onClick={() => setSelectedNodeId('node-gateway')}
                className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer relative group ${
                  selectedNodeId === 'node-gateway'
                    ? 'bg-sky-500/20 border-sky-500 shadow-lg shadow-sky-500/10 ring-2 ring-sky-500/50'
                    : activeSimStep === 3
                    ? 'bg-sky-500/30 border-sky-400 shadow-xl'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Network className="w-4 h-4 text-sky-400" />
                    <span className="text-sm font-bold text-slate-100">
                      Go / Rust Gateway & Edge Nodes
                    </span>
                  </div>
                  <span className="text-xs font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-800/40">
                    Go Epoll / Rust SIMD Nom Codec
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  1M WebSocket connections, TLS 1.3 termination, zero-copy Protobuf parsing, and traffic demuxing.
                </p>
                {activeSimStep === 3 && (
                  <span className="absolute top-2 right-2 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500" />
                  </span>
                )}
              </button>

              {/* Connection 2: Split Internal RPC vs Message Queue */}
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="py-2 px-3 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5">
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>Internal RPC (gRPC)</span>
                </div>

                <div className="py-2 px-3 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5">
                  <ArrowDown className="w-3.5 h-3.5" />
                  <span>Message Queue</span>
                </div>
              </div>

              {/* Diagram Node 3: Distributed Microservices & Asynchronous Processors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Distributed Microservices */}
                <button
                  id="arch-node-microservices"
                  onClick={() => setSelectedNodeId('node-microservices')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative group ${
                    selectedNodeId === 'node-microservices'
                      ? 'bg-purple-500/20 border-purple-500 shadow-lg ring-2 ring-purple-500/50'
                      : activeSimStep === 4
                      ? 'bg-purple-500/30 border-purple-400 shadow-xl'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Server className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-slate-100">
                      Distributed Microservices
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-300 block mb-1.5">
                    Java, C#, Ruby, PHP, Python
                  </span>
                  <p className="text-[11px] text-slate-400">
                    User presence, OAuth2 validation, gRPC session synchronization, and group routing.
                  </p>
                </button>

                {/* Asynchronous Processors */}
                <button
                  id="arch-node-async"
                  onClick={() => setSelectedNodeId('node-async')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative group ${
                    selectedNodeId === 'node-async'
                      ? 'bg-amber-500/20 border-amber-500 shadow-lg ring-2 ring-amber-500/50'
                      : activeSimStep === 4
                      ? 'bg-amber-500/30 border-amber-400 shadow-xl'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Cpu className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-100">
                      Asynchronous Processors
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-300 block mb-1.5">
                    C# Transcoding / Python ML
                  </span>
                  <p className="text-[11px] text-slate-400">
                    FFmpeg video transcoding, Opus audio compression, and RoBERTa NLP anti-spam scoring.
                  </p>
                </button>
              </div>

              {/* Connection 3: Reads & Writes */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-slate-400 py-1">
                <div className="flex items-center justify-center gap-1 text-blue-400">
                  <ArrowDown className="w-3 h-3" />
                  <span>Reads</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-emerald-400">
                  <ArrowDown className="w-3 h-3" />
                  <span>Writes (Ledger)</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-amber-400">
                  <ArrowDown className="w-3 h-3" />
                  <span>Writes (Blobs)</span>
                </div>
              </div>

              {/* Diagram Node 4: PostgreSQL, Cassandra NoSQL, and Object Storage */}
              <div className="grid grid-cols-3 gap-3">
                {/* PostgreSQL */}
                <button
                  id="arch-node-postgres"
                  onClick={() => setSelectedNodeId('node-postgres')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedNodeId === 'node-postgres'
                      ? 'bg-blue-500/20 border-blue-500 ring-2 ring-blue-500/50'
                      : activeSimStep === 5
                      ? 'bg-blue-500/30 border-blue-400'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Database className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-slate-100 block">PostgreSQL</span>
                  <span className="text-[10px] font-mono text-blue-300">(SQL Auth)</span>
                </button>

                {/* Cassandra NoSQL */}
                <button
                  id="arch-node-cassandra"
                  onClick={() => setSelectedNodeId('node-cassandra')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedNodeId === 'node-cassandra'
                      ? 'bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/50'
                      : activeSimStep === 5
                      ? 'bg-emerald-500/30 border-emerald-400'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <HardDrive className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-slate-100 block">Cassandra NoSQL</span>
                  <span className="text-[10px] font-mono text-emerald-300">(Chat History)</span>
                </button>

                {/* Object Storage */}
                <button
                  id="arch-node-s3"
                  onClick={() => setSelectedNodeId('node-s3')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedNodeId === 'node-s3'
                      ? 'bg-amber-500/20 border-amber-500 ring-2 ring-amber-500/50'
                      : activeSimStep === 5
                      ? 'bg-amber-500/30 border-amber-400'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <Server className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                  <span className="text-xs font-bold text-slate-100 block">Object Storage</span>
                  <span className="text-[10px] font-mono text-amber-300">(Media Files)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Selected Node Specifications & Code Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div 
            id="architecture-node-inspector"
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold block">
                  {selectedData.tier}
                </span>
                <h3 className="text-base font-bold text-slate-100">{selectedData.title}</h3>
              </div>

              {onNavigateToCode && (
                <button
                  onClick={() => onNavigateToCode(selectedData.primaryLangId)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                  title="Open in Code Lab"
                >
                  <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Open Code</span>
                </button>
              )}
            </div>

            {/* Protocol & Languages */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-300">Wire Protocol:</span>
                <span className="font-mono text-sky-400">{selectedData.protocol}</span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold block">Associated Languages & Frameworks:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedData.languages.map((lang, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 text-[11px] font-mono border border-slate-700"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Role & Key Responsibilities */}
            <div className="space-y-2 text-xs">
              <p className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                {selectedData.role}
              </p>

              <div className="space-y-1.5">
                <span className="text-slate-400 font-semibold block">Architectural Responsibilities:</span>
                <ul className="space-y-1 text-slate-300">
                  {selectedData.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Performance SLA Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {selectedData.metrics.map((m, idx) => (
                <div key={idx} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 block">{m.label}</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{m.value}</span>
                </div>
              ))}
            </div>

            {/* Code Implementation Preview */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-bold text-slate-300 font-mono flex items-center justify-between">
                <span>Production Reference Implementation</span>
                <span className="text-[10px] text-slate-500 font-normal">Syntactic Contract</span>
              </span>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300/90 overflow-x-auto max-h-48 no-scrollbar">
                <pre>{selectedData.codePreview}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
