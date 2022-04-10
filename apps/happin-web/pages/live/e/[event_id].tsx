import React, { Fragment, useEffect, useRef, useState } from "react";
import { useUserState } from 'contexts/user-state';
import { useRouter } from "next/router";
import { getHappinStreamRoom, postHappinUserStatus } from "lib/api/livestream";
import { generateToast } from "@components/page_components/CheckoutPageComponents/util/toast";
import { useToast } from "@chakra-ui/react";
import moment from "moment";
import { useSSOState } from "contexts/sso-state";
import TIM from 'tim-js-sdk';
import { getUserInfo } from "lib/api";
import randomColor from 'randomcolor';
import ReactPlayer from 'react-player'

interface LiveStream {
    // user: any;
    params: LiveStream_params;
}

interface LiveStream_params {
    event_id: string,
    customToken: string,
    t: string,
    preview: string,
}
const LiveStream = (props: LiveStream) => {
    const router = useRouter();
    const toast = useToast();
    const { user } :any= useUserState();
    const { dimmed, showSSOSignUp } = useSSOState();

    const { params} = props;
    const { event_id, customToken, t, preview } = params;
    const [ eventData, setEventData ] = useState<any>(null);
    const [isTabActive, setIsTabActive ] = useState(true);
    const [ adminChecking, setAdminChecking ] = useState(false)
    const [ loading, setLoading ] = useState(true);
    const [ innerWidth, setInnerWidth ] = useState(0);
    const [ previewBackground, setPreviewBackground ] = useState(false);
    const [ previewPlayBack, setPreviewPlayBack ] = useState(false);
    const [ isPlayBack, setIsPlayBack ] = useState(false);
    const [ streamRoomID, setStreamRoomID ] = useState('');
    const [ streamRoomGroupID, setStreamRoomGroupID ] = useState('')
    const [ playbackList, setPlaybackList ] =  useState([]);
    const [ playURL1000, setPlayURL1000 ] = useState('');
    const [ playURL2000, setPlayURL2000 ] = useState('');
    const [ playURL6000, setPlayURL6000 ] = useState('');
    const [ emptyPlayAddress, setEmptyPlayAddress ] = useState(false);
    const [ chatCur, setCharCur ] = useState(0);
    const [ showCN, setShowCN ] = useState(true)
    const [ giftArray, setGiftArray ] = useState([])
    const [ showGift, setShowGift ] = useState(true);
    const [ showChatroom, setShowChatroom] = useState(false);
    const chatRoomMessageList:any = useRef([]);
    const [ blockedList, setBlockedList ] = useState([]);
    const [ scroll, setScroll ] = useState(true)
    const [ giftList, setGiftList ]: any = useState([])
    const [ messageToBeSent, setMessageToBeSent ] = useState('')
    const [ hasSelfCheckedinTicket, setHasSelfCheckedinTicket ] = useState(false)
    const [ streamTip, setStreamTip ] = useState('');
    const [ streamStart, setStreamStart ] = useState(false);
    const  [ streamEnd, setStreamEnd ] = useState(false);
     // const [ user, setUser ]: any = useState(null)

    //tim
    const [ timSDKReady, setTimSDKReady ] = useState(false);
    const [ tim, setTIM ]:any = useState(null);


    const stream_customizeSetting = eventData?.customizeSetting ? eventData.customizeSetting : {};
    const stream_eventID = eventData?.eventID ? eventData.eventID : {};

    // get user session
    useEffect( () => {

        console.log("initial")
        // #TODO isPlateformBrowser ? 为什么要检查这个？
        window.onblur = () => { setIsTabActive(false) };
        window.onfocus = () => { setIsTabActive(true) };
        if (!event_id || event_id === "") {
            router.push('/my-events');
        }
        if (t) {
            setAdminChecking(true);
        }
        if (preview) {
            setPreviewBackground(true);
        }
        setInnerWidth(window.innerWidth);

        getUserInfo().catch (() => {
            generateToast('Please login to proceed',toast);
            // router.push('/');
            showSSOSignUp('Fan')
        })


    },[])

    // TIM setup
    useEffect ( () => {
        console.log(user)
        if (user) {
            getStreamRoomData(event_id as string).then(async (res:any) => {

                // if (user.email || this.previewPlayBack || this.adminChecking) {
                //     setHasSelfCheckedinTicket(true);
                //     // if (isPlayBack) {
                //     // this.currentTicket = {};
                //     // this.currentTicket.playbackStatus = 'not_expired';
                //     // this.currentTicket.playbackExpireTime = 'infinite';
                //     // }
                // } else {
                //     // tslint:disable-next-line: max-line-length
                //     const ticketRes = this.isPlayBack ? await this.http.getHappinPlaybackEventTicket(this.eventId).toPromise() : await this.http.getHappinEventTicket(this.eventId).toPromise();
                //     this.ticketList = ticketRes.data.tickets.filter(ticket => ticket.status !== 3)
                //     // 没有票 强制去买票页面
                //     if (this.ticketList.length === 0) {
                //     this.sendNotification(`${this.isPlayBack ? 'Playback' : 'Livestream'} ticket is required in order to access the content.`);
                //     setTimeout(() => {window.location.href=`https://happin.app/post/${this.eventData.eventID.eid}`}, 1000)
                //     return;
                //     }
                //     this.checkTickets();
                // }

            })
        }
    }, [user])

    useEffect (() => {
        if (eventData) {
            console.log(eventData)
            let options = {
                SDKAppID: process.env.NEXT_PUBLIC_IM_SDKAPPID ? parseInt(process.env.NEXT_PUBLIC_IM_SDKAPPID) : 0,
            };
            let tim = TIM.create(options);

            // only showing error log
            tim.setLogLevel(3)
            tim.on(TIM.EVENT.SDK_READY, onTimSDKReady);
            tim.on(TIM.EVENT.SDK_NOT_READY, onTimSDKNotReady);
            tim.on(TIM.EVENT.KICKED_OUT, onTimSDKKicked);
            tim.on(TIM.EVENT.MESSAGE_RECEIVED, _handleAllIncomeMessage);

            loginToTIM(eventData.streamGroupID,tim);

            setTIM(tim);
            setShowChatroom(true);
            console.log(eventData)

            postHappinUserStatus({ streamRoomID: eventData.streamGroupID, watchMode: 'watch'}).then(async () => {
                console.log(eventData)
                await createPlayer(eventData);
            })
        }
    }, [eventData])

    const createPlayer = async (eventData: any) => {
        console.log(eventData)
        // if user offline
        if (!window.navigator.onLine) {
            setStreamTip("You seem to be offline, please check you network status.")
            return;
        }
        if (!eventData.isLive) {
            console.log(eventData)
            const oneHourBefore = moment(eventData.eventID.start_datetime).subtract(1, 'hour')
            if (moment(new Date()).isBetween(oneHourBefore, moment(eventData.eventID?.start_datetime))) {
                // 在活动开始时间前 进入直播间
                const deadline = new Date(eventData.eventID.start_datetime);
                initializeClock(deadline);
                (document.querySelector('#loop_video') as HTMLVideoElement).play();
                const videoWrap:any = document.querySelector('#loop_pre_recorded');
                videoWrap.setAttribute('style', 'display: block');
            } else if(streamEnd || eventData.isEnd){
                console.log("end stream")
                // 在活动正式开始之后结束推流， 当作活动结束
                setStreamTip('Livestream has ended. Replay will be available within 30 minutes')
            }
            else if (!eventData.isEnd) {
                setStreamTip('The livestream will start in any minute, be ready!')
            }

        }
        else if(eventData.isEnd){
            setStreamTip('Livestream has ended. Replay will be available within 30 minutes')

        }

        console.log(eventData.isLive)

    }
    const loginToTIM = async (streamRoomID:string, tim:any) =>  {
        console.log(streamRoomID)
        console.log("login",user)
        try {
            const login_res = await tim.login({ userID: user._id, userSig: user.usersig });
            if (login_res.data.actionStatus === 'OK') {
                await tim.joinGroup({ groupID: streamRoomID });
                console.log(tim)
                // console.log(streamRoomID)

                // tim.setMessageRead({conversationID: 'GROUP'+streamRoomID}).then((res:any) => {
                //     console.log(res)
                // })
                // // get All history message


            }
            else {
                console.log('Failed login to tim.');
            }
        } catch (err) {
            console.log(err)
        }
    }

    // tim section
    const onTimSDKReady = async (event:any) => {
        // 多等两秒， im 有时回调快了
        console.log("onTimSDKReady: ", event);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setTimSDKReady(true)
    }

    const onTimSDKNotReady = async (event:any) => {
        console.log("onTimSDKNotReady", event)
        setTimSDKReady(false);
    }

    const onTimSDKKicked = async (event:any) => {
        console.log("onTimSDKKicked", event)
        if (event.data.type === 'multipleAccount') {
            setTimSDKReady(false);
            // should be redirect to login;
            generateToast('You just logged in to this site on other device. Redirecting to home', toast);
            setTimeout(() => {
                router.push('/my-events')
            }, 2000);
        }
    }

    const _handleTextMsg = (message:any) => {
        const userInList:any = chatRoomMessageList.current.find((item:any) => item.nick === message.nick);
            const newMessage = {
                id: message.ID,
                avatar: message.avatar,
                nick: message.nick || 'Unknown User', type: 'message',
                text: message.payload.text, color: userInList ? userInList.color : randomColor({ luminosity: 'light' })
            }
            console.log([...chatRoomMessageList.current,newMessage])
            // tim.getMessageList({conversationID: message.conversationID, count: 15}).then((imResponse:any) => {
            //     const messageList = imResponse.data.messageList; // 消息列表。
            //     const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
            //     const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
            //     console.log(imResponse)
            //     console.log(messageList)
            //     console.log(nextReqMessageID)
            //     console.log(isCompleted)
            // })

            // remove messages if list gets over 200 item
            if (chatRoomMessageList.current.length + 1 > 200) {
                chatRoomMessageList.current = [...chatRoomMessageList.current,newMessage].slice(chatRoomMessageList.current.length - 200);
            }
            else {
                chatRoomMessageList.current = [...chatRoomMessageList.current,newMessage]
            }
    }

    const _handleCustomMsg = (message:any) => {
        console.log("CUSTOMMESSAGE ", message);
        if (message.to !== eventData.streamGroupID) {
            console.log("not same id")
            return;
        }
        const data = message.payload.data;
        const dataObj = JSON.parse(data);
        console.log(dataObj.type)
        if (dataObj.type === 'livestream') {
            // switch (dataObj.action) {
            //     // case 'like':
            //     // // 收到了点赞
            //     // this.playLike();
            //     // break
            //     // case 'send_gift':
            //     // // 收到了礼物
            //     // message.payload.data = dataObj;
            //     // this._handleGift(message)
            //     // break
            //     default:
            //     break
            // }
        } else if (dataObj.type === 'stream/trivia-question/start') {

        } else if (dataObj.type === 'stream/start') {
            console.log("streamStart")
            setStreamStart(true);
        } else if (dataObj.type === 'stream/end') {
            setStreamEnd(true);
            setStreamStart(false);
            console.log('stream end')
            // 在活动正式开始之后结束推流， 当作活动结束
            setStreamTip('Livestream has ended. Replay will be available within 30 minutes');
            // const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);

            // if (isSafari) {
            //   // safari 断流情况  播放器并不会 报错。。。
            //   const player = document.querySelector('.vcp-player');
            //   const tip = this.renderer.createElement('div');
            //   tip.className = 'tip-container'
            //   const oneHourBefore = moment(this.eventData.eventID.start_datetime).subtract(1, 'hour')
            //   // 如果是一小时前开始推流， 但在活动正式开始前直播中断了 那么应该继续显示倒数， 否则就是直播结束
            //   if (moment(new Date()).isBetween(oneHourBefore, moment(this.eventData.eventID.start_datetime))) {
            //     const deadline = new Date(this.eventData.eventID.start_datetime);
            //     this.initializeClock(deadline);
            //     // im 发送了结束， 但是流还有缓存，
            //     this.player.pause();
            //     (document.querySelector('#loop_video') as HTMLVideoElement).play();
            //     const videoWrap = this._document.querySelector('#loop_pre_recorded');
            //     videoWrap.setAttribute('style', 'display: block');
            //     this.streamEnded = false;
            //   } else {
            //     // 在活动正式开始之后结束推流， 当作活动结束
            //     this.player.pause();
            //     tip.innerHTML = '<h4 class="player-error">Livestream has ended. Replay will be available within 30 minutes</h4>'
            //     this.renderer.appendChild(player, tip);
            //   }
        }


    }
    const _handleAllIncomeMessage = (event:any) => {
        console.log("_handleAllIncomeMessage", event)
        // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
        // event.name - TIM.EVENT.MESSAGE_RECEIVED
        // event.data - 存储 Message 对象的数组 - [Message]
        const length = event.data.length
        let message;
        for (let i = 0; i < length; i++) {
          // Message 实例的详细数据结构请参考 Message
          // 其中 type 和 payload 属性需要重点关注
          // 从v2.6.0起，AVChatRoom 内的群聊消息，进群退群等群提示消息，增加了 nick（昵称） 和 avatar（头像URL） 属性，便于接入侧做体验更好的展示
          // 前提您需要先调用 updateMyProfile 设置自己的 nick（昵称） 和 avatar（头像URL），请参考 updateMyProfile 接口的说明
          message = event.data[i]
          console.log(message)
          switch (message.type) {
            case TIM.TYPES.MSG_TEXT:
              // 收到了文本消息
              _handleTextMsg(message);
              break
            case TIM.TYPES.MSG_CUSTOM:
              // 收到了自定义消息
              _handleCustomMsg(message);
              break
            /* case TIM.TYPES.MSG_GRP_TIP:
              // 收到了群提示消息，如成员进群、群成员退群
              this._handleGroupTip(message)
              break
            case TIM.TYPES.MSG_GRP_SYS_NOTICE:
              // 收到了群系统通知，通过 REST API 在群组中发送的系统通知请参考 在群组中发送系统通知 API
              this._handleGroupSystemNotice(message)
              break */
            default:
              break
          }
        }
    }

    const createTextMsg = async () => {
        return await tim.createTextMessage(
          {
            to: streamRoomID,
            conversationType: TIM.TYPES.CONV_GROUP,
            // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考 消息优先级与频率控制
            // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
            priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
            payload: {
              text: messageToBeSent,
            }
          }
        );
      }



    // const _handleTextMsg = (message:any) => {
    //     this.textMsgEvent.next(message)
    // }

    const initializeClock = (endtime:any)  => {
        const clock = document.getElementById('clockdiv');
        const minutesSpan = clock?.querySelector('.minutes');
        const secondsSpan = clock?.querySelector('.seconds');
        function updateClock() {
          const t = getTimeRemaining(endtime);

          if (minutesSpan && secondsSpan) {
            minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
            secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

            if (t.total <= 0) {
                const countEnd = document.getElementById('count_ended');
                countEnd?.setAttribute('style', 'display: inline-block');
                clearInterval(timeinterval);
            }
          }
        }

        updateClock();
        const timeinterval = setInterval(updateClock, 1000);
    }

    const getTimeRemaining = (endtime:any) => {
        const total = Date.parse(endtime.toString()) - Date.parse(new Date().toString());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);

        return {
          total,
          minutes,
          seconds
        };
    }


    const getStreamRoomData = async (event_id: string) => {
        try {
            const res = await getHappinStreamRoom(event_id);
            if (res.code !== 200) {
                throw new Error('Failed to load stream room');
            }
            else {
                console.log('streamRoom', res.data);

                const eventData = res.data;
                const streamRoomID = res.data.streamGroupID;
                const streamRoomGroupID = res.data._id;
                //if event is ended, and has odpstart, then it should be a playback event
                //tslint:disable-next-line: max-line-length
                if (eventData.eventID.ODPBEnd && eventData.eventID.ODPBStart || previewPlayBack) {
                    setIsPlayBack(true);
                    if (res.data.recordings) {
                        if (res.data.recordings.length > 0) {
                            setPlaybackList(res.data.recordings.filter( (x:any) => x.public))
                        }
                    }
                    await setEventData(res.data);
                    await setStreamRoomID(res.data.streamGroupID);
                    await setStreamRoomGroupID(res.data._id);
                    await setStreamStart(res.data.isLive);
                    await setPlayURL1000(res.data.playURL_1000);
                    await setPlayURL2000(res.data.playURL_2000);
                    await setPlayURL6000(res.data.playURL_6000);
                    return res.data;
                }

                await setPlayURL1000(res.data.playURL_1000);
                await setPlayURL2000(res.data.playURL_2000);
                await setPlayURL6000(res.data.playURL_6000);
                await setStreamStart(res.data.isLive);

                const oneHourBefore = moment(eventData.eventID.start_datetime).subtract(1, 'hour')

                //活动结束时间后和isLive是false ，不能进 (重播的话在上面已经验证过)  -- 发生在活动结束后还没上架录播的这段时间
                // 但是这会导致在这段时间内用户不能通过这个页面进入 fan meeting 只能通过my ticket 进入
                if (moment(new Date()).isAfter(eventData.eventID.end_datetime) && !eventData.isLive && !emptyPlayAddress) {
                    generateToast('The livestream has ended. Replay will be available soon', toast);
                    setTimeout(() => { router.push('/my-events') }, 1000)
                    return;
                }

                // 如果在一小时内进入的话 创建一个video layer, 播放循环片头
                if (moment(new Date()).isBetween(oneHourBefore, moment(eventData.eventID.start_datetime))) {
                    const deadline = new Date(eventData.eventID.start_datetime);
                    initializeClock(deadline);
                    const videoWrap = document.querySelector('#loop_pre_recorded');
                    videoWrap?.setAttribute('style', 'display: block');
                }
                await setEventData(res.data);
                await setStreamRoomID(res.data.streamGroupID);
                await setStreamRoomGroupID(res.data._id);
                return res.data
            }
        } catch (err) {
            console.log(err);
            generateToast('Something went wrong.',toast)
            setTimeout(() => {
                router.push('/')
            }, 2000);
        }
    }

    const handleInputChange = (event: any) => {
        setMessageToBeSent(event.target.value)

    }

    const sendText = async () => {
        if (messageToBeSent.trim() === '') {
            return;
        }
        // if (this.adminChecking) {
        //     return
        // }
        // if (!this.hasSelfCheckedinTicket) {
        // this.sendNotification('Please buy ticket')
        // return;
        // }

        if (user.displayname === '' || (user.displayname.includes('Happin user') && user.displayname.length === 17) || !user.photourl) {
            // this.completeProfileModal.open();
            return;
        }
        const message = await createTextMsg();
        console.log(message);
        try {
            await tim.sendMessage(message);
            const userInList:any = chatRoomMessageList.current.find((item:any) => item.nick === message.nick);
            console.log(userInList)
            const newMessage = {
                id: user.uid,
                avatar: user.photourl,
                nick: user.displayname || 'Unknown User', type: 'message',
                text: message.payload.text, color: userInList ? userInList.color : randomColor({ luminosity: 'light' })
            }
            console.log([...chatRoomMessageList.current,newMessage])

            // remove messages if list gets over 200 item
            if (chatRoomMessageList.current.length + 1 > 200) {
                chatRoomMessageList.current = [...chatRoomMessageList.current,newMessage].slice(chatRoomMessageList.current.length - 200);
            }
            else {
                chatRoomMessageList.current = [...chatRoomMessageList.current,newMessage];
            }

            setMessageToBeSent('');

        } catch (err:any) {
            if (err.message.includes('禁言')) {
                generateToast('Your acconunt is banned',toast);
            }
            console.log('Failed to sent message');
        } finally {
            // const textArea = document.querySelector('.auto-expand');
            // textArea?.rows = 1;
        }
    }



    const chatTabList = ['Chat', 'Fan Board']

    return (
        <div className="liveStream-container">
            <div className="live-big-title">
                <h1>{stream_customizeSetting.title ? stream_customizeSetting.title : ' '}</h1>
                <h2>{stream_customizeSetting.subtitle ? stream_customizeSetting.subtitle : ' '}</h2>
            </div>
            {eventData &&
                <div className={`live-main ${showChatroom && 'show-chatroom'}`} >
                    <div className="stream-body">
                        <div className="live-screen-head">
                            <div className="live-organizer">
                                <img className="lo-avatar" src={stream_eventID.cover} alt="" />
                                <div className="lo-detail">
                                    <div className="lo-title" data-title={stream_eventID}>{stream_eventID.title}</div>
                                    <div className="lo-bottom-details">
                                        <div className="lo-feature">
                                            {stream_eventID.tags?.map((tag: string, index: number) => {
                                                return <span key={`tag-${index}`}>{`${tag}${index === stream_eventID.tags.length - 1 ? '' : ', '}`}</span>
                                            })}
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="stream-live">
                            <div className="aspect-placeholder"></div>
                            <div className="live-video">

                                <div className="video-wrap" id="loop_pre_recorded">
                                    <div id="clockdiv">
                                        <div>
                                            <span className="minutes"></span>
                                            <div className="smalltext">Minutes</div>
                                        </div>
                                        <div>
                                            <span className="seconds"></span>
                                            <div className="smalltext">Seconds</div>
                                        </div>
                                    </div>
                                    <div id="count_ended">
                                        <span>Livestream will start in any minute, be ready!</span>
                                    </div>
                                    <video width="100%" height="100%" autoPlay playsInline muted loop onCanPlay={(e) => (e.target as HTMLVideoElement).play()}
                                        id="loop_video" onLoadedMetadata={(e) => (e.target as HTMLVideoElement).muted = true}  controls>
                                        <source src={'/images/SCENE_07.mp4'} type="video/mp4" />
                                    </video>
                                </div>

                                <div id="id_test_video" className="video-wrap">
                                {/* 这个是放视频的div */}
                                    <div className="tip-container">
                                        <h4 className="player-error">{streamTip}</h4>
                                    </div>
                                    {/* <video width="100%" height="100%" preload="true" autoPlay playsInline controls>
                                        <source src={playURL1000} type="application/x-mpegURL" />
                                    </video> */}
                                    {/* { isPlayBack &&
                                        <video id="playback_video" preload="auto" playsInline width="1280" height="720"></video>
                                    } */}
                                    {streamStart && playURL1000!=='' &&
                                        <ReactPlayer width="100%" height="100%" url={playURL1000} controls />
                                    }
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="stream-chat">
                        <div className="chat-container">
                            <div className="chat-head">
                                <div className="chat-tab">
                                    {chatTabList.map((tab:any, index:number) => {
                                        return <div className="chat-tab-item" key={`tab-${index}`}>
                                                    {isPlayBack && tab === 'Chat' ? 'Play List' : tab}
                                                </div>
                                    })}
                                </div>
                            </div>
                            <div className="chat-body">
                                { chatCur === 0 &&
                                    <div className="chat-tab-content" >

                                    { !isPlayBack &&
                                        <div className="chat-body-list" id="chat-list">
                                            <div className="chat-welcome">
                                                <span>Welcome To The Chatroom!</span>
                                            </div>

                                            { chatRoomMessageList.current.map((message:any, index: number) => {
                                                if(message.type === 'message') {
                                                    return (
                                                        <div className="chat-msg" key={index}>
                                                            <span className="chat-username" >
                                                                <span style={{color: message.color}}>{message.nick}</span>
                                                                {/* <div>
                                                                    <div style={{display: "flex", margin: '5px'}}>
                                                                        <div className="userCard_Avatar">
                                                                            <img src={message.avatar || '../../../../assets/images/avatar_default.svg'} alt=""/>
                                                                        </div>
                                                                        <div className="userCard_detail">
                                                                            <p className="userName">{message.nick}</p>
                                                                            <p>{message.id}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="userCard_actions">
                                                                        {!blockedList.includes(message.id as never) &&
                                                                            <button  className="btn btn-cyan btn-xs" disabled={user?.uid === message.id}>Block</button>
                                                                        }
                                                                        {blockedList.includes(message.id as never) &&
                                                                            <button  className="btn btn-cyan btn-xs" disabled={user?.uid === message.id}>Unblock</button>
                                                                        }
                                                                        <button  className="btn btn-cyan btn-xs" disabled={user?.uid === message.id}>Report</button>
                                                                    </div>
                                                                </div> */}
                                                            </span>
                                                            <span>:</span>
                                                            <span className="chat-text">{message.text}</span>
                                                        </div>
                                                    )
                                                }
                                            })}

                                            <div className="chat-foot">
                                            <div className="resume-scroll">
                                                {scroll === false &&
                                                    <button className="btn btn-resume">Resume auto scrolling</button>
                                                }
                                            </div>
                                            {/* <form> */}
                                                <div className="chat-field">
                                                    <textarea style={{fontSize: '1.2em'}} className="auto-expand" name="message" rows={1}
                                                        id="message-input"  maxLength={500} placeholder="Say something..." value={messageToBeSent} onChange={() => handleInputChange(event)}></textarea>
                                                    <div className="emoji" id="emoji-picker">
                                                        <svg viewBox="0 0 24 24" width="22" height="22">
                                                            <path fill="currentColor"
                                                                d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-4-7h8a4 4 0 1 1-8 0zm0-2a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm8 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="chat-send">
                                                    { !user?._id &&
                                                        <button className="btn btn-primary btn-sm" disabled>Send</button>
                                                    }
                                                    { user?._id &&
                                                        <button className="btn btn-primary btn-sm" disabled={!timSDKReady}
                                                        onClick={() => sendText()} >{timSDKReady ? 'Send' : 'Joining chat room...'}</button>
                                                    }
                                                </div>
                                            {/* </form> */}
                                            </div>
                                        </div>
                                    }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }

        </div>
    );
};

export default LiveStream;

export async function getServerSideProps(context: { params: { event_id: string, customToken: string, preview: string, t: string } }) {


    return {
        props: {
            "params": context.params,
        }
    }
}

