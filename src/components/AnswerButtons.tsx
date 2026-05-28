import { ALL_CHOICES, LETTER_COLORS } from '../utils/notes';

interface NoteButtonsProps {
  mode: 'note';
  onAnswer: (answer: string) => void;
  correctAnswer?: string;
  wrongAnswer?: string;
  disabled: boolean;
}

interface HandButtonsProps {
  mode: 'hand';
  onAnswer: (answer: string) => void;
  correctAnswer?: string;
  wrongAnswer?: string;
  disabled: boolean;
}

type AnswerButtonsProps = NoteButtonsProps | HandButtonsProps;

export default function AnswerButtons(props: AnswerButtonsProps) {
  if (props.mode === 'hand') {
    return (
      <div className="answer-section">
        <p className="answer-prompt">Which hand plays this note?</p>
        <div className="hand-buttons">
          <button
            className={`hand-btn hand-left ${props.correctAnswer === 'left' ? 'btn-correct' : ''} ${props.wrongAnswer === 'left' ? 'btn-wrong' : ''}`}
            onClick={() => props.onAnswer('left')}
            disabled={props.disabled}
          >
            <span className="hand-icon">L</span>
            <span>Left Hand</span>
          </button>
          <button
            className={`hand-btn hand-right ${props.correctAnswer === 'right' ? 'btn-correct' : ''} ${props.wrongAnswer === 'right' ? 'btn-wrong' : ''}`}
            onClick={() => props.onAnswer('right')}
            disabled={props.disabled}
          >
            <span className="hand-icon">R</span>
            <span>Right Hand</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="answer-section">
      <p className="answer-prompt">What note is this?</p>
      <div className="note-buttons">
        {ALL_CHOICES.map(letter => (
          <button
            key={letter}
            className={`note-btn ${props.correctAnswer === letter ? 'btn-correct' : ''} ${props.wrongAnswer === letter ? 'btn-wrong' : ''}`}
            style={{ backgroundColor: LETTER_COLORS[letter] }}
            onClick={() => props.onAnswer(letter)}
            disabled={props.disabled}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  );
}
