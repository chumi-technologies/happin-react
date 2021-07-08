import { Flex, Text, Button, Divider } from "@chakra-ui/react";

const TableDates = ({ date }: any) => {
  return (
    <>
      <Flex direction="column">
        <Text color="highlight.500" fontWeight="700">
          {date.date}
        </Text>
        <Text fontSize="sm" fontWeight="700">
          {date.price}
        </Text>
        <Text color="brandGrey.700" fontSize="sm">
          {date.type}
        </Text>
      </Flex>
      <Button
        h="32px"
        fontSize="xs"
        fontWeight="700"
        colorScheme="brandPink"
        isDisabled={date.isDisabled}
      >
        {date.buttonText}
      </Button>
      <Divider gridColumn="1 / 3" />
    </>
  );
};

export default TableDates;
