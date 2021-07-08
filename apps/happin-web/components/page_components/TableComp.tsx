import { Flex, Image, Text, HStack, Button, VStack } from "@chakra-ui/react";

const TableComp = ({
  iconURL = null,
  titleText = null,
  titleButtonText = null,
  titleButtonAction = null, // Sets to true when clicked
  lineText = null,
  lineButtonText = null,
  lineButtonAction = null, // Sets to true when clicked
}: any) => {
  return (
    <HStack justify="start" spacing="18px" w="100%">
      {iconURL && <Image src={iconURL} />}

      <VStack align="start" spacing="0px" w="100%">
        <Flex justify="space-between" align="center" w="100%">
          {titleText && <Text>{titleText}</Text>}
          {titleButtonText && titleButtonAction && (
            <Button
              variant="outline"
              colorScheme="brandBlue"
              fontSize="xs"
              h="24px"
              onClick={() => titleButtonAction(true)}
            >
              {titleButtonText}
            </Button>
          )}
        </Flex>
        <Flex justify="space-between" align="center" w="100%">
          {lineText && <Text color="brandGrey.700">{lineText}</Text>}
          {lineButtonText && lineButtonAction && (
            <Button
              variant="outline"
              colorScheme="brandBlue"
              fontSize="xs"
              h="24px"
              onClick={() => lineButtonAction(true)}
            >
              {lineButtonText}
            </Button>
          )}
        </Flex>
      </VStack>
    </HStack>
  );
};

export default TableComp;
