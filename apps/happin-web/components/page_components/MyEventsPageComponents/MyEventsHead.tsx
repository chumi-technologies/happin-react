import React from 'react';
import { Link } from 'react-scroll';

const MyEventsHead = () => {
  return (
    <div className="relative bg-gray-800 border-b border-solid border-gray-700">
      <div className="container">
        <div className="font-bold text-2xl mt-3">My Events</div>
        <div className="flex">
          <Link
            className="my-events__head-tab"
            activeClass="active"
            containerId="my-events-scroll-body"
            to="upcoming"
            name="myScrollToElement"
            spy={true}
            smooth={true}
            // offset={windowWidth > 640 ? -56 : -44}
            duration={500}
          >
            Upcoming
          </Link>
          <Link
            className="my-events__head-tab"
            activeClass="active"
            containerId="my-events-scroll-body"
            to="past"
            spy={true}
            smooth={true}
            // offset={windowWidth > 640 ? -56 : -44}
            duration={500}
          >
            Past
          </Link>
          <Link
            className="my-events__head-tab"
            activeClass="active"
            containerId="my-events-scroll-body"
            to="saved"
            spy={true}
            smooth={true}
            // offset={windowWidth > 640 ? -56 : -44}
            duration={500}
          >
            Saved
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyEventsHead;
