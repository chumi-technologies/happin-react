import { Box, ButtonGroup, Button, Image } from "@chakra-ui/react";

const BottomBar = () => {
  return (
    <Box
      position="absolute"
      bottom="0"
      right="0"
      w="50%"
      bg="brandGrey.200"
      p="16px 148px 16px 60px"
    >
      <ButtonGroup w="100%">
        <Button
          colorScheme="highlight"
          color="black"
          fontWeight="700"
          leftIcon={<Image src="/images/icons/chat.svg" />}
          isFullWidth={true}
        >
          Chat with Fans
        </Button>
        <Button
          colorScheme="brandPink"
          fontWeight="700"
          leftIcon={<Image src="/images/icons/ticket.svg" />}
          isFullWidth={true}
        >
          Get Tickets
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default BottomBar;
