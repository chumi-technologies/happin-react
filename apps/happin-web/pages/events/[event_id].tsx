import { useState } from "react";
import { useRouter } from "next/router";

import { Box, Flex } from "@chakra-ui/react";

import SignInBar from "../../components/SignInBar";
import PopUpModal from "../../components/PopUpModal";
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

      {/* Top Popups for First-Time Visitors */}
      {isFirstTimeVisitor && (
        <SignInBar setIsFirstTimeVisitor={setIsFirstTimeVisitor} />
      )}

      <Flex
        direction={{ base: "column", sm: "row" }}
        h="100%"
        position="relative"
      >
        <ActionSideBar
          isFirstTimeVisitor={isFirstTimeVisitor}
          setIsFirstTimeVisitor={setIsFirstTimeVisitor}
        />

        {/* Left Side */}
        <Box w={{ base: "100%", sm: "50%" }} h="100%">
          <ImageSection />
        </Box>

        {/* Right Side */}
        <Box
          w={{ base: "100%", sm: "50%" }}
          h="100%"
          overflowY="auto"
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
