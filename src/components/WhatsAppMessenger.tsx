import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Phone, 
  Video, 
  CircleDot, 
  Search, 
  MoreVertical, 
  Paperclip, 
  Mic, 
  Send, 
  Smile, 
  Lock, 
  Check, 
  CheckCheck, 
  Image as ImageIcon, 
  FileText, 
  Camera, 
  Play, 
  Pause, 
  Volume2, 
  Activity, 
  Cpu, 
  Server, 
  Database, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  X, 
  Maximize2, 
  Minimize2,
  PhoneOff,
  MicOff,
  Radio,
  Zap,
  HardDrive,
  Bell,
  BellRing,
  Mail,
  MailCheck,
  Filter,
  Trash2,
  VolumeX,
  RotateCcw,
  Headphones
} from 'lucide-react';
import { 
  WhatsAppChat, 
  WhatsAppContact, 
  WhatsAppMessage, 
  WhatsAppStatusStory, 
  WhatsAppCallLog, 
  ArchitecturePipelineStep 
} from '../types';
import { 
  INITIAL_CHATS, 
  INITIAL_CONTACTS, 
  INITIAL_MESSAGES, 
  INITIAL_STATUS_STORIES, 
  INITIAL_CALL_LOGS 
} from '../data/whatsappData';

interface WhatsAppMessengerProps {
  onOpenAiTutorWithContext?: (contextText: string) => void;
  onNavigateToCode?: (languageId: string) => void;
  onNavigateToDatabase?: () => void;
}

export interface TypingIndicatorState {
  chatId: string;
  senderName: string;
  senderAvatar: string;
  tierInfo: string;
  isAiBackend?: boolean;
}

export const WhatsAppMessenger: React.FC<WhatsAppMessengerProps> = ({
  onOpenAiTutorWithContext,
  onNavigateToCode,
  onNavigateToDatabase,
}) => {
  // Navigation tabs in WhatsApp sidebar
  const [sidebarTab, setSidebarTab] = useState<'chats' | 'status' | 'calls'>('chats');
  const [chatsFilterMode, setChatsFilterMode] = useState<'all' | 'unread'>('all');
  const [chats, setChats] = useState<WhatsAppChat[]>(INITIAL_CHATS);
  const [selectedChatId, setSelectedChatId] = useState<string>('chat-ai-agent');
  const [messagesMap, setMessagesMap] = useState<Record<string, WhatsAppMessage[]>>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [messageSearchQuery, setMessageSearchQuery] = useState<string>('');
  const [showMessageSearchBar, setShowMessageSearchBar] = useState<boolean>(false);
  const [showAttachMenu, setShowAttachMenu] = useState<boolean>(false);
  const [showPipelineHud, setShowPipelineHud] = useState<boolean>(true);

  // Visual Real-time Typing Indicator State (Simulates AI & Multi-Tier Backend arrival)
  const [typingState, setTypingState] = useState<Record<string, TypingIndicatorState | null>>({});

  // Message Reaction Popover & State
  const [activeReactionMenuMsgId, setActiveReactionMenuMsgId] = useState<string | null>(null);
  const [showEmojiPickerBar, setShowEmojiPickerBar] = useState<boolean>(false);

  // Active call modal and calling overlay state
  const [activeCall, setActiveCall] = useState<{
    contactName: string;
    avatar: string;
    type: 'audio' | 'video';
    durationSec: number;
    isMuted: boolean;
    stage: 'initiating' | 'ringing' | 'connected';
    sipSignalingServer?: string;
    sdpExchangeStatus?: string;
    iceCandidateFound?: boolean;
    packetLossPct?: number;
    rttMs?: number;
  } | null>(null);

  // Status story modal
  const [activeStory, setActiveStory] = useState<WhatsAppStatusStory | null>(null);

  // Audio note recording & simulation state
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [recordingDurationSec, setRecordingDurationSec] = useState<number>(0);
  const [liveWaveformBars, setLiveWaveformBars] = useState<number[]>([
    35, 55, 75, 40, 85, 60, 95, 30, 70, 80, 50, 90, 65, 45, 80, 55, 70, 40
  ]);
  const [recordingPresetText, setRecordingPresetText] = useState<string>(
    '🎙️ Architecture Voice Note: Cassandra SSTable partition compaction & X3DH key rotation'
  );

  // Audio note playback simulation & speeds
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [voiceProgress, setVoiceProgress] = useState<number>(0);
  const [voicePlaybackSpeed, setVoicePlaybackSpeed] = useState<1 | 1.5 | 2>(1);

  // Web Audio Synthesizer reference for pleasant simulated voice note acoustics
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);

  const stopSynthesizerAudio = () => {
    try {
      if (synthNodesRef.current) {
        const { osc, gain } = synthNodesRef.current;
        gain.gain.setValueAtTime(gain.gain.value, audioCtxRef.current?.currentTime || 0);
        gain.gain.linearRampToValueAtTime(
          0.0001,
          (audioCtxRef.current?.currentTime || 0) + 0.05
        );
        setTimeout(() => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
          synthNodesRef.current = null;
        }, 60);
      }
    } catch {
      synthNodesRef.current = null;
    }
  };

  const startSynthesizerAudio = (speed: number = 1) => {
    stopSynthesizerAudio();
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const baseFreq = 280 * (speed === 1 ? 1 : speed === 1.5 ? 1.25 : 1.4);
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.95, ctx.currentTime + 0.7);

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      synthNodesRef.current = { osc, gain };
    } catch {
      // Graceful fallback if Web Audio is restricted in iframe
    }
  };

  // Real-time architecture pipeline animation state
  const [activePipelineStep, setActivePipelineStep] = useState<number | null>(null);
  const [latestPipelineLog, setLatestPipelineLog] = useState<{
    msgText: string;
    totalMs: number;
    steps: ArchitecturePipelineStep[];
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesMap, selectedChatId]);

  // Call timer simulation & VoIP signaling state progression
  useEffect(() => {
    let interval: any;
    if (activeCall) {
      interval = setInterval(() => {
        setActiveCall((prev) => {
          if (!prev) return null;
          // Progress stages: initiating (0-2s) -> ringing (2-5s) -> connected (5s+)
          let nextStage = prev.stage;
          let sdpStatus = prev.sdpExchangeStatus;
          let iceFound = prev.iceCandidateFound;
          
          if (prev.durationSec === 1 && prev.stage === 'initiating') {
            nextStage = 'ringing';
            sdpStatus = 'SIP INVITE 180 Ringing • SDP Offer/Answer Matched';
            iceFound = true;
          } else if (prev.durationSec >= 4 && prev.stage === 'ringing') {
            nextStage = 'connected';
            sdpStatus = 'SIP 200 OK • WebRTC SRTP Media Stream Connected';
            iceFound = true;
          }

          return {
            ...prev,
            durationSec: prev.durationSec + 1,
            stage: nextStage,
            sdpExchangeStatus: sdpStatus,
            iceCandidateFound: iceFound,
            rttMs: nextStage === 'connected' ? 14 + (prev.durationSec % 5) : 28,
            packetLossPct: 0.0,
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  // Voice playback simulation loop with speed scaling and audio synthesizer
  useEffect(() => {
    let interval: any;
    if (playingVoiceId) {
      startSynthesizerAudio(voicePlaybackSpeed);
      const stepMs = Math.max(80, Math.round(200 / voicePlaybackSpeed));
      interval = setInterval(() => {
        setVoiceProgress((prev) => {
          if (prev >= 100) {
            setPlayingVoiceId(null);
            stopSynthesizerAudio();
            return 0;
          }
          return prev + 4;
        });
      }, stepMs);
    } else {
      stopSynthesizerAudio();
    }
    return () => {
      clearInterval(interval);
      stopSynthesizerAudio();
    };
  }, [playingVoiceId, voicePlaybackSpeed]);

  // Voice recording timer and live dynamic soundwave simulation
  useEffect(() => {
    let durationInterval: any;
    let waveformInterval: any;

    if (isRecordingVoice) {
      durationInterval = setInterval(() => {
        setRecordingDurationSec((prev) => prev + 1);
      }, 1000);

      waveformInterval = setInterval(() => {
        setLiveWaveformBars(() =>
          Array.from({ length: 18 }, () => Math.floor(Math.random() * 75) + 25)
        );
      }, 80);
    }

    return () => {
      clearInterval(durationInterval);
      clearInterval(waveformInterval);
    };
  }, [isRecordingVoice]);

  const activeChat = chats.find((c) => c.id === selectedChatId) || chats[0];
  const currentMessages = messagesMap[selectedChatId] || [];

  // Total Unread Messages Count across all conversations
  const totalUnreadCount = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  // Filter chats by search and unread filter mode
  const filteredChats = chats.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (c.lastMessage?.text && c.lastMessage.text.toLowerCase().includes(searchFilter.toLowerCase()));
    const matchesFilter = chatsFilterMode === 'unread' ? (c.unreadCount || 0) > 0 : true;
    return matchesSearch && matchesFilter;
  });

  // Handle chat selection and clear unread badge for the newly opened chat
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Toggle Mark As Read / Mark As Unread for a conversation
  const handleToggleMarkUnread = (chatId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          const nextCount = (c.unreadCount || 0) > 0 ? 0 : 1;
          return { ...c, unreadCount: nextCount };
        }
        return c;
      })
    );
  };

  // Mark all chats as read
  const handleMarkAllAsRead = () => {
    setChats((prev) => prev.map((c) => ({ ...c, unreadCount: 0 })));
  };

  // Simulate receiving a live incoming message to test notification badges
  const handleSimulateIncomingMessage = (targetChatId?: string) => {
    const candidates = chats.filter((c) => c.id !== selectedChatId);
    const target = targetChatId 
      ? chats.find((c) => c.id === targetChatId) || chats[0]
      : candidates.length > 0
      ? candidates[Math.floor(Math.random() * candidates.length)]
      : chats[0];

    const simulatedAlerts = [
      '⚡ Cassandra SSTable partition compaction completed (0 read latency spikes).',
      '🔒 X3DH Ephemeral Key Ratchet stepped forward. New prekey bundle generated.',
      '🚀 Go Edge gateway handled 25,000 new WebSocket connections in 40ms.',
      '🎙️ Opus audio transcoding worker optimized to 48kHz stereo stream.',
      '📱 Flutter Impeller Dart pipeline rendered 120 FPS frame with zero jank.',
      '📊 Java Netty gRPC presence cluster reporting 99.999% node uptime.',
      '🦀 Rust Nom zero-copy deserializer decoded Protobuf binary chunk in 0.11µs.',
      '🛡️ C Crypto libsodium zeroed master session keys from volatile memory.'
    ];
    const text = simulatedAlerts[Math.floor(Math.random() * simulatedAlerts.length)];
    const newMsgId = `msg-sim-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const simMsg: WhatsAppMessage = {
      id: newMsgId,
      chatId: target.id,
      senderId: target.id.replace('chat-', 'user-'),
      senderName: target.name.replace(/^[^\w\s]+/, '').trim(),
      isOutgoing: false,
      text,
      timestamp,
      status: 'delivered',
      type: 'text',
      isEncrypted: true,
      ratchetKeyId: `RATCHET-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      architecturePipelineRecord: {
        flutterClientId: 'Flutter-Dart-Client',
        goGatewayNode: 'Edge-Gateway-Node-02',
        internalRpcService: 'Java-gRPC-Broker',
        persistedStorage: ['Cassandra'],
        totalLatencyMs: 1.8,
      },
    };

    setMessagesMap((prev) => ({
      ...prev,
      [target.id]: [...(prev[target.id] || []), simMsg],
    }));

    setChats((prev) =>
      prev.map((c) =>
        c.id === target.id
          ? {
              ...c,
              lastMessage: simMsg,
              unreadCount: c.id === selectedChatId ? 0 : (c.unreadCount || 0) + 1,
            }
          : c
      )
    );
  };

  // Start simulated voice audio recording
  const startRecordingVoice = () => {
    setIsRecordingVoice(true);
    setRecordingDurationSec(0);
    setRecordingPresetText('🎙️ Architecture Voice Note: Cassandra SSTable partition compaction & X3DH key rotation');
    setLiveWaveformBars([40, 65, 85, 30, 90, 60, 45, 80, 50, 95, 70, 35, 75, 55, 85, 60, 40, 70]);
    setShowEmojiPickerBar(false);
    setShowAttachMenu(false);
  };

  // Cancel & discard recorded voice buffer
  const cancelRecordingVoice = () => {
    setIsRecordingVoice(false);
    setRecordingDurationSec(0);
  };

  // Finalize & dispatch the recorded audio clip
  const sendRecordedVoice = (customDescription?: string) => {
    const duration = Math.max(recordingDurationSec, 3);
    const description = customDescription || recordingPresetText || '🎙️ Encrypted Voice Note (Opus 48kHz, Double Ratchet SRTP)';

    handleSendMessage('voice', undefined, {
      durationSec: duration,
      description: description,
    });

    setIsRecordingVoice(false);
    setRecordingDurationSec(0);
  };

  // Toggle voice playback state
  const handleToggleVoicePlayback = (msgId: string) => {
    if (playingVoiceId === msgId) {
      setPlayingVoiceId(null);
      stopSynthesizerAudio();
    } else {
      setPlayingVoiceId(msgId);
      setVoiceProgress(0);
    }
  };

  // Scrub to specific position on voice note waveform
  const handleScrubVoice = (msgId: string, percentage: number) => {
    setPlayingVoiceId(msgId);
    setVoiceProgress(Math.min(100, Math.max(0, percentage)));
  };

  // Cycle playback speed 1x -> 1.5x -> 2x
  const cyclePlaybackSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVoicePlaybackSpeed((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1));
  };

  // Filter current chat message history by messageSearchQuery
  const filteredMessages = messageSearchQuery.trim()
    ? currentMessages.filter((msg) => {
        const q = messageSearchQuery.toLowerCase();
        const textMatch = msg.text?.toLowerCase().includes(q);
        const senderMatch = msg.senderName?.toLowerCase().includes(q);
        const mediaMatch = msg.mediaName?.toLowerCase().includes(q);
        const ratchetMatch = msg.ratchetKeyId?.toLowerCase().includes(q);
        const storageMatch = msg.architecturePipelineRecord?.persistedStorage?.some((s) => s.toLowerCase().includes(q));
        return textMatch || senderMatch || mediaMatch || ratchetMatch || storageMatch;
      })
    : currentMessages;

  // Helper to highlight matching text occurrences in message search
  const renderHighlightedText = (text: string, query: string) => {
    if (!query.trim() || !text) return text;
    try {
      const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'gi');
      const parts = text.split(regex);
      return parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-amber-400/90 text-slate-950 font-bold px-0.5 rounded shadow-sm"
          >
            {part}
          </mark>
        ) : (
          part
        )
      );
    } catch {
      return text;
    }
  };

  // Helper: Generate contextual multi-tier backend responses & latency telemetry
  const getBackendResponse = (
    chatId: string,
    text: string,
    type: 'text' | 'image' | 'voice'
  ): {
    responderName: string;
    responderAvatar: string;
    responderTier: string;
    isAi: boolean;
    replyMsg: WhatsAppMessage;
  } => {
    const lower = text.toLowerCase();
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (chatId === 'chat-ai-agent') {
      let replyContent = '🤖 **KayBiT AI Co-Pilot**: Packet parsed and validated across all 5 tiers. Real-time Protobuf contract verified and Cassandra partition updated in 2.1ms.';
      let latency = 2.1;

      if (lower.includes('latency') || lower.includes('speed') || lower.includes('p99') || lower.includes('performance')) {
        replyContent = '⚡ **P99 Multi-Tier Latency Report**: Go Epoll WebSocket TLS 1.3 edge handshake: 0.9ms • Rust Nom Protobuf deserializer: 0.14µs • Java Netty gRPC Presence lookup: 1.2ms • Cassandra Wide-Column SSTable Commit: 1.6ms. **Total round-trip latency:** 3.84ms.';
        latency = 3.84;
      } else if (lower.includes('ratchet') || lower.includes('crypto') || lower.includes('encrypt') || lower.includes('security') || lower.includes('signal') || lower.includes('x3dh')) {
        replyContent = '🔐 **Signal Double Ratchet Verification**: Handshake derived via X3DH & Curve25519 with AES-256-GCM. Each outbound frame automatically advances the DH and KDF ratchet chains, ensuring complete forward secrecy and post-compromise security.';
        latency = 2.4;
      } else if (lower.includes('cassandra') || lower.includes('postgres') || lower.includes('database') || lower.includes('sql') || lower.includes('storage') || lower.includes('nosql')) {
        replyContent = '🗄️ **Storage Tier Partitioning**: User credentials & OAuth tokens live in PostgreSQL with row-level locks. High-throughput chat streams are append-only indexed in Cassandra / ScyllaDB partitioned by `(chat_id, bucket)` with replication factor 3 and LOCAL_QUORUM.';
        latency = 2.9;
      } else if (lower.includes('go') || lower.includes('websocket') || lower.includes('epoll') || lower.includes('gateway') || lower.includes('connection')) {
        replyContent = '🚀 **Edge Ingress Gateway**: Go epoll non-blocking socket loops maintain 1,048,576 persistent WebSocket connections per node with zero-allocation memory pooling and TLS 1.3 multiplexing.';
        latency = 1.9;
      } else if (lower.includes('media') || lower.includes('voice') || lower.includes('video') || lower.includes('ffmpeg') || lower.includes('opus')) {
        replyContent = '🎙️ **Media & Hardware Pipeline**: 48kHz Opus voice notes and VP9 video packets bypass Java/SQL and stream over WebRTC UDP RTP directly to C# .NET FFmpeg workers and MinIO S3 Object Storage.';
        latency = 8.6;
      } else if (type === 'image') {
        replyContent = '📷 **Media Ingest Acknowledged**: C# .NET FFmpeg worker generated thumbnail preview in 9.2ms. Blob stored to MinIO S3 and indexed in Cassandra message table.';
        latency = 11.4;
      } else if (type === 'voice') {
        replyContent = '🎙️ **Opus Voice Stream Decoded**: Audio sampled at 48kHz Stereo via Native HAL. Jitter buffer: 6ms, zero packet loss over UDP.';
        latency = 14.2;
      }

      return {
        responderName: 'KayBiT AI Architecture Co-Pilot',
        responderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
        responderTier: 'Tier 3 Distributed AI Engine (Gemini / Python / Java)',
        isAi: true,
        replyMsg: {
          id: `msg-ai-${Date.now()}`,
          chatId,
          senderId: 'user-ai-agent',
          senderName: 'KayBiT AI Architecture Co-Pilot',
          isOutgoing: false,
          text: replyContent,
          timestamp: ts,
          status: 'read' as const,
          type: 'text' as const,
          isEncrypted: true,
          ratchetKeyId: `RATCHET-AI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          architecturePipelineRecord: {
            flutterClientId: 'Flutter-Dart-v3.4',
            goGatewayNode: 'Go-Edge-Node-AI',
            internalRpcService: 'Python-Gemini-Bridge',
            persistedStorage: ['Cassandra', 'PostgreSQL'],
            totalLatencyMs: latency,
          },
        },
      };
    }

    if (chatId === 'chat-elena') {
      return {
        responderName: 'Dr. Elena Rostova',
        responderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        responderTier: 'Tier 3 Cryptographic SIMD Core (Rust / C)',
        isAi: false,
        replyMsg: {
          id: `msg-elena-${Date.now()}`,
          chatId,
          senderId: 'user-elena',
          senderName: 'Dr. Elena Rostova',
          isOutgoing: false,
          text: '🦀 Rust Nom zero-copy parser confirmed: SIMD key rotation executed in 0.12µs without heap allocations. Double Ratchet forward secrecy updated successfully.',
          timestamp: ts,
          status: 'read' as const,
          type: 'text' as const,
          isEncrypted: true,
          ratchetKeyId: 'RATCHET-ELENA-RUST-ACK',
          architecturePipelineRecord: {
            flutterClientId: 'Flutter-Dart-Client',
            goGatewayNode: 'Edge-Gateway-Pod-02',
            internalRpcService: 'Rust-SIMD-Engine',
            persistedStorage: ['Cassandra'],
            totalLatencyMs: 1.8,
          },
        },
      };
    }

    if (chatId === 'chat-alex') {
      return {
        responderName: 'Alex Chen',
        responderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        responderTier: 'Tier 2 Edge Ingress Gateway (Go / epoll)',
        isAi: false,
        replyMsg: {
          id: `msg-alex-${Date.now()}`,
          chatId,
          senderId: 'user-alex',
          senderName: 'Alex Chen',
          isOutgoing: false,
          text: '🚀 Go edge gateway verified WebSocket session FD #4192 on Edge-Gateway-Pod-01. Active concurrent connections: 1,048,576 with 0 dropped frames.',
          timestamp: ts,
          status: 'read' as const,
          type: 'text' as const,
          isEncrypted: true,
          ratchetKeyId: 'RATCHET-ALEX-GO-ACK',
          architecturePipelineRecord: {
            flutterClientId: 'Flutter-Dart-Client',
            goGatewayNode: 'Edge-Gateway-Pod-01',
            internalRpcService: 'Go-Epoll-Dispatcher',
            persistedStorage: ['PostgreSQL'],
            totalLatencyMs: 1.6,
          },
        },
      };
    }

    if (chatId === 'chat-priya') {
      return {
        responderName: 'Priya Patel',
        responderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        responderTier: 'Tier 3 Media & ML Worker (C# / Python)',
        isAi: false,
        replyMsg: {
          id: `msg-priya-${Date.now()}`,
          chatId,
          senderId: 'user-priya',
          senderName: 'Priya Patel',
          isOutgoing: false,
          text: '🎨 Media & ML pipeline finished! C# FFmpeg transcoded chunks in 11ms, and Python RoBERTa NLP confirmed toxicity score 0.001 (Safe).',
          timestamp: ts,
          status: 'read' as const,
          type: 'text' as const,
          isEncrypted: true,
          ratchetKeyId: 'RATCHET-PRIYA-ML-ACK',
          architecturePipelineRecord: {
            flutterClientId: 'Flutter-Dart-Client',
            goGatewayNode: 'Edge-Gateway-Pod-03',
            internalRpcService: 'Message-Queue-Broker',
            asyncProcessor: 'Python-RoBERTa-AntiSpam',
            persistedStorage: ['Cassandra', 'Object Storage'],
            totalLatencyMs: 9.2,
          },
        },
      };
    }

    if (chatId === 'chat-marcus') {
      return {
        responderName: 'Marcus Vance',
        responderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        responderTier: 'Tier 4 Storage Engine (Java / Cassandra)',
        isAi: false,
        replyMsg: {
          id: `msg-marcus-${Date.now()}`,
          chatId,
          senderId: 'user-marcus',
          senderName: 'Marcus Vance',
          isOutgoing: false,
          text: '⚡ Java Netty presence router delivered the packet to recipient queue. ScyllaDB/Cassandra WAL flush completed with 0ms GC pause.',
          timestamp: ts,
          status: 'read' as const,
          type: 'text' as const,
          isEncrypted: true,
          ratchetKeyId: 'RATCHET-MARCUS-DB-ACK',
          architecturePipelineRecord: {
            flutterClientId: 'Flutter-Dart-Client',
            goGatewayNode: 'Go-Edge-Node-East',
            internalRpcService: 'Java-gRPC-Netty',
            persistedStorage: ['Cassandra'],
            totalLatencyMs: 2.3,
          },
        },
      };
    }

    // Default for group chat
    return {
      responderName: 'Dr. Elena Rostova',
      responderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      responderTier: 'Tier 3 Cryptographic SIMD Core (Rust / C)',
      isAi: false,
      replyMsg: {
        id: `msg-group-${Date.now()}`,
        chatId,
        senderId: 'user-elena',
        senderName: 'Dr. Elena Rostova',
        isOutgoing: false,
        text: '🚀 [Core Team Sync] Packet broadcast acknowledged across Go edge pods and Cassandra clusters. All 20 language pipelines green.',
        timestamp: ts,
        status: 'read' as const,
        type: 'text' as const,
        isEncrypted: true,
        ratchetKeyId: 'RATCHET-GROUP-SYNC-ACK',
        architecturePipelineRecord: {
          flutterClientId: 'Flutter-Dart-Client',
          goGatewayNode: 'Edge-Gateway-Pod-02',
          internalRpcService: 'gRPC-Session-Coordinator',
          persistedStorage: ['Cassandra', 'PostgreSQL'],
          totalLatencyMs: 2.8,
        },
      },
    };
  };

  // Quick reaction emojis supported
  const QUICK_REACTION_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🔥', '⚡', '🚀', '🎉'];

  // Toggle or add emoji reaction on a message
  const handleToggleReaction = (messageId: string, emoji: string) => {
    setMessagesMap((prevMap) => {
      const chatMessages = prevMap[selectedChatId] || [];
      const updatedMessages = chatMessages.map((msg) => {
        if (msg.id !== messageId) return msg;

        const currentReactions = msg.reactions ? [...msg.reactions] : [];
        const existingIndex = currentReactions.findIndex((r) => r.emoji === emoji);

        if (existingIndex >= 0) {
          const existing = currentReactions[existingIndex];
          if (existing.reactedByMe) {
            // User already reacted with this emoji -> remove reaction
            if (existing.count <= 1) {
              currentReactions.splice(existingIndex, 1);
            } else {
              currentReactions[existingIndex] = {
                ...existing,
                count: existing.count - 1,
                users: existing.users.filter((u) => u !== 'You'),
                reactedByMe: false,
              };
            }
          } else {
            // User hasn't reacted with this emoji yet -> add reaction
            currentReactions[existingIndex] = {
              ...existing,
              count: existing.count + 1,
              users: [...existing.users, 'You'],
              reactedByMe: true,
            };
          }
        } else {
          // Add new emoji reaction
          currentReactions.push({
            emoji,
            count: 1,
            users: ['You'],
            reactedByMe: true,
          });
        }

        return {
          ...msg,
          reactions: currentReactions,
        };
      });

      return {
        ...prevMap,
        [selectedChatId]: updatedMessages,
      };
    });

    setActiveReactionMenuMsgId(null);
  };

  // Send a message and trigger the full 5-tier architecture pipeline simulation!
  const handleSendMessage = (
    type: 'text' | 'image' | 'voice' = 'text',
    mediaDetails?: { url: string; name: string; size: string },
    voiceOptions?: { durationSec?: number; description?: string }
  ) => {
    const textToSend = type === 'text' ? inputText.trim() : '';
    if (type === 'text' && !textToSend) return;

    const newMsgId = `msg-${Date.now()}`;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const voiceDuration = voiceOptions?.durationSec || (recordingDurationSec > 0 ? recordingDurationSec : 8);
    const voiceText = voiceOptions?.description || (recordingPresetText || '🎙️ Voice message (Opus 48kHz, Double Ratchet SRTP)');

    const newMsg: WhatsAppMessage = {
      id: newMsgId,
      chatId: selectedChatId,
      senderId: 'me',
      senderName: 'You (Engineering Lead)',
      isOutgoing: true,
      text: type === 'text' ? textToSend : type === 'image' ? '📸 Sent an encrypted media payload' : voiceText,
      timestamp,
      status: 'sending',
      type,
      mediaUrl: mediaDetails?.url,
      mediaName: mediaDetails?.name,
      mediaSize: mediaDetails?.size,
      voiceDurationSec: type === 'voice' ? voiceDuration : undefined,
      isEncrypted: true,
      ratchetKeyId: `RATCHET-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      architecturePipelineRecord: {
        flutterClientId: 'Flutter-Dart-v3.4 (Mobile Client)',
        goGatewayNode: 'Go-Edge-Node-01 (WSS TLS 1.3)',
        internalRpcService: type === 'image' || type === 'voice' ? 'RabbitMQ-Async-Queue' : 'Java-gRPC-Broker',
        asyncProcessor: type === 'image' ? 'CSharp-FFmpeg-Transcoder' : type === 'voice' ? 'CSharp-Opus-Worker' : undefined,
        persistedStorage: type === 'image' || type === 'voice' ? ['Object Storage', 'Cassandra'] : ['PostgreSQL', 'Cassandra'],
        totalLatencyMs: type === 'text' ? 2.8 : 12.4,
      },
    };

    // Optimistically add message
    setMessagesMap((prev) => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMsg],
    }));
    setInputText('');
    setShowAttachMenu(false);

    // Update last message in chat list
    setChats((prev) =>
      prev.map((c) => (c.id === selectedChatId ? { ...c, lastMessage: newMsg } : c))
    );

    // Trigger Architecture Pipeline Simulation Steps
    const pipelineSteps: ArchitecturePipelineStep[] = [
      {
        stepId: 1,
        tierName: 'Flutter Mobile Client',
        componentName: 'Dart UI & Native Kotlin/Swift HAL',
        technology: 'Dart / Kotlin / Swift / C-Crypto',
        protocol: 'MethodChannel & Signal Double Ratchet',
        action: 'Payload encrypted via X3DH & Curve25519; queued in SQLite buffer',
        status: 'processing',
        latencyMs: 0.8,
        payloadSummary: `Frame size: ${type === 'text' ? '128 Bytes' : '512 KB'} • Ratchet Key: ${newMsg.ratchetKeyId}`,
        details: {
          clientState: 'Active 120 FPS UI',
          cryptoStandard: 'Signal Double Ratchet (AES-256-GCM)',
          nativeHook: 'Camera2 / AVFoundation Zero-Copy Memory',
        },
      },
      {
        stepId: 2,
        tierName: 'Transport Layer',
        componentName: 'Edge Wire Gateway',
        technology: 'gRPC / WebSockets / UDP WebRTC',
        protocol: 'TLS 1.3 Multiplexed Frame',
        action: 'Dispatched over persistent epoll WebSocket tunnel',
        status: 'queued',
        latencyMs: 0.9,
        payloadSummary: 'WSS Binary Frame • epoll FD #4192',
        details: {
          socketType: 'Persistent WebSocket',
          handshake: 'TLS 1.3 0-RTT',
        },
      },
      {
        stepId: 3,
        tierName: 'Go / Rust Gateway & Edge Nodes',
        componentName: 'Edge Ingress Cluster',
        technology: 'Go (Epoll) & Rust (Nom Zero-Copy Codec)',
        protocol: 'Custom Binary Protobuf v3',
        action: 'Rust parses Protobuf header without allocation; Go demuxes connection',
        status: 'queued',
        latencyMs: 0.7,
        payloadSummary: 'Zero-copy slice decoded in 0.12µs',
        details: {
          gatewayNode: 'Go-Edge-Node-01',
          concurrencyPool: '1,048,576 active conns',
          authVerification: 'Valid session token (Ruby OAuth2 JWT)',
        },
      },
      {
        stepId: 4,
        tierName: type === 'text' ? 'Internal RPC (gRPC)' : 'Message Queue Bus',
        componentName: type === 'text' ? 'Distributed Microservices' : 'Asynchronous Processors',
        technology: type === 'text' ? 'Java (gRPC Netty) / Scala (Akka)' : 'C# (.NET FFmpeg) / Python (RoBERTa ML)',
        protocol: type === 'text' ? 'Internal gRPC / Protobuf' : 'RabbitMQ / Kafka Streaming',
        action: type === 'text' 
          ? 'Java Netty verifies presence & routes message to receiver session'
          : 'C# worker transcodes media thumbnail; Python ML runs anti-spam analysis in 8ms',
        status: 'queued',
        latencyMs: type === 'text' ? 1.2 : 9.8,
        payloadSummary: type === 'text' ? 'User presence confirmed active' : 'Media chunk parsed & AI toxicity score: 0.001 (Safe)',
        details: {
          microservice: type === 'text' ? 'Java-Presence-gRPC-v2' : 'CSharp-FFmpeg-Transcoder',
          jvmCollector: 'Generational ZGC (Zero Pause)',
          nlpVerdict: 'Safe / Clean Message',
        },
      },
      {
        stepId: 5,
        tierName: 'Storage & Persistence Tier',
        componentName: 'PostgreSQL, Cassandra & Object Storage',
        technology: 'PostgreSQL (SQL Auth), ScyllaDB/Cassandra (History), MinIO/S3 (Media)',
        protocol: 'CQL Wide-Column & ACID SQL & S3 API',
        action: type === 'text'
          ? 'Appended immutable message ledger into Cassandra partition & updated PostgreSQL session read pointer'
          : 'Saved media blob to S3 Object Storage bucket & indexed URL in Cassandra chat table',
        status: 'queued',
        latencyMs: type === 'text' ? 1.6 : 3.2,
        payloadSummary: 'Cassandra SSTable write committed • S3 ETag: 88f2a... • WAL flushed',
        details: {
          partitionKey: `chat_id:${selectedChatId}`,
          clusteringKey: `timestamp:${Date.now()}`,
          replicationFactor: 3,
          consistencyLevel: 'LOCAL_QUORUM',
        },
      },
    ];

    setLatestPipelineLog({
      msgText: newMsg.text,
      totalMs: newMsg.architecturePipelineRecord?.totalLatencyMs || 3.5,
      steps: pipelineSteps,
    });

    // Step 1: Sending -> Sent (Go Edge gateway acknowledged)
    setActivePipelineStep(1);
    setTimeout(() => {
      setActivePipelineStep(2);
      setTimeout(() => {
        setActivePipelineStep(3);
        setMessagesMap((prev) => ({
          ...prev,
          [selectedChatId]: prev[selectedChatId].map((m) =>
            m.id === newMsgId ? { ...m, status: 'sent' } : m
          ),
        }));

        // Step 2: Sent -> Delivered (Internal RPC / Cassandra write confirmed)
        setTimeout(() => {
          setActivePipelineStep(4);
          setTimeout(() => {
            setActivePipelineStep(5);
            setMessagesMap((prev) => ({
              ...prev,
              [selectedChatId]: prev[selectedChatId].map((m) =>
                m.id === newMsgId ? { ...m, status: 'delivered' } : m
              ),
            }));

            // Step 3: Delivered -> Read (Receiver client decrypted)
            setTimeout(() => {
              setActivePipelineStep(null);
              setMessagesMap((prev) => ({
                ...prev,
                [selectedChatId]: prev[selectedChatId].map((m) =>
                  m.id === newMsgId ? { ...m, status: 'read' } : m
                ),
              }));

              // Trigger Visual 'Typing...' Indicator & Real-Time AI / Multi-Tier Backend Message Arrival
              const resp = getBackendResponse(selectedChatId, newMsg.text, type);
              
              // Activate typing state for this chat
              setTypingState((prev) => ({
                ...prev,
                [selectedChatId]: {
                  chatId: selectedChatId,
                  senderName: resp.responderName,
                  senderAvatar: resp.responderAvatar,
                  tierInfo: resp.responderTier,
                  isAiBackend: resp.isAi,
                },
              }));

              setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
              }, 100);

              // Typing duration (1.8s - 2.2s) before real-time backend message arrives
              setTimeout(() => {
                // Clear typing indicator
                setTypingState((prev) => ({
                  ...prev,
                  [selectedChatId]: null,
                }));

                // Append incoming backend reply
                setMessagesMap((prev) => ({
                  ...prev,
                  [selectedChatId]: [...(prev[selectedChatId] || []), resp.replyMsg],
                }));

                // Update lastMessage on the sidebar chat item
                setChats((prev) =>
                  prev.map((c) => (c.id === selectedChatId ? { ...c, lastMessage: resp.replyMsg } : c))
                );

                setTimeout(() => {
                  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }, 2000);
            }, 800);
          }, 350);
        }, 350);
      }, 300);
    }, 250);
  };

  const handleStartCall = (type: 'audio' | 'video') => {
    setActiveCall({
      contactName: activeChat.name,
      avatar: activeChat.avatar,
      type,
      durationSec: 0,
      isMuted: false,
      stage: 'initiating',
      sipSignalingServer: 'sip-edge-webrtc.whatsapp.net:5060 (TLS)',
      sdpExchangeStatus: 'SIP INVITE 100 Trying • Gathering ICE STUN/TURN Candidates...',
      iceCandidateFound: false,
      packetLossPct: 0.0,
      rttMs: 32,
    });
  };

  return (
    <div className="space-y-6">
      {/* =========================================================================
          Top Architectural Context Banner
         ========================================================================= */}
      <div 
        id="whatsapp-app-banner"
        className="bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-slate-950/90 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 shrink-0 font-black text-xl">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                KayBiT_WhatsApp Messenger
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Signal Double Ratchet E2EE
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Flutter UI • Go Gateway • Cassandra
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live messaging client with real-time Integration Architecture packet tracing down to Go, Rust, Java, C#, Cassandra & S3.
            </p>
          </div>
        </div>

        {/* View Controls & Action Triggers */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-toggle-pipeline-hud"
            onClick={() => setShowPipelineHud(!showPipelineHud)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
              showPipelineHud
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{showPipelineHud ? 'Architecture HUD: Visible' : 'Show Architecture HUD'}</span>
          </button>

          <button
            id="btn-ask-ai-whatsapp"
            onClick={() =>
              onOpenAiTutorWithContext?.(
                'Explain how KayBiT_WhatsApp routes a message from Flutter Dart UI through the Go epoll gateway, Rust Protobuf codec, Java presence microservice, and writes to Cassandra & PostgreSQL.'
              )
            }
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI About WhatsApp Stack</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          Main Workspace Grid: WhatsApp Client (Left 7-8 cols) + Architecture Pipeline HUD (Right 4-5 cols)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================================================
            KayBiT_WhatsApp Client Frame (7 or 12 cols depending on HUD toggle)
           ========================================================================= */}
        <div className={`${showPipelineHud ? 'lg:col-span-7' : 'lg:col-span-12'} transition-all`}>
          <div 
            id="whatsapp-client-shell"
            className="bg-[#0b141a] dark:bg-[#0b141a] light:bg-[#f0f2f5] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[780px] text-slate-100"
          >
            {/* -------------------------------------------------------------
                Left Pane: Navigation & Chat / Status / Calls List (340px)
               ------------------------------------------------------------- */}
            <div className="w-full md:w-[320px] bg-[#111b21] dark:bg-[#111b21] light:bg-[#ffffff] border-r border-slate-800/80 flex flex-col shrink-0">
              {/* Header Bar */}
              <div className="p-3 bg-[#202c33] dark:bg-[#202c33] light:bg-[#f0f2f5] flex items-center justify-between border-b border-slate-800/60">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                      alt="User Profile"
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/50"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#111b21]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-200 block">Lead Architect</span>
                      {totalUnreadCount > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      {totalUnreadCount > 0 ? `${totalUnreadCount} unread message${totalUnreadCount === 1 ? '' : 's'}` : 'All caught up • Flutter'}
                    </span>
                  </div>
                </div>

                {/* Sidebar Tab Triggers */}
                <div className="flex items-center gap-1 text-slate-400">
                  <button
                    id="btn-whatsapp-tab-chats"
                    onClick={() => setSidebarTab('chats')}
                    className={`p-2 rounded-lg transition-colors relative ${
                      sidebarTab === 'chats' ? 'bg-slate-700/60 text-emerald-400' : 'hover:bg-slate-800 text-slate-400'
                    }`}
                    title="Chats"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {totalUnreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-emerald-500 text-slate-950 font-black text-[9px] rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-2 ring-[#202c33] animate-in zoom-in-75">
                        {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
                      </span>
                    )}
                  </button>

                  <button
                    id="btn-whatsapp-tab-status"
                    onClick={() => setSidebarTab('status')}
                    className={`p-2 rounded-lg transition-colors relative ${
                      sidebarTab === 'status' ? 'bg-slate-700/60 text-emerald-400' : 'hover:bg-slate-800 text-slate-400'
                    }`}
                    title="Status Stories"
                  >
                    <CircleDot className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#202c33]" />
                  </button>

                  <button
                    id="btn-whatsapp-tab-calls"
                    onClick={() => setSidebarTab('calls')}
                    className={`p-2 rounded-lg transition-colors ${
                      sidebarTab === 'calls' ? 'bg-slate-700/60 text-emerald-400' : 'hover:bg-slate-800 text-slate-400'
                    }`}
                    title="WebRTC Calls"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Search Bar & Notification Filter Pills */}
              <div className="p-2.5 border-b border-slate-800/60 bg-[#111b21] space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search or start new chat"
                    className="w-full pl-8 pr-8 py-1.5 bg-[#202c33] border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  {searchFilter && (
                    <button
                      onClick={() => setSearchFilter('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Filter Pills & Unread Badges */}
                <div className="flex items-center justify-between gap-1.5 pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <button
                      id="btn-filter-all-chats"
                      onClick={() => setChatsFilterMode('all')}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                        chatsFilterMode === 'all'
                          ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/50'
                          : 'bg-[#202c33] text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      <span>All</span>
                      <span className="text-[10px] opacity-75">({chats.length})</span>
                    </button>

                    <button
                      id="btn-filter-unread-chats"
                      onClick={() => setChatsFilterMode('unread')}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                        chatsFilterMode === 'unread'
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : 'bg-[#202c33] text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      <span>Unread</span>
                      {totalUnreadCount > 0 ? (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                            chatsFilterMode === 'unread'
                              ? 'bg-white text-emerald-700'
                              : 'bg-emerald-500 text-slate-950 shadow-sm'
                          }`}
                        >
                          {totalUnreadCount}
                        </span>
                      ) : (
                        <span className="text-[10px] opacity-60">(0)</span>
                      )}
                    </button>
                  </div>

                  {/* Simulation Trigger & Quick Read Actions */}
                  <div className="flex items-center gap-1">
                    {totalUnreadCount > 0 && (
                      <button
                        id="btn-mark-all-read"
                        onClick={handleMarkAllAsRead}
                        className="px-2 py-0.5 text-[10px] text-slate-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
                        title="Mark all conversations as read"
                      >
                        <MailCheck className="w-3 h-3" />
                        <span className="hidden sm:inline">Read all</span>
                      </button>
                    )}

                    <button
                      id="btn-simulate-incoming-msg"
                      onClick={() => handleSimulateIncomingMessage()}
                      className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 rounded-md text-[10px] font-mono border border-emerald-500/30 transition-all flex items-center gap-1 shrink-0"
                      title="Simulate incoming real-time backend packet to test notification badge"
                    >
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>+Test Msg</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tab 1: Chats List */}
              {sidebarTab === 'chats' && (
                <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-slate-800/40">
                  {filteredChats.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                      <MailCheck className="w-8 h-8 mx-auto text-slate-600 mb-2 opacity-60" />
                      <p className="text-xs font-semibold text-slate-300 mb-1">
                        {chatsFilterMode === 'unread' ? 'No unread messages' : 'No chats found'}
                      </p>
                      <p className="text-[11px] text-slate-500 max-w-[200px] mx-auto mb-4">
                        {chatsFilterMode === 'unread'
                          ? 'You are completely caught up across all architecture channels!'
                          : 'Try adjusting your search criteria or start a new chat.'}
                      </p>
                      {chatsFilterMode === 'unread' && (
                        <button
                          onClick={() => handleSimulateIncomingMessage()}
                          className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-medium hover:bg-emerald-600/30 transition-colors inline-flex items-center gap-1.5"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-400" />
                          <span>Simulate Unread Message</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredChats.map((chat) => {
                      const isSelected = chat.id === selectedChatId;
                      const hasUnread = (chat.unreadCount || 0) > 0;

                      return (
                        <div
                          key={chat.id}
                          id={`whatsapp-chat-item-${chat.id}`}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleSelectChat(chat.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSelectChat(chat.id);
                            }
                          }}
                          className={`w-full p-3 flex items-center gap-3 text-left transition-all cursor-pointer group relative select-none ${
                            isSelected
                              ? 'bg-[#2a3942] border-l-4 border-emerald-500'
                              : hasUnread
                              ? 'bg-[#182229]/80 hover:bg-[#202c33]'
                              : 'hover:bg-[#202c33]/60'
                          }`}
                        >
                          <div className="relative shrink-0">
                            <img
                              src={chat.avatar}
                              alt={chat.name}
                              className={`w-11 h-11 rounded-full object-cover transition-all ${
                                hasUnread ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#111b21]' : ''
                              }`}
                            />
                            {hasUnread && (
                              <span
                                className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-[#111b21] shadow-sm animate-pulse"
                                title="Unread conversation"
                              />
                            )}
                            {chat.e2eeVerified && (
                              <span
                                className="absolute bottom-0 right-0 p-0.5 bg-[#111b21] rounded-full text-emerald-400"
                                title="End-to-End Encrypted Ratchet Verified"
                              >
                                <Lock className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span
                                className={`text-xs truncate transition-colors ${
                                  hasUnread
                                    ? 'font-extrabold text-white group-hover:text-emerald-300'
                                    : 'font-semibold text-slate-200 group-hover:text-emerald-400'
                                }`}
                              >
                                {chat.name}
                              </span>
                              <span
                                className={`text-[10px] font-mono shrink-0 ml-1 ${
                                  hasUnread ? 'text-emerald-400 font-bold' : 'text-slate-400'
                                }`}
                              >
                                {chat.lastMessage?.timestamp || '12:00'}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                              {typingState[chat.id] ? (
                                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium italic animate-pulse">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                                  <span>{typingState[chat.id]!.senderName.split(' ')[0]} is typing...</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 truncate pr-1">
                                  {chat.lastMessage?.isOutgoing && (
                                    <CheckCheck
                                      className={`w-3.5 h-3.5 shrink-0 ${
                                        chat.lastMessage.status === 'read' ? 'text-sky-400' : 'text-slate-500'
                                      }`}
                                    />
                                  )}
                                  <span
                                    className={`truncate ${
                                      hasUnread ? 'text-slate-100 font-medium' : 'text-slate-400'
                                    }`}
                                  >
                                    {chat.lastMessage?.type === 'image'
                                      ? '📷 Photo'
                                      : chat.lastMessage?.type === 'voice'
                                      ? '🎙️ Voice note'
                                      : chat.lastMessage?.text}
                                  </span>
                                </div>
                              )}

                              {/* Notification Badge and Quick Action Toggle */}
                              <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                                {/* Quick Mark as Read/Unread action icon (visible on hover) */}
                                <button
                                  type="button"
                                  onClick={(e) => handleToggleMarkUnread(chat.id, e)}
                                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-emerald-300 transition-opacity"
                                  title={hasUnread ? 'Mark as read' : 'Mark as unread'}
                                >
                                  {hasUnread ? (
                                    <MailCheck className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Mail className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                {hasUnread && !typingState[chat.id] && (
                                  <span
                                    id={`whatsapp-unread-badge-${chat.id}`}
                                    className="min-w-[20px] h-5 px-1.5 bg-emerald-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-300 animate-in zoom-in-75 duration-200"
                                  >
                                    {chat.unreadCount! > 99 ? '99+' : chat.unreadCount}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Tab 2: Status Stories */}
              {sidebarTab === 'status' && (
                <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-4">
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                    <div className="relative">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                        alt="My Status"
                        className="w-10 h-10 rounded-full object-cover border-2 border-dashed border-emerald-500"
                      />
                      <span className="absolute bottom-0 right-0 bg-emerald-500 text-white rounded-full p-0.5 font-bold text-[10px]">
                        +
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">My Architecture Status</span>
                      <span className="text-[10px] text-slate-400">Tap to add system deployment update</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Recent Microservice Updates
                    </span>
                    {INITIAL_STATUS_STORIES.map((story) => (
                      <button
                        key={story.id}
                        onClick={() => setActiveStory(story)}
                        className="w-full p-2.5 rounded-xl bg-[#202c33]/50 hover:bg-[#202c33] border border-slate-800 text-left transition-colors flex items-center gap-3 cursor-pointer"
                      >
                        <img
                          src={story.avatar}
                          alt={story.contactName}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200 truncate">{story.contactName}</span>
                            <span className="text-[9px] font-mono text-slate-400">{story.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-emerald-400 font-mono truncate">{story.architectureNote}</p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{story.caption}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: WebRTC Calls */}
              {sidebarTab === 'calls' && (
                <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                    <span>Recent WebRTC Calls</span>
                    <span className="text-[10px] font-mono text-emerald-400">UDP / Opus / VP9</span>
                  </div>

                  {INITIAL_CALL_LOGS.map((call) => (
                    <div
                      key={call.id}
                      className="p-3 rounded-xl bg-[#202c33]/50 border border-slate-800/80 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={call.avatar}
                          alt={call.contactName}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-200 block">{call.contactName}</span>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            {call.type === 'video' ? <Video className="w-3 h-3 text-sky-400" /> : <Phone className="w-3 h-3 text-emerald-400" />}
                            <span>{call.timestamp}</span>
                            <span>•</span>
                            <span className="font-mono text-emerald-300">{call.duration}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-[9px] font-mono text-slate-400 space-y-0.5">
                        <span className="block text-sky-300">{call.codec}</span>
                        <span>Jitter: {call.jitterBufferMs}ms</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* -------------------------------------------------------------
                Right Pane: Active Chat Conversation & Input Bar
               ------------------------------------------------------------- */}
            <div className="flex-1 flex flex-col bg-[#0b141a] dark:bg-[#0b141a] light:bg-[#efeae2] relative min-w-0">
              {/* Chat Header */}
              <div className="relative bg-[#202c33] dark:bg-[#202c33] light:bg-[#f0f2f5] border-b border-slate-800/80 shrink-0">
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <img
                        src={activeChat.avatar}
                        alt={activeChat.name}
                        className={`w-10 h-10 rounded-full object-cover shrink-0 ring-1 ${
                          activeCall ? 'ring-2 ring-emerald-400' : 'ring-emerald-500/50'
                        }`}
                      />
                      {activeCall && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#202c33] flex items-center justify-center animate-pulse">
                          {activeCall.type === 'video' ? (
                            <Video className="w-2 h-2 text-white" />
                          ) : (
                            <Phone className="w-2 h-2 text-white" />
                          )}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                          {activeChat.name}
                        </span>
                        {activeChat.e2eeVerified && (
                          <span className="p-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> E2EE
                          </span>
                        )}
                      </div>
                      {typingState[selectedChatId] ? (
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                          <span>{typingState[selectedChatId]!.senderName} is typing...</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 ml-1">
                            {typingState[selectedChatId]!.tierInfo.split('(')[0]}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-emerald-400 block truncate">
                          {activeChat.isGroup
                            ? `${activeChat.members?.join(', ')}`
                            : 'online • Curve25519 ratchet active'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Call & Action Controls */}
                  <div className="flex items-center gap-2 text-slate-300">
                    <button
                      id="btn-whatsapp-toggle-search"
                      onClick={() => {
                        setShowMessageSearchBar(!showMessageSearchBar);
                        if (showMessageSearchBar) {
                          setMessageSearchQuery('');
                        }
                      }}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        showMessageSearchBar || messageSearchQuery
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-400'
                      }`}
                      title="Search message history (Ctrl+F / Cmd+F)"
                    >
                      <Search className="w-4 h-4" />
                    </button>

                    <button
                      id="btn-whatsapp-audio-call"
                      onClick={() => handleStartCall('audio')}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        activeCall?.type === 'audio'
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 animate-pulse'
                          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-400'
                      }`}
                      title="Start WebRTC Audio Call (Opus 48kHz)"
                    >
                      <Phone className="w-4 h-4" />
                    </button>

                    <button
                      id="btn-whatsapp-video-call"
                      onClick={() => handleStartCall('video')}
                      className={`p-2 rounded-lg transition-colors cursor-pointer ${
                        activeCall?.type === 'video'
                          ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30 animate-pulse'
                          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-sky-400'
                      }`}
                      title="Start WebRTC Video Call (VP9 / H.264)"
                    >
                      <Video className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setShowPipelineHud(!showPipelineHud)}
                      className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors"
                      title="Toggle Architecture Pipeline Inspector"
                    >
                      <Activity className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* =========================================================
                    VoIP Call In-Progress Header Overlay
                    Simulates real-time SIP signaling, ICE candidate matching,
                    and active WebRTC call feedback directly in the header!
                   ========================================================= */}
                {activeCall && (
                  <div 
                    id="whatsapp-voip-calling-header-overlay"
                    className="border-t border-emerald-500/30 bg-gradient-to-r from-[#0d281e] via-[#11261e] to-[#0d281e] px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xl animate-in slide-in-from-top-2 duration-200"
                  >
                    {/* Left: Call State & Signaling Feedback */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300">
                          {activeCall.type === 'video' ? (
                            <Video className="w-4 h-4" />
                          ) : (
                            <Phone className="w-4 h-4" />
                          )}
                        </div>
                        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                            {activeCall.type === 'video' ? 'VoIP Video Call' : 'VoIP Audio Call'}:{' '}
                            <span className="text-emerald-300">{activeCall.contactName}</span>
                          </span>

                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                            activeCall.stage === 'initiating'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                              : activeCall.stage === 'ringing'
                              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 animate-pulse'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {activeCall.stage === 'initiating' && '⏳ Initiating SIP Handshake...'}
                            {activeCall.stage === 'ringing' && '📞 Ringing (SIP 180)...'}
                            {activeCall.stage === 'connected' && '🟢 Call In Progress'}
                          </span>

                          {activeCall.stage === 'connected' && (
                            <span className="text-xs font-mono font-bold text-emerald-400 bg-black/40 px-2 py-0.5 rounded-md border border-emerald-500/30">
                              {Math.floor(activeCall.durationSec / 60)}:
                              {String(activeCall.durationSec % 60).padStart(2, '0')}
                            </span>
                          )}
                        </div>

                        {/* Signaling Telemetry Subtext */}
                        <div className="text-[10px] font-mono text-slate-300 truncate flex items-center gap-2">
                          <span className="text-emerald-400/90 truncate">
                            ⚡ {activeCall.sdpExchangeStatus || 'WebRTC PeerConnection Active'}
                          </span>
                          <span className="hidden md:inline text-slate-500">•</span>
                          <span className="hidden md:inline text-sky-300 shrink-0">
                            RTT: {activeCall.rttMs || 18}ms
                          </span>
                          <span className="hidden md:inline text-slate-500">•</span>
                          <span className="hidden md:inline text-emerald-300 shrink-0">
                            {activeCall.type === 'video' ? 'VP9 / Opus 48kHz' : 'Opus 48kHz (SRTP)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Inline Call Controls */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveCall((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null))
                        }
                        className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border ${
                          activeCall.isMuted
                            ? 'bg-rose-900/80 border-rose-500/50 text-rose-200'
                            : 'bg-slate-800/90 border-slate-700/80 text-slate-200 hover:bg-slate-700 hover:text-white'
                        }`}
                        title={activeCall.isMuted ? 'Unmute microphone' : 'Mute microphone'}
                      >
                        {activeCall.isMuted ? (
                          <>
                            <MicOff className="w-3.5 h-3.5 text-rose-400" />
                            <span className="text-[10px]">Unmute</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[10px]">Mute</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveCall(null)}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold shadow-md shadow-rose-600/30 transition-all cursor-pointer inline-flex items-center gap-1.5"
                        title="End VoIP call"
                      >
                        <PhoneOff className="w-3.5 h-3.5" />
                        <span>End Call</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Top Message History Search Bar */}
              {showMessageSearchBar && (
                <div 
                  id="whatsapp-message-history-search-bar"
                  className="p-2.5 bg-[#182229] border-b border-slate-800 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-150 shrink-0 shadow-lg z-20"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={messageSearchQuery}
                        onChange={(e) => setMessageSearchQuery(e.target.value)}
                        placeholder={`Search in messages with ${activeChat.name}...`}
                        autoFocus
                        className="w-full bg-[#202c33] border border-slate-700/80 text-xs sm:text-sm text-slate-100 rounded-xl pl-9 pr-8 py-2 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400 shadow-inner"
                      />
                      {messageSearchQuery && (
                        <button
                          type="button"
                          onClick={() => setMessageSearchQuery('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-700 text-slate-400 hover:text-slate-200 cursor-pointer"
                          title="Clear search query"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {messageSearchQuery.trim() && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono shrink-0">
                        <span className={`px-2.5 py-1 rounded-lg border font-semibold ${
                          filteredMessages.length > 0
                            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                            : 'bg-rose-950/90 text-rose-300 border-rose-500/40'
                        }`}>
                          {filteredMessages.length} {filteredMessages.length === 1 ? 'match' : 'matches'}
                        </span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setShowMessageSearchBar(false);
                        setMessageSearchQuery('');
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      title="Close message search"
                    >
                      <X className="w-4 h-4" />
                      <span className="hidden sm:inline">Close</span>
                    </button>
                  </div>

                  {/* Quick Preset Search Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px] text-slate-400">
                    <span className="font-mono text-slate-400 uppercase tracking-wider shrink-0 pr-1">Filter by:</span>
                    {['latency', 'ratchet', 'protobuf', 'cassandra', 'webrtc', 'e2ee'].map((keyword) => (
                      <button
                        key={keyword}
                        type="button"
                        onClick={() => setMessageSearchQuery(keyword)}
                        className={`px-2 py-0.5 rounded-md border whitespace-nowrap transition-colors cursor-pointer ${
                          messageSearchQuery.toLowerCase() === keyword.toLowerCase()
                            ? 'bg-emerald-900/80 border-emerald-500 text-emerald-200 font-bold'
                            : 'bg-[#202c33] border-slate-700/60 hover:border-slate-600 text-slate-300 hover:text-emerald-300'
                        }`}
                      >
                        #{keyword}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages Area (Chat Wallpaper & Bubbles) */}
              <div 
                className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar bg-[#0b141a] bg-opacity-95"
                style={{
                  backgroundImage: `radial-gradient(circle at 10px 10px, rgba(255, 255, 255, 0.02) 2px, transparent 0)`,
                  backgroundSize: '24px 24px',
                }}
              >
                {/* Search Active Notification Pill */}
                {messageSearchQuery.trim() && (
                  <div className="sticky top-0 z-20 flex items-center justify-between p-2 rounded-xl bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 text-xs font-medium shadow-lg backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <Search className="w-3.5 h-3.5 text-emerald-400" />
                      <span>
                        Filtering history: Showing <strong>{filteredMessages.length}</strong> of{' '}
                        <strong>{currentMessages.length}</strong> messages for{' '}
                        <span className="font-mono text-amber-300 underline">"{messageSearchQuery}"</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMessageSearchQuery('')}
                      className="px-2 py-0.5 rounded bg-emerald-900/80 hover:bg-emerald-800 text-[11px] font-semibold text-emerald-200 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {/* End-to-End Encryption Notice Banner */}
                {!messageSearchQuery.trim() && (
                  <div className="max-w-md mx-auto p-2.5 rounded-xl bg-[#182229] border border-amber-500/20 text-center space-y-1 shadow-sm">
                    <div className="flex items-center justify-center gap-1.5 text-amber-300 text-[11px] font-semibold">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>Signal Double Ratchet End-to-End Encrypted</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Messages and calls are secured with X3DH key derivation & AES-256-GCM. Verified by C Crypto & Rust Nom parser.
                    </p>
                  </div>
                )}

                {/* Empty Search Result State */}
                {filteredMessages.length === 0 && messageSearchQuery.trim() && (
                  <div className="max-w-md mx-auto my-8 p-6 rounded-2xl bg-[#182229] border border-slate-800 text-center space-y-3 shadow-xl animate-in fade-in zoom-in-95">
                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                      <Search className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-200">No matching messages</h4>
                      <p className="text-xs text-slate-400">
                        No messages in this chat match <span className="text-emerald-400 font-mono">"{messageSearchQuery}"</span>.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMessageSearchQuery('')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" /> Clear search filter
                    </button>
                  </div>
                )}

                {/* Message Bubbles */}
                {filteredMessages.map((msg) => {
                  const hasReactions = msg.reactions && msg.reactions.length > 0;
                  const isMenuOpen = activeReactionMenuMsgId === msg.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.isOutgoing ? 'items-end' : 'items-start'} space-y-1 relative`}
                    >
                      <div className="relative group max-w-[85%] sm:max-w-[75%]">
                        {/* Floating Quick Reaction Picker Popover */}
                        {isMenuOpen && (
                          <div 
                            id={`reaction-picker-${msg.id}`}
                            className={`absolute z-30 -top-11 ${
                              msg.isOutgoing ? 'right-0 sm:-right-2' : 'left-0 sm:-left-2'
                            } bg-[#202c33] border border-slate-700/90 rounded-full px-2.5 py-1.5 shadow-2xl flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {QUICK_REACTION_EMOJIS.map((emoji) => {
                              const isReacted = msg.reactions?.some((r) => r.emoji === emoji && r.reactedByMe);
                              return (
                                <button
                                  key={emoji}
                                  type="button"
                                  onClick={() => handleToggleReaction(msg.id, emoji)}
                                  className={`w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-700/70 hover:scale-125 transition-all text-base cursor-pointer ${
                                    isReacted ? 'bg-emerald-950/90 ring-1 ring-emerald-400 scale-110' : ''
                                  }`}
                                  title={`React with ${emoji}`}
                                >
                                  {emoji}
                                </button>
                              );
                            })}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveReactionMenuMsgId(null);
                              }}
                              className="w-5 h-5 rounded-full hover:bg-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center text-xs ml-0.5 cursor-pointer"
                              title="Close reaction bar"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        {/* Reaction Trigger Button (Hover over message bubble) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveReactionMenuMsgId(isMenuOpen ? null : msg.id);
                          }}
                          className={`absolute -top-3 ${
                            msg.isOutgoing ? '-left-3' : '-right-3'
                          } p-1.5 rounded-full bg-[#182229] border border-slate-700/80 text-slate-400 hover:text-emerald-400 hover:scale-110 shadow-lg transition-all z-10 cursor-pointer ${
                            isMenuOpen
                              ? 'opacity-100 ring-2 ring-emerald-500/60 text-emerald-400 scale-105'
                              : 'opacity-0 group-hover:opacity-100 focus:opacity-100'
                          }`}
                          title="Add reaction"
                        >
                          <Smile className="w-3.5 h-3.5" />
                        </button>

                        {/* Message Bubble Body */}
                        <div
                          className={`rounded-2xl px-3.5 py-2.5 shadow-md ${
                            msg.isOutgoing
                              ? 'bg-[#005c4b] text-slate-100 rounded-tr-none'
                              : 'bg-[#202c33] text-slate-100 rounded-tl-none'
                          }`}
                        >
                          {/* Group sender name if group chat & incoming */}
                          {activeChat.isGroup && !msg.isOutgoing && (
                            <span className="text-[11px] font-bold text-emerald-400 block mb-1">
                              {renderHighlightedText(msg.senderName, messageSearchQuery)}
                            </span>
                          )}

                          {/* Image Payload */}
                          {msg.type === 'image' && msg.mediaUrl && (
                            <div className="space-y-1.5 mb-1.5">
                              <img
                                src={msg.mediaUrl}
                                alt="Media Attachment"
                                className="rounded-xl max-h-56 w-full object-cover border border-black/20"
                              />
                              <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 bg-black/20 px-2 py-1 rounded-md">
                                <span>{renderHighlightedText(msg.mediaName || 'media.png', messageSearchQuery)}</span>
                                <span>{msg.mediaSize || '412 KB'}</span>
                              </div>
                            </div>
                          )}

                          {/* Media-Rich Voice Note Payload with Interactive Waveform & Playback Controls */}
                          {msg.type === 'voice' && (
                            <div className="py-1 min-w-[240px] sm:min-w-[280px] space-y-2">
                              <div className="flex items-center gap-3">
                                {/* Play / Pause Circle Action Button */}
                                <button
                                  type="button"
                                  id={`btn-whatsapp-voice-play-${msg.id}`}
                                  onClick={() => handleToggleVoicePlayback(msg.id)}
                                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md transition-all cursor-pointer ${
                                    playingVoiceId === msg.id
                                      ? 'bg-emerald-400 text-slate-950 scale-105 ring-4 ring-emerald-500/30'
                                      : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-105'
                                  }`}
                                  title={playingVoiceId === msg.id ? 'Pause Voice Note' : 'Play Voice Note'}
                                >
                                  {playingVoiceId === msg.id ? (
                                    <Pause className="w-4 h-4 fill-current" />
                                  ) : (
                                    <Play className="w-4 h-4 fill-current ml-0.5" />
                                  )}
                                </button>

                                {/* Waveform Track & Scrubbing Container */}
                                <div className="flex-1 space-y-1.5">
                                  <div 
                                    className="h-6 flex items-center gap-0.5 sm:gap-1 px-1 py-1 bg-black/20 rounded-lg cursor-pointer group/wave select-none"
                                    title="Click to scrub position"
                                  >
                                    {[32, 50, 78, 40, 88, 95, 60, 42, 92, 68, 35, 82, 100, 65, 38, 86, 52, 90, 74, 30, 62, 85, 48, 70, 94, 52, 38, 64].map(
                                      (h, idx, arr) => {
                                        const isFilled =
                                          playingVoiceId === msg.id &&
                                          idx <= (voiceProgress / 100) * arr.length;
                                        const isCurrent =
                                          playingVoiceId === msg.id &&
                                          Math.floor((voiceProgress / 100) * arr.length) === idx;

                                        return (
                                          <button
                                            key={idx}
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleScrubVoice(msg.id, (idx / arr.length) * 100);
                                            }}
                                            className={`flex-1 rounded-full transition-all duration-75 hover:opacity-100 ${
                                              isCurrent
                                                ? 'bg-emerald-300 scale-y-110 shadow-sm shadow-emerald-400'
                                                : isFilled
                                                ? 'bg-emerald-400'
                                                : 'bg-slate-400/40 group-hover/wave:bg-slate-400/60'
                                            }`}
                                            style={{ height: `${h}%` }}
                                          />
                                        );
                                      }
                                    )}
                                  </div>

                                  {/* Progress Timer & Speed Pill */}
                                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-300">
                                    <span className="flex items-center gap-1">
                                      {playingVoiceId === msg.id ? (
                                        <>
                                          <span className="text-emerald-300 font-bold">
                                            0:{String(
                                              Math.floor(((voiceProgress / 100) * (msg.voiceDurationSec || 8)))
                                            ).padStart(2, '0')}
                                          </span>
                                          <span className="text-slate-400">/</span>
                                          <span>0:{String(msg.voiceDurationSec || 8).padStart(2, '0')}</span>
                                        </>
                                      ) : (
                                        <span>0:{String(msg.voiceDurationSec || 8).padStart(2, '0')}</span>
                                      )}
                                    </span>

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        id={`btn-voice-speed-${msg.id}`}
                                        onClick={cyclePlaybackSpeed}
                                        className="px-1.5 py-0.5 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold transition-colors cursor-pointer"
                                        title="Toggle playback speed"
                                      >
                                        {voicePlaybackSpeed}x
                                      </button>
                                      <span className="text-emerald-400 font-semibold text-[9px] hidden sm:inline">
                                        Opus 48kHz
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Text Content with highlighted search matching */}
                          {msg.text && (
                            <p className="text-xs sm:text-[13px] leading-relaxed break-words">
                              {renderHighlightedText(msg.text, messageSearchQuery)}
                            </p>
                          )}

                          {/* Bottom Timestamp & Delivery Status */}
                          <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] font-mono opacity-80">
                            <span className="text-slate-300">{msg.timestamp}</span>
                            {msg.isOutgoing && (
                              <span>
                                {msg.status === 'sending' && <Radio className="w-3 h-3 text-amber-400 animate-spin" />}
                                {msg.status === 'sent' && <Check className="w-3.5 h-3.5 text-slate-400" />}
                                {msg.status === 'delivered' && <CheckCheck className="w-3.5 h-3.5 text-slate-400" />}
                                {msg.status === 'read' && <CheckCheck className="w-3.5 h-3.5 text-sky-400" />}
                              </span>
                            )}
                          </div>

                          {/* Architectural Pipeline Hop Pill */}
                          {msg.architecturePipelineRecord && (
                            <div className="mt-1.5 pt-1.5 border-t border-black/20 text-[9px] font-mono flex items-center justify-between gap-2 text-emerald-300/90">
                              <span className="truncate">
                                ⚡ {msg.architecturePipelineRecord.goGatewayNode} → {msg.architecturePipelineRecord.persistedStorage.join(' + ')}
                              </span>
                              <span className="shrink-0 font-bold">
                                {msg.architecturePipelineRecord.totalLatencyMs}ms
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Reaction Badges / Chips Display */}
                        {hasReactions && (
                          <div
                            className={`flex flex-wrap items-center gap-1 mt-1.5 ${
                              msg.isOutgoing ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            {msg.reactions!.map((reaction) => (
                              <button
                                key={reaction.emoji}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleReaction(msg.id, reaction.emoji);
                                }}
                                title={`${reaction.users.join(', ')} (${reaction.count}) - Click to toggle reaction`}
                                className={`group/rx inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                                  reaction.reactedByMe
                                    ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/30'
                                    : 'bg-[#182229] border-slate-700/80 text-slate-300 hover:bg-[#202c33]'
                                }`}
                              >
                                <span className="text-xs group-hover/rx:scale-110 transition-transform">
                                  {reaction.emoji}
                                </span>
                                <span className="text-[10px] font-mono font-semibold">
                                  {reaction.count}
                                </span>
                              </button>
                            ))}

                            {/* Small plus button to add more reactions */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveReactionMenuMsgId(isMenuOpen ? null : msg.id);
                              }}
                              className="w-5 h-5 rounded-full bg-[#182229] border border-slate-700/70 text-slate-400 hover:text-emerald-400 flex items-center justify-center text-[10px] cursor-pointer hover:scale-110 transition-all opacity-80 hover:opacity-100"
                              title="Add another reaction"
                            >
                              <Smile className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Real-Time AI & Multi-Tier Backend 'Typing...' Indicator Bubble */}
                {typingState[selectedChatId] && (
                  <div 
                    id="whatsapp-typing-indicator"
                    className="flex flex-col items-start space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-200"
                  >
                    {/* Sender Identity & Tier Badge */}
                    <div className="flex items-center gap-2 px-1">
                      <img
                        src={typingState[selectedChatId]!.senderAvatar}
                        alt={typingState[selectedChatId]!.senderName}
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-500/50"
                      />
                      <span className="text-[11px] font-bold text-emerald-400">
                        {typingState[selectedChatId]!.senderName}
                      </span>
                      {typingState[selectedChatId]!.isAiBackend ? (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-950/90 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-sky-400" /> AI Backend Streaming
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/30">
                          {typingState[selectedChatId]!.tierInfo.split('(')[0]}
                        </span>
                      )}
                    </div>

                    {/* Animated Typing Bubble with WhatsApp Bouncing Dots */}
                    <div className="bg-[#202c33] text-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-md flex items-center gap-2.5 border border-slate-700/60">
                      <span className="text-xs text-slate-400 font-medium">typing</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Attachment Context Menu Dropup */}
              {showAttachMenu && (
                <div className="absolute bottom-16 left-4 bg-[#202c33] border border-slate-700 rounded-2xl p-3 shadow-2xl space-y-2 z-20 w-64 animate-in fade-in slide-in-from-bottom-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-700">
                    Send Media & Hardware Stream
                  </div>

                  <button
                    onClick={() =>
                      handleSendMessage('image', {
                        url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                        name: 'system_metrics_telemetry.png',
                        size: '520 KB',
                      })
                    }
                    className="w-full p-2 rounded-xl hover:bg-slate-700 text-left text-xs font-medium text-slate-200 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-semibold">Photos & Diagrams</span>
                      <span className="text-[9px] text-slate-400">C# FFmpeg transcode & MinIO S3</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowAttachMenu(false);
                      startRecordingVoice();
                    }}
                    className="w-full p-2 rounded-xl hover:bg-slate-700 text-left text-xs font-medium text-slate-200 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-semibold">Record Voice Note</span>
                      <span className="text-[9px] text-slate-400">Opus 48kHz • Double Ratchet SRTP</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setShowAttachMenu(false);
                      setInputText('📦 Sent Protobuf v3 Service Contract payload: `packet_frame.proto` (CRC32 Verified)');
                    }}
                    className="w-full p-2 rounded-xl hover:bg-slate-700 text-left text-xs font-medium text-slate-200 flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block font-semibold">Protobuf Contract</span>
                      <span className="text-[9px] text-slate-400">Rust Zero-Copy Nom Schema</span>
                    </div>
                  </button>
                </div>
              )}

              {/* Quick Architectural Test Prompt Chips */}
              <div className="px-3 pt-2 pb-1.5 bg-[#182229] border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
                <span className="text-slate-400 font-mono text-[10px] shrink-0 uppercase tracking-wider flex items-center gap-1 pr-1">
                  <Zap className="w-3 h-3 text-amber-400" /> Prompts:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setInputText('⚡ What is the P99 end-to-end latency across all 5 tiers?');
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#202c33] hover:bg-[#2a3942] text-slate-300 hover:text-emerald-300 border border-slate-700/60 whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  ⚡ P99 Latency Breakdown
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputText('🔐 How does the Signal Double Ratchet rotate keys with Curve25519?');
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#202c33] hover:bg-[#2a3942] text-slate-300 hover:text-emerald-300 border border-slate-700/60 whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  🔐 Double Ratchet Keys
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputText('🚀 Explain Go epoll 1M WebSocket gateway handling');
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#202c33] hover:bg-[#2a3942] text-slate-300 hover:text-emerald-300 border border-slate-700/60 whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  🚀 Go Epoll Gateway
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputText('🗄️ Why Cassandra wide-column partition over PostgreSQL for chat?');
                  }}
                  className="px-2.5 py-1 rounded-full bg-[#202c33] hover:bg-[#2a3942] text-slate-300 hover:text-emerald-300 border border-slate-700/60 whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  🗄️ Cassandra vs Postgres
                </button>
              </div>

              {/* Emoji Picker Tray for Input */}
              {showEmojiPickerBar && (
                <div 
                  id="whatsapp-input-emoji-tray"
                  className="px-3 py-2 bg-[#182229] border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar animate-in fade-in slide-in-from-bottom-2 duration-150"
                >
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider shrink-0 pr-1">
                    Emojis:
                  </span>
                  {['👍', '❤️', '🔥', '⚡', '🚀', '😂', '😮', '👏', '🤖', '🎉', '🔒', '🛡️', '📦', '💯', '✨', '💻'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setInputText((prev) => prev + emoji);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700/80 hover:scale-125 transition-all text-base shrink-0 cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowEmojiPickerBar(false)}
                    className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 ml-auto shrink-0 cursor-pointer"
                    title="Close emoji tray"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Bottom Message Input Bar / Live Voice Recording Console */}
              {isRecordingVoice ? (
                <div 
                  id="whatsapp-voice-recording-bar"
                  className="p-3 bg-[#182229] border-t border-rose-900/40 flex items-center justify-between gap-2 sm:gap-3 shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-150"
                >
                  {/* Left: Blinking REC Status & Duration */}
                  <div className="flex items-center gap-2 px-2.5 py-1.5 bg-rose-950/50 border border-rose-800/50 rounded-xl shrink-0">
                    <div className="relative flex items-center justify-center">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping absolute" />
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    </div>
                    <span className="font-mono text-xs font-bold text-rose-300 tracking-wider">
                      REC 0:{String(recordingDurationSec).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Center: Dynamic Animated Audio Waveform & Preset Topic Selector */}
                  <div className="flex-1 flex flex-col justify-center gap-1.5 px-1 min-w-0">
                    {/* Dynamic soundwave bars */}
                    <div className="h-6 flex items-center justify-center gap-1 bg-[#202c33] px-2.5 py-1 rounded-xl border border-slate-700/60 overflow-hidden">
                      {liveWaveformBars.map((height, idx) => (
                        <div
                          key={idx}
                          className="w-1 sm:w-1.5 rounded-full bg-gradient-to-t from-emerald-500 to-teal-300 transition-all duration-75"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>

                    {/* Preset topic chips for instant contextual demo */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
                      <span className="text-slate-400 font-mono shrink-0">Topic:</span>
                      <button
                        type="button"
                        onClick={() => setRecordingPresetText('🎙️ Architecture Note: Cassandra SSTable partition compaction & X3DH key rotation')}
                        className={`px-2 py-0.5 rounded-full border whitespace-nowrap transition-colors cursor-pointer ${
                          recordingPresetText.includes('Cassandra')
                            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 font-semibold'
                            : 'bg-[#202c33] text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        ⚡ Cassandra SSTables
                      </button>
                      <button
                        type="button"
                        onClick={() => setRecordingPresetText('🎙️ Security Memo: Signal Double Ratchet Key rotation on TLS 1.3 edge socket')}
                        className={`px-2 py-0.5 rounded-full border whitespace-nowrap transition-colors cursor-pointer ${
                          recordingPresetText.includes('Double Ratchet')
                            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 font-semibold'
                            : 'bg-[#202c33] text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        🔒 Double Ratchet Keys
                      </button>
                      <button
                        type="button"
                        onClick={() => setRecordingPresetText('🎙️ Gateway Telemetry: Go epoll gateway maintaining 1M concurrent client sockets')}
                        className={`px-2 py-0.5 rounded-full border whitespace-nowrap transition-colors cursor-pointer ${
                          recordingPresetText.includes('Go epoll')
                            ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 font-semibold'
                            : 'bg-[#202c33] text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        🚀 1M Sockets
                      </button>
                    </div>
                  </div>

                  {/* Right: Discard / Cancel and Send Audio Clip */}
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    {/* Cancel / Discard Recording */}
                    <button
                      type="button"
                      id="btn-cancel-voice-recording"
                      onClick={cancelRecordingVoice}
                      className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-rose-900/60 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                      title="Discard Voice Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Send Recorded Voice Note */}
                    <button
                      type="button"
                      id="btn-send-voice-recording"
                      onClick={() => sendRecordedVoice()}
                      className="px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer font-semibold text-xs"
                      title="Send Recorded Voice Note"
                    >
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">Send Note</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-[#202c33] dark:bg-[#202c33] light:bg-[#f0f2f5] border-t border-slate-800/80 flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmojiPickerBar(!showEmojiPickerBar);
                      setShowAttachMenu(false);
                    }}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      showEmojiPickerBar ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                    title="Emoji Picker"
                  >
                    <Smile className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAttachMenu(!showAttachMenu);
                      setShowEmojiPickerBar(false);
                    }}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      showAttachMenu ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                    title="Attach Media / Stream"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage('text');
                    }}
                    className="flex-1 flex items-center gap-2"
                  >
                    <input
                      id="whatsapp-message-input"
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type a message (e.g. test Cassandra write, Go gateway latency)..."
                      className="w-full px-4 py-2.5 bg-[#2a3942] border border-transparent focus:border-emerald-500 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none transition-colors"
                    />

                    {inputText.trim() ? (
                      <button
                        id="btn-whatsapp-send-message"
                        type="submit"
                        className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all cursor-pointer shrink-0"
                        title="Send Message"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        id="btn-whatsapp-mic-record"
                        onClick={startRecordingVoice}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-emerald-950/80 text-emerald-400 hover:text-emerald-300 ring-1 ring-transparent hover:ring-emerald-500/50 transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                        title="Record Simulated Voice Note (Opus 48kHz)"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    )}
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            Integration Architecture Live Pipeline HUD (Right 5 cols)
            Follows the exact ASCII Diagram provided by the user!
           ========================================================================= */}
        {showPipelineHud && (
          <div className="lg:col-span-5 space-y-4">
            <div 
              id="integration-architecture-hud"
              className="bg-slate-900/95 border border-emerald-500/30 rounded-2xl p-5 shadow-2xl space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                      Live Integration Architecture Pipeline
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Real-time packet propagation across all 5 architectural tiers
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Synced
                </span>
              </div>

              {/* =========================================================================
                  Visual Architecture Tier Stack (Diagram Direct Translation)
                 ========================================================================= */}
              <div className="space-y-3">
                {/* Tier 1: Flutter Mobile Client */}
                <div 
                  className={`p-3 rounded-xl border transition-all ${
                    activePipelineStep === 1
                      ? 'bg-emerald-500/20 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-xs font-bold text-slate-200">
                        1. Flutter Mobile Client
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                      Dart UI / Kotlin & Swift HAL
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    BLoC reactive streams, X3DH Double Ratchet key derivations, and MethodChannel camera/mic interop.
                  </p>
                </div>

                {/* Connector: Transport */}
                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-400 py-0.5">
                  <ArrowRight className="w-3 h-3 text-emerald-400 rotate-90" />
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700">
                    gRPC / WebSockets / UDP (WebRTC)
                  </span>
                  <ArrowRight className="w-3 h-3 text-emerald-400 rotate-90" />
                </div>

                {/* Tier 2: Go / Rust Gateway & Edge Nodes */}
                <div 
                  className={`p-3 rounded-xl border transition-all ${
                    activePipelineStep === 2 || activePipelineStep === 3
                      ? 'bg-sky-500/20 border-sky-500 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500'
                      : 'bg-slate-950/80 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-sky-400" />
                      <span className="text-xs font-bold text-slate-200">
                        2. Go / Rust Gateway & Edge Nodes
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/40">
                      1M Conn Epoll / Nom Codec
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Non-blocking Go epoll connection loop and zero-copy Rust binary Protobuf framing.
                  </p>
                </div>

                {/* Connector: Internal Routing Split */}
                <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono py-0.5">
                  <div className="flex items-center justify-center gap-1 text-purple-300 bg-purple-950/40 py-1 rounded border border-purple-800/40">
                    <ArrowRight className="w-3 h-3 rotate-90" />
                    <span>Internal RPC (gRPC)</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-amber-300 bg-amber-950/40 py-1 rounded border border-amber-800/40">
                    <ArrowRight className="w-3 h-3 rotate-90" />
                    <span>Message Queue</span>
                  </div>
                </div>

                {/* Tier 3: Distributed Microservices & Async Processors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div 
                    className={`p-2.5 rounded-xl border transition-all ${
                      activePipelineStep === 4
                        ? 'bg-purple-500/20 border-purple-500 shadow-md ring-1 ring-purple-500'
                        : 'bg-slate-950/80 border-slate-800'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-slate-200 mb-0.5">
                      Distributed Microservices
                    </div>
                    <span className="text-[9px] font-mono text-purple-300 block mb-1">
                      Java, C#, Ruby, PHP, Python
                    </span>
                    <p className="text-[10px] text-slate-400">
                      User presence, auth verification, and session coordination.
                    </p>
                  </div>

                  <div 
                    className={`p-2.5 rounded-xl border transition-all ${
                      activePipelineStep === 4
                        ? 'bg-amber-500/20 border-amber-500 shadow-md ring-1 ring-amber-500'
                        : 'bg-slate-950/80 border-slate-800'
                    }`}
                  >
                    <div className="text-[11px] font-bold text-slate-200 mb-0.5">
                      Asynchronous Processors
                    </div>
                    <span className="text-[9px] font-mono text-amber-300 block mb-1">
                      C# Transcoding / Python ML
                    </span>
                    <p className="text-[10px] text-slate-400">
                      FFmpeg video transcoding, Opus compression & NLP toxicity checks.
                    </p>
                  </div>
                </div>

                {/* Connector: Storage Reads / Writes */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-2 py-0.5">
                  <span className="text-emerald-400">Reads / Writes</span>
                  <span className="text-emerald-400">Writes (Ledger)</span>
                  <span className="text-emerald-400">Writes (Blobs)</span>
                </div>

                {/* Tier 4: Storage & Persistence Tier */}
                <div className="grid grid-cols-3 gap-2">
                  {/* PostgreSQL */}
                  <div 
                    className={`p-2 rounded-xl border text-center transition-all ${
                      activePipelineStep === 5
                        ? 'bg-blue-500/20 border-blue-500 shadow-md ring-1 ring-blue-500'
                        : 'bg-slate-950/80 border-slate-800'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-slate-200 block">PostgreSQL</span>
                    <span className="text-[9px] font-mono text-blue-300">SQL Auth</span>
                  </div>

                  {/* Cassandra NoSQL */}
                  <div 
                    className={`p-2 rounded-xl border text-center transition-all ${
                      activePipelineStep === 5
                        ? 'bg-emerald-500/20 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                        : 'bg-slate-950/80 border-slate-800'
                    }`}
                  >
                    <HardDrive className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-slate-200 block">Cassandra</span>
                    <span className="text-[9px] font-mono text-emerald-300">Chat History</span>
                  </div>

                  {/* Object Storage */}
                  <div 
                    className={`p-2 rounded-xl border text-center transition-all ${
                      activePipelineStep === 5
                        ? 'bg-amber-500/20 border-amber-500 shadow-md ring-1 ring-amber-500'
                        : 'bg-slate-950/80 border-slate-800'
                    }`}
                  >
                    <Server className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
                    <span className="text-[11px] font-bold text-slate-200 block">Object Storage</span>
                    <span className="text-[9px] font-mono text-amber-300">Media Files</span>
                  </div>
                </div>
              </div>

              {/* Latest Real-Time Trace Output */}
              {latestPipelineLog && (
                <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Last Hop Trace Execution</span>
                    </span>
                    <span className="text-slate-300 font-bold">{latestPipelineLog.totalMs} ms Total</span>
                  </div>

                  <div className="space-y-1 text-[11px] max-h-36 overflow-y-auto no-scrollbar pr-1">
                    {latestPipelineLog.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-300 leading-tight">
                        <span className="text-emerald-400 shrink-0">[{step.latencyMs}ms]</span>
                        <span>
                          <strong className="text-slate-100">{step.tierName}: </strong>
                          <span className="text-slate-400">{step.action}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          WebRTC Audio / Video Call Modal Simulation
         ========================================================================= */}
      {activeCall && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111b21] border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 text-center animate-in zoom-in-95">
            {/* Call State Header */}
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-semibold inline-flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>WebRTC UDP Session Active</span>
              </span>
              <h3 className="text-xl font-bold text-slate-100">{activeCall.contactName}</h3>
              <p className="text-xs font-mono text-emerald-400">
                {Math.floor(activeCall.durationSec / 60)}:
                {String(activeCall.durationSec % 60).padStart(2, '0')}
              </p>
            </div>

            {/* Avatar & Video Stream Visualizer */}
            <div className="relative mx-auto w-32 h-32">
              <img
                src={activeCall.avatar}
                alt={activeCall.contactName}
                className="w-32 h-32 rounded-full object-cover ring-4 ring-emerald-500/50 shadow-2xl"
              />
              <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-25" />
            </div>

            {/* Live WebRTC Telemetry Stats */}
            <div className="grid grid-cols-3 gap-2 bg-slate-900/80 rounded-2xl p-3 border border-slate-800 text-[11px] font-mono">
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Codec</span>
                <span className="text-slate-200 font-bold">{activeCall.type === 'video' ? 'VP9 / Opus' : 'Opus 48kHz'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Jitter Buffer</span>
                <span className="text-sky-300 font-bold">11 ms</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[9px] uppercase">Packet Loss</span>
                <span className="text-emerald-400 font-bold">0.00%</span>
              </div>
            </div>

            {/* Call Control Buttons */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setActiveCall((p) => (p ? { ...p, isMuted: !p.isMuted } : null))}
                className={`p-3.5 rounded-full transition-colors cursor-pointer ${
                  activeCall.isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
                title={activeCall.isMuted ? 'Unmute Mic' : 'Mute Mic'}
              >
                {activeCall.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setActiveCall(null)}
                className="p-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/30 transition-all cursor-pointer"
                title="End Call"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          Status Story Modal Viewer
         ========================================================================= */}
      {activeStory && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#111b21] border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4">
            <div className="p-4 bg-[#202c33] flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={activeStory.avatar}
                  alt={activeStory.contactName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500"
                />
                <div>
                  <span className="text-sm font-bold text-slate-100 block">{activeStory.contactName}</span>
                  <span className="text-[10px] font-mono text-emerald-400">{activeStory.timestamp}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveStory(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <img
                src={activeStory.mediaUrl}
                alt="Status Media"
                className="w-full h-64 object-cover rounded-2xl border border-slate-800"
              />

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                  Architecture Note: {activeStory.architectureNote}
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">{activeStory.caption}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
