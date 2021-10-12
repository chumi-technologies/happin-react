const colors = require('../colors');
const Radio = {
  baseStyle: {
    label: {
      lineHeight: '1'
    },
    control: {
      borderColor: colors.gray['500'],
      _checked: {
        color: colors.gray['800']
      }
    },
  },
};

export default Radio
