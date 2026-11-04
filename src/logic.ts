import type { Exercise } from './exercises';

export type AnswerGrade = 'correct' | 'almost' | 'incorrect';
export type ReviewCard = {
  repetitions: number;
  easeFactor: number;
  intervalDays: number;
  dueAt: string;
  lapses: number;
  attempts: number;
  correct: number;
  lastGrade: AnswerGrade;
};
export function sessionDurationSeconds(minutes: number): number {
  return Number.isFinite(minutes) && minutes > 0 ? Math.round(minutes * 60) : 0;
}
export function speedDurationSeconds(seconds: number): number {
  return [30, 60].includes(seconds) ? seconds : 0;
}
export function regionUnlocked(id: string, masteryScore: number): boolean {
  return id === 'lisboa' || masteryScore >= 3;
}
export function bossWon(total: number, accuracy: number): boolean {
  return total >= 5 && accuracy >= 80;
}
const punctuation = /[.!?,;:…]+$/u;
export function normalizeAnswer(value: string): string {
  return value.normalize('NFC').toLocaleLowerCase('pt-PT').trim().replace(punctuation, '').trim().replace(/\s+/g, ' ');
}
function removeMarks(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').normalize('NFC');
}
export function gradeAnswer(input: string, accepted: string | string[]): AnswerGrade {
  const candidates = Array.isArray(accepted) ? accepted : [accepted];
  const normalized = normalizeAnswer(input);
  if (!normalized) return 'incorrect';
  if (candidates.some(candidate => normalizeAnswer(candidate) === normalized)) return 'correct';
  if (candidates.some(candidate => removeMarks(normalizeAnswer(candidate)) === removeMarks(normalized))) return 'almost';
  return 'incorrect';
}
export function isCorrectAnswer(exercise: Exercise, value: string): boolean {
  return gradeAnswer(value, [exercise.answer, ...(exercise.accepted || [])]) === 'correct';
}
export function awardXp(grade: AnswerGrade, quick = false): number {
  if (grade === 'correct') return quick ? 14 : 10;
  return grade === 'almost' ? 5 : 2;
}
export function updateMastery(current: number, grade: AnswerGrade): number {
  const delta = grade === 'correct' ? 1 : grade === 'almost' ? 0 : -1;
  return Math.max(0, Math.min(10, current + delta));
}
export function scheduleReview(previous: ReviewCard | undefined, grade: AnswerGrade, now = new Date()): ReviewCard {
  const quality = grade === 'correct' ? 5 : grade === 'almost' ? 3 : 1;
  const card: ReviewCard = previous ? { ...previous } : {
    repetitions: 0, easeFactor: 2.5, intervalDays: 0, dueAt: now.toISOString(),
    lapses: 0, attempts: 0, correct: 0, lastGrade: grade
  };
  card.attempts += 1;
  card.lastGrade = grade;
  if (grade === 'correct') card.correct += 1;
  if (quality < 3) {
    card.repetitions = 0;
    card.intervalDays = 0;
    card.lapses += 1;
    const retryMinutes = card.lapses === 1 ? 60 : card.lapses === 2 ? 10 : 3;
    card.dueAt = new Date(now.getTime() + retryMinutes * 60_000).toISOString();
    return card;
  } else {
    if (card.repetitions === 0) card.intervalDays = 1;
    else if (card.repetitions === 1) card.intervalDays = 6;
    else card.intervalDays = Math.max(1, Math.round(card.intervalDays * card.easeFactor));
    card.repetitions += 1;
    card.easeFactor = Math.max(1.3, card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  }
  const due = new Date(now);
  due.setDate(due.getDate() + card.intervalDays);
  card.dueAt = due.toISOString();
  return card;
}
export function isDue(card: ReviewCard, now = new Date()): boolean {
  return Date.parse(card.dueAt) <= now.getTime();
}
export function scoreDiagnostic(results: Array<{ concept: string; grade: AnswerGrade }>) {
  const scores: Record<string, { correct: number; total: number }> = {};
  for (const { concept, grade } of results) {
    scores[concept] ??= { correct: 0, total: 0 };
    scores[concept].total += 1;
    if (grade === 'correct') scores[concept].correct += 1;
  }
  const areas = Object.entries(scores).map(([concept, score]) => ({
    concept, ...score, accuracy: Math.round(score.correct / score.total * 100)
  })).sort((a, b) => b.accuracy - a.accuracy);
  return { areas, strongest: areas.slice(0, 2).map(x => x.concept), weakest: [...areas].reverse().slice(0, 2).map(x => x.concept) };
}
export function validBackup(value: unknown): value is { app: 'portugues-quest'; version: number; progress: Record<string, unknown> } {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (v.app !== 'portugues-quest' || ![1, 2].includes(Number(v.version)) || !v.progress || typeof v.progress !== 'object') return false;
  const p = v.progress as Record<string, unknown>;
  if (typeof p.xp !== 'number' || !Number.isFinite(p.xp) || p.xp < 0) return false;
  if (!p.mastery || typeof p.mastery !== 'object' || Array.isArray(p.mastery)) return false;
  for (const field of ['bookmarks', 'achievements', 'sessions', 'mistakeLog']) {
    if (p[field] !== undefined && !Array.isArray(p[field])) return false;
  }
  for (const field of ['reviews', 'due', 'conceptMastery', 'regionProgress', 'bestSpeedScores']) {
    if (p[field] !== undefined && (!p[field] || typeof p[field] !== 'object' || Array.isArray(p[field]))) return false;
  }
  if (p.reviews && typeof p.reviews === 'object') {
    for (const card of Object.values(p.reviews as Record<string, unknown>)) {
      if (!card || typeof card !== 'object') return false;
      const r = card as Record<string, unknown>;
      if (![r.repetitions, r.easeFactor, r.intervalDays, r.lapses, r.attempts, r.correct].every(n => typeof n === 'number' && Number.isFinite(n) && n >= 0)) return false;
      if (typeof r.dueAt !== 'string' || !Number.isFinite(Date.parse(r.dueAt))) return false;
      if (!['correct','almost','incorrect'].includes(String(r.lastGrade))) return false;
    }
  }
  return true;
}
export function migrateProgress(value: Record<string, unknown>) {
  const oldDue = value.due && typeof value.due === 'object' ? value.due as Record<string, string> : {};
  const existing = value.reviews && typeof value.reviews === 'object' ? value.reviews as Record<string, ReviewCard> : {};
  const reviews: Record<string, ReviewCard> = { ...existing };
  for (const [id, dueAt] of Object.entries(oldDue)) {
    if (reviews[id]) continue;
    const parsed = Date.parse(dueAt);
    if (!Number.isFinite(parsed)) continue;
    reviews[id] = {
      repetitions: 0, easeFactor: 2.5, intervalDays: 1, dueAt: new Date(parsed).toISOString(),
      lapses: 0, attempts: 0, correct: 0, lastGrade: 'incorrect'
    };
  }
  return {
    ...value,
    schemaVersion: 2,
    reviews,
    diagnosticResults: value.diagnosticResults ?? null,
    achievements: Array.isArray(value.achievements) ? value.achievements : [],
    sessions: Array.isArray(value.sessions) ? value.sessions : [],
    regionProgress: value.regionProgress && typeof value.regionProgress === 'object' ? value.regionProgress : {},
    bestSpeedScores: value.bestSpeedScores && typeof value.bestSpeedScores === 'object' ? value.bestSpeedScores : {},
    conceptMastery: value.conceptMastery && typeof value.conceptMastery === 'object' ? value.conceptMastery : {},
    mistakeLog: Array.isArray(value.mistakeLog) ? value.mistakeLog : []
  };
}
export function validateExerciseBank(items: Array<{ id: string; mode?: string; prompt?: string; answer?: string; explanation?: string; accepted?: string[] }>) {
  const ids = new Set<string>();
  const errors: string[] = [];
  for (const item of items) {
    if (ids.has(item.id)) errors.push('duplicate:' + item.id);
    ids.add(item.id);
    if (item.mode && !['gap','tense','conversation','speed','translation','repair'].includes(item.mode)) errors.push('invalid-mode:' + item.id);
    if (!item.prompt?.trim()) errors.push('missing-prompt:' + item.id);
    if (!item.answer?.trim()) errors.push('missing-answer:' + item.id);
    if (!item.explanation?.trim()) errors.push('missing-explanation:' + item.id);
    if (item.accepted && item.accepted.some(answer => !answer.trim())) errors.push('empty-alternative:' + item.id);
  }
  return errors;
}
