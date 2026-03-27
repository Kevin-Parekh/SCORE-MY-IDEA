export interface ScoreSection {
  score: number;
  max: number;
  critique?: {
    weak: string;
    needs: string;
  };
}

export interface ShipLogResult {
  projectName: string;
  overallScore: number;
  verdict: string;
  sections: {
    problemFraming: ScoreSection;
    aiLeverage: ScoreSection;
    practicalUsefulness: ScoreSection;
    executionQuality: ScoreSection;
    clarity: ScoreSection;
  };
}

export interface SubmissionRewrite {
  problemStatement: string;
  whoIsThisFor: string;
  howAiIsUsed: string;
  howItHelps: string;
  solutionExplanation: string;
}

export interface PitchScript {
  hook: string;
  problem: string;
  solution: string;
  demoMoment: string;
  ask: string;
}
