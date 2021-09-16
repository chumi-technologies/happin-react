import React, { useEffect, useRef, useState } from 'react';
import MyEventDetailsHead from '@components/page_components/MyEventDetailsPageComponents/MyEventDetailsHead';
import SvgIcon from '@components/SvgIcon';
import { Tooltip, VStack } from '@chakra-ui/react';

const MyEventDetails = () => {
  const [firstActive, setFirstActive] = useState(true)
  return (
    <div className="relative flex-1 h-0 bg-black text-white overflow-hidden">
      <div className="flex flex-col-reverse md:flex-col h-full">
        <MyEventDetailsHead />
        <div className="flex-1 h-0 web-scroll overflow-y-auto" id="my-event-details-scroll-body">
          <div className="container">
            <div className="flex flex-col md:flex-row w-full py-2 md:py-8">
              <div className="my-event-details__intro">
                <div className="sticky top-8">
                  <img src="https://images.chumi.co/file--1630495316349.jpeg"
                       alt="Kayzo + Special Guest K?D @ Markham Fairgrounds"
                       className="w-full rounded-md" />
                  <div className="font-bold text-xl my-6">FREEZE! - Written and Directed by Richard Broadhurst</div>
                  <VStack
                    spacing={4}
                    align="start"
                  >
                    <div className="flex items-start w-full">
                      <SvgIcon id="clock" className="text-lg text-white" />
                      <div className="ml-3 flex-1">
                        <div className="text-white leading-none mb-1">Date & Time</div>
                        <div className="flex items-start sm:items-center flex-col sm:flex-row text-gray-400">
                          <div className="flex-1 mr-2 text-sm mb-2 sm:mb-0">
                            Sat Sep 11 ・ 10:30 AM - Sat Sep 11 ・ 12:00 PM CST (90 mins)
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start w-full">
                      <SvgIcon id="location" className="text-lg text-white" />
                      <div className="ml-3">
                        <div className="text-white leading-none mb-1">
                          CalCap Studios
                        </div>
                        <div className="text-gray-400 text-sm">
                          9845 Horn Rd, Sacramento, CA 95827, USA
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center w-full">
                      <SvgIcon id="livestream" className="text-lg text-white" />
                      <div className="ml-3 text-white">Livestream</div>
                    </div>
                  </VStack>
                </div>
              </div>
              <div className="md:flex-1 min-w-0">
                <div className="sticky top-0 bg-black z-10">
                  <div className="flex w-full p-1 border border-solid border-gray-600 rounded-full">
                    <div className="event-details__tab active">Tickets</div>
                    <div className="event-details__tab">Merch</div>
                  </div>
                </div>
                <div className="mt-5">
                  <VStack spacing={8}>
                    <div className="ticket-wrapper">
                      <div className="tickets-cover">
                        <div className="absolute inset-0 text-gray-900">
                          <div className="flex h-full">
                            <div className="flex items-center w-2/3 h-full pl-8 pr-5 py-4">
                              <div className="grid grid-cols-2 gap-3 w-full">
                                <div className="col-span-2">
                                  <div className="text-sm text-gray-500">Ticket name</div>
                                  <div className="font-bold text-lg">#1 General Admission</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Ticket type</div>
                                  <div className="font-bold text-lg">Livestream</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Invitation code</div>
                                  <div className="font-bold text-lg">5LTOO8</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Status</div>
                                  <div className="font-bold text-lg">Available</div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-center w-1/3 h-full pl-5 pr-7">
                              <div className="text-center">
                                <div className="font-semibold text-gray-700 mb-3 text-sm">Your QR Code</div>
                                <img className="w-24 mx-auto" src="/images/qrcode.jpg" alt="" />
                                <button className="btn btn-rose w-full btn-sm !rounded-full !font-semibold mt-4">Check In</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-11/12 mx-auto bg-gray-700 px-4 py-3 rounded-b-xl">
                        <div className="font-semibold mb-1 text-sm">Extra information</div>
                        <div className="text-gray-200 text-sm">To control the width of an element at a specific breakpoint prefix to any existing width utility.</div>
                      </div>
                    </div>
                    <div className="ticket-wrapper">
                      <div className="tickets-cover">
                        <div className="absolute inset-0 text-gray-900">
                          <div className="flex h-full">
                            <div className="flex items-center w-2/3 h-full pl-8 pr-5 py-4">
                              <div className="grid grid-cols-2 gap-3 w-full">
                                <div className="col-span-2">
                                  <div className="text-sm text-gray-500">Ticket name</div>
                                  <div className="font-bold text-lg">#1 General Admission</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Ticket type</div>
                                  <div className="font-bold text-lg">Livestream</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Invitation code</div>
                                  <div className="font-bold text-lg">5LTOO8</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Status</div>
                                  <div className="font-bold text-lg">Available</div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-center w-1/3 h-full pl-5 pr-7">
                              <div className="text-center">
                                <div className="font-semibold text-gray-700 mb-3 text-sm">Your QR Code</div>
                                <img className="w-24 mx-auto" src="/images/qrcode.jpg" alt="" />
                                <button className="btn btn-rose w-full btn-sm !rounded-full !font-semibold mt-4">Check In</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </VStack>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEventDetails;
