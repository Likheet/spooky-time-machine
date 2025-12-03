import { SoundEffect } from '../types';

/**
 * AudioManager Service
 * Manages audio playback, caching, and user preferences for sound effects
 */
class AudioManager {
  private audioCache: Map<SoundEffect, HTMLAudioElement> = new Map();
  private masterVolume: number = 0.3; // Default to 30% volume
  private isMuted: boolean = false;
  private isEnabled: boolean = true;

  constructor() {
    this.detectUserPreferences();
  }

  /**
   * Detect user preferences for reduced motion/audio
   */
  private detectUserPreferences(): void {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // If user prefers reduced motion, disable audio by default
    if (prefersReducedMotion) {
      this.isEnabled = false;
      this.isMuted = true;
    }

    // Check localStorage for saved preferences
    try {
      const savedMuteState = localStorage.getItem('audioMuted');
      if (savedMuteState !== null) {
        this.isMuted = savedMuteState === 'true';
      }

      const savedVolume = localStorage.getItem('audioVolume');
      if (savedVolume !== null) {
        this.masterVolume = parseFloat(savedVolume);
      }

      const savedEnabled = localStorage.getItem('audioEnabled');
      if (savedEnabled !== null) {
        this.isEnabled = savedEnabled === 'true';
      }
    } catch (e) {
      console.warn('LocalStorage access denied for audio preferences');
    }
  }

  /**
   * Preload all sound effects
   */
  async preloadSounds(): Promise<void> {
    const soundEffects = Object.values(SoundEffect);
    const loadPromises = soundEffects.map((soundId) =>
      this.loadSound(soundId as SoundEffect)
    );
    await Promise.all(loadPromises);
  }

  /**
   * Load a single sound effect
   */
  private async loadSound(soundId: SoundEffect): Promise<void> {
    return new Promise((resolve) => {
      const audio = new Audio(`/audio/${soundId}.mp3`);
      audio.preload = 'auto';

      audio.addEventListener('canplaythrough', () => {
        this.audioCache.set(soundId, audio);
        resolve();
      });

      audio.addEventListener('error', () => {
        // Just warn and resolve - don't block the app
        console.warn(`Audio file not available: ${soundId}`);
        resolve();
      });

      // Resolve after timeout to prevent blocking
      setTimeout(() => resolve(), 3000);
    });
  }

  /**
   * Play a sound effect
   */
  playSound(soundId: SoundEffect, volume?: number): void {
    // Don't play if audio is disabled or muted
    if (!this.isEnabled || this.isMuted) {
      return;
    }

    let audio = this.audioCache.get(soundId);

    // If not cached, create new audio element
    if (!audio) {
      audio = new Audio(`/audio/${soundId}.mp3`);
      this.audioCache.set(soundId, audio);
    }

    // Clone the audio element to allow overlapping sounds
    const audioClone = audio.cloneNode() as HTMLAudioElement;
    const effectiveVolume = volume !== undefined ? volume : this.masterVolume;
    audioClone.volume = Math.max(0, Math.min(1, effectiveVolume));

    // Play the sound
    audioClone.play().catch((error) => {
      console.warn(`Failed to play audio: ${soundId}`, error);
    });
  }

  /**
   * Stop a specific sound effect
   */
  stopSound(soundId: SoundEffect): void {
    const audio = this.audioCache.get(soundId);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  /**
   * Stop all currently playing sounds
   */
  stopAllSounds(): void {
    this.audioCache.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  /**
   * Set master volume (0.0 to 1.0)
   */
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    try {
      localStorage.setItem('audioVolume', this.masterVolume.toString());
    } catch (e) {
      // Ignore error
    }
  }

  /**
   * Get current master volume
   */
  getMasterVolume(): number {
    return this.masterVolume;
  }

  /**
   * Toggle mute state
   */
  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('audioMuted', this.isMuted.toString());
    } catch (e) {
      // Ignore error
    }
    return this.isMuted;
  }

  /**
   * Get current mute state
   */
  isMutedState(): boolean {
    return this.isMuted;
  }

  /**
   * Enable or disable audio system
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    try {
      localStorage.setItem('audioEnabled', enabled.toString());
    } catch (e) {
      // Ignore error
    }
    if (!enabled) {
      this.stopAllSounds();
    }
  }

  /**
   * Check if audio is enabled
   */
  isAudioEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Clear audio cache
   */
  clearCache(): void {
    this.stopAllSounds();
    this.audioCache.clear();
  }
}

// Export singleton instance
export const audioManager = new AudioManager();
export default audioManager;
