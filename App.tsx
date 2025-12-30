
import React, { useState, useCallback, useMemo } from 'react';
import { STAGES, UI_STRINGS } from './constants';
import { StageId, AgentLog, Language } from './types';
import FloatingSandbox from './components/FloatingSandbox';
import { runAgenticCycle } from './services/geminiService';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('zh');
  const [activeStageId, setActiveStageId] = useState<StageId>(StageId.BRAIN);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [finalResult, setFinalResult] = useState<string | null>(null);

  const activeStage = useMemo(() => STAGES.find(s => s.id === activeStageId)!, [activeStageId]);
  const stageContent = activeStage[lang];
  const currentStep = stageContent.steps[currentStepIndex];
  const t = UI_STRINGS[lang];

  const addLog = useCallback((type: AgentLog['type'], content: string) => {
    const newLog: AgentLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      type,
      content
    };
    setLogs(prev => [...prev, newLog]);
  }, []);

  const handleStageChange = (id: StageId) => {
    setActiveStageId(id);
    setCurrentStepIndex(0);
    setLogs([]);
    setFinalResult(null);
  };

  const handleRunAgent = async (userInput: string) => {
    if (!userInput.trim()) return;
    setIsThinking(true);
    setFinalResult(null);
    setLogs([]);
    
    addLog('system', lang === 'en' ? `Executing step: ${currentStep.title}` : `执行步骤: ${currentStep.title}`);
    
    const result = await runAgenticCycle(userInput, lang, ({ type, content }) => {
      addLog(type, content);
    });

    setFinalResult(result);
    setIsThinking(false);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-80 bg-slate-900 border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center text-white font-bold">A</div>
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-tighter">{t.appTitle}</h1>
              <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{t.appSubtitle}</p>
            </div>
          </div>
          <button 
            onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')}
            className="w-full py-1.5 px-3 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-slate-400 hover:text-white transition-colors"
          >
            {t.langToggle}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-8">
          {STAGES.map(stage => (
            <div key={stage.id} className="space-y-2">
              <h3 className={`text-[10px] font-black uppercase tracking-widest px-2 ${activeStageId === stage.id ? 'text-indigo-400' : 'text-slate-600'}`}>
                {stage[lang].title}
              </h3>
              <div className="space-y-1">
                {stage[lang].steps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveStageId(stage.id);
                      setCurrentStepIndex(idx);
                      setLogs([]);
                      setFinalResult(null);
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs transition-all ${
                      activeStageId === stage.id && currentStepIndex === idx
                        ? 'bg-indigo-600/10 text-white font-bold border-l-2 border-indigo-500'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {idx + 1}. {step.title}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Step Header */}
        <div className="p-8 bg-slate-900/50 border-b border-white/5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest bg-gradient-to-r ${activeStage.color} text-white`}>
                {stageContent.subtitle}
              </span>
              <h2 className="text-2xl font-black text-white tracking-tight">{currentStep.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentStepIndex === 0 && STAGES.findIndex(s => s.id === activeStageId) === 0}
                onClick={() => {
                  if (currentStepIndex > 0) setCurrentStepIndex(c => c - 1);
                  else {
                    const idx = STAGES.findIndex(s => s.id === activeStageId);
                    const prevStage = STAGES[idx - 1];
                    setActiveStageId(prevStage.id);
                    setCurrentStepIndex(prevStage[lang].steps.length - 1);
                  }
                }}
                className="p-2 hover:bg-white/5 rounded text-slate-500 hover:text-white transition-colors disabled:opacity-20"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <span className="text-[10px] font-black font-mono text-slate-600">{currentStepIndex + 1} / {stageContent.steps.length}</span>
              <button 
                disabled={currentStepIndex === stageContent.steps.length - 1 && STAGES.findIndex(s => s.id === activeStageId) === STAGES.length - 1}
                onClick={() => {
                   if (currentStepIndex < stageContent.steps.length - 1) setCurrentStepIndex(c => c + 1);
                   else {
                    const idx = STAGES.findIndex(s => s.id === activeStageId);
                    handleStageChange(STAGES[idx + 1].id);
                   }
                }}
                className="p-2 hover:bg-white/5 rounded text-slate-500 hover:text-white transition-colors disabled:opacity-20"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
          <p className="text-slate-400 font-medium max-w-3xl leading-relaxed">{currentStep.description}</p>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-8 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.implementation}</h3>
            <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              Copy Source
            </button>
          </div>
          <div className="flex-1 bg-[#0d1117] border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
            <pre className="p-8 font-mono text-sm text-slate-300 leading-relaxed overflow-x-auto whitespace-pre h-full">
              {currentStep.code.split('\n').map((line, i) => (
                <div key={i} className="flex hover:bg-white/5 -mx-8 px-8">
                  <span className="w-12 text-slate-700 text-right pr-6 select-none">{i + 1}</span>
                  <span className={
                    line.includes('//') ? 'text-slate-600 italic' :
                    line.includes('import') || line.includes('export') ? 'text-pink-500' :
                    line.includes('async') || line.includes('function') || line.includes('const') ? 'text-blue-400' :
                    line.includes('await') ? 'text-purple-400' :
                    'text-slate-300'
                  }>
                    {line}
                  </span>
                </div>
              ))}
            </pre>
          </div>
        </div>

        {/* Footer info */}
        <footer className="px-8 py-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-slate-600 uppercase">Stage Status</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-slate-600 uppercase">Concepts</span>
              <div className="flex gap-1">
                {stageContent.topics.map((t, i) => (
                  <span key={i} className="text-[9px] font-bold text-slate-400 px-1.5 py-0.5 bg-white/5 rounded">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </footer>

        {/* Collapsible Sandbox */}
        <FloatingSandbox 
          logs={logs} 
          isThinking={isThinking} 
          lang={lang} 
          onRun={handleRunAgent} 
          finalResult={finalResult} 
        />
      </main>
    </div>
  );
};

export default App;
