import React, { Fragment, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, HStack, useToast } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { useSSOState } from 'contexts/sso-state';
import { useUserState } from 'contexts/user-state';
import { exchangeDashboardEventHostToken } from 'lib/api';
import classnames from 'classnames';
import IconPark from '@components/IconPark';

export default function Header({
  children,
  checkingWhiteLable,
  whiteLabelLogo,
  whiteLabelHome,
}: {
  children?: any;
  checkingWhiteLable: any;
  whiteLabelLogo: any;
  whiteLabelHome: any;
}) {
  const { user, clearUser } = useUserState();
  const { dimmed, showSSO, showSSOSignUp } = useSSOState();
  /* const [showSearch, setSearch] = useState(false)
  const [isEventPage, setIsEventPage] = useState(false) */
  const router = useRouter();
  const toast = useToast();
  const [isWhiteLable, setIsWhiteLable] = useState(false);

  useEffect(() => {
    console.log(router);
    if (
      window.location.hostname !== 'happin.app' &&
      window.location.hostname !== 'localhost' &&
      !window.location.hostname.includes('deploy-preview')
    ) {
      setIsWhiteLable(true);
    }
  }, []);

  //const searchRef = useRef<HTMLInputElement>(null!);

  /*   useEffect(() => {
      if (router.asPath.includes('/post/') || router.asPath.includes('/checkout/') || router.asPath.includes('/payment')) {
        setIsEventPage(true);
      } else {
        setIsEventPage(false);
      }
    }, [router.asPath])


    useEffect(() => {
      showSearch && searchRef.current.focus()
    }, [showSearch]) */

  useEffect(() => {
    if (dimmed) {
      document.body.classList.add('body-overflow-hidden');
    } else {
      document.body.classList.remove('body-overflow-hidden');
    }
  }, [dimmed]);

  const clickHostEventHandler = async () => {
    if (!user) {
      generateToast('Please sign up as event organizer');
      showSSOSignUp('Organizer');
      return;
    }
    if (!user.email) {
      generateToast('Please sign up as event organizer');
      return;
    }
    try {
      const res = await exchangeDashboardEventHostToken();
      if (res.code !== 200) {
        throw new Error(res.message);
      }
      const sassToken = res.data.token;
      window.location.href = `https://manage.happin.app/link-happin?t=${sassToken}`;
    } catch (err) {
      console.log(err);
    }
  };

  const generateToast = (message: string) => {
    toast({
      title: message,
      position: 'top',
      isClosable: true,
    });
  };

  return (
    <header className="header">
      {children}
      <div className="header-container">
        {/* Mobile Search Form */}
        {/*   <form className={classNames('absolute top-full left-0 w-full z-10 hidden', { '!block': showSearch })}>
          <input ref={searchRef} type="text" className="header__phone-search" placeholder="Search..." />
        </form> */}
        <HStack w="100%" h="100%" justify="space-between">
          {/* Left Block */}
          <div className="flex items-center">
            {/* Logo */}
            {!checkingWhiteLable ? (
              whiteLabelLogo ? (
                <a>
                  <img
                    className="h-10 mr-6 md:mr-8 hidden sm:block"
                    src={whiteLabelLogo}
                    onClick={() => {
                      if (whiteLabelHome)
                        window.location.href = whiteLabelHome.startsWith(
                          'https://',
                        )
                          ? whiteLabelHome
                          : 'https://' + whiteLabelHome;
                      else router.push('/');
                    }}
                    alt="Happin"
                  />
                </a>
              ) : (
                <a>
                  <img
                    className="h-9 mr-6 md:mr-8 hidden sm:block"
                    src={
                      router.asPath === '/'
                        ? '/images/happin-solid-logo-light.svg'
                        : '/images/happin-solid-logo.svg'
                    }
                    onClick={() => {
                      router.push('/');
                    }}
                    alt="Happin"
                  />
                  <img
                    className="h-8 mr-6 sm:hidden"
                    src="/images/happin-solid-single.svg"
                    onClick={() => {
                      router.push('/');
                    }}
                    alt="Happin"
                  />
                </a>
              )
            ) : (
              <></>
            )}
            {/* Mobile Left Menu */}
            <Menu as="div" className="relative md:hidden">
              {({ open }) => (
                <>
                  <Menu.Button
                    className={classNames(
                      'p-2 rounded-full text-gray-300 hover:text-gray-50 hover:bg-gray-900',
                      { 'bg-gray-800 text-gray-50 hover:bg-gray-800': open },
                    )}
                  >
                    <IconPark name="more" size="24" />
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
                          <a
                            className="header__menu-link md:hidden"
                            onClick={() => {
                              router.push('/submit-event');
                            }}
                          >
                            Submit an Event/Experience
                          </a>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
            {/* Left Menu */}
            {router.asPath === '/' && (
              <div className="flex space-x-4 font-gtw">
                <Link href="/">
                  <a className="header__link">For designers</a>
                </Link>
                <Link href="/news-list">
                  <a className="header__link">Blog</a>
                </Link>
              </div>
            )}
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
          {/*           {!isEventPage && <div className="header__search">
            <label htmlFor="search" className="absolute left-4 leading-none inline-flex transition">
              <SearchIcon w={4} h={4} color="currentColor" />
            </label>
            <input id="search" type="text" className="header__search-input" placeholder="Search..." />
          </div>} */}

          {/* Right Block */}
          <div className="flex items-center">
            {/*{!isWhiteLable && (
              <a
                className="header__link sm:hidden md:inline-flex"
                onClick={() => {
                  window.location.href = 'https://ticketing.happin.app';
                }}
              >
                Host events with Happin
              </a>
            )}*/}

            {/*{!isWhiteLable && <a className="header__link sm:hidden md:inline-flex" onClick={()=>{router.push('/submit-event')}}>Submit a professional event</a>}*/}
            {/*  {!isEventPage && <button className={classNames('flex p-3 mr-3 rounded-full text-gray-300 sm:hidden', { 'bg-gray-800': showSearch })} onClick={() => setSearch(s => !s)}>
              <SearchIcon w={4} h={4} color="currentColor" />
            </button>} */}

            {/* User Profile */}
            {/*<Menu as="div" className="relative md:ml-5">
              {({ open }) => (
                <>
                  <Menu.Button
                    as="div"
                    className={classNames('header__menu', { active: open })}
                  >
                    <IconPark name="hamburger-button" size="22" />
                    {!user && (
                      <Avatar size="sm" ml={2} bg="gray.600">
                        <span
                          style={{
                            background: '#fdf846',
                            bottom: '25px',
                            left: '25px',
                          }}
                          className="w-2 h-2 rounded-full absolute"
                        ></span>
                      </Avatar>
                    )}
                    {user && (
                      <Avatar
                        size="sm"
                        ml={2}
                        src={user.photourl}
                        name={user.displayname}
                      />
                    )}
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
                    <Menu.Items className="header__menu-dropdown right-0 origin-top-right divide-y divide-gray-700">
                      <div className="py-1">
                        <Menu.Item>
                          <a
                            className="header__menu-link"
                            onClick={clickHostEventHandler}
                          >
                            <IconPark name="international" size="16" />
                            <span className="ml-2">Organizer Dashboard</span>
                          </a>
                        </Menu.Item>
                        <Menu.Item>
                          <a
                            className="header__menu-link"
                            onClick={() => {
                              window.location.href = process.env
                                .NEXT_PUBLIC_HAPPIN_APP_APPLE_STORE as string;
                            }}
                          >
                            <IconPark name="down-two" size="16" />
                            <span className="ml-2">Download App</span>
                          </a>
                        </Menu.Item>
                      </div>
                      <div className="py-1">
                        {!user && (
                          <>
                            <Menu.Item>
                              <a
                                className="header__menu-link"
                                onClick={showSSO}
                              >
                                Log in
                              </a>
                            </Menu.Item>
                            <Menu.Item>
                              <a
                                className="header__menu-link"
                                onClick={() => {
                                  showSSOSignUp('Fan');
                                }}
                              >
                                Sign up
                              </a>
                            </Menu.Item>
                          </>
                        )}
                        {user && (
                          <>
                            <Menu.Item>
                              <a
                                className="header__menu-link"
                                onClick={() => {
                                  router.push('/my-event-collections');
                                }}
                              >
                                Event collection
                              </a>
                            </Menu.Item>
                            <Menu.Item>
                              <a
                                className="header__menu-link"
                                onClick={() => {
                                  router.push('/my-events');
                                }}
                              >
                                My events
                              </a>
                            </Menu.Item>
                            <Menu.Item>
                              <a
                                className="header__menu-link"
                                onClick={() => {
                                  clearUser();
                                  router.push('/');
                                }}
                              >
                                Log out
                              </a>
                            </Menu.Item>
                          </>
                        )}
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>*/}
          </div>
        </HStack>
      </div>
      {/*<div className="h-16 sm:h-20" />*/}
    </header>
  );
}
