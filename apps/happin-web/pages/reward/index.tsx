import React from 'react';
import Countdown, { zeroPad } from 'react-countdown';
import IconPark from '@components/IconPark';

const Reward = () => {
  const count = ({ days, hours, minutes, seconds, completed }: any) => {
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
  return (
    <div className="reward__page">
      <div className="flex items-center px-3 pt-6 pb-4 text-white">
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
      <div className="pl-6 pr-12 mb-5">
        <div className="relative flex items-center">
          <div className="reward__progress flex-1">
            <div className="reward__progress-bar" style={{ width: '70%' }} />
          </div>
          <img className="absolute -right-6 w-8 z-10" src="images/gift-box.png" alt="" />
        </div>
      </div>
      <div className="bg-white bg-opacity-25 p-3">
        <div className="flex items-center">
          <IconPark name="stopwatch" size={20} />
          <span className="text-white uppercase ml-2 flex-1 font-semibold text-sm">Days Left</span>
          {/* <Countdown date={new Date(2022, 9, 1)} renderer={count} /> */}
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
                <IconPark name="like" size={18} color="#fe4365" />
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
                <IconPark name="lightning" size={18} color="#fe4365" />
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
      <div className="px-3 mb-3">
        <div className="rounded-lg p-3 bg-white">
          <div className="font-semibold mb-4">Rewards Rank</div>
          <div className="space-y-6">
            <div className="flex items-center">
              <img className="w-8" src="/images/champion.svg" alt="" />
              <div className="mx-3 flex-1 flex items-center">
                <img className="w-9 h-9 rounded-full" src="https://assets.website-files.com/5b9041fb091628c1f868ff07/5b90ef21e2a13a517dab54f3_Person%20Pic%202%402x.jpg" alt="" />
                <div className="font-semibold text-sm ml-3">Hilda Rodgers</div>
              </div>
              <div className="flex items-center">
                <img src="/images/coins.png" className="w-4" />
                <div className="font-semibold ml-1.5">2300</div>
              </div>
            </div>
            <div className="flex items-center">
              <img className="w-8" src="/images/second.svg" alt="" />
              <div className="mx-3 flex-1 flex items-center">
                <img className="w-9 h-9 rounded-full" src="https://assets.website-files.com/5b9041fb091628c1f868ff07/5b90ef21e2a13a9addab54f1_Person%20Pic%203%402x.jpg" alt="" />
                <div className="font-semibold text-sm ml-3">Gary Myers</div>
              </div>
              <div className="flex items-center">
                <img src="/images/coins.png" className="w-4" />
                <div className="font-semibold ml-1.5">2000</div>
              </div>
            </div>
            <div className="flex items-center">
              <img className="w-8" src="/images/third.svg" alt="" />
              <div className="mx-3 flex-1 flex items-center">
                <img className="w-9 h-9 rounded-full" src="https://assets.website-files.com/5b9041fb091628c1f868ff07/5b90ef21e2a13a121bab54ed_Person%20Pic%207%402x.jpg" alt="" />
                <div className="font-semibold text-sm ml-3">Ada Cook</div>
              </div>
              <div className="flex items-center">
                <img src="/images/coins.png" className="w-4" />
                <div className="font-semibold ml-1.5">1900</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-8 font-semibold text-center">4</div>
              <div className="mx-3 flex-1 flex items-center">
                <img className="w-9 h-9 rounded-full" src="https://assets.website-files.com/5b9041fb091628c1f868ff07/5b90ef21e2a13a6746ab54eb_Person%20Pic%205%402x.jpg" alt="" />
                <div className="font-semibold text-sm ml-3">Mayme Larson</div>
              </div>
              <div className="flex items-center">
                <img src="/images/coins.png" className="w-4" />
                <div className="font-semibold ml-1.5">1500</div>
              </div>
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
