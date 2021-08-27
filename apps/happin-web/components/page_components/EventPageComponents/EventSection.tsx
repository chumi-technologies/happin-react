import EventTitle from "./EventTitle";
import EventDescription from "./EventDescription";
import EventLineUp from "./EventLineUp";
import EventAgenda from "./EventAgenda";
import EventHost from "./EventHost";

const EventSection = ({ setIsModalOpen, eventData, groupEvents, setIsRedeemModalOpen }: any) => {
  return (
    <>
      <EventTitle 
        setIsModalOpen={setIsModalOpen} 
        eventTitle={eventData?.event?.title} 
        tags={eventData?.event?.tags} 
        isLiveStream={eventData?.event?.streamEnabled} 
        eventStartDate={eventData?.event?.start_datetime}
        eventEndDate={eventData?.event?.end_datetime}
        price={eventData?.event?.min_price}
        location={eventData?.event?.acInfo}
        groupEvents={groupEvents}
        setIsRedeemModalOpen={setIsRedeemModalOpen}/>
      <div id="about" className="pt-6 sm:pt-10">
        <EventDescription 
          description={eventData?.event?.content}
          rawDescription={eventData?.event?.contentPlainText}/>
        <div className="h-px bg-gray-600 my-6 sm:my-10" />
        {/* <EventLineUp /> */}
        {/* <div className="h-px bg-gray-600 mt-6 sm:mt-10" /> */}
      </div>
      <div id="agenda" className="pt-6 sm:pt-10">
        {/* <EventAgenda /> */}
        {/* <div className="h-px bg-gray-600 my-6 sm:my-10" /> */}
        <EventHost 
          hostName={eventData?.event?.creator?.name}
          hostProfileImageUrl={eventData?.event?.creator?.avatar}/>
      </div>
    </>
  );
};

export default EventSection;