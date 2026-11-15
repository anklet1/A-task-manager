import React, { useState } from 'react';
import { Settings, Smartphone, BookOpen, BrainCircuit, CheckCircle2, XCircle, ChevronRight, MessageSquare, Menu as MenuIcon } from 'lucide-react';
import { generateSimulation } from './lib/simulation';
import type { GeneratedLesson } from './lib/simulation';

export type DeploymentFormat = 'offline-pwa' | 'whatsapp-bot' | 'ussd-tree';
export type GradeLevel = 'JHS 1' | 'JHS 2' | 'JHS 3' | 'SHS 1' | 'SHS 2' | 'SHS 3';

export interface AppConfig {
  topic: string;
  gradeLevel: GradeLevel;
  deploymentFormat: DeploymentFormat;
  outline: string;
}

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const [config, setConfig] = useState<AppConfig>({
    topic: '',
    gradeLevel: 'JHS 1',
    deploymentFormat: 'offline-pwa',
    outline: '',
  });

  const [generatedLesson, setGeneratedLesson] = useState<GeneratedLesson | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showRemediation, setShowRemediation] = useState<string | null>(null); // Question ID

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate network delay
    setTimeout(() => {
      const lesson = generateSimulation(config.topic, config.outline, config.gradeLevel);
      setGeneratedLesson(lesson);
      setActiveQuestion(0);
      setSelectedAnswers({});
      setShowRemediation(null);
      setIsGenerating(false);
    }, 800);
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number, isCorrect: boolean) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));

    if (!isCorrect) {
      setShowRemediation(questionId);
    } else {
      setShowRemediation(null);
      // Automatically move to next question after a short delay if correct
      setTimeout(() => {
        if (generatedLesson && activeQuestion < generatedLesson.questions.length - 1) {
          setActiveQuestion(prev => prev + 1);
        }
      }, 1000);
    }
  };

  const renderPWA = () => {
    if (!generatedLesson) return null;
    const currentQ = generatedLesson.questions[activeQuestion];
    const selectedAnswerIndex = selectedAnswers[currentQ.id];
    const isAnswered = selectedAnswerIndex !== undefined;
    const isCorrect = selectedAnswerIndex === currentQ.correctAnswerIndex;
    const remediation = showRemediation === currentQ.id
      ? generatedLesson.remediationRules[currentQ.id]?.find(r => r.triggerOptionIndex === selectedAnswerIndex)
      : null;

    return (
      <div className="flex-1 overflow-y-auto bg-white text-slate-900 w-full rounded-b-2xl">
        {/* PWA Header */}
        <div className="bg-amber-500 text-white p-4 shadow-sm sticky top-0 z-10">
          <h3 className="font-bold text-lg">{generatedLesson.topic}</h3>
          <p className="text-amber-100 text-xs">{generatedLesson.gradeLevel} Lesson</p>
        </div>

        <div className="p-5 space-y-6">
          {/* Lesson Content */}
          <section className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
              <BookOpen size={18} className="text-amber-500" /> Lesson Content
            </h4>
            <p className="text-sm text-slate-600 mb-3 leading-relaxed">{generatedLesson.intro}</p>
            <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
              {generatedLesson.keyPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </section>

          {/* Assessment Section */}
          <section>
            <div className="flex justify-between items-end mb-3">
              <h4 className="font-semibold text-slate-800">Knowledge Check</h4>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                {activeQuestion + 1} / {generatedLesson.questions.length}
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <p className="font-medium text-slate-800 mb-4">{currentQ.text}</p>

              <div className="space-y-2">
                {currentQ.options.map((opt, idx) => {
                  let btnClass = "w-full text-left p-3 rounded-lg border text-sm transition-all ";

                  if (isAnswered) {
                    if (idx === currentQ.correctAnswerIndex) {
                      btnClass += "bg-green-50 border-green-500 text-green-800";
                    } else if (idx === selectedAnswerIndex) {
                      btnClass += "bg-red-50 border-red-500 text-red-800";
                    } else {
                      btnClass += "bg-slate-50 border-slate-200 text-slate-500 opacity-50";
                    }
                  } else {
                    btnClass += "bg-white border-slate-200 text-slate-700 hover:border-amber-400 hover:bg-amber-50";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleAnswerSelect(currentQ.id, idx, idx === currentQ.correctAnswerIndex)}
                      className={btnClass}
                    >
                      <div className="flex justify-between items-center">
                        <span>{opt}</span>
                        {isAnswered && idx === currentQ.correctAnswerIndex && <CheckCircle2 size={18} className="text-green-500" />}
                        {isAnswered && idx === selectedAnswerIndex && idx !== currentQ.correctAnswerIndex && <XCircle size={18} className="text-red-500" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Adaptive Remediation Inline Alert */}
              {remediation && (
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-start gap-3">
                    <BrainCircuit className="text-amber-600 mt-0.5" size={20} />
                    <div>
                      <h5 className="font-semibold text-amber-900 text-sm">Let's re-think that</h5>
                      <p className="text-amber-800 text-xs mt-1">{remediation.explanation}</p>
                      <div className="mt-2 bg-amber-100/50 p-2 rounded text-amber-900 text-xs italic border-l-2 border-amber-400">
                        " {remediation.simplifiedAnalogy} "
                      </div>
                      <button
                        onClick={() => {
                          // Reset answer for this question
                          const newAnswers = {...selectedAnswers};
                          delete newAnswers[currentQ.id];
                          setSelectedAnswers(newAnswers);
                          setShowRemediation(null);
                        }}
                        className="mt-3 text-xs font-medium bg-amber-200 hover:bg-amber-300 text-amber-900 px-3 py-1.5 rounded-full transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Next Button */}
            {isAnswered && isCorrect && activeQuestion < generatedLesson.questions.length - 1 && (
              <button
                onClick={() => setActiveQuestion(prev => prev + 1)}
                className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                Next Question <ChevronRight size={18} />
              </button>
            )}

            {isAnswered && isCorrect && activeQuestion === generatedLesson.questions.length - 1 && (
               <div className="mt-4 bg-green-100 text-green-800 p-4 rounded-xl text-center font-medium border border-green-200">
                 Lesson Completed! 🎉
               </div>
            )}
          </section>
        </div>
      </div>
    );
  };

  const renderWhatsAppBot = () => {
    if (!generatedLesson) return null;
    const currentQ = generatedLesson.questions[activeQuestion];
    const selectedAnswerIndex = selectedAnswers[currentQ.id];
    const isAnswered = selectedAnswerIndex !== undefined;
    const isCorrect = selectedAnswerIndex === currentQ.correctAnswerIndex;
    const remediation = showRemediation === currentQ.id
      ? generatedLesson.remediationRules[currentQ.id]?.find(r => r.triggerOptionIndex === selectedAnswerIndex)
      : null;

    return (
      <div className="flex-1 flex flex-col bg-[#efeae2] w-full rounded-b-2xl overflow-hidden relative">
        {/* WhatsApp Header */}
        <div className="bg-[#00a884] text-white p-3 flex items-center gap-3 shadow-sm z-10">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <BrainCircuit size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">EduBot AI</h3>
            <p className="text-[10px] text-white/80">online</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://static.whatsapp.net/rsrc.php/v3/yl/r/gi_DckOUM5a.png')] bg-repeat opacity-90 text-sm">

          {/* Bot Lesson Message */}
          {activeQuestion === 0 && !isAnswered && (
             <div className="flex flex-col gap-1 max-w-[85%]">
               <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-slate-800">
                 <p className="font-bold mb-1">📚 *{generatedLesson.topic}*</p>
                 <p className="mb-2">{generatedLesson.intro}</p>
                 <p className="italic text-xs text-slate-500 mb-1">Key points:</p>
                 <ul className="pl-4 mb-2">
                   {generatedLesson.keyPoints.map((pt, i) => <li key={i}>• {pt}</li>)}
                 </ul>
               </div>
             </div>
          )}

          {/* Bot Question Message */}
          <div className="flex flex-col gap-1 max-w-[85%]">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-slate-800">
              <p className="font-bold mb-2">❓ Question {activeQuestion + 1}</p>
              <p className="mb-2">{currentQ.text}</p>
              <div className="space-y-1">
                {currentQ.options.map((opt, idx) => (
                  <p key={idx} className="bg-slate-50 p-2 rounded border border-slate-100">
                    <span className="font-bold mr-2 text-slate-500">{idx + 1}.</span> {opt}
                  </p>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2 italic">Reply with a number (1-{currentQ.options.length})</p>
            </div>
          </div>

          {/* User Reply */}
          {isAnswered && (
            <div className="flex flex-col gap-1 max-w-[85%] self-end ml-auto">
              <div className="bg-[#d9fdd3] p-2 px-3 rounded-2xl rounded-tr-none shadow-sm text-slate-800">
                {selectedAnswerIndex + 1}
              </div>
            </div>
          )}

          {/* Bot Feedback / Remediation */}
          {isAnswered && (
            <div className="flex flex-col gap-1 max-w-[85%]">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm text-slate-800">
                {isCorrect ? (
                  <p>✅ Correct! Great job.</p>
                ) : (
                  <div>
                    <p>❌ Incorrect.</p>
                    {remediation && (
                      <div className="mt-2 text-sm">
                        <p className="italic text-slate-600 mb-1">💡 {remediation.explanation}</p>
                        <p className="font-medium">"{remediation.simplifiedAnalogy}"</p>
                      </div>
                    )}
                    <p className="text-xs text-slate-500 mt-2 italic">Reply with another number to try again.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Chat Input Placeholder */}
        <div className="bg-[#f0f2f5] p-2 flex items-center gap-2">
          <div className="flex-1 bg-white rounded-full py-2 px-4 text-slate-400 text-sm">
            Type a message
          </div>
          <div className="bg-[#00a884] w-10 h-10 rounded-full flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M1.101 21.757 23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path></svg>
          </div>
        </div>
      </div>
    );
  };

  const renderUSSD = () => {
    if (!generatedLesson) return null;
    const currentQ = generatedLesson.questions[activeQuestion];
    const selectedAnswerIndex = selectedAnswers[currentQ.id];
    const isAnswered = selectedAnswerIndex !== undefined;
    const isCorrect = selectedAnswerIndex === currentQ.correctAnswerIndex;
    const remediation = showRemediation === currentQ.id
      ? generatedLesson.remediationRules[currentQ.id]?.find(r => r.triggerOptionIndex === selectedAnswerIndex)
      : null;

    return (
      <div className="flex-1 flex flex-col bg-black w-full rounded-b-2xl p-4 font-mono">
        <div className="flex-1 border border-green-500/30 rounded p-4 text-green-500 text-sm shadow-[0_0_15px_rgba(34,197,94,0.1)] relative">

          {/* USSD Modal Overlay */}
          <div className="absolute inset-0 m-4 bg-slate-900 border-2 border-slate-400 p-3 shadow-2xl flex flex-col">
            <div className="flex-1 overflow-y-auto pb-4">
              {activeQuestion === 0 && !isAnswered && (
                <div className="mb-4">
                  <p className="uppercase mb-2 font-bold">{generatedLesson.topic}</p>
                  <p className="text-xs mb-2 leading-tight">{generatedLesson.intro.substring(0, 80)}...</p>
                  <p className="text-xs mb-1">1. Read full lesson</p>
                  <p className="text-xs">2. Take Quiz</p>
                </div>
              )}

              {/* Simplified USSD Question View */}
              <p className="text-xs mb-2 leading-tight">Q{activeQuestion + 1}: {currentQ.text}</p>
              {currentQ.options.map((opt, idx) => (
                <p key={idx} className="text-xs mb-1 truncate">{idx + 1}. {opt}</p>
              ))}

              {isAnswered && !isCorrect && remediation && (
                <div className="mt-4 border-t border-dashed border-slate-500 pt-2">
                  <p className="text-xs text-red-400 mb-1">Incorrect.</p>
                  <p className="text-xs italic leading-tight">{remediation.simplifiedAnalogy}</p>
                  <p className="text-xs mt-2">0. Try again</p>
                </div>
              )}

              {isAnswered && isCorrect && (
                 <div className="mt-4 border-t border-dashed border-slate-500 pt-2">
                 <p className="text-xs text-green-400 mb-1">Correct!</p>
                 <p className="text-xs mt-2">1. Next Q</p>
                 <p className="text-xs">0. Main Menu</p>
               </div>
              )}
            </div>

            <div className="mt-auto">
              <div className="border border-slate-400 p-1 px-2 flex">
                 <span className="animate-pulse mr-1">_</span>
              </div>
              <div className="flex justify-between mt-2">
                <button className="text-xs bg-slate-700 px-3 py-1 rounded">CANCEL</button>
                <button className="text-xs bg-slate-700 px-3 py-1 rounded text-green-400">SEND</button>
              </div>
            </div>
          </div>
        </div>

        {/* Fake Keypad */}
        <div className="h-32 mt-4 grid grid-cols-3 gap-2 opacity-30">
          {[1,2,3,4,5,6,7,8,9,'*',0,'#'].map(key => (
            <div key={key} className="bg-slate-800 rounded flex items-center justify-center text-slate-400 font-bold">
              {key}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-amber-500" size={28} />
          <h1 className="text-xl font-bold tracking-tight">EduBuilder <span className="text-amber-500">AI</span></h1>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Configuration */}
        <section className="w-1/2 p-6 overflow-y-auto border-r border-slate-800 flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="text-slate-400" size={20} />
            <h2 className="text-lg font-semibold">AI Engine Configuration</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Topic Title</label>
              <input
                type="text"
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-200 placeholder-slate-600"
                placeholder="e.g., The Water Cycle"
                value={config.topic}
                onChange={(e) => setConfig({ ...config, topic: e.target.value })}
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-400 mb-1">Grade Level</label>
                <select
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-200"
                  value={config.gradeLevel}
                  onChange={(e) => setConfig({ ...config, gradeLevel: e.target.value as GradeLevel })}
                >
                  <option value="JHS 1">JHS 1</option>
                  <option value="JHS 2">JHS 2</option>
                  <option value="JHS 3">JHS 3</option>
                  <option value="SHS 1">SHS 1</option>
                  <option value="SHS 2">SHS 2</option>
                  <option value="SHS 3">SHS 3</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-400 mb-1">Deployment Format</label>
                <select
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-200"
                  value={config.deploymentFormat}
                  onChange={(e) => setConfig({ ...config, deploymentFormat: e.target.value as DeploymentFormat })}
                >
                  <option value="offline-pwa">Offline PWA</option>
                  <option value="whatsapp-bot">WhatsApp Bot JSON</option>
                  <option value="ussd-tree">USSD Tree</option>
                </select>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <label className="block text-sm font-medium text-slate-400 mb-1">Raw Text Lesson Outline</label>
              <textarea
                className="w-full h-48 bg-slate-900 border border-slate-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-200 placeholder-slate-600 resize-none font-mono text-sm leading-relaxed"
                placeholder="Paste the lesson outline here..."
                value={config.outline}
                onChange={(e) => setConfig({ ...config, outline: e.target.value })}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !config.topic}
              className={`w-full font-bold py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2 mt-4
                ${isGenerating || !config.topic ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'}`}
            >
              <BrainCircuit size={18} className={isGenerating ? "animate-pulse" : ""} />
              {isGenerating ? "Simulating AI Generation..." : "Generate App"}
            </button>
          </div>
        </section>

        {/* Right Panel: Live Preview */}
        <section className="w-1/2 bg-slate-950 p-6 flex items-center justify-center relative overflow-hidden">
            {/* Background design element */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #fbbf24 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

            <div className="flex flex-col items-center z-10 w-full max-w-md h-full justify-center">
              <div className="flex items-center gap-2 mb-4 self-start">
                  {config.deploymentFormat === 'whatsapp-bot' ? <MessageSquare className="text-amber-500" size={20} /> :
                   config.deploymentFormat === 'ussd-tree' ? <MenuIcon className="text-amber-500" size={20} /> :
                   <Smartphone className="text-amber-500" size={20} />}
                  <h2 className="text-lg font-semibold">Live Preview <span className="text-slate-500 text-sm font-normal ml-2">({config.deploymentFormat})</span></h2>
              </div>

              <div className="w-full h-[700px] max-h-[85vh] bg-slate-900 rounded-[2.5rem] border-[12px] border-slate-800 shadow-2xl relative flex flex-col shadow-amber-900/10">
                  {/* Notch mockup */}
                  <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
                      <div className="w-1/3 h-5 bg-slate-800 rounded-b-2xl"></div>
                  </div>

                  {/* App Content */}
                  {!generatedLesson ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-500">
                        <BookOpen size={48} className={`mb-4 opacity-50 text-amber-500 ${isGenerating ? 'animate-bounce' : ''}`} />
                        <p>{isGenerating ? "Processing content..." : "Click 'Generate App' to preview the generated lesson."}</p>
                    </div>
                  ) : (
                    <>
                      {config.deploymentFormat === 'offline-pwa' && renderPWA()}
                      {config.deploymentFormat === 'whatsapp-bot' && renderWhatsAppBot()}
                      {config.deploymentFormat === 'ussd-tree' && renderUSSD()}
                    </>
                  )}
              </div>
            </div>
        </section>
      </main>
    </div>
  );
};

export default App;
