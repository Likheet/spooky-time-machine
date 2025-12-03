import { useAudio } from '../hooks/useAudio';
import './AudioIntegrationExample.css';

/**
 * Example component demonstrating audio integration with UI interactions
 * This shows how to trigger audio effects on various user interactions
 */
export const AudioIntegrationExample = () => {
  const { playSound, SoundEffect } = useAudio();

  return (
    <div className="audio-example-container">
      <h2>Audio Integration Examples</h2>
      
      <div className="audio-example-grid">
        {/* Thunder on hover */}
        <button
          className="audio-example-button"
          onMouseEnter={() => playSound(SoundEffect.THUNDER, 0.3)}
          onClick={() => console.log('Thunder button clicked')}
        >
          Hover for Thunder
        </button>

        {/* Wind on click */}
        <button
          className="audio-example-button"
          onClick={() => playSound(SoundEffect.WIND)}
        >
          Click for Wind
        </button>

        {/* Creak on hover */}
        <button
          className="audio-example-button"
          onMouseEnter={() => playSound(SoundEffect.CREAK, 0.2)}
          onClick={() => console.log('Creak button clicked')}
        >
          Hover for Creak
        </button>

        {/* Whoosh on click */}
        <button
          className="audio-example-button"
          onClick={() => playSound(SoundEffect.WHOOSH)}
        >
          Click for Whoosh
        </button>

        {/* Ambient toggle */}
        <button
          className="audio-example-button"
          onClick={() => playSound(SoundEffect.AMBIENT, 0.15)}
        >
          Play Ambient
        </button>
      </div>

      <div className="audio-example-note">
        <p>
          💡 <strong>Integration Tips:</strong>
        </p>
        <ul>
          <li>Use <code>onMouseEnter</code> for hover effects (thunder, whispers)</li>
          <li>Use <code>onClick</code> for click interactions (wind, whoosh)</li>
          <li>Use <code>onFocus</code> for keyboard navigation accessibility</li>
          <li>Keep volumes low (0.2-0.3) for subtle atmospheric effects</li>
          <li>Respect user preferences - audio is automatically disabled for users with prefers-reduced-motion</li>
        </ul>
      </div>
    </div>
  );
};

export default AudioIntegrationExample;
