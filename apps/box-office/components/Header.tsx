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
import { exchangeDashboardEventHostToken, getWhiteLabelDomain,getConnectedTeam, swtichTeam, getSaasUserInfo } from 'lib/api';
import {connectTeamResponse} from 'lib/model/user';
import classnames from 'classnames';
import jwt_decode from "jwt-decode";

export default function Header({ children, checkingWhiteLable, whiteLabelLogo, whiteLabelHome }: { children?: any, checkingWhiteLable: any, whiteLabelLogo: any, whiteLabelHome: any }) {
  const { user, clearUser,teamUser,setTeamUser,affiliation,setAffiliation,setPartnerId,crowdCoreToken } = useUserState();
  const { dimmed, showSSO, showSSOSignUp } = useSSOState();
  /* const [showSearch, setSearch] = useState(false)
  const [isEventPage, setIsEventPage] = useState(false) */
  const router = useRouter();
  const toast = useToast();
  const [connectedTeam,setConnectedTeam] = useState<connectTeamResponse[]>([]);
  const [sasaUserInfo,setSaasUserInfo] = useState<any>({});
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
      document.body.classList.add("body-overflow-hidden");
    } else {
      document.body.classList.remove("body-overflow-hidden");
    }
  }, [dimmed])

  useEffect(() => {
    (async () => {
      if(localStorage.getItem('chumi_jwt')){
        await getConnectedTeamFromCrowdcoreServer();
      }
    })()
  }, [crowdCoreToken])

  useEffect(() => {
    (async () => {
      if(localStorage.getItem('chumi_jwt')){
        const userInfo = await getSaasUserInfo();
        setSaasUserInfo(userInfo);
      }
    })()
  }, [crowdCoreToken])

  // const clickHostEventHandler = async () => {
  //   if (!user) {
  //     generateToast('Please sign up as event organizer');
  //     showSSOSignUp('Organizer')
  //     return
  //   }
  //   if (!user.email) {
  //     generateToast('Please sign up as event organizer');
  //     return
  //   }
  //   try {
  //     const res = await exchangeDashboardEventHostToken();
  //     if (res.code !== 200) {
  //       throw new Error(res.message)
  //     }
  //     const sassToken = res.data.token;
  //     window.location.href = `https://manage.happin.app/link-happin?t=${sassToken}`
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }
  const getConnectedTeamFromCrowdcoreServer = async ()=> {
    try{
      const teams = await getConnectedTeam();
      if (teams && teams.length>0) {
        setConnectedTeam(teams)
      }
    } catch(err) {
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

  const switchConnetedteam = async(id:string)=> {
    try {
      const newToken = await swtichTeam(id);
      localStorage.setItem('chumi_jwt',newToken.token);
      const userInfo = await getSaasUserInfo();
      setSaasUserInfo(userInfo);
      setTeamUser(true);
      if (connectedTeam.filter(t=>t.globalId._id === id).find(t => t.role  === 'affiliation')) {
        setAffiliation(true);
        setPartnerId(id);
      }
    } catch (err) {
      console.log(err)
    }
  }

  const switchBackMyAccount = async()=>{
    try {
      if (localStorage.getItem('chumi_jwt')) {
      let decoded: any = jwt_decode(localStorage.getItem('chumi_jwt') as string);
        if(decoded.originUserID){
          const newToken = await swtichTeam(decoded.originUserID);
          localStorage.setItem('chumi_jwt',newToken.token);
          const userInfo = await getSaasUserInfo();
          setSaasUserInfo(userInfo);
          setTeamUser(false);
          setAffiliation(false);
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <header className="header">
      {children}
      <div className=" flex items-center h-16 sm:h-20 px-4 sm:px-8 bg-black">
        {/* Mobile Search Form */}
      {/*   <form className={classNames('absolute top-full left-0 w-full z-10 hidden', { '!block': showSearch })}>
          <input ref={searchRef} type="text" className="header__phone-search" placeholder="Search..." />
        </form> */}
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
{/*            <Menu as="div" className="relative md:hidden">
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
                            <a className="header__menu-link md:hidden">Event List</a>
                          </Link>
                        </Menu.Item>
                      </div>
                    </Menu.Items>

                  </Transition>
                </>
              )}
            </Menu>*/}
            {/* Team Menu */} 
            {user && sasaUserInfo && 
              <div className="py-1">
                    <span className="text-gray-200 ml-2">{sasaUserInfo.username || sasaUserInfo.email}</span>
              </div>
            }
            {user && !teamUser && (
              <Menu as="div" className="relative md:ml-5">
                  {({ open }) => (
                    <>
                      <Menu.Button as="div" className={classNames('header__menu', { 'active': open })}>
                        <HamburgerButton theme="outline" size="22" fill="currentColor" />        
                         <span  className="text-gray-200 m-0.5">Team</span>
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
                        {/* <div className="py-1">
                          <Menu.Item>
                              <a className="header__menu-link" onClick={clickHostEventHandler}>
                                <International theme="outline" size="16" fill="currentColor" />
                                <span className="ml-2">Submit Event</span>
                              </a>
                            </Menu.Item>
                            <Menu.Item>
                              <a className="header__menu-link" onClick={()=>{ window.location.href = process.env.NEXT_PUBLIC_HAPPIN_APP_APPLE_STORE as string}}>
                                <DownTwo theme="outline" size="16" fill="currentColor" />
                                <span className="ml-2">Download App</span>
                              </a>
                            </Menu.Item>
                          </div>*/}
                          <div className="py-1">
                            {
                              (connectedTeam && connectedTeam.length>0) && connectedTeam.map( team=>
                                <a key={team._id} className="header__menu-link" onClick={()=>{switchConnetedteam(team?.globalId?._id)}}>{team?.globalId?.username || team?.globalId?.displayname }</a>
                              )
                            }
                          </div>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
            )}
            {
              (teamUser && sasaUserInfo) && ( 
                <>
                  <a className=" header__menu_back_button m-2" onClick={()=>{switchBackMyAccount()}}>Back to Me</a>
                </>
              )
            }
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
{/*           {!isEventPage && <div className="header__search">
            <label htmlFor="search" className="absolute left-4 leading-none inline-flex transition">
              <SearchIcon w={4} h={4} color="currentColor" />
            </label>
            <input id="search" type="text" className="header__search-input" placeholder="Search..." />
          </div>} */}

          {/* Right Block */}
          <div className="flex items-center">
            {/*{user && <a className="header__link sm:hidden md:inline-flex" onClick={()=>{router.push('/my-events')}}>My events</a>}*/}
           {/*  {!isEventPage && <button className={classNames('flex p-3 mr-3 rounded-full text-gray-300 sm:hidden', { 'bg-gray-800': showSearch })} onClick={() => setSearch(s => !s)}>
              <SearchIcon w={4} h={4} color="currentColor" />
            </button>} */}

            {/* User Profile */}
            <Menu as="div" className="relative md:ml-5">
              {({ open }) => (
                <>
                  <Menu.Button as="div" className={classNames('header__menu', { 'active': open })}>
                    <HamburgerButton theme="outline" size="22" fill="currentColor" />
                    {!user && <Avatar size="sm" ml={2} bg="gray.600" ><span style={{background: '#fdf846', bottom: '25px', left: '25px' }} className="w-2 h-2 rounded-full absolute"></span></Avatar>}
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
                    {/* <div className="py-1">
                      <Menu.Item>
                          <a className="header__menu-link" onClick={clickHostEventHandler}>
                            <International theme="outline" size="16" fill="currentColor" />
                            <span className="ml-2">Submit Event</span>
                          </a>
                        </Menu.Item>
                        <Menu.Item>
                          <a className="header__menu-link" onClick={()=>{ window.location.href = process.env.NEXT_PUBLIC_HAPPIN_APP_APPLE_STORE as string}}>
                            <DownTwo theme="outline" size="16" fill="currentColor" />
                            <span className="ml-2">Download App</span>
                          </a>
                        </Menu.Item>
                      </div>*/}
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
                              <a className="header__menu-link" onClick={()=>{clearUser(); router.push('/')}}>Log out</a>
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
