import { Left } from '@icon-park/react';
import Link from 'next/link';
import React from 'react';
import {EventDetail} from '../../../lib/model/event';

export type MyEventDetailsProp = {
    eventDetail:EventDetail;
}

const MyEventDetailsHead = ({eventDetail}:MyEventDetailsProp) => {

  const generateInfo = (data:any)=>{
    if (data.event?.acInfo?.location) {
      return <div className="truncate font-bold md:text-lg lg:text-xl">{`${data.event?.title} @${data.event?.acInfo?.location}`}</div>
    } else if (data.event?.city  || data.event?.state) {
      return <div className="truncate font-bold md:text-lg lg:text-xl">{`${data.event?.title} @${data.event?.city} ${data.event?.state}`}</div>
    } else {
      return <div className="truncate font-bold md:text-lg lg:text-xl">{`${data.event?.title}`}</div>
    }
  }

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
            {generateInfo(eventDetail)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEventDetailsHead;
