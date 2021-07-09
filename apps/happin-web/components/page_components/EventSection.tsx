import { Box, Divider } from "@chakra-ui/react";

import EventTitle from "./EventTitle";
import EventLineUp from "./EventLineUp";
import EventAgenda from "./EventAgenda";
import EventHost from "./EventHost";

const EventSection = ({ setIsModalOpen }: any) => {
  return (
    <>
      <Box>
        <EventTitle setIsModalOpen={setIsModalOpen} />
        <Divider my={{ base: "24px", sm: "40px" }} />
        <EventLineUp />
        <Divider my={{ base: "24px", sm: "40px" }} />
        <EventAgenda />
        <Divider my={{ base: "24px", sm: "40px" }} />
        <EventHost />
      </Box>
    </>
  );
};

export default EventSection;
