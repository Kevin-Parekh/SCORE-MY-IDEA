import React from 'react';
import { SubmissionRewrite, PitchScript } from '../types';
import { Copy, Check } from 'lucide-react';

interface RewriteViewProps {
  rewrite: SubmissionRewrite;
  pitch: PitchScript;
}

export const RewriteView: React.FC<RewriteViewProps> = ({ rewrite, pitch }) => {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const sections = [
    { label: 'Problem Statement', content: rewrite.problemStatement, id: 'ps' },
    { label: 'Who Is This For', content: rewrite.whoIsThisFor, id: 'witf' },
    { label: 'How AI Is Used', content: rewrite.howAiIsUsed, id: 'haiu' },
    { label: 'How It Helps', content: rewrite.howItHelps, id: 'hih' },
    { label: 'Solution Explanation', content: rewrite.solutionExplanation, id: 'se' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 space-y-16">
      <div className="space-y-8">
        <h2 className="text-xl font-mono uppercase tracking-tighter border-y border-white/20 py-2 text-center">
          ━━━ REWRITTEN SUBMISSION ━━━
        </h2>
        
        <div className="space-y-10">
          {sections.map((s) => (
            <div key={s.id} className="group relative space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#e8ff00]">{s.label}</span>
                <button 
                  onClick={() => copyToClipboard(s.content, s.id)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                  {copied === s.id ? <Check className="w-4 h-4 text-[#e8ff00]" /> : <Copy className="w-4 h-4 text-white/30" />}
                </button>
              </div>
              <p className="text-sm leading-relaxed text-white/80 pr-12">{s.content}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8 bg-white/5 border border-white/10 p-8 rounded-2xl">
        <h2 className="text-xl font-mono uppercase tracking-tighter border-y border-white/20 py-2 text-center">
          ━━━ 60-SECOND PITCH ━━━
        </h2>

        <div className="space-y-6 font-mono">
          {[
            { time: '00-10s', label: 'Hook', content: pitch.hook, id: 'ph' },
            { time: '10-25s', label: 'Problem', content: pitch.problem, id: 'pp' },
            { time: '25-40s', label: 'Solution', content: pitch.solution, id: 'psol' },
            { time: '40-55s', label: 'Demo moment', content: pitch.demoMoment, id: 'pdm' },
            { time: '55-60s', label: 'Ask', content: pitch.ask, id: 'pa' },
          ].map((s) => (
            <div key={s.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/30">[{s.time}]</span>
                <span className="text-[10px] uppercase text-[#e8ff00]">{s.label}:</span>
              </div>
              <p className="text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
          
          <button 
            onClick={() => copyToClipboard(Object.values(pitch).join('\n'), 'full-pitch')}
            className="w-full mt-4 py-3 border border-white/20 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
          >
            {copied === 'full-pitch' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied === 'full-pitch' ? 'Copied Full Script' : 'Copy Pitch Script'}
          </button>
        </div>
      </div>
    </div>
  );
};
