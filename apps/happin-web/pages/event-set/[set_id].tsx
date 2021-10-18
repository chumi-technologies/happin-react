import React, { useState } from "react";
import { useRouter } from "next/router";
import { Avatar, Box, HStack } from '@chakra-ui/react';
import { Check, Plus } from '@icon-park/react';
import EventDescription from '@components/page_components/EventPageComponents/EventDescription';
import Link from "next/link";
import SvgIcon from '@components/SvgIcon';
import classnames from 'classnames';

const EventSet = () => {
  const router = useRouter();
  // Use event_id for api calls to request the event details
  const { event_id } = router.query;
  const [isFollowed, setFollowed] = useState(false)
  return (
    <div className="common__body">
      {/* Top Popups for First-Time Visitors */}

      <div className="relative lg:flex h-full lg:flex-row web-scroll overflow-y-auto">
        {/* Event Image */}
        <div className="lg:sticky lg:top-0 w-full lg:w-5/12 xl:w-1/2 lg:h-full overflow-hidden">
          <Box
            className="hidden lg:block"
            w="100%"
            h="100%"
            position="absolute"
            style={{ filter: "blur(40px)", transform: "scale(1.5)" }}
            backgroundImage="url('/images/pic.png')"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
          />
          <img
            src="/images/pic.png"
            className="event-details__img"
          />
        </div>
        {/* Event Texts */}
        <div className="w-full lg:w-7/12 xl:w-1/2 sm:pb-20">
          <div className="event-details__container relative py-6 sm:py-8 md:py-14">
            {/* Event Title */}
            <h1 className="black-title text-2xl sm:text-3xl md:text-4xl leading-7 text-white font-bold">
              A New Adventure for Summoners
            </h1>
            <div className="mt-1 text-gray-300 text-sm sm:text-base font-medium">
              <span className="mr-3">Category:</span>
              <Link href="/"><a className="link-normal">Music Concerts</a></Link>
              <span className="mx-2">&</span>
              <Link href="/"><a className="link-normal">Performance / Kpop</a></Link>
            </div>
            <div className="flex justify-between items-center py-6 sm:py-10">
              <HStack spacing={{ base: 3, sm: 5 }}>
                <Avatar boxSize={{base: 12, sm: 14}} src="https://images.chumi.co/file--1622759851453.jpeg" />
                <div>
                  <div className="font-semibold text-sm sm:text-lg leading-5">Hosted By Happin Live</div>
                  <div className="text-sm sm:text-base text-gray-300">Happin Live</div>
                </div>
              </HStack>
              <button
                className={classnames('event-set__follow btn', isFollowed ? 'btn-dark-light' : 'btn-rose')}
                onClick={() => setFollowed(s => !s)}
              >
                {
                  isFollowed ? <Check theme="outline" size="14" fill="#999" strokeWidth={6} /> :
                    <Plus theme="outline" size="16" fill="currentColor" strokeWidth={5}/>
                }
                <span className="ml-2 sm:ml-3">{isFollowed ? 'Followed' : 'Follow'}</span>
              </button>
            </div>
            <div className="h-px bg-gray-600" />
            <div className="py-6 sm:py-10">
              <EventDescription description="ontrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. "
              />
            </div>
            <div className="h-px bg-gray-600" />
            <div className="pt-6 sm:pt-10">
              <div className="black-title flex items-center justify-between text-xl sm:text-2xl font-semibold">
                <div>Upcoming events</div>
                <Link href="/"><a className="font-medium text-sm sm:text-base text-gray-400 hover:text-white transition">MORE</a></Link>
              </div>
              <div className="mt-3 sm:mt-6">
                <div className="space-y-5">
                  <div className="group flex cursor-pointer">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden">
                      <img className="w-full h-full object-cover group-hover:opacity-80 transition" src="https://images.chumi.co/file--1628107226253.png" />
                    </div>
                    <div className="flex-1 min-w-0 ml-5">
                      <div className="truncate sm:text-lg leading-6 text-white font-semibold group-hover:text-rose-500 transition">Dead Royalty Presents: Calcium</div>
                      <div className="mt-1 sm:mt-2 text-yellow-500 text-sm font-semibold">Mon Oct 11 ・ 1:10 AM CST</div>
                      <div className="truncate mt-1">
                        <SvgIcon id="location" className="inline-block text-sm text-gray-300" />
                        <span className="align-middle ml-2 text-gray-300 text-sm">
                          Happin Livestream
                        </span>
                      </div>
                      <div className="text-right sm:text-left mt-2 font-semibold text-rose-500">FREE</div>
                    </div>
                  </div>
                  <div className="group flex cursor-pointer">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden">
                      <img className="w-full h-full object-cover group-hover:opacity-80 transition" src="https://images.chumi.co/file--1626728221701.png" />
                    </div>
                    <div className="flex-1 min-w-0 ml-5">
                      <div className="truncate sm:text-lg leading-6 text-white font-semibold group-hover:text-rose-500 transition">Astrologically Screwed and Other Psychic Revelations</div>
                      <div className="mt-1 sm:mt-2 text-yellow-500 text-sm font-semibold">Mon Oct 11 ・ 1:10 AM CST</div>
                      <div className="truncate mt-1">
                        <SvgIcon id="location" className="inline-block text-sm text-gray-300" />
                        <span className="align-middle ml-2 text-gray-300 text-sm">
                          Happin Livestream
                        </span>
                      </div>
                      <div className="text-right sm:text-left mt-2 font-semibold">
                        <span className="font-medium text-sm mr-1">From</span>$20.00
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSet;
