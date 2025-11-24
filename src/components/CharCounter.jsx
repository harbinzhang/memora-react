export default function CharCounter({ current = 0, max = 500 }) {
  const percentage = (current / max) * 100;

  // Determine color based on percentage
  const getColor = () => {
    if (percentage >= 95) return 'var(--danger)';
    if (percentage >= 80) return 'hsl(45, 90%, 60%)'; // Warning yellow
    return 'var(--text-muted)';
  };

  const isOverLimit = current > max;

  return (
    <div className="char-counter">
      <span className={`char-counter-text ${isOverLimit ? 'over-limit' : ''}`}>
        {current}/{max}
      </span>

      <style jsx>{`
        .char-counter {
          position: absolute;
          bottom: 0.5rem;
          right: 0.75rem;
          font-size: 0.75rem;
          font-weight: 500;
          pointer-events: none;
          z-index: 1;
        }

        .char-counter-text {
          color: ${getColor()};
          transition: color var(--transition-fast);
        }

        .char-counter-text.over-limit {
          color: var(--danger);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
