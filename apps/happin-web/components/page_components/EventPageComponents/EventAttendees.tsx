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
  slidesToShow: 5,
  slidesToScroll: 5,
  draggable: true,
  variableWidth: true,
  responsive: [
    {
      breakpoint: 1350,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
      }
    },
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
      <div className="black-title text-xl sm:text-2xl font-semibold">Who joined the event community</div>
      <div className="mt-3 sm:mt-5">
        <Slider {...settings}>
          {
            topProfiles.map(item => (
              <div key={item._id} style={{ width: 120 }}>
                <div className="relative w-full aspect-w-11 aspect-h-16">
                  <img className="w-full h-full object-cover rounded-lg"
                       src={item.photourl} alt={item.displayname}/>
                </div>
                <div className="mt-1.5 text-sm font-semibold text-gray-100">{item.displayname}</div>
              </div>
            ))
          }
        </Slider>
      </div>
      {topProfiles.length > 0 &&
        <div className="mt-3 text-gray-400">
          <span className="mr-2">🔥</span>Download app and match with other like-minded people from the same event.
        </div>
      }
    </>
  );
};

export default React.memo(EventAttendees);
