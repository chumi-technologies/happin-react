import {
  Badge,
  Text,
  HStack,
  Button,
  VStack,
  ButtonGroup,
} from "@chakra-ui/react";

import TableComp from "./TableComp";

const EventTitle = ({ setIsModalOpen }: any) => {
  return (
    <>
      {/* Badges */}
      <HStack>
        <Badge
          variant="outline"
          colorScheme="highlight"
          fontSize={{ base: "sm", sm: "md" }}
        >
          Music Consert
        </Badge>
        <Badge colorScheme="brandPink" fontSize={{ base: "sm", sm: "md" }}>
          ・LIVE
        </Badge>
      </HStack>

      {/* Event Title */}
      <Text
        mt="16px"
        fontSize={{ base: "xl", sm: "4xl" }}
        fontWeight="900"
        fontFamily="proximanova"
      >
        American Express UNSTAGED with Maroon 5- The Encore
      </Text>

      {/* Event Date and Time */}
      <Text
        fontSize={{ base: "sm", sm: "xl" }}
        fontWeight="700"
        color="highlight.500"
        mt="8px"
      >
        Fri, July 2・11 PM CST
      </Text>

      {/* Block with Icons */}
      <VStack
        direction="column"
        align="start"
        spacing="12px"
        fontSize="sm"
        w="100%"
        mt={{ base: "24px", sm: "40px" }}
      >
        <TableComp
          iconURL="/images/icons/time_circle.svg"
          titleText="Date & Time"
          lineText="Fri, July 2・11 PM - Sat, July 3・2 AM CST (180 mins)"
          lineButtonText="See More Dates"
          lineButtonAction={setIsModalOpen}
          titleButtonText="See More Dates"
        />
        <TableComp
          iconURL="/images/icons/location.svg"
          titleText="The Bowery Club"
          lineText="127 East 23rd Street New York, NY, USA"
        />
        <TableComp iconURL="/images/icons/live.svg" titleText="Livestream" />
        <TableComp
          iconURL="/images/icons/ticket.svg"
          titleText="Price from $30.00"
          titleButtonText="Redeem Ticket"
          titleButtonAction="pass a method" // TODO: pass a method
        />
      </VStack>

      {/* About and Agenda links */}
      <ButtonGroup
        mt={{ base: "24px", sm: "40px" }}
        w="100%"
        border="1px"
        borderRadius="full"
        borderColor="brandGrey.500"
        p="4px"
        colorScheme="brandGrey"
        fontSize="sm"
        fontWeight="700"
      >
        <Button isFullWidth={true} fontSize={{ base: "sm", sm: "md" }}>
          About
        </Button>
        <Button
          variant="link"
          isFullWidth={true}
          fontSize={{ base: "sm", sm: "md" }}
          onClick={() => {
            location.href = "#agenda";
          }}
        >
          Agenda
        </Button>
      </ButtonGroup>

      {/* Description */}
      <Text textStyle="sectionTitle">Description</Text>
      <Text mt={{ base: "16px", sm: "24px" }} fontSize="sm">
        NYC legend Skyzoo comes to Berlin Under A to perform an exclusive first
        look at his new album 'All The Brilliant Things' the night before it
        drops! Website, Instagram, Spotify
      </Text>
    </>
  );
};

export default EventTitle;
