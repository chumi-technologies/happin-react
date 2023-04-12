import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import cn from 'classnames';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserState } from '@/contexts/user-state';
import SvgIcon from '@/components/SvgIcon';
import { useSSOState } from '@/contexts/sso-state';
import { exchangeDashboardEventHostToken } from '@/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import Avvvatars from 'avvvatars-react';

type HeaderProps = {
  logo?: string;
  mode?: 'normal' | 'animation';
};
const Header = ({ logo, mode = 'animation' }: HeaderProps) => {
  const { user, clearUser } = useUserState();
  const { showSSO, showSSOSignUp } = useSSOState();
  const [animateHeader, setAnimateHeader] = useState(mode === 'normal');
  const router = useRouter();
  useEffect(() => {
    if (mode === 'animation') {
      const listener = () => {
        if (window.scrollY > 10) {
          setAnimateHeader(true);
        } else setAnimateHeader(false);
      };
      window.addEventListener('scroll', listener);
      return () => {
        window.removeEventListener('scroll', listener);
      };
    }
  }, []);
  const clickHostEventHandler = async () => {
    if (!user) {
      toast('Please sign up as event organizer.');
      showSSOSignUp('Organizer');
      return;
    }
    if (!user.email) {
      toast('Please sign up as event organizer.');
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

  return (
    <div
      className={cn(
        'fixed right-0 top-0 left-0 transition ease-in-out duration-500 z-10',
        animateHeader ? 'bg-white' : 'bg-transparent',
      )}
    >
      <div className="px-5 sm:px-6 md:px-10 py-2 transition-all ease-in-out duration-500">
        <div className="flex items-center w-full">
          <div className="flex items-center flex-1">
            <Link className="font-bold text-xl md:text-2xl text-gray-900 no-underline" href="/">
              {logo ? (
                <img
                  className={cn(
                    'transition-all ease-in-out duration-500',
                    animateHeader ? 'h-12' : 'h-14 md:h-20',
                  )}
                  src={logo}
                  alt=""
                />
              ) : (
                <div>CrowdCore</div>
              )}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <a
              className="inline-flex p-2 text-gray-800 hover:text-[#EE1D51]"
              target="_blank"
              rel="noreferrer"
              href="#"
            >
              <SvgIcon name="tiktok" size={18} />
            </a>
            <a
              className="inline-flex p-2 text-gray-800 hover:text-[#1DA1F2]"
              target="_blank"
              rel="noreferrer"
              href="https://twitter.com/AppHappin"
            >
              <SvgIcon name="twitter" size={18} />
            </a>
            <a
              className="inline-flex p-2 text-gray-800 hover:text-[#E4405F]"
              target="_blank"
              rel="noreferrer"
              href="https://www.instagram.com/happin.app/"
            >
              <SvgIcon name="instagram" size={18} />
            </a>
          </div>
          <Menu as="div" className="relative ml-5 sm:ml-10">
            {({ open }) => (
              <>
                <Menu.Button as="div" className={cn('header__menu group', { active: open })}>
                  <SvgIcon name="menu" className="mr-3" size={20} />
                  {!user ? (
                    <div
                      className={cn(
                        'flex items-center justify-center rounded-full bg-gray-200 w-[30px] h-[30px] text-gray-500 group-hover:text-gray-500',
                        {
                          'text-gray-500': open,
                        },
                      )}
                    >
                      <SvgIcon name="user" className="text-[18px]" />
                    </div>
                  ) : user?.photourl ? (
                    <div className="w-[30px] h-[30px] overflow-hidden rounded-full">
                      <img className="aspect-square h-full w-full" src={user.photourl} alt="" />
                    </div>
                  ) : (
                    <Avvvatars size={30} value={user.displayname} />
                  )}
                </Menu.Button>
                <Transition
                  show={open}
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="header__menu-dropdown right-0 origin-top-right divide-y divide-gray-200">
                    <div className="py-1">
                      <Menu.Item>
                        <a className="header__menu-link" onClick={clickHostEventHandler}>
                          <SvgIcon name="global" className="text-[16px]" />
                          <span className="ml-2">Organizer Dashboard</span>
                        </a>
                      </Menu.Item>
                      {/*<Menu.Item>
                        <a className="header__menu-link">
                          <SvgIcon name="download" className="text-[16px]" />
                          <span className="ml-2">Download App</span>
                        </a>
                      </Menu.Item>*/}
                    </div>
                    <div className="py-1">
                      {!user ? (
                        <>
                          <Menu.Item>
                            <a className="header__menu-link" onClick={showSSO}>
                              Log in
                            </a>
                          </Menu.Item>
                          <Menu.Item>
                            <a className="header__menu-link" onClick={() => showSSOSignUp('Fan')}>
                              Sign up
                            </a>
                          </Menu.Item>
                        </>
                      ) : (
                        <>
                          <Menu.Item>
                            <Link href="/my-events" className="header__menu-link">My events</Link>
                          </Menu.Item>
                          <Menu.Item>
                            <a
                              className="header__menu-link"
                              onClick={async () => {
                                clearUser();
                                await router.push('/');
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
          </Menu>
        </div>
      </div>
    </div>
  );
};
export default Header;
