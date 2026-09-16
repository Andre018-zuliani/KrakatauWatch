import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  User, 
  BookmarkCheck, 
  HelpCircle, 
  BookOpen, 
  ShieldCheck
} from 'lucide-react';
import { ChatMessage } from '../types.ts';
import { KRAKATAU_RAG_DOCUMENTS } from '../data/mockKnowledgeBase.ts';

interface RAGChatbotProps {
  // Komponen RAGChatbot mandiri tanpa pembedaan mode petugas
}

export const RAGChatbot: React.FC<RAGChatbotProps> = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'Halo! Asisten resmi panduan mitigasi dan keselamatan Gunung Anak Krakatau terintegrasi basis data SOP PVMBG & BNPB siap membantu Anda. Anda dapat menanyakan kriteria status aktivitas vulkanik, batas zona bahaya KRB, jalur evakuasi pesisir, perbandingan erupsi, dan langkah keselamatan.',
      timestamp: 'Baru saja',
      sources: [
        {
          title: 'SOP PVMBG No. 04/2023',
          section: 'Kriteria Status dan Zona Bahaya'
        }
      ]
    }
  ]);

  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDocumentBrowser, setShowDocumentBrowser] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const activePrompts = [
    'Apa kriteria kenaikan status ke Level III (Siaga) menurut SOP PVMBG?',
    'Apa yang harus dilakukan warga jika berada di pesisir Anyer & Carita saat ini?',
    'Berapa batas radius bahaya aman dari kawah Gunung Anak Krakatau?',
    'Bagaimana jalur evakuasi dan nomor darurat BPBD setempat?'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-4)
        })
      });

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Data tidak tersedia dari server.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || []
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (_err) {
      const errorMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: 'Sistem penalaran beroperasi menggunakan basis data mitigasi lokal. Tetap berpedoman pada arahan resmi PVMBG dan BPBD.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="rag-assistant-panel" className="bg-white dark:bg-[#071912] rounded-xl border border-slate-200 dark:border-emerald-900/40 p-4 shadow-xs transition-colors flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-slate-200 dark:border-emerald-950 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800/60">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Asisten Tanya-Jawab Prosedur Kebencanaan (RAG)
              <span className="text-[10px] px-2 py-0.2 rounded font-mono font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
                PVMBG & BNPB SOP
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Basis Pengetahuan: Dokumen SOP PVMBG, Perka BNPB 2012, dan Histori Erupsi 1883/2018
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowDocumentBrowser(!showDocumentBrowser)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-[#05140e] dark:hover:bg-emerald-950 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-300 dark:border-emerald-900 transition-colors shadow-xs"
        >
          <BookOpen className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{showDocumentBrowser ? 'Tutup Indeks Dokumen' : 'Pustaka Dokumen SOP'}</span>
        </button>
      </div>

      {/* Document Browser Drawer */}
      {showDocumentBrowser && (
        <div className="mb-3 p-3 bg-slate-50 dark:bg-black/60 rounded-lg border border-slate-200 dark:border-emerald-900 text-xs space-y-2 max-h-48 overflow-y-auto">
          <div className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Dokumen Resmi Terindeks dalam Sistem:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {KRAKATAU_RAG_DOCUMENTS.map(doc => (
              <div key={doc.id} className="p-2 bg-white dark:bg-[#05140e] rounded border border-slate-200 dark:border-emerald-950 shadow-xs">
                <div className="font-medium text-slate-900 dark:text-white text-[11px] truncate">{doc.title}</div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">{doc.sourceCode} ({doc.year})</div>
                <p className="text-[10px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">{doc.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Feed */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[260px] max-h-[420px]">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-6 h-6 rounded bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-center shrink-0 mt-0.5 text-emerald-800 dark:text-emerald-300">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed shadow-xs ${
              msg.sender === 'user'
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-50 dark:bg-[#05140e] border border-slate-200 dark:border-emerald-950 text-slate-800 dark:text-slate-200'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-emerald-950 text-[10px] text-slate-500 dark:text-slate-400 space-y-0.5">
                  <div className="font-medium flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                    <BookmarkCheck className="w-3 h-3" />
                    <span>Rujukan Dokumen:</span>
                  </div>
                  {msg.sources.map((src, i) => (
                    <div key={i} className="pl-2 border-l-2 border-emerald-600 text-slate-700 dark:text-slate-300">
                      <strong>{src.section}</strong>: {src.title}
                    </div>
                  ))}
                </div>
              )}

              <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-1 text-right font-mono">
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-slate-700 dark:text-slate-300">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2 items-center text-xs text-slate-500 dark:text-slate-400">
            <div className="w-6 h-6 rounded bg-emerald-100 dark:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-center shrink-0 text-emerald-800 dark:text-emerald-300">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-slate-50 dark:bg-[#05140e] border border-slate-200 dark:border-emerald-950 rounded px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 font-mono shadow-xs">
              Memproses kueri terhadap basis pengetahuan SOP...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-emerald-950">
        <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>Pertanyaan Terkait Prosedur:</span>
        </div>
        <div className="flex flex-wrap gap-1 overflow-x-auto pb-0.5">
          {activePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-[#05140e] dark:hover:bg-emerald-950 border border-slate-200 dark:border-emerald-950 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors text-left truncate max-w-full shadow-xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-2 flex items-center gap-1.5"
      >
        <input
          id="rag-chat-input"
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Tanyakan panduan keselamatan, status SOP, radius aman, atau jalur evakuasi..."
          className="flex-1 bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className="p-2 rounded-md bg-emerald-700 hover:bg-emerald-600 text-white transition-colors disabled:opacity-40 shadow-xs"
          title="Kirim pertanyaan"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
