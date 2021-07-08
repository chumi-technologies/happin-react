import { Image, ButtonGroup, Button, Grid } from "@chakra-ui/react";

import TableDates from "./TableDates";

const EventDates = () => {
  const dates = [
    {
      date: "Fri, July 2・11 PM CST",
      price: "From $30",
      type: "Public Show / VIP Meeeting / Merch",
      buttonText: "Get Tickets",
      isDisabled: false,
    },
    {
      date: "Fri, July 2・11 PM CST",
      price: "From $30",
      type: "Public Show",
      buttonText: "Get Tickets",
      isDisabled: false,
    },
    {
      date: "Fri, July 2・11 PM CST",
      price: "From $30",
      type: "Public Show / VIP Meeeting / Merch",
      buttonText: "Get Tickets",
      isDisabled: false,
    },
    {
      date: "Fri, July 2・11 PM CST",
      price: "Sold Out",
      type: "Public Show / VIP Meeeting / Merch",
      buttonText: "Sold Out",
      isDisabled: true,
    },
    {
      date: "Fri, July 2・11 PM CST",
      price: "From $30",
      type: "Public Show / VIP Meeeting / Merch",
      buttonText: "Get Tickets",
      isDisabled: false,
    },
    {
      date: "Fri, July 2・11 PM CST",
      price: "From $30",
      type: "Public Show / VIP Meeeting / Merch",
      buttonText: "Get Tickets",
      isDisabled: false,
    },
  ];
  return (
    <>
      {/* List and Calendar Toggle */}
      <ButtonGroup
        my="24px"
        w="100%"
        border="1px"
        borderRadius="full"
        borderColor="brandGrey.500"
        p="4px"
        colorScheme="brandGrey"
        fontSize="sm"
        fontWeight="700"
      >
        <Button
          isFullWidth={true}
          // onClick={() => {
          //   location.href = "#";
          // }}
        >
          <Image src="/images/icons/eva_list-fill.svg" alt="List" />
        </Button>
        <Button
          variant="link"
          isFullWidth={true}
          // onClick={() => {
          //   location.href = "#";
          // }}
        >
          <Image src="/images/icons/calendar.svg" alt="Calendar" />
        </Button>
      </ButtonGroup>
      <Grid
        h="calc(100vh - 258px)"
        overflowY="auto"
        gridTemplateColumns="3fr 1fr"
        gap="24px"
      >
        {dates.map((date: any, index: Number) => {
          return <TableDates key={index} date={date} />;
        })}
      </Grid>
    </>
  );
};

export default EventDates;
