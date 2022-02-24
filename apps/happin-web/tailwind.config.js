// const colors = require('tailwindcss/colors');
const colors = require('./theme/colors');
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors,
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      tiny: ['0.8125rem', { lineHeight: '1.15rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }],
      '7xl': ['4.5rem', { lineHeight: '1' }],
      '8xl': ['6rem', { lineHeight: '1' }],
      '9xl': ['8rem', { lineHeight: '1' }],
    },
    transitionDuration: {
      DEFAULT: '200ms',
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms'
    },
    zIndex: {
      '0': 0,
     '10': 10,
     '20': 20,
     '30': 30,
     '40': 40,
     '50': 50,
     '100': 100,
      'auto': 'auto',
    },
    screens: {
      sm: '640px',
      // @media (min-width: 640px) {}
      md: '768px',
      // @media (min-width: 768px) {}
      lg: '1024px',
      // @media (min-width: 1024px) {}
      xl: '1280px'
      // @media (min-width: 1280px) {}
    },
    extend: {},
  },
  corePlugins: {
    container: false,
    preflight: false, // 已经用了chakra的reset
  },
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
}
