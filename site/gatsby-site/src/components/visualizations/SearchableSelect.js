import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Trans } from 'react-i18next';

/**
 * Searchable combobox that replaces a plain <select>.
 *
 * Props:
 *   id          – HTML id for the <input> (links to a <label>)
 *   options     – [{ value, label, sublabel? }]
 *                   value    – the stored value passed to onChange
 *                   label    – text shown in the input and list
 *                   sublabel – optional secondary text (right-aligned, gray)
 *   value       – currently selected value
 *   onChange    – called with the new value string
 *   placeholder – placeholder text when nothing is selected
 *
 * Behaviour:
 *   - Typing filters the list in real time (matches label OR sublabel).
 *   - Enter selects the top filtered match.
 *   - Escape closes without changing selection.
 *   - × button clears the current selection.
 *   - Click outside closes the dropdown.
 */
export default function SearchableSelect({ id, options, value, onChange, placeholder }) {
  const [query, setQuery] = useState('');

  const [isOpen, setIsOpen] = useState(false);

  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef(null);

  const listRef = useRef(null);

  const inputRef = useRef(null);

  // Derived from the id prop; useId produces different values on the server
  // and client here and breaks hydration.
  const listboxId = id ? `${id}-listbox` : undefined;

  // Forward wheel events from the input to the list so trackpad scroll works while typing
  useEffect(() => {
    if (!isOpen || !inputRef.current || !listRef.current) return;
    const input = inputRef.current;

    const list = listRef.current;

    function handleWheel(e) {
      e.preventDefault();
      list.scrollTop += e.deltaY;
    }
    input.addEventListener('wheel', handleWheel, { passive: false });
    return () => input.removeEventListener('wheel', handleWheel);
  }, [isOpen]);

  const filtered = useMemo(() => {
    if (!query) return options;
    const lower = query.toLowerCase();

    return options.filter(
      (o) => o.label.toLowerCase().includes(lower) || o.sublabel?.toLowerCase().includes(lower)
    );
  }, [options, query]);

  // Reset highlight when filtered results change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [query]);

  // Scroll highlighted item into view within the list (never the page)
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const list = listRef.current;

      const item = list.children[highlightedIndex];

      if (item) {
        const itemBottom = item.offsetTop + item.offsetHeight;

        const listBottom = list.scrollTop + list.clientHeight;

        if (itemBottom > listBottom) {
          list.scrollTop = itemBottom - list.clientHeight;
        } else if (item.offsetTop < list.scrollTop) {
          list.scrollTop = item.offsetTop;
        }
      }
    }
  }, [highlightedIndex]);

  function open() {
    setQuery('');
    setHighlightedIndex(-1);
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    setQuery('');
    setHighlightedIndex(-1);
  }

  function select(v) {
    onChange(v);
    close();
  }

  // Close on click outside
  useEffect(() => {
    function handler(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        close();
      }
    }

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // When closed: show the label of the selected option.
  // When open: show what the user is typing.
  const selectedLabel = options.find((o) => o.value === value)?.label || value || '';

  const inputDisplayValue = isOpen ? query : selectedLabel;

  return (
    <div ref={containerRef} className="relative min-w-[220px]">
      <div className="relative">
        <input
          id={id}
          type="text"
          value={inputDisplayValue}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={open}
          // Reopen on click; a focused input gets no focus event.
          onClick={() => {
            if (!isOpen) open();
          }}
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              close();
              return;
            }
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              if (!isOpen) {
                open();
                return;
              }
              setHighlightedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setHighlightedIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              // Only while open, or Enter on a closed input would replace
              // the selection.
              if (isOpen && filtered.length > 0) {
                select(filtered[highlightedIndex >= 0 ? highlightedIndex : 0].value);
              }
            }
          }}
          autoComplete="off"
          ref={inputRef}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        {value ? (
          <button
            type="button"
            aria-label="Clear selection"
            onMouseDown={(e) => {
              e.preventDefault();
              onChange('');
              close();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        ) : (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
            ▾
          </span>
        )}
      </div>

      {isOpen && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          onMouseDown={(e) => e.stopPropagation()}
          style={{ maxHeight: '16rem', overflowY: 'scroll' }}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400"
        >
          {filtered.length === 0 ? (
            <li role="option" aria-selected={false} className="px-3 py-2 text-sm text-gray-400">
              <Trans>No matches</Trans>
            </li>
          ) : (
            filtered.map((opt, index) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(opt.value);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-3 py-2 text-sm cursor-pointer flex justify-between items-center gap-2 ${
                  opt.value === value
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : index === highlightedIndex
                    ? 'bg-gray-100'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span>{opt.label}</span>
                {opt.sublabel && (
                  <span className="text-xs text-gray-400 shrink-0">{opt.sublabel}</span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
