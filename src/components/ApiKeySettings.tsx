import { useState } from 'react';
import { useApiKey } from '../contexts/ApiKeyContext';
import './ApiKeySettings.css';

interface KeySectionProps {
  title: string;
  apiKey: string;
  setKey: (key: string) => void;
  clearKey: () => void;
  isConfigured: boolean;
  placeholder: string;
  link: string;
  linkText: string;
  description: string;
}

function KeySection({
  title,
  apiKey,
  setKey,
  clearKey,
  isConfigured,
  placeholder,
  link,
  linkText,
  description,
}: KeySectionProps) {
  const [inputValue, setInputValue] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    if (inputValue.trim()) {
      setKey(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  const maskedKey = apiKey ? `${apiKey.slice(0, 4)}${'•'.repeat(20)}${apiKey.slice(-4)}` : '';

  return (
    <div className="key-section" style={{ marginBottom: '2rem' }}>
      <h3>{title}</h3>

      {isConfigured ? (
        <div className="api-key-configured">
          <div className="current-key">
            <span className="key-label">Current Key:</span>
            <span className="key-value">{showKey ? apiKey : maskedKey}</span>
            <button
              className="toggle-visibility"
              onClick={() => setShowKey(!showKey)}
              aria-label={showKey ? 'Hide API key' : 'Show API key'}
            >
              {showKey ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <div className="api-key-actions">
            <button className="clear-btn" onClick={clearKey}>
              Remove Key
            </button>
          </div>
        </div>
      ) : (
        <div className="api-key-input-section">
          <p className="api-key-description">{description}</p>
          <div className="input-group">
            <input
              type="password"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              aria-label={`${title} input`}
            />
            <button className="save-btn" onClick={handleSave} disabled={!inputValue.trim()}>
              Save
            </button>
          </div>
          <p className="api-key-hint">
            Get your key from{' '}
            <a href={link} target="_blank" rel="noopener noreferrer">
              {linkText}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

export function ApiKeySettings() {
  const {
    apiKey,
    setApiKey,
    isConfigured,
    clearApiKey,
    geminiKey,
    setGeminiKey,
    isGeminiConfigured,
    clearGeminiKey,
  } = useApiKey();
  const [isExpanded, setIsExpanded] = useState(false);

  const allConfigured = isConfigured && isGeminiConfigured;

  return (
    <div className="api-key-settings">
      <button
        className={`api-key-settings-toggle ${allConfigured ? 'configured' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="API Key settings"
        aria-expanded={isExpanded}
        title="Configure API Keys"
      >
        🔑
      </button>

      {isExpanded && (
        <div className="api-key-settings-panel" role="dialog" aria-label="API Key Settings">
          <KeySection
            title="Hugging Face Token"
            apiKey={apiKey}
            setKey={setApiKey}
            clearKey={clearApiKey}
            isConfigured={isConfigured}
            placeholder="hf_..."
            link="https://huggingface.co/settings/tokens"
            linkText="Hugging Face Settings"
            description="Required for generating images."
          />

          <div className="divider" style={{ borderBottom: '1px solid rgba(255, 102, 0, 0.3)', margin: '1.5rem 0' }}></div>

          <KeySection
            title="Gemini API Key"
            apiKey={geminiKey}
            setKey={setGeminiKey}
            clearKey={clearGeminiKey}
            isConfigured={isGeminiConfigured}
            placeholder="AIza..."
            link="https://aistudio.google.com/app/apikey"
            linkText="Google AI Studio"
            description="Required for generating spooky stories."
          />

          <button
            className="close-btn"
            onClick={() => setIsExpanded(false)}
            style={{
              width: '100%',
              padding: '0.5rem',
              marginTop: '1rem',
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'rgba(255, 255, 255, 0.7)',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
