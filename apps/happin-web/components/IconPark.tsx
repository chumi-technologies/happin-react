import React from 'react';
import Script from 'next/script';

type IconParkProps = {
  'icon-id'?: string;
  name:
    | 'international'
    | 'down-two'
    | 'down-two-thin'
    | 'hamburger-button'
    | 'more'
    | 'search'
    | 'delete'
    | 'left'
    | 'check'
    | 'right'
    | 'like'
    | 'share-two'
    | 'share-two-thin'
    | 'play-one'
    | 'grinning-face-with-open-mouth'
    | 'minus'
    | 'plus'
    | 'down'
    | 'arrow-right'
    | 'help'
    | 'lightning'
    | 'lightning-filled'
    | 'stopwatch'
    | 'switch'
    | 'cosmetic-brush'
    | 'up'
    | 'close-small'
    | 'close-small-thin'
    | 'like-filled'
    | 'like-thin';
  size?: string | number;
  width?: string;
  height?: string;
  color?: string;
  stroke?: string;
  fill?: string;
  rtl?: string;
  spin?: string;
  className?: string;
  style?: CSSStyleDeclaration;
};
const IconPark = (props: IconParkProps) => {
  const { name, color = 'currentColor' } = props;
  return (
    <>
      <Script src="https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/icons_20083_30.1d1880ee88baa8e3524e2b4e64e9b863.js" />
      {/*// @ts-ignore*/}
      <iconpark-icon {...props} name={name} color={color} />
    </>
  );
};
export default IconPark;
