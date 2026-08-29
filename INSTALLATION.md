# KayBiT_WhatsApp Capstone Studio: Native Multi-Platform Installation & Distribution Guide

This comprehensive guide explains how to package, build, automate, host, and distribute **KayBiT_WhatsApp Capstone Studio** as native applications for:
- 📱 **Android** (`.apk` direct download, `.aab` for Play Store)
- 🍏 **iOS** (PWA offline installation & TestFlight / App Store via Capacitor)
- 🪟 **Windows** (`.exe` installer & `.msi` enterprise package)
- 🍎 **macOS** (`.dmg` drag-and-drop & `.app` universal binary)
- 🌐 **Progressive Web App (PWA)** (one-click browser installation for Chromebooks, Linux, and any desktop/mobile device)

---

## Table of Contents
1. [Tooling Selection & Architecture Comparison](#1-tooling-selection--architecture-comparison)
2. [Project Restructuring for Native & Offline Compatibility](#2-project-restructuring-for-native--offline-compatibility)
3. [Step-by-Step Setup per Platform](#3-step-by-step-setup-per-platform)
   - [A. Android APK/AAB with Capacitor](#a-android-apkaab-with-capacitor)
   - [B. Windows (.exe/.msi) & macOS (.dmg) with Tauri v2](#b-windows-exemsi--macos-dmg-with-tauri-v2)
   - [C. Progressive Web App (PWA) Setup](#c-progressive-web-app-pwa-setup)
4. [Build Automation with CI/CD (GitHub Actions)](#4-build-automation-with-cicd-github-actions)
5. [Hosting, Storage & Download Portal Architecture](#5-hosting-storage--download-portal-architecture)
6. [Complete Concrete Configuration Files](#6-complete-concrete-configuration-files)
7. [Student Troubleshooting & OS-Specific Notes](#7-student-troubleshooting--os-specific-notes)

---

## 1. Tooling Selection & Architecture Comparison

When converting a modern React + Vite + TypeScript application into native packages, choosing the right runtime bridge is critical for performance, package size, memory footprint, and maintainability.

### Desktop: Tauri v2 vs. Electron

| Metric / Feature | **Tauri v2 (Recommended)** | **Electron** | **Why We Recommend Tauri v2** |
| :--- | :--- | :--- | :--- |
| **Binary Bundle Size** | **3 MB – 15 MB** | 80 MB – 180 MB | Tauri uses the OS's native webview (WebView2 on Windows, WebKit on macOS) rather than bundling Chromium. |
| **Idle RAM Usage** | **~25 MB – 40 MB** | ~150 MB – 350 MB | Essential for students running resource-heavy IDEs, Docker, and simulators simultaneously. |
| **Security Model** | Strict IPC allowlist, sandboxed Rust core | Node integration risks | Prevents remote code execution vulnerabilities in student environments. |
| **Multi-platform Build** | Single command for `.exe`, `.msi`, `.dmg`, `.app` | Requires complex `electron-builder` | Seamless GitHub Actions matrix support out-of-the-box. |

> 💡 **Verdict**: Use **Tauri v2** for Windows and macOS desktop installers. Use **Electron** only if you strictly require deep legacy Node.js C++ bindings that cannot be ported to Rust plugins.

---

### Mobile: Capacitor vs. Cordova vs. React Native

| Metric / Feature | **Capacitor 6+ (Recommended)** | **Apache Cordova** | **React Native** |
| :--- | :--- | :--- | :--- |
| **Codebase Reuse** | **100% of existing React/Vite code** | 100% | Requires rewriting DOM to native JSX primitives (`<View>`, `<Text>`) |
| **Build Pipeline** | Direct Gradle & Xcode integration | Outdated plugins | Custom Metro bundler |
| **Maintenance** | Actively maintained by Ionic team | Deprecated / Low maintenance | High maintenance overhead |
| **TypeScript Bridge** | First-class TypeScript plugin APIs | Archaic JS plugins | Native C++ / Java bridge |

> 💡 **Verdict**: Use **Capacitor 6** to wrap the existing Vite React codebase directly into native Android Studio and Xcode projects without rewriting any UI components.

---

## 2. Project Restructuring for Native & Offline Compatibility

To ensure the web app runs flawlessly whether hosted on a web domain or packaged inside a native container (where files are served via `capacitor://localhost` or `tauri://localhost`), make the following adaptations:

### 1. Relative Asset Paths in `vite.config.ts`
Set `base: './'` in `vite.config.ts` so that all script and asset URLs resolve relatively instead of assuming root `/` server hosting:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // CRITICAL for Capacitor and Tauri local asset resolution
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  }
});
```

### 2. Client-Side State & Offline Data Fallbacks
- All 20 language code snippets, architectural tracks, database benchmarks, and curriculum syllabi are bundled directly in the client bundle (`src/data/`).
- For user notes, custom code edits, and simulator configurations, store state in `localStorage` or `IndexedDB`.
- For the AI Architecture Advisor, implement graceful offline fallback detection (`navigator.onLine`) so students without an internet connection receive helpful offline tips.

### 3. Platform Detection Helper
Create `src/utils/platform.ts` to detect the running environment:

```typescript
// src/utils/platform.ts
export type PlatformType = 'web' | 'pwa' | 'android' | 'ios' | 'windows' | 'macos';

export function detectPlatform(): PlatformType {
  // Check if running inside Capacitor native container
  if ((window as any).Capacitor?.isNativePlatform()) {
    const plat = (window as any).Capacitor.getPlatform();
    return plat === 'ios' ? 'ios' : 'android';
  }
  
  // Check if running inside Tauri desktop container
  if ((window as any).__TAURI__) {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) return 'windows';
    if (userAgent.includes('mac')) return 'macos';
  }
  
  // Check if running as standalone PWA
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return 'pwa';
  }
  
  return 'web';
}
```

---

## 3. Step-by-Step Setup per Platform

### A. Android APK/AAB with Capacitor

#### Prerequisites
1. **Node.js 18+**
2. **Android Studio** (with Android SDK 34+, Build Tools, and JDK 17 installed)

#### Step 1: Install Capacitor CLI & Core
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/app @capacitor/splash-screen @capacitor/status-bar
npx cap init "KayBiT Capstone" "com.kaybit.capstone" --web-dir dist
```

#### Step 2: Build Web Assets & Add Android Platform
```bash
npm run build
npx cap add android
```

#### Step 3: Configure Android Permissions & App Name
Capacitor creates an `android/` directory containing a standard Android Studio project.
In `android/app/src/main/AndroidManifest.xml`:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="KayBiT WhatsApp Capstone"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme.NoActionBar">
        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

#### Step 4: Build the Release APK
```bash
# Sync web build to native android folder
npm run build
npx cap sync android

# Build unsigned debug or signed release APK
cd android
./gradlew assembleRelease
```
The output APK will be at:  
`android/app/build/outputs/apk/release/app-release-unsigned.apk`

---

### B. Windows (.exe/.msi) & macOS (.dmg) with Tauri v2

#### Prerequisites
1. **Rust & Cargo**: Install via [rustup.rs](https://rustup.rs) (`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`)
2. **Windows**: Visual Studio 2022 C++ Build Tools & WebView2 (pre-installed on Windows 10/11)
3. **macOS**: Xcode Command Line Tools (`xcode-select --install`)

#### Step 1: Initialize Tauri in the Project
```bash
npm install -D @tauri-apps/cli
npx tauri init
```
When prompted:
- App Name: `KayBiT_WhatsApp_Capstone`
- Window title: `KayBiT_WhatsApp Capstone Studio`
- Web assets location: `../dist`
- Dev server URL: `http://localhost:3000`
- Frontend dev command: `npm run dev`
- Frontend build command: `npm run build`

#### Step 2: Build for Windows & macOS
```bash
# Build production desktop installers
npm run build
npx tauri build
```
Outputs generated:
- **Windows**: `src-tauri/target/release/bundle/msi/KayBiT_WhatsApp_Capstone_1.0.0_x64_en-US.msi` and `src-tauri/target/release/bundle/nsis/KayBiT_WhatsApp_Capstone_1.0.0_x64-setup.exe`
- **macOS**: `src-tauri/target/release/bundle/dmg/KayBiT_WhatsApp_Capstone_1.0.0_aarch64.dmg` (Apple Silicon) and `_x64.dmg` (Intel)

---

### C. Progressive Web App (PWA) Setup

For instantaneous installation on Chromebooks, Linux, iPads, iPhones, and Android without app store friction:

#### Step 1: Add Web App Manifest
Create `/public/manifest.webmanifest`:
```json
{
  "name": "KayBiT_WhatsApp Capstone Studio",
  "short_name": "KayBiT Capstone",
  "description": "Multi-language architectural studio for distributed messaging systems",
  "start_url": "./",
  "display": "standalone",
  "background_color": "#020617",
  "theme_color": "#10b981",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

#### Step 2: Reference Manifest in `index.html`
```html
<link rel="manifest" href="/manifest.webmanifest" />
<meta name="theme-color" content="#10b981" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

---

## 4. Build Automation with CI/CD (GitHub Actions)

Here is the complete, production-ready `.github/workflows/build-native.yml` workflow file. Whenever you push a tag or trigger the workflow, it compiles:
- 🤖 **Android APK**
- 🪟 **Windows `.exe` and `.msi`**
- 🍎 **macOS `.dmg` (Universal & Apple Silicon)**
- 🚀 Automatically creates a **GitHub Release** with all direct download links!

```yaml
# .github/workflows/build-native.yml
name: Build Native Desktop & Mobile Installers

on:
  push:
    tags:
      - 'v*'
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: write

jobs:
  # ==========================================
  # 1. BUILD WINDOWS & MACOS (TAURI)
  # ==========================================
  build-tauri:
    strategy:
      fail-fast: false
      matrix:
        include:
          - platform: 'windows-latest'
            target: 'x86_64-pc-windows-msvc'
            artifact_name: 'windows-installer'
          - platform: 'macos-latest'
            target: 'aarch64-apple-darwin'
            artifact_name: 'macos-arm64-dmg'
          - platform: 'macos-13'
            target: 'x86_64-apple-darwin'
            artifact_name: 'macos-intel-dmg'

    runs-on: ${{ matrix.platform }}
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Setup Rust Toolchain
        uses: dtolnay/rust-toolchain@stable
        with:
          targets: ${{ matrix.target }}

      - name: Install Frontend Dependencies
        run: npm ci

      - name: Build Web Frontend
        run: npm run build

      - name: Build Tauri Desktop Bundle
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tagName: app-v__VERSION__
          releaseName: 'KayBiT Capstone Studio v__VERSION__'
          releaseBody: 'Direct downloads for Windows and macOS.'
          releaseDraft: false
          prerelease: false

  # ==========================================
  # 2. BUILD ANDROID APK (CAPACITOR)
  # ==========================================
  build-android:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Setup Java JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - name: Install Frontend Dependencies
        run: npm ci

      - name: Build Web Bundle & Sync Capacitor
        run: |
          npm run build
          npx cap sync android

      - name: Build Android Release APK
        working-directory: ./android
        run: |
          chmod +x ./gradlew
          ./gradlew assembleRelease --no-daemon

      - name: Upload Android APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: KayBiT_WhatsApp_Capstone_Android.apk
          path: android/app/build/outputs/apk/release/app-release-unsigned.apk
```

---

## 5. Hosting, Storage & Download Portal Architecture

To provide students with clean, fast, direct downloads from your custom website:

### Recommended Hosting Architectures

```
                    ┌────────────────────────────────────────┐
                    │      Your Educational Portal           │
                    │   https://capstone.youruniversity.edu  │
                    └──────────────────┬─────────────────────┘
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            ▼                          ▼                          ▼
 ┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
 │   GitHub Releases    │   │  AWS S3 + CloudFront │   │   Vercel / Netlify   │
 │ (Zero Cost & Fast)   │   │  (Custom Branded CDN)│   │  (Static Web Assets) │
 │                      │   │                      │   │                      │
 │ - android.apk        │   │ s3://downloads/      │   │ - Web App Preview    │
 │ - windows-setup.exe  │   │   ├── latest/        │   │ - Syllabus View      │
 │ - macos-apple.dmg    │   │   │   ├── win.exe    │   │ - Documentation      │
 │ - macos-intel.dmg    │   │   │   ├── mac.dmg    │   │                      │
 └──────────────────────┘   └──────────────────────┘   └──────────────────────┘
```

### 1. Zero-Cost GitHub Releases (Recommended for Universities)
Link directly to your release assets:
- `https://github.com/YOUR_ORG/YOUR_REPO/releases/latest/download/KayBiT_WhatsApp_Capstone_Setup.exe`
- `https://github.com/YOUR_ORG/YOUR_REPO/releases/latest/download/KayBiT_WhatsApp_Capstone_Universal.dmg`
- `https://github.com/YOUR_ORG/YOUR_REPO/releases/latest/download/KayBiT_WhatsApp_Capstone.apk`

### 2. S3 Bucket Structure & Auto-Update Endpoint
If hosting on AWS S3 or Cloudflare R2:
```
s3://your-capstone-downloads/
├── v1.2.0/
│   ├── KayBiT_WhatsApp_Capstone_1.2.0_x64-setup.exe
│   ├── KayBiT_WhatsApp_Capstone_1.2.0_aarch64.dmg
│   └── KayBiT_WhatsApp_Capstone_1.2.0.apk
├── latest/
│   ├── version.json
│   ├── windows.exe  (symlink / copied object)
│   ├── macos.dmg
│   └── android.apk
```

`version.json` structure for auto-updates or client badge query:
```json
{
  "version": "1.2.0",
  "releaseDate": "2026-08-27",
  "platforms": {
    "windows": {
      "url": "https://downloads.yoursite.com/latest/windows.exe",
      "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    "macos": {
      "url": "https://downloads.yoursite.com/latest/macos.dmg",
      "sha256": "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a"
    },
    "android": {
      "url": "https://downloads.yoursite.com/latest/android.apk",
      "sha256": "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d"
    }
  }
}
```

### 3. Student OS Auto-Detection Script
Embed this lightweight JavaScript component on your website to automatically highlight the student's operating system:

```javascript
function getStudentOS() {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return 'Android';
  if (/iPad|iPhone|iPod/.test(ua)) return 'iOS';
  if (/Win/i.test(ua)) return 'Windows';
  if (/Mac/i.test(ua)) return 'macOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Web';
}
```

---

## 6. Complete Concrete Configuration Files

### `capacitor.config.ts`
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kaybit.capstone',
  appName: 'KayBiT WhatsApp Capstone',
  webDir: 'dist',
  bundledWebRuntime: false,
  backgroundColor: '#020617',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#020617',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#020617',
    },
  },
};

export default config;
```

---

### `src-tauri/tauri.conf.json`
```json
{
  "$schema": "https://raw.githubusercontent.com/tauri-apps/tauri/dev/tooling/cli/schema.json",
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
        "minWidth": 960,
        "minHeight": 640,
        "resizable": true,
        "fullscreen": false,
        "theme": "Dark"
      }
    ],
    "security": {
      "csp": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://generativelanguage.googleapis.com"
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "windows": {
      "certificateThumbprint": null,
      "digestAlgorithm": "sha256",
      "timestampUrl": ""
    },
    "macOS": {
      "frameworks": [],
      "minimumSystemVersion": "10.13"
    }
  }
}
```

---

### `src-tauri/Cargo.toml`
```toml
[package]
name = "kaybit-whatsapp-capstone"
version = "1.0.0"
description = "KayBiT_WhatsApp Capstone Studio Native Desktop Runner"
authors = ["KayBiT Engineering Education"]
edition = "2021"

[build-dependencies]
tauri-build = { version = "2.0.0", features = [] }

[dependencies]
tauri = { version = "2.0.0", features = [] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

[profile.release]
panic = "abort"
codegen-units = 1
lto = true
opt-level = "z" # Optimize for binary size
strip = true
```

---

## 7. Student Troubleshooting & OS-Specific Notes

### Windows SmartScreen Notice
- **Symptom**: When launching an unsigned `.exe` for the first time, Windows displays *"Windows protected your PC (SmartScreen)"*.
- **Solution for Students**: Click **"More info"** -> **"Run anyway"**. To eliminate this permanently for university deployment, sign the executable using an EV Code Signing Certificate or an internal institutional Active Directory certificate.

### macOS Gatekeeper Notice
- **Symptom**: macOS alerts *"KayBiT_WhatsApp_Capstone cannot be opened because it is from an unidentified developer"*.
- **Solution for Students**: Right-click (or Control-click) the app in `/Applications` and select **"Open"**, then click **"Open"** in the confirmation dialog. Alternatively, in Terminal: `xattr -cr /Applications/KayBiT_WhatsApp_Capstone.app`.

### Android "Unknown Sources" Install
- **Symptom**: Android blocks installing `.apk` files downloaded from Chrome/browser.
- **Solution for Students**: Go to **Settings > Apps > Chrome (or Files) > Install unknown apps > Allow from this source**.

---

*KayBiT_WhatsApp Capstone Studio • Multi-Platform Distribution Architecture*
