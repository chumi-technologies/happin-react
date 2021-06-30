const colors = require('tailwindcss/colors');
module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.coolGray,
      blue: colors.blue,
      yellow: colors.yellow,
      rose: {
        50: '#ffecf0',
        100: '#ffd9e0',
        200: '#ffa1b2',
        300: '#fe6984',
        400: '#fe5674',
        500: '#fe4365',
        600: '#e53c5b',
        700: '#cb3651',
        800: '#98283d',
        900: '#4c141e'
      },
      teal: {
        50: '#e6f6f5',
        100: '#ccedeb',
        200: '#80d3cc',
        300: '#33b8ad',
        400: '#1aafa3',
        500: '#00a699',
        600: '#00958a',
        700: '#00857a',
        800: '#00645c',
        900: '#00322e'
      },
    },
    fontFamily: {
      sans: [
        'MDPrimer',
        '"PingFang SC"',
        '-apple-system',
        'BlinkMacSystemFont',
        'Arial',
        'sans-serif',
      ]
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
    preflight: false,
  },
  plugins: [],
}
