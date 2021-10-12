import React from 'react';
import SvgIcon from '@components/SvgIcon';
import { MyEventItemDataProps } from 'lib/model/myEvents';
import Link from 'next/link';
import moment from 'moment';

export type MyEventItemProps = {
  data: MyEventItemDataProps;
  onItemClick:(acid:string,ownerId:string)=>void
}

const EventListItem = ({ data,onItemClick }: MyEventItemProps) => {
  return (
    <div onClick={()=>{onItemClick(data._id,data._creator)}} className="group cursor-pointer">
      <div className="relative">
        <div className="aspect-w-16 aspect-h-9">
          <div className="bg-black bg-opacity-0 group-hover:bg-opacity-20 transition z-10" />
          <img src={`https://images.chumi.co/${data.cover}`}
               alt={data.title}
               className="w-full h-full object-center object-cover rounded-md" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-sm mb-1 text-gray-700">
        {moment(data.startTime).format('dddd MMMM Do, h:mma')}
        </div>
        <div className="truncate font-semibold mb-2 group-hover:text-rose-500 transition">{data.title}
        </div>
        <div className="flex items-center">
          <SvgIcon id="location" className="text-sm text-black" />
            {data.location}
        </div>
      </div>
    </div>
  );
};

export default EventListItem;
