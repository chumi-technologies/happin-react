import React, { useEffect, useState } from 'react';
import { Lightning, Like, Stopwatch } from '@icon-park/react';
import Countdown, { zeroPad } from 'react-countdown';

const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
  if (completed) {
    console.log('finish');
  } else {
    return (
      <div className="ml-2 flex items-center text-white">
        <div className="reward__clock">
          <div>{days}</div>
        </div>
        <div className="text-xs font-medium mx-0.5">Days</div>
        <div className="reward__clock">
          {zeroPad(hours)}
        </div>
        <div className="text-xs font-medium mx-0.5">Hr</div>
        <div className="reward__clock">
          {zeroPad(minutes)}
        </div>
        <div className="text-xs font-medium mx-0.5">M</div>
        <div className="reward__clock">
          {zeroPad(seconds)}
        </div>
        <div className="text-xs font-medium mx-0.5">S</div>
      </div>
    );
  }
};

const Reward = () => {
  return (
    <div className="reward__page">
      <div className="flex items-center px-3 pt-6 pb-5 text-white">
        <div className="flex-1 text-center">
          <div className="text-sm font-medium text-white text-opacity-80 uppercase">Your Score</div>
          <div className="black-title font-bold text-2xl mt-0.5">500</div>
        </div>
        <div className="w-px h-6 mx-3 bg-white bg-opacity-20" />
        <div className="flex-1 text-center">
          <div className="text-sm font-medium text-white text-opacity-80 uppercase">Total Score</div>
          <div className="black-title font-bold text-2xl mt-0.5">50366</div>
        </div>
      </div>
      <div className="bg-white bg-opacity-25 p-3">
        <div className="flex items-center">
          <Stopwatch theme="outline" size="20" fill="#fff"/>
          <span className="text-white uppercase ml-2 flex-1 font-semibold text-sm">Days Left</span>
          <Countdown date={new Date(2022, 1, 1)} renderer={renderer} />
        </div>
      </div>
      <div className="reward__title mb-3">Win Your Gifts</div>
      <div className="px-3 mb-3">
        <div className="grid grid-cols-2 gap-2 rounded-lg p-2 bg-white bg-opacity-50">
          <div className="rounded-md overflow-hidden">
            <img src="/images/reward-01.jpg" className="w-full" alt="" />
            <div className="reward__tag">iPhone 13 256G</div>
          </div>
          <div className="rounded-md overflow-hidden">
            <img src="/images/reward-02.jpg" className="w-full" alt="" />
            <div className="reward__tag">Dyson V12</div>
          </div>
        </div>
      </div>
      <div className="px-3 mb-3">
        <div className="rounded-lg p-3 bg-white">
          <div className="font-semibold mb-4">9 Ways to win</div>
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-9 h-9 bg-rose-100 rounded-full">
                <Like theme="filled" size="18" fill="#fe4365"/>
              </div>
              <div className="mx-3 flex-1">
                <div className="font-semibold text-sm leading-5">Visit Gleam on Facebook</div>
                <div className="text-xs text-gray-400">Desc on Facebook</div>
              </div>
              <button className="reward__btn">
                <span className="flex-1">+20</span>
                <img src="/images/coins.png" className="w-5" />
              </button>
            </div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-9 h-9 bg-rose-100 rounded-full">
                <Lightning theme="filled" size="18" fill="#fe4365"/>
              </div>
              <div className="mx-3 flex-1">
                <div className="font-semibold text-sm leading-5">Submit a Selfie</div>
                <div className="text-xs text-gray-400">Desc Submit a Selfie</div>
              </div>
              <button className="reward__btn finished">Gotten</button>
            </div>
          </div>
        </div>
      </div>
      <div className="px-3">
        <div className="rounded-lg p-3 bg-white bg-opacity-30">
          <div className="font-semibold mb-3">Rewards Rules</div>
          <div className="space-y-2">
            <p className="text-xs text-gray-600">1. React makes it painless to create interactive UIs. Design simple views for each state in your application</p>
            <p className="text-xs text-gray-600">2. React will efficiently update and render just the right components when your data changes. Declarative views make your code more predictable, simpler to understand, and easier to debug.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reward
