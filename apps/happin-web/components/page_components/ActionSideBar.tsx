import { Box, Image, VStack, Link, Text, Flex } from "@chakra-ui/react";

import PopUpOverlay from "../PopUpOverlay";

const ActionSideBar = ({ isFirstTimeVisitor, setIsFirstTimeVisitor }: any) => {
  return (
    <Box mt="60px" position="absolute" right="60px">
      <VStack w="48px">
        <Image src="/images/icons/love.svg" alt="like" />
        <Image src="/images/icons/share_1.svg" alt="share" />
        <Box position="relative">
          {isFirstTimeVisitor ? (
            <>
              <Box
                position="absolute"
                top="24px"
                right="24px"
                w="260px"
                zIndex="1"
              >
                <PopUpOverlay>
                  <Text fontSize="sm">
                    This event includes <Text as="u">VIP/Fan meeting</Text>.
                    Download the Happin app to meet your favourite artists
                  </Text>
                  <Flex mt="8px" justify="space-between">
                    <Image
                      w="110px"
                      src="/images/app_store.png"
                      alt="App Store"
                    ></Image>
                    <Image
                      w="110px"
                      src="/images/play_store.png"
                      alt="Play Store"
                    ></Image>
                  </Flex>
                </PopUpOverlay>
              </Box>
              <Link zIndex="5" onClick={() => setIsFirstTimeVisitor(false)}>
                <Image src="/images/icons/close_circle.svg" alt="close" />
              </Link>
            </>
          ) : (
            <>
              <Image src="/images/icons/share.svg" alt="VIP" />
              <Image
                w="60px"
                src="/images/icons/vip.svg"
                alt="VIP"
                position="absolute"
                bottom="18px"
                left="18px"
                filter="drop-shadow(0px 0px 20px #FFF846)"
              />
            </>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default ActionSideBar;
