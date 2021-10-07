import EventTitle from "./EventTitle";
import EventDescription from "./EventDescription";
// import EventLineUp from "./EventLineUp";
import EventAgenda from "./EventAgenda";
import EventHost from "./EventHost";
import { EventData } from "lib/model/event";
import classnames from 'classnames';
import { useState } from "react";
import { Link, Element } from 'react-scroll';
import classNames from 'classnames';

const EventSection = ({ setIsModalOpen, eventData, groupEvents, setIsRedeemModalOpen }: {
  setIsModalOpen: (arg: boolean) => void, eventData: EventData, groupEvents: any, setIsRedeemModalOpen: (arg: boolean) => void
}) => {
  const [firstActive, setFirstActive] = useState(true)
  const [tabCur, setTabCur] = useState(0)

  return (
    <>
      <EventTitle
        setIsModalOpen={setIsModalOpen}
        eventTitle={eventData?.event?.title}
        isLiveStream={eventData?.event?.streamEnabled}
        eventStartDate={eventData?.event?.start_datetime}
        eventEndDate={eventData?.event?.end_datetime}
        price={eventData?.event?.min_price}
        location={eventData?.event?.acInfo}
        groupEvents={groupEvents}
        currency={eventData?.event?.currency}
        category={eventData?.event?.category}
        categoryType={eventData?.event?.categoryType}
        playbackStart={!!eventData?.event?.ODPBStart}
        setIsRedeemModalOpen={setIsRedeemModalOpen} />
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
            offset={-50}
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
            offset={-50}
            duration={500}
            onSetActive={() => {
              setFirstActive(false)
            }}
          >
            Agenda
          </Link>
        </div>
      </div>
      {/*<div className="flex w-full p-1 border border-solid border-gray-600 rounded-full mt-10">
        <div className={classnames('event-details__tab', { active: tabCur === 0 })} onClick={() => { setTabCur(0) }}>
          About
        </div>
        <div className={classnames('event-details__tab', { active: tabCur === 1 })} onClick={() => { setTabCur(1) }}>
          Agenda
        </div>
      </div>*/}
      {/*{tabCur === 0 &&*/}
        <Element name="about" className="py-6 sm:py-10">
          <EventDescription
            description={eventData?.event?.content}
            rawDescription={eventData?.event?.contentPlainText} />

        </Element>
      {/*}*/}
      <div className="h-px bg-gray-600" />
      {/*{tabCur === 1 &&*/}
        <Element name="agenda" className="py-6 sm:py-10">
          <EventAgenda eventData={eventData} />

        </Element>
      {/*}*/}
      <div className="h-px bg-gray-600" />
      <div className="pt-6 sm:pt-10">
        <EventHost
          hostName={eventData?.event?.creator?.name}
          hostProfileImageUrl={eventData?.event?.creator?.avatar}
          hostEmail={eventData?.event?.creator?.email}
        />
      </div>
    </>
  );
};

export default EventSection;
