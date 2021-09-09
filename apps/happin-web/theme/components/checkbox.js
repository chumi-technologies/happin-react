const colors = require('../colors');
const Checkbox = {
  baseStyle: {
    control: {
      borderRadius: 'full',
      borderColor: colors.gray['500'],
      color: colors.gray['800'],
      _checked: {
        color: colors.gray['800']
        // bg: colors.gray['900'],
        // borderColor: colors.gray['900'],
        // _hover: {
        //   bg: colors.gray['900'],
        //   borderColor: colors.gray['900']
        // }
      }
    },
    label: {
      lineHeight: '1',
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
