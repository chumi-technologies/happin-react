import React from 'react';

const SvgIcon = (props: any) => {
  const {
    width = '1em',
    height = '1em',
    id,
    ...rest
  } = props
  return (
    <svg width={width} height={height} {...rest}>
      <use xlinkHref={`/icons/sprites.svg#${id}`} />
    </svg>
  );
};
export default SvgIcon;
