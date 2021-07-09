import { Flex, Image, Text, HStack, Button } from "@chakra-ui/react";

const EventHost = () => {
  return (
    <>
      <Text textStyle="sectionTitle">Meet Your Host</Text>
      <Flex
        justify="space-between"
        w="100%"
        mt={{ base: "16px", sm: "24px" }}
        mb="56px"
      >
        <HStack spacing="12px">
          <Image
            borderRadius="full"
            boxSize="36px"
            src="/images/profile_pic.png"
            alt="profile picture"
          ></Image>
          <Text fontSize={{ base: "xs", sm: "md" }}>Happin Staff</Text>
        </HStack>
        <Button
          colorScheme="brandBlue"
          h="32px"
          fontSize={{ base: "xs", sm: "sm" }}
          fontWeight={{ base: "700", sm: "400" }}
        >
          Contact
        </Button>
      </Flex>
    </>
  );
};

export default EventHost;
