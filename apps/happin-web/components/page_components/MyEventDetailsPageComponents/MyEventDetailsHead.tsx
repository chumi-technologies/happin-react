import { Left } from '@icon-park/react';
import Link from 'next/link';
import React from 'react';

const MyEventDetailsHead = () => {
  return (
    <div className="relative bg-gray-800 border-b border-solid border-gray-700">
      <div className="container">
        <div className="flex items-center h-16 md:h-20">
          <Link href="/my-events">
            <button className="btn inline-flex items-center text-gray-300 hover:text-white !px-0">
              <Left theme="outline" size="24" fill="currentColor"/>
              <span className="md:ml-2">Back</span>
            </button>
          </Link>
          <div className="ml-5 lg:ml-10 flex-1 min-w-0">
            <div className="text-sm text-gray-300">Tickets for</div>
            <div className="truncate font-bold md:text-lg lg:text-xl">Kayzo + Special Guest K?D @ Markham Fairgrounds</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEventDetailsHead;
