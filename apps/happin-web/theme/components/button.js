import { mode } from '@chakra-ui/theme-tools';

const accessibleColorMap = {
  yellow: {
    bg: 'yellow.500',
    color: 'black',
    hoverBg: 'yellow.600',
    activeBg: 'yellow.700'
  },
  cyan: {
    bg: 'cyan.500',
    color: 'black',
    hoverBg: 'cyan.600',
    activeBg: 'cyan.700'
  }
};

function variantSolid(props) {
  const {
    colorScheme: c
  } = props;

  if (c === "gray") {
    const _bg = mode("gray.100", "whiteAlpha.200")(props);

    return {
      bg: _bg,
      _hover: {
        bg: mode("gray.200", "whiteAlpha.300")(props),
        _disabled: {
          bg: _bg
        }
      },
      _active: {
        bg: mode("gray.300", "whiteAlpha.400")(props)
      }
    };
  }

  const {
    bg = c + ".500",
    color = "white",
    hoverBg = c + ".600",
    activeBg = c + ".700"
  } = accessibleColorMap[c] || {};
  const background = mode(bg, c + ".200")(props);
  return {
    bg: background,
    color: mode(color, "gray.800")(props),
    _hover: {
      bg: mode(hoverBg, c + ".300")(props),
      _disabled: {
        bg: background
      }
    },
    _active: {
      bg: mode(activeBg, c + ".400")(props)
    }
  };
}
const Button = {
  baseStyle: {
    lineHeight: '1',
    fontWeight: 'medium'
  },
  variants: {
    solid: variantSolid,
    // solid: (props) => ({
    //   bg: props.colorScheme === 'yellow' ? 'yellow.500' : props.background,
    //   _hover: {
    //     bg: mode(props.colorScheme === 'yellow' ? 'yellow.600' : props.background, props.colorScheme + ".300")(props),
    //   },
    //   _active: {
    //     bg: mode(props.colorScheme === 'yellow' ? 'yellow.700' : props.background, props.colorScheme + ".400")(props)
    //   }
    // }),
  }
};

export default Button
