import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health route
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      platform: "KayBiT_WhatsApp Capstone Studio",
      timestamp: new Date().toISOString(),
      activeTracks: 5,
      supportedLanguages: 20,
    });
  });

  // Server-side Gemini AI Tutor for students
  app.post("/api/gemini/tutor", async (req, res) => {
    try {
      const { question, trackId, language, codeSnippet, context } = req.body;

      const ai = getGenAI();
      if (!ai) {
        return res.status(503).json({
          error: "Gemini API key is not configured in the server environment.",
          fallbackAnswer: `Architecture Note on ${language || "System"}: In KayBiT_WhatsApp's distributed architecture, ${language || "this component"} interacts across tracks using strict protocol contracts (Protobuf/gRPC and binary TLV). Review the Code Workbench for runnable test implementations.`,
        });
      }

      const prompt = `You are the Lead Distributed Systems Architect and Academic Capstone Advisor for KayBiT_WhatsApp (a high-scale mobile messaging system distributed across 5 core engineering tracks and 20 languages).

Context:
- Track: ${trackId || "General Architecture"}
- Language/Technology: ${language || "Multi-language Ecosystem"}
- Student Context: ${context || "Advanced Systems & Programming Capstone"}
${codeSnippet ? `\nCode Snippet:\n\`\`\`\n${codeSnippet}\n\`\`\`\n` : ""}

Student Query:
${question}

Provide an authoritative, clear, educational explanation. Include concrete architectural principles (e.g. zero-copy serialization, memory safety, actor model, compound partition keys, epoll concurrency, or low-level sysctl limits) and practical coding suggestions. Use Markdown formatting. Keep it focused and deeply technical yet accessible for advanced engineering students.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
      });

      res.json({
        answer: response.text,
      });
    } catch (err: unknown) {
      console.error("Gemini API Error:", err);
      const message = err instanceof Error ? err.message : "Failed to generate AI advice";
      res.status(500).json({ error: message });
    }
  });

  // Pipeline simulation benchmark helper
  app.post("/api/simulate/pipeline", (req, res) => {
    const { messageType = "text", payloadSize = 256, networkProfile = "4g_lte", securityLevel = "signal_double_ratchet" } = req.body;

    const baseLatencies: Record<string, number> = {
      "flutter_ui_render": 4.2,
      "kotlin_native_bridge": 1.1,
      "typescript_signal_ratchet": 3.8,
      "rust_zero_copy_protobuf": 0.4,
      "go_edge_gateway_epoll": 1.8,
      "python_ml_spam_worker": 14.5,
      "java_spring_graph_actor": 5.2,
      "scylla_ledger_write": 2.1,
      "postgres_acid_sync": 4.6,
      "cpp_webrtc_jitter_buffer": 2.4,
      "csharp_media_transcoder": messageType === "media" ? 68.0 : 0.0,
      "devops_telemetry_emit": 0.3,
    };

    const multiplier = networkProfile === "5g" ? 0.7 : networkProfile === "4g_lte" ? 1.0 : 2.4;
    const sizeMultiplier = Math.max(1, payloadSize / 512);

    const stages = Object.entries(baseLatencies).map(([stage, latency]) => ({
      stage,
      latencyMs: +(latency * multiplier * (stage.includes("transcoder") ? sizeMultiplier : 1)).toFixed(2),
      status: "completed",
    }));

    const totalDuration = stages.reduce((acc, curr) => acc + curr.latencyMs, 0);

    res.json({
      success: true,
      traceId: `TRACE-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      totalDurationMs: +totalDuration.toFixed(2),
      stages,
      timestamp: Date.now(),
      securityProtocol: securityLevel,
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`KayBiT_WhatsApp Capstone Studio running on http://localhost:${PORT}`);
  });
}

startServer();
