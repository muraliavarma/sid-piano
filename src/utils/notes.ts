export type NoteName =
  | 'C3' | 'D3' | 'E3' | 'F3' | 'G3' | 'A3' | 'B3'
  | 'C4' | 'D4' | 'E4' | 'F4' | 'G4' | 'A4' | 'B4'
  | 'C5';

export type Clef = 'treble' | 'bass' | 'both';
export type GameMode = 'note' | 'hand' | 'combined';

export interface NoteInfo {
  name: NoteName;
  label: string;
  octave: number;
  frequency: number;
  trebleY?: number;
  bassY?: number;
}

export interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  section: string;
  clef: Clef;
  mode: GameMode;
  notes: NoteName[];
  rounds: number;
  hintsUntilRound: number;
  emoji: string;
}

export const ALL_CHOICES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export const STAFF_LINES = [40, 50, 60, 70, 80];

export const NOTES: Record<NoteName, NoteInfo> = {
  C3: { name: 'C3', label: 'C', octave: 3, frequency: 130.81, bassY: 65 },
  D3: { name: 'D3', label: 'D', octave: 3, frequency: 146.83, bassY: 60 },
  E3: { name: 'E3', label: 'E', octave: 3, frequency: 164.81, bassY: 55 },
  F3: { name: 'F3', label: 'F', octave: 3, frequency: 174.61, bassY: 50 },
  G3: { name: 'G3', label: 'G', octave: 3, frequency: 196.00, bassY: 45 },
  A3: { name: 'A3', label: 'A', octave: 3, frequency: 220.00, bassY: 40 },
  B3: { name: 'B3', label: 'B', octave: 3, frequency: 246.94, bassY: 35 },
  C4: { name: 'C4', label: 'C', octave: 4, frequency: 261.63, trebleY: 90, bassY: 30 },
  D4: { name: 'D4', label: 'D', octave: 4, frequency: 293.66, trebleY: 85 },
  E4: { name: 'E4', label: 'E', octave: 4, frequency: 329.63, trebleY: 80 },
  F4: { name: 'F4', label: 'F', octave: 4, frequency: 349.23, trebleY: 75 },
  G4: { name: 'G4', label: 'G', octave: 4, frequency: 392.00, trebleY: 70 },
  A4: { name: 'A4', label: 'A', octave: 4, frequency: 440.00, trebleY: 65 },
  B4: { name: 'B4', label: 'B', octave: 4, frequency: 493.88, trebleY: 60 },
  C5: { name: 'C5', label: 'C', octave: 5, frequency: 523.25, trebleY: 55 },
};

export const LETTER_COLORS: Record<string, string> = {
  C: '#ff6b6b',
  D: '#ff922b',
  E: '#fcc419',
  F: '#51cf66',
  G: '#339af0',
  A: '#cc5de8',
  B: '#f06595',
};

export const SECTIONS = [
  'Right Hand - Treble Clef',
  'Left Hand - Bass Clef',
  'Which Hand?',
  'Both Hands',
];

export const LEVELS: LevelConfig[] = [
  // --- Right Hand - Treble Clef ---
  { id: 1, title: 'C, D, E', subtitle: 'First three notes!', section: SECTIONS[0],
    clef: 'treble', mode: 'note', notes: ['C4', 'D4', 'E4'], rounds: 12, hintsUntilRound: 4, emoji: '🌟' },
  { id: 2, title: 'C to G', subtitle: 'Five finger position', section: SECTIONS[0],
    clef: 'treble', mode: 'note', notes: ['C4', 'D4', 'E4', 'F4', 'G4'], rounds: 15, hintsUntilRound: 3, emoji: '🎵' },
  { id: 3, title: 'All the Notes!', subtitle: 'Full right hand', section: SECTIONS[0],
    clef: 'treble', mode: 'note', notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'], rounds: 18, hintsUntilRound: 2, emoji: '🎹' },

  // --- Left Hand - Bass Clef ---
  { id: 4, title: 'G, A, B', subtitle: 'First three bass notes!', section: SECTIONS[1],
    clef: 'bass', mode: 'note', notes: ['G3', 'A3', 'B3'], rounds: 12, hintsUntilRound: 4, emoji: '🌈' },
  { id: 5, title: 'E to B', subtitle: 'Five bass notes', section: SECTIONS[1],
    clef: 'bass', mode: 'note', notes: ['E3', 'F3', 'G3', 'A3', 'B3'], rounds: 15, hintsUntilRound: 3, emoji: '🎶' },
  { id: 6, title: 'Bass Master!', subtitle: 'Full left hand', section: SECTIONS[1],
    clef: 'bass', mode: 'note', notes: ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3'], rounds: 18, hintsUntilRound: 2, emoji: '🏆' },

  // --- Which Hand? ---
  { id: 7, title: 'Left or Right?', subtitle: 'Learn the clefs', section: SECTIONS[2],
    clef: 'both', mode: 'hand', notes: ['C4', 'D4', 'E4', 'G3', 'A3', 'B3'], rounds: 12, hintsUntilRound: 4, emoji: '👋' },
  { id: 8, title: 'Quick Hands!', subtitle: 'No hints this time!', section: SECTIONS[2],
    clef: 'both', mode: 'hand', notes: ['C4', 'D4', 'E4', 'F4', 'G4', 'G3', 'A3', 'B3', 'F3', 'E3'], rounds: 15, hintsUntilRound: 0, emoji: '⚡' },

  // --- Both Hands ---
  { id: 9, title: 'Mixed Notes', subtitle: 'Treble and bass!', section: SECTIONS[3],
    clef: 'both', mode: 'note', notes: ['E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4'], rounds: 16, hintsUntilRound: 0, emoji: '🎸' },
  { id: 10, title: 'Hand + Note', subtitle: 'Two-step challenge!', section: SECTIONS[3],
    clef: 'both', mode: 'combined', notes: ['G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4'], rounds: 18, hintsUntilRound: 0, emoji: '🚀' },
  { id: 11, title: 'Grand Challenge!', subtitle: 'Everything!!!', section: SECTIONS[3],
    clef: 'both', mode: 'combined', notes: ['E3', 'F3', 'G3', 'A3', 'B3', 'C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'], rounds: 20, hintsUntilRound: 0, emoji: '👑' },
];

export function getClefForNote(note: NoteName): 'treble' | 'bass' {
  return NOTES[note].octave >= 4 ? 'treble' : 'bass';
}

export function getNoteY(note: NoteName, clef: 'treble' | 'bass'): number {
  const info = NOTES[note];
  return (clef === 'treble' ? info.trebleY : info.bassY) ?? 60;
}

export function getLedgerLines(note: NoteName, clef: 'treble' | 'bass'): number[] {
  const y = getNoteY(note, clef);
  const lines: number[] = [];
  for (let ly = 90; ly <= y; ly += 10) lines.push(ly);
  for (let ly = 30; ly >= y; ly -= 10) lines.push(ly);
  return lines;
}

export function pickRandomNote(pool: NoteName[], lastNote?: NoteName): NoteName {
  if (pool.length === 1) return pool[0];
  const filtered = pool.filter(n => n !== lastNote);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

const CORRECT_MESSAGES = ['Great job!', 'You got it!', 'Awesome!', 'Perfect!', 'Way to go!', 'Super star!', 'Nailed it!', 'Yes!', 'Woohoo!', 'Amazing!'];
const STREAK_MESSAGES = ['On fire! 🔥', 'Unstoppable!', 'Keep going!', 'Amazing streak!', 'You rock!'];
const WRONG_MESSAGES_1 = ['Not quite — try again!', 'Hmm, look carefully!', 'Close! Try another one.'];
const WRONG_MESSAGES_2 = ['Almost! Here\'s a hint...', 'Look at where the note sits.'];

export function getCorrectMessage(streak: number): string {
  if (streak >= 3) return STREAK_MESSAGES[Math.floor(Math.random() * STREAK_MESSAGES.length)];
  return CORRECT_MESSAGES[Math.floor(Math.random() * CORRECT_MESSAGES.length)];
}

export function getHandCorrectMessage(clef: 'treble' | 'bass'): string {
  return clef === 'treble' ? 'Yes! Treble clef = Right Hand!' : 'Correct! Bass clef = Left Hand!';
}

export function getWrongMessage(attempt: number): string {
  if (attempt <= 1) return WRONG_MESSAGES_1[Math.floor(Math.random() * WRONG_MESSAGES_1.length)];
  return WRONG_MESSAGES_2[Math.floor(Math.random() * WRONG_MESSAGES_2.length)];
}

export function calculateStars(score: number, rounds: number): number {
  if (score === rounds) return 3;
  if (score >= Math.ceil(rounds * 0.7)) return 2;
  return 1;
}
