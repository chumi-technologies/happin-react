import React, { useEffect, useState } from 'react';
import { Avatar, Spinner, useToast } from '@chakra-ui/react';
import SvgIcon from '@components/SvgIcon';
import { useRouter } from 'next/router';
import { getEventDetail } from 'lib/api';
import { generateErrorToast } from '@components/page_components/CheckoutPageComponents/util/toast';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import { PRODUCTION_URL } from 'utils/constants';
import Head from 'next/head';
import { Transition } from '@headlessui/react';

const EventInvitation = (props: any) => {
  const router = useRouter();
  const toast = useToast();
  const [events, setEvents] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [inviterImage, setInviterImage] = useState('');
  const [inviterName, setInviterName] = useState('');
  const [universalLink, setUniversalLink] = useState('');

  let eventLocation = 'Stream Via Happin';
  let eventDescription = ' - You can watch livestream on https://livestream.happin.app or download Happin App';

  const seoProps = {
    description: props.event?.title + eventDescription,
    keywords: `${props.event?.tags.toString()}, Happin livestream`,
    title: 'Invitation: ' + props.af_referrer_name + 'invited you to ' + props.event?.title + ' @ ' + eventLocation,
    ogImage: props.event?.socialImg || props.event?.cover,
    ogUrl: `${PRODUCTION_URL}${router.asPath}`,
    twitterImage: props.event?.socialImg || props.event?.cover
  };

  useEffect(() => {
    if (router.query.eventId) {
      (async () => {
        try {
          console.log(router.query);
          const eventId = router.query.eventId as string;
          const res = await getEventDetail(eventId, 'both');
          if (res.data) {
            setIsLoading(false);
            setEvents(res.data);
          } else {
            throw res.message;
          }
        } catch (error) {
          console.log(error);
          generateErrorToast('Get event error', toast);
          await router.push('/');
        }
      })();
    }
    if (router.query.af_referrer_image_url) {
      setInviterImage(router.query.af_referrer_image_url as string);
    }
    if (router.query.af_referrer_name) {
      setInviterName(router.query.af_referrer_name as string);
    }
    if (router.query.univeral_link) {
      setUniversalLink(router.query.univeral_link as string);
    }
  }, [router.query]);


  const handleJoin = () => {
    // setTimeout(function() {
    //   window.location.href = 'https://apps.apple.com/app/id1527348429';
    // }, 25);
    window.location.href = universalLink;
  };

  const handleEventDetail = async () => {
    await router.push('/post/' + router.query.eventId);
  };

  return (
    <>
      <Head>
        <meta name="description" key="description" content={seoProps.description} />
        <meta name="keywords" key="keywords" content={seoProps.keywords} />
        <title>{seoProps.title}</title>
        <meta property="og:title" key="og:title" content={seoProps.title} />
        <meta property="og:description" key="og:description" content={seoProps.description} />
        <meta property="og:image" key="og:image" content={seoProps.ogImage} />
        <meta property="og:site_name" key="og:site_name" content={seoProps.title} />
        <meta property="og:url" key="og:url" content={seoProps.ogUrl} />
        <meta property="og:type" key="og:type" content={'website'} />
        <meta name="twitter:title" key="twitter:title" content={seoProps.title} />
        <meta name="twitter:description" key="twitter:description" content={seoProps.description} />
        <meta name="twitter:image" key="twitter:image" content={seoProps.twitterImage} />
        <meta name="twitter:card" key="twitter:card" content="summary_large_image" />
      </Head>
      <Transition
        show={isLoading}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[99]"
      >
        <Spinner
          thickness="3px"
          speed="0.65s"
          color="yellow.500"
          size="lg"
        />
      </Transition>
      <div className="w-full max-w-md mx-auto">
        <div className="event-invitation__banner">
          <div className="pt-8 px-4 mb-5 text-center">
            <h1 className="text-gray-900 text-3xl black-title font-extrabold">Event
              Invitation</h1>
          </div>
          <div className="px-4">
            <div className="rounded-2xl bg-gray-800">
              <div className="text-center pt-4 px-4">
                <div className="event-invitation__avatar-bg">
                  <Avatar boxSize={16} src={inviterImage} />
                  <h2 className="text-gray-100 text-2xl font-extrabold black-title mt-5 mb-4">You
                    have an invitation</h2>
                  <div className="text-gray-400 text-base font-medium">
                    <p><span className="text-gray-100">{inviterName}</span> invited you</p>
                    <p className="mt-0.5">to this event {events?.match?.total >= 2 &&
                      <span>with other {events?.match?.total} Happiners</span>}</p>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center h-12 px-8 overflow-hidden">
                <div className="absolute -left-6 w-12 h-12 rounded-full bg-gray-900" />
                <div className="w-full border-t-8 border-dotted border-gray-900" />
                <div className="absolute -right-6 w-12 h-12 rounded-full bg-gray-900" />
              </div>
              <div className="flex p-5 pt-2">
                <img className="w-20 h-20 rounded-md object-cover"
                     src={events.event?.cover} alt="" />
                <div className="ml-4 flex-1 min-w-0">
                  <div
                    className="text-yellow-500 font-semibold text-sm mb-1">{moment(events.event?.start_datetime).format('ddd, MMMM DD・h:mmA')}</div>
                  <div
                    className="text-gray-100 font-semibold ellipsis-2 text-sm mb-1">{events.event?.title}</div>
                  {
                    events.event?.acInfo?.location && (
                      <div className="flex items-center text-sm">
                        <SvgIcon id="location" className="text-xs text-gray-400 mr-1" />
                        <div
                          className="flex-1 text-gray-400 truncate">{events.event.acInfo.location}</div>
                      </div>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4">
          <h1 className="mt-6 mb-4 text-2xl black-title font-extrabold text-rose-500">Meet
            interesting attendees in event match and group chat</h1>
        </div>
        <div className="flex snap-x space-x-3 overflow-x-auto hide-scrollbar">
          {events?.match?.topProfiles.map((item: any, index: number) => {
            if (index < 6) {
              return (
                <div className="snap-center w-[28%] shrink-0 first:ml-4" key={item._id}>
                  <div className="relative shrink-0 w-full aspect-w-10 aspect-h-16">
                    <img className="w-full h-full object-cover rounded-lg"
                         src={item.photourl} />
                  </div>
                  <div
                    className="mt-1 text-sm font-semibold text-gray-100">{item.displayname}</div>
                </div>
              );
            }
          })}
          <div className="flex shrink-0 h-1 w-4 !ml-0" />

        </div>
        <div className="px-4 mt-4">
          <div className="text-gray-400 text-[15px] font-medium">
            <span className="mr-2">🔥</span><span
            className="text-gray-100">{events?.match?.topProfiles[0].displayname} </span>and
            other {events?.match?.total} people have joined
          </div>
          <div className="text-gray-400 text-[15px] font-medium">
            <span className="mr-2">🎉</span>
            {events?.match?.numOfGroupChat ?
              <span className="text-gray-100">{events?.match?.numOfGroupChat} event group chats </span> :
              <span className="text-gray-100">Event group chats </span>
            }
            created
          </div>
        </div>
        <div className="text-center mt-2">
          <button
            onClick={handleEventDetail}
            className="btn text-rose-500 active:text-rose-600"
          >
            <span className="underline">View Event Details</span>
          </button>
        </div>
        <div className="h-16" />
        <div className="fixed bottom-0 w-full max-w-md footer-action z-20">
          <button onClick={handleJoin}
                  className="btn btn-rose !rounded-none !font-bold w-full flex items-center justify-center">
            <span>Join Event and Earn 10</span>
            <img className="inline align-middle w-5 ml-2" src="/images/icon-diamond.svg"
                 alt="" />
          </button>
        </div>
      </div>
    </>
  );
};

export default EventInvitation;

// fetch data on server upon every request. not using static page pre render
export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const res = await getEventDetail(context.query.eventId as string, 'both');
    return {
      props: {...res.data, af_referrer_name: context.query.af_referrer_name }
    };
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: '/404'
      },
    };
  }
}
