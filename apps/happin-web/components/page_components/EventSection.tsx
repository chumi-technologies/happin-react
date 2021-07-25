import EventTitle from "./EventTitle";
import EventDescription from "./EventDescription";
import EventLineUp from "./EventLineUp";
import EventAgenda from "./EventAgenda";
import EventHost from "./EventHost";

const EventSection = ({ setIsModalOpen }: any) => {
  return (
    <>
      <EventTitle setIsModalOpen={setIsModalOpen} />
      <div id="about" className="pt-6 sm:pt-10">
        <EventDescription />
        <div className="h-px bg-gray-600 my-6 sm:my-10" />
        <EventLineUp />
        <div className="h-px bg-gray-600 mt-6 sm:mt-10" />
      </div>
      <div id="agenda" className="pt-6 sm:pt-10">
        <EventAgenda />
        <div className="h-px bg-gray-600 my-6 sm:my-10" />
        <EventHost />
      </div>
    </>
  );
};

export default EventSection;
