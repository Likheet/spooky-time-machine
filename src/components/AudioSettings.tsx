import { useState, useEffect } from 'react';
import audioManager from '../services/AudioManager';
import './AudioSettings.css';

/**
 * AudioSettings Component
 * Provides UI controls for audio preferences
 */
export const AudioSettings = () => {
  const [isMuted, setIsMuted] = useState(audioManager.isMutedState());
  const [volume, setVolume] = useState(audioManager.getMasterVolume());
  const [isEnabled, setIsEnabled] = useState(audioManager.isAudioEnabled());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Preload sounds when component mounts
    audioManager.preloadSounds();
  }, []);

  const handleToggleMute = () => {
    const newMuteState = audioManager.toggleMute();
    setIsMuted(newMuteState);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    audioManager.setMasterVolume(newVolume);
  };

  const handleToggleEnabled = () => {
    const newEnabledState = !isEnabled;
    setIsEnabled(newEnabledState);
    audioManager.setEnabled(newEnabledState);
  };

  return (
    <div className="audio-settings">
      <button
        className="audio-settings-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Audio settings"
        title="Audio settings"
      >
        {isMuted || !isEnabled ? '🔇' : '🔊'}
      </button>

      {isExpanded && (
        <div className="audio-settings-panel">
          <h3>Audio Settings</h3>

          <div className="audio-setting-item">
            <label>
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={handleToggleEnabled}
              />
              Enable Audio
            </label>
          </div>

          {isEnabled && (
            <>
              <div className="audio-setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={isMuted}
                    onChange={handleToggleMute}
                  />
                  Mute
                </label>
              </div>

              <div className="audio-setting-item">
                <label>
                  Volume
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    disabled={isMuted}
                  />
                  <span className="volume-value">{Math.round(volume * 100)}%</span>
                </label>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioSettings;
