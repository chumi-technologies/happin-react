const colors = require('../colors');
const Input = {
  sizes: {
    md: {
      field: {
        fontSize: 'md',
        px: 4,
        h: 12,
        borderRadius: 'lg'
      },
      addon: {
        fontSize: 'md',
        px: 4,
        h: 12,
        borderRadius: 'lg'
      }
    }
  },
  variants: {
    outline: {
      field: {
        _focus: {
          borderColor: colors.gray['900'],
          boxShadow: '0 0 0 1px ' + colors.gray['900']
        }
      }
    }
  }
};

export default Input
