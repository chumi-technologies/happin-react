// const colors = require('tailwindcss/colors');
const colors = require('./theme/colors');
module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors,
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
  variants: {
    extend: {},
  },
  corePlugins: {
    container: false,
    preflight: false, // 已经用了chakra的reset
  },
  plugins: [],
}
