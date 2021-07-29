import Link from 'next/link'
import {
  Avatar,
  InputGroup,
  InputLeftElement,
  Input, HStack, DarkMode
} from '@chakra-ui/react';
import { SearchIcon } from "@chakra-ui/icons";
import React from 'react';
import { HamburgerButton } from '@icon-park/react';

export default function Header() {
  return (
    <div className="flex items-center h-16 sm:h-20 px-4 sm:px-8 bg-black">
      <HStack w="100%" h="100%" justify="space-between">
        {/* Left Block */}
        <div className="flex items-center">
          {/* Logo */}
          <img className="h-10 mr-6 hidden sm:block" src="/images/happin-login.svg" alt="Happin" />
          <img className="h-10 mr-6 sm:hidden" src="/images/happin-single.svg" alt="Happin" />
          <Link href="/">
            <a className="header__link">Explore events</a>
          </Link>
        </div>

        {/* Central Block */}
        {/* Search */}
        <div className="header__search">
          <label htmlFor="search" className="absolute left-4 leading-none inline-flex transition">
            <SearchIcon w={4} h={4} color="currentColor" />
          </label>
          <input id="search" type="text" className="header__search-input" placeholder="Search..." />
        </div>

        {/* Right Block */}
        <HStack spacing={5}>
          <Link href="/">
            <a className="header__link">Host Event</a>
          </Link>
          {/* User Profile */}
          <div className="header__menu">
            <HamburgerButton theme="outline" size="22" fill="currentColor"/>
            <Avatar size="sm" ml={2} bg="gray.500"/>
          </div>
        </HStack>
      </HStack>
    </div>
  );
}
