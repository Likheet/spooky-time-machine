import { useCallback } from 'react';
import audioManager from '../services/AudioManager';
import { SoundEffect } from '../types';

/**
 * Custom hook for audio integration
 * Provides easy access to audio playback in components
 */
export const useAudio = () => {
  const playSound = useCallback((soundId: SoundEffect, volume?: number) => {
    audioManager.playSound(soundId, volume);
  }, []);

  const stopSound = useCallback((soundId: SoundEffect) => {
    audioManager.stopSound(soundId);
  }, []);

  const stopAllSounds = useCallback(() => {
    audioManager.stopAllSounds();
  }, []);

  const toggleMute = useCallback(() => {
    return audioManager.toggleMute();
  }, []);

  const setVolume = useCallback((volume: number) => {
    audioManager.setMasterVolume(volume);
  }, []);

  return {
    playSound,
    stopSound,
    stopAllSounds,
    toggleMute,
    setVolume,
    SoundEffect,
  };
};

export default useAudio;
