import { useState } from "react";
import Link from 'next/link';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import Plx from 'react-plx';
import classNames from "classnames";
import { Stack } from '@chakra-ui/react';

const imageList = [
  '/images/home-feature-02.png',
  '/images/home-feature-02.png',
  '/images/home-feature-02.png',
];
const buildEvent = [
  {
    title: 'Sell tickets online',
    desc: 'Create events on Happin and sell tickets to your in-person and online events. You decide how much and how many.'
  },
  {
    title: 'Add Livestreaming, VIP Meet and Greets and more to your events',
    desc: 'High-definition video at up to 1080p 60fps, to both mobile and desktop attendees. Happin also streams audio at 48khz full-sound bandwidth, providing natural audio reproduction.'
  },
  {
    title: 'Review your analytics',
    desc: 'Access our extensive reporting system plus view and download to see full event metrics.'
  },
];
export default function Home() {
  const [buildCur, setBuildCur] = useState<number>(0);
  return (
    <div className="relative bg-black text-white z-0">
      <div className="relative overflow-hidden pt-48 pb-40 md:py-64 lg:py-96 home__banner">
        <div className="container">
          <div className="absolute -left-14 lg:-left-20 xl:-left-28 top-12 w-24 h-24 md:w-32 md:h-32 lg:w-48 lg:h-48 xl:w-56 xl:h-56 rounded-full bg-yellow-500" />
          <div className="hidden sm:block absolute right-1/3 lg:right-1/4 top-8 md:top-20 w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded-full bg-yellow-500" />
          <img className="absolute left-14 sm:left-20 md:left-32 lg:left-40 top-8 w-14 lg:w-20 xl:w-24" src="/images/music.png" alt="" />
          <img className="absolute left-40 md:left-1/3 lg:right-auto xl:left-auto xl:right-1/3 top-2 md:top-8 h-20 md:h-28 lg:h-36 xl:h-44" src="/images/mc.png" alt="" />
          <div className="absolute top-10 md:top-40 rounded-full bg-green-500 right-circle">
            <img className="absolute -left-20 md:-left-36 top-20 sm:top-16 lg:top-14 xl:top-10 h-14 md:h-24 lg:h-28 xl:h-32 z-10" src="/images/sge.png" alt="" />
            <img className="absolute -left-16 sm:-left-12 md:-left-16 lg:-left-12 bottom-16 top-auto sm:bottom-auto sm:top-1/2 -mt-8 md:-mt-16 h-14 md:h-20 lg:h-28 xl:h-32 z-10" src="/images/asp.png" alt="" />
            <div className="hidden sm:block absolute left-10 lg:left-20 top-1/2 mt-8 lg:mt-20 w-8 h-8 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full bg-white z-10" />
            <div className="absolute -left-10 top-20 lg:top-28 mt-20 w-4 h-4 lg:w-6 lg:h-6 xl:w-8 xl:h-8 rounded-full bg-white z-10" />
            <div className="absolute left-0 sm:-left-24 md:-left-28 lg:-left-56 -bottom-12 sm:bottom-20 w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 xl:w-44 xl:h-44 rounded-full bg-rose-500 z-10" />
          </div>
          <div className="relative black-title text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold w-2/3 z-30">
            <div className="absolute left-12 md:left-16 xl:left-20 -top-6 md:-top-14 lg:-top-24 xl:-top-32 w-12 md:w-16 h-2 lg:w-20 lg:h-3 xl:w-24 xl:h-4 home__color-purple" />
            <div className="absolute -left-24 bottom-24 w-8 h-8 rounded-full home__color-pink z-10" />
            <div className="absolute -left-2 lg:-left-4 -bottom-24 lg:-bottom-32 xl:-bottom-36 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full home__color-purple z-10" />
            Deep <br/>connections with like-minded people via events
          </div>
          <img className="absolute left-32 lg:left-24 bottom-24 h-14 md:h-24 lg:h-28 xl:h-32" src="/images/fnl.png" alt="" />
        </div>
      </div>
      <div className="relative overflow-hidden pt-14 pb-20 md:py-40">
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
                  With Collab Smart Prototype you create your interactions and animations once and store as presets in the cloud for future use.
                </p>
                <p>Use the Collab App to test in real-time.</p>
              </div>
              <button className="btn sm:btn-lg btn-rose">Download Happin</button>
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
              className="relative w-full h-full max-w-lg sm:max-w-none sm:w-9/12 md:w-full mx-auto flex justify-center items-center">
              <SwitchTransition mode="out-in">
                <CSSTransition
                  key={buildCur}
                  addEndListener={(node, done) => {
                    node.addEventListener('transitionend', done, false);
                  }}
                  classNames="home__fade"
                >
                  <img className="w-full" src={imageList[buildCur]} alt="" />
                </CSSTransition>
              </SwitchTransition>
            </div>
          </div>
        </div>
      </div>
      <footer className="px-4">
        <div className="container divide-y divide-white divide-opacity-20">
          <div className="flex flex-col sm:justify-between flex-wrap sm:flex-row pt-10">
            <div className="w-52 mb-8 sm:mb-10">
              <h3 className="tracking-wide uppercase font-bold text-sm">Product</h3>
              <ul className="foot-menu">
                <li>
                  <Link href="/">Download</Link>
                </li>
              </ul>
            </div>
            <div className="w-52 mb-8 sm:mb-10">
              <h3 className="tracking-wide uppercase font-bold text-sm">Happin</h3>
              <ul className="foot-menu">
                <li>
                  <Link href="/">About Us</Link>
                </li>
                <li>
                  <Link href="/">Upcoming LiveStreams</Link>
                </li>
                <li>
                  <Link href="/">Brand Partners</Link>
                </li>
                <li>
                  <Link href="/">Join our Mailing List</Link>
                </li>
              </ul>
            </div>
            <div className="w-52 mb-8 sm:mb-10">
              <h3 className="tracking-wide uppercase font-bold text-sm">Resources</h3>
              <ul className="foot-menu">
                <li>
                  <Link href="/">News</Link>
                </li>
                <li>
                  <Link href="/">Contact Us</Link>
                </li>
                <li>
                  <Link href="/">Terms Of Service</Link>
                </li>
                <li>
                  <Link href="/">Privacy Policy</Link>
                </li>
              </ul>
            </div>
            <div className="w-52 mb-8 sm:mb-10">
              <h3 className="tracking-wide uppercase font-bold text-sm">Socials</h3>
              <ul className="foot-menu">
                <li>
                  <Link href="/">Facebook</Link>
                </li>
                <li>
                  <Link href="/">Twitter</Link>
                </li>
                <li>
                  <Link href="/">Instagram</Link>
                </li>
              </ul>
            </div>
            <div className="w-52 mb-8 sm:mb-10">
              <h3 className="tracking-wide uppercase font-bold text-sm">Apps Download</h3>
              <div className="mt-4">
                <a target="_blank" href="https://apps.apple.com/app/id1527348429">
                  <img className="h-10 hover:opacity-90 transition" src="/images/app-store-white.svg" alt="app-store" />
                </a>
              </div>
            </div>
          </div>
          <div className="py-6 text-sm text-gray-400">© 2021 Happin. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
