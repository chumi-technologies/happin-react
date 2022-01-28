import React, { useState, useRef, useEffect, useCallback } from "react";
import { Avatar, Spinner, useToast } from '@chakra-ui/react';
import SvgIcon from '@components/SvgIcon';
import { Check, Plus } from '@icon-park/react';
import classnames from 'classnames';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css'
import { useRouter } from "next/router";
import { getEventMerchs, getTicketsList, getTicketsPlayBackList, getUserInfo } from "lib/api";
import { generateToast, generateErrorToast, generateSuccessToast } from "@components/page_components/CheckoutPageComponents/util/toast";
import { useUserState } from "contexts/user-state";
import { useSSOState } from "contexts/sso-state";
import { getHappinStreamRoom, postHappinUserStatus } from "lib/api/livestream";
import { exchangeCrowdcoreToken, getFollowed, getGiftList, postFollow, removeFollowed } from "lib/api/user";
import Script from 'next/script'

declare var TcPlayer: any;

const Playback = () => {
  const router = useRouter();
  const toast = useToast();
  const { showSSO } = useSSOState();
  const { user } = useUserState();
  const player: any = useRef(null);
  const timRef: any = useRef(null);
  const streamRoomIdRef = useRef<string>('');
  const checkViewerInterval: any = useRef(null)
  const isLive = useRef(false);
  const isEnd = useRef(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [chatShow, setChatShow] = useState(false);
  const [eventId, setEventId] = useState<string>('');
  const [eventData, setEventData]: any = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [followBtnDisable, setFollowBtnDisable] = useState(false);
  const [recordingVideoUrl, setRecordingVideoUrl] = useState('');
  const [showMerch, setShowMerch] = useState(false);


  useEffect(() => {
    if (router.query.event_id) {
      setEventId(router.query.event_id as string);
      if (!user) {
        (async () => {
          try {
            await getUserInfo()
          }
          catch (error) {
            generateToast('Please login to proceed', toast);
            showSSO();
          }
        })();
      }
    }
  }, [router.query])

  useEffect(() => {
    if (user) {
      console.log("userData: ", user);
      if (eventId !== null && eventId !== "") {
        (async () => {
          console.log("eventID: ", eventId);
          await getStreamRoomData(eventId as string)
        })();
      }
      else {
        (async () => {
          console.log("eventID: ", router.query.event_id);
          await getStreamRoomData(router.query.event_id as string)
        })();
      }

    }
  }, [user])

  useEffect(() => {
    if (eventData) {
      console.log("EventData: ", eventData);

      (async () => {
        streamRoomIdRef.current = eventData.streamGroupID;
        // Prepare room

        // 验证是否符合入场规则
        const ticketList_res = await getTicketsPlayBackList(eventId);
        console.log("ticketList: ", ticketList_res);
        if (ticketList_res && ticketList_res.data) {
          if (ticketList_res.data.event.owner !== user?.id) {
            if (ticketList_res.data.tickets.length === 0) {
              // this person doesn't have ticket 
              generateToast('Please buy ticket.', toast);
              router.push('/my-events')
              return;
            }
            else if (ticketList_res.data.tickets.status === 3) {
              // ticket is already checked in by others
              generateToast('Ticket is already transfered to other.', toast);
              router.push('/my-events')
              return;
            }
            else if (ticketList_res.data.tickets.status === 1) {
              // ticket haven't check in
              generateToast('Please check in first.', toast);
              router.push('/my-events')
              return;
            }
          }
        }

        // check whether it has recording
        if (eventData.recordings.length === 0) {
          generateToast('No recording for this event, please check agian later.', toast);
          router.push('/my-events')
          return;
        }
        await checkFollowed();
        await checkMerchs();
        setIsLoading(false)
      })();
    }
  }, [eventData])


  const errorHandler = (err = null) => {
    console.log(err);
    generateErrorToast("Something went wrong", toast);
    router.push('/my-events')
  }

  const checkMerchs = async () => {
    const res = await getEventMerchs(eventData.eventID.eid)
    console.log("Merch: ", res)
    if(res && res.length > 0) {
      setShowMerch(true);
    }
  }

  const checkFollowed = async () => {
    try {
      const res = await getFollowed();
      console.log("followed: ", res)
      let found = false;
      let countRound = 1;
      if (res && res.data) {
        while (!found && (res.data.nextToken || countRound === 1)) {
          if (res.data.users) {
            const users = res.data.users;
            for (let i = 0; i < res.data.users.length; i++) {
              if (users[i].profile._id === eventData.eventID.owner) {
                setIsFollowed(true)
                found = true;
                break;
              }
            }
          }
          countRound += 1;
        }
      }
    }
    catch (error) {
      generateErrorToast("Get followed error", toast);
    }
  }

  // const createPlayer = () => {
  //   const playerConfig = {
  //     fileID: currentPlaying.current,
  //     appID: 1301332634,
  //     autoplay: false,
  //     language: 'en-US',
  //     plugins: {
  //       ContinuePlay: { // 开启续播功能
  //         auto: false,
  //       },
  //     },
  //     listener: () => {}
  //   };
  //   console.log(playerConfig)
  //   if (typeof TcPlayer !== 'undefined') {
  //     player.current = new TcPlayer('id_test_video', playerConfig);
  //   } else {
  //     setTimeout(() => {
  //       player.current = new TcPlayer('id_test_video', playerConfig);
  //     }, 2000);
  //   }

  
  // }

  const getStreamRoomData = async (event_id: string) => {
    try {
      const res = await getHappinStreamRoom(event_id);
      if (res.code !== 200) {
        throw new Error('Failed to load stream room');
      }
      else {
        isLive.current = res.data.isLive;
        isEnd.current = res.data.isEnd;
        setEventData(res.data)
        if (res.data.recordings[0]) {
          setRecordingVideoUrl(res.data.recordings[0].videoURL)
        }
      }
    } catch (err) {
      console.log("get stream room error");
      errorHandler(err)
    }
  }
  const handleFollow = async () => {
    setFollowBtnDisable(true)
    if (user?.id === eventData.eventID.owner) {
      generateToast("You can't follow yourself.", toast);
      setFollowBtnDisable(false);
      return;
    }
    if (!isFollowed) {
      // user haven't followed artist
      try {
        const res = await postFollow(eventData.eventID.owner);
        if (res && res.data && res.data.follow) {
          setIsFollowed(true);
        }
      }
      catch (error) {
        generateErrorToast("Failed to follow artists", toast);
        console.log(error)
      }
    }
    else {
      // unfollow artist
      try {
        const res = await removeFollowed(eventData.eventID.owner);
        console.log(res)
        if (res && res.data && !res.data.follow) {
          setIsFollowed(false);
        }
      }
      catch (error) {
        generateErrorToast("Failed to unfollow", toast);
        console.log(error)
      }
    }
    setFollowBtnDisable(false)
  }

  const handleMerchandise = async () => {
    try {
      const res = await exchangeCrowdcoreToken();
      if (res && res.data && res.data.token) {
        const userEmail = user?.email ? `&email=${user.email}` : ''
        const userPhone = user?.phonenumber ? `&phone=${user.phonenumber}` : '';
        const userName = user?.displayname ? `&username=${user.displayname}` : '';
        let url = `https://happin.app/checkout/${eventData.eventID.eid}?merchonly=true&token=${res.data.token}${userEmail}${userPhone}${userName}&fromapp=true`;
        window.open(url);
      }
    }
    catch (error) {
      generateErrorToast("Open Merchandise Error", toast);
    }
  }

  const handleChangeRecording = (item:any) => {
    setRecordingVideoUrl(item.videoURL)
  }

  useEffect(() => {
    if (recordingVideoUrl !=="" && recordingVideoUrl !== null && !isLoading) {
      const video:any = document.getElementById('loop_video');
      video.pause()
      video.load();
    }
    
  },[isLoading, recordingVideoUrl])

  return (
    <div className="playback__container live-stream__container">
      <Script src="/plugin/TcPlayer-2.4.1.js" />
      {isLoading ?
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <Spinner color="#FE4365" size="xl" />
        </div>
        :
        <div className="live-stream__inner xl:rounded-lg xl:mt-2">
          <div className="relative flex-1 min-w-0 md:overflow-x-hidden hide-scrollbar">
            <div className="live-stream__video-bar">
              <div className="flex items-center justify-end px-2 sm:hidden">
                <div
                  className={classnames('text-gray-50 transition text-2xl p-2',
                    { 'text-rose-500': chatShow })}
                  onClick={() => setChatShow(s => !s)}
                >
                  <SvgIcon id="comment" className="text-2xl" />
                </div>
              </div>
              <div className="flex items-center sm:bg-gray-800 px-4 h-16 footer-action">
                <Avatar boxSize={10} src={eventData.eventID.creator.avatar} name="Creater-avator" />
                <div className="flex-1 mx-4">
                  <div className="font-semibold text-gray-50">{eventData?.eventID.creator.name}</div>
                </div>
                {
                  <button
                    disabled={followBtnDisable}
                    className={classnames(isFollowed ? 'livestream__btn-following' : 'livestream__btn-follow')}
                    onClick={handleFollow}
                  >
                    {isFollowed ? <Check theme="outline" size="14" fill="#d9d9d9" strokeWidth={5} /> :
                      <Plus theme="outline" size="14" fill="#fff" strokeWidth={5} />
                    }
                    <span className="ml-1.5">
                      {isFollowed ? 'Following' : 'Follow'}
                    </span>
                  </button>
                }
              </div>
            </div>
            <div className="video-section relative h-screen sm:h-auto sm:aspect-w-16 sm:aspect-h-9">
              <div className="absolute inset-0 bg-black">
              { showMerch &&
                <div onClick={handleMerchandise} className="merchandise-btn absolute right-3 top-3 inline-flex justify-center items-center w-10 h-10 bg-black bg-opacity-30 rounded-full z-10 transition cursor-pointer hover:bg-opacity-40">
                  <svg width="24px" height="24px" viewBox="0 0 24 24">
                    <path fill="#ffc646" stroke="#ffc646" strokeWidth="2" strokeLinejoin="round" strokeMiterlimit="2" d="M3,6.3v14.2
  c0,0.552,0.448,1,1,1h16c0.552,0,1-0.448,1-1V6.3H3z"/>
                    <path fill="none" stroke="#ffc646" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="2" d="
  M21,6.3l-2.833-3.8H5.833L3,6.3l0,0"/>
                    <path fill="none" stroke="#121212" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="2" d="
  M15.778,9.6c0,2.099-1.691,3.8-3.778,3.8s-3.778-1.701-3.778-3.8"/>
                  </svg>
                </div>
              }
                <div className="flex items-center justify-center w-full h-full">
                  <div id="video-tip" className="text-white m-auto " ></div>
                  <div className="video-wrap" id="loop_pre_recorded" >
                    <div>
                      <video width="100%" height="100%" playsInline autoPlay={false} muted={false} 
                        id="loop_video" controlsList="nodownload" controls>
                        <source src={recordingVideoUrl} type="video/mp4" />
                      </video>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="hidden sm:flex sm:h-auto flex-col w-full md:w-80 border-l border-black bg-gray-700">
            <div className="items-center justify-center h-12 text-white border-b border-gray-800 font-semibold hidden md:flex">Playback List</div>
            <div className="live-stream__chat-room">
              <div className="pt-3 pb-1.5">
                {eventData?.recordings?.map((item: any, index: number) => {
                  return (
                    <div className={`recording-item flex p-4 cursor-pointer ${recordingVideoUrl === item.videoURL && 'active'}`} key={index} onClick={() => handleChangeRecording(item)}>
                      <svg width="16px" viewBox="0 0 24 24">
                        <g>
                          <path fill="#fff"
                            d="M3.9,18.9V5.1c0-1.6,1.7-2.6,3-1.8l12,6.9c1.4,0.8,1.4,2.9,0,3.7l-12,6.9C5.6,21.5,3.9,20.5,3.9,18.9z" />
                        </g>
                      </svg>
                      <div className="recording-name text-white ml-5">
                        {item.name}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      }
      <BottomSheet
        className="sm:hidden"
        open={chatShow}
        initialFocusRef={false}
        onDismiss={() => setChatShow(false)}
        snapPoints={({ minHeight }) => minHeight}
        header={
          <div className="h-1 w-full" />
        }
      >
        <div>
          <div className="mt-1 mb-2 px-2">
          {eventData?.recordings?.map((item: any, index: number) => {
                  return (
                    <div className="recording-item flex p-4 cursor-pointer" key={index} onClick={() => handleChangeRecording(item)} >
                      <svg width="16px" viewBox="0 0 24 24">
                        <g>
                          <path fill="#fff"
                            d="M3.9,18.9V5.1c0-1.6,1.7-2.6,3-1.8l12,6.9c1.4,0.8,1.4,2.9,0,3.7l-12,6.9C5.6,21.5,3.9,20.5,3.9,18.9z" />
                        </g>
                      </svg>
                      <div className="recording-name text-white ml-5">
                        {item.name}
                      </div>
                    </div>
                  )
                })}
          </div>
        </div>
      </BottomSheet>


    </div>
  );
};

export default Playback;
