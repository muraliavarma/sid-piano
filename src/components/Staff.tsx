import { STAFF_LINES, getNoteY, getLedgerLines, NOTES, type NoteName } from '../utils/notes';

interface StaffProps {
  note: NoteName;
  clef: 'treble' | 'bass';
  showHint: boolean;
  hideHandLabel?: boolean;
  feedback: 'none' | 'correct' | 'wrong';
}

function TrebleClef() {
  return (
    <text x="15" y="88" fontSize="72" fontFamily="'Noto Music', 'Segoe UI Symbol', 'Apple Symbols', serif" fill="#555">
      {'\u{1D11E}'}
    </text>
  );
}

function BassClef() {
  return (
    <text x="15" y="68" fontSize="46" fontFamily="'Noto Music', 'Segoe UI Symbol', 'Apple Symbols', serif" fill="#555">
      {'\u{1D122}'}
    </text>
  );
}

export default function Staff({ note, clef, showHint, hideHandLabel, feedback }: StaffProps) {
  const noteY = getNoteY(note, clef);
  const ledgerLines = getLedgerLines(note, clef);
  const noteInfo = NOTES[note];
  const noteX = 170;

  const noteColor = feedback === 'correct' ? '#51cf66' : feedback === 'wrong' ? '#ff6b6b' : '#333';
  const handLabel = clef === 'treble' ? 'Right Hand' : 'Left Hand';
  const handColor = clef === 'treble' ? '#4c9aff' : '#69db7c';

  return (
    <div className="staff-container">
      {!hideHandLabel && <div className="hand-label" style={{ color: handColor }}>{handLabel}</div>}
      <svg viewBox="0 0 280 120" className="staff-svg">
        {STAFF_LINES.map(y => (
          <line key={y} x1="10" y1={y} x2="270" y2={y} stroke="#bbb" strokeWidth="1.5" />
        ))}

        {clef === 'treble' ? <TrebleClef /> : <BassClef />}

        {ledgerLines.map(ly => (
          <line key={ly} x1={noteX - 18} y1={ly} x2={noteX + 18} y2={ly} stroke="#bbb" strokeWidth="1.5" />
        ))}

        <ellipse
          cx={noteX}
          cy={noteY}
          rx="9"
          ry="6.5"
          fill={noteColor}
          transform={`rotate(-15, ${noteX}, ${noteY})`}
          className={feedback === 'correct' ? 'note-correct' : feedback === 'wrong' ? 'note-wrong' : 'note-idle'}
        />
        <line
          x1={noteX + 8}
          y1={noteY}
          x2={noteX + 8}
          y2={noteY - 35}
          stroke={noteColor}
          strokeWidth="2"
        />

        {showHint && (
          <>
            <rect x={noteX + 18} y={noteY - 16} width="26" height="22" rx="6" fill={handColor} opacity="0.9" />
            <text x={noteX + 31} y={noteY + 1} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
              {noteInfo.label}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
