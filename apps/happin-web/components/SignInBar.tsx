import { Box, HStack, Flex, Image, Text, Button } from "@chakra-ui/react";

const SignInBar = ({ setIsFirstTimeVisitor }: any) => {
  return (
    <>
      <Box
        display={{ base: "none", sm: "block" }}
        bg="white"
        w="100%"
        px="60px"
        py="8px"
        color="black"
        pos="absolute"
        top="88px"
        left="0"
        right="0"
        zIndex="10"
      >
        <HStack justify="center" align="center">
          {/* Central Block */}
          {/* Search */}
          <Image src="/images/icons/akar-icons_ticket.svg" />
          <Text fontSize="sm">
            Already have tickets or invitation code? Sign in to check your
            ticket!
          </Text>
          <Button colorScheme="brandPink" fontSize="sm" h="32px">
            Sign In to continue
          </Button>
        </HStack>

        {/* Close Icon */}
        <Button
          variant="ghost"
          h="32px"
          position="absolute"
          right="60px"
          top="8px"
          bottom="auto"
          p="0"
          onClick={(e) => {
            setIsFirstTimeVisitor(false);
          }}
        >
          <Image w="20px" src="/images/icons/close.svg" />
        </Button>
      </Box>
    </>
  );
};

export default SignInBar;
