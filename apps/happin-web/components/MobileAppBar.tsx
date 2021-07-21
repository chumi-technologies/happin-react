import {
  Box,
  VStack,
  HStack,
  Flex,
  Image,
  Text,
  Button,
} from "@chakra-ui/react";

const MobileAppBar = ({ setIsMobileBarOpen }: any) => {
  return (
    <>
      <Box
        display={{ base: "block", sm: "none" }}
        bg="brandPink.500"
        w="100%"
        px="24px"
        py="16px"
        color="white"
      >
        <VStack align="stretch">
          <Text fontSize="sm" fontWeight="700">
            Happin is better on the app, try our event social app now!
          </Text>

          <HStack>
            <Button
              variant="outline"
              fontSize="xs"
              fontWeight="700"
              h="32px"
              onClick={() => {
                setIsMobileBarOpen(false);
              }}
              s
            >
              Not Now
            </Button>

            <Button
              // variant="ghost"
              colorScheme="brandBlack"
              fontSize="xs"
              fontWeight="700"
              h="32px"
              isFullWidth={true}
              onClick={() => {
                setIsMobileBarOpen(false);
                location.href = "#";
              }}
            >
              Switch to the App
            </Button>
          </HStack>
        </VStack>
      </Box>
    </>
  );
};

export default MobileAppBar;
