import { Flex, Text, Button, Box } from "@chakra-ui/react";

const TableDates = ({ date }: any) => {
  return (
    <>
      <Box minW={{ base: "0px", sm: "432px" }}>
        <Button
          float="right"
          h="32px"
          ml="8px"
          fontSize="xs"
          fontWeight="700"
          colorScheme="brandPink"
          isDisabled={date.isDisabled}
        >
          {date.buttonText}
        </Button>
        <Flex direction="column">
          <Text
            color="highlight.500"
            fontWeight="700"
            fontSize={{ base: "sm", sm: "md" }}
          >
            {date.date}
          </Text>
          <Text fontSize="sm" fontWeight="700">
            {date.price}
          </Text>
        </Flex>
        <Text color="brandGrey.700" fontSize={{ base: "xs", sm: "sm" }}>
          {date.type}
        </Text>
      </Box>
    </>
  );
};

export default TableDates;
