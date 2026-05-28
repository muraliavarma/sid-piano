import { useState, useEffect } from 'react';
import GameScreen from './components/GameScreen';
import { LEVELS, SECTIONS } from './utils/notes';

type Screen = 'welcome' | 'levels' | 'game' | 'celebration';

interface LevelProgress {
  stars: number;
  completed: boolean;
}

interface SaveData {
  levelProgress: Record<number, LevelProgress>;
  highestUnlocked: number;
}

const STORAGE_KEY = 'piano-stars-progress';

function loadProgress(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { levelProgress: {}, highestUnlocked: 1 };
}

function saveProgress(data: SaveData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [progress, setProgress] = useState<SaveData>(loadProgress);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [celebrationStars, setCelebrationStars] = useState(0);

  useEffect(() => saveProgress(progress), [progress]);

  function handleSelectLevel(id: number) {
    setCurrentLevel(id);
    setScreen('game');
  }

  function handleComplete(levelId: number, stars: number) {
    setCelebrationStars(stars);
    setProgress(prev => {
      const existing = prev.levelProgress[levelId];
      const bestStars = Math.max(stars, existing?.stars ?? 0);
      const newHighest = Math.max(prev.highestUnlocked, levelId + 1);
      return {
        levelProgress: { ...prev.levelProgress, [levelId]: { stars: bestStars, completed: true } },
        highestUnlocked: newHighest,
      };
    });
    setScreen('celebration');
  }

  function handleResetProgress() {
    setProgress({ levelProgress: {}, highestUnlocked: 1 });
  }

  if (screen === 'welcome') {
    return (
      <div className="screen welcome-screen">
        <div className="welcome-content">
          <div className="welcome-icon">
            <svg viewBox="0 0 80 80" width="120" height="120">
              <rect x="10" y="15" width="8" height="50" rx="2" fill="#333" />
              <rect x="22" y="15" width="8" height="50" rx="2" fill="#333" />
              <rect x="34" y="15" width="8" height="50" rx="2" fill="#333" />
              <rect x="46" y="15" width="8" height="50" rx="2" fill="#333" />
              <rect x="58" y="15" width="8" height="50" rx="2" fill="#333" />
              <circle cx="14" cy="12" r="5" fill="#ffd43b" />
              <circle cx="26" cy="8" r="5" fill="#ff6b6b" />
              <circle cx="38" cy="10" r="5" fill="#51cf66" />
              <circle cx="50" cy="6" r="5" fill="#4c9aff" />
              <circle cx="62" cy="9" r="5" fill="#cc5de8" />
            </svg>
          </div>
          <h1>Piano Stars</h1>
          <p className="welcome-subtitle">Learn to Read Music Notes!</p>
          <button className="btn btn-primary btn-large" onClick={() => setScreen('levels')}>
            Play
          </button>
        </div>
        <div className="floating-notes">
          {['♪', '♫', '♩', '♬', '♪', '♫'].map((n, i) => (
            <span key={i} className="floating-note" style={{ animationDelay: `${i * 2}s`, left: `${10 + i * 15}%` }}>
              {n}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'levels') {
    const totalStars = Object.values(progress.levelProgress).reduce((sum, lp) => sum + (lp.stars ?? 0), 0);
    const maxStars = LEVELS.length * 3;

    return (
      <div className="screen levels-screen">
        <div className="levels-header">
          <button className="back-btn" onClick={() => setScreen('welcome')}>Back</button>
          <h1>Choose a Level</h1>
          <div className="total-stars">★ {totalStars}/{maxStars}</div>
        </div>

        {SECTIONS.map(section => {
          const sectionLevels = LEVELS.filter(l => l.section === section);
          return (
            <div key={section} className="level-section">
              <h3 className="section-title">{section}</h3>
              <div className="levels-grid">
                {sectionLevels.map(level => {
                  const unlocked = level.id <= progress.highestUnlocked;
                  const lp = progress.levelProgress[level.id];
                  const stars = lp?.stars ?? 0;
                  const isCurrent = level.id === progress.highestUnlocked && !lp?.completed;
                  return (
                    <button
                      key={level.id}
                      className={`level-card ${unlocked ? 'level-unlocked' : 'level-locked'} ${isCurrent ? 'level-current' : ''}`}
                      onClick={() => unlocked && handleSelectLevel(level.id)}
                      disabled={!unlocked}
                    >
                      <div className="level-number">{level.id}</div>
                      <div className="level-title">{level.title}</div>
                      <div className="level-subtitle">{level.subtitle}</div>
                      {unlocked ? (
                        <div className="level-stars">
                          {[1, 2, 3].map(s => (
                            <span key={s} className={`star ${s <= stars ? 'star-earned' : 'star-empty'}`}>★</span>
                          ))}
                        </div>
                      ) : (
                        <div className="lock-icon">🔒</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <button className="reset-btn" onClick={handleResetProgress}>Reset Progress</button>
      </div>
    );
  }

  if (screen === 'game') {
    return (
      <GameScreen
        levelId={currentLevel}
        onComplete={handleComplete}
        onBack={() => setScreen('levels')}
      />
    );
  }

  if (screen === 'celebration') {
    const level = LEVELS.find(l => l.id === currentLevel)!;
    const messages = ['Good job! Keep practicing!', 'Great work!', 'Amazing! Perfect score!'];
    const message = messages[Math.min(celebrationStars - 1, 2)];
    const hasNext = currentLevel < LEVELS.length;

    return (
      <div className="screen celebration-screen">
        <div className="celebration-content">
          <h1 className="celebration-title">Level Complete!</h1>
          <h2>{level.title}</h2>
          <div className="celebration-stars">
            {[1, 2, 3].map(s => (
              <span
                key={s}
                className={`big-star ${s <= celebrationStars ? 'big-star-earned' : 'big-star-empty'}`}
                style={{ animationDelay: `${s * 0.3}s` }}
              >
                ★
              </span>
            ))}
          </div>
          <p className="celebration-message">{message}</p>
          <div className="celebration-buttons">
            <button className="btn btn-secondary" onClick={() => setScreen('game')}>
              Try Again
            </button>
            {hasNext && (
              <button className="btn btn-primary" onClick={() => { setCurrentLevel(currentLevel + 1); setScreen('game'); }}>
                Next Level
              </button>
            )}
            <button className="btn btn-outline" onClick={() => setScreen('levels')}>
              All Levels
            </button>
          </div>
        </div>
        <div className="confetti">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#ff6b6b', '#ffd43b', '#51cf66', '#4c9aff', '#cc5de8', '#ff922b'][i % 6],
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
}
