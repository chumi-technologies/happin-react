import React, { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';
import MyEventDetailsHead
  from '@components/page_components/MyEventDetailsPageComponents/MyEventDetailsHead';
import SvgIcon from '@components/SvgIcon';
import { HStack, Spinner, useToast, VStack } from '@chakra-ui/react';
import classnames from 'classnames';
import {
  checkinTicket,
  getEventDetail,
  getFirebaseCustomToken,
  getMerchOrdersSummary,
  getTicketsList,
  getTicketsPlayBackList,
  getUserInfo
} from 'lib/api';
import {
  currencyFormatter
} from '@components/page_components/CheckoutPageComponents/util/currencyFormat';
import { generateToast } from '@components/page_components/CheckoutPageComponents/util/toast';
import { useUserState } from 'contexts/user-state';
import moment from 'moment';
import QRCode from 'react-qr-code';
import jwt_decode from 'jwt-decode';
import Link from 'next/link';
import Head from 'next/head';
import PopUpModal from '@components/reusable/PopUpModal';
import { useSSOState } from 'contexts/sso-state';

const pageTab = ['Tickets', 'Merch', 'Replay Video'];
const routerList = ['tickets', 'merch', 'replay-video'];

const MyEventDetails = () => {
  const router = useRouter();
  const toast = useToast();
  const { user } = useUserState();
  const { exchangeForCrowdCoreToken } = useUserState();
  const [tabCur, setTabCur] = useState(0);
  const [eventDetails, setEventDetails] = useState<any>({});
  const [tickets, setTickets] = useState<any[]>([]);
  const [merchs, setMerchs] = useState<any[]>([]);
  const [playBackList, setPlayBackList] = useState<any[]>([]);
  const [eventId, setEventId] = useState('');
  const [redemCodeModal, setRedemCodeModal] = useState(false);
  const [redemModalText, setRedemModalText] = useState<any>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showSSO } = useSSOState();

  const getEventDetailsFromHappinServer = async (id: string) => {
    try {
      const res = await getEventDetail(id, 'happin');
      console.log(res);
      if (res?.data) {
        const eventDetailsFromServer = res.data;
        setEventDetails(eventDetailsFromServer);
        setEventId(eventDetailsFromServer.event.eid);
        if (eventDetailsFromServer.event.owner == user?.id) {
          setIsOwner(true);
        }
      }
    } catch (err) {
      generateToast('Unknown error about event tickets', toast);
      await router.push(`/my-events`);
      console.log(err);
    }
  };

  const getTicketsListFromHappinServer = async (id: string) => {
    try {
      const res = await getTicketsList(id);
      console.log(res);
      if (res?.data?.tickets) {
        setTickets(res.data.tickets);
      }
    } catch (err) {
      generateToast('Unknown error about event tickets', toast);
      await router.push(`/my-events`);
      console.log(err);
    }
  };

  const getMerchOrdersSummaryFromCrowdcoreServer = async (id: string) => {
    try {
      if (localStorage.getItem('chumi_jwt')) {
        let decoded: any = jwt_decode(localStorage.getItem('chumi_jwt') as string);
        if (new Date().getTime() > (decoded.exp * 1000)) {
          // token expires && revoke new token
          generateChumiJWTToken();
        }
      } else {
        // exchange token & store the crowdcore server token in local stoarge
        generateChumiJWTToken();
      }
      const res = await getMerchOrdersSummary(id);
      if (res?.merchandises) {
        setMerchs(res.merchandises);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getPlayBackListFromServer = async (id: string) => {
    try {
      const res = await getTicketsPlayBackList(id);
      console.log(res);
      if (res?.data?.tickets) {
        setPlayBackList(res.data.tickets);
      }
    } catch (err) {
      generateToast('Unknown error about playback tickets', toast);
      console.log(err);
    }
  };

  const generateChumiJWTToken = async () => {
    try {
      await exchangeForCrowdCoreToken();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckIn = async (ticket: any) => {
    console.log('checkin ');
    try {
      const paylaod = { eventID: ticket.eventID, shortCode: ticket.shortCode };
      const checkinRes = await checkinTicket(paylaod);
      if (checkinRes.code !== 200) {
        if (checkinRes.message.includes('checked already')) {
          generateToast('This invitation code has been used', toast);
        } else if (checkinRes.message.includes('checked in with a regular ticket')) {
          generateToast('You have already checked in with one ticket', toast);
        } else if (checkinRes.message.includes('Ticket not exist', toast)) {
          generateToast('Ticket code not exists', toast);
        }
        return;
      }
      if (checkinRes.data.alreadyChecked) {
        generateToast('The invitation code already redeemed by you.', toast);
        return;
      }
      if (ticket.ticketType === 'live') {
        if (router.query.id) {
          getTicketsListFromHappinServer((router.query.id).toString());
        }
        return;
        // let customToken ='';
        // const res = await getFirebaseCustomToken();
        //   if (res && res.data && res.data.customToken) {
        //     customToken = res.data.customToken;
        //     router.push(`/live-stream/${eventDetails.event._id}`)
        //     // window.open(`https://livestream.happin.app/live/e/${eventDetails.event._id}?customToken=${customToken}`, "_blank")
        // }
      } else if (ticket.ticketType === 'PFM') {
        if (router.query.id) {
          getTicketsListFromHappinServer((router.query.id).toString());
        }
        return;
      } else if (ticket.ticketType === 'playback') {
        if (router.query.id) {
          getPlayBackListFromServer((router.query.id).toString());
        }
        return;
      }
    } catch (err) {
      generateToast('Unknown error about checking in', toast);
      console.log(err);
    }
  };

  const handleReplayVideo = async () => {
    try {
      const res = await getFirebaseCustomToken();
      if (res?.data?.customToken) {
        await router.push(`/playback/${eventDetails.event._id}`);
        // window.open(`https://livestream.happin.app/live/e/${eventDetails.event._id}?customToken=${res.data.customToken}`, "_blank")
      }
    } catch (err) {
      generateToast('Unknown error about replay-video', toast);
      console.log(err);
    }
  };

  const handleEnterLiveStream = async () => {
    await router.push(`/live-stream/${eventDetails.event._id}`);
  };

  const handleTestLiveStreamLink = async () => {
    await Router.push({
      pathname: `/live-stream/${eventDetails.event._id}`,
      query: { admin: true }
    });
  };

  const handleRedemption = async (t: any) => {
    const element =
      <p className="black-title mt-6 text-md text-gray-50 text-center">Enter your redemption code
        <span className="font-bold lg:text-lg"> {t.shortCode} </span>to join
        <span className="font-bold lg:text-lg"> {eventDetails?.event?.title} </span>on Happin with
        this link:&nbsp;
        <a className="font-bold lg:text-lg"
           href={'https://happin.app/post/' + t.eventID}>https://happin.app/post/{t.eventID} </a>
      </p>;
    setRedemModalText(element);
  };

  const handleModalClose = () => {
    setRedemModalText(null);
  };

  useEffect(() => {
    if (router.query.page) {
      setTabCur(Number(router.query.page));
    }
  }, [user]);

  useEffect(() => {
    if (router.query.id) {
      if (!user) {
        (async () => {
          try {
            await getUserInfo();
          } catch (error) {
            generateToast('Please login to proceed', toast);
            showSSO();
          }
        })();
      }
    }
  }, [router.query]);

  useEffect(() => {
    if (redemModalText) {
      setRedemCodeModal(true);
    } else {
      setRedemCodeModal(false);
    }
  }, [redemModalText]);

  useEffect(() => {
    if (router.query.id) {
      (async () => {
        try {
          await getEventDetailsFromHappinServer(router.query.id as string);
          await getTicketsListFromHappinServer(router.query.id as string);
          await getPlayBackListFromServer(router.query.id as string);
          setLoading(false);
        } catch (e) {
          setLoading(false);
        }
      })();
    }
  }, [user]);

  useEffect(() => {
    if (eventId) {
      (async () => {
        try {
          await getMerchOrdersSummaryFromCrowdcoreServer(eventId);
        } catch (e) {}
      })();
    }
  }, [eventId]);

  return (
    <>
      <Head>
        <title>My Events</title>
      </Head>
      <div className="common__body">
        {
          loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner
                thickness="4px"
                speed="0.65s"
                color="rose.500"
                size="xl"
              />
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <MyEventDetailsHead eventDetail={eventDetails} />
              <div className="flex-1 h-0 web-scroll overflow-y-auto">
                <div className="container">
                  <div
                    className="flex flex-col lg:flex-row w-full max-w-2xl lg:max-w-none mx-auto py-5 sm:py-7 md:py-8">
                    <div className="my-event-details__intro">
                      <div className="sticky top-8">
                        <img src={eventDetails?.event?.cover}
                             alt={eventDetails?.event?.title}
                             className="w-full rounded-md" />
                        <div
                          className="font-bold text-lg md:text-xl my-5 md:my-6">{eventDetails?.event?.title}</div>
                        <VStack spacing={4} align="start">
                          <div className="flex items-start w-full">
                            <SvgIcon id="clock" className="text-lg text-gray-50" />
                            <div className="ml-3 flex-1">
                              <div className="text-gray-50 leading-none mb-1">{`Date & Time`}</div>
                              <div
                                className="flex items-start sm:items-center flex-col sm:flex-row text-gray-400">
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
                    <div className="md:flex-1 min-w-0 mt-8 lg:mt-0">
                      <div className="top-0 bg-gray-900 z-10">
                        <div
                          className="flex w-full p-1 border border-solid border-gray-600 rounded-full">
                          {
                            pageTab.map((item, index) => (
                              <div
                                key={index}
                                className={classnames('event-details__tab', { active: tabCur === index })}
                                onClick={() => {
                                  setTabCur(index);
                                  console.log('print');
                                  {/*https://nextjs.org/docs/tag/v9.5.2/api-reference/next/link#dynamic-routes*/
                                  }
                                  // Router.push({
                                  //   pathname: router.pathname,
                                  //   query: {
                                  //     id: router.query.id,
                                  //     page: index
                                  //   }
                                  // }, `${router.pathname}/${router.query.id}}`)
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
                            <VStack spacing={{ base: 5, sm: 8 }}>
                              {isOwner &&
                                <div className="flex sm:flex-col items-center w-full sm:text-center">
                                  <div className="flex-1 text-center sm:w-28">
                                    <button onClick={handleTestLiveStreamLink}
                                            className="btn btn-rose w-32 sm:w-full btn-sm !rounded-full !font-semibold">Test
                                      Link
                                    </button>
                                  </div>
                                </div>
                              }
                              {tickets?.length > 0 && tickets.map(t =>
                                (
                                  <div key={t._id} className="ticket-wrapper">
                                    <div className="tickets-cover">
                                      <div className="sm:absolute inset-0 text-gray-900">
                                        <div className="flex flex-col sm:flex-row h-full">
                                          <div className="tickets-cover__info">
                                            <div className="grid grid-cols-2 gap-3 w-full">
                                              <div className="col-span-2">
                                                <div className="text-sm text-gray-500">Ticket name</div>
                                                <div className="font-bold lg:text-lg">{t.name}</div>
                                              </div>
                                              <div>
                                                <div className="text-sm text-gray-500">Ticket type</div>
                                                <div
                                                  className="font-bold lg:text-lg">{t.ticketType === 'offline' ? `In person` : `${t.ticketType}`}</div>
                                              </div>
                                              <div>
                                                {t.shortCode &&
                                                  <>
                                                    <div className="text-sm text-gray-500">Redemption
                                                      Code
                                                    </div>
                                                    <div
                                                      className="text-xs text-gray-500 underline cursor-pointer"
                                                      onClick={() => handleRedemption(t)}>Transfer tickets
                                                      to other people
                                                    </div>
                                                  </>
                                                }
                                              </div>
                                              <div>
                                                <div className="text-sm text-gray-500">Status</div>
                                                <div
                                                  className="font-bold lg:text-lg">{t.checked ? 'Checked In' : 'Available'}</div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="tickets-cover__qrcode">
                                            <div
                                              className="flex sm:flex-col items-center w-full sm:text-center">
                                              {
                                                t.ticketType === 'offline' &&
                                                <div className="mr-4 sm:m-0 flex-shrink-0">
                                                  <div
                                                    className="sm:font-semibold text-gray-500 sm:text-gray-700 mb-4 text-sm">Your
                                                    QR Code
                                                  </div>
                                                  {/*<img className="w-24 mx-auto" src="/images/qrcode.jpg" alt="" />*/}
                                                  <QRCode value={t.ticketCode} size={128} />
                                                </div>
                                              }
                                              {
                                                t.ticketType === 'PFM' && !t.checked &&
                                                <div className="flex-1 text-center sm:w-28">
                                                  <button onClick={() => {
                                                    handleCheckIn(t);
                                                  }}
                                                          className="btn btn-rose w-32 sm:w-full btn-sm !rounded-full !font-semibold">Check
                                                    In
                                                  </button>
                                                </div>
                                              }
                                              {
                                                t.ticketType === 'PFM' && t.checked && (
                                                  <div
                                                    className="sm:font-semibold text-gray-500 sm:text-gray-700 mb-3 text-sm">
                                                    <div className="text-sm mt-4">
                                                      To access <a rel="noreferrer"
                                                                   href="https://help.happin.app/en/articles/4891884-what-is-vip-fan-meeting"
                                                                   target="_blank" className="link-black">VIP/Fan
                                                      meeting</a>
                                                      . Download the Happin app to meet your favourite
                                                      artists
                                                    </div>
                                                    <HStack justify="center" mt={3}>
                                                      <Link href="/">
                                                        <a
                                                          href={process.env.NEXT_PUBLIC_HAPPIN_APP_APPLE_STORE}
                                                          rel="noreferrer" target="_blank"><img
                                                          className="h-10" src="/images/app-store.svg"
                                                          alt="App Store" /></a>
                                                      </Link>
                                                    </HStack>
                                                  </div>
                                                )
                                              }
                                              {
                                                t.ticketType === 'live' && !t.checked &&
                                                <div className="flex-1 text-center sm:w-28">
                                                  <button onClick={() => {
                                                    handleCheckIn(t);
                                                  }}
                                                          className="btn btn-rose w-32 sm:w-full btn-sm !rounded-full !font-semibold">Check
                                                    In
                                                  </button>
                                                </div>
                                              }
                                              {
                                                t.ticketType === 'live' && t.checked &&
                                                <div className="flex-1 text-center sm:w-28">
                                                  <button
                                                    disabled={moment(new Date()).isAfter(moment(eventDetails?.event?.end_datetime))}
                                                    onClick={handleEnterLiveStream}
                                                    className="btn btn-rose w-32 sm:w-full btn-sm !rounded-full !font-semibold">Livestream
                                                  </button>
                                                </div>
                                              }
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {
                                      t.note &&
                                      <div className="w-11/12 mx-auto bg-gray-700 px-4 py-3 rounded-b-xl">
                                        <div className="font-semibold mb-1 text-sm">Extra information
                                        </div>
                                        <div className="text-gray-200 text-sm">{t.note}</div>
                                      </div>
                                    }
                                  </div>
                                )
                              )}
                            </VStack>
                          )
                        }
                        {
                          tabCur === 1 && (
                            <div
                              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 md:gap-5">
                              {merchs && merchs.length > 0 && merchs.map((m, i) => (
                                <div key={i}>
                                  <div className="flex items-center">
                                    <div className="w-28 h-28 mr-4">
                                      <img className="w-full h-full object-cover rounded-md" src={m.cover}
                                           alt="" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="font-semibold">{m.name}</div>
                                      <div className="text-gray-400 text-sm">size: {m.property}</div>
                                      <div className="flex items-center mt-4 text-sm">
                                        <div
                                          className="font-semibold whitespace-nowrap mr-4">{currencyFormatter(eventDetails?.currency as string).format(m.price)}</div>
                                        <div className="text-gray-400">x {m.quantity}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        }
                        {
                          tabCur === 2 && (
                            <VStack spacing={{ base: 5, sm: 8 }}>
                              {tickets && tickets.length > 0 &&
                                <div className="flex sm:flex-col items-center w-full sm:text-center">
                                  <div className="flex-1 text-center sm:w-28">
                                    <button onClick={handleReplayVideo}
                                            className="btn btn-rose w-32 sm:w-full btn-sm !rounded-full !font-semibold">Replay
                                    </button>
                                  </div>
                                </div>
                              }
                            </VStack>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
      {redemCodeModal &&
        <PopUpModal
          modalTitle="Redeem Completed"
          isModalOpen={redemCodeModal}
          setIsModalOpen={handleModalClose}
          mobilePosition={'center'}
        >
          <div style={{ margin: '0 1.25rem 1.25rem' }}>
            {redemModalText}
          </div>
        </PopUpModal>
      }
    </>
  );
};

export default MyEventDetails;
