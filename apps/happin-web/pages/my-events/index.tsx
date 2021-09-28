import React, { useEffect, useRef, useState } from 'react';
import MyEventsHead from '@components/page_components/MyEventsPageComponents/MyEventsHead';
import SvgIcon from '@components/SvgIcon';
import { Tooltip, VStack } from '@chakra-ui/react';
import MyEventItem from '@components/page_components/MyEventsPageComponents/MyEventItem';

const MyEvents = () => {
  const list = [
    {
      id: '61399548c281030008b712dd',
      livestream: true,
      image: 'https://images.chumi.co/file--1629328060055.jpeg',
      name: 'Kayzo + Special Guest K?D @ Markham Fairgrounds',
      date: 'Jan 31, 2021',
      location: 'happin.app',
    },
    {
      id: '61399548c281030008b712dc',
      livestream: false,
      image: 'https://images.chumi.co/file--1627501541534.jpeg',
      name: 'Kayzo + Special Guest K?D @ Markham Fairgrounds',
      date: 'Sep 18, 10:30 AM',
      location: 'Markham Fair Grounds',
    },
    {
      id: '61399548c281030008b712db',
      livestream: false,
      image: 'https://images.chumi.co/file--1630495316349.jpeg',
      name: 'BASHMENT VS HIPHOP',
      date: 'Sep 28, 5:00 AM',
      location: 'CalCap Studios',
    },
  ]
  return (
    <div className="common__body">
      <div className="flex flex-col h-full">
        <MyEventsHead />
        <div className="flex-1 h-0 web-scroll overflow-y-auto" id="my-events-scroll-body">
          <div className="container">
            <div className="py-5">
              <VStack alignItems="stretch" spacing={{base: 5, sm: 8}}>
                <div id="upcoming">
                  <div className="mb-5 font-semibold text-xl sm:text-2xl">Upcoming</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:grid-cols-3">
                    {
                      list.map(item => <MyEventItem data={item} key={item.id} />)
                    }
                  </div>
                </div>
                <div id="past">
                  <div className="mb-5 font-semibold text-xl sm:text-2xl">Past</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:grid-cols-3">
                    {
                      list.map(item => <MyEventItem data={item} key={item.id} />)
                    }
                  </div>
                </div>
                <div id="saved">
                  <div className="mb-5 font-semibold text-xl sm:text-2xl">Saved</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:grid-cols-3">
                    {
                      list.map(item => <MyEventItem data={item} key={item.id} />)
                    }
                  </div>
                </div>
              </VStack>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEvents;
