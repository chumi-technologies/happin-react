import React, { useEffect, useRef, useState } from 'react';
import MyEventsHead from '@components/page_components/MyEventsPageComponents/MyEventsHead';
import SvgIcon from '@components/SvgIcon';
import { Tooltip, VStack } from '@chakra-ui/react';

const MyEvents = () => {
  return (
    <div className="checkout__page">
      <div className="flex flex-col-reverse md:flex-col h-full">
        <MyEventsHead />
        <div className="flex-1 h-0 web-scroll overflow-y-auto" id="my-events-scroll-body">
          <div className="container">
            <div className="py-5">
              <div id="upcoming">
                <div className="mb-5 font-semibold text-xl">Upcoming</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 lg:grid-cols-3">
                  <div className="group cursor-pointer">
                    <div className="relative">
                      <div className="absolute left-3 top-3 inline-flex items-center bg-rose-500 rounded-md px-1.5 py-0.5 z-20">
                        <SvgIcon id="livestream" className="text-white" />
                        <div className="ml-2 text-sm text-gray-200 font-medium">Livestream</div>
                      </div>
                      <div className="absolute right-2 top-2 z-20 opacity-0 group-hover:opacity-100 transition">
                        <VStack spacing={1.5}>
                          <Tooltip label="Ticket" placement="left" bg="gray.900" borderRadius="md" hasArrow arrowSize={8}>
                            <div className="my-events__cover-action">
                              <SvgIcon id="ticket-bold" />
                            </div>
                          </Tooltip>
                          <Tooltip label="Merch" placement="left" bg="gray.900" borderRadius="md" hasArrow arrowSize={8}>
                            <div className="my-events__cover-action">
                              <SvgIcon id="bag-bold" />
                            </div>
                          </Tooltip>
                          <Tooltip label="Replay Video" placement="left" bg="gray.900" borderRadius="md" hasArrow arrowSize={8}>
                            <div className="my-events__cover-action">
                              <SvgIcon id="video-bold" />
                            </div>
                          </Tooltip>
                        </VStack>
                      </div>
                      <div className="aspect-w-16 aspect-h-9">
                        <div className="bg-black bg-opacity-0 group-hover:bg-opacity-20 transition z-10" />
                        <img src="https://images.chumi.co/file--1629328060055.jpeg" alt="Kayzo + Special Guest K?D @ Markham Fairgrounds" className="w-full h-full object-center object-cover rounded-md" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm mb-1 text-gray-200">Jan 31, 2021</div>
                      <div className="truncate font-semibold mb-2 group-hover:text-rose-500 transition">Kayzo + Special Guest K?D @ Markham Fairgrounds</div>
                      <div className="flex items-center">
                        <SvgIcon id="location" className="text-sm text-white" />
                        <div className="truncate flex-1 ml-2 text-sm text-gray-200">CalCap Studios</div>
                      </div>
                    </div>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="relative">
                      <div className="absolute right-2 top-2 z-20 opacity-0 group-hover:opacity-100 transition">
                        <VStack spacing={1.5}>
                          <Tooltip label="Ticket" placement="left" bg="gray.900" borderRadius="md" hasArrow arrowSize={8}>
                            <div className="my-events__cover-action">
                              <SvgIcon id="ticket-bold" />
                            </div>
                          </Tooltip>
                          <Tooltip label="Merch" placement="left" bg="gray.900" borderRadius="md" hasArrow arrowSize={8}>
                            <div className="my-events__cover-action">
                              <SvgIcon id="bag-bold" />
                            </div>
                          </Tooltip>
                          <Tooltip label="Replay Video" placement="left" bg="gray.900" borderRadius="md" hasArrow arrowSize={8}>
                            <div className="my-events__cover-action">
                              <SvgIcon id="video-bold" />
                            </div>
                          </Tooltip>
                        </VStack>
                      </div>
                      <div className="aspect-w-16 aspect-h-9">
                        <div className="bg-black bg-opacity-0 group-hover:bg-opacity-20 transition z-10" />
                        <img src="https://images.chumi.co/file--1627501541534.jpeg" alt="FREEZE! - Written and Directed by Richard Broadhurst" className="w-full h-full object-center object-cover rounded-md" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm mb-1">Sep 18, 10:30 AM</div>
                      <div className="truncate font-semibold mb-2 group-hover:text-rose-500 transition">FREEZE! - Written and Directed by Richard Broadhurst</div>
                      <div className="flex items-center">
                        <SvgIcon id="location" className="text-sm text-white" />
                        <div className="truncate flex-1 ml-2 text-sm text-gray-200">CalCap Studios</div>
                      </div>
                    </div>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="relative">
                      <div className="absolute right-2 top-2 z-20 opacity-0 group-hover:opacity-100 transition">
                        <VStack spacing={1.5}>
                          <Tooltip label="Ticket" placement="left" bg="gray.900" borderRadius="md" hasArrow arrowSize={8}>
                            <div className="my-events__cover-action">
                              <SvgIcon id="ticket-bold" />
                            </div>
                          </Tooltip>
                          <Tooltip label="Merch" placement="left" bg="gray.900" borderRadius="md" hasArrow arrowSize={8}>
                            <div className="my-events__cover-action">
                              <SvgIcon id="bag-bold" />
                            </div>
                          </Tooltip>
                          <Tooltip label="Replay Video" placement="left" bg="gray.900" borderRadius="md" hasArrow arrowSize={8}>
                            <div className="my-events__cover-action">
                              <SvgIcon id="video-bold" />
                            </div>
                          </Tooltip>
                        </VStack>
                      </div>
                      <div className="aspect-w-16 aspect-h-9">
                        <div className="bg-black bg-opacity-0 group-hover:bg-opacity-20 transition z-10" />
                        <img src="https://images.chumi.co/file--1630495316349.jpeg" alt="BASHMENT VS HIPHOP" className="w-full h-full object-center object-cover rounded-md" />
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm mb-1">Sep 28, 5:00 AM</div>
                      <div className="truncate font-semibold mb-2 group-hover:text-rose-500 transition">BASHMENT VS HIPHOP</div>
                      <div className="flex items-center">
                        <SvgIcon id="location" className="text-sm text-white" />
                        <div className="truncate flex-1 ml-2 text-sm text-gray-200">CalCap Studios</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="past" className="py-5 sm:py-8 text-white">
                <div className="mb-5 font-semibold text-xl">Past</div>
              </div>
              <div id="saved" className="py-5 sm:py-8 text-white">
                <div className="mb-5 font-semibold text-xl">Saved</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEvents;
