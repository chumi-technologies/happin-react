import React, { Fragment, useEffect, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CloseSmall, Left, Right } from '@icon-park/react';
import classNames from 'classnames';
import Slider from 'react-slick';
import Lightbox, { ImagesListType } from 'react-spring-lightbox';

type SelectProps = {
  data: SelectItemProps[];
  onChange?: (data: any) => void;
  defaultValue?: string | number | SelectItemProps;
  disabled?: boolean;
}
type SelectItemProps = {
  value: string | number;
  label: string | number;
  disabled?: boolean;
};

function Arrow(props: any) {
  const { className, onClick, children } = props;
  return (
    <div
      className={className}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
function NextArrow(props: any) {
  const { className, onClick } = props;
  return (
    <div
      className={className}
      onClick={onClick}
    >
      <Right theme="outline" size="14" fill="currentColor" />
    </div>
  );
}

function PrevArrow(props: any) {
  const { className, onClick } = props;
  return (
    <div
      className={className}
      onClick={onClick}
    >
      <Left theme="outline" size="14" fill="currentColor" />
    </div>
  );
}

export default function Merch() {
  const [currentImageIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    draggable: false,
    nextArrow: <Arrow><Right theme="outline" size="14" fill="currentColor" /></Arrow>,
    prevArrow: <Arrow><Left theme="outline" size="14" fill="currentColor" /></Arrow>,
    customPaging: () => <div className="slides-dot-item" />
  };
  const imgList: ImagesListType = [
    {
      src: 'https://cdn.sspai.com/editor/u_/c49hkn5b34tdfon49s2g.jpeg?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1',
      alt: 'img-01'
    },
    {
      src: 'https://cdn.sspai.com/2021/06/20/9a852c3a26e00530fd867ec10bd1d97a.jpg?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1',
      alt: 'img-02'
    },
    {
      src: 'https://cdn.sspai.com/2021/06/27/d9c675f539aa34caa7783f149eb06705.jpg?imageView2/2/w/1120/q/90/interlace/1/ignore-error/1',
      alt: 'img-03'
    }
  ];
  const gotoPrevious = () =>
    currentImageIndex > 0 && setCurrentIndex(currentImageIndex - 1);

  const gotoNext = () =>
    currentImageIndex + 1 < imgList.length && setCurrentIndex(currentImageIndex + 1);
  const closeLightbox = () => setLightboxOpen(false);
  return (
    <>
      <Slider {...settings}>
        {
          imgList.map((item, index) => (
            <div className="w-40 h-40 rounded-md overflow-hidden" key={index} onClick={() => {
              setCurrentIndex(index);
              setLightboxOpen(true);
            }}>
              <img className="w-full h-full object-cover" src={item.src} alt={item.alt} />
            </div>
          ))
        }
      </Slider>
      <Lightbox
        isOpen={lightboxOpen}
        onPrev={gotoPrevious}
        onNext={gotoNext}
        images={imgList}
        currentIndex={currentImageIndex}
        onClose={closeLightbox}
        className="bg-black bg-opacity-70"
        renderHeader={() => (
          <div className="flex items-center justify-center absolute top-3 right-3 w-10 h-10 rounded-full hover:bg-gray-700 hover:text-white transition cursor-pointer text-gray-300 z-10 hover:bg-opacity-75" onClick={closeLightbox}>
            <CloseSmall theme="outline" size="24" fill="currentColor" strokeWidth={3}/>
          </div>
        )}
        renderPrevButton={() => (
          <div className={classNames('goto-btn prev', { disabled: currentImageIndex === 0 })} onClick={gotoPrevious}>
            <Left theme="outline" size="24" fill="currentColor" />
          </div>
        )}
        renderNextButton={() => (
          <div className={classNames('goto-btn next', { disabled: currentImageIndex === imgList.length - 1  })} onClick={gotoNext}>
            <Right theme="outline" size="24" fill="currentColor" />
          </div>
        )}
      />
    </>

  );
}
