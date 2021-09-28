import React from 'react';
import SvgIcon from '@components/SvgIcon';
import { Tooltip, VStack } from '@chakra-ui/react';
import { MyEventItemDataProps } from 'lib/model/myEvents';
import Link from 'next/link';

export type MyEventItemProps = {
  data: MyEventItemDataProps;
}

const MyEventItem = ({ data }: MyEventItemProps) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative">
        {
          data.livestream && (
            <div className="absolute left-3 top-3 inline-flex items-center bg-rose-500 rounded-md px-1.5 py-0.5 z-20">
              <SvgIcon id="livestream" className="text-white" />
              <div className="ml-2 text-sm text-gray-200 font-medium">Livestream</div>
            </div>
          )
        }
        <div className="hidden md:block absolute right-2 top-2 z-20 opacity-0 group-hover:opacity-100 transition">
          <VStack spacing={1.5}>
            <Tooltip label="Ticket" placement="left" bg="gray.900" borderRadius="md" hasArrow arrowSize={8} shouldWrapChildren>
              {/*https://nextjs.org/docs/tag/v9.5.2/api-reference/next/link#dynamic-routes*/}
              <Link href={`/my-events/event-details?id=${data.id}&page=0`}
                    as={`/my-events/event-details/${data.id}/tickets`}>
                <div className="my-events__cover-action">
                  <SvgIcon id="ticket-bold" />
                </div>
              </Link>
            </Tooltip>
            <Tooltip label="Merch" placement="left" bg="gray.900" borderRadius="md" hasArrow arrowSize={8} shouldWrapChildren>
              <Link href={`/my-events/event-details?id=${data.id}&page=1`}
                    as={`/my-events/event-details/${data.id}/merch`}>
                <div className="my-events__cover-action">
                  <SvgIcon id="bag-bold" />
                </div>
              </Link>
            </Tooltip>
            <Tooltip label="Replay Video" placement="left" bg="gray.900" borderRadius="md" hasArrow arrowSize={8} shouldWrapChildren>
              <Link href={`/my-events/event-details?id=${data.id}&page=2`}
                    as={`/my-events/event-details/${data.id}/replay-video`}>
                <div className="my-events__cover-action">
                  <SvgIcon id="video-bold" />
                </div>
              </Link>
            </Tooltip>
          </VStack>
        </div>
        <div className="aspect-w-16 aspect-h-9">
          <div className="bg-black bg-opacity-0 group-hover:bg-opacity-20 transition z-10" />
          <img src={data.image}
               alt={data.name}
               className="w-full h-full object-center object-cover rounded-md" />
        </div>
      </div>
      <div className="flex md:hidden mt-3 bg-gray-700 rounded-full justify-between">
        <Link href={`/my-events/event-details?id=${data.id}&page=0`}
              as={`/my-events/event-details/${data.id}/tickets`}>
          <div className="flex items-center text-sm px-3 py-2 active:text-rose-500">
            <div className="text-lg mr-2">
              <SvgIcon id="ticket-bold" />
            </div>
            <span>Tickets</span>
          </div>
        </Link>
        <Link href={`/my-events/event-details?id=${data.id}&page=0`}
              as={`/my-events/event-details/${data.id}/tickets`}>
          <div className="flex items-center text-sm px-3 py-2 active:text-rose-500">
            <div className="text-lg mr-2">
              <SvgIcon id="bag-bold" />
            </div>
            <span>Merch</span>
          </div>
        </Link>
        <Link href={`/my-events/event-details?id=${data.id}&page=0`}
              as={`/my-events/event-details/${data.id}/tickets`}>
          <div className="flex items-center text-sm px-3 py-2 active:text-rose-500">
            <div className="text-lg mr-2">
              <SvgIcon id="video-bold" />
            </div>
            <span>replay video</span>
          </div>
        </Link>
      </div>
      <div className="mt-3">
        <div className="text-sm mb-1 text-gray-200">{data.date}</div>
        <div className="truncate font-semibold mb-2 group-hover:text-rose-500 transition">{data.name}
        </div>
        <div className="flex items-center">
          <SvgIcon id="location" className="text-sm text-white" />
          <div className="truncate flex-1 ml-2 text-sm text-gray-200">{data.location}</div>
        </div>
      </div>
    </div>
  );
};

export default MyEventItem;
