import React, { Fragment, useState } from 'react';
import Link from 'next/link';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import classNames from "classnames";
import { Stack } from '@chakra-ui/react';
import { Dialog, Transition } from '@headlessui/react';
import { CloseSmall } from '@icon-park/react';
import { GetServerSidePropsResult } from 'next';
import { getWhiteLabelDomain } from 'lib/api';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useUserState } from 'contexts/user-state';

const imageList = [
  '/images/home-feature-02.png',
  '/images/home-feature-02.png',
  '/images/home-feature-02.png',
];
const buildEvent = [
  {
    title: 'Create or share events',
    desc: 'Copy paste URL, and get a perfect space for the event community immediately! '
  },
  {
    title: 'Deep connections in various ways',
    desc: 'Not just chat, there are audio parties, event based content sharing and more.'
  },
  {
    title: 'Build an engaging profile',
    desc: 'Personalize your virtual gifts (emoji), and show up your personal brand!'
  },
];
export default function Home() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false)
  const [buildCur, setBuildCur] = useState<number>(0);
  const { clearUser } = useUserState();
  const closeModal = () => {
    setIsOpen(false)
  }
  const openModal = () => {
    setIsOpen(true)
  }
  
  useEffect(() => {
    if (router.query.logout) {
      clearUser();
      router.push('/');
    }
  },[router])

  return (
    <div className="relative bg-black text-white z-0">
      <div className="relative overflow-hidden pt-48 pb-40 md:py-52 lg:py-64 home__banner">
        <div className="container">
          <div className="absolute -left-14 lg:-left-20 xl:-left-28 top-12 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-56 xl:h-56 rounded-full bg-yellow-500" />
          <img className="absolute left-14 sm:left-20 md:left-32 lg:left-40 top-8 w-14 lg:w-20 xl:w-24" src="/images/music.png" alt="" />
          <img className="absolute left-40 md:left-1/3 lg:right-auto xl:left-auto xl:right-1/3 top-2 md:top-8 h-20 md:h-28 lg:h-32 xl:h-36" src="/images/mc.png" alt="" />
          <div className="absolute top-10 rounded-full bg-green-500 right-circle">
            <img className="absolute -left-20 md:-left-36 top-20 sm:top-16 lg:top-14 xl:top-20 h-14 md:h-20 lg:h-24 xl:h-28 z-10" src="/images/sge.png" alt="" />
            <img className="absolute -left-16 sm:-left-12 md:-left-16 lg:-left-12 bottom-16 top-auto sm:bottom-auto sm:top-1/2 -mt-8 md:-mt-16 h-14 md:h-20 lg:h-24 xl:h-28 z-10" src="/images/asp.png" alt="" />
            <div className="hidden sm:block absolute left-10 lg:left-20 top-1/2 mt-8 lg:mt-20 w-8 h-8 md:w-14 md:h-14 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full bg-white z-10" />
            <div className="absolute -left-10 top-20 lg:top-28 mt-20 w-4 h-4 lg:w-6 lg:h-6 xl:w-8 xl:h-8 rounded-full bg-white z-10" />
            <div className="absolute left-0 sm:-left-24 md:-left-28 lg:-left-44 xl:-left-56 -bottom-12 sm:bottom-20 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full bg-rose-500 z-10" />
            <div className="hidden lg:block absolute -left-32 lg:-left-40 xl:-left-1/4 top-8 sm:top-40 lg:top-56 w-10 h-10 md:w-14 md:h-14 lg:w-20 lg:h-20 xl:w-20 xl:h-20 rounded-full bg-yellow-500" />
          </div>
          <div className="relative black-title text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold w-2/3 z-30">
            <div className="absolute left-12 md:left-16 lg:left-20 -top-6 md:-top-14 lg:-top-14 xl:-top-32 w-12 md:w-16 h-2 lg:w-20 lg:h-3 xl:w-24 xl:h-4 home__color-purple" />
            <div className="absolute -left-24 bottom-24 w-8 h-8 rounded-full home__color-pink z-10" />
            <div className="absolute -left-2 lg:-left-16 -bottom-24 lg:-bottom-32 xl:-bottom-40 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full home__color-purple z-10" />
            <img className="absolute left-24 lg:left-40 xl:left-1/2 -bottom-16 sm:-bottom-28 md:-bottom-36 xl:-bottom-48 h-14 md:h-20 lg:h-24 xl:h-28" src="/images/fnl.png" alt="" />
            Deep <br/>connections with like-minded people via events
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden pt-14 pb-20 md:py-32 lg:py-40">
        <div className="absolute left-24 md:left-96 top-0 md:top-10 w-6 h-6 md:w-8 md:h-8 rounded-full home__color-pink" />
        <div className="absolute left-80 -bottom-8 w-24 h-24 rounded-full bg-yellow-500" />
        <div className="container">
          <div className="flex items-center flex-col md:flex-row text-center md:text-left">
            <div className="relative sm:w-3/5 md:w-1/2 xl:w-7/12 black-title text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-7 md:mb-0 text-rose-500">
              A new experience to attend events
            </div>
            <div className="md:pl-12 lg:pl-16 md:w-1/2 xl:w-5/12">
              <div className="relative text-lg font-semibold mb-12">
                <div className="absolute right-20 -top-10 w-4 h-4 rounded-full home__color-pink" />
                <p className="mb-4 md:mb-5">
                {`Don't`} wait! Bring yourself. Join the private event community, attend audio pre-event/after party, send each other emoji gifts, talk over voice, video, text. Find your crew based on your interests!
                </p>
              </div>
              <div className="flex flex-col items-center justify-center sm:flex-row">
                <a target="_blank" href="https://apps.apple.com/app/id1527348429" rel="noreferrer">
                  <img className="h-12 hover:opacity-90 transition" src="/images/app-store-white.svg" alt="app-store" />
                </a>
              {/*   <div className="cursor-pointer mt-5 sm:mt-0 sm:ml-4" onClick={() => openModal()}>
                  <img className="h-12 hover:opacity-90 transition" src="/images/google-play-white.svg" alt="app-store" />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-14 sm:py-28 bg-white bg-opacity-5">
        <div className="container">
          <div className="text-center mb-10 md:mb-14 lg:mb-20">
            <h1 className="black-title text-3xl md:text-5xl lg:text-6xl font-bold">
              How Happin Works
            </h1>
          </div>
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-center">
            <div className="sm:w-9/12 md:w-full mx-auto lg:flex-grow flex flex-col md:items-start md:text-left items-center text-center">
              <Stack spacing={4}>
              {buildEvent.map((item, index) => (
                <div
                  className={classNames('home__how-works-item', { 'active': buildCur === index })}
                  key={index}
                  aria-hidden="true"
                  onClick={() => {
                    setBuildCur(index);
                  }}
                >
                  <div className="font-semibold sm:text-lg mb-2">{item.title}</div>
                  <div className="home__how-works-item--desc">{item.desc}</div>
                </div>
              ))}
              </Stack>
            </div>
            <div
              className="relative w-full h-full flex justify-center items-center">
              <SwitchTransition mode="out-in">
                <CSSTransition
                  key={buildCur}
                  addEndListener={(node, done) => {
                    node.addEventListener('transitionend', done, false);
                  }}
                  classNames="home__fade"
                >
                  <div className="relative w-full sm:w-3/4 md:w-full h-full flex justify-center items-center">
                    <div className="absolute top-0 right-0 md:top-10 md:right-0 lg:-top-4 lg:-right-4 w-16 h-16 lg:w-24 lg:h-24 home__color-pink rounded-full" />
                    <div className="absolute -left-2 -bottom-4 md:bottom-12 md:-left-4 lg:-bottom-4 lg:-left-4 w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 xl:w-2/3 xl:h-2/3 bg-yellow-500 rounded-full" />
                    <div className="relative w-1/2 md:w-7/12 lg:w-1/2 z-10">
                      <img className="w-11/12 border-2 border-solid border-gray-600 rounded-2xl md:rounded-2xl lg:rounded-3xl" src="/images/screen-01.jpeg" alt="" />
                    </div>
                    <div className="relative w-2/5 md:w-5/12 lg:w-2/5 z-10">
                      <img className="w-full border-2 border-solid border-gray-600 rounded-2xl md:rounded-2xl lg:rounded-3xl" src="/images/screen-02.jpeg" alt="" />
                    </div>
                  </div>
                  {/*<img className="w-full" src={imageList[buildCur]} alt="" />*/}
                </CSSTransition>
              </SwitchTransition>
            </div>
          </div>
        </div>
      </div>
      {/*Dialog*/}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => {
          }}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="mask-enter"
              enterFrom="mask-enter-from"
              enterTo="mask-enter-to"
              leave="mask-leave"
              leaveFrom="mask-leave-from"
              leaveTo="mask-leave-to"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="dialog-enter"
              enterFrom="dialog-enter-from"
              enterTo="dialog-enter-to"
              leave="dialog-leave"
              leaveFrom="dialog-leave-from"
              leaveTo="dialog-leave-to"
            >
              <div className="relative inline-block w-full max-w-md p-5 sm:p-6 my-8 overflow-hidden text-left align-middle bg-gray-800 rounded-2xl z-10">
                <div className="relative flex items-center mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg sm:text-xl font-bold leading-6 text-white"
                  >
                    xxxx is waiting for android version
                  </Dialog.Title>
                  <div className="flex items-center justify-center absolute -right-2 w-10 h-10 rounded-full hover:bg-gray-700 hover:text-white transition cursor-pointer text-gray-300" onClick={closeModal}>
                    <CloseSmall theme="outline" size="22" fill="currentColor" strokeWidth={3} />
                  </div>
                </div>
                <input type="email" className="block w-full px-3 py-2 sm:py-3 border-2 border-solid border-gray-600 rounded-lg bg-gray-900 text-white text-center transition placeholder-gray-400 hover:border-gray-500 focus:bg-black font-semibold text-xl" placeholder="Enter Your Email" />
                <p className="mt-6 text-sm text-gray-400">Happin will launch android version when there are 10k people request for it. Are you an android user? Leave your email here to push Happin team.</p>
                <button
                  type="button"
                  className="mt-6 btn btn-rose w-full !rounded-full"
                >
                  Confirm
                </button>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}


const whiteLabelDomain = async (domain: string) => {
  try {
    const response = await getWhiteLabelDomain(domain);
    if (response.groupEventId) {
      return {eventId: response.groupEventId, isGroup: true}
    } else if(response.redirectToAc) {
      return {eventId: response.redirectToAc, isGroup: false}
    }
  } catch (err) {
    console.log(err)
  }
}

export async function getServerSideProps(context: { req: {headers: {host: string}} }) : Promise<GetServerSidePropsResult<any>> {
  //&& !context.req.headers.host.includes('localhost')
  if (context.req.headers.host !== 'happin.app' && !context.req.headers.host.includes('localhost')) {
    const response = await whiteLabelDomain(context.req.headers.host)
    if (!response) {
      return {props: {}}
    }
    return {
      redirect: {
        permanent: false,
        destination: response.isGroup? `https://livestream.happin.app/event-schedule/${response.eventId}?host=${context.req.headers.host}` :`/post/${response.eventId}`
      }
    }
  }  
  return {props: {}}
}


