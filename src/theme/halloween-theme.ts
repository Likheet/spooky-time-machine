/**
 * Halloween Theme Configuration
 * Centralized theme constants for the Time Travel Explorer
 */

export const HalloweenTheme = {
  colors: {
    primary: {
      blackDeep: '#0a0a0a',
      blackShadow: '#1a1a1a',
    },
    accent: {
      redBlood: '#8b0000',
      redCrimson: '#dc143c',
    },
    highlight: {
      greenPhosphor: '#39ff14',
      greenNeon: '#00ff41',
    },
    secondary: {
      purpleDark: '#2d1b3d',
      purpleMedium: '#4a2c5e',
    },
    texture: {
      grayStone: '#3a3a3a',
      grayLight: '#5a5a5a',
    },
    effects: {
      redGlow: 'rgba(220, 20, 60, 0.3)',
      greenGlow: 'rgba(57, 255, 20, 0.3)',
      fog: 'rgba(255, 255, 255, 0.05)',
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  transitions: {
    fast: '0.15s ease',
    normal: '0.25s ease',
    slow: '0.4s ease',
  },
  shadows: {
    glowRed: '0 0 20px rgba(220, 20, 60, 0.3)',
    glowGreen: '0 0 20px rgba(57, 255, 20, 0.3)',
    deep: '0 4px 20px rgba(0, 0, 0, 0.8)',
  },
  animations: {
    flicker: 'flicker 2s infinite',
    pulse: 'pulse 2s ease-in-out infinite',
    float: 'float 3s ease-in-out infinite',
  },
} as const;

export type HalloweenThemeType = typeof HalloweenTheme;
