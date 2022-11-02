import Link from 'next/link';
import { Avatar } from '@chakra-ui/react';
import React from 'react';
import IconPark from '@components/IconPark';

export type liveVideo = {
  _id: string;
  link: string;
  title: string;
  cover: string;
  avatar: string;
  username: string
}
export type LiveListProp = {
  list: liveVideo[];
}
const LiveList = ({ list } : LiveListProp) => {
  return (
    <div className="live-stream__live-list">
      <h2 className="mb-4 md:mb-5 text-lg md:text-xl lg:text-2xl text-gray-50 font-semibold black-title">Recommended Live Videos</h2>
      <div className="grid grid-cols-2 gap-4 lg:gap-6 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {
          list.map(item => (
            <div className="mb-1" key={item._id}>
              <div className="group relative w-full h-32 md:h-40 rounded-md overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition cursor-pointer z-10">
                  <IconPark name="play-one" size={32} />
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
                <div className="flex items-center mt-2">
                  <Avatar boxSize={6} mr={2} src={item.avatar} name={item.username} />
                  <span className="font-medium text-gray-200 text-sm">{item.username}</span>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default React.memo(LiveList);
