export type ParadigmFilterId = 
  | 'all'
  | 'oop'
  | 'functional'
  | 'systems'
  | 'managed'
  | 'concurrent'
  | 'declarative';

export interface ParadigmDefinition {
  id: ParadigmFilterId;
  label: string;
  shortName: string;
  description: string;
  badgeColor: string;
  accentBg: string;
  borderColor: string;
  textColor: string;
  iconName: string;
}

export interface LanguageParadigmMeta {
  primaryParadigm: string;
  paradigms: ParadigmFilterId[];
  paradigmLabels: string[];
  typeSystem: string;
  memoryModel: string;
  runtimeEnvironment: string;
  notableMechanisms: string[];
}

export const PARADIGM_DEFINITIONS: ParadigmDefinition[] = [
  {
    id: 'all',
    label: 'All Paradigms',
    shortName: 'All',
    description: 'All 20 multi-paradigm languages across the Capstone microservices architecture.',
    badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    accentBg: 'bg-slate-800/80',
    borderColor: 'border-slate-700',
    textColor: 'text-slate-200',
    iconName: 'Layers',
  },
  {
    id: 'oop',
    label: 'Object-Oriented (OOP)',
    shortName: 'OOP',
    description: 'Encapsulation, inheritance, polymorphism, design patterns, and class/object contracts.',
    badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    accentBg: 'bg-indigo-500/20',
    borderColor: 'border-indigo-500/40',
    textColor: 'text-indigo-300',
    iconName: 'Box',
  },
  {
    id: 'functional',
    label: 'Functional Programming (FP)',
    shortName: 'Functional',
    description: 'Immutability, pure functions, higher-order combinators, pattern matching, and monadic state.',
    badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    accentBg: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/40',
    textColor: 'text-emerald-300',
    iconName: 'FunctionSquare',
  },
  {
    id: 'systems',
    label: 'Systems & Low-Level',
    shortName: 'Low-Level',
    description: 'Direct memory pointers, registers, zero-overhead abstractions, SIMD, and bare-metal compilation.',
    badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    accentBg: 'bg-rose-500/20',
    borderColor: 'border-rose-500/40',
    textColor: 'text-rose-300',
    iconName: 'Cpu',
  },
  {
    id: 'managed',
    label: 'Managed & Virtual Machine',
    shortName: 'Managed / VM',
    description: 'Garbage-collected runtimes (JVM, CLR, V8, Dart VM) with automatic heap safety and JIT/AOT pipelines.',
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    accentBg: 'bg-amber-500/20',
    borderColor: 'border-amber-500/40',
    textColor: 'text-amber-300',
    iconName: 'Server',
  },
  {
    id: 'concurrent',
    label: 'Concurrent & Reactive',
    shortName: 'Concurrent',
    description: 'Actor models, CSP channels/goroutines, epoll I/O multiplexing, lock-free queues, and event streams.',
    badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    accentBg: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500/40',
    textColor: 'text-cyan-300',
    iconName: 'Zap',
  },
  {
    id: 'declarative',
    label: 'Declarative & Scripting',
    shortName: 'Declarative',
    description: 'Relational set algebra (SQL/CQL), shell orchestration pipelines, and AI/statistical DSLs.',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    accentBg: 'bg-purple-500/20',
    borderColor: 'border-purple-500/40',
    textColor: 'text-purple-300',
    iconName: 'Terminal',
  },
];

export const LANGUAGE_PARADIGMS: Record<string, LanguageParadigmMeta> = {
  dart_flutter: {
    primaryParadigm: 'Object-Oriented & Reactive',
    paradigms: ['oop', 'managed', 'concurrent'],
    paradigmLabels: ['OOP', 'Managed VM', 'Reactive Streams', 'Declarative UI'],
    typeSystem: 'Static Sound Null-Safe Typing',
    memoryModel: 'Generational Tracing GC (Dart VM)',
    runtimeEnvironment: 'Dart VM & AOT Compiled Native ARM',
    notableMechanisms: ['Widget Tree Reconciliation', 'BLoC Streams', 'Platform MethodChannels'],
  },
  kotlin: {
    primaryParadigm: 'Object-Oriented & Functional',
    paradigms: ['oop', 'functional', 'managed', 'concurrent'],
    paradigmLabels: ['OOP', 'Functional', 'Managed (JVM)', 'Coroutines (CSP)'],
    typeSystem: 'Statically Typed with Inferred Nullability',
    memoryModel: 'Generational ART GC (Android Runtime)',
    runtimeEnvironment: 'Android ART / OpenJDK JVM',
    notableMechanisms: ['Kotlin Coroutines & Flow', 'Camera2 HAL Interop', 'Extension Functions'],
  },
  swift: {
    primaryParadigm: 'Protocol-Oriented & OOP',
    paradigms: ['oop', 'functional', 'systems'],
    paradigmLabels: ['OOP', 'Protocol-Oriented', 'Functional', 'Native AOT'],
    typeSystem: 'Strict Static Type Inference & Generics',
    memoryModel: 'Automatic Reference Counting (ARC, Deterministic)',
    runtimeEnvironment: 'LLVM Native Machine Code (Darwin Kernel)',
    notableMechanisms: ['ARC Weak/Unowned Pointers', 'AVFoundation Zero-Copy Buffers', 'Swift Concurrency Actors'],
  },
  typescript_electron: {
    primaryParadigm: 'Multi-Paradigm & Functional',
    paradigms: ['oop', 'functional', 'managed'],
    paradigmLabels: ['Multi-Paradigm', 'Functional', 'OOP', 'Managed (V8)'],
    typeSystem: 'Structural Gradual Typing & Discriminated Unions',
    memoryModel: 'V8 Tracing Generational Garbage Collector',
    runtimeEnvironment: 'Node.js & Chromium V8 Engine (Electron)',
    notableMechanisms: ['IPC Main/Renderer Bridges', 'Immutable Redux/React Hooks', 'Protobuf ArrayBuffer Decoding'],
  },
  go_edge: {
    primaryParadigm: 'Concurrent (CSP) & Structural',
    paradigms: ['concurrent', 'systems', 'managed'],
    paradigmLabels: ['Concurrent (CSP)', 'Procedural / Structural', 'Managed GC'],
    typeSystem: 'Static Structural Subtyping (Interfaces)',
    memoryModel: 'Concurrent Tri-color Mark-Sweep GC with Stack Escape Analysis',
    runtimeEnvironment: 'Go Runtime (Goroutines on M:N Kernel Threads)',
    notableMechanisms: ['Non-blocking epoll sockets', 'Lock-free CSP Channels', 'Goroutine Work-Stealing Scheduler'],
  },
  rust_codec: {
    primaryParadigm: 'Systems & Functional',
    paradigms: ['systems', 'functional', 'concurrent'],
    paradigmLabels: ['Systems / Low-Level', 'Functional', 'Zero-Cost RAII'],
    typeSystem: 'Affine Linear Type System with Trait Bounds',
    memoryModel: 'Compile-time Borrow Checker (No GC, Deterministic Drop)',
    runtimeEnvironment: 'Zero-Runtime LLVM Native Binary',
    notableMechanisms: ['Zero-Copy Slice Parsing', 'Thread-Safe Send/Sync Traits', 'SIMD Ring Buffer Alignment'],
  },
  cpp_webrtc: {
    primaryParadigm: 'Systems & Object-Oriented',
    paradigms: ['systems', 'oop', 'concurrent'],
    paradigmLabels: ['Systems / Low-Level', 'OOP', 'RAII Metaprogramming'],
    typeSystem: 'Static Manifest Typing with Concept Templates',
    memoryModel: 'Manual Heap & Smart Pointers (std::unique_ptr, RAII)',
    runtimeEnvironment: 'Native Machine Code (Clang/GCC with AVX2 SIMD)',
    notableMechanisms: ['WebRTC Jitter Buffer', 'Opus/VP9 RTP Packetization', 'Lock-free Audio FIFO Queues'],
  },
  c_crypto: {
    primaryParadigm: 'Systems & Imperative',
    paradigms: ['systems'],
    paradigmLabels: ['Systems / Low-Level', 'Imperative / Procedural', 'Bare-Metal'],
    typeSystem: 'Static Weak Types with Explicit Byte Offsets',
    memoryModel: 'Explicit Pointer Arithmetic (malloc/free, sodium_memzero)',
    runtimeEnvironment: 'Bare-Metal POSIX Native ELF/Mach-O',
    notableMechanisms: ['Constant-Time Montgomery Ladder', 'Zero-Memory Key Wiping', 'Hardware AES-NI Intrinsics'],
  },
  java_grpc: {
    primaryParadigm: 'Object-Oriented & Concurrent',
    paradigms: ['oop', 'concurrent', 'managed'],
    paradigmLabels: ['OOP', 'Concurrent', 'Managed (JVM)', 'gRPC Microservices'],
    typeSystem: 'Static Nominal Typing with Generics',
    memoryModel: 'Generational ZGC / G1GC Low-Latency Garbage Collector',
    runtimeEnvironment: 'HotSpot JVM (OpenJDK 21+ / GraalVM)',
    notableMechanisms: ['gRPC Netty Channel Multiplexing', 'Spring Dependency Injection', 'Virtual Threads (Project Loom)'],
  },
  scala_actors: {
    primaryParadigm: 'Functional & Actor-Oriented',
    paradigms: ['functional', 'concurrent', 'oop', 'managed'],
    paradigmLabels: ['Functional (FP)', 'Actor Model', 'OOP', 'Managed (JVM)'],
    typeSystem: 'Advanced Static Type System (Higher-Kinded Types & Implicits)',
    memoryModel: 'JVM Heap with Immutable Message Passing',
    runtimeEnvironment: 'Akka Actor System on OpenJDK JVM',
    notableMechanisms: ['Akka Cluster Sharding', 'Supervision Hierarchies', 'Pattern Matching Case Classes'],
  },
  csharp_media: {
    primaryParadigm: 'Component-Oriented & OOP',
    paradigms: ['oop', 'managed', 'concurrent'],
    paradigmLabels: ['OOP', 'Component-Oriented', 'Managed (.NET)', 'Async/Await'],
    typeSystem: 'Static Strong Nominal Typing with Nullable Ref Types',
    memoryModel: '.NET CoreCLR Generational GC + Span<T> Stack Slices',
    runtimeEnvironment: '.NET 8 / CLR High-Performance JIT',
    notableMechanisms: ['FFmpeg P/Invoke Interop', 'Memory-Mapped File Streaming', 'ArrayPool<T> Zero-Allocation Buffers'],
  },
  ruby_oauth: {
    primaryParadigm: 'Pure Object-Oriented & Dynamic',
    paradigms: ['oop', 'declarative', 'managed'],
    paradigmLabels: ['Pure OOP', 'Dynamic / Scripting', 'Declarative DSL', 'Managed'],
    typeSystem: 'Dynamic Duck Typing',
    memoryModel: 'Ruby MRI Generational Mark-Sweep-Compact GC',
    runtimeEnvironment: 'Ruby 3.3 YJIT Interpreter',
    notableMechanisms: ['OAuth2 JWT Proof of Possession', 'Metaprogrammed DSL Routing', 'Rack Middleware Pipelines'],
  },
  postgresql_sql: {
    primaryParadigm: 'Declarative & Relational',
    paradigms: ['declarative'],
    paradigmLabels: ['Declarative', 'Relational Algebra', 'ACID / PL/pgSQL', 'Set-Based'],
    typeSystem: 'Relational Schema & Strong SQL Data Types',
    memoryModel: 'PostgreSQL Shared Buffers & MVCC Transaction Heap',
    runtimeEnvironment: 'PostgreSQL 16 Cost-Based Query Engine',
    notableMechanisms: ['PL/pgSQL Atomic Triggers', 'Hash-Distributed Partitioning', 'Write-Ahead Logging (WAL)'],
  },
  scylladb_cql: {
    primaryParadigm: 'Declarative & Distributed NoSQL',
    paradigms: ['declarative', 'systems'],
    paradigmLabels: ['Declarative (CQL)', 'Distributed NoSQL', 'Wide-Column', 'Eventual Consistency'],
    typeSystem: 'Cassandra CQL Data Typing & Primary/Clustering Keys',
    memoryModel: 'Seastar Shared-Nothing Thread-per-Core NUMA Memory',
    runtimeEnvironment: 'C++ Seastar Asynchronous Engine (Zero Context Switch)',
    notableMechanisms: ['Token-Aware Hash Ring Sharding', 'LSM SSTable Compaction', 'Vector Clock Conflict Resolution'],
  },
  python_ml: {
    primaryParadigm: 'Multi-Paradigm & Data/AI Scripting',
    paradigms: ['functional', 'oop', 'declarative', 'managed'],
    paradigmLabels: ['Multi-Paradigm', 'OOP / Functional', 'AI & Tensor Scripting', 'Managed'],
    typeSystem: 'Dynamic with Python 3.12 Type Hints',
    memoryModel: 'Reference Counting with Cyclic Garbage Collector',
    runtimeEnvironment: 'CPython 3.12 with C++ / CUDA Accelerated PyTorch',
    notableMechanisms: ['PyTorch RoBERTa Embeddings', 'Vector Dot-Product Similarity', 'Asynchronous AsyncIO Event Loops'],
  },
  r_telemetry: {
    primaryParadigm: 'Functional & Statistical Vectorized',
    paradigms: ['functional', 'declarative', 'managed'],
    paradigmLabels: ['Functional (FP)', 'Statistical Vectorized', 'Managed'],
    typeSystem: 'Dynamic S3/S4 Object Dispatch',
    memoryModel: 'Copy-On-Write Vector Heap with Generational GC',
    runtimeEnvironment: 'GNU R Statistical Engine',
    notableMechanisms: ['Tidyverse Vectorized Pipes (%>%)', 'Monte Carlo P99 Estimation', 'Automated SLA Violation Forecasts'],
  },
  cobol_settlement: {
    primaryParadigm: 'Procedural & Record-Oriented',
    paradigms: ['systems', 'declarative'],
    paradigmLabels: ['Procedural', 'Record-Oriented', 'Mainframe / Legacy', 'Fixed-Width BCD'],
    typeSystem: 'Fixed Picture Clause Layouts (PIC 9, PIC X)',
    memoryModel: 'Static Working-Storage Division Memory',
    runtimeEnvironment: 'GnuCOBOL / IBM Enterprise COBOL Runtime',
    notableMechanisms: ['Exact BCD Fixed-Point Arithmetic', 'Fixed-Width Batch Record Serialization', 'Audited Ledger Balancing'],
  },
  assembly_x86: {
    primaryParadigm: 'Low-Level Machine Instructions',
    paradigms: ['systems'],
    paradigmLabels: ['Low-Level Assembly', 'Imperative Machine Code', 'Bare-Metal'],
    typeSystem: 'Typeless Raw Byte & Bit Registers (RAX, RDI, XMM0)',
    memoryModel: 'Direct CPU Register Allocation & Linear Stack Frames',
    runtimeEnvironment: 'x86-64 CPU Instruction Decoder (Intel/AMD)',
    notableMechanisms: ['AVX-512 SIMD Vectorization', 'POSIX Syscall 0x01 (sys_write)', 'Constant-Time XOR Shuffling'],
  },
  bash_orchestration: {
    primaryParadigm: 'Stream-Oriented & Shell Automation',
    paradigms: ['declarative', 'systems'],
    paradigmLabels: ['Stream-Oriented', 'Shell Automation', 'POSIX Glue'],
    typeSystem: 'Typeless String Streams & Exit Codes (0..255)',
    memoryModel: 'Linux Kernel Process Fork / Exec & Anonymous Pipes',
    runtimeEnvironment: 'GNU Bash / POSIX Subshell Process Tree',
    notableMechanisms: ['Kernel IPC Pipelines (|)', 'Trap Signal Handlers (SIGTERM)', 'Subshell Concurrency (&, wait)'],
  },
  powershell_ci: {
    primaryParadigm: 'Object-Pipeline Scripting & Declarative',
    paradigms: ['declarative', 'managed', 'oop'],
    paradigmLabels: ['Object-Pipeline', 'Declarative Test DSL', 'Managed (.NET)'],
    typeSystem: 'Dynamic & Strong .NET Type System Binding',
    memoryModel: '.NET CLR Object Pipeline Heap',
    runtimeEnvironment: 'PowerShell Core 7.x on .NET Runtime',
    notableMechanisms: ['Type-Preserving Object Streaming', 'Pester Unit Test DSL', 'Cross-Platform CI Gate Validation'],
  },
};

export function getLanguageParadigmMeta(langId: string): LanguageParadigmMeta {
  return (
    LANGUAGE_PARADIGMS[langId] || {
      primaryParadigm: 'Multi-Paradigm',
      paradigms: ['all'],
      paradigmLabels: ['Multi-Paradigm'],
      typeSystem: 'Standard Typing',
      memoryModel: 'Standard Memory Model',
      runtimeEnvironment: 'Standard Runtime',
      notableMechanisms: ['Standard Microservice Logic'],
    }
  );
}

export function matchesParadigmFilter(langId: string, filterId: ParadigmFilterId): boolean {
  if (filterId === 'all') return true;
  const meta = LANGUAGE_PARADIGMS[langId];
  if (!meta) return false;
  return meta.paradigms.includes(filterId);
}
