import React, { useEffect, useState } from 'react';
import Router, { useRouter } from "next/router";
import MyEventDetailsHead from '@components/page_components/MyEventDetailsPageComponents/MyEventDetailsHead';
import SvgIcon from '@components/SvgIcon';
import { VStack } from '@chakra-ui/react';
import classnames from 'classnames';

const pageTab = ['Tickets', 'Merch', 'Replay Video']
const routerList = ['tickets', 'merch', 'replay-video']
const MyEventDetails = () => {
  const router = useRouter();
  const [tabCur, setTabCur] = useState(0)
  useEffect(() => {
    console.log(router);
    if (router.query.page) {
      setTabCur(Number(router.query.page as string))
    }
  }, [router.query])
  return (
    <div className="common__body">
      <div className="flex flex-col h-full">
        <MyEventDetailsHead />
        <div className="flex-1 h-0 web-scroll overflow-y-auto" id="my-event-details-scroll-body">
          <div className="container">
            <div className="flex flex-col lg:flex-row w-full py-5 md:py-8">
              <div className="my-event-details__intro">
                <div className="sticky top-8">
                  <img src="https://images.chumi.co/file--1630495316349.jpeg"
                       alt="Kayzo + Special Guest K?D @ Markham Fairgrounds"
                       className="w-full rounded-md" />
                  <div className="font-bold text-lg md:text-xl my-5 md:my-6">FREEZE! - Written and Directed by Richard Broadhurst</div>
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
              <div className="md:flex-1 min-w-0 mt-8 lg:mt-0">
                <div className="sticky top-0 bg-black z-10">
                  <div className="flex w-full p-1 border border-solid border-gray-600 rounded-full">
                    {
                      pageTab.map((item, index) => (
                        <div
                          key={index}
                          className={classnames('event-details__tab', {active: tabCur === index})}
                          onClick={() => {
                            setTabCur(index)
                            {/*https://nextjs.org/docs/tag/v9.5.2/api-reference/next/link#dynamic-routes*/}
                            Router.push({
                              pathname: router.pathname,
                              query: {
                                id: router.query.id,
                                page: index
                              }
                            },`${router.pathname}/${router.query.id}/${routerList[index]}`)
                          }}
                        >
                          {item}
                        </div>
                      ))
                    }
                  </div>
                </div>
                <div className="mt-5">
                  {
                    tabCur === 0 && (
                      <VStack spacing={{base: 5, sm: 8}}>
                        <div className="ticket-wrapper">
                          <div className="tickets-cover">
                            <div className="sm:absolute inset-0 text-gray-900">
                              <div className="flex flex-col sm:flex-row h-full">
                                <div className="tickets-cover__info">
                                  <div className="grid grid-cols-2 gap-3 w-full">
                                    <div className="col-span-2">
                                      <div className="text-sm text-gray-500">Ticket name</div>
                                      <div className="font-bold lg:text-lg">#1 General Admission</div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-500">Ticket type</div>
                                      <div className="font-bold lg:text-lg">Livestream</div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-500">Invitation code</div>
                                      <div className="font-bold lg:text-lg">5LTOO8</div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-500">Status</div>
                                      <div className="font-bold lg:text-lg">Available</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="tickets-cover__qrcode">
                                  <div className="flex sm:flex-col items-center w-full sm:text-center">
                                    <div className="mr-4 sm:m-0 flex-shrink-0">
                                      <div className="sm:font-semibold text-gray-500 sm:text-gray-700 mb-3 text-sm">Your QR Code</div>
                                      <img className="w-24 mx-auto" src="/images/qrcode.jpg" alt="" />
                                    </div>
                                    <div className="flex-1 text-center sm:w-28">
                                      <button className="btn btn-rose w-32 sm:w-full btn-sm !rounded-full !font-semibold mt-4">Check In</button>
                                    </div>
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
                            <div className="sm:absolute inset-0 text-gray-900">
                              <div className="flex flex-col sm:flex-row h-full">
                                <div className="tickets-cover__info">
                                  <div className="grid grid-cols-2 gap-3 w-full">
                                    <div className="col-span-2">
                                      <div className="text-sm text-gray-500">Ticket name</div>
                                      <div className="font-bold lg:text-lg">#1 General Admission</div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-500">Ticket type</div>
                                      <div className="font-bold lg:text-lg">Livestream</div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-500">Invitation code</div>
                                      <div className="font-bold lg:text-lg">5LTOO8</div>
                                    </div>
                                    <div>
                                      <div className="text-sm text-gray-500">Status</div>
                                      <div className="font-bold lg:text-lg">Available</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="tickets-cover__qrcode">
                                  <div className="flex sm:flex-col items-center w-full sm:text-center">
                                    <div className="mr-4 sm:m-0 flex-shrink-0">
                                      <div className="sm:font-semibold text-gray-500 sm:text-gray-700 mb-3 text-sm">Your QR Code</div>
                                      <img className="w-24 mx-auto" src="/images/qrcode.jpg" alt="" />
                                    </div>
                                    <div className="flex-1 text-center sm:w-28">
                                      <button className="btn btn-rose w-32 sm:w-full btn-sm !rounded-full !font-semibold mt-4">Check In</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </VStack>
                    )
                  }
                  {
                    tabCur === 1 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 md:gap-5">
                        <div className="flex items-center">
                          <div className="w-28 h-28 mr-4">
                            <img className="w-full h-full object-cover rounded-md" src="https://cdn.sspai.com/editor/u_/c50g71lb34tdhj3i1e80.png" alt="" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold">iPhone 13 Pro</div>
                            <div className="text-gray-400 text-sm">size: xl</div>
                            <div className="flex items-center mt-4 text-sm">
                              <div className="font-semibold whitespace-nowrap mr-4">CA$199.99</div>
                              <div className="text-gray-400">x 2</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-28 h-28 mr-4">
                            <img className="w-full h-full object-cover rounded-md" src="https://cdn.sspai.com/editor/u_/c50g6vtb34tdhtodstsg.jpeg" alt="" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold">iPhone 13 Pro</div>
                            <div className="text-gray-400 text-sm">size: xl</div>
                            <div className="flex items-center mt-4 text-sm">
                              <div className="font-semibold whitespace-nowrap mr-4">CA$199.99</div>
                              <div className="text-gray-400">x 2</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  {
                    tabCur === 2 && (
                      <div>replay video</div>
                    )
                  }
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
