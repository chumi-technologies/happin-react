import { Box, Image, VStack, Link, Text, Flex } from "@chakra-ui/react";

import PopUpOverlay from "../PopUpOverlay";

const ActionSideBar = ({ isFirstTimeVisitor, setIsFirstTimeVisitor }: any) => {
  return (
    <Box
      mt={{ base: "16px", sm: "60px" }}
      position="absolute"
      right={{ base: "16px", sm: "60px" }}
    >
      <VStack>
        <Image
          w={{ base: "32px", sm: "48px" }}
          src="/images/icons/love.svg"
          alt="like"
        />
        <Image
          w={{ base: "32px", sm: "48px" }}
          src="/images/icons/share_1.svg"
          alt="share"
        />
        <Box position="relative">
          {isFirstTimeVisitor ? (
            <>
              <Box
                position="absolute"
                top={{ base: "16px", sm: "24px" }}
                right={{ base: "16px", sm: "24px" }}
                w={{ base: "242px", sm: "260px" }}
                zIndex="1"
              >
                <PopUpOverlay>
                  <Text fontSize={{ base: "xs", sm: "sm" }}>
                    This event includes <Text as="u">VIP/Fan meeting</Text>.
                    Download the Happin app to meet your favourite artists
                  </Text>
                  <Flex mt="8px" justify="space-between">
                    <Image
                      w={{ base: "100px", sm: "110px" }}
                      src="/images/app_store.png"
                      alt="App Store"
                    ></Image>
                    <Image
                      w={{ base: "100px", sm: "110px" }}
                      src="/images/play_store.png"
                      alt="Play Store"
                    ></Image>
                  </Flex>
                </PopUpOverlay>
              </Box>
              <Link zIndex="5" onClick={() => setIsFirstTimeVisitor(false)}>
                <Image
                  w={{ base: "32px", sm: "48px" }}
                  zIndex="5"
                  src="/images/icons/close_circle.svg"
                  alt="close"
                />
              </Link>
            </>
          ) : (
            <>
              <Image
                w={{ base: "32px", sm: "48px" }}
                src="/images/icons/share.svg"
                alt="VIP"
              />
              <Image
                w="20px"
                src="/images/icons/vip.svg"
                alt="VIP"
                position="absolute"
                top={{ base: "-6px", sm: "0px" }}
                right={{ base: "-6px", sm: "-8px" }}
                filter="drop-shadow(0px 0px 5px #FFF846)"
              />
            </>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default ActionSideBar;
