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
      blue: {
        50: '#e6f1fb',
        100: '#cde2f8',
        200: '#82b7ed',
        300: '#368ce2',
        400: '#1d7ddf',
        500: '#046fdb',
        600: '#0464c5',
        700: '#0359af',
        800: '#024383',
        900: '#012142'
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
        'Helvetica Neue',
        '-apple-system',
        'BlinkMacSystemFont',
        '"PingFang SC"',
        'Helvetica',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"'
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
  variants: {
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
