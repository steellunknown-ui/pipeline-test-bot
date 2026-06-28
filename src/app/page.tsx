'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';

export default function Chat() {
  const { messages, sendMessage, error, status } = useChat({
    fetch: async (url, options) => {
      // Force credentials to be sent so Vercel Authentication cookies are included!
      return fetch(url, { ...options, credentials: 'include' });
    }
  });
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isSubmitting = status === 'submitted' || status === 'streaming';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSubmitting) return;
    sendMessage({ parts: [{ type: 'text', text: input }], role: 'user' });
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white">Pipeline AI</h1>
            <p className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">Powered by OpenRouter</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-medium text-zinc-300">Live</span>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
              <div className="w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">How can I help you today?</h2>
              <p className="text-sm text-zinc-400 max-w-md">I'm connected to OpenRouter and ready to assist you. Try asking me anything.</p>
            </div>
          )}

          {messages.map(m => (
            <div key={m.id} className={`flex gap-4 opacity-0 animate-[slideUp_0.3s_ease-out_forwards] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center ${m.role === 'user' ? 'bg-zinc-800 border border-white/10' : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20'}`}>
                {m.role === 'user' ? (
                  <svg className="w-4 h-4 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col max-w-[80%] ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  <span className="text-[11px] font-medium text-zinc-400">
                    {m.role === 'user' ? 'You' : 'AI Assistant'}
                  </span>
                </div>
                <div className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-zinc-800 text-zinc-100 rounded-tr-sm border border-white/5' 
                    : 'bg-gradient-to-b from-indigo-500/10 to-purple-500/10 text-zinc-200 border border-indigo-500/20 rounded-tl-sm'
                }`}>
                  <div className="whitespace-pre-wrap break-words">
                    {m.parts ? m.parts.map((p, i) => p.type === 'text' ? <span key={i}>{p.text}</span> : null) : null}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isSubmitting && (
            <div className="flex gap-4 opacity-0 animate-[slideUp_0.3s_ease-out_forwards]">
              <div className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex flex-col items-start max-w-[80%]">
                <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-gradient-to-b from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex gap-4 opacity-0 animate-[slideUp_0.3s_ease-out_forwards]">
              <div className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center bg-red-500/10 border border-red-500/20">
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex flex-col items-start max-w-[80%]">
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400 font-medium">An error occurred while connecting to OpenRouter.</p>
                  <p className="text-xs text-red-400/80 mt-1 font-mono break-all bg-red-500/5 p-2 rounded">{error.message}</p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0a0a0a]/80 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-zinc-900 border border-white/10 hover:border-white/20 focus-within:border-indigo-500/50 rounded-3xl p-1.5 transition-colors shadow-lg">
            <div className="flex-1 min-h-[44px] flex items-center">
              <input
                className="w-full bg-transparent text-zinc-100 placeholder:text-zinc-500 outline-none px-4 text-[15px]"
                value={input}
                placeholder="Message Pipeline AI..."
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>
            <button 
              type="submit" 
              disabled={!input.trim() || isSubmitting}
              className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:bg-white/5 disabled:text-zinc-500 transition-all active:scale-95"
            >
              <svg className="w-5 h-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19V5m0 0l-7 7m7-7l7 7" />
              </svg>
            </button>
          </form>
          <div className="text-center mt-3 mb-1">
            <p className="text-[10px] text-zinc-500 font-medium">AI models can make mistakes. Check important info.</p>
          </div>
        </div>
      </div>
      
      {/* Required CSS Animations (Could be in globals.css, inline for now) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}
