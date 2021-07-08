import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";
const colors = require("./colors");

import Button from "./components/button";
import Badge from "./components/badge";
import Input from "./components/input";
import Checkbox from "./components/checkbox";
import FormError from "./components/form";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        background: "transparent",
      },
    },
  },
  fonts: {
    heading:
      'proximanova, "Helvetica Neue", "PingFang SC", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    body: 'proximanova, "Helvetica Neue", "PingFang SC", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
  shadows: {
    outline: "none",
  },
  colors: {
    brandPink: {
      100: "#FE4365",
      500: "#FE4365",
    },
    brandBlue: {
      500: "#53B4FA",
      600: "#53B4FA",
    },
    highlight: {
      500: "#FFF846",
    },
    brandGrey: {
      200: "#222222", // used by BottomBar
      500: "#333333", // used by Buttons
      700: "#FFFFFFB3", // 70% transparency
    },
  },
  components: {
    Button,
    Badge,
    Input,
    FormError,
    Checkbox,
  },
  breakpoints: createBreakpoints({
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  }),
});

export default theme;
