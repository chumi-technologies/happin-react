import { Box, Flex, Text, Button, Image, VStack } from "@chakra-ui/react";

const PopUpModal = ({ modalTitle, setIsModalOpen, children }: any) => {
  return (
    <>
      <Flex
        id="pop_up_modal"
        position="absolute"
        w="100vw"
        h="100vh"
        left="0px"
        top="0px"
        bg="rgba(0, 0, 0, 0.6)"
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
          maxH="calc(100vh - 20px)"
          maxW="calc(100vh - 20px)"
          bg="brandGrey.200"
          borderRadius="10px"
          boxShadow="0px 0px 20px rgba(255, 255, 255, 0.3)"
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
          <VStack>
            {/* Adds empty title when title not passed  */}
            {modalTitle ? (
              <Text fontWeight="700">{modalTitle}</Text>
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
