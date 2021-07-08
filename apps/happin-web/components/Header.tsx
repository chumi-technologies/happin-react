import {
  Box,
  HStack,
  Flex,
  Image,
  Link,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export default function Header() {
  return (
    <>
      <Box
        bg="black"
        w="100%"
        h="88px"
        color="white"
        pos="absolute"
        top="0"
        left="0"
        right="0"
      >
        <Box w="100%" h="100%">
          <Flex h="100%" direction="row" align="center" justify="space-around">
            {/* Left Block */}
            <HStack spacing="48px">
              {/* Logo */}
              <Image
                w="150px"
                objectFit="contain"
                src="/images/happin.png"
                alt="Happin"
              />

              {/* Link One */}
              <Link href="#" fontSize="xs" color="white">
                Explore events
              </Link>
            </HStack>

            {/* Central Block */}
            {/* Search */}
            <InputGroup w="267px" h="44px">
              <InputLeftElement
                h="100%"
                pointerEvents="none"
                children={<SearchIcon color="gray.500" />}
              />
              <Input
                h="100%"
                variant="outline"
                placeholder="Search"
                borderRadius="full"
              />
            </InputGroup>

            {/* Right Block */}
            <HStack spacing="48px">
              {/* Link Two */}
              <Link href="#" fontSize="xs" color="white">
                Host Event
              </Link>

              {/* User Profile */}
              <Image
                w="83px"
                objectFit="contain"
                src="/images/profile.png"
                alt="Profile"
              />
            </HStack>
          </Flex>
        </Box>
      </Box>
    </>
  );
}
