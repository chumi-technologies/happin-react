import React, { Fragment } from 'react';
import Link from 'next/link';
import { Avatar, HStack } from '@chakra-ui/react';
import { SearchIcon } from "@chakra-ui/icons";
import { DownTwo, HamburgerButton, International } from '@icon-park/react';
import { Menu, Transition } from '@headlessui/react'
import classNames from 'classnames';

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
          <Menu as="div" className="relative">
            {({ open }) => (
              <>
                <Menu.Button as={Fragment}>
                  <div className={classNames('header__menu', { 'active': open })}>
                    <HamburgerButton theme="outline" size="22" fill="currentColor"/>
                    <Avatar size="sm" ml={2} bg="gray.600"/>
                  </div>
                </Menu.Button>
                <Transition
                  show={open}
                  as={Fragment}
                  enter="fade-enter"
                  enterFrom="fade-enter-from"
                  enterTo="fade-enter-to"
                  leave="fade-leave"
                  leaveFrom="fade-leave-from"
                  leaveTo="fade-leave-to"
                >
                  <Menu.Items className="header__menu-dropdown divide-y divide-gray-800">
                    <div className="py-1">
                      <Menu.Item>
                        <Link href="/">
                          <a className="header__menu-link">
                            <International theme="outline" size="16" fill="currentColor"/>
                            <span className="ml-2">Host Event Dashboard</span>
                          </a>
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <Link href="/">
                          <a className="header__menu-link">
                            <DownTwo theme="outline" size="16" fill="currentColor"/>
                            <span className="ml-2">Download Happin</span>
                          </a>
                        </Link>
                      </Menu.Item>
                    </div>
                    <div className="py-1">
                      <Menu.Item>
                        <Link href="/">
                          <a className="header__menu-link">Log in</a>
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <Link href="/">
                          <a className="header__menu-link">Sign up</a>
                        </Link>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </HStack>
      </HStack>
    </div>
  );
}
