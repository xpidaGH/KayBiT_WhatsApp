import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  Loader2, 
  Terminal,
  Code2,
  BookOpen
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface GeminiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCodeContext?: { languageName: string; snippet: string } | null;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const GeminiTutorModal: React.FC<GeminiTutorModalProps> = ({
  isOpen,
  onClose,
  initialCodeContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hello! I am your **KayBiT_WhatsApp Capstone Architecture Advisor**.\n\nAsk me anything about distributed systems engineering, language selection trade-offs (across all 20 languages), protocol design, Signal cryptography, ScyllaDB ledgers, or Go epoll socket gateways!",
    },
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Why does the Go Edge Gateway use epoll instead of 1 goroutine per socket?',
    'Explain how the Signal Double Ratchet provides post-compromise security.',
    'Why is ScyllaDB Time-Window Compaction (TWCS) essential for messaging ledgers?',
    'How does C++ packet loss concealment (PLC) work in audio jitter buffers?',
    'Compare PostgreSQL ACID vs. ScyllaDB wide-column partitioning strategy.',
  ];

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          track: 'Cross-Track Distributed Systems Architecture',
          languageContext: initialCodeContext?.languageName || 'General Architecture',
          codeSnippet: initialCodeContext?.snippet || undefined,
        }),
      });

      const data = await response.json();
      if (data.answer) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'I received the query, but an error occurred while processing the response.',
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Unable to contact AI advisor server: ${err.message || 'Network error'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-sky-500 text-white shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">AI Architecture Advisor</h3>
              <p className="text-xs text-slate-400">
                Powered by Gemini 3.7 Flash • Expert advice for KayBiT_WhatsApp Capstone
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 no-scrollbar">
          {initialCodeContext && (
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-slate-400 space-y-1">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" /> Contextual Code Attached: {initialCodeContext.languageName}
              </span>
              <pre className="text-[11px] font-mono text-slate-300 max-h-20 overflow-y-auto no-scrollbar">
                {initialCodeContext.snippet.slice(0, 200)}...
              </pre>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 shadow-md'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="space-y-2 prose prose-invert max-w-none text-xs">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-950/80 border border-slate-800 text-slate-400 rounded-2xl px-4 py-2.5 text-xs flex items-center gap-2">
                <span>Analyzing distributed architecture & compiling response...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts Carousel */}
        <div className="px-6 py-2 bg-slate-950/40 border-t border-slate-800/80 overflow-x-auto no-scrollbar flex gap-2">
          {quickPrompts.map((prompt, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0"
            >
              <HelpCircle className="w-3 h-3 text-sky-400" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask an architectural question across any of the 20 languages..."
              disabled={isLoading}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white shadow-md shadow-emerald-600/20 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
