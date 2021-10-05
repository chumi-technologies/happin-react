import EventTitle from "./EventTitle";
import EventDescription from "./EventDescription";
// import EventLineUp from "./EventLineUp";
import EventAgenda from "./EventAgenda";
import EventHost from "./EventHost";
import { EventData } from "lib/model/event";
import classnames from 'classnames';
import { useState } from "react";

const EventSection = ({ setIsModalOpen, eventData, groupEvents, setIsRedeemModalOpen }: {
  setIsModalOpen: (arg: boolean) => void, eventData: EventData, groupEvents: any, setIsRedeemModalOpen: (arg: boolean) => void
}) => {
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
        category={eventData?.event?.category}
        categoryType={eventData?.event?.categoryType}
        playbackStart={!!eventData?.event?.ODPBStart}
        setIsRedeemModalOpen={setIsRedeemModalOpen} />
      <div className="flex w-full p-1 border border-solid border-gray-600 rounded-full mt-10">
        <div className={classnames('event-details__tab', { active: tabCur === 0 })} onClick={() => { setTabCur(0) }}>
          About
        </div>
        <div className={classnames('event-details__tab', { active: tabCur === 1 })} onClick={() => { setTabCur(1) }}>
          Agenda
        </div>
      </div>
      {tabCur === 0 &&
        <div id="about" className="pt-6 sm:pt-10">
          <EventDescription
            description={eventData?.event?.content}
            rawDescription={eventData?.event?.contentPlainText} />
          <div className="h-px bg-gray-600 my-6 sm:mt-10" />
        </div>
      }
      {tabCur === 1 &&
        <div id="agenda" className="pt-6 sm:pt-10">
          <EventAgenda eventData={eventData} />
          <div className="h-px bg-gray-600 my-6 sm:my-10" />
        </div>
      }
      <EventHost
        hostName={eventData?.event?.creator?.name}
        hostProfileImageUrl={eventData?.event?.creator?.avatar}
        hostEmail={eventData?.event?.creator?.email}
      />
    </>
  );
};

export default EventSection;
