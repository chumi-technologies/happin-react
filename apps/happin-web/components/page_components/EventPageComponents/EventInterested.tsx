import Link from 'next/link';
import { Avatar } from '@chakra-ui/react';
import React from 'react';

export type EventInterestedItem = {
  _id: string;
  link: string;
  title: string;
  cover: string;
  avatar: string;
  username: string;
  members?: number;
}

const EventInterested = ({ list }: { list: EventInterestedItem[]} ) => {
  return (
    <>
      <div className="black-title text-xl sm:text-2xl font-semibold">You may also interested in</div>
      <div className="grid grid-cols-2 gap-4 lg:gap-5 sm:grid-cols-2 mt-3 sm:mt-5">
        {
          list.map(item => (
            <div className="mb-1" key={item._id}>
              <div className="group relative w-full aspect-[4/3] rounded-md overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition cursor-pointer z-10">
                </div>
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 overflow-hidden">
                    <img src={item.cover} alt={item.title}
                         className="absolute min-w-full min-h-full mx-auto live-stream__cover-filter" />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-50" />
                  <div className="absolute w-full h-full flex">
                    <img src={item.cover} alt={item.title}
                         className="max-w-full max-h-full m-auto" />
                  </div>
                </div>
              </div>
              <div className="mt-2 sm:mt-3">
                <Link href={item.link}>
                  <a className="text-gray-50 ellipsis-2 text-15 font-medium">{item.title}</a>
                </Link>
                {
                  item.members && item.members > 0 ? (
                    <div className="font-medium text-gray-400 text-sm mt-2">
                      {item.members} people joined event
                    </div>
                  ) : (
                    <div className="flex items-center mt-2">
                      <Avatar boxSize={6} mr={2} src={item.avatar} name={item.username} />
                      <span className="font-medium text-gray-400 text-sm">{item.username}</span>
                    </div>
                  )
                }

              </div>
            </div>
          ))
        }
      </div>
    </>
  );
};

export default React.memo(EventInterested);
