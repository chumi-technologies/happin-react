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
        h={{ base: "80px", sm: "88px" }}
        color="white"
        pos="absolute"
        top="0"
        left="0"
        right="0"
        px="24px"
      >
        <Flex h="100%" direction="row" align="center" justify="space-between">
          {/* Left Block */}
          <Flex align="center">
            {/* Logo */}
            <Image
              w="150px"
              objectFit="contain"
              src="/images/happin.png"
              alt="Happin"
              display={{ base: "none", sm: "block" }}
            />
            <Image
              w="42px"
              objectFit="contain"
              src="/images/happin_logo.png"
              alt="Happin"
              display={{ base: "block", sm: "none" }}
            />

            {/* Link One */}
            <Link
              ml="48px"
              href="#"
              fontSize="xs"
              color="white"
              display={{ base: "none", sm: "block" }}
            >
              Explore events
            </Link>
          </Flex>

          {/* Central Block */}
          {/* Search */}
          <InputGroup
            w="267px"
            h="44px"
            display={{ base: "none", sm: "block" }}
          >
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
          <Flex align="center">
            {/* Link Two */}
            <Link
              mr="48px"
              href="#"
              fontSize="xs"
              color="white"
              display={{ base: "none", sm: "block" }}
            >
              Host Event
            </Link>

            {/* User Profile */}
            <Image
              w="83px"
              objectFit="contain"
              src="/images/profile.png"
              alt="Profile"
            />
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
