import Link from 'next/link'
import {
  Image,
  InputGroup,
  InputLeftElement,
  Input, HStack
} from '@chakra-ui/react';
import { SearchIcon } from "@chakra-ui/icons";

export default function Header() {
  return (
    <div className="flex items-center h-16 sm:h-20 px-4 sm:px-8 bg-black">
      <HStack w="100%" h="100%" justify="space-between">
        {/* Left Block */}
        <div className="flex items-center">
          {/* Logo */}
          <img className="h-10 hidden sm:block" src="/images/happin-login.svg" alt="Happin" />
          <img className="h-10 sm:hidden" src="/images/happin-single.svg" alt="Happin" />
          <Link href="/">
            <a className="text-white font-medium p-1 ml-8 hidden sm:block">Explore events</a>
          </Link>
        </div>

        {/* Central Block */}
        {/* Search */}
        <InputGroup
          w="267px"
          h="44px"
          display={{ base: "none", lg: "block" }}
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
        <HStack spacing={6}>
          <Link href="/">
            <a className="text-white font-medium p-1 hidden sm:block">Host Event</a>
          </Link>
          {/* User Profile */}
          <Image
            w="83px"
            objectFit="contain"
            src="/images/profile.png"
            alt="Profile"
          />
        </HStack>
      </HStack>
    </div>
  );
}
