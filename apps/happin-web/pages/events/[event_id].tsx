import { useState, useEffect } from "react";
import { Box } from '@chakra-ui/react';
import SignInBar from '../../components/SignInBar'
import PopUpModal from "../../components/reusable/PopUpModal";
import ActionSideBar from "../../components/page_components/ActionSideBar";
import EventSection from "../../components/page_components/EventSection";
import BottomBar from "../../components/page_components/BottomBar";
import EventDates from "../../components/page_components/EventDates";
import { getEventDetail, getGroupEvents } from "lib/api";
import { EventData } from "lib/model/event";
import Head from 'next/head';
import { GetServerSidePropsResult } from "next";

const Events = (props: EventData) => {
  const [isFirstTimeVisitor, setIsFirstTimeVisitor] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setFavorite] = useState(false);
  const [showDownload, setShowDownload] = useState(true);
  
  const eventData = props;
  const groupEvents = props.groupEvents;

  useEffect(()=> {
    const isVisitor = Boolean(localStorage.getItem('is_visitor'));
    setIsFirstTimeVisitor(!isVisitor);
  },[])

  const firstTimeVisitHandler = () => {
    localStorage.setItem('is_visitor', 'false');
    setIsFirstTimeVisitor( s => !s);
  }

  return (
    <>
    <Head>
    {/* More meta tags needed to be added */}
    <title>{eventData?.event?.title}</title>
    <meta name="description" content={eventData?.event?.contentPlainText} />
    <meta property="og:image" content={eventData?.event?.cover} />
    </Head>
    <div className="event-details__page">
      {/* Top Popups for First-Time Visitors */}
      {isFirstTimeVisitor && (
        <SignInBar setIsFirstTimeVisitor={firstTimeVisitHandler} />
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


// fetch data on server upon every request.. not using static page pre render
export async function getServerSideProps(context: { params: { event_id: string } }): Promise<GetServerSidePropsResult<any>> {
  const res = await getEventDetail(context.params.event_id as string, 'crowdcore')
  const props = res.data
  if (res.data?.event?.groupAcid) {
    const groupEvents = await getGroupEvents(res.data.event.groupAcid || "")
    props.groupEvents = groupEvents;
  }
  console.log('props',props)
  return {
    props,
  }
}


