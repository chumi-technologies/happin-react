import { extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';
const colors = require('./colors');

import Button from "./components/button"
import Input from "./components/input"
import Checkbox from "./components/checkbox"
import FormError from "./components/form"

const theme = extendTheme({
  styles: {
    global: {
      body: {
        background: 'transparent'
      }
    }
  },
  fonts: {
    heading: '"Helvetica Neue", "PingFang SC", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    body: '"Helvetica Neue", "PingFang SC", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
  },
  shadows: {
    outline: 'none'
  },
  colors,
  components: {
    Button,
    Input,
    FormError,
    Checkbox
  },
  breakpoints: createBreakpoints({
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  })
});

export default theme;
