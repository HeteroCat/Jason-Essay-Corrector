export enum CorrectionCategory {
  GRAMMAR = 'GRAMMAR',
  SPELLING = 'SPELLING',
  CLARITY = 'CLARITY',
  STYLE = 'STYLE',
  PUNCTUATION = 'PUNCTUATION',
  STRUCTURE = 'STRUCTURE'
}

export type Scores = {
  [key in CorrectionCategory]?: number;
};

export interface Correction {
  originalText: string;
  suggestion: string;
  explanation: string;
  category: CorrectionCategory;
}

export interface CorrectionResponse {
  summary: string;
  corrections: Correction[];
  scores: Scores;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
