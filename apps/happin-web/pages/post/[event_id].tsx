import React, { useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import { GetStaticPaths } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Button, Spinner } from '@chakra-ui/react';
import classnames from 'classnames';
import { ArrowDownIcon } from '@chakra-ui/icons';
import { PRODUCTION_URL } from 'utils/constants';
import { useUserState } from 'contexts/user-state';
import SignInBar from '@components/SignInBar';
import PopUpModal from '@components/reusable/PopUpModal';
import EventSection from '@components/page_components/EventPageComponents/EventSection';
import BottomBar from '@components/page_components/EventPageComponents/BottomBar';
import EventDates from '@components/page_components/EventPageComponents/EventDates';
import RedeemEventCode from '@components/page_components/EventPageComponents/RedeemEventCode';
import ChatWithFans from '@components/page_components/EventPageComponents/ChatWithFans';
import Modal from '@components/reusable/Modal';
import { getEventDetail, getGroupEvents } from 'lib/api';
import { EventData } from 'lib/model/event';
import { Transition } from '@headlessui/react';

// third party event website that set x-frame-option to origin, can't open in iframe
const forbidDomain = ['veeps.com'];

const ThirdPartyIframe = (props: any) => {
  return (
    <div
      className={`event-details__backdrop ${
        props.openIframe ? 'event-details__show_backdrop' : ''
      }`}
      style={{ position: props.openIframe ? 'absolute' : 'fixed' }}
    >
      <a
        className="event-details__close_iframe"
        onClick={() => {
          props.closeIframe();
        }}
      >
        <ArrowDownIcon
          style={{ borderRadius: '50%', border: '1px solid white' }}
        />
      </a>
      <iframe
        frameBorder="0"
        id="event_details_iframe"
        scrolling="auto"
        src={props.thirdPartyUrl}
      ></iframe>
    </div>
  );
};

const Post = (props: EventData & { eventId: string }) => {
  const router = useRouter();
  const [hideSigninBar, setHideSigninBar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [redeemComplete, setRedeemComplete] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [preventScrolling, setPreventScrolling] = useState<boolean>(false);
  const { setEventDeepLink, user } = useUserState();
  const [tokenExist, setTokenExist] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const eventData = props;
  const groupEvents = props.groupEvents;
  const [queryParams, setQueryParams] = useState<{
    code: string;
    affiliate: string;
    organizer_token: string;
  }>({
    affiliate: '',
    code: '',
    organizer_token: '',
  });
  let eventLocation = 'Stream Via Happin';
  let eventDescription =
    ' - You can watch livestream on https://livestream.happin.app or download Happin App';

  const [openIframe, setOpenIframe] = useState<boolean>(false);
  const [thirdPartyUrl, setThirdPartyUrl] = useState<string>();
  const [canUseIframe, setCanUseIframe] = useState(false);
  const [iframePortal, setIframePortal] = useState(<></>);

  useEffect(() => {
    console.log(111);
    setIframePortal(
      ReactDom.createPortal(
        <ThirdPartyIframe
          openIframe={openIframe}
          thirdPartyUrl={thirdPartyUrl}
          closeIframe={closeIframe}
        />,
        document.querySelector('#third_party_event_iframe') as Element,
      ),
    );
  }, [openIframe, thirdPartyUrl]);

  useEffect(() => {
    console.log(router.isFallback);
  }, [router.isFallback]);

  const closeIframe = () => {
    setOpenIframe(false);
    setPreventScrolling(false);
  };

  useEffect(() => {
    console.log(props);
    if (eventData.event.sourceUrl) {
      setThirdPartyUrl(eventData.event.sourceUrl);
      if (eventData.event.sourceUrlAllowIframe) {
        setCanUseIframe(true);
      } else {
        setCanUseIframe(false);
      }
    }
  }, []);

  useEffect(() => {
    if (router.query.affiliate) {
      setQueryParams(x => {
        x.affiliate = router.query.affiliate as string;
        return { ...x };
      });
    }
    if (router.query.sharecode) {
      setQueryParams(x => {
        x.code = router.query.sharecode as string;
        return { ...x };
      });
    }
    if (router.query.token) {
      setQueryParams(x => {
        x.organizer_token = router.query.token as string;
        return { ...x };
      });
    }
  }, []);

  useEffect(() => {
    const hideSigninBar = localStorage.getItem('hide_signin_bar');
    setHideSigninBar(!!hideSigninBar);
    if (eventData) {
      setEventDeepLink(eventData.event.deepLink);
    }
  }, []);

  const firstTimeVisitHandler = () => {
    localStorage.setItem('hide_signin_bar', '1');
    setHideSigninBar(s => !s);
  };

  (() => {
    if (eventData) {
      if (
        eventData.event.acInfo.location !== 'happin.app' &&
        eventData.event.acInfo.eventType !== 'hybrid'
      ) {
        eventLocation =
          eventData.event.acInfo.venueName || eventData.event.acInfo.location;
        eventDescription = ` - You can attend event @ ${
          eventData.event.acInfo.venueName || eventData.event.acInfo.location
        }`;
      } else if (eventData.event.acInfo.eventType === 'hybrid') {
        eventLocation =
          eventData.event.acInfo.venueName ||
          eventData.event.acInfo.location + ' and Stream Via Happin';
        eventDescription = ` - You can attend event @ ${
          eventData.event.acInfo.venueName || eventData.event.acInfo.location
        } and watch livestream on https://happin.app or download Happin App`;
      }
    }
  })();

  const seoProps = {
    description: eventData?.event?.title + eventDescription,
    keywords: `${eventData?.event?.tags.toString()}, Happin livestream`,
    title: eventData?.event?.title + ' @ ' + eventLocation,
    ogImage: eventData?.event?.socialImg || eventData?.event?.cover,
    ogUrl: `${PRODUCTION_URL}${router.asPath}`,
    twitterImage: eventData?.event?.socialImg || eventData?.event?.cover,
  };

  useEffect(() => {
    if (
      localStorage.getItem('happin_web_jwt') &&
      localStorage.getItem('happin_refresh_token')
    ) {
      setTokenExist(true);
    } else setTokenExist(false);

    if (user) {
      setTokenExist(true);
    }
  }, [user]);

  return (
    <>
      <Head>
        <meta
          name="description"
          key="description"
          content={seoProps.description}
        />
        <meta name="keywords" key="keywords" content={seoProps.keywords} />
        <title>{seoProps.title}</title>
        <meta property="og:title" key="og:title" content={seoProps.title} />
        <meta
          property="og:description"
          key="og:description"
          content={seoProps.description}
        />
        <meta property="og:image" key="og:image" content={seoProps.ogImage} />
        <meta
          property="og:site_name"
          key="og:site_name"
          content={seoProps.title}
        />
        <meta property="og:url" key="og:url" content={seoProps.ogUrl} />
        <meta property="og:type" key="og:type" content={'website'} />
        <meta
          name="twitter:title"
          key="twitter:title"
          content={seoProps.title}
        />
        <meta
          name="twitter:description"
          key="twitter:description"
          content={seoProps.description}
        />
        <meta
          name="twitter:image"
          key="twitter:image"
          content={seoProps.twitterImage}
        />
        <meta
          name="twitter:card"
          key="twitter:card"
          content="summary_large_image"
        />
      </Head>
      {iframePortal}
      <div className="event-details__page">
        <Transition
          show={router.isFallback}
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[99]"
        >
          <Spinner thickness="4px" speed="0.65s" color="yellow.500" size="xl" />
        </Transition>
        {/* Top Popups for First-Time Visitors */}
        {!hideSigninBar && !tokenExist && (
          <SignInBar setIsFirstTimeVisitor={firstTimeVisitHandler} />
        )}

        {/* Event Dates Modal */}
        {isModalOpen && (
          <PopUpModal
            modalTitle="Event Dates"
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          >
            <EventDates
              groupEvents={groupEvents}
              setIsModalOpen={setIsModalOpen}
              eventData={eventData}
            />
          </PopUpModal>
        )}
        {/* redeem modal */}
        {isRedeemModalOpen && (
          <PopUpModal
            modalTitle="Redeem Ticket Code"
            isModalOpen={isRedeemModalOpen}
            setIsModalOpen={setIsRedeemModalOpen}
          >
            <div className="m-5">
              <RedeemEventCode
                setRedeemComplete={setRedeemComplete}
                setIsRedeemModalOpen={setIsRedeemModalOpen}
                happinEID={eventData.event._id}
              />
            </div>
          </PopUpModal>
        )}
        {/* redeem success modal */}
        {redeemComplete && (
          <PopUpModal
            modalTitle="Redeem Completed"
            isModalOpen={redeemComplete}
            setIsModalOpen={setRedeemComplete}
          >
            <div className="m-5">
              <p className="mt-6 text-md text-gray-400 text-center">
                Check your tickets by clicking the button below
              </p>
              <div className="mt-6 flex" style={{ justifyContent: 'center' }}>
                <Button
                  variant="solid"
                  colorScheme="cyan"
                  fontSize={{ base: 'medium', sm: 'medium' }}
                  h="40px"
                  w="100%"
                  mt={{ base: '10', sm: '5' }}
                  onClick={() => {
                    router.push('/my-events');
                  }}
                >
                  My Events
                </Button>
              </div>
            </div>
          </PopUpModal>
        )}
        {/* chat with fans button modal */}
        {isChatModalOpen && (
          <PopUpModal
            modalTitle="Meet new friends here"
            isModalOpen={isChatModalOpen}
            setIsModalOpen={setIsChatModalOpen}
          >
            <div className="m-5">
              <ChatWithFans></ChatWithFans>
            </div>
          </PopUpModal>
        )}
        <div
          className={classnames(
            'relative lg:flex h-full lg:flex-row web-scroll',
            preventScrolling ? 'sm:overflow-y-hidden' : 'sm:overflow-y-auto',
          )}
        >
          {/*<ActionSideBar
            playbackStart={!!eventData?.event?.ODPBStart}
            eventData={eventData}
          />*/}

          {/* Event Image */}
          <div className="relative lg:sticky lg:top-0 overflow-hidden lg:w-5/12 xl:w-1/2">
            <div className="w-full max-w-[640px] lg:max-w-none mx-auto lg:h-full">
              <Box
                className="hidden sm:block"
                w="100%"
                h="100%"
                position="absolute"
                style={{ filter: 'blur(40px)', transform: 'scale(1.5)' }}
                backgroundImage={`url('${eventData?.event?.cover}')`}
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                backgroundSize="cover"
              />
              <img
                src={`${eventData?.event?.cover}`}
                className="event-details__img"
              />
            </div>
          </div>

          {/* Event Texts */}
          <div className="w-full lg:w-7/12 xl:w-1/2 pb-[60px] sm:pb-20">
            <div className="event-details__container relative py-6 sm:py-8 md:py-14">
              <EventSection
                setOpenIframe={setOpenIframe}
                canUseIframe={canUseIframe}
                setPreventScrolling={setPreventScrolling}
                setIsRedeemModalOpen={setIsRedeemModalOpen}
                setIsModalOpen={setIsModalOpen}
                eventData={eventData}
                groupEvents={groupEvents}
              />
            </div>
            <BottomBar
              setOpenIframe={setOpenIframe}
              canUseIframe={canUseIframe}
              setPreventScrolling={setPreventScrolling}
              queryParams={queryParams}
              eventData={eventData}
              setIsChatButtonOpen={setIsChatModalOpen}
              setIsOpen={setIsOpen}
            />
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        containerClass="event-details__download-modal max-w-[580px]"
      >
        <h1 className="font-bold black-title text-3xl sm:text-5xl !leading-[1.15] text-gray-50 text-left">
          Meet, <br />
          Chat, <br />
          <span className="text-yellow-500">Experience</span>
        </h1>
        <div className="flex space-x-3 sm:space-x-8 mt-3 sm:mt-4">
          <div className="sm:w-1/4">
            <div className="hidden sm:block bg-gray-600 rounded-md sm:rounded-lg p-1 sm:p-2.5">
              <img className="w-full" src="/images/qrcode.jpg" alt="" />
            </div>
            <a
              className="block w-24 sm:w-full mt-3"
              target="_blank"
              href="https://apps.apple.com/app/id1527348429"
              rel="noreferrer"
            >
              <img
                className="w-full border border-solid border-gray-500 rounded-md sm:rounded-lg"
                src="/images/app-store.svg"
                alt="App Store"
              />
            </a>
          </div>
          <div className="sm:w-1/4">
            <div className="hidden sm:block bg-gray-600 rounded-md sm:rounded-lg p-1 sm:p-2.5">
              <img className="w-full" src="/images/qrcode.jpg" alt="" />
            </div>
            <div className="w-24 sm:w-full mt-3">
              <img
                className="w-full border border-solid border-gray-500 rounded-md sm:rounded-lg"
                src="/images/google-play.svg"
                alt="Google Play"
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  // const data = await getData();
  // const pathsWithParams = data.stars.map((star: starInterface) => ({ params: { something: star.id }}))

  return {
    paths: [
      {
        params: {
          event_id: 'yorkfest-virtual-concert-61399548c281030008b712dd',
        },
      },
    ],
    fallback: 'blocking',
  };
};

export async function getStaticProps({
  params,
}: {
  params: { event_id: string };
}) {
  try {
    const titleWithACID = params.event_id;
    const tokens = titleWithACID.split('-');
    const acid = tokens[tokens.length - 1];
    const res = await getEventDetail(acid, 'both');
    const props = res.data;
    if (res.data?.event?.groupAcid) {
      props.groupEvents = await getGroupEvents(res.data.event.groupAcid || '');
    }
    return {
      props: {
        ...props,
        eventId: acid,
      },
    };
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
      props: {},
    };
  }
}

// fetch data on server upon every request. not using static page pre render
// export async function getServerSideProps(context: { params: { event_id: string } }): Promise<GetServerSidePropsResult<any>> {
//   try {
//     const titleWithACID = context.params.event_id
//     const tokens = titleWithACID.split('-');
//     const acid = tokens[tokens.length - 1];
//     const res = await getEventDetail(acid, 'both')
//     const props = res.data
//     if (res.data?.event?.groupAcid) {
//       props.groupEvents = await getGroupEvents(res.data.event.groupAcid || "");
//     }
//     if (!res.data) {
//       throw new Error('Event not found');
//     }
//     return {
//       props,
//     }
//   } catch (err) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: "/404",
//       },
//       props: {},
//     };
//   }
// }
