import React, { useState, useEffect } from 'react';
import { useToast, VStack } from '@chakra-ui/react';
import SvgIcon from '@components/SvgIcon';
import moment from 'moment';
import { useRouter } from 'next/router';
import { getEventDetail } from 'lib/api';
import { generateToast, generateErrorToast, generateSuccessToast } from "@components/page_components/CheckoutPageComponents/util/toast";


const InviteUser = () => {
    const toast = useToast();
    const router = useRouter();
    const [eventDetails, setEventDetails]: any = useState({});

    useEffect(() => {
        if (router.query.eventId) {
            (async () => {
                try {
                    const eventId = router.query.eventId as string;
                    console.log(eventId)
                    const res = await getEventDetail(eventId, 'both')
                    console.log(res);
                    if (res.data) {
                        setEventDetails(res.data);
                    }
                }
                catch (error) {
                    console.log(error)
                    generateErrorToast("Get event error", toast);
                    router.push("/");
                }

            })();
        }
    }, [router.query])
    return (
        <div className="invite-user__page">
            <div className="invite-user__event-detail container pb-10">
                <div className="sticky top-8">
                    <img src={eventDetails?.event?.cover}
                        alt={eventDetails?.event?.title}
                        className="w-full rounded-md" />
                    <div className="font-bold text-lg text-white md:text-xl my-5 md:my-6">{eventDetails?.event?.title}</div>
                    <VStack
                        spacing={4}
                        align="start"
                    >
                        <div className="flex items-start w-full">
                            <SvgIcon id="clock" className="text-lg text-gray-50" />
                            <div className="ml-3 flex-1">
                                <div className="text-gray-50 leading-none mb-1">{`Date & Time`}</div>
                                <div className="flex items-start sm:items-center flex-col sm:flex-row text-gray-400">
                                    <div className="flex-1 mr-2 text-sm mb-2 sm:mb-0">
                                        {`${moment(eventDetails?.event?.start_datetime).format('dddd MMMM Do, h:mma')} - ${moment(eventDetails?.event?.end_datetime).format('dddd MMMM Do, h:mma')}  
                              (${moment.duration(moment(eventDetails?.event?.end_datetime).diff(moment(eventDetails?.event?.start_datetime))).asHours().toFixed(2)} hours)`}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start w-full">
                            <SvgIcon id="location" className="text-lg text-gray-50" />
                            <div className="ml-3">
                                <div className="text-gray-50 leading-none mb-1">
                                    {eventDetails?.event?.acInfo?.location}
                                </div>
                                <div className="text-gray-400 text-sm">
                                    {`${eventDetails?.event?.city || ''} ${eventDetails?.event?.state || ''}`}
                                </div>
                            </div>
                        </div>
                        {eventDetails.isLive && <div className="flex items-center w-full">
                            <SvgIcon id="livestream" className="text-lg text-gray-50" />
                            <div className="ml-3 text-gray-50">Livestream</div>
                        </div>
                        }
                    </VStack>
                </div>
            </div>
            <div className="relative overflow-hidden pt-14 pb-20 md:py-32 lg:py-40 container">
                <div className="absolute left-24 md:left-96 top-0 md:top-10 w-6 h-6 md:w-8 md:h-8 rounded-full home__color-pink" />
                <div className="absolute left-80 -bottom-8 w-24 h-24 rounded-full bg-yellow-500" />
                <div className="container">
                    <div className="flex items-center flex-col md:flex-row text-center md:text-left">
                        <div className="relative sm:w-3/5 md:w-1/2 xl:w-7/12 black-title text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-7 md:mb-0 text-rose-500">
                            A new experience to attend events
                        </div>
                        <div className="md:pl-12 lg:pl-16 md:w-1/2 xl:w-5/12">
                            <div className="relative text-lg font-semibold mb-12">
                                <div className="absolute right-20 -top-10 w-4 h-4 rounded-full home__color-pink" />
                                <p className="mb-4 md:mb-5 text-white">
                                    {`Don't`} wait! Bring yourself. Join the private event community, attend audio pre-event/after party, send each other emoji gifts, talk over voice, video, text. Find your crew based on your interests!
                                </p>
                            </div>
                            <div className="flex flex-col items-center justify-center sm:flex-row">
                                <a target="_blank" href="https://apps.apple.com/app/id1527348429" rel="noreferrer">
                                    <img className="h-12 hover:opacity-90 transition" src="/images/app-store-white.svg" alt="app-store" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InviteUser
