import React, { Fragment, useState } from 'react';
import Link from 'next/link';
import classNames from "classnames";


export default function Events() {
  return (
    <div className="relative bg-gray-900 text-gray-50 z-0">
      <div className="relative overflow-hidden pt-36 pb-32 md:py-36 lg:py-44 xl:py-56 home__banner">
        <div className="container">
          <div className="absolute -left-14 lg:-left-20 xl:-left-28 top-8 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-56 xl:h-56 rounded-full bg-yellow-500" />
          <img className="absolute left-14 sm:left-20 md:left-32 lg:left-40 top-8 w-14 lg:w-20 xl:w-24" src="/images/music.png" alt="" />
          <div className="absolute top-10 rounded-full bg-green-500 events-right-circle">
            <div className="absolute -left-32 lg:-left-40 xl:-left-1/4 top-8 sm:top-24 lg:top-24 w-10 h-10 md:w-14 md:h-14 lg:w-20 lg:h-20 xl:w-20 xl:h-20 rounded-full bg-rose-500" />
          </div>
          <div className="relative black-title text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold sm:py-6 lg:py-8 xl:py-10 w-2/3 z-30">
            <div className="absolute -left-24 bottom-24 w-8 h-8 rounded-full home__color-pink z-10" />
            Find all fun and exciting experiences in one place.
          </div>
        </div>
      </div>
      <div className="relative pb-20 md:pb-32 lg:pb-40 -mt-12">
        <div className="container">
          <div className="relative inline-block text-lg sm:text-xl lg:text-2xl font-semibold mb-8 sm:mb-10 lg:mb-14">
            <img className="absolute top-0 -right-10 w-6 lg:-top-1 lg:-right-12 lg:w-8" src="/images/light.svg" alt="" />
            Major ticketing websites integrated. <br/> Get cash back buying tickets with Happin.
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-5 md:gap-8 lg:gap-10">
            <div className="relative bg-yellow-500 aspect-h-1 aspect-w-1 rounded-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <img width="70%" src="/images/ticketmaster.svg" alt="" />
              </div>
            </div>
            <div className="relative bg-blue-500 aspect-h-1 aspect-w-1 rounded-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <img width="70%" src="/images/universe.png" alt="" />
              </div>
            </div>
            <div className="relative home__color-purple aspect-h-1 aspect-w-1 rounded-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <img width="70%" src="/images/eventbrite.svg" alt="" />
              </div>
            </div>
            <div className="relative bg-green-500 aspect-h-1 aspect-w-1 rounded-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <img width="70%" src="/images/ticketweb.png" alt="" />
              </div>
            </div>
            <div className="relative bg-rose-500 aspect-h-1 aspect-w-1 rounded-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <img width="70%" src="/images/dice.svg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden pt-14 pb-20 md:py-32 lg:py-40">
        <div className="absolute left-24 md:left-96 top-0 md:top-10 w-6 h-6 md:w-8 md:h-8 rounded-full home__color-pink" />
        <div className="absolute left-80 -bottom-8 w-24 h-24 rounded-full bg-yellow-500" />
        <div className="container">
          <div className="flex items-center flex-col md:flex-row text-center md:text-left">
            <div className="relative sm:w-3/5 md:w-1/2 xl:w-7/12 black-title text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-7 md:mb-0 text-rose-500">
              Get rewards. <br/>
              Get tickets through <br/>
              Happin app.
            </div>
            <div className="md:pl-12 lg:pl-16 md:w-1/2 xl:w-5/12">
              <div className="relative text-lg font-semibold mb-12">
                <div className="absolute right-20 -top-10 w-4 h-4 rounded-full home__color-pink" />
                <p className="mb-4 md:mb-5">
                  When you buy tickets on Happin app, you will earn cash back or virtual coins for social features.
                </p>
              </div>
              <div className="flex justify-center md:justify-start">
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
    </div>
  );
}



