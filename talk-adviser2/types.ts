
export type ScenarioId = 'interview' | 'presentation' | 'daily' | 'trouble' | 'sales' | 'debate';

export interface Scenario {
  id: ScenarioId;
  title: string;
  description: string;
  icon: string;
  criteria: string[];
}

export interface AnalysisScore {
  label: string;
  value: number;
}

export interface BeforeAfter {
  before: string;
  after: string;
  reason: string;
}

export interface AnalysisResult {
  scores: AnalysisScore[];
  summary: string;
  advice: string;
  beforeAfter: BeforeAfter[];
}

export enum AppState {
  SELECTING_SCENARIO,
  RECORDING,
  ANALYZING,
  RESULT
}
