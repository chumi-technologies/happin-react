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
import classnames from 'classnames';
import jwt_decode from "jwt-decode";

export default function Header({ children}: { children?: any }) {
  const { user, clearUser,teamUser,setTeamUser,affiliation,setAffiliation,partnerId,setPartnerId,
    crowdCoreToken,connectedTeam,setConnectedTeam,sasaUserInfo,setSaasUserInfo,setSaasUserRole } = useUserState();
  const { dimmed, showSSO, showSSOSignUp } = useSSOState();
  /* const [showSearch, setSearch] = useState(false)
  const [isEventPage, setIsEventPage] = useState(false) */
  const router = useRouter();
  const toast = useToast();
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

  const generateToast = (message: string) => {
    toast({
      title: message,
      position: 'top',
      isClosable: true,
    })
  }

  const switchConnetedteam = async(id:string,teamId:string)=> {
    try {
      const newTeam = connectedTeam.filter(t=>t._id === teamId)[0];
      if(newTeam.role === 'affiliation') {
        localStorage.setItem('affiliation',JSON.stringify(newTeam))
        setAffiliation(newTeam);
      }
      localStorage.setItem('saasUerRole',newTeam.role)
      setSaasUserRole(newTeam.role)
      const newToken = await swtichTeam(id);
      localStorage.setItem('chumi_jwt',newToken.token);
      const userInfo = await getSaasUserInfo();
      localStorage.setItem('saasUserInfo',JSON.stringify(userInfo))
      setSaasUserInfo(userInfo);
      localStorage.setItem('teamUser',JSON.stringify(true));
      setTeamUser(true);
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
          setSaasUserRole(userInfo.permission)
          localStorage.setItem('saasUerRole',userInfo.permission);
          setSaasUserInfo(userInfo);
          localStorage.setItem('saasUserInfo',JSON.stringify(userInfo))
          setAffiliation(undefined);
          localStorage.removeItem('affiliation');
          localStorage.setItem('teamUser',JSON.stringify(false));
          setTeamUser(false);
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
                  <a>
                    <img className="h-10 mr-6 md:mr-8 hidden sm:block" src="/images/happin-login.svg" onClick={() => { router.push('/') }} alt="Happin" />
                    <img className="h-9 mr-6 sm:hidden" src="/images/happin-single.svg" onClick={() => { router.push('/') }} alt="Happin" />
                  </a> 
                {/* Mobile Left Menu */}
          {/* Team Menu */} 
          {user && sasaUserInfo && 
            <div className="py-1">
                  <span className="text-gray-200 mx-1 text-sm sm:text-xl ">{sasaUserInfo.username || sasaUserInfo.email}</span>
            </div>
          }
          {user && !teamUser && (
            <Menu as="div" className="relative md:ml-5">
                {({ open }) => (
                  <>
                    <Menu.Button as="div" className={classNames('header__menu', { 'active': open })}>
                      <HamburgerButton theme="outline" size="22" fill="currentColor" />        
                       <span  className="text-gray-200 mx-0.5">Team</span>
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
                          {
                            (connectedTeam && connectedTeam.length>0) && connectedTeam.map( team=>
                              <a key={team._id} className="header__menu-link" onClick={()=>{switchConnetedteam(team?.globalId?._id,team._id)}}>{`${team?.globalId?.username || team?.globalId?.displayname } ( ${team?.role} )`}</a>
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
                <a className=" header__menu_back_button mx-0.5" onClick={()=>{switchBackMyAccount()}}>Back to Me</a>
              </>
            )
          }
          </div>
              {/* Right Block */}
              <div className="flex items-center">

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
        </header>
  )
}
