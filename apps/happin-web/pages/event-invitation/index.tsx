import React from 'react';
import { Avatar } from '@chakra-ui/react';
import SvgIcon from '@components/SvgIcon';

const EventInvitation = () => {
  return (
    <div className="w-full overflow-y-auto max-w-md mx-auto">
      <div className="event-invitation__banner">
        <div className="pt-8 px-4 mb-5 text-center">
          <h1 className="text-gray-900 text-3xl black-title font-extrabold">Event Invitation</h1>
        </div>
        <div className="px-4">
          <div className="rounded-2xl bg-gray-800">
            <div className="text-center pt-4 px-4">
              <div className="event-invitation__avatar-bg">
                <Avatar boxSize={16} src="https://freephotos.cc/storage/preview/path/enjoying-sun-during-morning-yoga-2210x1473.jpg" />
                <h2 className="text-gray-100 text-2xl font-extrabold black-title mt-5 mb-4">You have an invitation</h2>
                <div className="text-gray-400 text-base font-medium">
                  <p><span className="text-gray-100">ElizaaaU</span> invited you</p>
                  <p className="mt-0.5">to this event with other 74 Happiners</p>
                </div>
              </div>
            </div>
            <div className="relative flex items-center h-12 px-8 overflow-hidden">
              <div className="absolute -left-6 w-12 h-12 rounded-full bg-gray-900" />
              <div className="w-full border-t-8 border-dotted border-gray-900" />
              <div className="absolute -right-6 w-12 h-12 rounded-full bg-gray-900" />
            </div>
            <div className="flex p-5 pt-2">
              <img className="w-20 h-20 rounded-md object-cover" src="https://cdn.sspai.com/editor/u_/c8a3chtb34tc9r2opv5g.png" alt="" />
              <div className="ml-4 flex-1 min-w-0">
                <div className="text-yellow-500 font-semibold text-sm mb-1">Fri, July 2・6 PM</div>
                <div className="text-gray-100 font-semibold ellipsis-2 text-sm mb-1">American Express UNSTAGED with Maroon5</div>
                <div className="flex items-center text-sm">
                  <SvgIcon id="location" className="text-xs text-gray-400 mr-1" />
                  <div className="flex-1 text-gray-400 truncate">The Bowery Club, Toronto</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4">
        <h1 className="mt-6 mb-4 text-2xl black-title font-extrabold text-rose-500">Meet Interesting People in this event</h1>
      </div>
      <div className="relative w-full flex gap-3 snap-x overflow-x-auto hide-scrollbar">
        <div className="snap-center w-[28%] shrink-0 first:ml-4 last:mr-4">
          <img className="shrink-0 w-full aspect-[9/16] object-cover rounded-lg"
               src="https://images.unsplash.com/photo-1645301188542-6e42abab843c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80" />
          <div className="mt-1 text-sm font-semibold text-gray-100">Ding</div>
        </div>
        <div className="snap-center w-[28%] shrink-0 first:ml-4 last:mr-4">
          <img className="shrink-0 w-full aspect-[9/16] object-cover rounded-lg"
               src="https://images.unsplash.com/photo-1644094877479-facb0d5fc7da?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80" />
          <div className="mt-1 text-sm font-semibold text-gray-100">Emily</div>
        </div>
        <div className="snap-center w-[28%] shrink-0 first:ml-4 last:mr-4">
          <img className="shrink-0 w-full aspect-[9/16] object-cover rounded-lg"
               src="https://images.unsplash.com/photo-1645054623087-63ce1f187a65?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80" />
          <div className="mt-1 text-sm font-semibold text-gray-100">Esther</div>
        </div>
        <div className="snap-center w-[28%] shrink-0 first:ml-4 last:mr-4">
          <img className="shrink-0 w-full aspect-[9/16] object-cover rounded-lg"
               src="https://images.unsplash.com/photo-1645023039027-4703a36b2d42?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80" />
          <div className="mt-1 text-sm font-semibold text-gray-100">Amber</div>
        </div>
        <div className="snap-center w-[28%] shrink-0 first:ml-4 last:mr-4">
          <img className="shrink-0 w-full aspect-[9/16] object-cover rounded-lg"
               src="https://images.unsplash.com/photo-1590136761210-cfef45227cd5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80" />
          <div className="mt-1 text-sm font-semibold text-gray-100">Alice</div>
        </div>
      </div>
      <div className="px-4 mt-4">
        <div className="text-gray-400 text-[15px] font-medium">
          <span className="mr-2">🔥</span><span className="text-gray-100">HelenaLopes </span>and other 74 people have joined
        </div>
        <div className="text-gray-400 text-[15px] font-medium">
          <span className="mr-2">🎉</span><span className="text-gray-100">24 event group chats </span>created
        </div>
        <div className="text-gray-400 text-[15px] font-medium">
          <span className="mr-2">👋</span><span className="text-gray-100">14 participants </span>matched
        </div>
      </div>
      <div className="mt-12 px-10 pb-6">
        <button className="btn btn-rose !rounded-full !font-bold w-full flex items-center justify-center">
          <span>Join Event and Earn 10</span>
          <img className="inline align-middle w-5 ml-2" src="/images/icon-diamond.svg" alt="" />
        </button>
        <div className="text-center mt-2">
          <button className="btn text-gray-100 active:text-rose-500">View Event Details</button>
        </div>
      </div>
    </div>
  )
}

export default EventInvitation
