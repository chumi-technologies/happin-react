import { useState } from "react";

import { Box, Flex } from "@chakra-ui/react";

import SignInBar from "../components/SignInBar";
import ActionSideBar from "../components/page_components/ActionSideBar";
import ImageSection from "../components/page_components/ImageSection";
import EventSection from "../components/page_components/EventSection";
import BottomBar from "../components/page_components/BottomBar";

const EventPage = () => {
  const [isFirstTimeVisitor, setIsFirstTimeVisitor] = useState(true);
  return (
    <>
      {isFirstTimeVisitor && <SignInBar setItem={setIsFirstTimeVisitor} />}

      <Flex direction="row" h="100%" position="relative">
        <ActionSideBar
          state={isFirstTimeVisitor}
          setItem={setIsFirstTimeVisitor}
        />

        {/* Left Side */}
        <Box w="50%" h="100%">
          <ImageSection />
        </Box>

        {/* Right Side */}
        <Box w="50%" h="100%" overflowY="auto" p="60px 148px 80px 60px">
          <EventSection />
          <BottomBar />
        </Box>
      </Flex>
    </>
  );
};

export default EventPage;
