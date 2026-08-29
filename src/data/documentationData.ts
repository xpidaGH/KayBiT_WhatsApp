export interface DocSection {
  id: string;
  title: string;
  level: number;
}

export const USER_GUIDE_MARKDOWN = `# KayBiT_WhatsApp Capstone Studio: Comprehensive User Guide

Welcome to the **KayBiT_WhatsApp Capstone Studio** — the interactive multi-language architecture workbench, distributed systems simulator, and educational command center designed for engineering students, educators, and systems architects.

This guide walks you through every module, feature, simulation tool, and code workbench in the studio.

---

## 1. Platform Overview & Architecture Philosophy

**KayBiT_WhatsApp** is modeled after production-grade, planet-scale messaging architectures (e.g., WhatsApp, Signal, Telegram) capable of handling hundreds of millions of concurrent connections with sub-2ms edge latency and zero-knowledge end-to-end encryption.

To provide students with a holistic computer science education, the architecture is partitioned across **5 Specialized Engineering Tracks** using **20 distinct programming languages**, each chosen for its exact industry domain strengths:

- **Track 1: Client & Mobile** — Dart (Flutter), Kotlin (Android), Swift (iOS), TypeScript (React/PWA)
- **Track 2: Edge & Gateway** — Go (Epoll 1M conns), Rust (Tokio zero-copy), C (Double Ratchet), C++ (Ring buffers)
- **Track 3: Microservices** — Java (Spring identity), Scala (Akka cluster), C# (.NET 8 media), Ruby (Webhooks), PHP (Push)
- **Track 4: Data & Storage** — Python (ML & Fraud), PostgreSQL (ACID & Graph), Cassandra/ScyllaDB (Time-series chat log), R & MATLAB (Signal & DSP)
- **Track 5: Systems & Low-Level** — COBOL (Telecom billing), Assembly x86_64 (AVX2 SHA-256 SIMD), Bash & PowerShell (DevOps)

---

## 2. Interface Layout & Navigation

The Studio interface is organized into a clean, high-contrast, responsive dashboard:

- **Global Navigation Header**:
  - **Live Edge Telemetry**: Shows live simulated Gateway status (\`1,000,000 Conns (Go)\`), P99 Latency (\`< 1.8ms\`), and Active Cryptographic Ratchet (\`Signal Protocol / X3DH\`).
  - **User Guide Button**: Opens this interactive guide with instant search and category navigation.
  - **Export Bundle Button**: Downloads the complete JSON bundle including all 20 language source snippets, Protobuf contracts, and milestone curriculum.
  - **AI Architecture Advisor Button**: Launches the interactive Gemini architectural tutor modal with contextual code assistance.
  - **Navigation Tabs**: Switch seamlessly between Blueprint, Simulator, Code Lab, Topology, Database Benchmarks, and Curriculum.

---

## 3. Module 1: Architecture Blueprint (5 Tracks)

The **Architecture Blueprint** is the conceptual home of the system:
- **Track Selection**: Click on any of the 5 track cards (**Frontend**, **Edge Gateway**, **Microservices**, **Data Pipeline**, or **Low-Level Systems**) to view its detailed architectural specs.
- **Track Metadata**: Inspect throughput targets, P99 latency budgets, memory baselines, and security models.
- **Language Stack Cards**: Each track displays 4 dedicated programming language modules. Click on any language card to jump straight to its implementation in the **Code Workbench**.
- **Interactive Simulator Launcher**: Click *"Simulate Track Flow"* to trigger an E2E message packet flow through that track's microservices.

---

## 4. Module 2: Live Packet Flow Simulator

The **Packet Flow Simulator** provides real-time visualization of how a message travels across the distributed topology:

1. **Step-by-Step E2E Message Traversal**:
   - **Step 1 (Client Transmission)**: Mobile device signs payload with Ed25519 and encrypts with AES-256-GCM via Double Ratchet.
   - **Step 2 (Edge Ingress Gateway)**: Go/Rust epoll listener accepts TLS connection and performs zero-copy Protobuf deserialization.
   - **Step 3 (Cryptographic Ratchet)**: C/C++ AVX2 hardware acceleration derives next symmetric message key.
   - **Step 4 (Microservice Dispatch)**: Scala Akka actors or Java gRPC cluster route to recipient's home partition.
   - **Step 5 (Dual Storage Commit)**: Cassandra receives append-only message log while PostgreSQL updates transactional session state.
   - **Step 6 (Edge Delivery & ACK)**: Recipient gateway delivers packet and dispatches double-tick delivery confirmation back to sender.

2. **Simulation Controls**:
   - **Start / Pause**: Run automatic animated packet flows.
   - **Next / Previous Step**: Manually step through the execution pipeline to analyze state changes.
   - **Traffic Load Selector**: Toggle between *Normal (1,000 msg/s)*, *Spike (50,000 msg/s)*, and *Black Friday Peak (500,000 msg/s)*.
   - **Simulate Network Failure**: Introduce synthetic packet drops or network partitions to observe fault tolerance and circuit breakers.

---

## 5. Module 3: Code Lab & Multi-Language Compilers (20 Languages)

The **Code Workbench** features production-grade reference implementations across all 20 languages:

- **Language Selector**: Browse by engineering track or use the quick language pills (Dart, Kotlin, Swift, TypeScript, Go, Rust, C, C++, Java, Scala, C#, Ruby, PHP, Python, SQL, CQL, R, MATLAB, COBOL, Assembly).
- **Embedded Editor**: View syntax-highlighted code files with comprehensive docstrings, types, and architectural explanations.
- **Simulated Test Runner**: Click *"Run Unit & Benchmark Tests"* to execute a realistic multi-stage compilation and benchmark suite showing latency, memory consumption, and test assertions.
- **Ask AI About This Code**: Click the AI spark icon to send the exact code snippet directly to the **AI Architecture Advisor** for line-by-line breakdown or optimization ideas.
- **Copy Code & Download**: One-click clipboard copy and raw file download for local development.

---

## 6. Module 4: Distributed System Topology Graph

The **System Topology** provides a visual microservices network map:
- **Node Classification**: Nodes are grouped by layer (Client, Edge Gateway, Message Router, Cryptographic Core, Cluster State, Storage Tier, Telemetry).
- **Live Connection Links**: Observe gRPC, WebSocket, TCP, and Kafka streams between services.
- **Node Inspector**: Click any service node to view its language, protocols (HTTP/3, gRPC, Protobuf), CPU/RAM utilization, and upstream/downstream dependencies.

---

## 7. Module 5: Storage & Telemetry Benchmarker (ACID vs. NoSQL)

Compare database engines under real-world messaging workloads:
- **Relational vs. Distributed NoSQL**: Contrast PostgreSQL (ACID user accounts, contact graphs) with Apache Cassandra / ScyllaDB (high-throughput, time-series chat logs).
- **Interactive Query Benchmarking**:
  - Run \`INSERT Message Batch\` (100,000 records/sec).
  - Run \`SELECT Chat History by Partition Key\`.
  - Benchmark Index Scan vs. Sequential Scan under B-Tree vs. LSM-Tree storage engines.
- **Telemetry Visualizer**: Track P50, P95, and P99 latency percentiles, disk I/O, cache hit ratios, and replication lag.

---

## 8. Module 6: Capstone Syllabus & Sprint Tracker

Structured 5-sprint curriculum for semester-long or intensive capstone courses:
- **Sprint 1**: Client UI & Local SQLite Cache (Dart / Kotlin / Swift / TS)
- **Sprint 2**: Edge Connection Pooling & Protocol Buffers (Go / Rust / C++)
- **Sprint 3**: Cryptographic Double Ratchet & Microservices (C / Java / Scala / C#)
- **Sprint 4**: Sharded Databases & Stream Processing (PostgreSQL / Cassandra / Python / Kafka)
- **Sprint 5**: Low-Level Systems, Legacy Settlement & Observability (COBOL / Assembly / Bash / PowerShell)

---

## 9. AI Architecture Advisor (Gemini Powered)

Click **"AI Architecture Advisor"** in the top navigation or on any code screen:
- **Context-Aware Assistance**: Automatically receives the active code snippet and architectural track you are working on.
- **Interactive Prompts**: In-depth explanations of socket epoll architectures, Double Ratchet key derivations, Akka actor clustering, or Cassandra time-series partitions.
- **Real-Time Streaming Responses**: Fast, authoritative answers tailored to systems engineering.

---

## 10. Exporting Project Bundles & Protobuf Specs

Click **"Export Bundle"** in the header to generate a standalone JSON archive containing:
- Full source files and reference implementations for all 20 languages.
- Complete Protobuf v3 specification files (\`message_envelope.proto\`, \`auth_service.proto\`, \`chat_sync.proto\`).
- Capstone sprint milestone guides and grading rubrics.

---

## 11. Cross-Platform Native Installation (Desktop & Mobile)

To distribute this studio directly to students across Android, Windows, macOS, and iOS/PWA:
- Check out the **Native Installation Guide** tab in this modal, or open \`INSTALLATION.md\`.
- Complete GitHub Actions CI/CD workflows and configuration files are provided for one-click setup.

---

## 12. Keyboard Shortcuts & Productivity Tips

| Shortcut | Action |
| :--- | :--- |
| \`Ctrl / Cmd + F\` or \`/\` | **Global Search** (Tracks, 20 Languages, Sprints, Deliverables) |
| \`1\` - \`9\` | Switch between Studio Navigation Tabs |
| \`Ctrl / Cmd + K\` | Open AI Architecture Advisor |
| \`Ctrl / Cmd + U\` | Open User Guide & Documentation |
| \`Ctrl / Cmd + Shift + L\` | Toggle Light / Dark Studio Theme |
| \`Space\` | Play / Pause Packet Flow Simulator |
| \`Esc\` | Close search dropdown or active modal window |
| \`Tab\` (in Search) | Cycle search categories (All / Tracks / Languages / Milestones) |
| \`↑\` / \`↓\` (in Search) | Navigate search results with auto-scroll |
| \`Enter\` (in Search) | Jump directly to selected code, track, or milestone |
`;

export const INSTALLATION_MARKDOWN = `# KayBiT_WhatsApp Capstone Studio: Native Multi-Platform Installation & Distribution Guide

This comprehensive guide explains how to package, build, automate, host, and distribute **KayBiT_WhatsApp Capstone Studio** as native applications for:
- 📱 **Android** (\`.apk\` direct download, \`.aab\` for Play Store)
- 🍏 **iOS** (PWA offline installation & TestFlight / App Store via Capacitor)
- 🪟 **Windows** (\`.exe\` installer & \`.msi\` enterprise package)
- 🍎 **macOS** (\`.dmg\` drag-and-drop & \`.app\` universal binary)
- 🌐 **Progressive Web App (PWA)** (one-click browser installation for Chromebooks, Linux, and any desktop/mobile device)

---

## 1. Tooling Selection & Architecture Comparison

### Desktop: Tauri v2 vs. Electron

| Metric / Feature | **Tauri v2 (Recommended)** | **Electron** | **Why We Recommend Tauri v2** |
| :--- | :--- | :--- | :--- |
| **Binary Bundle Size** | **3 MB – 15 MB** | 80 MB – 180 MB | Tauri uses the OS's native webview (WebView2 on Windows, WebKit on macOS) rather than bundling Chromium. |
| **Idle RAM Usage** | **~25 MB – 40 MB** | ~150 MB – 350 MB | Essential for students running resource-heavy IDEs, Docker, and simulators simultaneously. |
| **Security Model** | Strict IPC allowlist, sandboxed Rust core | Node integration risks | Prevents remote code execution vulnerabilities in student environments. |
| **Multi-platform Build** | Single command for \`.exe\`, \`.msi\`, \`.dmg\`, \`.app\` | Requires complex \`electron-builder\` | Seamless GitHub Actions matrix support out-of-the-box. |

---

### Mobile: Capacitor vs. Cordova vs. React Native

| Metric / Feature | **Capacitor 6+ (Recommended)** | **Apache Cordova** | **React Native** |
| :--- | :--- | :--- | :--- |
| **Codebase Reuse** | **100% of existing React/Vite code** | 100% | Requires rewriting DOM to native JSX primitives |
| **Build Pipeline** | Direct Gradle & Xcode integration | Outdated plugins | Custom Metro bundler |
| **Maintenance** | Actively maintained by Ionic team | Deprecated | High maintenance overhead |

---

## 2. Project Restructuring for Native & Offline Compatibility

### 1. Relative Asset Paths in \`vite.config.ts\`
Set \`base: './'\` in \`vite.config.ts\` so that all script and asset URLs resolve relatively instead of assuming root \`/\` server hosting:

\`\`\`typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // CRITICAL for Capacitor and Tauri local asset resolution
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
\`\`\`

---

## 3. Step-by-Step Setup per Platform

### A. Android APK/AAB with Capacitor
\`\`\`bash
# 1. Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "KayBiT Capstone" "com.kaybit.capstone" --web-dir dist

# 2. Build & sync
npm run build
npx cap add android
npx cap sync android

# 3. Build Release APK
cd android
./gradlew assembleRelease
\`\`\`
Output APK: \`android/app/build/outputs/apk/release/app-release-unsigned.apk\`

---

### B. Windows (.exe/.msi) & macOS (.dmg) with Tauri v2
\`\`\`bash
# 1. Install Tauri CLI
npm install -D @tauri-apps/cli
npx tauri init

# 2. Build production desktop binaries
npm run build
npx tauri build
\`\`\`
Outputs:
- **Windows**: \`src-tauri/target/release/bundle/nsis/KayBiT_WhatsApp_Capstone_1.0.0_x64-setup.exe\`
- **macOS**: \`src-tauri/target/release/bundle/dmg/KayBiT_WhatsApp_Capstone_1.0.0_universal.dmg\`

---

## 4. Build Automation with CI/CD (GitHub Actions)

Create \`.github/workflows/build-native.yml\` to automatically build all platform binaries on GitHub push:

\`\`\`yaml
name: Build Native Desktop & Mobile Installers

on:
  push:
    tags:
      - 'v*'
    branches:
      - main

jobs:
  build-tauri:
    strategy:
      matrix:
        include:
          - platform: 'windows-latest'
            target: 'x86_64-pc-windows-msvc'
          - platform: 'macos-latest'
            target: 'aarch64-apple-darwin'
    runs-on: \${{ matrix.platform }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - uses: dtolnay/rust-toolchain@stable
        with: { targets: \${{ matrix.target }} }
      - run: npm ci && npm run build
      - uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}

  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - uses: actions/setup-java@v4
        with: { distribution: 'temurin', java-version: '17' }
      - uses: android-actions/setup-android@v3
      - run: |
          npm ci
          npm run build
          npx cap sync android
          cd android && ./gradlew assembleRelease
      - uses: actions/upload-artifact@v4
        with:
          name: KayBiT_Android_APK
          path: android/app/build/outputs/apk/release/app-release-unsigned.apk
\`\`\`

---

## 5. Hosting, Storage & Download Portal Architecture

### 1. Direct GitHub Releases (Free & Automated)
Link directly to your release assets:
- Windows: \`https://github.com/YOUR_ORG/YOUR_REPO/releases/latest/download/KayBiT_Setup.exe\`
- macOS: \`https://github.com/YOUR_ORG/YOUR_REPO/releases/latest/download/KayBiT_macOS.dmg\`
- Android: \`https://github.com/YOUR_ORG/YOUR_REPO/releases/latest/download/KayBiT_Android.apk\`

### 2. S3 Bucket & CloudFront CDN
Store binaries under \`s3://your-bucket/latest/\` with a \`version.json\` manifest for client auto-update checks.

---

## 6. Concrete Configuration Files

### \`capacitor.config.ts\`
\`\`\`typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kaybit.capstone',
  appName: 'KayBiT WhatsApp Capstone',
  webDir: 'dist',
  bundledWebRuntime: false,
  backgroundColor: '#020617',
};

export default config;
\`\`\`

### \`src-tauri/tauri.conf.json\`
\`\`\`json
{
  "productName": "KayBiT_WhatsApp_Capstone",
  "version": "1.0.0",
  "identifier": "com.kaybit.capstone",
  "build": {
    "beforeDevCommand": "npm run dev",
    "devUrl": "http://localhost:3000",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "title": "KayBiT_WhatsApp Capstone Studio",
        "width": 1280,
        "height": 840,
        "theme": "Dark"
      }
    ]
  }
}
\`\`\`
`;

export const README_MARKDOWN = `# KayBiT_WhatsApp Capstone Studio

A polyglot architectural simulation studio and interactive capstone workbench for distributed real-time messaging systems (modeled on WhatsApp/Signal/Telegram).

## 🌟 Key Highlights
- **5 Engineering Tracks**: Client & Mobile, Edge & High-Concurrency, Microservices & Core, Data Pipelines & Analytics, Low-Level Systems & DevOps.
- **20 Programming Languages**: Dart, Kotlin, Swift, TypeScript, Go, Rust, C, C++, Java, Scala, C#, Ruby, PHP, Python, SQL, CQL, R, MATLAB, COBOL, Assembly x86_64.
- **Live Packet Flow Simulator**: Step-by-step E2E tracing across client crypto, epoll gateway dispatch, ratchet key rotation, Kafka streaming, and dual-database commits.
- **Microservice Topology Graph**: Visual inspection of 15+ distributed microservice nodes, protocols (gRPC, WebSockets, HTTP/3, Protobuf), and telemetry budgets.
- **ACID vs. NoSQL Storage Benchmarker**: PostgreSQL ACID vs. Cassandra time-series wide-column comparison.
- **AI Architecture Advisor**: Gemini 3.7 Flash powered interactive mentor.
`;
