import { Image, ButtonGroup, Button, Grid, Divider } from "@chakra-ui/react";

import GroupEventCard from "./GroupEventCard";
import { Link } from 'react-scroll';
import classNames from 'classnames';
import SvgIcon from '@components/SvgIcon';
import { GroupEvent } from "lib/model/groupEvent";

type EventDatesProp = {
  groupEvents?: GroupEvent[];
}

const EventDates = ({ groupEvents = [] } : EventDatesProp) => {
  return (
    <>
      {/* List and Calendar Toggle */}
      <div className="flex w-full mb-2 sm:mb-3 mt-3 sm:mt-4 p-1 border border-solid border-gray-600 rounded-full">
        <div className="event-details__tab active">
          <SvgIcon id="list" className="text-2xl" />
        </div>
        <div className="event-details__tab">
          <SvgIcon id="calendar" className="text-2xl" />
        </div>
      </div>

      {/* Grid with available dates */}
      <div className="flex-1 overflow-y-auto web-scroll -mr-4 pr-4 sm:-mr-5 sm:pr-3 grid grid-cols-1 divide-y divide-gray-600">
        {groupEvents.map((groupEvent: GroupEvent, index: Number) => {
          return <GroupEventCard key={index} groupEvent={groupEvent} />
        })}
      </div>
    </>
  );
};

export default EventDates;
