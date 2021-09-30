import React, { Fragment, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { Avatar, HStack, useToast } from '@chakra-ui/react';
import { SearchIcon } from "@chakra-ui/icons";
import { DownTwo, HamburgerButton, International, More, Search } from '@icon-park/react';
import { Menu, Transition } from '@headlessui/react'
import classNames from 'classnames';
import { useSSOState } from 'contexts/sso-state';
import { useUserState } from 'contexts/user-state';
import { exchangeDashboardEventHostToken, getWhiteLabelDomain } from 'lib/api';
import { useIntercom } from 'react-use-intercom';
import classnames from 'classnames';

export default function Header({ children }: { children?: any }) {
  const { user, clearUser } = useUserState();
  const { dimmed, showSSO, showSSOSignUp } = useSSOState();
  const [showSearch, setSearch] = useState(false)
  const [isEventPage, setIsEventPage] = useState(false)
  const router = useRouter();
  const toast = useToast();
  const { show } = useIntercom();

  const searchRef = useRef<HTMLInputElement>(null!);

  const [whiteLabelLogo, setWhiteLabelLogo] = useState();
  const [whiteLabelHome, setWhiteLabelHome] = useState('');
  const [checkingWhiteLable, setCheckingWhiteLable] = useState(true);

  useEffect(() => {
    if (router.asPath.includes('/events/') || router.asPath.includes('/checkout/') || router.asPath.includes('/payment')) {
      setIsEventPage(true);
    } else {
      setIsEventPage(false);
    }
  }, [router.asPath])

  useEffect(()=> {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      //const hostname = 'deadroyaltyproductions.happin.app'
      // && !hostname.includes('localhost')
      if (!hostname.includes('web.happin.app') && !hostname.includes('localhost')) {
        whiteLabelDomain(hostname)
      } else {
        setCheckingWhiteLable(false)
      }
    }
  }, [])

  const whiteLabelDomain = async (domain: string) => {
    try {
      const response = await getWhiteLabelDomain(domain);
      const logo = response.domainLogo.startsWith('https') ? response.domainLogo : 'https://images.chumi.co/' + response.domainLogo
      setWhiteLabelLogo(logo)
      setWhiteLabelHome(response.clientUrl);
      setCheckingWhiteLable(false)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    showSearch && searchRef.current.focus()
  }, [showSearch])

  useEffect(() => {
    if (dimmed) {
      document.body.classList.add("body-overflow-hidden");
    } else {
      document.body.classList.remove("body-overflow-hidden");
    }
  }, [dimmed])

  const clickHostEventHandler = async () => {
    if (!user) {
      generateToast('Please sign up as event organizer');
      showSSOSignUp('Organizer')
      return
    }
    if (!user.email) {
      generateToast('Please sign up as event organizer');
      return
    }
    try {
      const res = await exchangeDashboardEventHostToken();
      if (res.code !== 200) {
        throw new Error(res.message)
      }
      const sassToken = res.data.token;
      window.location.href = `https://manage.happin.app/link-happin?t=${sassToken}`
    } catch (err) {
      console.log(err)
    }
  }

  const generateToast = (message: string) => {
    toast({
      title: message,
      position: 'top',
      isClosable: true,
    })
  }

  return (
    <header className="header">
      {children}
      <div className=" flex items-center h-16 sm:h-20 px-4 sm:px-8 bg-black">
        {/* Mobile Search Form */}
        <form className={classNames('absolute top-full left-0 w-full z-10 hidden', { '!block': showSearch })}>
          <input ref={searchRef} type="text" className="header__phone-search" placeholder="Search..." />
        </form>
        <HStack w="100%" h="100%" justify="space-between">
          {/* Left Block */}
          <div className="flex items-center">
            {/* Logo */}
            {!checkingWhiteLable ?
              whiteLabelLogo ?
                <a>
                  <img className="h-10 mr-6 md:mr-8 hidden sm:block" src={whiteLabelLogo} onClick={() => {
                    if (whiteLabelHome) window.location.href = whiteLabelHome.startsWith('https://') ? whiteLabelHome : 'https://' + whiteLabelHome;
                    else router.push('/')
                  }} alt="Happin" />
                </a> :
                <a>
                  <img className="h-10 mr-6 md:mr-8 hidden sm:block" src="/images/happin-login.svg" onClick={() => { router.push('/') }} alt="Happin" />
                  <img className="h-9 mr-6 sm:hidden" src="/images/happin-single.svg" onClick={() => { router.push('/') }} alt="Happin" />
                </a> : <></>
            }
            {/* Mobile Left Menu */}
            <Menu as="div" className="relative md:hidden">
              {({ open }) => (
                <>
                  <Menu.Button className={classNames('p-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-900', { 'bg-gray-800 text-white hover:bg-gray-800': open })}>
                    <More theme="outline" size="24" fill="currentColor" />
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
                        {/*<Menu.Item>
                        <Link href="/">
                          <a className="header__menu-link">Home</a>
                        </Link>
                      </Menu.Item>
                      <Menu.Item>
                        <Link href="/">
                          <a className="header__menu-link">Explore events</a>
                        </Link>
                      </Menu.Item>*/}
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
            {/*<HStack spacing={4} display={{ base: "none", lg: "flex" }}>
            <Link href="/">
              <a className="header__link">Home</a>
            </Link>
            <Link href="/">
              <a className="header__link">Explore events</a>
            </Link>
          </HStack>*/}
          </div>

          {/* Central Block */}
          {/* Search */}
          {!isEventPage && <div className="header__search">
            <label htmlFor="search" className="absolute left-4 leading-none inline-flex transition">
              <SearchIcon w={4} h={4} color="currentColor" />
            </label>
            <input id="search" type="text" className="header__search-input" placeholder="Search..." />
          </div>}


          {/* Right Block */}
          <div className="flex items-center">
            <a className="header__link sm:hidden md:inline-flex" onClick={clickHostEventHandler}>Host Event</a>
            <a className="text-sm p-2 font-medium text-gray-300 hover:text-white sm:inline-flex md:hidden" onClick={() => { show() }}>Support</a>
            {!isEventPage && <button className={classNames('flex p-3 mr-3 rounded-full text-gray-300 sm:hidden', { 'bg-gray-800': showSearch })} onClick={() => setSearch(s => !s)}>
              <SearchIcon w={4} h={4} color="currentColor" />
            </button>}

            {/* User Profile */}
            <Menu as="div" className="relative md:ml-5">
              {({ open }) => (
                <>
                  <Menu.Button as="div" className={classNames('header__menu', { 'active': open })}>
                    <HamburgerButton theme="outline" size="22" fill="currentColor" />
                    {!user && <Avatar size="sm" ml={2} bg="gray.600" />}
                    {user && <Avatar size="sm" ml={2} src={user.photourl} name={user.displayname} />}
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
                          <a className="header__menu-link" onClick={clickHostEventHandler}>
                            <International theme="outline" size="16" fill="currentColor" />
                            <span className="ml-2">Host Event Dashboard</span>
                          </a>
                        </Menu.Item>
                        <Menu.Item>
                          <a className="header__menu-link" onClick={()=>{ window.location.href = process.env.NEXT_PUBLIC_HAPPIN_APP_APPLE_STORE as string}}>
                            <DownTwo theme="outline" size="16" fill="currentColor" />
                            <span className="ml-2">Download Happin</span>
                          </a>
                        </Menu.Item>
                      </div>
                      <div className="py-1">
                        {!user && (
                          <>
                            <Menu.Item>
                              <a className="header__menu-link" onClick={showSSO}>Log in</a>
                            </Menu.Item>
                            <Menu.Item>
                              <a className="header__menu-link" onClick={()=> {showSSOSignUp('Fan')}}>Sign up</a>
                            </Menu.Item>
                          </>
                        )}
                        {user && (
                          <>
                            <Menu.Item>
                              <a className="header__menu-link" onClick={()=>{router.push('/my-events')}}>My tickets</a>
                            </Menu.Item>
                            <Menu.Item>
                              <a className="header__menu-link" onClick={()=>{clearUser(); router.push('/')}}>Sign out</a>
                            </Menu.Item>
                          </>
                        )}
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
          </div>
        </HStack>
      </div>
      {/*<div className="h-16 sm:h-20" />*/}
    </header>
  )
}
