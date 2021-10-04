import React from 'react';
import { Link } from 'react-scroll';

export type MyEventProps = {
  upcomingTickets: any[];
  pastTickets: any[];
  savedTickets: any[];
}

const MyEventsHead = ({ upcomingTickets,pastTickets,savedTickets }: MyEventProps) => {
  return (
    <div className="relative bg-gray-800 border-b border-solid border-gray-700">
      <div className="container">
        <div className="font-bold text-xl sm:text-2xl mt-3">My Events</div>
        <div className="flex">
          {upcomingTickets && upcomingTickets.length>0 &&<Link
            className="my-events__head-tab"
            activeClass="active"
            containerId="my-events-scroll-body"
            to="upcoming"
            name="myScrollToElement"
            spy={true}
            smooth={true}
            offset={-20}
            duration={500}
          >
            Upcoming
          </Link>}
          {pastTickets && pastTickets.length>0 && <Link
            className="my-events__head-tab"
            activeClass="active"
            containerId="my-events-scroll-body"
            to="past"
            spy={true}
            smooth={true}
            offset={-20}
            duration={500}
          >
            Past
          </Link>}
          {savedTickets && savedTickets.length>0 && <Link
            className="my-events__head-tab"
            activeClass="active"
            containerId="my-events-scroll-body"
            to="saved"
            spy={true}
            smooth={true}
            offset={-20}
            duration={500}
          >
            Saved
          </Link>}
        </div>
      </div>
    </div>
  );
};

export default MyEventsHead;
