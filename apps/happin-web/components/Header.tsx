import React, { Fragment, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { Avatar, HStack } from '@chakra-ui/react';
import { SearchIcon } from "@chakra-ui/icons";
import { DownTwo, HamburgerButton, International, More, Search } from '@icon-park/react';
import { Menu, Transition } from '@headlessui/react'
import classNames from 'classnames';

export default function Header() {
  const [showSearch, setSearch] = useState(false)
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    showSearch && searchRef.current!.focus()
  }, [showSearch])
  return (
    <div className="relative z-50 flex items-center h-16 sm:h-20 px-4 sm:px-8 bg-black">
      {/* Mobile Search Form */}
      <form className={classNames('absolute top-full left-0 w-full z-10 hidden', {'!block': showSearch})}>
        <input ref={searchRef as any} type="text" className="header__phone-search" placeholder="Search..." />
      </form>
      <HStack w="100%" h="100%" justify="space-between">
        {/* Left Block */}
        <div className="flex items-center">
          {/* Logo */}
          <img className="h-10 mr-6 md:mr-8 hidden sm:block" src="/images/happin-login.svg" alt="Happin" />
          <img className="h-9 mr-6 sm:hidden" src="/images/happin-single.svg" alt="Happin" />
          {/* Mobile Left Menu */}
          <Menu as="div" className="relative lg:hidden">
            {({ open }) => (
              <>
                <Menu.Button className={classNames('p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-900', { 'bg-gray-800 text-white hover:bg-gray-800': open })}>
                  <More theme="outline" size="24" fill="currentColor"/>
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
                  <Menu.Items className="header__menu-dropdown left-0 origin-top-left divide-y divide-gray-800">
                    <div className="py-1">
                      <Menu.Item>
                        <Link href="/">
                          <a className="header__menu-link">Home</a>
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <Link href="/">
                          <a className="header__menu-link">Explore events</a>
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <Link href="/">
                          <a className="header__menu-link md:hidden">Host Event</a>
                        </Link>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
          {/* Left Menu */}
          <HStack spacing={4} display={{ base: "none", lg: "flex" }}>
            <Link href="/">
              <a className="header__link">Home</a>
            </Link>
            <Link href="/">
              <a className="header__link">Explore events</a>
            </Link>
          </HStack>
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
        <div className="flex items-center">
          <Link href="/">
            <a className="header__link sm:hidden md:inline-flex">Host Event</a>
          </Link>
          <button className={classNames('flex p-3 mr-3 rounded-full text-gray-300 sm:hidden', { 'bg-gray-800': showSearch })} onClick={() => setSearch(s => !s) }>
            <SearchIcon w={4} h={4} color="currentColor" />
          </button>
          {/* User Profile */}
          <Menu as="div" className="relative md:ml-5">
            {({ open }) => (
              <>
                <Menu.Button as="div" className={classNames('header__menu', { 'active': open })}>
                  <HamburgerButton theme="outline" size="22" fill="currentColor"/>
                  <Avatar size="sm" ml={2} bg="gray.600"/>
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
                  <Menu.Items className="header__menu-dropdown right-0 origin-top-right divide-y divide-gray-800">
                    <div className="py-1">
                      <Menu.Item>
                        <a className="header__menu-link" onClick={() => router.push('/')}>
                          <International theme="outline" size="16" fill="currentColor"/>
                          <span className="ml-2">Host Event Dashboard</span>
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <Link href="/">
                          <a className="header__menu-link" onClick={() => router.push('/')}>
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
        </div>
      </HStack>
    </div>
  );
}
