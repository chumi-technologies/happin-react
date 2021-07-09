import { useState } from "react";
import { useRouter } from "next/router";

import { Box, Flex } from "@chakra-ui/react";

import SignInBar from "../../components/SignInBar";
import PopUpModal from "../../components/reusable/PopUpModal";
import ActionSideBar from "../../components/page_components/ActionSideBar";
import ImageSection from "../../components/page_components/ImageSection";
import EventSection from "../../components/page_components/EventSection";
import BottomBar from "../../components/page_components/BottomBar";
import EventDates from "../../components/page_components/EventDates";

const Events = () => {
  const router = useRouter();
  // Use event_id for api calls to request the event details
  const { event_id } = router.query;

  const [isFirstTimeVisitor, setIsFirstTimeVisitor] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
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

      <Flex
        direction={{ base: "column", sm: "row" }}
        h={{ base: "auto", sm: "100%" }}
        position="relative"
      >
        <ActionSideBar
          isFirstTimeVisitor={isFirstTimeVisitor}
          setIsFirstTimeVisitor={setIsFirstTimeVisitor}
        />

        {/* Event Image */}
        <Box
          w={{ base: "100vw", sm: "50%" }}
          h={{ base: "112.5vw", sm: "100%" }}
        >
          <ImageSection />
        </Box>

        {/* Event Texts */}
        <Box
          w={{ base: "100%", sm: "50%" }}
          h={{ base: "visible", sm: "100%" }}
          overflowY={{ base: "auto", sm: "auto" }}
          p={{ base: "24px", sm: "60px 148px 80px 60px" }}
        >
          <EventSection setIsModalOpen={setIsModalOpen} />
          <BottomBar />
        </Box>
      </Flex>
    </>
  );
};

export default Events;
