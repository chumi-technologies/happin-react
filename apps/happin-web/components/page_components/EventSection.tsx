import { Box, Divider } from "@chakra-ui/react";

import EventTitle from "./EventTitle";
import EventLineUp from "./EventLineUp";
import EventAgenda from "./EventAgenda";
import EventHost from "./EventHost";

const EventSection = () => {
  return (
    <>
      <Box>
        <EventTitle />
        <Divider my="40px" />
        <EventLineUp />
        <Divider my="40px" />
        <EventAgenda />
        <Divider my="40px" />
        <EventHost />
      </Box>
    </>
  );
};

export default EventSection;
