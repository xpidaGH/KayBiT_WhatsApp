import { CapstoneMilestone } from '../types';

export const CAPSTONE_MILESTONES: CapstoneMilestone[] = [
  {
    week: 1,
    sprint: 'Sprint 01',
    title: 'Domain Architecture, Protocol Schemas & Toolchain Setup',
    theme: 'Foundations & Interface Definition Language',
    deliverablesByTrack: [
      {
        trackId: 'frontend',
        trackName: 'Cross-Platform & Native Clients',
        deliverable: 'Initialize Flutter project structure, BLoC state skeleton, and TypeScript crypto types',
        languageFocus: ['Dart/Flutter', 'TypeScript'],
      },
      {
        trackId: 'networking',
        trackName: 'High-Throughput Edge & Real-Time Gateway',
        deliverable: 'Define canonical Protobuf v3 schemas (message.proto, signaling.proto) and compile with Rust/Go',
        languageFocus: ['Go', 'Rust'],
      },
      {
        trackId: 'backend',
        trackName: 'Distributed Microservices & Business Logic',
        deliverable: 'Scaffold Spring Boot identity app, FastAPI anti-spam worker, and .NET Core media service',
        languageFocus: ['Java', 'Python', 'C#'],
      },
      {
        trackId: 'data',
        trackName: 'Database Architecture & Storage Engine',
        deliverable: 'Provision PostgreSQL 16 schemas (users, groups) and ScyllaDB keyspaces with TWCS compaction',
        languageFocus: ['SQL', 'NoSQL (CQL)'],
      },
      {
        trackId: 'devops',
        trackName: 'Infrastructure & Automation',
        deliverable: 'Write Linux node kernel tuning script (somaxconn, fs.file-max) and PowerShell dev runner',
        languageFocus: ['Bash/Shell', 'PowerShell'],
      },
    ],
    crossTrackIntegrationGate: 'All tracks agree on message.proto binary wire format and compile client/server stubs without errors.',
    rubric: [
      { criteria: 'Protobuf Schema Rigor', weight: 25, description: 'Correct use of varints, oneof unions, and timestamp fields.' },
      { criteria: 'Toolchain Automation', weight: 25, description: 'PowerShell / Bash scripts successfully set up 100% of student dev environments.' },
      { criteria: 'Domain Modeling', weight: 25, description: 'Clean separation of concerns with no monolithic anti-patterns.' },
      { criteria: 'Documentation & Contracts', weight: 25, description: 'Clear Markdown architectural design records (ADRs).' },
    ],
  },
  {
    week: 2,
    sprint: 'Sprint 02',
    title: 'Core UI State, Native Bridges & Epoll Socket Gateways',
    theme: 'Presentation, Native HAL & Edge Ingress',
    deliverablesByTrack: [
      {
        trackId: 'frontend',
        trackName: 'Cross-Platform & Native Clients',
        deliverable: 'Build reactive Flutter message feed with 120 FPS scrolling and Android WakeLock platform channel',
        languageFocus: ['Dart/Flutter', 'Kotlin', 'Swift'],
      },
      {
        trackId: 'networking',
        trackName: 'High-Throughput Edge & Real-Time Gateway',
        deliverable: 'Implement Go WebSocket edge listener holding 100k test connections with epoll event loop',
        languageFocus: ['Go'],
      },
      {
        trackId: 'backend',
        trackName: 'Distributed Microservices & Business Logic',
        deliverable: 'Implement Java/Scala JWT token issuance and Akka actor presence registry',
        languageFocus: ['Java', 'Scala'],
      },
      {
        trackId: 'data',
        trackName: 'Database Architecture & Storage Engine',
        deliverable: 'Benchmark PostgreSQL write throughput under concurrent connection pooling with PgBouncer',
        languageFocus: ['SQL (Postgres)'],
      },
      {
        trackId: 'devops',
        trackName: 'Infrastructure & Automation',
        deliverable: 'Set up Prometheus node exporters and multi-architecture Docker build runners',
        languageFocus: ['Bash/Shell', 'PowerShell'],
      },
    ],
    crossTrackIntegrationGate: 'Flutter client successfully establishes secure WebSocket connection with Go Edge Gateway through JWT token.',
    rubric: [
      { criteria: 'UI Fluidity & Battery', weight: 30, description: 'Zero jank frames during message feed fling scroll; proper WakeLock release.' },
      { criteria: 'Edge Connection Concurrency', weight: 40, description: 'Go edge node survives connection load test without memory leaks.' },
      { criteria: 'Identity Security', weight: 30, description: 'Cryptographically valid JWT signatures with short expiration and refresh flow.' },
    ],
  },
  {
    week: 3,
    sprint: 'Sprint 03',
    title: 'Cryptographic Ratchets, Zero-Copy Codecs & Wide-Column Ledgers',
    theme: 'End-to-End Encryption & Ledger Persistence',
    deliverablesByTrack: [
      {
        trackId: 'frontend',
        trackName: 'Cross-Platform & Native Clients',
        deliverable: 'Implement Signal Double Ratchet & X3DH in TypeScript with Curve25519 and AES-256-GCM',
        languageFocus: ['TypeScript / JS'],
      },
      {
        trackId: 'networking',
        trackName: 'High-Throughput Edge & Real-Time Gateway',
        deliverable: 'Integrate Rust zero-copy framing codec with SIMD header scanning into Go edge gateway',
        languageFocus: ['Rust', 'Go'],
      },
      {
        trackId: 'backend',
        trackName: 'Distributed Microservices & Business Logic',
        deliverable: 'Build .NET Core media transcoding worker with ImageSharp WebP thumbnail pipeline',
        languageFocus: ['C# (.NET Core)'],
      },
      {
        trackId: 'data',
        trackName: 'Database Architecture & Storage Engine',
        deliverable: 'Implement ScyllaDB / Cassandra append-heavy time-series message ingestion with LOCAL_QUORUM',
        languageFocus: ['NoSQL (CQL)'],
      },
      {
        trackId: 'devops',
        trackName: 'Infrastructure & Automation',
        deliverable: 'Create automated end-to-end integration test runner validating encrypted message delivery',
        languageFocus: ['PowerShell', 'Bash/Shell'],
      },
    ],
    crossTrackIntegrationGate: 'A message encrypted by TypeScript Signal Ratchet is parsed by Rust codec, routed by Go edge, and stored into ScyllaDB ledger.',
    rubric: [
      { criteria: 'Cryptographic Correctness', weight: 40, description: 'Forward secrecy and break-in recovery proven via automated key compromise tests.' },
      { criteria: 'Zero-Copy Performance', weight: 30, description: 'Zero heap allocations verified during Rust packet deserialization benchmark.' },
      { criteria: 'Ledger Write Scalability', weight: 30, description: 'ScyllaDB demonstrates >50k sustained writes/sec per node.' },
    ],
  },
  {
    week: 4,
    sprint: 'Sprint 04',
    title: 'WebRTC Jitter Buffers, ML Anti-Spam & Admin Back-Offices',
    theme: 'Real-Time Media & Intelligent Moderation',
    deliverablesByTrack: [
      {
        trackId: 'frontend',
        trackName: 'Cross-Platform & Native Clients',
        deliverable: 'Hook native camera/audio hardware buffers into C/C++ WebRTC calling engine',
        languageFocus: ['Kotlin', 'Swift', 'Dart'],
      },
      {
        trackId: 'networking',
        trackName: 'High-Throughput Edge & Real-Time Gateway',
        deliverable: 'Implement C++ adaptive jitter buffer with packet loss concealment (PLC) for Opus/AV1 streams',
        languageFocus: ['C / C++'],
      },
      {
        trackId: 'backend',
        trackName: 'Distributed Microservices & Business Logic',
        deliverable: 'Deploy Python FastAPI spam classification pipeline with ONNX transformer embeddings and Celery',
        languageFocus: ['Python'],
      },
      {
        trackId: 'backend',
        trackName: 'Distributed Microservices & Business Logic',
        deliverable: 'Build Ruby on Rails / PHP Laravel administrative moderation dashboard and Stripe billing webhook',
        languageFocus: ['Ruby', 'PHP'],
      },
      {
        trackId: 'data',
        trackName: 'Database Architecture & Storage Engine',
        deliverable: 'Run R & MATLAB stochastic network telemetry models (Erlang-C delay & packet loss curves)',
        languageFocus: ['R', 'MATLAB'],
      },
    ],
    crossTrackIntegrationGate: 'End-to-end voice call operates over C++ jitter buffer while Python ML automatically flags high-rate spam floods.',
    rubric: [
      { criteria: 'Audio Quality under Jitter', weight: 35, description: 'Opus audio maintains MOS score >4.0 despite 10% packet drop.' },
      { criteria: 'ML Spam Precision & Recall', weight: 35, description: 'Model achieves >99% precision with <0.01% false positive rate.' },
      { criteria: 'Admin Audit Security', weight: 30, description: '100% immutable audit logging for all moderation and billing actions.' },
    ],
  },
  {
    week: 5,
    sprint: 'Sprint 05',
    title: 'Legacy Enterprise Bridges, Telemetry Analysis & Chaos Testing',
    theme: 'Enterprise Integration & Chaos Engineering',
    deliverablesByTrack: [
      {
        trackId: 'frontend',
        trackName: 'Cross-Platform & Native Clients',
        deliverable: 'Perform offline queue reconciliation and battery consumption stress testing',
        languageFocus: ['Dart', 'TypeScript'],
      },
      {
        trackId: 'networking',
        trackName: 'High-Throughput Edge & Real-Time Gateway',
        deliverable: 'Execute 1-million connection load test against Go edge cluster under simulated network partitions',
        languageFocus: ['Go', 'Rust'],
      },
      {
        trackId: 'backend',
        trackName: 'Distributed Microservices & Business Logic',
        deliverable: 'Perform automated stress testing on C# transcoding pipeline and Java social graph traversal',
        languageFocus: ['Java', 'C#', 'Python'],
      },
      {
        trackId: 'data',
        trackName: 'Database Architecture & Storage Engine',
        deliverable: 'Simulate COBOL / Assembly mainframe enterprise verification bridge for VIP user tiers',
        languageFocus: ['COBOL', 'Assembly', 'SQL'],
      },
      {
        trackId: 'devops',
        trackName: 'Infrastructure & Automation',
        deliverable: 'Execute Chaos Monkey fault injection (node termination, packet drop) and verify zero data loss',
        languageFocus: ['Bash/Shell', 'PowerShell'],
      },
    ],
    crossTrackIntegrationGate: 'System survives 50% cluster node termination with automatic failover and 100% message ledger durability.',
    rubric: [
      { criteria: 'Chaos Resilience', weight: 40, description: 'Zero message loss verified across multi-node kill tests.' },
      { criteria: 'Legacy Bridge Interoperability', weight: 30, description: 'COBOL EBCDIC copybook verification executed and validated by Assembly CRC32.' },
      { criteria: 'Capstone Defense & Presentation', weight: 30, description: 'Students articulate architecture trade-offs across all 20 languages with deep mastery.' },
    ],
  },
];

export const PROTOBUF_SPECIFICATION = `syntax = "proto3";

package kaybit.whatsapp.v1;

enum MessageType {
  MESSAGE_TYPE_UNSPECIFIED = 0;
  MESSAGE_TYPE_TEXT = 1;
  MESSAGE_TYPE_IMAGE = 2;
  MESSAGE_TYPE_VIDEO = 3;
  MESSAGE_TYPE_AUDIO_VOICE = 4;
  MESSAGE_TYPE_DOCUMENT = 5;
  MESSAGE_TYPE_SYSTEM_SIGNAL = 6;
}

enum DeliveryStatus {
  DELIVERY_STATUS_PENDING = 0;
  DELIVERY_STATUS_SENT_TO_EDGE = 1;
  DELIVERY_STATUS_PERSISTED_LEDGER = 2;
  DELIVERY_STATUS_DELIVERED_TO_CLIENT = 3;
  DELIVERY_STATUS_READ_BY_RECIPIENT = 4;
}

message EncryptedSignalEnvelope {
  string sender_user_id = 1;
  string recipient_user_id = 2;
  string conversation_id = 3;
  uint32 ratchet_message_number = 4;
  uint32 previous_chain_counter = 5;
  bytes ephemeral_public_key = 6;
  bytes iv_nonce = 7;
  bytes encrypted_ciphertext = 8;
  bytes hmac_auth_tag = 9;
  int64 timestamp_utc_millis = 10;
  MessageType payload_type = 11;
}

message MessageReceipt {
  string message_id = 1;
  string conversation_id = 2;
  string acknowledging_user_id = 3;
  DeliveryStatus status = 4;
  int64 timestamp_utc_millis = 5;
}

message WebRTCSignalingPayload {
  string call_id = 1;
  string sender_peer_id = 2;
  string target_peer_id = 3;
  oneof signal {
    string sdp_offer = 4;
    string sdp_answer = 5;
    string ice_candidate_json = 6;
    bool hangup_signal = 7;
  }
}`;
