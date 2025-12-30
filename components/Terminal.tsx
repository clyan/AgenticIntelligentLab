
import React, { useRef, useEffect } from 'react';
import { AgentLog, Language } from '../types';

interface TerminalProps {
  logs: AgentLog[];
  isThinking: boolean;
  lang: Language;
}

const Terminal: React.FC<TerminalProps> = ({ logs, isThinking, lang }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isThinking]);

  const getLabel = (type: AgentLog['type']) => {
    const labels = {
      thought: lang === 'en' ? 'THINK' : '推理',
      action: lang === 'en' ? 'EXEC' : '执行',
      observation: lang === 'en' ? 'OBS' : '观察',
      system: lang === 'en' ? 'SYS' : '系统'
    };
    return labels[type];
  };

  return (
    <div ref={scrollRef} className="h-full p-4 overflow-y-auto space-y-4 font-mono text-[11px] leading-relaxed">
      {logs.map((log) => (
        <div key={log.id} className="animate-in fade-in slide-in-from-left-2 duration-300">
          <div className="flex items-baseline gap-2">
            <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
              log.type === 'thought' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
              log.type === 'action' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
              log.type === 'observation' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
              'bg-slate-500/20 text-slate-400 border border-slate-500/30'
            }`}>
              {getLabel(log.type)}
            </span>
            <span className="text-slate-300 flex-1">{log.content}</span>
          </div>
        </div>
      ))}
      {isThinking && (
        <div className="flex items-center gap-2 text-indigo-400 animate-pulse py-2">
          <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
          <span className="font-bold">{lang === 'en' ? 'Processing cycle...' : '循环处理中...'}</span>
        </div>
      )}
      {logs.length === 0 && !isThinking && (
        <div className="h-full flex items-center justify-center">
           <p className="text-slate-700 text-center italic">{lang === 'en' ? '// Awaiting execution' : '// 等待执行'}</p>
        </div>
      )}
    </div>
  );
};

export default Terminal;
