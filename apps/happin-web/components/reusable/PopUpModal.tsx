import { Box, Flex, Text, Button, Image, VStack } from "@chakra-ui/react";

const PopUpModal = ({ modalTitle, setIsModalOpen, children }: any) => {
  return (
    <>
      <Flex
        id="pop_up_modal"
        position="fixed"
        h="100%"
        w="100vw"
        left="0px"
        top="0px"
        bg="rgba(0, 0, 0, .7)"
        zIndex="modal"
        justify="center"
        align="center"
        onClick={(e) => {
          if ((e.target as HTMLElement).id === "pop_up_modal") {
            setIsModalOpen(false);
          }
        }}
      >
        <Box
          position="relative"
          minW="240px"
          maxH="calc(100% - 80px)"
          maxW="calc(100vw - 48px)"
          bg="brandGrey.200"
          borderRadius="10px"
          boxShadow="0px 10px 20px rgba(0, 0, 0, .75)"
          border="1px solid #333333"
          p="24px"
        >
          {/* Close Icon */}
          <Button
            variant="ghost"
            h="32px"
            w="32px"
            position="absolute"
            right="12px"
            top="20px"
            bottom="auto"
            p="0"
            onClick={() => {
              setIsModalOpen(false);
            }}
          >
            <Image w="20px" src="/images/icons/close_light.svg" />
          </Button>

          {/* Body Block */}
          <VStack maxH="100%">
            {/* Adds empty title when title not passed  */}
            {modalTitle ? (
              <Text h="24px" fontWeight="700">
                {modalTitle}
              </Text>
            ) : (
              <Text>&nbsp;</Text>
            )}
            <Box>{children}</Box>
          </VStack>
        </Box>
      </Flex>
    </>
  );
};

export default PopUpModal;
