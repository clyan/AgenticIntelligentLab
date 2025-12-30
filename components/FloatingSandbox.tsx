
import React, { useState } from 'react';
import Terminal from './Terminal';
import { AgentLog, Language } from '../types';
import { UI_STRINGS } from '../constants';

interface FloatingSandboxProps {
  logs: AgentLog[];
  isThinking: boolean;
  lang: Language;
  onRun: (input: string) => void;
  finalResult: string | null;
}

const FloatingSandbox: React.FC<FloatingSandboxProps> = ({ logs, isThinking, lang, onRun, finalResult }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const t = UI_STRINGS[lang];

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-2xl flex items-center gap-3 transition-all animate-bounce"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span className="font-bold pr-2">{t.playgroundTitle}</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-[600px] h-[600px] bg-slate-900 border-l border-t border-white/10 shadow-2xl flex flex-col z-[100] animate-in slide-in-from-bottom-20">
      <div className="bg-slate-800 p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <h3 className="text-xs font-black uppercase tracking-widest text-white">{t.playgroundTitle}</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col p-6 gap-4">
        <div className="h-48">
          <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">{t.promptLabel}</label>
          <div className="relative h-full">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm text-slate-200 resize-none outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder={t.promptPlaceholder}
            />
            <button 
              onClick={() => onRun(input)}
              disabled={isThinking || !input}
              className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-500 p-2 rounded-lg text-white shadow-lg disabled:bg-slate-700"
            >
              {isThinking ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <div className="flex-1 bg-black/40 border border-white/5 rounded-xl overflow-hidden shadow-inner">
            <Terminal logs={logs} isThinking={isThinking} lang={lang} />
          </div>
          <div className="h-24 bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-3 overflow-y-auto">
            <label className="text-[9px] font-black uppercase text-indigo-400 mb-1 block">{t.finalOutput}</label>
            <p className="text-xs text-slate-300 font-medium">{finalResult || (isThinking ? '...' : t.noOutput)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingSandbox;
