import React, { useState } from 'react';
import { ArrowRight, Help, Lightning, Like, Stopwatch, Switch } from '@icon-park/react';
import classnames from "classnames";
import SvgIcon from "@components/SvgIcon";
import { SearchIcon } from '@chakra-ui/icons';
import { Avatar } from '@chakra-ui/react';
import Countdown, { zeroPad } from 'react-countdown';


const Campaign = () => {
  const [tabCur, setTabCur] = useState<number>(2);
  const dayList = [
    {
      id: 1,
      text: 'Sign Up',
      date: '1.1'
    },
    {
      id: 2,
      text: 'Top 100',
      date: '1.8'
    },
    {
      id: 3,
      text: 'Top 50',
      date: '1.24'
    },
    {
      id: 4,
      text: 'Top 10',
      date: '1.31'
    },
    {
      id: 5,
      text: 'Finale',
      date: '2.7'
    },
  ];
  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed) {
      console.log('finish');
    } else {
      return (
        <div className="ml-2 flex items-center text-white">
          <div className="campaign__clock">
            <div>{days}</div>
          </div>
          <div className="text-xs font-medium mx-0.5">Days</div>
          <div className="campaign__clock">
            {zeroPad(hours)}
          </div>
          <div className="text-xs font-medium mx-0.5">Hr</div>
          <div className="campaign__clock">
            {zeroPad(minutes)}
          </div>
          <div className="text-xs font-medium mx-0.5">M</div>
          <div className="campaign__clock">
            {zeroPad(seconds)}
          </div>
          <div className="text-xs font-medium mx-0.5">S</div>
        </div>
      );
    }
  };

  
  return (
    <div className="overflow-y-auto theme-yellow max-w-md mx-auto">
      <div className="campaign__banner pt-8">
        <img className="w-2/3 mx-auto mb-5" src="/images/happy-birthday.png" alt="" />
        <div className="text-center pb-4">
          <div className="black-title font-bold text-xl px-3">
            Your dopest <span className="text-rose-500 font-extrabold">BIRTHDAY PARTY</span> ever
          </div>
          <div className="flex items-center justify-center mt-1 font-semibold text-sm">
            <span>ONLY ON</span>
            <img className="h-7 ml-2" src="/images/logo-full-dark.svg" alt="" />
          </div>
        </div>
      </div>
      <div className="campaign__tabs">
        <div className={classnames('campaign__tab-item black-title', {active: tabCur === 0})} onClick={() => setTabCur(0)}>
          About<br/>Campaign
        </div>
        <div className={classnames('campaign__tab-item black-title', {active: tabCur === 1})} onClick={() => setTabCur(1)}>
          Actions
        </div>
        <div className={classnames('campaign__tab-item black-title', {active: tabCur === 2})} onClick={() => setTabCur(2)}>
          Prize
        </div>
        <div className={classnames('campaign__tab-item black-title', {active: tabCur === 3})} onClick={() => setTabCur(3)}>
          Voting
        </div>
        <div className={classnames('campaign__tab-item black-title', {active: tabCur === 4})} onClick={() => setTabCur(4)}>
          Top 10<br/>Ranking
        </div>
      </div>
      <div className={classnames('pt-4', {hidden: tabCur !== 0})}>
        <div className="mb-5">
          <div className="px-4">
            <h2 className="text-base font-semibold mb-2 text-gray-50">About This Campaign</h2>
          </div>
          <div className="flex items-center py-1 px-4">
            <Stopwatch theme="outline" size="18" fill="#fff"/>
            <span className="text-white uppercase ml-2 flex-1 font-semibold text-tiny">Days Left</span>
            {/* <Countdown date={new Date(2022, 1, 1)} renderer={renderer} /> */}
          </div>
          <div className="px-4">
            <img className="my-4 rounded-sm" src="https://freephotos.cc/storage/preview/path/birthday-party-2210x1473.jpg" alt="" />
            <p className="mb-2 text-gray-200 text-sm">About This Campaign Desciprtion React Native platform-independent tabs. Could be used for bottom tab bars as well as sectioned views</p>
            <div className="flex text-center mt-5 -ml-1 -mr-1">
              {
                dayList.map(item => (
                  <div key={item.id} className="campaign__day-item">
                    {
                      item.id < 5 ? <div className="campaign__day" /> : (
                        <div className="campaign__day">
                          <div className="campaign__day-last">
                            <img className="w-3" src="/images/happin-single.svg" alt="" />
                          </div>
                        </div>
                      )
                    }
                    <div className="text-center">
                      <div className="text-gray-50 text-sm font-semibold">{item.text}</div>
                      <div className="text-gray-400 text-sm font-medium">{item.date}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
        <div className="mb-5 px-4">
          <h2 className="text-base font-semibold mb-2 text-gray-50">How to Participate</h2>
          <p className="mb-2 text-gray-200 text-sm">About This Campaign Desciprtion React Native platform-independent tabs. Could be used for bottom tab bars as well as sectioned views</p>
        </div>
        <div className="mb-5 px-4">
          <h2 className="text-base font-semibold mb-2 text-gray-50">Campaign Reward</h2>
          <p className="mb-2 text-gray-200 text-sm">About This Campaign Desciprtion React Native platform-independent tabs. Could be used for bottom tab bars as well as sectioned views</p>
        </div>
      </div>
      <div className={classnames('pt-4', {hidden: tabCur !== 1})}>
        <div className="mb-5 px-4">
          <div className="flex items-center pt-3 pb-1 text-white">
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
        </div>
        <div className="px-4 mb-3">
          <div className="rounded-lg p-3 bg-white bg-opacity-10">
            <div className="font-semibold mb-4 text-gray-50">9 Ways to win</div>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-9 h-9 bg-rose-100 rounded-full">
                  <Like theme="filled" size="18" fill="#fe4365"/>
                </div>
                <div className="mx-3 flex-1">
                  <div className="font-semibold text-sm leading-5 text-gray-50">Visit Gleam on Facebook</div>
                  <div className="text-xs text-gray-300">Desc on Facebook</div>
                </div>
                <button className="reward__btn campaign">
                  <span className="flex-1">+20</span>
                  <img src="/images/coins.png" className="w-5" />
                </button>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-9 h-9 bg-rose-100 rounded-full">
                  <Lightning theme="filled" size="18" fill="#fe4365"/>
                </div>
                <div className="mx-3 flex-1">
                  <div className="font-semibold text-sm leading-5 text-gray-50">Submit a Selfie</div>
                  <div className="text-xs text-gray-300">Desc Submit a Selfie</div>
                </div>
                <button className="reward__btn campaign finished">Gotten</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={classnames('pt-4', {hidden: tabCur !== 2})}>
        <div className="text-center font-bold text-lg text-white mb-4">Win Your Gifts</div>
        <div className="px-4 mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-md overflow-hidden">
              <img src="/images/reward-01.jpg" className="w-full" alt="" />
              <div className="px-3 py-2 text-white font-medium text-center text-sm bg-gray-700">iPhone 13 256G</div>
            </div>
            <div className="rounded-md overflow-hidden">
              <img src="/images/reward-02.jpg" className="w-full" alt="" />
              <div className="px-3 py-2 text-white font-medium text-center text-sm bg-gray-700">Dyson V12</div>
            </div>
          </div>
        </div>
      </div>
      <div className={classnames('p-4', {hidden: tabCur !== 3})}>
        <div className="relative flex items-center">
          <label htmlFor="search" className="absolute left-4 leading-none inline-flex transition text-gray-400">
            <SearchIcon w={4} h={4} color="currentColor" />
          </label>
          <input id="search" type="text" className="campaign__search-input" placeholder="Search" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-5">
          <div className="mb-2">
            <div className="relative aspect-h-16 aspect-w-9 rounded-xl overflow-hidden">
              <div className="flex items-center justify-center absolute inset-0">
                <img className="w-full h-full object-cover" src="https://freephotos.cc/storage/preview/path/enjoying-sun-during-morning-yoga-2210x1473.jpg" alt="" />
                <div className="absolute">
                  <SvgIcon id="play" className="text-white w-12 h-12" />
                </div>
              </div>
            </div>
            <div className="text-center mt-2">
              <div className="text-yellow-500 text-lg font-bold">JessiJm146</div>
              <div className="text-sm text-gray-300 mb-2">@jesmong146</div>
              <button className="btn btn-sm btn-rose !px-6 !rounded-full !font-semibold">Vote</button>
            </div>
          </div>
          <div className="mb-2">
            <div className="relative aspect-h-16 aspect-w-9 rounded-xl overflow-hidden">
              <div className="flex items-center justify-center absolute inset-0">
                <img className="w-full h-full object-cover" src="https://freephotos.cc/storage/preview/path/enjoying-sun-during-morning-yoga-2210x1473.jpg" alt="" />
                <div className="absolute">
                  <SvgIcon id="play" className="text-white w-12 h-12" />
                </div>
              </div>
            </div>
            <div className="text-center mt-2">
              <div className="text-yellow-500 text-lg font-bold">JessiJm146</div>
              <div className="text-sm text-gray-300 mb-2">@jesmong146</div>
              <button className="btn btn-sm btn-rose !px-6 !rounded-full !font-semibold">Vote</button>
            </div>
          </div>
          <div className="mb-2">
            <div className="relative aspect-h-16 aspect-w-9 rounded-xl overflow-hidden">
              <div className="flex items-center justify-center absolute inset-0">
                <img className="w-full h-full object-cover" src="https://freephotos.cc/storage/preview/path/enjoying-sun-during-morning-yoga-2210x1473.jpg" alt="" />
                <div className="absolute">
                  <SvgIcon id="play" className="text-white w-12 h-12" />
                </div>
              </div>
            </div>
            <div className="text-center mt-2">
              <div className="text-yellow-500 text-lg font-bold">JessiJm146</div>
              <div className="text-sm text-gray-300 mb-2">@jesmong146</div>
              <button className="btn btn-sm btn-rose !px-6 !rounded-full !font-semibold">Vote</button>
            </div>
          </div>
          <div className="mb-2">
            <div className="relative aspect-h-16 aspect-w-9 rounded-xl overflow-hidden">
              <div className="flex items-center justify-center absolute inset-0">
                <img className="w-full h-full object-cover" src="https://freephotos.cc/storage/preview/path/enjoying-sun-during-morning-yoga-2210x1473.jpg" alt="" />
                <div className="absolute">
                  <SvgIcon id="play" className="text-white w-12 h-12" />
                </div>
              </div>
            </div>
            <div className="text-center mt-2">
              <div className="text-yellow-500 text-lg font-bold">JessiJm146</div>
              <div className="text-sm text-gray-300 mb-2">@jesmong146</div>
              <button className="btn btn-sm btn-rose !px-6 !rounded-full !font-semibold">Vote</button>
            </div>
          </div>
        </div>
      </div>
      <div className={classnames({hidden: tabCur !== 4})}>
        <div className="campaign__top-three flex pt-9">
          <div className="flex-1 text-center">
            <div className="flex items-center h-24">
              <div className="relative w-16 h-16 mx-auto">
                <img className="w-full h-hull rounded-full border-3 border-solid border-blue-500" src="https://assets.website-files.com/5b9041fb091628c1f868ff07/5b90ef21e2a13a121bab54ed_Person%20Pic%207%402x.jpg" alt="" />
                <div className="absolute left-1/2 -ml-2.5 -bottom-2 w-5 h-5 bg-blue-500 rounded-full inline-flex justify-center items-center text-gray-900 font-bold text-sm">2</div>
              </div>
            </div>
            <div className="px-2">
              <div className="text-blue-500 truncate font-bold text-lg">JessiJm146</div>
              <div className="text-sm text-gray-300">@jesmong146</div>
              <div className="text-sm text-blue-500 font-bold black-title">2719472</div>
            </div>
          </div>
          <div className="flex-1 text-center">
            <div className="flex items-center h-24">
              <div className="relative w-20 h-20 flex justify-center mx-auto">
                <div className="absolute -top-6">
                  <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                    <path d="M0 16.1174V5.16229C0 3.84529 1.70629 3.32567 2.44035 4.41912L5.23948 8.58867C5.51014 8.99184 6.10723 8.97964 6.36121 8.56576L11.2272 0.635978C11.7476 -0.211993 12.9797 -0.211992 13.5001 0.635979L18.3284 8.50437C18.5915 8.93316 19.2166 8.92713 19.4714 8.49335L21.517 5.01102C22.2053 3.83937 24 4.3275 24 5.68634V16.1174C24 16.8537 23.403 17.4507 22.6667 17.4507H1.33333C0.596954 17.4507 0 16.8537 0 16.1174Z" fill="url(#linear)"/>
                    <defs>
                      <linearGradient id="linear" x1="12" y1="0" x2="12" y2="17.4507" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FF9F46"/>
                        <stop offset="1" stopColor="#FFF846"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <img className="w-full h-hull rounded-full border-3 border-solid border-yellow-500" src="https://assets.website-files.com/5b9041fb091628c1f868ff07/5b90ef21e2a13a517dab54f3_Person%20Pic%202%402x.jpg" alt="" />

              </div>
            </div>
            <div className="px-2">
              <div className="text-yellow-500 truncate font-bold text-lg">AmandaS</div>
              <div className="text-sm text-gray-300">@amSS.anada</div>
              <div className="text-base text-yellow-500 font-bold black-title">3719472</div>
            </div>
          </div>
          <div className="flex-1 text-center">
            <div className="flex items-center h-24">
              <div className="relative w-16 h-16 mx-auto">
                <img className="w-full h-hull rounded-full border-3 border-solid border-pink-500" src="https://assets.website-files.com/5b9041fb091628c1f868ff07/5b90ef21e2a13a9addab54f1_Person%20Pic%203%402x.jpg" alt="" />
                <div className="absolute left-1/2 -ml-2.5 -bottom-2 w-5 h-5 bg-pink-500 rounded-full inline-flex justify-center items-center text-gray-900 font-bold text-sm">3</div>
              </div>
            </div>
            <div className="px-2">
              <div className="text-pink-500 truncate font-bold text-lg">Jackm</div>
              <div className="text-sm text-gray-300">@jackqueen</div>
              <div className="text-sm text-pink-500 font-bold black-title">1395893</div>
            </div>
          </div>
        </div>
        <div className="space-y-5 px-5 mt-6 pb-6">
          <div className="flex items-center">
            <div className="text-gray-50 font-bold mr-4">04</div>
            <Avatar boxSize={12} src="https://freephotos.cc/storage/preview/path/enjoying-sun-during-morning-yoga-2210x1473.jpg" />
            <div className="flex-1 min-w-0 mx-4 truncate">
              <div className="text-rose-500 text-base font-bold">JessiJm146</div>
              <div className="text-sm text-gray-300">@jesmong146</div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-xs font-bold">Received Likes</div>
              <div className="text-base text-gray-50 font-bold black-title">291847</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-gray-50 font-bold mr-4">05</div>
            <Avatar boxSize={12} src="https://freephotos.cc/storage/preview/path/enjoying-sun-during-morning-yoga-2210x1473.jpg" />
            <div className="flex-1 min-w-0 mx-4 truncate">
              <div className="text-rose-500 text-base font-bold">Andrew</div>
              <div className="text-sm text-gray-300">@jesmong146</div>
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-xs font-bold">Received Likes</div>
              <div className="text-base text-gray-50 font-bold black-title">191847</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Campaign
