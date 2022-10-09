import React from 'react';
import EventTitle from './EventTitle';
import EventDescription from './EventDescription';
// import EventLineUp from "./EventLineUp";
import EventHost from './EventHost';
import { EventData } from 'lib/model/event';
import EventAttendees from './EventAttendees';
import EventGallery from './EventGallery';
import EventInterested from './EventInterested';

const EventSection = ({
  setIsModalOpen,
  eventData,
  groupEvents,
  setIsRedeemModalOpen,
  setOpenIframe,
  canUseIframe,
  setPreventScrolling
}: {
  setIsModalOpen: (arg: boolean) => void,
  eventData: EventData, groupEvents: any,
  setIsRedeemModalOpen: (arg: boolean) => void,
  setPreventScrolling: (arg: any) => void,
  setOpenIframe: (arg: any) => void,
  canUseIframe: boolean,
}) => {
  //const [firstActive, setFirstActive] = useState(true)
  //const [tabCur, setTabCur] = useState(0)
  // const [isActive, setActive] = useState(0);
  const galleryOriginalData = [
    {
      id: '0',
      src: 'https://images.unsplash.com/photo-1645828694012-307875ab3761?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: '1',
      src: 'https://images.unsplash.com/photo-1627483297886-49710ae1fc22?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: '2',
      src: 'https://images.unsplash.com/photo-1645839449196-62bde406052e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: '3',
      src: 'https://images.unsplash.com/photo-1645771845014-7077d5d0f058?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: '4',
      src: 'https://images.unsplash.com/photo-1640622659787-d15655c3a2ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: '5',
      src: 'https://images.unsplash.com/photo-1645742175891-9207e6a52e6f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: '6',
      src: 'https://images.unsplash.com/photo-1645810809381-97f6fd2f7d10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80'
    },
    {
      id: '7',
      src: 'https://images.unsplash.com/photo-1645542444755-bc554393084a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=300&q=80'
    }
  ];
  const interestedList = [
    {
      _id: '01',
      link: '/',
      title: 'Willson Fisher: Back to Abnormal World Standup',
      cover: 'https://images.unsplash.com/photo-1645817745517-163a655a0606?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
      avatar: 'https://p6.toutiaoimg.com/origin/tos-cn-i-qvj2lq49k0/54043582bdb04811ae3e4877ab079157?from=pc',
      username: 'JeesieJe123',
    },
    {
      _id: '02',
      link: '/',
      title: 'exposing my family drama ⛄',
      cover: 'https://images.unsplash.com/photo-1645737522838-02ff9b9b39be?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
      avatar: 'https://p19-sign.tiktokcdn-us.com/tos-useast5-avt-0068-tx/2716efc7e6cb8fa3b28ea4660009aaaa~c5_100x100.webp?x-expires=1640588400&x-signature=KgeyUInhRAcg2BxeLwAjMi2u6oI%3D',
      username: 'Shahad',
      members: 134,
    },
    {
      _id: '03',
      link: '/',
      title: 'Merry Christmas guys!',
      cover: 'https://images.unsplash.com/photo-1645815431270-7a0f9e676ae2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
      avatar: 'https://p6.toutiaoimg.com/origin/tos-cn-i-qvj2lq49k0/54043582bdb04811ae3e4877ab079157?from=pc',
      username: 'JeesieJe123'
    },
    {
      _id: '04',
      link: '/',
      title: 'exposing my family drama ⛄',
      cover: 'https://images.unsplash.com/photo-1555918001-e20d10c2bc1c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
      avatar: 'https://p19-sign.tiktokcdn-us.com/tos-useast5-avt-0068-tx/2716efc7e6cb8fa3b28ea4660009aaaa~c5_100x100.webp?x-expires=1640588400&x-signature=KgeyUInhRAcg2BxeLwAjMi2u6oI%3D',
      username: 'Shahad',
      members: 34,
    },
    {
      _id: '05',
      link: '/',
      title: 'exposing my family drama ⛄',
      cover: 'https://images.unsplash.com/photo-1645810798586-08e892108d67?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
      avatar: 'https://p19-sign.tiktokcdn-us.com/tos-useast5-avt-0068-tx/2716efc7e6cb8fa3b28ea4660009aaaa~c5_100x100.webp?x-expires=1640588400&x-signature=KgeyUInhRAcg2BxeLwAjMi2u6oI%3D',
      username: 'Shahad',
      members: 26
    },
  ];
  return (
    <>
      <EventTitle
        event={eventData.event}
        setIsModalOpen={setIsModalOpen}
        eventTitle={eventData.event.title}
        isLiveStream={eventData.event.streamEnabled}
        eventStartDate={eventData.event.start_datetime}
        eventEndDate={eventData.event.end_datetime}
        price={eventData.event.min_price}
        location={eventData.event.acInfo}
        groupEvents={groupEvents}
        currency={eventData.event.currency}
        category={eventData.event.category}
        categoryType={eventData.event.categoryType}
        playbackStart={!!eventData.event.ODPBStart}
        sourceURL={eventData.event.sourceUrl}
        setIsRedeemModalOpen={setIsRedeemModalOpen} />

      <div className="py-6 sm:py-10">
        <EventHost
          hostName={eventData.event.creator?.name}
          hostProfileImageUrl={eventData.event.creator?.avatar}
          hostEmail={eventData.event.creator?.email}
        />
      </div>
      {/* <div className="py-5 sm:py-8">
        <EventGallery gallery={galleryOriginalData} />
      </div> */}
      <div className="h-px bg-gray-600" />
      {/* About and Agenda links */}
      {/*<div className="sticky top-0 bg-gray-900 z-10">
        <div className="flex w-full mt-8 sm:mt-14 p-1 border border-solid border-gray-600 rounded-full">
          <Link
            className={classNames('event-details__tab', {active: isActive === 0})}
            activeClass="active"
            containerId="scroll-body"
            onClick={()=>{setActive(0)}}
            to="about"
            //spy={true}
            smooth={true}
            offset={-50}
            duration={500}
          >
            About
          </Link>
          <Link
            className={classNames('event-details__tab', {active: isActive === 1})}
            onClick={()=>{setActive(1)}}
            activeClass="active"
            containerId="scroll-body"
            to="agenda"
            //spy={true}
            smooth={true}
            offset={-50}
            duration={500}
          >
            Agenda
          </Link>
        </div>
      </div>*/}
      {/*<div className="flex w-full p-1 border border-solid border-gray-600 rounded-full mt-10">
        <div className={classnames('event-details__tab', { active: tabCur === 0 })} onClick={() => { setTabCur(0) }}>
          About
        </div>
        <div className={classnames('event-details__tab', { active: tabCur === 1 })} onClick={() => { setTabCur(1) }}>
          Agenda
        </div>
      </div>*/}
      {/*{tabCur === 0 &&*/}
      {/*  <Element name="about" className="py-6 sm:py-10">*/}
      <div className="py-5 sm:py-8">
        <EventDescription
          setOpenIframe={setOpenIframe} canUseIframe={canUseIframe}
          setPreventScrolling={setPreventScrolling}
          description={eventData.event.content}
          rawDescription={eventData.event.contentPlainText}
          sourceURL={eventData.event.sourceUrl}
        />
      </div>
      <div className="h-px bg-gray-600" />
      <div className="py-5 sm:py-8">
        <EventAttendees topProfiles={eventData.match.topProfiles} />
      </div>
      <div className="h-px bg-gray-600" />
      {/* <div className="h-px bg-gray-600" /> */}
      {/* <div className="pt-5 sm:pt-8">
        <EventInterested list={interestedList} />
      </div> */}
      {/*</Element>*/}
      {/*}*/}

      {/*{tabCur === 1 &&*/}
      {/*<Element name="agenda" className="py-6 sm:py-10">
          <EventAgenda eventData={eventData} />

        </Element>*/}
      {/*}*/}
    </>
  );
};

export default EventSection;
