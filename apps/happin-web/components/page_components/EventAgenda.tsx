import { Box, Text, Grid, Flex } from "@chakra-ui/react";

const AgendaItem = ({ item }: any) => {
  return (
    <>
      <Grid
        mt={{ base: "16px", sm: "24px" }}
        gridTemplateColumns="88px 1fr"
        rowGap="24px"
        columnGap="8px"
      >
        <Text fontSize={{ base: "xs", sm: "sm" }} fontWeight="700">
          {item.time}
        </Text>
        <Flex direction="column" align="start">
          <Text fontSize="xs" textTransform="uppercase">
            {item.type}
          </Text>
          <Text fontWeight="700" fontSize={{ base: "sm", sm: "md" }}>
            {item.title}
          </Text>
          <Text fontSize={{ base: "xs", sm: "sm" }} color="brandGrey.700">
            {item.description}
          </Text>
        </Flex>
      </Grid>
    </>
  );
};

const AgendaTable = () => {
  const agenda_1 = [
    {
      time: "11PM",
      type: "Public Show",
      title: "A Night With Norelle",
      description:
        "Grab your tickets now. You can access the event and group chat 1 hour before the event starts.",
    },
    {
      time: "11PM",
      type: "VIP / FAN Meeting",
      title: "Lady Gaga’s Meet & Greet",
      description:
        "Grab your tickets now. You can access the event and group chat 1 hour before the event starts.",
    },
  ];
  const agenda_2 = [
    {
      time: "11PM",
      type: "VIP / FAN Meeting",
      title: "BlackPink’s Meet & Greet",
      description:
        "Grab your tickets now. You can access the event and group chat 1 hour before the event starts.",
    },
  ];
  return (
    <>
      <Box>
        <Text
          color="highlight.500"
          fontSize={{ base: "sm", sm: "xl" }}
          fontWeight="900"
          mt={{ base: "16px", sm: "24px" }}
        >
          July 3
        </Text>
        {agenda_1.map((item: any, i: Number) => {
          return <AgendaItem item={item} key={i} />;
        })}
        <Text
          color="highlight.500"
          fontSize={{ base: "sm", sm: "xl" }}
          fontWeight="900"
          mt={{ base: "16px", sm: "24px" }}
        >
          July 4
        </Text>
        {agenda_2.map((item: any, i: Number) => {
          return <AgendaItem item={item} key={i} />;
        })}
      </Box>
    </>
  );
};

const EventAgenda = () => {
  return (
    <>
      <Text id="agenda" textStyle="sectionTitle">
        Agenda
      </Text>
      <AgendaTable />
    </>
  );
};

export default EventAgenda;
