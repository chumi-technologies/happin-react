import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box } from '@chakra-ui/react';

import { SSO } from '../../components/SSO';
import SignInBar from "../../components/SignInBar";
import PopUpModal from "../../components/reusable/PopUpModal";
import ActionSideBar from "../../components/page_components/ActionSideBar";
import EventSection from "../../components/page_components/EventSection";
import BottomBar from "../../components/page_components/BottomBar";
import EventDates from "../../components/page_components/EventDates";
import { getEventDetail, getGroupEvents } from "lib/api";
import { EventData } from "lib/model/event";
import { GroupEvent } from "lib/model/groupEvent";

const Events = () => {
  const router = useRouter();
  // Use event_id for api calls to request the event details
  const { event_id } = router.query;
  
  useEffect(() => {
    (async () => {
      try {
        if (event_id as string !== undefined) {
          const data = await getEventDetail(event_id as string, 'crowdcore')
          setEventData(data.data)
          console.log
          if (data.data.event.groupAcid) {
            const groupEvents = await getGroupEvents(data.data.event.groupAcid || "")
            setGroupEvents(groupEvents)
          }
          console.log(data)
        }
      } catch (err) {
        console.log(err)
      }
    })();
  }, [event_id]);
  
  const [isFirstTimeVisitor, setIsFirstTimeVisitor] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setFavorite] = useState(false);
  const [showDownload, setShowDownload] = useState(true);
  const [eventData, setEventData] = useState<EventData>();
  const [groupEvents, setGroupEvents] = useState<GroupEvent[]>([]);

  return (
    <>
    {/* <SSO /> */}
    <div className="event-details__page">
      {/* Top Popups for First-Time Visitors */}
      {isFirstTimeVisitor && (
        <SignInBar setIsFirstTimeVisitor={setIsFirstTimeVisitor} />
      )}

      {/* Event Dates Modal */}
      {isModalOpen && (
        <PopUpModal
          modalTitle="Event Dates"
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        >
          <EventDates groupEvents={groupEvents}/>
        </PopUpModal>
      )}
      <div id="scroll-body" className="relative lg:flex h-full lg:flex-row web-scroll overflow-y-auto">
        <ActionSideBar
          eventTitle={eventData?.event?.title} 
          showDownload={showDownload}
          isFavorite={isFavorite}
          onFavorite={() => {
            setFavorite(s => !s)
          }}
          onShare={() => {
            console.log('share');
          }}
          onDownload={() => {
            setShowDownload(s => !s)
          }}
        />

        {/* Event Image */}
        <div className="lg:sticky lg:top-0 w-full lg:w-5/12 xl:w-1/2 lg:h-full overflow-hidden">
          <Box
            className="sm:hidden lg:block"
            w="100%"
            h="100%"
            position="absolute"
            style={{ filter:  "blur(40px)", transform: "scale(1.5)" }}
            backgroundImage={`url('${eventData?.event?.cover}')`}
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
          />
          <img
            src={`${eventData?.event?.cover}`}
            className="sm:relative lg:absolute w-full top-0 bottom-0 m-auto"
          />
        </div>

        {/* Event Texts */}
        <div className="w-full lg:w-7/12 xl:w-1/2 pb-16 sm:pb-20">
          <div className="event-details__container relative py-6 sm:py-8 md:py-14">
            <EventSection setIsModalOpen={setIsModalOpen} eventData={eventData} groupEvents={groupEvents}/>
          </div>
          <BottomBar />
        </div>
      </div>
    </div>
    </>
  );
};

export default Events;
