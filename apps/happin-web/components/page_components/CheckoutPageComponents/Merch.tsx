import React, { useState } from 'react';
import { CloseSmall, Left, Right } from '@icon-park/react';
import classNames from 'classnames';
import Slider from 'react-slick';
import Lightbox, { ImagesListType } from 'react-spring-lightbox';

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

export default function Merch({ imgList }: { imgList: ImagesListType }) {
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
    customPaging: function paging(){ return <div className="slides-dot-item" />},
  };

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
            <div className="w-32 h-32 sm:w-40 sm:h-40 cursor-pointer rounded-md overflow-hidden" key={index} onClick={() => {
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
