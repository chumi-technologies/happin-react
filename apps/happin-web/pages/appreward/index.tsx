import React, { useState } from 'react';
import { ArrowRight, Help, Lightning, Like, Switch } from "@icon-park/react";
import classnames from "classnames";
import SvgIcon from "@components/SvgIcon";
const dayList = [
  {
    day: 1,
    checked: true
  },
  {
    day: 2,
    checked: true
  },
  {
    day: 3,
    checked: false
  },
  {
    day: 4,
    checked: false
  },
  {
    day: 5,
    checked: false
  },
  {
    day: 6,
    checked: false
  },
  {
    day: 7,
    checked: false
  },
];
const Reward = () => {
  const [tabCur, setTabCur] = useState(0);
  const tab = ['Earn', 'Redeem']
  return (
    <div className="app-reward__page">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4 font-semibold text-gray-50">
          <div className="flex items-center">
            <span className="mr-1">Current Balance</span>
            <Help theme="outline" size="18" fill="currentColor" strokeWidth={4}/>
          </div>
          <div className="flex items-center">
            <span className="mr-2">Top Up Now</span>
            <ArrowRight theme="outline" size="16" fill="currentColor" strokeWidth={5}/>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl py-4">
          <div className="flex">
            <div className="flex-1 text-center">
              <img className="w-6 mx-auto" src="/images/icon-coin.svg" alt="" />
              <div className="mt-1 text-lg font-semibold text-gray-50">1,370</div>
              <div className="text-sm font-semibold text-gray-400">Coin</div>
            </div>
            <div className="flex-1 text-center">
              <img className="w-6 mx-auto" src="/images/icon-diamond.svg" alt="" />
              <div className="mt-1 text-lg font-semibold text-gray-50">220</div>
              <div className="text-sm font-semibold text-gray-400">Diamond</div>
            </div>
            <div className="relative flex-1 text-center">
              <div className="app-reward__exchange">
                <Switch theme="outline" size="20" fill="#fff"/>
              </div>
              <img className="w-6 mx-auto" src="/images/icon-cash.svg" alt="" />
              <div className="mt-1 text-lg font-semibold text-gray-50">22</div>
              <div className="text-sm font-semibold text-gray-400">Cash Value</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex px-4 pb-4">
        {
          tab.map((item, index) => (
            <div key={index} className="flex justify-center flex-1">
              <div
                className={classnames('app-reward__tab', {active: tabCur === index})}
                onClick={() => setTabCur(index)}
              >{item}</div>
            </div>
          ))
        }
      </div>
      <div className={classnames('px-4', {hidden: tabCur !== 0})}>
        <div className="bg-gray-800 rounded-xl px-4 py-6 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-gray-50 font-semibold text-xl">Daily Checkin</div>
            <button className="btn btn-sm btn-rose !rounded-full !font-semibold">Checkin Today</button>
          </div>
          <div className="mt-2 text-gray-400 text-sm">
            <span className="align-middle">Checkin 7 days in a row to win extra</span>
            <img className="inline align-middle w-4 ml-1.5 mr-1" src="/images/icon-coin.svg" alt="" />
            <span className="align-middle">50</span>
          </div>
          <div className="flex text-center mt-5 -ml-1 -mr-1">
            {
              dayList.map(item => (
                <div key={item.day} className={classnames('app-reward__day-item', {checked: item.checked})}>
                  <div className="app-reward__day">{item.day}</div>
                  <div className="app-reward__day-text">Day</div>
                </div>
              ))
            }
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl px-4 py-6 mb-4">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="text-xl text-white font-semibold mb-2">Earn 200 coins</div>
              <div className="text-gray-400 font-medium text-sm leading-5">Find a match from shared events for the first time</div>
            </div>
            <button className="btn btn-outline-rose btn-sm !rounded-full ml-4">Start Matching</button>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl px-4 py-6 mb-4">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="text-xl text-white font-semibold mb-2">Earn 200 Diamond</div>
              <div className="text-gray-400 font-medium text-sm leading-5">Join an event for the very first time</div>
            </div>
            <button className="btn btn-outline-rose btn-sm !rounded-full ml-4">Join Event</button>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl py-6 mb-4 text-center">
          <div className="px-4">
            <div className="text-xl text-white font-semibold mb-2">Invite Your Friends</div>
            <div className="mt-2 text-gray-400 text-sm">
              <span className="align-middle">Earn</span>
              <img className="inline align-middle w-4 ml-1.5 mr-1" src="/images/icon-coin.svg" alt="" />
              <span className="align-middle">300 for each successful invite</span>
            </div>
            <div className="my-5">
              <div className="inline-flex items-center py-2 px-2 border-2 border-solid border-gray-600 rounded-full text-white font-semibold">
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-600 mr-2">ID</div>
                <div className="mr-1">shakira_1211_wong</div>
              </div>
            </div>
          </div>
          <div className="flex text-gray-50 font-semibold">
            <div className="flex-1 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900">
                <SvgIcon id="copy" className="text-2xl" />
              </div>
              <div className="text-sm mt-2">Copy</div>
            </div>
            <div className="flex-1 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900">
                <SvgIcon id="share" className="text-2xl" />
              </div>
              <div className="text-sm mt-2">Share to Invite</div>
            </div>
            <div className="flex-1 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900">
                <SvgIcon id="add-user" className="text-2xl" />
              </div>
              <div className="text-sm mt-2">Add Friends</div>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl px-4 py-6 mb-4">
          <div className="text-xl text-white font-semibold mb-2">Weekly Earn</div>
          <div className="text-gray-400 font-medium text-sm leading-5">Complete weekly challenges to win coins up to 1,000</div>
          <div className="space-y-6 mt-5">
            <div className="flex items-center">
              <div className="app-reward__earn-icon">
                <SvgIcon id="livestream" className="text-2xl" />
              </div>
              <div className="mx-3 flex-1 text-gray-50">
                <div className="font-semibold text-sm leading-5">Watch Livestream</div>
                <div className="text-sm">
                  <img className="inline align-middle w-4 mr-1" src="/images/icon-coin.svg" alt="" />
                  <span className="align-middle">50</span>
                </div>
              </div>
              <button className="btn btn-outline-rose btn-sm !rounded-full ml-4">Watch Now</button>
            </div>
            <div className="flex items-center">
              <div className="app-reward__earn-icon">
                <SvgIcon id="document" className="text-2xl" />
              </div>
              <div className="mx-3 flex-1 text-gray-50">
                <div className="font-semibold text-sm leading-5">Create Event</div>
                <div className="text-sm">
                  <img className="inline align-middle w-4 mr-1" src="/images/icon-coin.svg" alt="" />
                  <span className="align-middle">100</span>
                </div>
              </div>
              <button className="btn btn-outline-rose btn-sm !rounded-full ml-4">Create Now</button>
            </div>
            <div className="flex items-center">
              <div className="app-reward__earn-icon">
                <SvgIcon id="watchparty" className="text-2xl" />
              </div>
              <div className="mx-3 flex-1 text-gray-50">
                <div className="font-semibold text-sm leading-5">Send Watchparty Invite</div>
                <div className="text-sm">
                  <img className="inline align-middle w-4 mr-1" src="/images/icon-coin.svg" alt="" />
                  <span className="align-middle">100</span>
                </div>
              </div>
              <button disabled className="btn btn-dark-light btn-sm !rounded-full ml-4">Claimed</button>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl px-4 py-6 mb-4">
          <div className="text-xl text-white font-semibold mb-2">Monthly Lucky Draw</div>
          <div className="text-gray-400 font-medium text-sm leading-5">Rewards are added to next month if no one wins. Winners will share the monthly prize.</div>
          <div className="space-y-6 mt-5">
            <div className="flex items-center">
              <div className="app-reward__earn-icon">
                <SvgIcon id="chat" className="text-2xl" />
              </div>
              <div className="mx-3 flex-1 text-gray-50">
                <div className="font-semibold text-sm leading-5">Host a Happin event group chat</div>
              </div>
              <div className="flex items-center ml-4">
                <img className="inline align-middle w-5 mr-1" src="/images/icon-diamond.svg" alt="" />
                <span className="text-gray-50 text-sm font-medium">1000</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="app-reward__earn-icon">
                <SvgIcon id="two-user" className="text-2xl" />
              </div>
              <div className="mx-3 flex-1 text-gray-50">
                <div className="font-semibold text-sm leading-5">Host a Happin event with 10 people joined</div>
              </div>
              <div className="flex items-center ml-4">
                <img className="inline align-middle w-5 mr-1" src="/images/icon-diamond.svg" alt="" />
                <span className="text-gray-50 text-sm font-medium">1000</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="app-reward__earn-icon">
                <SvgIcon id="group" className="text-2xl" />
              </div>
              <div className="mx-3 flex-1 text-gray-50">
                <div className="font-semibold text-sm leading-5">Host a Happin event with 100 people joined</div>
              </div>
              <div className="flex items-center ml-4">
                <img className="inline align-middle w-5 mr-1" src="/images/icon-diamond.svg" alt="" />
                <span className="text-gray-50 text-sm font-medium">1000</span>
              </div>
            </div>
          </div>
          <div className="text-center mt-6 text-sm text-gray-200">
            Total <span className="text-rose-500 font-semibold">13030</span> Winners
          </div>
        </div>
      </div>
      <div className={classnames('px-4', {hidden: tabCur !== 1})}>
        <div className="bg-gray-800 rounded-xl px-4 pt-3 pb-4 mb-4">
          <div className="text-lg leading-6 text-white font-semibold mb-1.5">
            <span className="align-middle">Remove Matching colddown</span>
            <img className="inline align-middle w-5 ml-2" src="/images/icon-coin.svg" alt="" />
          </div>
          <div className="text-gray-400 font-medium text-sm leading-5">You can remove 12hr colddown for matching with more like-minded people.</div>
        </div>
        <div className="bg-gray-800 rounded-xl px-4 pt-3 pb-4 mb-4">
          <div className="text-lg leading-6 text-white font-semibold mb-1.5">
            <span className="align-middle">Send virtual gift to cheer</span>
            <img className="inline align-middle w-5 ml-2" src="/images/icon-coin.svg" alt="" />
            <img className="inline align-middle w-5 ml-2" src="/images/icon-diamond.svg" alt="" />
          </div>
          <div className="text-gray-400 font-medium text-sm leading-5">Send virtual gift from livestream and audio rooms, let other people see you.</div>
        </div>
        <div className="bg-gray-800 rounded-xl px-4 pt-3 pb-4 mb-4">
          <div className="text-lg leading-6 text-white font-semibold mb-1.5">
            <span className="align-middle">Coupon for our tickets</span>
            <img className="inline align-middle w-5 ml-2" src="/images/icon-coin.svg" alt="" />
            <img className="inline align-middle w-5 ml-2" src="/images/icon-diamond.svg" alt="" />
          </div>
          <div className="text-gray-400 font-medium text-sm leading-5">Use coins like real money. When you purchase tickets with our events, you can get discounts.</div>
        </div>
        <div className="bg-gray-800 rounded-xl px-4 pt-3 pb-4 mb-4">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="text-lg leading-6 text-white font-semibold mb-1.5">
                <span className="align-middle">Cash Out Earning</span>
                <img className="inline align-middle w-5 ml-2" src="/images/icon-coin.svg" alt="" />
                <img className="inline align-middle w-5 ml-2" src="/images/icon-diamond.svg" alt="" />
              </div>
              <div className="text-gray-400 font-medium text-sm leading-5">Event creators can cash out diamonds above 100</div>
            </div>
            <img className="w-16 ml-4" src="/images/cash-out.svg" alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reward
