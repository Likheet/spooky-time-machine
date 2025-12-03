import { useState } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import './AccessibilitySettings.css';

/**
 * AccessibilitySettings Component
 * Provides UI controls for accessibility preferences
 */
export function AccessibilitySettings() {
  const { reducedMotion, audioEnabled, setReducedMotion, setAudioEnabled } = useAccessibility();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="accessibility-settings">
      <button
        className="accessibility-settings-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Accessibility settings"
        aria-expanded={isExpanded}
        title="Accessibility settings"
      >
        ♿
      </button>

      {isExpanded && (
        <div className="accessibility-settings-panel" role="dialog" aria-label="Accessibility Settings">
          <h3 id="accessibility-settings-title">Accessibility Settings</h3>

          <div className="accessibility-setting-item">
            <label htmlFor="reduced-motion-toggle">
              <input
                id="reduced-motion-toggle"
                type="checkbox"
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
                aria-describedby="reduced-motion-description"
              />
              <span className="setting-label">Reduce Motion</span>
            </label>
            <p id="reduced-motion-description" className="setting-description">
              Minimizes animations and transitions
            </p>
          </div>

          <div className="accessibility-setting-item">
            <label htmlFor="audio-enabled-toggle">
              <input
                id="audio-enabled-toggle"
                type="checkbox"
                checked={audioEnabled}
                onChange={(e) => setAudioEnabled(e.target.checked)}
                aria-describedby="audio-enabled-description"
              />
              <span className="setting-label">Enable Audio</span>
            </label>
            <p id="audio-enabled-description" className="setting-description">
              Enables sound effects and ambient audio
            </p>
          </div>

          <div className="accessibility-info">
            <p>
              <strong>Keyboard Navigation:</strong>
              <br />
              • Tab: Navigate between elements
              <br />
              • Enter/Space: Activate buttons
              <br />
              • Escape: Close dialogs
              <br />• Arrow keys: Navigate dropdowns
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
