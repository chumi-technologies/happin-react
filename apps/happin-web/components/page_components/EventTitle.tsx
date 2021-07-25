import {
  HStack,
  VStack,
} from '@chakra-ui/react';

import SvgIcon from '@components/SvgIcon';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-scroll';
import classNames from 'classnames';

function useResize() {
  const [width, setWidth] = useState<number>(0);
  const onResize = useCallback(() => {
    return setWidth(document.documentElement.clientWidth);
  }, []);
  useEffect(() => {
    if (width === 0) {
      setWidth(document.documentElement.clientWidth);
    }
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize, width]);
  return width;
}

const EventTitle = ({ setIsModalOpen }: any) => {
  const windowWidth = useResize();
  console.log(windowWidth);
  const parentID = windowWidth > 1024 ? 'scroll-inner-body' : 'scroll-body'
  const [firstActive, setFirstActive] = useState(true)
  return (
    <>
      {/* Badges */}
      <HStack spacing={3}>
        <div className="py-1 px-2 leading-none border-2 border-yellow-500 border-solid text-yellow-500 rounded text-xs sm:text-sm font-semibold">Music Concert</div>
        <div className="inline-flex items-center py-1 px-2 leading-none text-white bg-rose-500 border-2 border-rose-500 border-solid rounded text-xs sm:text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-white mr-2" />
          <span>LIVE</span>
        </div>
      </HStack>

      {/* Event Title */}
      <h1 className="black-title text-xl sm:text-3xl md:text-4xl text-white mt-4 sm:mt-6 font-bold lg:pr-10">American Express UNSTAGED with Maroon 5- The Encore</h1>

      {/* Event Date and Time */}
      <h1 className="black-title text-base sm:text-xl text-yellow-500 mt-1 sm:mt-3 font-bold">Fri, July 2・11 PM CST</h1>

      {/* Block with Icons */}

      <VStack
        spacing={4}
        align="start"
        className="mt-8"
      >
        <div className="flex items-start w-full">
          <SvgIcon id="clock" className="text-lg text-white" />
          <div className="ml-3 flex-1">
            <div className="text-white leading-none mb-1">Date & Time</div>
            <div className="flex items-start sm:items-center flex-col sm:flex-row text-gray-400">
              <div className="flex-1 mr-2 text-sm mb-2 sm:mb-0">Fri, July 2・11 PM - Sat, July 3・2 AM CST (180 mins)</div>
              <button className="btn btn-xs btn-outline-blue"
                      onClick={() => setIsModalOpen(true)}>See More Dates
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-start w-full">
          <SvgIcon id="location" className="text-lg text-white" />
          <div className="ml-3">
            <div className="text-white leading-none mb-1">The Bowery Club</div>
            <div className="text-gray-400 text-sm">
              127 East 23rd Street New York, NY, USA
            </div>
          </div>
        </div>
        <div className="flex items-center w-full">
          <SvgIcon id="livestream" className="text-lg text-white" />
          <div className="ml-3 text-white">Livestream</div>
        </div>
        <div className="flex items-start sm:items-center w-full">
          <SvgIcon id="ticket" className="text-lg text-white" />
          <div className="flex items-start sm:items-center flex-col sm:flex-row w-full ml-3">
            <div className="flex-1 text-white mb-3 sm:mb-0 leading-none">Price from $30.00</div>
            <button className="btn btn-xs btn-outline-blue">Redeem Ticket</button>
          </div>
        </div>
      </VStack>

      {/* About and Agenda links */}
      <div className="sticky top-0 bg-black z-10">
        <div className="flex w-full mt-8 sm:mt-14 p-1 border border-solid border-gray-600 rounded-full">
          <Link
            className={classNames('event-details__tab', { 'first-active': firstActive })}
            activeClass="active"
            containerId="scroll-body"
            to="about"
            spy={true}
            smooth={true}
            offset={-48}
            duration={500}
            onSetActive={() => {
              setFirstActive(true)
            }}
          >
            About
          </Link>
          <Link
            className="event-details__tab"
            activeClass="active"
            containerId="scroll-body"
            to="agenda"
            spy={true}
            smooth={true}
            offset={-48}
            duration={500}
            onSetActive={() => {
              setFirstActive(false)
            }}
          >
            Agenda
          </Link>
        </div>
      </div>
    </>
  );
};

export default EventTitle;
