import { useState } from 'react';

export default function FlashcardPreview({ front = '', back = '' }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const hasContent = front.trim() || back.trim();

  return (
    <div className="flashcard-container" style={{ perspective: '1000px' }}>
      <div
        className={`flashcard ${isFlipped ? 'flipped' : ''}`}
        onClick={handleFlip}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front Side */}
        <div className="flashcard-face flashcard-front">
          <div className="flashcard-content">
            <div className="flashcard-label">Question</div>
            <p className="flashcard-text">
              {front || 'Type your question...'}
            </p>
            {hasContent && (
              <div className="flashcard-hint">
                <span className="pulse-dot"></span>
                Click to reveal answer
              </div>
            )}
          </div>
        </div>

        {/* Back Side */}
        <div className="flashcard-face flashcard-back">
          <div className="flashcard-content">
            <div className="flashcard-label">Answer</div>
            <p className="flashcard-text">
              {back || 'Type your answer...'}
            </p>
            {hasContent && (
              <div className="flashcard-hint">
                <span className="pulse-dot"></span>
                Click to flip back
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .flashcard-container {
          width: 100%;
          max-width: 400px;
          margin: 0 auto 2rem;
        }

        .flashcard {
          position: relative;
          width: 100%;
          height: 250px;
          cursor: pointer;
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .flashcard-face {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-xl);
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--glass-shadow);
          transition: all var(--transition-normal);
        }

        .flashcard-face:hover {
          border-color: hsla(210, 40%, 98%, 0.2);
        }

        .flashcard-front {
          background: var(--glass-bg);
        }

        .flashcard-back {
          background: linear-gradient(135deg,
            hsla(var(--accent-hue), 91%, 60%, 0.1) 0%,
            hsla(var(--accent-hue), 91%, 50%, 0.05) 100%
          );
          transform: rotateY(180deg);
        }

        .flashcard-content {
          text-align: center;
          width: 100%;
        }

        .flashcard-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .flashcard-back .flashcard-label {
          color: var(--accent);
        }

        .flashcard-text {
          font-size: 1.125rem;
          line-height: 1.6;
          color: var(--text-primary);
          margin: 0 0 1.5rem 0;
          word-wrap: break-word;
        }

        .flashcard-hint {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .pulse-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          background-color: var(--accent);
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
