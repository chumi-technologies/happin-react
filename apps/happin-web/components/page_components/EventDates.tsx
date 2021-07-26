import { Image, ButtonGroup, Button, Grid, Divider } from "@chakra-ui/react";

import TableDates from "./TableDates";
import { Link } from 'react-scroll';
import classNames from 'classnames';
import SvgIcon from '@components/SvgIcon';

const EventDates = () => {
  const dates = [
    {
      date: "Fri, July 2・11 PM CST",
      price: "From $30",
      type: "Public Show / VIP Meeeting / Merch",
      buttonText: "Get Tickets",
      isDisabled: false,
    },
    {
      date: "Fri, July 2・11 PM CST",
      price: "From $30",
      type: "Public Show",
      buttonText: "Get Tickets",
      isDisabled: false,
    },
    {
      date: "Fri, July 2・11 PM CST",
      price: "From $30",
      type: "Public Show / VIP Meeeting / Merch",
      buttonText: "Get Tickets",
      isDisabled: false,
    },
    {
      date: "Fri, July 2・11 PM CST",
      price: "Sold Out",
      type: "Public Show / VIP Meeeting / Merch",
      buttonText: "Sold Out",
      isDisabled: true,
    },
    {
      date: "Fri, July 2・11 PM CST",
      price: "From $30",
      type: "Public Show / VIP Meeeting / Merch",
      buttonText: "Get Tickets",
      isDisabled: false,
    },
    {
      date: "Fri, July 2・11 PM CST",
      price: "From $30",
      type: "Public Show / VIP Meeeting / Merch",
      buttonText: "Get Tickets",
      isDisabled: false,
    },
    {
      date: "Fri, July 2・11 PM CST",
      price: "From $30",
      type: "Public Show / VIP Meeeting / Merch",
      buttonText: "Get Tickets",
      isDisabled: false,
    },
    {
      date: "Fri, July 2・11 PM CST",
      price: "From $30",
      type: "Public Show / VIP Meeeting / Merch",
      buttonText: "Get Tickets",
      isDisabled: false,
    },
  ];

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
        {dates.map((date: any, index: Number) => {
          return <TableDates key={index} date={date} />
        })}
      </div>
    </>
  );
};

export default EventDates;
