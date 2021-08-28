const colors = require('../colors');
const Checkbox = {
  baseStyle: {
    control: {
      border: '1px solid',
      borderRadius: 'full',
      borderColor: colors.gray['500'],
      // _checked: {
      //   bg: colors.gray['900'],
      //   borderColor: colors.gray['900'],
      //   _hover: {
      //     bg: colors.gray['900'],
      //     borderColor: colors.gray['900']
      //   }
      // }
    },
    label: {
      display: 'inline-flex'
    }
  },
  sizes: {
    md: {
      icon: {
        fontSize: '8px'
      }
    }
  }
};

export default Checkbox
