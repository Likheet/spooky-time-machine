import { useState } from 'react';
import { useApiKey } from '../contexts/ApiKeyContext';
import './ApiKeySettings.css';

/**
 * ApiKeySettings Component
 * Provides UI for entering and managing Gemini API key
 */
export function ApiKeySettings() {
  const { apiKey, setApiKey, isConfigured, clearApiKey } = useApiKey();
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    if (inputValue.trim()) {
      setApiKey(inputValue.trim());
      setInputValue('');
      setIsExpanded(false);
    }
  };

  const handleClear = () => {
    clearApiKey();
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
      setInputValue('');
    }
  };

  const maskedKey = apiKey ? `${apiKey.slice(0, 4)}${'•'.repeat(20)}${apiKey.slice(-4)}` : '';

  return (
    <div className="api-key-settings">
      <button
        className={`api-key-settings-toggle ${isConfigured ? 'configured' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="API Key settings"
        aria-expanded={isExpanded}
        title={isConfigured ? 'API Key configured' : 'Configure API Key'}
      >
        🔑
      </button>

      {isExpanded && (
        <div className="api-key-settings-panel" role="dialog" aria-label="API Key Settings">
          <h3>Hugging Face Token</h3>

          {isConfigured ? (
            <div className="api-key-configured">
              <div className="current-key">
                <span className="key-label">Current Token:</span>
                <span className="key-value">{showKey ? apiKey : maskedKey}</span>
                <button
                  className="toggle-visibility"
                  onClick={() => setShowKey(!showKey)}
                  aria-label={showKey ? 'Hide API token' : 'Show API token'}
                >
                  {showKey ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <div className="api-key-actions">
                <button className="clear-btn" onClick={handleClear}>
                  Remove Token
                </button>
              </div>
            </div>
          ) : (
            <div className="api-key-input-section">
              <p className="api-key-description">
                Enter your Hugging Face Access Token to enable image generation.
              </p>
              <div className="input-group">
                <input
                  type="password"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="hf_..."
                  aria-label="Hugging Face API token"
                  autoFocus
                />
                <button
                  className="save-btn"
                  onClick={handleSave}
                  disabled={!inputValue.trim()}
                >
                  Save
                </button>
              </div>
              <p className="api-key-hint">
                Get your free token from{' '}
                <a
                  href="https://huggingface.co/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hugging Face Settings
                </a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
