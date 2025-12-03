import './ErrorDisplay.css';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorDisplay({ error, onRetry, onDismiss }: ErrorDisplayProps) {
  if (!error) {
    return null;
  }

  return (
    <div className="error-display-container">
      <div className="error-frame">
        {/* Spooky skull icon */}
        <div className="error-icon">
          <span className="skull-symbol">💀</span>
        </div>
        
        {/* Error message */}
        <div className="error-content">
          <h3 className="error-title">The Spirits Are Restless...</h3>
          <p className="error-message">{error}</p>
        </div>
        
        {/* Action buttons */}
        <div className="error-actions">
          {onRetry && (
            <button
              className="error-button retry-button"
              onClick={onRetry}
              aria-label="Retry image generation"
            >
              <span className="button-icon">🔄</span>
              <span className="button-label">Try Again</span>
            </button>
          )}
          
          {onDismiss && (
            <button
              className="error-button dismiss-button"
              onClick={onDismiss}
              aria-label="Dismiss error message"
            >
              <span className="button-icon">✕</span>
              <span className="button-label">Dismiss</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
