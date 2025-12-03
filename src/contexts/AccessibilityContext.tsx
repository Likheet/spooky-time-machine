import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AccessibilitySettings {
  reducedMotion: boolean;
  audioEnabled: boolean;
  setReducedMotion: (enabled: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilitySettings | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotionState] = useState<boolean>(() => {
    // Check user preference from localStorage
    const saved = localStorage.getItem('accessibility-reduced-motion');
    if (saved !== null) {
      return saved === 'true';
    }
    // Check system preference
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [audioEnabled, setAudioEnabledState] = useState<boolean>(() => {
    // Check user preference from localStorage
    const saved = localStorage.getItem('accessibility-audio-enabled');
    if (saved !== null) {
      return saved === 'true';
    }
    // Default to enabled
    return true;
  });

  // Apply reduced motion class to body
  useEffect(() => {
    if (reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
  }, [reducedMotion]);

  const setReducedMotion = (enabled: boolean) => {
    setReducedMotionState(enabled);
    localStorage.setItem('accessibility-reduced-motion', String(enabled));
  };

  const setAudioEnabled = (enabled: boolean) => {
    setAudioEnabledState(enabled);
    localStorage.setItem('accessibility-audio-enabled', String(enabled));
  };

  return (
    <AccessibilityContext.Provider
      value={{
        reducedMotion,
        audioEnabled,
        setReducedMotion,
        setAudioEnabled,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
