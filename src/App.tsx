import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { scoreProject, rewriteAndPitch } from './services/geminiService';
import { ShipLogResult, SubmissionRewrite, PitchScript } from './types';
import { ScoreCard } from './components/ScoreCard';
import { CritiqueSection } from './components/CritiqueSection';
import { RewriteView } from './components/RewriteView';
import { Loader2, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { cn } from './lib/utils';

type AppState = 'input' | 'scoring' | 'result' | 'rewriting' | 'full-view';

export default function App() {
  const [state, setState] = useState<AppState>('input');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ShipLogResult | null>(null);
  const [rewrite, setRewrite] = useState<SubmissionRewrite | null>(null);
  const [pitch, setPitch] = useState<PitchScript | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScore = async () => {
    if (!input.trim()) return;
    
    setState('scoring');
    setError(null);
    try {
      const res = await scoreProject(input);
      setResult(res);
      setState('result');
    } catch (err) {
      setError('Scoring failed. Please try again.');
      setState('input');
      console.error(err);
    }
  };

  const handleRewrite = async () => {
    if (!result) return;
    setState('rewriting');
    setError(null);
    try {
      const { rewrite, pitch } = await rewriteAndPitch(input, result);
      setRewrite(rewrite);
      setPitch(pitch);
      setState('full-view');
    } catch (err) {
      setError('Rewrite failed. Please try again.');
      setState('result');
      console.error(err);
    }
  };

  const handleReset = () => {
    setState('input');
    setInput('');
    setResult(null);
    setRewrite(null);
    setPitch(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white font-sans selection:bg-[#e8ff00] selection:text-black">
      {/* Navigation */}
      <nav className="border-b border-white/10 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={handleReset}>
          <div className="w-8 h-8 bg-[#e8ff00] flex items-center justify-center text-black font-bold text-xl">S</div>
          <span className="text-lg font-mono tracking-tighter uppercase">SCORE-MY-IDEA</span>
        </div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-white/30 hidden md:block">
          HACKATHON CRITIQUE ENGINE v1.0
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <AnimatePresence mode="wait">
          {state === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto space-y-12"
            >
              <div className="space-y-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-[0.9]">
                  SCORE MY HACKATHON APP IDEA<br />
                  <span className="text-[#e8ff00]">BASED ON RUBRIC</span>
                </h1>
                <p className="text-white/40 font-mono text-xs uppercase tracking-widest">
                  Paste your hackathon idea here. Raw is fine.
                </p>
              </div>

              <div className="space-y-6">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. An AI tool that helps students study better using personalized quizzes..."
                  className="w-full h-64 bg-black border border-white/10 p-6 font-mono text-sm focus:border-[#e8ff00] focus:ring-1 focus:ring-[#e8ff00] transition-all outline-none resize-none"
                />
                
                <button
                  onClick={handleScore}
                  disabled={!input.trim()}
                  className="w-full py-4 bg-[#e8ff00] text-black font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  Score My Idea <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {error && (
                <p className="text-center text-orange-500 text-xs font-mono uppercase tracking-widest">{error}</p>
              )}

              {/* Rubric Header */}
              <div className="mt-32 text-center space-y-4">
                <h2 className="text-3xl font-bold uppercase tracking-tighter text-[#e8ff00]">Rubric for Scoring</h2>
                <p className="text-white/50 text-sm max-w-2xl mx-auto leading-relaxed">
                  The scoring logic is built directly on the five pillars below. Our engine parses your input to measure real-world impact and AI integration, ensuring every point awarded is backed by the specific criteria of this rubric.
                </p>
              </div>

              {/* Rubric Explanation Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto w-full">
                <div className="p-8 border border-white/10 bg-white/[0.03] rounded-xl space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#e8ff00]">01. Problem Framing (25 pts)</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Is the problem real and specific?
                  </p>
                  <p className="text-white/40 text-xs italic">
                    Example: "Saves 2 hours for busy freelancers" vs "Helps people manage money".
                  </p>
                </div>
                <div className="p-8 border border-white/10 bg-white/[0.03] rounded-xl space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#e8ff00]">02. AI Leverage (30 pts)</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Is AI used thoughtfully? Does it add real leverage?
                  </p>
                  <p className="text-white/40 text-xs italic">
                    Example: "AI analyzes sentiment and categorizes feedback" vs "AI generates a summary".
                  </p>
                </div>
                <div className="p-8 border border-white/10 bg-white/[0.03] rounded-xl space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#e8ff00]">03. Practical Usefulness (20 pts)</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Does this save time, reduce effort, or improve outcomes?
                  </p>
                  <p className="text-white/40 text-xs italic">
                    Example: "Automates 80% of manual data entry" vs "Makes data entry easier".
                  </p>
                </div>
                <div className="p-8 border border-white/10 bg-white/[0.03] rounded-xl space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#e8ff00]">04. Execution Quality (15 pts)</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Does it work end-to-end? Is it usable?
                  </p>
                  <p className="text-white/40 text-xs italic">
                    Example: "A fully functional web app with real data" vs "A mockup with placeholder text".
                  </p>
                </div>
                <div className="p-8 border border-white/10 bg-white/[0.03] rounded-xl space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-[#e8ff00]">05. Clarity (10 pts)</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Can a non-technical judge understand it in 60 seconds?
                  </p>
                  <p className="text-white/40 text-xs italic">
                    Example: "One clear sentence per section" vs "A paragraph of buzzwords".
                  </p>
                </div>
              </div>

              {/* Sample Idea Section */}
              <div className="mt-32 max-w-4xl mx-auto border border-[#e8ff00]/20 bg-[#e8ff00]/5 rounded-2xl overflow-hidden">
                <div className="bg-[#e8ff00] px-6 py-3 flex items-center justify-between">
                  <h2 className="text-black font-bold uppercase tracking-tighter text-sm">Sample Idea</h2>
                </div>
                
                <div className="p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="bg-black/40 p-6 rounded-lg border border-white/10 font-mono text-sm text-[#e8ff00] leading-relaxed select-all cursor-pointer group relative">
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white/30 uppercase">Click to select all</div>
                      Project: Med-Label AI<br />
                      Problem: Elderly patients often struggle to read small print on medication bottles, leading to 25% of medication errors in seniors.<br />
                      Solution: A simple web app where users snap a photo of their pill bottle.<br />
                      AI Leverage: Uses Gemini Vision to extract text and summarize dosage instructions into large-font, easy-to-read bullet points.<br />
                      Impact: Reduces medication errors for millions of seniors living independently.<br />
                      Execution: Built as a mobile-first web app using React and Gemini API for instant processing.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/10">
                    <div className="space-y-2">
                      <h4 className="text-[#e8ff00] text-xs font-bold uppercase tracking-widest">Why this works:</h4>
                      <ul className="space-y-3 text-white/60 text-xs leading-relaxed">
                        <li><span className="text-white font-semibold">Problem Framing:</span> It identifies a specific demographic (elderly) and a measurable pain point (25% error rate).</li>
                        <li><span className="text-white font-semibold">AI Leverage:</span> It uses AI for a task it's great at (OCR + Summarization) without over-engineering.</li>
                        <li><span className="text-white font-semibold">Practicality:</span> High impact on a vulnerable population with a clear "why".</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-[#e8ff00] text-xs font-bold uppercase tracking-widest">Writing Tips:</h4>
                      <ul className="space-y-3 text-white/60 text-xs leading-relaxed">
                        <li><span className="text-white font-semibold">Execution:</span> Mentions a clear tech stack (React + Gemini) and a specific platform (Mobile-web).</li>
                        <li><span className="text-white font-semibold">Clarity:</span> No buzzwords. Just "Snap photo" → "Get large text".</li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-8 text-center border-t border-white/10">
                    <p className="text-[#e8ff00] font-mono text-lg italic tracking-widest uppercase animate-pulse">
                      "Simplicity is the ultimate sophistication."
                    </p>
                    <p className="text-white/20 text-[10px] mt-2 uppercase tracking-widest font-mono">
                      Focus on solving one problem perfectly.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {(state === 'scoring' || state === 'rewriting') && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32 space-y-6"
            >
              <Loader2 className="w-12 h-12 text-[#e8ff00] animate-spin" />
              <div className="text-center space-y-2">
                <p className="font-mono text-xs uppercase tracking-widest text-white/50">
                  {state === 'scoring' ? 'Analyzing project rubric...' : 'Optimizing submission form...'}
                </p>
                <p className="text-sm italic text-white/30">
                  {state === 'scoring' ? '"There is always something to improve."' : '"Clarity is the ultimate leverage."'}
                </p>
              </div>
            </motion.div>
          )}

          {state === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <ScoreCard result={result} />
              <CritiqueSection result={result} />
              
              <div className="max-w-2xl mx-auto pt-12 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleRewrite}
                  className="flex-1 py-4 bg-white text-black font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Rewrite Everything <Sparkles className="w-4 h-4" />
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-4 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  Try New Idea <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {state === 'full-view' && rewrite && pitch && (
            <motion.div
              key="full-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <RewriteView rewrite={rewrite} pitch={pitch} />
              
              <div className="max-w-4xl mx-auto pt-12 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setState('result')}
                  className="flex-1 py-4 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  Back to Score
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-4 bg-[#e8ff00] text-black font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Start Over <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* KPI Explanation */}
      <div className="max-w-7xl mx-auto px-8 py-16 border-t border-white/10 bg-white/[0.01]">
        <div className="max-w-4xl space-y-4">
          <h4 className="text-sm font-bold font-mono text-[#e8ff00] uppercase tracking-[0.2em]">Coding & Logic Execution</h4>
          <p className="text-white/60 text-base md:text-lg font-mono leading-relaxed">
            The scoring result is achieved by mapping user input against a strict JSON schema enforced by the Gemini 3.1 Pro model. By hardcoding the 100-point rubric weights into the system-level instructions, we ensure every score is a calculated result of structured qualitative analysis, not just a generative guess.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-8 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 text-white/20 text-[10px] font-mono uppercase tracking-widest">
            <span>© 2026 SCORE-MY-IDEA. Build with confidence.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
