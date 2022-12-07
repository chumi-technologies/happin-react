import GroupEventCard from "./GroupEventCard";
import { GroupEvent } from "lib/model/groupEvent";
import { EventData } from "lib/model/event";
type EventDatesProp = {
  setIsModalOpen: (arg0: boolean) => void
  eventData: EventData
}

const EventDates = ({ setIsModalOpen, eventData } : EventDatesProp) => {
  const groupEvents = eventData.groupEvents?.filter(e => e._id !== eventData.event.eid) || [];
  console.log(groupEvents);
  return (
    <>
      {/* List and Calendar Toggle */}
{/*       <div className="flex w-full mb-2 sm:mb-3 mt-3 sm:mt-4 p-1 border border-solid border-gray-600 rounded-full">
        <div className="event-details__tab active">
          <SvgIcon id="list" className="text-2xl" />
        </div>
        <div className="event-details__tab">
          <SvgIcon id="calendar" className="text-2xl" />
        </div>
      </div> */}
      {/* Grid with available dates */}
      <div style={{'marginBottom': '20px'}}/>
      <div className="flex-1 overflow-y-auto web-scroll -mr-4 pr-4 sm:-mr-5 sm:pr-3 grid grid-cols-1 divide-y divide-gray-600">
        {groupEvents.map((groupEvent: GroupEvent, index: number) => {
          return <GroupEventCard key={index} groupEvent={groupEvent} setIsModalOpen={setIsModalOpen}/>
        })}
      </div>
    </>
  );
};

export default EventDates;
