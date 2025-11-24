import { useRef, useEffect } from 'react';
import CharCounter from './CharCounter';

export default function AutoExpandTextarea({
  value,
  onChange,
  placeholder,
  id,
  maxLength = 500,
  minRows = 3,
  maxRows = 10,
  showCounter = true,
  ...props
}) {
  const textareaRef = useRef(null);

  // Auto-expand functionality
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to get proper scrollHeight
    textarea.style.height = 'auto';

    // Calculate line height
    const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
    const minHeight = lineHeight * minRows;
    const maxHeight = lineHeight * maxRows;

    // Set new height
    if (!props.fixedHeight) {
      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
    }
  }, [value, minRows, maxRows, props.fixedHeight]);

  return (
    <div className="auto-expand-textarea-wrapper">
      <textarea
        ref={textareaRef}
        id={id}
        className={`auto-expand-textarea ${props.className || ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        {...props}
      />
      {showCounter && <CharCounter current={value.length} max={maxLength} />}

      <style jsx>{`
        .auto-expand-textarea-wrapper {
          position: relative;
          width: 100%;
        }

        :global(.card-textarea) {
          width: 100%;
          padding: 0.75rem 1rem;
          padding-bottom: ${showCounter ? '2rem' : '0.75rem'};
          background-color: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: inherit;
          font-size: 1rem;
          line-height: 1.5;
          resize: none;
          overflow-y: auto;
          transition: all var(--transition-fast);
          height: 300px;
        }

        :global(.card-textarea:focus) {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 2px hsla(var(--accent-hue), 91%, 60%, 0.2);
        }

        .auto-expand-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          padding-bottom: ${showCounter ? '2rem' : '0.75rem'};
          background-color: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: inherit;
          font-size: 1rem;
          line-height: 1.5;
          resize: none;
          overflow-y: auto;
          transition: all var(--transition-fast);
        }

        .auto-expand-textarea:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 2px hsla(var(--accent-hue), 91%, 60%, 0.2);
        }

        .auto-expand-textarea::placeholder {
          color: var(--text-muted);
        }

        /* Custom scrollbar */
        .auto-expand-textarea::-webkit-scrollbar {
          width: 8px;
        }

        .auto-expand-textarea::-webkit-scrollbar-track {
          background: transparent;
        }

        .auto-expand-textarea::-webkit-scrollbar-thumb {
          background: var(--glass-border);
          border-radius: 4px;
        }

        .auto-expand-textarea::-webkit-scrollbar-thumb:hover {
          background: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .auto-expand-textarea {
            overflow-y: hidden;
            scrollbar-width: none;
          }

          .auto-expand-textarea::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
