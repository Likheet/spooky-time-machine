import { useState, useEffect, useRef, memo } from 'react';
import type { Coordinates } from '../types';
import './LocationSearch.css';

interface LocationSearchProps {
  onLocationSelect: (coords: Coordinates) => void;
  geocodingService: {
    searchLocation: (query: string) => Promise<Coordinates[]>;
    getSuggestions: (partial: string) => Promise<string[]>;
  };
}

function LocationSearchComponent({ onLocationSelect, geocodingService }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Coordinates[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string>('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      setError('');
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const results = await geocodingService.searchLocation(query);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
        
        if (results.length === 0) {
          setError('No locations found');
        }
      } catch (err) {
        console.error('Search error:', err);
        setError('Search failed. Please try again.');
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, geocodingService]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (coords: Coordinates) => {
    onLocationSelect(coords);
    setQuery(coords.name || `${coords.latitude}, ${coords.longitude}`);
    setShowDropdown(false);
    setSelectedIndex(-1);
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    setError('');
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div className="location-search" ref={searchRef}>
      <div className="search-input-container">
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search for a location..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
          aria-label="Search for location"
          aria-autocomplete="list"
          aria-controls="search-suggestions"
          aria-expanded={showDropdown}
        />
        
        {query && (
          <button
            className="clear-button"
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            ✕
          </button>
        )}
        
        {isLoading && (
          <div className="search-loading-indicator">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>

      {showDropdown && suggestions.length > 0 && (
        <ul
          className="search-dropdown"
          id="search-suggestions"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={`${suggestion.latitude}-${suggestion.longitude}-${index}`}
              className={`search-suggestion ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleSuggestionClick(suggestion)}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <span className="suggestion-name">
                {suggestion.name || 'Unknown Location'}
              </span>
              <span className="suggestion-coords">
                {suggestion.latitude.toFixed(4)}°, {suggestion.longitude.toFixed(4)}°
              </span>
            </li>
          ))}
        </ul>
      )}

      {error && !isLoading && (
        <div className="search-error">
          {error}
        </div>
      )}
    </div>
  );
}

// Memoize the LocationSearch component
export const LocationSearch = memo(LocationSearchComponent);
