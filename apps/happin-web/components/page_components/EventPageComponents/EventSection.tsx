import EventTitle from "./EventTitle";
import EventDescription from "./EventDescription";
// import EventLineUp from "./EventLineUp";
import EventAgenda from "./EventAgenda";
import EventHost from "./EventHost";
import { EventData } from "lib/model/event";
import classnames from 'classnames';
import { Link } from 'react-scroll';

const EventSection = ({ setIsModalOpen, eventData, groupEvents, setIsRedeemModalOpen }: {
  setIsModalOpen: (arg: boolean) => void, eventData: EventData, groupEvents: any, setIsRedeemModalOpen: (arg: boolean) => void
}) => {

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
      <div className="flex w-full p-1 border border-solid border-gray-600 rounded-full mt-10">
        <Link
          activeClass="active"
          containerId="about-agenda-scroll-body"
          to="about"
          spy={true}
          smooth={true}
          duration={500}
          className="event-details__tab">
          About
        </Link>
        <Link
          activeClass="active"
          containerId="about-agenda-scroll-body"
          to="agenda"
          spy={true}
          smooth={true}
          duration={500}
          className="event-details__tab" onClick={()=>{document.getElementById('agenda')?.scrollIntoView({behavior: "smooth"})}}>
          Agenda
        </Link>
      </div>
      <div id="about-agenda-scroll-body">
        <div id="about" className="pt-6 sm:pt-10">
          <EventDescription
            description={eventData?.event?.content}
            rawDescription={eventData?.event?.contentPlainText} />
          <div className="h-px bg-gray-600 my-6 sm:mt-10" />
        </div>

        <div id="agenda" className="pt-6 sm:pt-10">
          <EventAgenda eventData={eventData} />
          <div className="h-px bg-gray-600 my-6 sm:my-10" />
        </div>
      </div>
      <EventHost
        hostName={eventData?.event?.creator?.name}
        hostProfileImageUrl={eventData?.event?.creator?.avatar}
        hostEmail={eventData?.event?.creator?.email}
      />
    </>
  );
};

export default EventSection;
