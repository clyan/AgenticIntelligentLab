
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
  stepTitle: string;
}

const FloatingSandbox: React.FC<FloatingSandboxProps> = ({ 
  logs, 
  isThinking, 
  lang, 
  onRun, 
  finalResult,
  stepTitle 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const t = UI_STRINGS[lang];

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95 z-50 border border-white/20"
      >
        <div className="relative">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /></svg>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
        </div>
        <span className="font-black uppercase tracking-widest text-xs">{lang === 'en' ? 'Run Source Code' : '运行步骤源码'}</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-[650px] h-[700px] bg-slate-900 border-l border-t border-white/10 shadow-2xl flex flex-col z-[100] animate-in slide-in-from-right-20">
      <div className="bg-slate-800/80 backdrop-blur-md p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="px-2 py-1 bg-indigo-500/20 rounded border border-indigo-500/30">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Executor v1.0</span>
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-white truncate max-w-[300px]">
             {lang === 'en' ? 'Running:' : '当前运行:'} {stepTitle}
          </h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col p-6 gap-6">
        {/* Input Area */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
               {lang === 'en' ? 'Runtime Arguments (Input)' : '运行时参数 (输入)'}
            </label>
            <span className="text-[9px] text-slate-600 font-mono">AISuite.generate(args)</span>
          </div>
          <div className="relative group">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-slate-200 resize-none outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono"
              placeholder={lang === 'en' ? "Enter query for the model..." : "输入发给模型的查询内容..."}
            />
            <button 
              onClick={() => onRun(input)}
              disabled={isThinking || !input}
              className="absolute bottom-4 right-4 bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-white font-bold text-xs shadow-xl disabled:bg-slate-800 disabled:text-slate-600 flex items-center gap-2 transition-all active:scale-95"
            >
              {isThinking ? (
                <>
                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  {lang === 'en' ? 'Executing...' : '执行中...'}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                  {lang === 'en' ? 'Run Code' : '执行代码'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Area */}
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <div className="flex-1 flex flex-col bg-black/60 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center justify-between">
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{lang === 'en' ? 'Terminal Output' : '终端输出'}</span>
              <button onClick={() => onRun('')} className="text-[9px] text-slate-600 hover:text-slate-400 uppercase font-bold">Clear</button>
            </div>
            <Terminal logs={logs} isThinking={isThinking} lang={lang} />
          </div>

          <div className="h-32 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-4 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
              <label className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">{t.finalOutput}</label>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <p className="text-sm text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
                {finalResult || (isThinking ? '...' : <span className="text-slate-600 italic">{t.noOutput}</span>)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingSandbox;
