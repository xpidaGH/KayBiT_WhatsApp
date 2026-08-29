# KayBiT_WhatsApp Capstone Studio

[![Multi-Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Android%20%7C%20Windows%20%7C%20macOS-emerald.svg)](INSTALLATION.md)
[![Engineering Tracks](https://img.shields.io/badge/Tracks-5%20Specialized%20Domains-blue.svg)](#5-engineering-tracks)
[![Languages](https://img.shields.io/badge/Languages-20%20Polyglot%20Engines-purple.svg)](#20-programming-languages)
[![License](https://img.shields.io/badge/License-MIT-slate.svg)](#license)

> **A comprehensive, polyglot architectural simulation studio and interactive capstone workbench for distributed real-time messaging systems (modeled on WhatsApp/Signal/Telegram).**

---

## 🌟 Key Highlights

- **5 Deep Engineering Tracks**: Frontend & Mobile, Edge & High-Concurrency Gateways, Microservices & Core Business, Data Pipelines & Analytics, Low-Level Systems & DevOps.
- **20 Programming Languages**: Production-grade reference code, compilation benchmarks, and architectural designs across Dart, Kotlin, Swift, TypeScript, Go, Rust, C, C++, Java, Scala, C#, Ruby, PHP, Python, SQL, CQL, R, MATLAB, COBOL, and Assembly (x86_64).
- **Interactive Live Packet Simulator**: Step-by-step E2E tracing of encrypted message packets through client encryption, epoll gateway dispatch, ratchet key rotation, Kafka streaming, and dual-database commits.
- **Microservice Topology Graph**: Visual inspection of 15+ distributed microservice nodes, protocols (gRPC, WebSockets, HTTP/3, Protobuf), and telemetry budgets.
- **ACID vs. NoSQL Storage Benchmarker**: Hands-on comparisons between transactional engines (PostgreSQL) and time-series LSM distributed databases (Cassandra/ScyllaDB).
- **AI Architecture Advisor**: In-app Gemini-powered architectural mentor that inspects code in real-time, explains distributed systems concepts, and suggests optimizations.
- **5-Sprint Capstone Syllabus**: Full semester-ready curriculum with acceptance criteria, grading rubrics, and downloadable Protobuf v3 specifications.
- **Cross-Platform Native Wrappers**: Complete configuration and CI/CD pipelines to build standalone **Android APKs**, **Windows .exe/.msi installers**, **macOS .dmg packages**, and **PWAs**.

---

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 18+ or Bun
- npm or yarn

### Installation & Run

```bash
# 1. Clone or download the repository
git clone https://github.com/your-org/kaybit-whatsapp-capstone.git
cd kaybit-whatsapp-capstone

# 2. Install dependencies
npm install

# 3. (Optional) Set up your Gemini API key in .env
cp .env.example .env
# Edit .env and add: GEMINI_API_KEY=your_key_here

# 4. Start the development server
npm run dev
```

Visit `http://localhost:3000` in your web browser.

---

## 🛠️ 5 Engineering Tracks

```
                                  [ Client Layer ]
              ┌───────────────┬────────────────┬──────────────┐
              │ Dart (Flutter)│ Kotlin(Android)│  Swift (iOS) │ TypeScript(Web)
              └───────┬───────┴────────┬───────┴──────┬───────┘
                      │                │              │
                      ▼                ▼              ▼
                      =================================
                      TRACK 1: CLIENT & MOBILE APPS
                      =================================
                                       │ (TLS / Protobuf)
                                       ▼
                      =================================
                      TRACK 2: EDGE & HIGH-CONCURRENCY
                      =================================
              ┌───────────────┬────────────────┬──────────────┐
              │   Go (Epoll)  │  Rust (Tokio)  │ C (Crypto)   │ C++ (ZeroCopy)
              └───────┬───────┴────────┬───────┴──────┬───────┘
                      │                │              │
                      ▼                ▼              ▼
                      =================================
                      TRACK 3: MICROSERVICES & CORE
                      =================================
              ┌───────────────┬────────────────┬──────────────┐
              │ Java (Spring) │ Scala (Akka)   │ C# (.NET 8)  │ Ruby / PHP
              └───────┬───────┴────────┬───────┴──────┬───────┘
                      │                │              │
                      ▼                ▼              ▼
                      =================================
                      TRACK 4: DATA & STORAGE ENGINES
                      =================================
              ┌───────────────┬────────────────┬──────────────┐
              │ Python (ML)   │ PostgreSQL     │ Cassandra    │ R / MATLAB
              └───────┬───────┴────────┬───────┴──────┬───────┘
                      │                │              │
                      ▼                ▼              ▼
                      =================================
                      TRACK 5: LOW-LEVEL & DEVOPS
                      =================================
              ┌───────────────┬────────────────┬──────────────┐
              │ COBOL(Billing)│ Assembly(SIMD) │ Bash (CI/CD) │ PowerShell
              └───────────────┴────────────────┴──────────────┘
```

---

## 💻 20 Programming Languages

| # | Language | Role in KayBiT_WhatsApp | File Spec |
|---|:---|:---|:---|
| 1 | **Dart** | Flutter cross-platform mobile chat interface | `lib/chat_view.dart` |
| 2 | **Kotlin** | Native Android SQLite chat cache & Room DAO | `ChatDatabase.kt` |
| 3 | **Swift** | iOS SwiftData & CryptoKit biometric auth | `SecureKeyStore.swift` |
| 4 | **TypeScript** | Real-time React Web client & WebSockets | `ChatClient.ts` |
| 5 | **Go** | Epoll high-concurrency edge gateway (1M conns) | `gateway_epoll.go` |
| 6 | **Rust** | Zero-copy packet serializer & memory safety | `packet_router.rs` |
| 7 | **C** | AVX2 Double Ratchet cryptographic engine | `signal_ratchet.c` |
| 8 | **C++** | High-performance circular ring buffer | `ring_buffer.hpp` |
| 9 | **Java** | Spring Boot enterprise user identity & JWT | `UserService.java` |
| 10 | **Scala** | Akka cluster actor system for group fanout | `GroupChatActor.scala` |
| 11 | **C#** | .NET 8 media transcoding & chunked upload | `MediaTranscoder.cs` |
| 12 | **Ruby** | Webhook orchestration & third-party bots | `webhook_dispatcher.rb` |
| 13 | **PHP** | Swoole async worker for push notifications | `PushWorker.php` |
| 14 | **Python** | Real-time spam detection & sentiment ML | `spam_classifier.py` |
| 15 | **SQL** | PostgreSQL relational partition & ACID accounts | `001_schema.sql` |
| 16 | **CQL** | Cassandra time-series chat message logs | `schema.cql` |
| 17 | **R** | Message throughput & anomaly detection | `traffic_analysis.R` |
| 18 | **MATLAB** | Opus voice codec signal processing & FFT | `voice_dsp.m` |
| 19 | **COBOL** | Legacy telecom billing & SMS interconnect | `TELECOM-BILLING.cbl` |
| 20 | **Assembly** | x86_64 SIMD AVX2 SHA-256 micro-accelerator | `sha256_avx2.asm` |

---

## 📦 Native Distribution & Installation

Students and instructors can download native packages directly:
- **Windows**: `.exe` / `.msi` (Tauri v2, lightweight < 8MB RAM)
- **macOS**: `.dmg` (Universal binary for M-series Apple Silicon & Intel)
- **Android**: `.apk` / `.aab` (Capacitor wrapper)
- **iOS / Web**: Progressive Web App (PWA) with offline service workers

👉 **Read [`INSTALLATION.md`](INSTALLATION.md)** for complete step-by-step guides, tooling recommendations, and GitHub Actions CI/CD workflows.

---

## 📖 In-App User Guide

Open the in-app **User Guide** by clicking the **"User Guide"** button in the header navigation or press `Ctrl + U` / `Cmd + U`.  
The full text is also available in [`USER_GUIDE.md`](USER_GUIDE.md).

---

## 🧪 Production Build & Container Deployment

```bash
# Build the production assets and bundle the server
npm run build

# Start production server
npm start
```

---

## 📜 License

This capstone project is licensed under the MIT License — free for educational, institutional, and research use.
