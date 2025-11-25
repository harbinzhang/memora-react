import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

export default function TagInput({ tags = [], onChange, suggestions = [], placeholder = 'Add tags...' }) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Derived state: filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = suggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
          !tags.includes(suggestion)
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilteredSuggestions(filtered);
       
      setShowSuggestions(filtered.length > 0);
    } else {
       
      setShowSuggestions(false);
       
      setFilteredSuggestions([]);
    }
  }, [inputValue, suggestions, tags]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = (tag) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag]);
    }
    setInputValue('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
        addTag(filteredSuggestions[selectedIndex]);
      } else if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <div className="tag-input-container" ref={containerRef}>
      <div className="tag-input-wrapper">
        <div className="tag-chips">
          {tags.map((tag, index) => (
            <span key={index} className="tag-chip">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="tag-remove"
                aria-label={`Remove ${tag}`}
              >
                <X size={14} />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue && setShowSuggestions(filteredSuggestions.length > 0)}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="tag-input"
          />
        </div>

        {showSuggestions && (
          <div className="tag-suggestions">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                type="button"
                className={`tag-suggestion-item ${
                  index === selectedIndex ? 'selected' : ''
                }`}
                onClick={() => addTag(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .tag-input-container {
          position: relative;
          width: 100%;
        }

        .tag-input-wrapper {
          position: relative;
          width: 100%;
          min-height: 44px;
          padding: 0.5rem;
          background-color: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .tag-input-wrapper:focus-within {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px hsla(var(--accent-hue), 91%, 60%, 0.2);
        }

        .tag-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }

        .tag-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.25rem 0.625rem;
          background-color: var(--accent);
          color: var(--accent-foreground);
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          line-height: 1.25rem;
          transition: all var(--transition-fast);
        }

        .tag-chip:hover {
          background-color: var(--accent-hover);
        }

        .tag-remove {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          background: transparent;
          border: none;
          color: var(--accent-foreground);
          cursor: pointer;
          opacity: 0.7;
          transition: opacity var(--transition-fast);
        }

        .tag-remove:hover {
          opacity: 1;
        }

        .tag-input {
          flex: 1;
          min-width: 120px;
          padding: 0.25rem;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-family: inherit;
          font-size: 1rem;
        }

        .tag-input::placeholder {
          color: var(--text-muted);
        }

        .tag-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 0.25rem;
          max-height: 200px;
          overflow-y: auto;
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: var(--radius-md);
          box-shadow: var(--glass-shadow);
          z-index: 10;
        }

        .tag-suggestion-item {
          display: block;
          width: 100%;
          padding: 0.625rem 1rem;
          text-align: left;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-family: inherit;
          font-size: 0.9375rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .tag-suggestion-item:hover,
        .tag-suggestion-item.selected {
          background-color: var(--bg-card-hover);
          color: var(--accent);
        }

        .tag-suggestion-item:first-child {
          border-top-left-radius: var(--radius-md);
          border-top-right-radius: var(--radius-md);
        }

        .tag-suggestion-item:last-child {
          border-bottom-left-radius: var(--radius-md);
          border-bottom-right-radius: var(--radius-md);
        }
      `}</style>
    </div>
  );
}
