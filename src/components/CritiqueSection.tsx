import React from 'react';
import { ShipLogResult } from '../types';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CritiqueSectionProps {
  result: ShipLogResult;
}

export const CritiqueSection: React.FC<CritiqueSectionProps> = ({ result }) => {
  const sections = [
    { label: 'Problem Framing', key: 'problemFraming', max: 25 },
    { label: 'AI Leverage', key: 'aiLeverage', max: 30 },
    { label: 'Practical Usefulness', key: 'practicalUsefulness', max: 20 },
    { label: 'Execution Quality', key: 'executionQuality', max: 15 },
    { label: 'Clarity', key: 'clarity', max: 10 },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 space-y-8">
      {sections.map((s) => {
        const sectionData = result.sections[s.key as keyof typeof result.sections];
        const isStrong = sectionData.score >= s.max * 0.8;
        
        return (
          <div key={s.key} className="space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-2">
              <span className="text-xs font-mono uppercase tracking-widest text-white/40">
                {s.label} — {sectionData.score}/{s.max}
              </span>
              {isStrong ? (
                <CheckCircle2 className="w-4 h-4 text-[#e8ff00]" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-orange-500" />
              )}
            </div>

            {isStrong ? (
              <p className="text-sm text-white/60 font-mono">✅ Strong — no changes needed.</p>
            ) : (
              <div className="space-y-4 pl-4 border-l border-white/10">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase text-orange-500/80">❌ What's weak:</div>
                  <p className="text-sm leading-relaxed">{sectionData.critique?.weak}</p>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase text-[#e8ff00]/80">✅ What it needs:</div>
                  <p className="text-sm leading-relaxed">{sectionData.critique?.needs}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
