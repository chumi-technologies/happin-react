import { Flex, Image, Text, HStack, Button } from "@chakra-ui/react";

const EventHost = () => {
  return (
    <>
      <Text mt="40px" fontSize="xl">
        Meet Your Host
      </Text>
      <Flex justify="space-between" w="100%" mt="24px" mb="56px">
        <HStack spacing="12px">
          <Image
            borderRadius="full"
            boxSize="36px"
            src="/images/profile_pic.png"
            alt="profile picture"
          ></Image>
          <Text>Happin Staff</Text>
        </HStack>
        <Button colorScheme="brandBlue" h="32px" fontSize="sm">
          Contact
        </Button>
      </Flex>
    </>
  );
};

export default EventHost;
