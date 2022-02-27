import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import classnames from 'classnames';
import { Left, Right } from '@icon-park/react';

function Arrow(props: any) {
  const { className, onClick, children } = props;
  return (
    <div
      className={classnames(className, 'event-details__slick-control')}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
const settings = {
  className: 'event-details__slick',
  dots: false,
  infinite: false,
  slidesToShow: 4,
  slidesToScroll: 4,
  draggable: true,
  variableWidth: true,
  responsive: [
    {
      breakpoint: 1350,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      }
    },
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      }
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      }
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      }
    }
  ],
  nextArrow: <Arrow><Right className="ml-1.5" theme="outline" size="20" fill="currentColor" /></Arrow>,
  prevArrow: <Arrow><Left className="mr-1.5" theme="outline" size="20" fill="currentColor" /></Arrow>,
};
export type galleryItemProp = {
  id: string;
  src: string;
}
const EventGallery = ({ gallery, limit = 4 }: { gallery: galleryItemProp[], limit?: number }) => {
  const [galleryList, setGalleryList] = useState<galleryItemProp[][]>([]);

  useEffect(() => {
    // gallery图片数量大于等于4张的时候显示效果更好
    if (gallery.length >= limit) {
      // 一位数组转二维数组（结构为1,2,1,2）
      const data = gallery.reduce((prev, cur, index, arr) => {
        if (index % 3 === 0) {
          prev.push([cur])
          if (arr.length - 1 !== index) {
            prev.push([])
          }
        } else {
          prev[prev.length - 1].push(cur)
        }
        return prev
      }, [] as galleryItemProp[][])
      console.log(data);
      setGalleryList(data)
    }
  }, [gallery]);

  return (
    <>
      <div className="black-title text-xl sm:text-2xl font-semibold">Gallery</div>
      <div className="mt-3 sm:mt-5">
        <Slider {...settings}>
          {
            gallery.length >= limit ?
              galleryList.map((item, index) => (
                <div key={index} className="aspect-w-11 aspect-h-16" style={{ width: 150 }}>
                  <div className="flex flex-col space-y-3 w-full h-full">
                    {
                      item.map(img => (
                        <img key={img.id} className="flex-1 w-full h-full object-cover rounded-lg"
                             src={img.src} alt=""/>
                      ))
                    }
                  </div>
                </div>
              )) :
              gallery.map((item, index) => (
                <div key={item.id} style={{ width: 150 }}>
                  <div className="relative w-full aspect-w-11 aspect-h-16">
                    <img key={item.id} className="w-full h-full object-cover rounded-lg"
                         src={item.src} alt=""/>
                  </div>
                </div>
              ))
          }
        </Slider>
      </div>
    </>
  );
};

export default React.memo(EventGallery);
