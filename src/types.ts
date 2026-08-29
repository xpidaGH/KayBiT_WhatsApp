export type TrackId = 'frontend' | 'networking' | 'backend' | 'data' | 'devops';

export interface ProgrammingLanguageInfo {
  id: string;
  name: string;
  category: string;
  trackId: TrackId;
  roleTitle: string;
  description: string;
  whyChosen: string;
  keyConcepts: string[];
  codeFile: string;
  codeSnippet: string;
  fullCode: string;
  simulatedOutput?: string;
  runFunction?: (inputParams?: Record<string, any>) => SimulatedExecutionResult;
  inputParameters?: {
    id: string;
    label: string;
    type: 'text' | 'number' | 'boolean' | 'select';
    defaultValue: any;
    options?: { label: string; value: any }[];
  }[];
  architectureLayer: string;
  protocolStandards: string[];
  metrics: {
    label: string;
    value: string;
    subtext?: string;
  }[];
}

export interface EngineeringTrack {
  id: TrackId;
  title: string;
  subtitle: string;
  badge: string;
  color: string;
  accentColor: string;
  bgColor: string;
  borderColor: string;
  iconName: string;
  objective: string;
  languages: ProgrammingLanguageInfo[];
  architectureResponsibilities: string[];
  keyChallenges: string[];
  performanceTarget: string;
  interServiceContracts: {
    name: string;
    protocol: string;
    counterpart: string;
    description: string;
  }[];
}

export interface SimulatedExecutionResult {
  status: 'success' | 'warning' | 'error';
  logs: string[];
  outputData: Record<string, any>;
  executionTimeMs: number;
  memoryUsedMb: number;
}

export interface PacketHop {
  id: string;
  stepNumber: number;
  trackId: TrackId;
  serviceName: string;
  language: string;
  protocol: string;
  action: string;
  payloadState: string;
  latencyMs: number;
  details: {
    title: string;
    description: string;
    dataSnapshot: Record<string, any>;
    securityState?: string;
  };
}

export interface CapstoneMilestone {
  week: number;
  sprint: string;
  title: string;
  theme: string;
  deliverablesByTrack: {
    trackId: TrackId;
    trackName: string;
    deliverable: string;
    languageFocus: string[];
  }[];
  crossTrackIntegrationGate: string;
  rubric: {
    criteria: string;
    weight: number;
    description: string;
  }[];
}

export interface SystemTelemetryState {
  activeConnections: number;
  messagesPerSecond: number;
  avgP99LatencyMs: number;
  packetLossRate: number;
  cpuEdgeAverage: number;
  memoryLedgerAverage: number;
  threatQuarantineCount: number;
  storageWriteIops: number;
}

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';
export type MessageType = 'text' | 'image' | 'voice' | 'file' | 'system';

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // List of user names who reacted
  reactedByMe?: boolean;
}

export interface WhatsAppMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  isOutgoing: boolean;
  text: string;
  timestamp: string;
  status: MessageStatus;
  type: MessageType;
  mediaUrl?: string;
  mediaName?: string;
  mediaSize?: string;
  voiceDurationSec?: number;
  isEncrypted: boolean;
  ratchetKeyId?: string;
  reactions?: MessageReaction[];
  architecturePipelineRecord?: {
    flutterClientId: string;
    goGatewayNode: string;
    internalRpcService: string;
    asyncProcessor?: string;
    persistedStorage: ('PostgreSQL' | 'Cassandra' | 'Object Storage')[];
    totalLatencyMs: number;
  };
}

export interface WhatsAppContact {
  id: string;
  name: string;
  avatar: string;
  statusMessage: string;
  isOnline: boolean;
  lastSeen: string;
  phone: string;
  role: string;
  publicFingerprint: string;
}

export interface WhatsAppChat {
  id: string;
  isGroup: boolean;
  name: string;
  avatar: string;
  members?: string[];
  lastMessage?: WhatsAppMessage;
  unreadCount: number;
  isPinned?: boolean;
  typingStatus?: string;
  e2eeVerified: boolean;
}

export interface WhatsAppStatusStory {
  id: string;
  contactId: string;
  contactName: string;
  avatar: string;
  timestamp: string;
  caption: string;
  mediaUrl: string;
  viewsCount: number;
  architectureNote: string;
}

export interface WhatsAppCallLog {
  id: string;
  contactId: string;
  contactName: string;
  avatar: string;
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration: string;
  jitterBufferMs: number;
  codec: string;
  packetLossRate: string;
  bitrateKbps: number;
}

export interface ArchitecturePipelineStep {
  stepId: number;
  tierName: string;
  componentName: string;
  technology: string;
  protocol: string;
  action: string;
  status: 'idle' | 'processing' | 'success' | 'queued';
  latencyMs: number;
  payloadSummary: string;
  details: Record<string, any>;
}

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'mastered';

export interface UserSnippetRecord {
  languageId: string;
  languageName: string;
  codeFile: string;
  customCode: string;
  originalCode: string;
  isCustomized: boolean;
  notes: string;
  lastModified: number;
  version: number;
  savedParams?: Record<string, any>;
}

export interface LanguageProgressRecord {
  languageId: string;
  languageName: string;
  trackId: string;
  status: ProgressStatus;
  completedAt?: number | null;
  lastAttemptAt?: number;
  testRunsCount: number;
  checklist: {
    reviewedArchitecture: boolean;
    customizedCode: boolean;
    executedHarness: boolean;
    verifiedOutput: boolean;
    reviewedAiExplanation: boolean;
  };
  notes: string;
  rating?: number;
}


