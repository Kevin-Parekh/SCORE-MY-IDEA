import React from 'react';
import { motion } from 'motion/react';
import { ShipLogResult } from '../types';

interface ScoreCardProps {
  result: ShipLogResult;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ result }) => {
  const sections = [
    { label: 'Problem Framing', key: 'problemFraming', max: 25 },
    { label: 'AI Leverage', key: 'aiLeverage', max: 30 },
    { label: 'Practical Usefulness', key: 'practicalUsefulness', max: 20 },
    { label: 'Execution Quality', key: 'executionQuality', max: 15 },
    { label: 'Clarity', key: 'clarity', max: 10 },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-black border border-white/20 p-8 font-mono">
      <div className="text-center mb-8">
        <h2 className="text-xl tracking-tighter border-y border-white/20 py-2 uppercase">
          SCORE-MY-IDEA SCORE CARD
        </h2>
        <p className="mt-4 text-sm text-white/50">Project: {result.projectName || 'Untitled'}</p>
        <div className="text-6xl font-bold mt-2">
          {result.overallScore}<span className="text-2xl text-white/30">/100</span>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((s, idx) => {
          const sectionData = result.sections[s.key as keyof typeof result.sections];
          const percentage = (sectionData.score / s.max) * 100;
          
          return (
            <div key={s.key} className="space-y-2">
              <div className="flex justify-between text-xs uppercase tracking-widest">
                <span>{s.label}</span>
                <span>{sectionData.score}/{s.max}</span>
              </div>
              <div className="h-4 bg-white/5 border border-white/10 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: idx * 0.1, duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-[#e8ff00]"
                />
                <div className="absolute inset-0 flex">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex-1 border-r border-black/20" />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 pt-6 border-t border-white/20">
        <div className="text-xs text-white/40 uppercase mb-2">Verdict:</div>
        <p className="text-lg leading-tight italic">"{result.verdict}"</p>
      </div>
    </div>
  );
};
