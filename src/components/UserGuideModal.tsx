import React, { useState, useMemo } from 'react';
import { 
  X, 
  BookOpen, 
  Download, 
  Copy, 
  Check, 
  Search, 
  Smartphone, 
  Laptop, 
  Layers, 
  ExternalLink,
  Code2,
  FileText,
  Bookmark,
  Share2,
  Printer
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { 
  USER_GUIDE_MARKDOWN, 
  INSTALLATION_MARKDOWN, 
  README_MARKDOWN 
} from '../data/documentationData';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'guide' | 'installation' | 'readme';
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'guide',
}) => {
  const [activeDoc, setActiveDoc] = useState<'guide' | 'installation' | 'readme'>(defaultTab);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');

  // Select active document content
  const currentContent = useMemo(() => {
    switch (activeDoc) {
      case 'guide':
        return USER_GUIDE_MARKDOWN;
      case 'installation':
        return INSTALLATION_MARKDOWN;
      case 'readme':
        return README_MARKDOWN;
      default:
        return USER_GUIDE_MARKDOWN;
    }
  }, [activeDoc]);

  // Extract headings for quick TOC jumps
  const headings = useMemo(() => {
    const lines = currentContent.split('\n');
    const list: { title: string; level: number }[] = [];
    for (const line of lines) {
      if (line.startsWith('## ')) {
        list.push({ title: line.replace('## ', '').trim(), level: 2 });
      } else if (line.startsWith('### ')) {
        list.push({ title: line.replace('### ', '').trim(), level: 3 });
      }
    }
    return list;
  }, [currentContent]);

  // Filter content if search query is active
  const filteredContent = useMemo(() => {
    if (!searchQuery.trim()) return currentContent;
    const query = searchQuery.toLowerCase();
    const lines = currentContent.split('\n');
    const matchedSections: string[] = [];
    let currentBlock: string[] = [];
    let blockMatches = false;

    for (const line of lines) {
      if (line.startsWith('## ') || line.startsWith('# ')) {
        if (currentBlock.length > 0 && blockMatches) {
          matchedSections.push(currentBlock.join('\n'));
        }
        currentBlock = [line];
        blockMatches = line.toLowerCase().includes(query);
      } else {
        currentBlock.push(line);
        if (line.toLowerCase().includes(query)) {
          blockMatches = true;
        }
      }
    }
    if (currentBlock.length > 0 && blockMatches) {
      matchedSections.push(currentBlock.join('\n'));
    }

    return matchedSections.length > 0
      ? `> 🔍 Showing search matches for: **"${searchQuery}"**\n\n---\n\n` + matchedSections.join('\n\n---\n\n')
      : `> ⚠️ No direct matches found for: **"${searchQuery}"**. Try searching for *Capacitor*, *Tauri*, *Go*, *Cassandra*, *Simulator*, or *CI/CD*.`;
  }, [currentContent, searchQuery]);

  if (!isOpen) return null;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const filename =
      activeDoc === 'guide'
        ? 'USER_GUIDE.md'
        : activeDoc === 'installation'
        ? 'INSTALLATION.md'
        : 'README.md';

    const blob = new Blob([currentContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintToPdf = () => {
    const docTitle =
      activeDoc === 'guide'
        ? 'KayBiT WhatsApp Capstone - Official User Guide'
        : activeDoc === 'installation'
        ? 'KayBiT WhatsApp Capstone - Native Installation Guide (APK, EXE, DMG)'
        : 'KayBiT WhatsApp Capstone - Project Architecture README';

    const contentElement = document.querySelector('#printable-guide-content');
    const contentHtml = contentElement ? contentElement.innerHTML : '';

    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument;
    if (!frameDoc) return;

    frameDoc.open();
    frameDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${docTitle}</title>
          <style>
            @page {
              margin: 18mm 14mm;
              size: auto;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              color: #0f172a;
              background: #ffffff;
              line-height: 1.6;
              padding: 16px;
              font-size: 13px;
            }
            .header-banner {
              border-bottom: 2px solid #059669;
              padding-bottom: 12px;
              margin-bottom: 20px;
            }
            .header-banner h1 {
              border: 0;
              margin: 0;
              padding: 0;
              color: #047857;
              font-size: 22px;
            }
            .header-banner p {
              margin: 4px 0 0 0;
              color: #475569;
              font-size: 11px;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #0f172a;
              margin-top: 1.4em;
              margin-bottom: 0.5em;
              font-weight: 700;
              page-break-after: avoid;
            }
            h1 { font-size: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
            h2 { font-size: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; color: #047857; }
            h3 { font-size: 14px; color: #1e293b; }
            p, ul, ol, blockquote {
              margin-bottom: 0.9em;
            }
            ul, ol {
              padding-left: 22px;
            }
            li {
              margin-bottom: 3px;
            }
            code {
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
              background-color: #f1f5f9;
              color: #0f172a;
              padding: 2px 5px;
              border-radius: 4px;
              font-size: 11.5px;
            }
            pre {
              background-color: #f8fafc;
              border: 1px solid #cbd5e1;
              border-radius: 6px;
              padding: 10px 14px;
              overflow-x: auto;
              font-size: 11px;
              page-break-inside: avoid;
            }
            pre code {
              background: transparent;
              padding: 0;
            }
            blockquote {
              border-left: 4px solid #10b981;
              background-color: #f0fdf4;
              padding: 8px 14px;
              border-radius: 0 6px 6px 0;
              margin: 12px 0;
              color: #065f46;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 14px 0;
              page-break-inside: avoid;
              font-size: 12px;
            }
            th, td {
              border: 1px solid #cbd5e1;
              padding: 6px 10px;
              text-align: left;
            }
            th {
              background-color: #f1f5f9;
              font-weight: 600;
            }
            hr {
              border: 0;
              border-top: 1px solid #e2e8f0;
              margin: 20px 0;
            }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header-banner">
            <h1>${docTitle}</h1>
            <p>KayBiT_WhatsApp Multi-Language Capstone Studio • Offline Sprint Manual • Exported on ${new Date().toLocaleDateString()}</p>
          </div>
          <div>
            ${contentHtml}
          </div>
        </body>
      </html>
    `);
    frameDoc.close();

    setTimeout(() => {
      try {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
      } catch (e) {
        window.print();
      } finally {
        setTimeout(() => {
          if (document.body.contains(printFrame)) {
            document.body.removeChild(printFrame);
          }
        }, 3000);
      }
    }, 400);
  };

  return (
    <div 
      id="user-guide-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-sky-500 text-white shadow-md shadow-emerald-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Documentation & Guides</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  KayBiT Capstone
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Official User Manual, Architecture Reference & Native Packaging Pipelines
              </p>
            </div>
          </div>

          {/* Quick Doc Switcher Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              id="tab-doc-userguide"
              onClick={() => {
                setActiveDoc('guide');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeDoc === 'guide'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>User Guide</span>
            </button>

            <button
              id="tab-doc-installation"
              onClick={() => {
                setActiveDoc('installation');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeDoc === 'installation'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Native Install (APK/EXE/DMG)</span>
            </button>

            <button
              id="tab-doc-readme"
              onClick={() => {
                setActiveDoc('readme');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeDoc === 'readme'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>README</span>
            </button>
          </div>

          {/* Actions & Close */}
          <div className="flex items-center gap-2">
            <button
              id="btn-print-userguide"
              onClick={handlePrintToPdf}
              className="p-2 rounded-lg text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all text-xs flex items-center gap-1.5 active:scale-95 shadow-sm"
              title="Print or Save as PDF for offline reference"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline font-semibold">Print / PDF</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-all text-xs flex items-center gap-1.5"
              title="Copy raw Markdown"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Copy MD</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadFile}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-all text-xs flex items-center gap-1.5"
              title="Download Markdown file"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              id="btn-close-userguide"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all ml-1"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Quick Filter Bar */}
        <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chapters, languages, tools (e.g. 'Capacitor', 'Simulator', 'Go', 'CI/CD')..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Platform Badges / TOC helper */}
          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
            <span className="text-slate-500">Quick Topics:</span>
            {activeDoc === 'guide' ? (
              <>
                <button
                  onClick={() => setSearchQuery('Simulator')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  Simulator
                </button>
                <button
                  onClick={() => setSearchQuery('Compilers')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  Code Lab
                </button>
                <button
                  onClick={() => setSearchQuery('ACID')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  Storage
                </button>
                <button
                  onClick={() => setSearchQuery('Curriculum')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  Syllabus
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setSearchQuery('Capacitor')}
                  className="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                >
                  Android APK
                </button>
                <button
                  onClick={() => setSearchQuery('Tauri')}
                  className="px-2 py-0.5 rounded bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30"
                >
                  Windows / Mac
                </button>
                <button
                  onClick={() => setSearchQuery('GitHub Actions')}
                  className="px-2 py-0.5 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30"
                >
                  CI/CD Automation
                </button>
                <button
                  onClick={() => setSearchQuery('PWA')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  PWA
                </button>
              </>
            )}
          </div>
        </div>

        {/* Modal Main Content (Split TOC + Markdown Reader) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Table of Contents Sidebar (collapsible on mobile) */}
          <div className="hidden lg:block w-64 border-r border-slate-800/80 bg-slate-950/40 p-4 overflow-y-auto no-scrollbar shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
              <span>Table of Contents</span>
            </div>
            <nav className="space-y-1">
              {headings.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(item.title.split(' ')[0])}
                  className={`w-full text-left py-1.5 px-2 rounded-lg text-xs transition-all truncate block ${
                    item.level === 2
                      ? 'text-slate-300 font-medium hover:bg-slate-800 hover:text-emerald-300'
                      : 'text-slate-500 pl-4 hover:bg-slate-800/50 hover:text-slate-300'
                  }`}
                  title={item.title}
                >
                  {item.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Markdown Content Area */}
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-slate-900/60 no-scrollbar">
            <div 
              id="printable-guide-content"
              className={`markdown-body max-w-4xl mx-auto space-y-4 text-slate-200 leading-relaxed ${textSize === 'large' ? 'text-sm' : 'text-xs'}`}
            >
              <ReactMarkdown>{filteredContent}</ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Modal Footer Banner */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>KayBiT_WhatsApp Capstone Studio • Multi-Platform Native Package</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintToPdf}
              className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium rounded-lg transition-all text-xs flex items-center gap-1.5 active:scale-95"
              title="Export current document to PDF or print"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export PDF / Print</span>
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => setTextSize(textSize === 'normal' ? 'large' : 'normal')}
              className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
            >
              Text Size: <span className="font-semibold text-slate-300 capitalize">{textSize}</span>
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg transition-all text-xs"
            >
              Close Manual
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
