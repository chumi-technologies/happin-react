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
      '"Helvetica Neue", "PingFang SC", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    body: '"Helvetica Neue", "PingFang SC", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
  textStyles: {
    sectionTitle: {
      mt: { base: "24px", sm: "40px" },
      fontSize: { base: "md", sm: "xl" },
      fontWeight: { base: "700", sm: "400" },
    },
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
      200: "#222222", // used by BottomBar, PopUpModal
      500: "#333333", // used by Buttons, PopUpOverlay
      700: "#FFFFFFB3", // 70% transparency
    },
    brandBlack: {
      500: "#000000", // used by Buttons
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
