import { extendTheme } from '@chakra-ui/react';
import { createBreakpoints, getColor } from '@chakra-ui/theme-tools';
const colors = require('tailwindcss/colors');

const Button = {
  baseStyle: {
    fontWeight: 'medium'
  }
};

const Input = {
  sizes: {
    md: {
      field: {
        fontSize: "md",
        px: 4,
        h: 12,
        borderRadius: "lg"
      },
      addon: {
        fontSize: "md",
        px: 4,
        h: 12,
        borderRadius: "lg"
      }
    }
  },
  variants: {
    outline: {
      field: {
        _focus: {
          borderColor: colors.coolGray['900'],
          boxShadow: "0 0 0 1px " + colors.coolGray['900']
        }
      }
    }
  }
};
const FormError = {
  baseStyle: {
    text: {
      mt: 1
    }
  }
}

const breakpoints = createBreakpoints({
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
})

const theme = extendTheme({
  fonts: {
    heading: 'MDPrimer, \'PingFang SC\', Arial, sans-serif',
    body: 'MDPrimer, \'PingFang SC\', Arial, sans-serif'
  },
  shadows: {
    outline: 'none'
  },
  colors: {
    gray: colors.coolGray,
    blue: colors.blue,
    yellow: colors.yellow,
    red: {
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
  components: {
    Button,
    Input,
    FormError
  },
  breakpoints
});

export default theme;
