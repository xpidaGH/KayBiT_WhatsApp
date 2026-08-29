import React, { useState } from 'react';
import { 
  Database, 
  Layers, 
  Activity, 
  Cpu, 
  Terminal, 
  ArrowRight, 
  CheckCircle2, 
  HardDrive,
  BarChart3,
  Lock,
  Clock
} from 'lucide-react';

export const DatabaseBenchmarker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'relational' | 'ledger' | 'telemetry' | 'legacy'>('ledger');
  const [simulatedIngestRate, setSimulatedIngestRate] = useState<number>(50000);
  const [clusterReplication, setClusterReplication] = useState<number>(3);
  const [consistencyLevel, setConsistencyLevel] = useState<string>('LOCAL_QUORUM');

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              Database Architecture & Storage Engine Workbench
            </h2>
            <p className="text-xs text-slate-400">
              Track 4 Deep-Dive: Hybrid storage strategy balancing relational ACID integrity, distributed append-only ledgers, statistical QoS modeling, and legacy mainframe bridges.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Storage Engines Tab Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            id: 'relational',
            title: 'SQL (PostgreSQL 16)',
            subtitle: 'ACID Relational Store',
            badge: 'Users & Groups',
            icon: Database,
            color: 'indigo',
          },
          {
            id: 'ledger',
            title: 'NoSQL (ScyllaDB / Cassandra)',
            subtitle: 'Wide-Column Message Ledger',
            badge: '250k Writes/sec',
            icon: HardDrive,
            color: 'emerald',
          },
          {
            id: 'telemetry',
            title: 'R & MATLAB Telemetry',
            subtitle: 'Erlang-C & Queue Models',
            badge: 'Stochastic Math',
            icon: BarChart3,
            color: 'sky',
          },
          {
            id: 'legacy',
            title: 'COBOL & Assembly',
            subtitle: 'Mainframe Enterprise Bridge',
            badge: 'EBCDIC Copybook',
            icon: Terminal,
            color: 'amber',
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800 border-indigo-500 text-white shadow-lg ring-1 ring-indigo-500/30'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                    {tab.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-100">{tab.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{tab.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      {activeTab === 'ledger' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="space-y-1 pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100">
                Wide-Column Message Ledger Architecture (ScyllaDB / Cassandra)
              </h3>
              <p className="text-xs text-slate-400">
                High-throughput append-only distributed ledger using Time-Window Compaction Strategy (TWCS).
              </p>
            </div>

            {/* Compound Partition Key Blueprint */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="text-slate-400 flex items-center justify-between">
                <span className="text-emerald-400 font-bold uppercase">Compound Key Strategy</span>
                <span className="text-[10px] text-slate-500">Zero Wide-Partition Hotspots</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg text-slate-200 border border-slate-800/80">
                PRIMARY KEY (<strong className="text-sky-400">(conversation_id, bucket_epoch)</strong>, <strong className="text-amber-400">message_id</strong>)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px]">
                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/60">
                  <span className="text-sky-400 font-semibold block mb-0.5">Partition Key (conversation_id, epoch)</span>
                  <span className="text-slate-400">Buckets messages daily to prevent partitions exceeding 100MB on busy channels.</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/60">
                  <span className="text-amber-400 font-semibold block mb-0.5">Clustering Key (message_id DESC)</span>
                  <span className="text-slate-400">Orders messages chronologically via timeuuid for instantaneous reverse scrolling.</span>
                </div>
              </div>
            </div>

            {/* TWCS Compaction Explanation */}
            <div className="space-y-2 text-xs text-slate-300">
              <span className="font-bold text-slate-200 uppercase tracking-wider block">
                Why Time-Window Compaction (TWCS) is Vital:
              </span>
              <p className="leading-relaxed bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                Standard Size-Tiered Compaction Strategy (STCS) causes heavy read amplification and tombstone fragmentation when chat messages expire. TWCS groups SSTables strictly by creation time window (e.g. 1 Day), allowing ScyllaDB to drop entire SSTables atomically without tombstone overhead.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Ledger Cluster Tuner
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Target Write Throughput: <strong className="text-emerald-400">{simulatedIngestRate.toLocaleString()} writes/sec</strong>
                </label>
                <input
                  type="range"
                  min="10000"
                  max="250000"
                  step="5000"
                  value={simulatedIngestRate}
                  onChange={(e) => setSimulatedIngestRate(Number(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1.5">Consistency Level</label>
                <select
                  value={consistencyLevel}
                  onChange={(e) => setConsistencyLevel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-medium focus:outline-none focus:border-indigo-500"
                >
                  <option value="LOCAL_QUORUM">LOCAL_QUORUM (Fastest durability)</option>
                  <option value="EACH_QUORUM">EACH_QUORUM (Cross-region synchronous)</option>
                  <option value="LOCAL_ONE">LOCAL_ONE (Maximum raw throughput)</option>
                </select>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>P99 Write Latency:</span>
                  <span className="text-emerald-400 font-bold">1.28 ms</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Active Memtables:</span>
                  <span className="text-slate-200">12 nodes</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Replication Quorum:</span>
                  <span className="text-sky-400">2 of 3 ACKs (AZ-a, AZ-b)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'relational' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-slate-100">
              PostgreSQL ACID Relational Storage Engine
            </h3>
            <p className="text-xs text-slate-400">
              Strict relational consistency for user identities, phone numbers, auth credentials, and group memberships.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-indigo-400 font-bold uppercase block">Repeatable Read Isolation</span>
              <p className="text-slate-300 leading-relaxed">
                Guarantees that user group joins, admin permissions, and role revocations occur within atomic transaction boundaries without phantom reads.
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-indigo-400 font-bold uppercase block">PgBouncer Connection Pooling</span>
              <p className="text-slate-300 leading-relaxed">
                Multiplexes 10,000 backend microservice requests into 100 dedicated Postgres backend processes using transaction-level pooling.
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-indigo-400 font-bold uppercase block">Declarative Partitioning</span>
              <p className="text-slate-300 leading-relaxed">
                Partitions the group_memberships table by HASH(user_id) across 32 shards for sub-millisecond graph query traversal.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'telemetry' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-slate-100">
              R & MATLAB Stochastic Telemetry & Queuing Models
            </h3>
            <p className="text-xs text-slate-400">
              Erlang-C queue delay modeling, survival analysis of packet delivery, and Monte Carlo jitter simulation.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-3">
            <div className="text-sky-400 font-bold">
              Erlang-C Formula for Edge Ingress Delay:
            </div>
            <div className="p-3 bg-slate-900 rounded text-slate-200 overflow-x-auto">
              P(Wait &gt; 0) = [ (A^c / c!) * (c / (c - A)) ] / [ Σ (A^k / k!) + (A^c / c!) * (c / (c - A)) ]
            </div>
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              Provides deterministic prediction of how many edge gateway servers (c) are required to keep 99.9% of incoming WebSocket frame queue wait times below 1.0 millisecond under burst traffic conditions.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'legacy' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-slate-100">
              COBOL Mainframe Simulation & Assembly Bit Acceleration
            </h3>
            <p className="text-xs text-slate-400">
              Simulating legacy enterprise user verification copybooks alongside low-level x86_64/ARM64 bit-level optimizations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-amber-400 font-bold uppercase block">COBOL 85 EBCDIC Record Processing</span>
              <p className="text-slate-300 leading-relaxed">
                Demonstrates how modern chat applications interface with legacy enterprise banking mainframes using fixed-width 80-byte record layouts.
              </p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-amber-400 font-bold uppercase block">Assembly CRC32 & AES-NI Speed</span>
              <p className="text-slate-300 leading-relaxed">
                Utilizes dedicated CPU hardware instructions (crc32q, aesenc) executing in 3 clock cycles per byte without runtime overhead.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
