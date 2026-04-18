// Tailwind design system — no default colors exposed.
// All character palette colors are injected as inline styles from CharacterConfig.
// Only structural tokens live here.
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    // Wipe default color palette — all color comes from character configs
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
    },
    extend: {
      // Letter spacing for the nav and section labels
      letterSpacing: {
        widest: '0.2em',
      },
      // Type scale — characters will add their own fonts via next/font
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      // Transition durations
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [],
};

export default config;
