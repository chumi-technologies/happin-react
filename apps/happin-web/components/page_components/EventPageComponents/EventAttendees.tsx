import React from 'react';
import Slider from 'react-slick';
import classnames from 'classnames';
import { Left, Right } from '@icon-park/react';
import { TopProfilesItem } from 'lib/model/event';

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
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      }
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
      }
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
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
const EventAttendees = ({ topProfiles }: {topProfiles: TopProfilesItem[]}) => {
  return (
    <>
      <div className="black-title text-xl sm:text-2xl font-semibold">Attendees</div>
      <div className="mt-3 sm:mt-5">
        <Slider {...settings}>
          {
            topProfiles.map(item => (
              <div key={item._id} style={{ width: 120 }}>
                <img className="w-full aspect-[11/16] object-cover rounded-lg"
                     src={item.photourl} alt={item.displayname}/>
                <div className="mt-1.5 text-sm font-semibold text-gray-100">{item.displayname}</div>
              </div>
            ))
          }
        </Slider>
      </div>
      <div className="mt-3 text-gray-400">
        <span className="mr-2">🔥</span><span className="text-gray-50">AmiliaW.</span> and other 132 people has joined
      </div>
    </>
  );
};

export default React.memo(EventAttendees);
