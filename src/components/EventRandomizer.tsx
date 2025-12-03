import { useState, memo } from 'react';
import type { NotableEvent } from '../types';
import { NOTABLE_EVENTS } from '../data/notableEvents';
import './EventRandomizer.css';

interface EventRandomizerProps {
  onEventSelect: (event: NotableEvent) => void;
}

function EventRandomizerComponent({ onEventSelect }: EventRandomizerProps) {
  const [selectedEvent, setSelectedEvent] = useState<NotableEvent | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleRandomize = () => {
    // Trigger animation
    setIsAnimating(true);

    // Random selection from events list
    const randomIndex = Math.floor(Math.random() * NOTABLE_EVENTS.length);
    const event = NOTABLE_EVENTS[randomIndex];

    // Delay to show animation
    setTimeout(() => {
      setSelectedEvent(event);
      setIsAnimating(false);
      onEventSelect(event);
    }, 600);
  };

  return (
    <div className="event-randomizer">
      <div className="event-randomizer-header">
        <h2 className="event-randomizer-title">Fate's Wheel</h2>
        <p className="event-randomizer-subtitle">
          Let destiny choose your journey through time...
        </p>
      </div>

      <div className="event-randomizer-content">
        <button
          className={`randomize-button ${isAnimating ? 'animating' : ''}`}
          onClick={handleRandomize}
          disabled={isAnimating}
          type="button"
        >
          <span className="button-icon">🎃</span>
          <span className="button-text">
            {isAnimating ? 'Summoning...' : 'Summon Random Event'}
          </span>
          <span className="button-glow"></span>
        </button>

        {selectedEvent && !isAnimating && (
          <div className="event-display">
            <div className="event-tags">
              {selectedEvent.tags.map((tag) => (
                <span key={tag} className="event-tag">
                  {tag}
                </span>
              ))}
            </div>

            <h3 className="event-name">{selectedEvent.name}</h3>

            <p className="event-description">{selectedEvent.description}</p>

            <div className="event-details">
              <div className="event-detail">
                <span className="detail-label">Location</span>
                <span className="detail-value">
                  {selectedEvent.location.name || 
                    `${selectedEvent.location.latitude.toFixed(4)}°, ${selectedEvent.location.longitude.toFixed(4)}°`}
                </span>
              </div>

              <div className="event-detail">
                <span className="detail-label">Time</span>
                <span className="detail-value">{selectedEvent.time.displayName}</span>
              </div>
            </div>
          </div>
        )}

        {!selectedEvent && !isAnimating && (
          <div className="event-placeholder">
            <p className="placeholder-text">
              Click the button above to reveal a mysterious moment in history...
            </p>
          </div>
        )}
      </div>

      {/* Animated effects */}
      <div className="pentagram pentagram-1"></div>
      <div className="pentagram pentagram-2"></div>
      <div className="mist mist-1"></div>
      <div className="mist mist-2"></div>
    </div>
  );
}

// Memoize the EventRandomizer component
export const EventRandomizer = memo(EventRandomizerComponent);
