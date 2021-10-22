import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SvgIcon from '@components/SvgIcon';
import { Avatar, Box, HStack, useToast } from '@chakra-ui/react';
import EventDescription from '@components/page_components/EventPageComponents/EventDescription';
import { getEventCollection } from "lib/api";
import { useUserState } from "contexts/user-state";
import { EventDetail } from "lib/model/event";
import { User } from "lib/model/user";
import { currencyFormatter } from "@components/page_components/CheckoutPageComponents/util/currencyFormat";
import moment from 'moment-timezone';

export interface ICollectionData {
  _id: string;
  cover: string;
  description: string;
  categories: string[];
  events: EventDetail[];
  title: string;
  creator: User;
}

const EventSet = () => {
  const router = useRouter();
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [collectionData, setCollectionData] = useState<ICollectionData>();
  const { user } = useUserState();
  const toast = useToast()

  const generateToast = (message: string) => {
    toast({
      title: message,
      position: 'top',
      isClosable: true,
    })
  }

  useEffect(() => {
    if (router.query.set_id) {
      getData(router.query.set_id as string);
    }
  }, [router])

  useEffect(() => {
    if (user && isPreview && collectionData) {
      if (user._id !== collectionData.creator._id) {
        generateToast('You are not allowed to view this event collection');
        router.push('/')
        return
      }
    }
  }, [user, isPreview, collectionData])

  const getData = async (id: string) => {
    try {
      const response = await getEventCollection(id);
      if (!response.isApproved) {
        if (!localStorage.getItem('happin_web_jwt') && !localStorage.getItem('happin_refresh_token')) {
          router.push('/');
          return
        }
        setIsPreview(true);
      }
      setCollectionData(response);
    } catch (err) {
      console.log(err)
    }
  }

  /*   const [isFollowed, setFollowed] = useState(false) */
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
            backgroundImage={`url(${collectionData?.cover})`}
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            backgroundSize="cover"
          />
          <img
            src={collectionData?.cover}
            className="event-details__img"
          />
        </div>
        {/* Event Texts */}
        <div className="w-full lg:w-7/12 xl:w-1/2 sm:pb-20">
          <div className="event-details__container relative py-6 sm:py-8 md:py-14">
            <HStack spacing={3}>
              {collectionData &&
                <div className="py-1 px-2 leading-none border-2 border-yellow-500 border-solid text-yellow-500 rounded text-xs sm:text-sm font-semibold">
                  {collectionData?.categories[0]}
                </div>}

            </HStack>
            {/* Event Title */}
            <h1 className="black-title text-2xl sm:text-3xl md:text-4xl leading-7 text-white font-bold mt-2">
              {collectionData?.title}
            </h1>

            <div className="flex justify-between items-center py-6 sm:py-10">
              <HStack spacing={{ base: 3, sm: 5 }}>
                <Avatar boxSize={{ base: 12, sm: 14 }} src={collectionData?.creator.photourl} />
                <div>
                  <div className="font-semibold text-sm sm:text-lg leading-5">Hosted By {collectionData?.creator.displayname}</div>
                  {/* <div className="text-sm sm:text-base text-gray-300">Happin Live</div> */}
                </div>
              </HStack>

            </div>
            <div className="h-px bg-gray-600" />
            <div className="py-6 sm:py-10">
              {collectionData?.description &&
                <EventDescription rawDescription={collectionData?.description} description={collectionData?.description}
                />
              }
            </div>
            <div className="h-px bg-gray-600" />
            <div className="pt-6 sm:pt-10">
              <div className="black-title flex items-center justify-between text-xl sm:text-2xl font-semibold">
                <div>Collection events</div>
                {/*  <Link href="/"><a className="font-medium text-sm sm:text-base text-gray-400 hover:text-white transition">MORE</a></Link> */}
              </div>
              <div className="mt-3 sm:mt-6">
                <div className="space-y-5">
                  {collectionData?.events.map(event =>
                    <div key={event._id} className="group flex cursor-pointer" onClick={() => { router.push(`/post/${event._id}`) }}>
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden">
                        <img className="w-full h-full object-cover group-hover:opacity-80 transition" src={event.cover} />
                      </div>
                      <div className="flex-1 min-w-0 ml-5">
                        <div className="truncate sm:text-lg leading-6 text-white font-semibold group-hover:text-rose-500 transition">{event.title}</div>
                        <div className="mt-1 sm:mt-2 text-yellow-500 text-sm font-semibold">{moment.utc(event.start_datetime).tz(moment.tz.guess()).format('ddd MMM D ・ H:mm A')}</div>
                        <div className="truncate mt-1">
                          <div className="flex items-start w-full">
                            {(event.acInfo?.location || event.acInfo?.venueName) && <SvgIcon id="location" className="text-lg text-white" />}
                            <div className="ml-3">
                              <div className="text-white leading-none mb-1">
                                {event.streamEnabled ? (`Happin Livestream${(event.acInfo?.eventType === "hybrid" && event.acInfo?.venueName) ? ` / ${event.acInfo?.venueName}` : ""}`) : (event.acInfo?.venueName)} <span className="text-gray-400 text-sm">{event.acInfo?.location !== "happin.app" && (event.acInfo?.location)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {event.min_price < 0 ? <></>:
                          <>
                            <div className="text-right sm:text-left mt-2 font-semibold text-rose-500">{event.min_price ? (currencyFormatter(event.currency as string).format(event.min_price / 100)) : 'FREE'}</div>
                          </>}
                      </div>
                    </div>
                  )}
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
