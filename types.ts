
export enum Situation {
  INTERVIEW = '面接',
  PRESENTATION = 'プレゼン',
  NEGOTIATION = '交渉',
  CASUAL = '雑談',
  CUSTOMER_SERVICE = '接客',
  MEETING = '会議'
}

export interface AnalysisResult {
  totalScore: number;
  metrics: {
    clarity: number;
    confidence: number;
    empathy: number;
    logic: number;
  };
  feedback: string;
  strengths: string[];
  improvements: string[];
  transcription: string;
}

export interface MediaData {
  blob: Blob;
  type: 'audio' | 'video';
  base64: string;
}
