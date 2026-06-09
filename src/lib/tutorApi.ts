import type { AiCoachMode, CoachTone, Word } from '../types';

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export interface TutorRequest {
  message: string;
  mode: AiCoachMode;
  tone?: CoachTone;
  wantsJson?: boolean;
  answerLength?: 'short' | 'normal' | 'detailed';
  context?: unknown;
  word?: Word;
  stats?: {
    learned: number;
    todayCount: number;
    accuracy: number;
    streak: number;
  };
  recentMistakes?: Array<Word & { wrong_count: number }>;
  contextTitle?: string;
  contextWords?: Word[];
  history?: TutorMessage[];
}

export async function askTutor(payload: TutorRequest) {
  const response = await fetch('/api/tutor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error('AI tutor javob bermadi');
  return response.json() as Promise<{ ok: boolean; answer: string; fallback?: boolean; provider?: string; error?: string }>;
}
