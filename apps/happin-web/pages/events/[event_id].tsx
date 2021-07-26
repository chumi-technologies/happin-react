import { useState } from "react";
import { useRouter } from "next/router";
import SignInBar from "../../components/SignInBar";
import PopUpModal from "../../components/reusable/PopUpModal";
import ActionSideBar from "../../components/page_components/ActionSideBar";
import EventSection from "../../components/page_components/EventSection";
import BottomBar from "../../components/page_components/BottomBar";
import EventDates from "../../components/page_components/EventDates";
import { Box } from '@chakra-ui/react';

const Events = () => {
  const router = useRouter();
  // Use event_id for api calls to request the event details
  const { event_id } = router.query;

  const [isFirstTimeVisitor, setIsFirstTimeVisitor] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setFavorite] = useState(false);
  const [showDownload, setShowDownload] = useState(true);

  return (
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
          <EventDates />
        </PopUpModal>
      )}
      <div id="scroll-body" className="relative lg:flex h-full lg:flex-row web-scroll overflow-y-auto">
        <ActionSideBar
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
        <div className="lg:sticky lg:top-0 w-full lg:w-5/12 xl:w-1/2 h-80 lg:h-full">
          <Box
            w="100%"
            h="100%"
            backgroundImage="url('/images/pic.png')"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
          />
        </div>

        {/* Event Texts */}
        <div className="w-full lg:w-7/12 xl:w-1/2 pb-16 sm:pb-20">
          <div className="event-details__container relative py-6 sm:py-8 md:py-14">
            <EventSection setIsModalOpen={setIsModalOpen} />
          </div>
          <BottomBar />
        </div>
      </div>
    </div>
  );
};

export default Events;
