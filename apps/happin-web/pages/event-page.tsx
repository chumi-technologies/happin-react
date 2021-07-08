import { useState } from "react";

import { Box, Flex } from "@chakra-ui/react";

import SignInBar from "../components/SignInBar";
import PopUpModal from "../components/PopUpModal";
import ActionSideBar from "../components/page_components/ActionSideBar";
import ImageSection from "../components/page_components/ImageSection";
import EventSection from "../components/page_components/EventSection";
import BottomBar from "../components/page_components/BottomBar";
import EventDates from "../components/page_components/EventDates";

const EventPage = () => {
  const [isFirstTimeVisitor, setIsFirstTimeVisitor] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      {isModalOpen && (
        <PopUpModal
          modalTitle="Event Dates"
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        >
          <EventDates />
        </PopUpModal>
      )}
      {isFirstTimeVisitor && (
        <SignInBar setIsFirstTimeVisitor={setIsFirstTimeVisitor} />
      )}

      <Flex direction="row" h="100%" position="relative">
        <ActionSideBar
          isFirstTimeVisitor={isFirstTimeVisitor}
          setIsFirstTimeVisitor={setIsFirstTimeVisitor}
        />

        {/* Left Side */}
        <Box w="50%" h="100%">
          <ImageSection />
        </Box>

        {/* Right Side */}
        <Box w="50%" h="100%" overflowY="auto" p="60px 148px 80px 60px">
          <EventSection setIsModalOpen={setIsModalOpen} />
          <BottomBar />
        </Box>
      </Flex>
    </>
  );
};

export default EventPage;
