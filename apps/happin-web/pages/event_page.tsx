import {
  Box,
  Flex,
  Spacer,
  Image,
  Badge,
  Stack,
  Text,
  HStack,
  Divider,
  Button,
  VStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export default function EventPage() {
  return (
    <>
      <Box bg="black" w="100%" h="100%" pt="88px" color="white">
        <Flex h="100%">
          {/* Image Row */}
          <Box
            w="51.25%"
            h="100%"
            backgroundImage="url('/images/pic.png')"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
          ></Box>
          {/* Enent Content Row */}
          <Box flex="1" overflowY="auto" p="57px 44px" color="white">
            <VStack align="flex-start" justifyContent="flex-start">
              <Badge variant="outline" colorScheme="green" textTransform="none">
                Music Concert
              </Badge>
              <Text fontSize="2xl" as="b">
                American Express UNSTAGED with Maroon 5- The Encore
              </Text>
              <HStack>
                <Text fontSize="md" color="yellow">
                  Fri, May 25
                </Text>
                <Text fontSize="md">From $30.00</Text>
              </HStack>
              <Box w="100%" py="25px">
                <Button variant="outline" borderRadius="full" w="100%" h="40px">
                  Schedule
                </Button>
              </Box>
              <Text fontSize="xs">
                NYC legend Skyzoo comes to Berlin Under A to perform an
                exclusive first look at his new album 'All The Brilliant Things'
                the night before it drops!
              </Text>
              <Text fontSize="xs" as="b">
                ...Show More
              </Text>
              <Divider />
              <Text as="b">Line Up</Text>
              <HStack spacing="51px">
                <LineUpTile />
                <LineUpTile />
                <LineUpTile />
                <LineUpTile />
              </HStack>
              <Divider />
              <Flex justify="space-between" w="100%">
                <HStack>
                  <Image
                    borderRadius="full"
                    boxSize="36px"
                    src="/images/profile_pic.png"
                    alt="profile picture"
                  ></Image>
                  <Text fontSize="xs">Hosted by Happin StaffHappin </Text>
                </HStack>
                <HStack>
                  <Button colorScheme="blue" h="28px" fontSize="xs">
                    Follow
                  </Button>
                  <Button variant="outline" h="28px" fontSize="xs">
                    Contact
                  </Button>
                </HStack>
              </Flex>
              <Divider />
            </VStack>
          </Box>

          {/* Action Buttons Row */}
          <Box w="100px" pt="57px">
            <VStack>
              <Image h="48px" w="48px" src="/images/share.png" alt="share" />
              <Image h="48px" w="48px" src="/images/love.png" alt="like" />
              <Image
                h="48px"
                w="48px"
                src="/images/calendar.png"
                alt="calendar"
              />
              {/* <Button borderRadius="full" h="48px" w="48px" variant="outline">
                <Image src="/images/share.svg" alt="share" />
              </Button>
              <Button borderRadius="full" h="48px" w="48px" variant="outline">
                <Image src="/images/heart.svg" alt="like" />
              </Button>
              <Button borderRadius="full" h="48px" w="48px" variant="outline">
                <Image src="/images/calendar.svg" alt="calendar" />
              </Button> */}
            </VStack>
          </Box>
        </Flex>
      </Box>
    </>
  );
}

const LineUpTile = () => {
  return (
    <>
      <Box>
        <VStack justify="center" align="center">
          <Image
            borderRadius="full"
            boxSize="48px"
            src="/images/profile_pic.png"
            alt="profile picture"
          ></Image>
          <Text fontSize="xs">Cardi B</Text>
        </VStack>
      </Box>
    </>
  );
};
