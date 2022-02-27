import React, { useEffect, useState } from 'react';
import { Avatar, useToast } from '@chakra-ui/react';
import SvgIcon from '@components/SvgIcon';
import { useRouter } from 'next/router';
import { getEventDetail } from 'lib/api';
import { generateToast, generateErrorToast, generateSuccessToast } from "@components/page_components/CheckoutPageComponents/util/toast";
import moment from 'moment';


const EventInvitation = () => {
  const router = useRouter();
  const toast = useToast();
  const [eventDetails, setEventDetails] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [inviterImage, setInviterImage] = useState<string>('');
  const [inviterName, setInviterName] = useState<string>('');
  const [universalLink, setUniversalLink] = useState<string>('');

  useEffect(() => {
    if (router.query.eventId) {
      (async () => {
        try {
          const eventId = router.query.eventId as string;
          const res = await getEventDetail(eventId, 'both')
          console.log(res);
          if (res.data) {
            setIsLoading(false);
            setEventDetails(res.data);
          }
          else {
            throw res.message
          }
        }
        catch (error) {
          console.log(error)
          generateErrorToast("Get event error", toast);
          router.push("/");
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
  }, [router.query])


  const handleJoin = () => {
    setTimeout(function () { window.location.href="https://apps.apple.com/app/id1527348429"; }, 25);
    window.location.href = universalLink
}

const handleEventDetail = () => {
  router.push("/post/"+eventDetails?.acid)
}
  return (
    isLoading ? <></> :
      <div className="w-full overflow-y-auto max-w-md mx-auto">
        <div className="event-invitation__banner">
          <div className="pt-8 px-4 mb-5 text-center">
            <h1 className="text-gray-900 text-3xl black-title font-extrabold">Event Invitation</h1>
          </div>
          <div className="px-4">
            <div className="rounded-2xl bg-gray-800">
              <div className="text-center pt-4 px-4">
                <div className="event-invitation__avatar-bg">
                  <Avatar boxSize={16} src={inviterImage} />
                  <h2 className="text-gray-100 text-2xl font-extrabold black-title mt-5 mb-4">You have an invitation</h2>
                  <div className="text-gray-400 text-base font-medium">
                    <p><span className="text-gray-100">{inviterName}</span> invited you</p>
                    <p className="mt-0.5">to this event {eventDetails?.match?.total >= 2 && <span>with other {eventDetails?.match?.total} Happiners</span>}</p>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center h-12 px-8 overflow-hidden">
                <div className="absolute -left-6 w-12 h-12 rounded-full bg-gray-900" />
                <div className="w-full border-t-8 border-dotted border-gray-900" />
                <div className="absolute -right-6 w-12 h-12 rounded-full bg-gray-900" />
              </div>
              <div className="flex p-5 pt-2">
                <img className="w-20 h-20 rounded-md object-cover" src={eventDetails?.event?.cover} alt="" />
                <div className="ml-4 flex-1 min-w-0">
                  <div className="text-yellow-500 font-semibold text-sm mb-1">{moment(eventDetails?.event?.start_datetime).format('ddd, MMMM DD・h:mmA')}</div>
                  <div className="text-gray-100 font-semibold ellipsis-2 text-sm mb-1">{eventDetails?.event?.title}</div>
                  <div className="flex items-center text-sm">
                    <SvgIcon id="location" className="text-xs text-gray-400 mr-1" />
                    <div className="flex-1 text-gray-400 truncate">{eventDetails?.event?.acInfo?.location}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4">
          <h1 className="mt-6 mb-4 text-2xl black-title font-extrabold text-rose-500">Meet interesting attendees in event match and group chat</h1>
        </div>
        <div className="relative w-full flex gap-3 snap-x overflow-x-auto hide-scrollbar">
          {eventDetails?.match?.topProfiles.map((item: any, index:number) => {
            if (index < 6) {
              return (
                <div className="snap-center w-[28%] shrink-0 first:ml-4 last:mr-4" key={item._id}>
                  <img className="shrink-0 w-full aspect-[9/16] object-cover rounded-lg"
                    src={item.photourl} />
                  <div className="mt-1 text-sm font-semibold text-gray-100">{item.displayname}</div>
                </div>
              )
            }
          })}
        </div>
        <div className="px-4 mt-4">
          <div className="text-gray-400 text-[15px] font-medium">
            <span className="mr-2">🔥</span><span className="text-gray-100">{eventDetails?.match?.topProfiles[0].displayname} </span>and other {eventDetails?.match?.total} people have joined
          </div>
          <div className="text-gray-400 text-[15px] font-medium">
            <span className="mr-2">🎉</span>
            {eventDetails?.match?.numOfGroupChat ?
              <span className="text-gray-100">{eventDetails?.match?.numOfGroupChat} event group chats </span> :
              <span className="text-gray-100">Event group chats </span>
            }
            created
          </div>
        </div>
        <div className="mt-12 px-10 pb-6">
          <button onClick={handleJoin} className="btn btn-rose !rounded-full !font-bold w-full flex items-center justify-center">
            <span>Join Event and Earn 10</span>
            <img className="inline align-middle w-5 ml-2" src="/images/icon-diamond.svg" alt="" />
          </button>
          <div className="text-center mt-2">
            <button onClick={handleEventDetail} className="btn text-gray-100 active:text-rose-500">View Event Details</button>
          </div>
        </div>
      </div>
  )
}

export default EventInvitation