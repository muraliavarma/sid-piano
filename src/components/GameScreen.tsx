import { useState, useCallback, useRef } from 'react';
import Staff from './Staff';
import AnswerButtons from './AnswerButtons';
import { useAudio } from '../hooks/useAudio';
import {
  type NoteName, type LevelConfig,
  LEVELS, NOTES, pickRandomNote, getClefForNote,
  getCorrectMessage, getHandCorrectMessage, getWrongMessage, calculateStars,
} from '../utils/notes';

interface GameScreenProps {
  levelId: number;
  onComplete: (levelId: number, stars: number) => void;
  onBack: () => void;
}

interface RoundState {
  note: NoteName;
  clef: 'treble' | 'bass';
}

export default function GameScreen({ levelId, onComplete, onBack }: GameScreenProps) {
  const level = LEVELS.find(l => l.id === levelId)!;
  const { playNote, playCorrect, playWrong } = useAudio();

  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [roundMistakes, setRoundMistakes] = useState(0);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState<string | undefined>();
  const [wrongAnswer, setWrongAnswer] = useState<string | undefined>();
  const [disabled, setDisabled] = useState(false);
  const [combinedStep, setCombinedStep] = useState<'hand' | 'note'>('hand');
  const lastNoteRef = useRef<NoteName | undefined>(undefined);

  const [roundState, setRoundState] = useState<RoundState>(() => {
    const note = pickRandomNote(level.notes);
    lastNoteRef.current = note;
    const clef = level.clef === 'both' ? getClefForNote(note) : (level.clef as 'treble' | 'bass');
    return { note, clef };
  });

  const startNewRound = useCallback((lvl: LevelConfig) => {
    const note = pickRandomNote(lvl.notes, lastNoteRef.current);
    lastNoteRef.current = note;
    const clef = lvl.clef === 'both' ? getClefForNote(note) : (lvl.clef as 'treble' | 'bass');
    setRoundState({ note, clef });
    setRoundMistakes(0);
    setFeedback('none');
    setFeedbackMessage('');
    setCorrectAnswer(undefined);
    setWrongAnswer(undefined);
    setDisabled(false);
    setCombinedStep('hand');
  }, []);

  const advanceOrComplete = useCallback((currentScore: number) => {
    const nextRound = round + 1;
    if (nextRound > level.rounds) {
      onComplete(levelId, calculateStars(currentScore, level.rounds));
    } else {
      setRound(nextRound);
      startNewRound(level);
    }
  }, [round, level, levelId, onComplete, startNewRound]);

  const handleNoteAnswer = useCallback((answer: string) => {
    if (disabled) return;
    const correctLetter = NOTES[roundState.note].label;

    if (answer === correctLetter) {
      const newStreak = roundMistakes === 0 ? streak + 1 : 0;
      setStreak(newStreak);
      setFeedback('correct');
      setCorrectAnswer(answer);
      setWrongAnswer(undefined);
      setFeedbackMessage(getCorrectMessage(newStreak));
      setDisabled(true);
      playCorrect();
      playNote(roundState.note, 0.6);
      const newScore = roundMistakes === 0 ? score + 1 : score;
      setScore(newScore);
      setTimeout(() => advanceOrComplete(newScore), 1200);
    } else {
      const newMistakes = roundMistakes + 1;
      setRoundMistakes(newMistakes);
      setStreak(0);
      setFeedback('wrong');
      setWrongAnswer(answer);
      playWrong();
      if (newMistakes >= 3) {
        setFeedbackMessage(`It's ${correctLetter}!`);
        setCorrectAnswer(correctLetter);
        setDisabled(true);
        setTimeout(() => advanceOrComplete(score), 2000);
      } else {
        setFeedbackMessage(getWrongMessage(newMistakes));
        if (newMistakes === 2) setCorrectAnswer(correctLetter);
        setTimeout(() => { setWrongAnswer(undefined); setFeedback('none'); }, 800);
      }
    }
  }, [disabled, roundState, roundMistakes, streak, score, playNote, playCorrect, playWrong, advanceOrComplete]);

  const handleHandAnswer = useCallback((answer: string) => {
    if (disabled) return;
    const correctHand = roundState.clef === 'treble' ? 'right' : 'left';

    if (answer === correctHand) {
      if (level.mode === 'hand') {
        const newStreak = roundMistakes === 0 ? streak + 1 : 0;
        setStreak(newStreak);
        setFeedback('correct');
        setCorrectAnswer(answer);
        setWrongAnswer(undefined);
        setFeedbackMessage(getHandCorrectMessage(roundState.clef));
        setDisabled(true);
        playCorrect();
        const newScore = roundMistakes === 0 ? score + 1 : score;
        setScore(newScore);
        setTimeout(() => advanceOrComplete(newScore), 1200);
      } else {
        setFeedback('correct');
        setCorrectAnswer(answer);
        setFeedbackMessage('Correct! Now name the note...');
        setTimeout(() => {
          setCombinedStep('note');
          setFeedback('none');
          setFeedbackMessage('');
          setCorrectAnswer(undefined);
          setWrongAnswer(undefined);
        }, 800);
      }
    } else {
      const newMistakes = roundMistakes + 1;
      setRoundMistakes(newMistakes);
      setStreak(0);
      setFeedback('wrong');
      setWrongAnswer(answer);
      playWrong();
      if (newMistakes >= 3 && level.mode === 'hand') {
        setFeedbackMessage(getHandCorrectMessage(roundState.clef));
        setCorrectAnswer(correctHand);
        setDisabled(true);
        setTimeout(() => advanceOrComplete(score), 2000);
      } else {
        setFeedbackMessage(roundState.clef === 'treble'
          ? 'This is Treble Clef — Right Hand!'
          : 'This is Bass Clef — Left Hand!');
        setTimeout(() => { setWrongAnswer(undefined); setFeedback('none'); }, 1200);
      }
    }
  }, [disabled, roundState, roundMistakes, streak, score, level, playCorrect, playWrong, advanceOrComplete]);

  const handleAnswer = useCallback((answer: string) => {
    if (level.mode === 'note') handleNoteAnswer(answer);
    else if (level.mode === 'hand') handleHandAnswer(answer);
    else combinedStep === 'hand' ? handleHandAnswer(answer) : handleNoteAnswer(answer);
  }, [level, combinedStep, handleNoteAnswer, handleHandAnswer]);

  const showHint = round <= level.hintsUntilRound;
  const hideHandLabel = level.mode === 'hand' || (level.mode === 'combined' && combinedStep === 'hand');
  const currentMode = level.mode === 'combined' ? (combinedStep === 'hand' ? 'hand' : 'note') : level.mode;
  const progress = ((round - 1) / level.rounds) * 100;

  return (
    <div className="game-screen">
      <div className="game-header">
        <button className="back-btn" onClick={onBack}>Back</button>
        <div className="game-title">
          <h2>{level.title}</h2>
          <span className="round-label">Round {round} of {level.rounds}</span>
        </div>
        <div className="score-display">
          {streak >= 3 && <span className="streak-badge">{streak}x</span>}
          <span className="star star-earned">★</span>
          <span className="score-number">{score}</span>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <Staff
        note={roundState.note}
        clef={roundState.clef}
        showHint={showHint && currentMode === 'note'}
        hideHandLabel={hideHandLabel}
        feedback={feedback}
      />

      {feedbackMessage && (
        <div className={`feedback-banner feedback-${feedback}`}>
          {feedbackMessage}
        </div>
      )}

      <AnswerButtons
        mode={currentMode === 'hand' ? 'hand' : 'note'}
        onAnswer={handleAnswer}
        correctAnswer={correctAnswer}
        wrongAnswer={wrongAnswer}
        disabled={disabled}
      />
    </div>
  );
}
