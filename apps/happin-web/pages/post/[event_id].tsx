import { useState, useEffect } from "react";
import { Box } from '@chakra-ui/react';
import SignInBar from '../../components/SignInBar'
import PopUpModal from "../../components/reusable/PopUpModal";
import ActionSideBar from "../../components/page_components/EventPageComponents/ActionSideBar";
import EventSection from "../../components/page_components/EventPageComponents/EventSection";
import BottomBar from "../../components/page_components/EventPageComponents/BottomBar";
import EventDates from "../../components/page_components/EventPageComponents/EventDates";
import { getEventDetail, getGroupEvents } from "lib/api";
import { EventData } from "lib/model/event";
import Head from 'next/head';
import { GetServerSidePropsResult } from "next";
import { PRODUCTION_URL } from "utils/constants";
import { useRouter } from "next/router";
import RedeemEventCode from "../../components/page_components/EventPageComponents/RedeemEventCode"
import ChatWithFans from  "../../components/page_components/EventPageComponents/ChatWithFans"
import { useUserState } from "contexts/user-state";
import { useIntercom } from 'react-use-intercom';

const Post = (props: EventData) => {
  const router = useRouter();
  const [hideSigninBar, setHideSigninBar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const { setEventDeepLink, user } = useUserState();
  const { update } = useIntercom();
  const eventData = props;
  const groupEvents = props.groupEvents;
  const [queryParams, setQueryParams] = useState<{code: string, affiliate: string}>({affiliate: '', code: ''});
  let eventLocation = 'Stream Via Happin'
  let eventDescription = ' - You can watch livestream on https://livestream.happin.app or download Happin App'
  if (typeof window !== 'undefined') {
    if (window.innerWidth < 768) {
      update({hideDefaultLauncher: true})
    }
  }

  useEffect(()=> {
    if(router.query.affiliate) {
      setQueryParams((x)=> {x.affiliate = router.query.affiliate as string; return {...x}})
    }
    if(router.query.sharecode) {
      setQueryParams((x)=> {x.code = router.query.sharecode as string; return {...x}})
    }
  }, [])

  useEffect(() => {
    const hideSigninBar = !localStorage.getItem('hide_signin_bar');
    setHideSigninBar(!hideSigninBar);
    if (eventData) {
      setEventDeepLink(eventData.event.deepLink);
    }
  }, [])

  const firstTimeVisitHandler = () => {
    localStorage.setItem('hide_signin_bar', '1');
    setHideSigninBar(s => !s);
  }


  (() => {
    if (eventData) {
      if (eventData.event.acInfo.location !== 'happin.app' && eventData.event.acInfo.eventType !== 'hybrid') {
        eventLocation = eventData.event.acInfo.venueName || eventData.event.acInfo.location;
        eventDescription = ` - You can attend event @ ${eventData.event.acInfo.venueName || eventData.event.acInfo.location}`;
      } else if (eventData.event.acInfo.eventType === 'hybrid') {
        eventLocation = eventData.event.acInfo.venueName || eventData.event.acInfo.location + ' and Stream Via Happin';
        eventDescription = ` - You can attend event @ ${eventData.event.acInfo.venueName || eventData.event.acInfo.location} and watch livestream on https://happin.app or download Happin App`
      }
    }
  })()


  const seoProps = {
    description: eventData?.event?.title + eventDescription,
    keywords: `${eventData?.event?.tags.toString()}, Happin livestream`,
    title: eventData?.event?.title + ' @ ' + eventLocation,
    ogImage: eventData?.event?.socialImg || eventData?.event?.cover,
    ogUrl: `${PRODUCTION_URL}${router.asPath}`,
    twitterImage: eventData?.event?.socialImg || eventData?.event?.cover
  }


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
      <div className="event-details__page">
        {/* Top Popups for First-Time Visitors */}
        {(!hideSigninBar && !user)  && (
          <SignInBar setIsFirstTimeVisitor={firstTimeVisitHandler} />
        )}

        {/* Event Dates Modal */}
        {isModalOpen && (
          <PopUpModal
            modalTitle="Event Dates"
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          >
            <EventDates groupEvents={groupEvents} setIsModalOpen={setIsModalOpen} eventData={eventData} />
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
              <RedeemEventCode setIsRedeemModalOpen={setIsRedeemModalOpen} happinEID={eventData.event._id} />
            </div>
          </PopUpModal>
        )}
        {/* chat with fans button modal */}
        {isChatModalOpen && (
          <PopUpModal
            modalTitle="Find other fans here!"
            isModalOpen={isChatModalOpen}
            setIsModalOpen={setIsChatModalOpen}
          >
            <div className="m-5">
              <ChatWithFans></ChatWithFans>
            </div>
          </PopUpModal>
        )}
        <div id="scroll-body" className="relative lg:flex h-full lg:flex-row web-scroll overflow-y-auto">
          <ActionSideBar
            playbackStart={!!eventData?.event?.ODPBStart}
            eventData={eventData}
          />

          {/* Event Image */}
          <div className="lg:sticky lg:top-0 w-full lg:w-5/12 xl:w-1/2 lg:h-full overflow-hidden">
            <Box
              className="hidden lg:block"
              w="100%"
              h="100%"
              position="absolute"
              style={{ filter: "blur(40px)", transform: "scale(1.5)" }}
              backgroundImage={`url('${eventData?.event?.cover}')`}
              backgroundPosition="center"
              backgroundRepeat="no-repeat"
              backgroundSize="cover"
            />
            <img
              src={`${eventData?.event?.cover}`}
              className="sm:relative lg:absolute w-full top-0 bottom-0 m-auto"
            />
          </div>

          {/* Event Texts */}
          <div className="w-full lg:w-7/12 xl:w-1/2 pb-16 sm:pb-20">
            <div className="event-details__container relative py-6 sm:py-8 md:py-14">
              <EventSection setIsRedeemModalOpen={setIsRedeemModalOpen} setIsModalOpen={setIsModalOpen} eventData={eventData} groupEvents={groupEvents} />
            </div>
            <BottomBar queryParams={queryParams}  eventData={eventData} setIsChatButtonOpen={setIsChatModalOpen}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;


// fetch data on server upon every request.. not using static page pre render
export async function getServerSideProps(context: { params: { event_id: string } }): Promise<GetServerSidePropsResult<any>> {
  try {
    const titleWithACID = context.params.event_id
    const tokens = titleWithACID.split('-');
    const acid = tokens[tokens.length - 1];
    const res = await getEventDetail(acid, 'crowdcore')
    const props = res.data
    if (res.data?.event?.groupAcid) {
      const groupEvents = await getGroupEvents(res.data.event.groupAcid || "")
      props.groupEvents = groupEvents;
    }
    if (!res.data) {
      throw new Error('Event not found');
    }
    return {
      props,
    }
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props: {},
    };
  }
}


