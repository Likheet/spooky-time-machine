# Audio Assets

This directory contains audio files for the Time Travel Explorer application.

## Required Audio Files

The following audio files are needed for the Halloween-themed atmospheric effects:

1. **thunder.mp3** - Thunder rumbles for hover effects (~200-300ms)
2. **wind.mp3** - Wind whispers for click interactions (~100-150ms)
3. **creak.mp3** - Distant creaking for page transitions
4. **whoosh.mp3** - Whoosh sound for animations
5. **ambient.mp3** - Optional ambient background track (subtle, user-controllable)

## Audio Specifications

- **Format**: MP3 (for broad browser compatibility)
- **Sample Rate**: 44.1 kHz recommended
- **Bit Rate**: 128-192 kbps
- **Duration**: 
  - Sound effects: 0.5-2 seconds
  - Ambient: Can be longer, will loop

## Sourcing Audio

You can source audio from:
- **Free Resources**: 
  - Freesound.org (CC licensed)
  - Zapsplat.com (free with attribution)
  - BBC Sound Effects Library
- **Create Your Own**: Using audio editing software like Audacity
- **Purchase**: From AudioJungle, Epidemic Sound, etc.

## Integration Example

```typescript
import { useAudio } from '../hooks/useAudio';

function MyComponent() {
  const { playSound, SoundEffect } = useAudio();

  const handleClick = () => {
    playSound(SoundEffect.WIND);
    // Your click logic
  };

  const handleHover = () => {
    playSound(SoundEffect.THUNDER, 0.2); // 20% volume
  };

  return (
    <button 
      onClick={handleClick}
      onMouseEnter={handleHover}
    >
      Click me
    </button>
  );
}
```

## Current Status

⚠️ **Placeholder files are currently in place.** Replace these with actual audio files before production deployment.
