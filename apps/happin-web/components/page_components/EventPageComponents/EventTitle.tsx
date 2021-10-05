import {
  HStack,
  VStack
} from '@chakra-ui/react';

import SvgIcon from '@components/SvgIcon';
import { useEffect } from 'react';
import moment from 'moment-timezone';
import { LocationInfo } from "lib/model/event";
import { GroupEvent } from 'lib/model/groupEvent';
import { useUserState } from 'contexts/user-state';
import { useSSOState } from 'contexts/sso-state';
import classnames from 'classnames';

type EventTitleProps = {
  setIsModalOpen: (arg0: boolean) => void;
  eventTitle?: string;
  isLiveStream?: boolean;
  eventStartDate?: Date;
  eventEndDate?: Date;
  price?: number;
  groupEvents?: GroupEvent[];
  location?: LocationInfo;
  playbackStart: boolean;
  category?: string;
  categoryType?: string;
  setIsRedeemModalOpen: (arg0: boolean) => void;
}

const EventTitle = ({ setIsModalOpen, setIsRedeemModalOpen, category, categoryType, eventTitle, playbackStart = false, isLiveStream = false, eventStartDate, eventEndDate, price, location, groupEvents = [] }: EventTitleProps) => {
  // const [firstActive, setFirstActive] = useState(true)
  const { user } = useUserState();
  const { dimmed, showSSO } = useSSOState();
  const isLiveNow = moment().isBetween(moment(eventStartDate), moment(eventEndDate))

  useEffect(() => {
    if (dimmed) {
      document.body.classList.add("body-overflow-hidden");
    } else {
      document.body.classList.remove("body-overflow-hidden");
    }
  }, [dimmed])


  const openRedeemModal = () => {
    if (!user) {
      showSSO();
      return
    }
    setIsRedeemModalOpen(true);
  }

  return (
    <>
      {/* Badges */}
      <HStack spacing={3}>
        {(isLiveStream && (isLiveNow || playbackStart)) && (
          <div className="inline-flex items-center py-1 px-2 leading-none text-white bg-rose-500 border-2 border-rose-500 border-solid rounded text-xs sm:text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-white mr-2" />
            <span>{isLiveNow ? 'LIVE' : (playbackStart ? 'Replay' : '')}</span>
          </div>
        )}

        {(category && categoryType) && <>
          <div className="py-1 px-2 leading-none border-2 border-yellow-500 border-solid text-yellow-500 rounded text-xs sm:text-sm font-semibold">
            {categoryType + ' - ' + category}
          </div>
        </>}
      </HStack>

      {/* Event Title */}
      <h1 className={classnames('black-title text-xl sm:text-3xl md:text-4xl text-white font-bold lg:pr-10', {
        'mt-1 sm:mt-4': category || categoryType || isLiveNow || playbackStart
      })}>
        {eventTitle}
      </h1>

      {/* Event Date and Time */}
      {!playbackStart &&
        <h1 className="black-title text-base sm:text-xl text-yellow-500 mt-1 sm:mt-3 font-bold">
          {moment.utc(eventStartDate).tz(moment.tz.guess()).format('ddd MMM D ・ H:mm A z')}
        </h1>
      }


      {/* Block with Icons */}

      <VStack
        spacing={4}
        align="start"
        mt={{ base: 5, sm: 8 }}
      >
        {!playbackStart &&
          <div className="flex items-start w-full">
            <SvgIcon id="clock" className="text-lg text-white" />
            <div className="ml-3 flex-1">
              <div className="text-white leading-none mb-1">Date & Time</div>
              <div className="flex items-start sm:items-center flex-col sm:flex-row text-gray-400">
                <div className="flex-1 mr-2 text-sm mb-2 sm:mb-0">
                  {`${moment.utc(eventStartDate).tz(moment.tz.guess()).format('ddd MMM D ・ H:mm A')} - ${moment.utc(eventEndDate).tz(moment.tz.guess()).format('ddd MMM D ・ H:mm A z')} (${moment.duration(moment(eventEndDate).diff(moment(eventStartDate))).asMinutes()} mins)`}
                </div>
                {(groupEvents || []).length > 0 && (
                  <button
                    className="btn btn-xs btn-outline-blue"
                    onClick={() => setIsModalOpen(true)}>
                    See More Dates
                  </button>
                )}
              </div>
            </div>
          </div>}
        <div className="flex items-start w-full">
          <SvgIcon id="location" className="text-lg text-white" />
          <div className="ml-3">
            <div className="text-white leading-none mb-1">
              {isLiveStream ? (`Happin Livestream${(location?.eventType === "hybrid" && location?.venueName) ? ` / ${location?.venueName}` : ""}`) : (location?.venueName)}
            </div>
            <div className="text-gray-400 text-sm">
              {location?.location !== "happin.app" && (location?.location)}
            </div>
          </div>
        </div>
        {(isLiveStream && !playbackStart) && <div className="flex items-center w-full">
          <SvgIcon id="livestream" className="text-lg text-white" />
          <div className="ml-3 text-white">Livestream</div>
        </div>}

        <div className="flex items-start sm:items-center w-full">
          <SvgIcon id="ticket" className="text-lg text-white" />
          <div className="flex items-start sm:items-center flex-col sm:flex-row w-full ml-3">
            <div className="flex-1 text-white mb-3 sm:mb-0 leading-none">{(price !== null && price !== undefined) && `Price from $${(price / 100).toFixed(2)}`}</div>
            {/* not showing redeem when it's offline event  */}
            {isLiveStream && <button className="btn btn-xs btn-outline-blue" onClick={openRedeemModal} >Redeem Ticket</button>}
          </div>
        </div>
      </VStack>

      {/* About and Agenda links */}
      {/* <div className="sticky top-0 bg-black z-10">
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
      </div> */}
    </>
  );
};

export default EventTitle;
