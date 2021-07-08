import { Flex, Image, Text, HStack, Button, VStack } from "@chakra-ui/react";

const TableComp = ({
  iconURL = null,
  titleText = null,
  titleButtonText = null,
  lineText = null,
  lineButtonText = null,
}: any) => {
  return (
    <HStack justify="start" spacing="18px" w="100%">
      {iconURL && <Image src={iconURL} />}

      <VStack align="start" spacing="0px" w="100%">
        <Flex justify="space-between" align="center" w="100%">
          {titleText && <Text>{titleText}</Text>}
          {titleButtonText && (
            <Button
              variant="outline"
              colorScheme="brandBlue"
              fontSize="xs"
              h="24px"
            >
              {titleButtonText}
            </Button>
          )}
        </Flex>
        <Flex justify="space-between" align="center" w="100%">
          {lineText && <Text color="brandGrey.700">{lineText}</Text>}
          {lineButtonText && (
            <Button
              variant="outline"
              colorScheme="brandBlue"
              fontSize="xs"
              h="24px"
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
