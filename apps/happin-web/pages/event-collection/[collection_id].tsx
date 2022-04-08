import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Avatar, Box, HStack, Spinner, useToast } from '@chakra-ui/react';
import EventDescription from '@components/page_components/EventPageComponents/EventDescription';
import { getCollectionEvents, getEventCollection } from 'lib/api';
import { useUserState } from "contexts/user-state";
import { User } from "lib/model/user";
import { currencyFormatter } from "@components/page_components/CheckoutPageComponents/util/currencyFormat";
import moment from 'moment-timezone';
import InfiniteScroll from 'react-infinite-scroll-component';

export interface ICollectionData {
  _id: string;
  cover: string;
  description: string;
  descriptionPlainText: string;
  tags: string[];
  title: string;
  isApproved: boolean;
  creator: User;
}

const EventSet = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [collectionData, setCollectionData] = useState<ICollectionData>();
  const [eventList, setEventList] = useState<any[]>([]);
  const [events, setEvents] = useState({
    page: 1,
    pageSize: 5,
    hasMore: true
  });
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
    let isMounted = true;
    (async () => {
      if (router.query.collection_id && user) {
        isMounted && setIsLoading(true);
        await fetchCollection(isMounted);
        await fetchCollectionEvents(isMounted, true);
        isMounted && setIsLoading(false);
      }
    })();
    return () => { isMounted = false };
  }, [user])

  const fetchCollection = async (isMounted: boolean) => {
    try {
      const res = await getEventCollection(String(router.query.collection_id));
      isMounted && setCollectionData(res);
      if (res.creator._id !== user?._id) {
        generateToast('You are not allowed to view this event collection')
        await router.push('/')
        return
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchCollectionEvents = async (newFetch = false, isMounted = true) => {
    try {
      const res = await getCollectionEvents(
        String(router.query.collection_id), (newFetch ? 1 : events.page), events.pageSize
      );
      if (res.data.events.length < events.pageSize && isMounted) {
        setEvents({...events, hasMore: false})
      }
      if (res.code === 200) {
        if (newFetch) {
          isMounted && setEventList(res.data.events)
        } else {
          isMounted && setEventList([...eventList, ...res.data.events])
        }
        isMounted && setEvents(s => ({...s, page: s.page + 1}))
      } else {
        generateToast(res.message)
      }
    } catch (err) {
      console.log(err);
    }
  }
  const fetchMoreEvents = async () => {
    try {
      if (!events.hasMore) {
        return;
      }
      await fetchCollectionEvents();
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="common__body">
      {/* Top Popups for First-Time Visitors */}

      <div id="scrollable" className="relative lg:flex h-full lg:flex-row web-scroll overflow-y-auto">
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
              {collectionData?.tags.map((item, index) => (
                <div key={index} className="py-1 px-2 leading-none border-2 border-yellow-500 border-solid text-yellow-500 rounded text-xs sm:text-sm font-semibold">
                  {item}
                </div>
              ))}
            </HStack>
            {/* Event Title */}
            <h1 className="black-title text-2xl sm:text-3xl md:text-4xl leading-7 text-gray-50 font-bold mt-2">
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
                <EventDescription
                  rawDescription={collectionData?.descriptionPlainText}
                  description={collectionData?.description}
                />
              }
            </div>
            <div className="h-px bg-gray-600" />
            <div className="pt-6 sm:pt-10">
              <div className="black-title flex items-center justify-between text-xl sm:text-2xl font-semibold">
                Collection events
              </div>
              <div className="mt-5 sm:mt-7">
                <InfiniteScroll
                  className="space-y-4 sm:space-y-6"
                  dataLength={eventList.length}
                  next={fetchMoreEvents}
                  hasMore={events.hasMore}
                  scrollableTarget="scrollable"
                  loader={
                    <div className="flex items-center justify-center w-full pt-2">
                      <Spinner
                        thickness="2px"
                        speed="0.65s"
                        color="yellow.500"
                        size="sm"
                      />
                      <span className="text-gray-200 ml-2">Loading...</span>
                    </div>
                  }
                >
                  {eventList?.map(event =>
                    <div
                      key={event._id}
                      className="group flex cursor-pointer"
                      onClick={() => router.push(`/post/${event._id}`)}
                    >
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden">
                        <img
                          className="w-full h-full object-cover group-hover:opacity-80 transition"
                          src={event.cover}
                        />
                      </div>
                      <div className="flex-1 min-w-0 ml-5">
                        <div className="truncate leading-5 text-gray-200 font-semibold group-hover:text-rose-500 transition">
                          {event.title}
                        </div>
                        <div className="text-gray-400 mt-1 text-sm">
                          {moment.utc(event.start_datetime).tz(moment.tz.guess()).format('ddd MMM D ・ H:mm A')}
                        </div>
                        <div className="text-sm mt-0.5 truncate text-gray-400">
                          {
                            event.streamEnabled ? (
                              `Happin Livestream${(event.acInfo?.eventType === 'hybrid' && event.acInfo?.venueName) ? ` / ${event.acInfo?.venueName}` : ''}`
                            ) : event.acInfo?.venueName
                          }
                          {
                            event.acInfo?.location !== "happin.app" && (event.acInfo?.location)
                          }
                        </div>
                        {
                          <div className="text-sm mt-2 font-semibold text-yellow-500">
                            {event.min_price > 0 ? `From ${(currencyFormatter(event.currency as string).format(event.min_price / 100))}` : 'FREE'}
                          </div>
                        }
                      </div>
                    </div>
                  )}
                </InfiniteScroll>
                {
                  !isLoading && !eventList?.length && <div className="text-gray-400">No collection event.</div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSet;
