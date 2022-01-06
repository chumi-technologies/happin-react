import React, { useState, useRef, useEffect, useCallback } from "react";
import { Avatar, Spinner, useToast } from '@chakra-ui/react';
import SvgIcon from '@components/SvgIcon';
import { Check, CosmeticBrush, Left, Plus, Right } from '@icon-park/react';
import Slider from 'react-slick';
import classnames from 'classnames';
import { Picker } from 'emoji-mart';
import Sender from "@components/page_components/LiveStreamComponents/Sender";
import LiveList from '@components/page_components/LiveStreamComponents/LiveList';
import ChatItem from '@components/page_components/LiveStreamComponents/ChatItem';
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css'
import { useRouter } from "next/router";
import { getUserInfo } from "lib/api";
import { generateToast, generateErrorToast, generateSuccessToast } from "@components/page_components/CheckoutPageComponents/util/toast";
import { useUserState } from "contexts/user-state";
import { useSSOState } from "contexts/sso-state";
import { getHappinStreamRoom, postHappinUserStatus } from "lib/api/livestream";
import randomColor from 'randomcolor';
import TIM from 'tim-js-sdk';
import moment from "moment";
import { exchangeCrowdcoreToken, getFollowed, getGiftList, postFollow, removeFollowed } from "lib/api/user";
import Script from 'next/script'
// import  TcPlayer from '../../public/plugin/TcPlayer-2.4.1'

declare var TcPlayer: any;

function Arrow(props: any) {
  const { className, onClick, children } = props;
  return (
    <div
      className={classnames(className, 'livestream__slick-control')}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
// const giftList = [
//   {
//     id: 0,
//     name: 'Cheers',
//     img: '/images/gift-01.png',
//     cost: 50,
//     costType: 'coins'
//   },
//   {
//     id: 1,
//     name: 'Hands Up',
//     img: '/images/gift-02.png',
//     cost: 50,
//     costType: 'coins'
//   },
//   {
//     id: 2,
//     name: 'Kiss',
//     img: '/images/gift-03.png',
//     cost: 50,
//     costType: 'coins'
//   },
//   {
//     id: 3,
//     name: 'Rocket',
//     img: '/images/gift-04.png',
//     cost: 50,
//     costType: 'coins'
//   },
//   {
//     id: 4,
//     name: 'BoomShaking',
//     img: '/images/gift-05.png',
//     cost: 50,
//     costType: 'coins'
//   },
//   {
//     id: 5,
//     name: 'Birthday Cake',
//     img: '/images/gift-06.png',
//     cost: 1,
//     costType: 'diamond'
//   },
//   {
//     id: 6,
//     name: 'Bear',
//     img: '/images/gift-07.png',
//     cost: 2,
//     costType: 'diamond'
//   },
//   {
//     id: 7,
//     name: 'Bear',
//     img: '/images/gift-08.png',
//     cost: 2,
//     costType: 'diamond'
//   },
//   {
//     id: 8,
//     name: 'Bear',
//     img: '/images/gift-09.png',
//     cost: 2,
//     costType: 'diamond'
//   },
//   {
//     id: 9,
//     name: 'Bear',
//     img: '/images/gift-10.png',
//     cost: 2,
//     costType: 'diamond'
//   },
//   {
//     id: 10,
//     name: 'Bear',
//     img: '/images/gift-11.png',
//     cost: 2,
//     costType: 'diamond'
//   },
//   {
//     id: 11,
//     name: 'Bear',
//     img: '/images/gift-12.png',
//     cost: 2,
//     costType: 'diamond'
//   },
//   {
//     id: 12,
//     name: 'Bear',
//     img: '/images/gift-13.png',
//     cost: 2,
//     costType: 'diamond'
//   },
// ];
const liveList = [
  {
    _id: '01',
    link: '/',
    title: 'Merry Christmas guys!',
    cover: 'https://p6.toutiaoimg.com/origin/tos-cn-i-qvj2lq49k0/54043582bdb04811ae3e4877ab079157?from=pc',
    avatar: 'https://p6.toutiaoimg.com/origin/tos-cn-i-qvj2lq49k0/54043582bdb04811ae3e4877ab079157?from=pc',
    username: 'JeesieJe123'
  },
  {
    _id: '02',
    link: '/',
    title: 'exposing my family drama ⛄',
    cover: 'https://p16-webcast.tiktokcdn.com/webcast-va/6995434510779288326~tplv-resize:400:400.webp',
    avatar: 'https://p19-sign.tiktokcdn-us.com/tos-useast5-avt-0068-tx/2716efc7e6cb8fa3b28ea4660009aaaa~c5_100x100.webp?x-expires=1640588400&x-signature=KgeyUInhRAcg2BxeLwAjMi2u6oI%3D',
    username: 'Shahad'
  },
  {
    _id: '03',
    link: '/',
    title: 'Merry Christmas guys!',
    cover: 'https://p6.toutiaoimg.com/origin/tos-cn-i-qvj2lq49k0/54043582bdb04811ae3e4877ab079157?from=pc',
    avatar: 'https://p6.toutiaoimg.com/origin/tos-cn-i-qvj2lq49k0/54043582bdb04811ae3e4877ab079157?from=pc',
    username: 'JeesieJe123'
  },
  {
    _id: '04',
    link: '/',
    title: 'exposing my family drama ⛄',
    cover: 'https://p16-webcast.tiktokcdn.com/webcast-va/6995434510779288326~tplv-resize:400:400.webp',
    avatar: 'https://p19-sign.tiktokcdn-us.com/tos-useast5-avt-0068-tx/2716efc7e6cb8fa3b28ea4660009aaaa~c5_100x100.webp?x-expires=1640588400&x-signature=KgeyUInhRAcg2BxeLwAjMi2u6oI%3D',
    username: 'Shahad'
  },
  {
    _id: '05',
    link: '/',
    title: 'exposing my family drama ⛄',
    cover: 'https://p16-webcast.tiktokcdn.com/webcast-va/6995434510779288326~tplv-resize:400:400.webp',
    avatar: 'https://p19-sign.tiktokcdn-us.com/tos-useast5-avt-0068-tx/2716efc7e6cb8fa3b28ea4660009aaaa~c5_100x100.webp?x-expires=1640588400&x-signature=KgeyUInhRAcg2BxeLwAjMi2u6oI%3D',
    username: 'Shahad'
  },
];
interface ISenderRef {
  onSelectEmoji: (event: any) => void;
  focus: () => void;
}
const Livestream = () => {
  const router = useRouter();
  const toast = useToast();
  const { showSSO } = useSSOState();
  const { user } = useUserState();
  const senderRef = useRef<ISenderRef>(null!);
  const player = useRef(null);
  const timeinterval: any = useRef(null);
  const timRef: any = useRef(null);
  const streamRoomIdRef = useRef<string>('');
  const chatRoomMessageList: any = useRef([]);
  const streamStart = useRef<boolean>(false);
  const streamEnd = useRef<boolean>(false);
  const viewerCount = useRef(0);
  const timSDKReady = useRef(false);
  const checkViewerInterval:any = useRef(null)
  const [emojiShow, setEmojiShow] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [chatShow, setChatShow] = useState(false);
  const [eventId, setEventId] = useState("");
  const [startLoopVideo, setStartLoopVideo] = useState(false);
  const [eventData, setEventData]: any = useState(null);
  const [streamStatusText, setStreamStatusText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [followBtnDisable, setFollowBtnDisable] = useState(false);
  const [gifts, setGifts] = useState([]);
  const [chatReady, setChatReady] = useState(false);
  const [triggerRerender, setTriggerRerender] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 7,
    draggable: false,
    responsive: [
      {
        breakpoint: 1140,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          arrows: false
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          arrows: false
        }
      }
    ],
    nextArrow: <Arrow><Right theme="outline" size="16" fill="currentColor" /></Arrow>,
    prevArrow: <Arrow><Left theme="outline" size="16" fill="currentColor" /></Arrow>,
  };

  // TODO: 添加TCPlayer
  useEffect(() => {

      // const script = document.createElement("script");
      // console.log(document.body)
      // script.type = "text/javascript";
      // script.src = "/plugin/TcPlayer-2.4.1.js";
      // document.body.appendChild(script);
      // const player =  TcPlayer('id_test_video', {
      //   "m3u8": "http://ivi.bupt.edu.cn/hls/cctv5phd.m3u8", // 要播放的直播流的地址（该地址可用）
      //   "autoplay" : true, // 是否自动播放
      //   "width" :  "960",
      //   "height" : "640",
      //   "live": true,  // 区别直播和点播
      // })
  },[])

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
      (async () => {
        console.log("eventID: ", eventId);
        await getStreamRoomData(eventId as string)
      })();
    }
  }, [user])

  useEffect(() => {
    if (eventData) {
      console.log("EventData: ", eventData);

      (async () => {
        streamRoomIdRef.current = eventData.streamGroupID;
        // Prepare room
        checkEnterPermission();
        await checkFollowed();
        await getGifts();
        await connectTIM();


        window.addEventListener("beforeunload", async () => {
          console.log("disconnect TIM")
          await disconnectTIM();
        })
        setIsLoading(false)
      })();


    }


  }, [eventData])

  useEffect(() => {
    if (startLoopVideo) {
      const deadline = new Date(eventData.eventID.start_datetime);
      initializeClock(deadline);
    }
  }, [startLoopVideo])

  const disconnectTIM = async () => {
    try {
      const res = await timRef.current.quitGroup(streamRoomIdRef.current);
      console.log("quit: ", res);
      const res_destory = await timRef.current.destroy();
      console.log("destory: ", res_destory);

    }
    catch (error) {
      console.log("disconnect error", error)
    }
  }
  const connectTIM = async () => {
    try {
      let options = {
        SDKAppID: process.env.NEXT_PUBLIC_IM_SDKAPPID
      };
      let tim = TIM.create(options);

      // only showing error log
      tim.setLogLevel(3)
      tim.on(TIM.EVENT.SDK_READY, onTimSDKReady);
      tim.on(TIM.EVENT.SDK_NOT_READY, onTimSDKNotReady);
      tim.on(TIM.EVENT.KICKED_OUT, onTimSDKKicked);
      tim.on(TIM.EVENT.MESSAGE_RECEIVED, _handleAllIncomeMessage);


      await loginToTIM(eventData.streamGroupID, tim);
      timRef.current = tim;
      postHappinUserStatus({ streamRoomID: eventData.streamGroupID, watchMode: 'watch' }).then(async (res: any) => {
        console.log("post User status: ", res)
        // TODO: 建立TIM播放器
        // TODO: 检查如果离开直播间 人数会不会变
        // await createPlayer(eventData);
        setChatReady(true);
      })

    }
    catch (error) {
      console.log("fail to connect tim")
      errorHandler(error);
    }

  }

  useEffect(() => {
    // TODO: 这个不能用
    if (streamEnd.current) {
      // TODO: 先停止播放器，然后关闭播放器
      const oneHourBefore = moment(eventData.eventID.start_datetime).subtract(1, 'hour')
      // 如果在直播开始前，直播推流结束，继续轮播
      if (moment(new Date()).isBetween(oneHourBefore, moment(eventData.eventID.start_datetime))) {
        setStartLoopVideo(true);
      }
      // 如果在直播开始后，直播推流结束，显示直播结束
      else if (moment(new Date()) >= eventData.eventID.start_datetime) {
        setStreamStatusText('Livestream has ended. Replay will be available within 30 minutes');
      }
    }
  }, [streamEnd.current])

  useEffect(() => {
    // TODO: 这个不能用
    if (streamStart.current) {
      const oneHourBefore = moment(eventData.eventID.start_datetime).subtract(1, 'hour')
      // 如果在直播开始前，直播推流开始，停止轮播
      if (moment(new Date()).isBetween(oneHourBefore, moment(eventData.eventID.start_datetime))) {
        setStartLoopVideo(false);
        clearInterval(timeinterval.current);
      }

      // TODO: 不管在什么情况下，都显示直播画面

    }
  }, [streamStart.current])

  useEffect(() => {
    // disconnect when navigate to other page
    return (() => {
      (async () => {
        if (streamRoomIdRef.current !== '' && timRef.current) {
          clearInterval(checkViewerInterval.current)
          await disconnectTIM();
        }
      })();

    })

  }, [])

  // TIM handler

  const onTimSDKReady = async (event: any) => {
    // 多等两秒， im 有时回调快了
    console.log("onTimSDKReady: ", event);
    await new Promise(resolve => setTimeout(resolve, 2000));
    timSDKReady.current = true;
    setTriggerRerender(t => !t)
  }

  const onTimSDKNotReady = async (event: any) => {
    console.log("onTimSDKNotReady", event)
    timSDKReady.current = false;
    setTriggerRerender(t => !t)
  }

  const onTimSDKKicked = async (event: any) => {
    // TODO: 测试 => 有问题 需要prod测试
    console.log("onTimSDKKicked", event)
    if (event.data.type === 'multipleAccount') {
      // should be redirect to login;
      generateToast('You just logged in to this site on other device. Redirecting to home', toast);
      setTimeout(() => {
        router.push('/my-events')
      }, 2000);
    }
  }

  const _handleAllIncomeMessage = (event: any) => {
    console.log("_handleAllIncomeMessage", event)
    // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
    // event.name - TIM.EVENT.MESSAGE_RECEIVED
    // event.data - 存储 Message 对象的数组 - [Message]
    let message;
    for (let i = 0; i < event.data.length; i++) {
      // Message 实例的详细数据结构请参考 Message
      // 其中 type 和 payload 属性需要重点关注
      // 从v2.6.0起，AVChatRoom 内的群聊消息，进群退群等群提示消息，增加了 nick（昵称） 和 avatar（头像URL） 属性，便于接入侧做体验更好的展示
      // 前提您需要先调用 updateMyProfile 设置自己的 nick（昵称） 和 avatar（头像URL），请参考 updateMyProfile 接口的说明
      message = event.data[i]
      switch (message.type) {
        case TIM.TYPES.MSG_GRP_TIP:
          // 收到 Group 系统提示消息 
          // 比如有人加入 或退出
          _handleGroupSystemMsg(message);
          break;
        case TIM.TYPES.MSG_TEXT:
          // 收到了文本消息
          _handleTextMsg(message);
          break;
        case TIM.TYPES.MSG_CUSTOM:
          // 收到了自定义消息
          _handleCustomMsg(message);
          break;
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

  const updateViewerInGroup = async () => {
    console.log("updateViewer")
    const res_online = await timRef.current.getGroupOnlineMemberCount(eventData.streamGroupID);
      console.log("group Online Member: ", res_online)
      if (res_online && res_online.data) {
        if (res_online.data.memberCount === 0 ) {
          viewerCount.current = 1;
        }
        else {
          viewerCount.current = res_online.data.memberCount;
        }
        setTriggerRerender(t => !t)
      }
  }
  const _handleGroupSystemMsg = async (message: any) => {
    if (message.to !== eventData.streamGroupID) {
      console.log("not same id")
      return;
    }
    if (message.payload.operatorID === user?._id && message.payload.operationType === 1) {
      // 是自己加入
      // Get viewer every 5 mins.
      await updateViewerInGroup();
      checkViewerInterval.current = setInterval(updateViewerInGroup, 300000);

      return;
    }
    switch (message.payload.operationType) {
      case 1:
        // 有人进入直播间
        console.log(`${message.nick} join ${message.payload.operatorID}`)
        viewerCount.current = viewerCount.current + 1;
        setTriggerRerender(t => !t)
        break;
      case 2:
        // 有人离开直播间
        console.log(`${message.nick} leave ${message.payload.operatorID}`)
        viewerCount.current = viewerCount.current - 1;
        setTriggerRerender(t => !t)
        break;
      default:
        break;
    }
  }

  const _handleGift = (message: any, data:any) => {
    const userInList: any = chatRoomMessageList.current.find((item: any) => item.username === message.nick);
      const newMessage = {
        avatar: message.avatar,
        username: message.nick || 'Unknown User',
        giftImage: data.data.payload.image[0],
        giftName: data.data.payload.name,
        type: 'gift', 
        color: userInList ? userInList.color : randomColor({ luminosity: 'light' })
      }
      console.log("updated message list: ", [...chatRoomMessageList.current, newMessage])
      chatRoomMessageList.current = [...chatRoomMessageList.current, newMessage];
      setTriggerRerender(t => !t);
  }

  const _handleCustomMsg = (message: any) => {
    console.log("CUSTOMMESSAGE ", message);
    if (message.to !== eventData.streamGroupID) {
      console.log("not same id")
      return;
    }
    const data = message.payload.data;
    const dataObj = JSON.parse(data);
    if (dataObj.type === 'livestream') {
      switch (dataObj.action) {
        case 'like':
          // 收到了点赞
          break
        case 'send_gift':
          // 收到了礼物
          _handleGift(message, dataObj);
          break
        default:
          break
      }
    } else if (dataObj.type === 'stream/start') {
      console.log("streamStart")
      streamStart.current = true;
    } else if (dataObj.type === 'stream/end') {
      console.log('stream end');
      streamStart.current = false;
      streamEnd.current = true;
      // 在活动正式开始之后结束推流， 当作活动结束
      // setStreamTip('Livestream has ended. Replay will be available within 30 minutes');
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

  const _handleTextMsg = (message: any) => {
    const userInList: any = chatRoomMessageList.current.find((item: any) => item.username === message.nick);
    const newMessage = {
      id: message.ID,
      avatar: message.avatar,
      username: message.nick || 'Unknown User',
      type: 'message',
      content: message.payload.text,
      color: userInList ? userInList.color : randomColor({ luminosity: 'light' })
    }
    console.log("updated message list", [...chatRoomMessageList.current, newMessage])

    chatRoomMessageList.current = [...chatRoomMessageList.current, newMessage]
    setTriggerRerender(t => !t);
  }

  const loginToTIM = async (streamRoomID: string, tim: any) => {
    try {
      const login_res = await tim.login({ userID: user?._id, userSig: user?.usersig });
      console.log("login_res: ", login_res);
      if (login_res.data.actionStatus === 'OK') {

        const res_join = await tim.joinGroup({ groupID: streamRoomID });
        console.log("res_join: ", res_join);
        // const res = await tim.getGroupMemberList({ groupID: streamRoomID });
        // console.log("group Member: ", res)

      }
      else {
        console.log('Failed login to tim.');
        errorHandler();
      }
    } catch (err) {
      console.log('Failed login to tim.', err);
      errorHandler(err);
    }
  }

  const createTextMsg = async (message: string) => {
    return await timRef.current.createTextMessage(
      {
        to: streamRoomIdRef.current,
        conversationType: TIM.TYPES.CONV_GROUP,
        // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考 消息优先级与频率控制
        // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）, TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
        priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
        payload: {
          text: message,
        }
      }
    );
  }

  const createCustomMsg = async (payloadString:any) => {
    return await timRef.current.createCustomMessage(
      {
        to: streamRoomIdRef.current,
        conversationType: TIM.TYPES.CONV_GROUP,
        // 消息优先级，用于群聊（v2.4.2起支持）。如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考 消息优先级与频率控制
        priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
        payload: {
          data: payloadString,
        }
      }
    )
  }

  const errorHandler = (err = null) => {
    console.log(err);
    generateErrorToast("Something went wrong", toast);
    setTimeout(() => { router.push('/my-events') }, 1000)
  }

  const getGifts = async () => {
    // TODO: 后端做好之后还要进行修改
    try {
      const data = {
        method: "get",
        path: `getAllVirtualProductsForAppLiveStream/${eventId}`,
        payload: {}
      }
      const res = await getGiftList(data);
      console.log("Gift list:", res);
      if (res && res.data && res.data.merIds) {
        const gifts = res.data.merIds.filter((item: any) => item.typeForApp !== 'tipJar')
        setGifts(gifts);
      }
    }
    catch (error) {
      console.log("Get gift list error")
      errorHandler(error);
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
  const checkEnterPermission = () => {
    // 验证是否符合入场规则
    // TODO: 检查是否有ticket 和是否是主办方， 还有是否在viplist 
    // /ticket api
    //活动结束时间后和isLive是false ，不能进 
    if (moment(new Date()).isAfter(eventData.eventID.end_datetime) && !eventData.isLive) {
      generateToast('The livestream has ended.', toast);
      setTimeout(() => { router.push('/my-events') }, 1000)
      return;
    }

    const oneHourBefore = moment(eventData.eventID.start_datetime).subtract(1, 'hour')

    // 如果在活动开始一个小时前进入直播间 会被direct出去
    if (moment(new Date()) <= oneHourBefore) {
      generateToast('The livestream has not started yet, please come back later', toast);
      setTimeout(() => { router.push('/my-events') }, 1000)
      return;
    }

    // 先建立播放器
    createPlayer();
    // 直播已经开始，直接播放直播
    // if (eventData.isLive) {
    //   return;
    // }

    // 直播还没有开始
    // 如果在一小时内进入的话 创建一个video layer, 播放循环片头
    if (moment(new Date()).isBetween(oneHourBefore, moment(eventData.eventID.start_datetime))) {
      setStartLoopVideo(true);
    }
    // 活动已经开始 但直播没有开始，那就只显示文字
    else {
      setStreamStatusText('Livestream will start in any minute, be ready!');
    }

  }

  const createPlayer = () => {
    console.log("create Player")
    const playerConfig = {
      //h5_flv: true,
      //flv: this.playURL1000,
      //flv_hd: this.playURL1000,
      m3u8: eventData.playURL_6000,
      m3u8_hd: eventData.playURL_2000,
      m3u8_sd: eventData.playURL_1000,
      autoplay: true, // dose not work
      controls: self.innerWidth < 768 ? 'system' : 'default',
      systemFullscreen: true,
      width: '100%', // can be number 640
      height: '100%',
      volume: 0, // music volume 0-1
      live: true, // fixed
      flash: false,
      clarityLabel: { od: '1080p 60fps', hd: '1080p', sd: '720p' },
      clarity: 'sd',
      listener: async (msg:any) => {
        console.log("player listener: ", msg)
        if (msg.type === 'progress') {
          // 当活动提前开始的时候 有可能自动播放失败， 导致playing 事件
          // 不触发， 从而片头不消失。 所以同时监视progress 当作 failsafe      
          const loopVideo = document.querySelector('#loop_pre_recorded')
          if (loopVideo) {
            (document.querySelector('#loop_video') as HTMLVideoElement).pause();
            // loopVideo.setAttribute('style', 'display: none');
          }
          setStartLoopVideo(false);
          return;
        }
        if (msg.type === 'playing') { // prevent deplay, refresh every time.
          // if (self.pausedAndPlay === 1) {
          //   self.player.load();
          //   self.pausedAndPlay = 0;
          // }
          // if (!self.player.playing()) {
          //   self.player.play();
          // }

          // 如果重复播放的片头存在， 而直播播放器在播放的话， 可以移除片头开始直播
          const loopVideo = document.querySelector('#loop_pre_recorded')
          if (loopVideo) {
            (document.querySelector('#loop_video') as HTMLVideoElement).pause();
            // loopVideo.setAttribute('style', 'display: none');
          }

          // const tip = document.querySelector('.tip-container');
          // if (tip) {
          //   tip.remove();
          // }
          // self.reconnect = 0;
          return
        }
        if (msg.type === 'pause') {
          // self.pausedAndPlay = 1;
          return
        }
        if (msg.type === 'load') {
          // const tip = document.querySelector('.tip-container');
          // if (tip) {
          //   tip.remove();
          // }
          return
        }
        if (msg.type === 'error') {
        //   // 手动保持转圈 状态， 等出现自定义错误消息时再隐藏转圈
        //   const spinner: HTMLLIElement = document.querySelector('.vcp-loading');
        //   spinner.setAttribute('style', 'display: block');
        //   // msg 的 event code 非常混乱， 只有拿 vcp-error-tips 这个 div 里的 错误码才是正确的
        //   const err: HTMLElement = document.querySelector('.vcp-error-tips');
        //   let errorCode: any;
        //   if (err) {
        //     errorCode = err.innerHTML.match(/\[(.*?)\]/)[1];
        //     err.setAttribute('style', 'display:none!important');
        //   }
        //   console.log('player error code:', errorCode)

        //   const player = document.querySelector('.vcp-player');
        //   const tip = self.renderer.createElement('div');
        //   tip.className = 'tip-container'
        //   if (errorCode === '12') {
        //     //错误码 12，api播放地址没有获取成功，摧毁播放器，再来一次
        //     self.emptyPlayAddress = true;
        //     await self.getStreamRoom();
        //     if (self.player) {
        //       self.player.destroy()
        //     }
        //     self.createPlayer();
        //   }
        //   if (errorCode === '2' || errorCode === '1' || errorCode === '4') {
        //     self.reconnect += 1;
        //     if (self.reconnect <= 3) {
        //       setTimeout(() => {
        //         // 出现1，2 错误时候， 4次重连，超过之后就不再尝试
        //         self.player.load();
        //       }, 1000);
        //     }
        //     // server 记录 该直播还没开始， 出现 1，2 错误要提示直播未开始或者已结束
        //     if (self.reconnect >= 4) {
        //       const spinner: HTMLLIElement = document.querySelector('.vcp-loading');
        //       spinner.setAttribute('style', 'display: none')
        //       // 没有网络
        //       if (!window.navigator.onLine) {
        //         tip.innerHTML = '<h4 class="player-error">You seem to be offline, please check you network status.</h4>'
        //         self.renderer.appendChild(player, tip);
        //         return;
        //       }
        //       await self.checkIsLive();
        //       if (!self.eventData.eventID.isLive) {
        //         // streamEnded = true 说明收到IM直播结束通知
        //         if (self.streamEnded) {
        //           const oneHourBefore = moment(self.eventData.eventID.start_datetime).subtract(1, 'hour')
        //           // 如果是一小时前开始推流， 但在活动正式开始前直播中断了 那么应该继续显示倒数， 否则就是直播结束
        //           if (moment(new Date()).isBetween(oneHourBefore, moment(self.eventData.eventID.start_datetime))) {
        //             const deadline = new Date(self.eventData.eventID.start_datetime);
        //             self.initializeClock(deadline);
        //             (document.querySelector('#loop_video') as HTMLVideoElement).play();
        //             const videoWrap = self._document.querySelector('#loop_pre_recorded');
        //             videoWrap.setAttribute('style', 'display: block');
        //             self.streamEnded = false;
        //           } else {
        //             // 在活动正式开始之后结束推流， 当作活动结束
        //             tip.innerHTML = '<h4 class="player-error">Livestream has ended. Replay will be available within 30 minutes</h4>'
        //           }
        //         } else {
        //           if (self.eventData.isEnd) { //(对于没有收到 im 的结束通知， 后面进来的观众  需要用到isEnd)
        //             // 如果isLive是 false, isEnd是true, streamEnded是false, 那么直播结束
        //             tip.innerHTML = '<h4 class="player-error">Livestream has ended. Replay will be available within 30 minutes</h4>'
        //           } else {
        //             // 如果isLive是 false, isEnd是false, streamEnded 也是false, 那么直播不是结束， 而是没开始
        //             tip.innerHTML = '<h4 class="player-error">The livestream will start in any minute, be ready!</h4>'
        //           }
        //         }
        //       } else {
        //         // server 记录的 该直播已经开始 那么出现 1，2 错误就显示需要刷新
        //         tip.innerHTML = '<h4 class="player-error">Failed to fetch livestream, please try to refresh this page.</h4>'
        //       }
        //       self.renderer.appendChild(player, tip);
        //     }
        //   } else if (errorCode === '5') {
        //     const spinner: HTMLLIElement = document.querySelector('.vcp-loading');
        //     spinner.setAttribute('style', 'display: none')
        //     tip.innerHTML = '<h4 class="player-error">Browser does not support this stream format,<br> please try to open in desktop Chrome.</h4>'
        //     self.renderer.appendChild(player, tip);
        //   } else {
        //     const spinner: HTMLLIElement = document.querySelector('.vcp-loading');
        //     spinner.setAttribute('style', 'display: none')
        //     tip.innerHTML = '<h4 class="player-error">Unknown error, please try to refresh.</h4>'
        //     self.renderer.appendChild(player, tip);
        //   }
        }

        
      }
    };
    console.log(playerConfig)

    if (typeof TcPlayer !== 'undefined') {
      console.log(scriptLoaded)
      player.current = new TcPlayer('id_test_video', playerConfig);
    } else {
      console.log("TC not ready")
      setTimeout(() => {
        player.current = new TcPlayer('id_test_video', playerConfig);
      }, 2000);
    }
    // 只展示最基础的直播播放器功能在小屏幕
    // if (this.innerWidth > 767) {
    //   setTimeout(() => {
    //     this.playerSetup()
    //   }, 0)
    // }
  }

  const getStreamRoomData = async (event_id: string) => {
    try {
      const res = await getHappinStreamRoom(event_id);
      if (res.code !== 200) {
        throw new Error('Failed to load stream room');
      }
      else {
        setEventData(res.data)
      }
    } catch (err) {
      console.log("get stream room error");
      errorHandler(err)
    }
  }


  const initializeClock = (endtime: any) => {
    const clock = document.getElementById('clockdiv');
    const minutesSpan = clock?.querySelector('.minutes');
    const secondsSpan = clock?.querySelector('.seconds');
    function updateClock() {
      const t = getTimeRemaining(endtime);

      if (minutesSpan && secondsSpan) {
        minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
        secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

        if (t.total <= 0) {
          setStartLoopVideo(false)
          setStreamStatusText('Livestream will start in any minute, be ready!');
          clearInterval(timeinterval.current);
        }
      }
    }

    updateClock();
    //TODO: 检查loop是否好用
    timeinterval.current = setInterval(updateClock, 1000);
  }

  const getTimeRemaining = (endtime: any) => {
    const total = Date.parse(endtime.toString()) - Date.parse(new Date().toString());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);

    return {
      total,
      minutes,
      seconds
    };
  }


  const sendGift = async (gift: any) => {
    try {
      if (!timSDKReady.current) {
        return;
      }

      // if (user?.displayname === '' ||
      //   (user?.displayname.includes('Happin user') && user?.displayname.length === 17) ||
      //   !user?.photourl
      // ) {
      //   this.completeProfileModal.open();
      //   return;
      // }

      // TODO: 检查钱是否够， 不够的话转到Top up 页面
      // TODO: call getUserInfo first, and then check balance
      // if (user?.diamonds)
      // await this.gs.setUserStore();
      // this.userInfo = this.userQuery.getValue();
      // if (this.userInfo.points < count * gift.price) {
      //   this.sendNotification('Insufficient coins. Please top up')
      //   return;
      // }

      // TODO: api购买礼物
      // const serverPayload = {
      //   points: gift.price * count,
      //   mercID: gift._id,
      //   mercName: gift.name,
      //   quantity: count,
      //   streamRoomID: this.streamRoomGroupID
      // }
      // const res = await this.http.postHappinBuyGift(serverPayload).toPromise();

      // // server 更新剩余points
      // await this.gs.setUserStore();
      // this.userInfo = this.userQuery.getValue();

      // send gift to IM
      const giftObject = {
        ...gift,
        name: gift.name,
        senderAvatar: user?.photourl,
        senderName: user?.displayname,
        giftImage: gift.image[0],
      }

      const payload = {
        action: 'send_gift',
        data: { count: 1, payload: giftObject },
        type: 'livestream',
        user: {},
        version: 1,
      };

      const payloadString = JSON.stringify(payload);
      const message = await createCustomMsg(payloadString);
      console.log("gift message will send: ", message)
      const res_gift = await timRef.current.sendMessage(message);
      console.log("gift message sent: ", res_gift);

      const userInList = chatRoomMessageList.current.find((item:any) => item.username === user?.displayname);
      const newMessage = {
        avatar: user?.photourl,
        username: user?.displayname || 'Unknown User',
        giftImage: gift.image[0],
        giftName: gift.name,
        type: 'gift', 
        color: userInList ? userInList.color : randomColor({ luminosity: 'light' })
      }
      console.log("updated message list: ", [...chatRoomMessageList.current, newMessage])
      chatRoomMessageList.current = [...chatRoomMessageList.current, newMessage];
      setTriggerRerender(t => !t);

    } catch (error) {
      console.log(error)
      if (error.message.includes('禁言')) {
        generateToast('Your acconunt is banned', toast);
      } else {
        generateErrorToast('Failed to send gift. Please try again later', toast);
      }
    }
  }

  const handlerSendMsn = async (e: any) => {
    emojiShow && setEmojiShow(false)
    if (!timSDKReady.current) {
      return;
    }

    const message = await createTextMsg(e);
    try {
      await timRef.current.sendMessage(message);
      const userInList: any = chatRoomMessageList.current.find((item: any) => item.username === message.nick);
      const newMessage = {
        id: user?.uid,
        avatar: user?.photourl,
        username: user?.displayname || 'Unknown User',
        type: 'message',
        content: message.payload.text,
        color: userInList ? userInList.color : randomColor({ luminosity: 'light' })
      }
      console.log("updated Message List: ", [...chatRoomMessageList.current, newMessage])
      chatRoomMessageList.current = [...chatRoomMessageList.current, newMessage];
      setTriggerRerender(t => !t);


    } catch (err: any) {
      if (err.message.includes('禁言')) {
        generateToast('Your acconunt is banned', toast);
      }
      console.log('Failed to sent message');
    }

  }

  const onTextInputChange = (e: any) => {
  }

  const handleFollow = async () => {
    setFollowBtnDisable(true)
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

  const handleSendMessage = () => {

  }




  return (
    <div className="live-stream__container">
      <Script src="/plugin/TcPlayer-2.4.1.js" onLoad={() => setScriptLoaded(true)}/>
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
                  <div className="font-medium text-sm text-white text-opacity-60 inline-flex items-center">
                    <SvgIcon id="group" className="text-base text-white text-opacity-70 mr-1" />
                    <span>{viewerCount.current}</span>
                  </div>
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
                <div className="flex items-center justify-center w-full h-full">
                  <div className="text-white">{streamStatusText}</div>
                  <div id="id_test_video" className="video-wrap"></div>
                  {startLoopVideo &&
                    <div className="video-wrap" id="loop_pre_recorded">
                      <div>
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
                        {/* <div id="count_ended">
                        <span>Livestream will start in any minute, be ready!</span>
                      </div> */}
                        <video width="100%" height="100%" autoPlay playsInline muted loop onCanPlay={(e) => (e.target as HTMLVideoElement).play()}
                          id="loop_video" onLoadedMetadata={(e) => (e.target as HTMLVideoElement).muted = true} controls>
                          <source src={eventData.countDownVideoUrl} type="video/mp4" />
                        </video>
                      </div>
                    </div>
                  }

                </div>

              </div>
            </div>
            <div className="bg-gray-800 px-6 hidden sm:block">
              {timSDKReady.current &&
                <Slider {...settings}>
                  {
                    gifts.map((item: any, index: number) => (
                      <div key={index} onClick={() => sendGift(item)}
                        className="flex flex-col justify-center text-center py-2.5 px-1.5 cursor-pointer overflow-hidden group hover:bg-gray-700 transition">
                        <img className="w-7 h-7 md:w-8 md:h-8 mx-auto" src={item.image[0]} alt={item.name} />
                        <div className="truncate text-gray-400 text-sm font-medium mt-2 group-hover:text-gray-50 transition">{item.name}</div>
                        <div className="flex items-center justify-center mt-1">
                          <img className="w-3 mr-1" src="/images/icon-coin.svg" alt="" />
                          <span className="text-tiny text-gray-300 font-semibold group-hover:text-gray-100 transition">{item.price}</span>
                        </div>
                      </div>
                    ))
                  }
                </Slider>
              }
            </div>
            {/* <div className="hidden md:block xl:hidden py-5 md:py-7 xl:py-10 px-4 md:px-5 lg:px-6 xl:px-8">
              <LiveList list={liveList} />
            </div> */}
          </div>
          <div className="hidden sm:flex flex-col w-full md:w-80 border-l border-black bg-gray-700">
            <div className="items-center justify-center h-12 text-white border-b border-gray-800 font-semibold hidden md:flex">Live Chat</div>
            <div className="live-stream__chat-room">
              <div className="pt-3 pb-1.5">
                {chatRoomMessageList.current.map((item: any, index: number) => {
                  if (item.type === "message") {
                    return <ChatItem key={index} data={item} />
                  }
                  else {
                    return <ChatItem isGift giftImg={item.giftImage} key={index} data={item} />
                  }
                })}
              </div>
            </div>
            <div className="relative flex items-center bg-black bg-opacity-40 footer-action">
              {emojiShow && (
                <Picker
                  theme="dark"
                  include={['recent', 'search', 'people']}
                  color="#fe4365"
                  showPreview={false}
                  showSkinTones={false}
                  style={{ position: 'absolute', bottom: '100%', left: '0', width: '100%' }}
                  onSelect={(emoji) => senderRef.current?.onSelectEmoji(emoji)}
                />
              )}
              {timSDKReady.current &&
                <Sender
                  ref={senderRef}
                  emojiShow={emojiShow}
                  sendMessage={handlerSendMsn}
                  placeholder="Send something..."
                  disabled={false}
                  maxlength={120}
                  onClick={() => {
                    // setEmojiShow(false)
                  }}
                  onTextInputChange={onTextInputChange}
                  onPressEmoji={() => {
                    setEmojiShow(s => !s)
                    senderRef.current.focus()
                  }}
                />
              }
            </div>
          </div>
        </div>
      }
      {/* <div className="px-0 pb-10 mt-10 hidden xl:block">
          <LiveList list={liveList} />
        </div> */}
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
            {timSDKReady.current &&
              <Slider {...settings}>
                {
                  gifts.map((item: any, index: number) => (
                    <div key={index} onClick={() => sendGift(item)}
                      className="flex flex-col justify-center text-center pt-2 pb-1 sm:py-2.5 px-1.5 cursor-pointer overflow-hidden group hover:bg-gray-700 rounded-md sm:rounded-none transition">
                      <img className="w-7 h-7 md:w-8 md:h-8 mx-auto" src={item.image[0]} alt={item.name} />
                      <div className="truncate text-gray-400 text-sm font-medium mt-2 group-hover:text-gray-50 transition">{item.name}</div>
                      <div className="flex items-center justify-center mt-1">
                        <img className="w-3 mr-1" src="/images/icon-coin.svg" alt="" />
                        <span className="text-tiny text-gray-300 font-semibold group-hover:text-gray-100 transition">{item.price}</span>
                      </div>
                    </div>
                  ))
                }
              </Slider>
            }
          </div>
          <div className="flex flex-col w-full bg-gray-700">
            <div className="live-stream__chat-room web-scroll">
              <div className="pt-3 pb-1.5">
                {chatRoomMessageList.current.map((item: any, index: number) => {
                  if (item.type === "message") {
                    return <ChatItem key={index} data={item} />
                  }
                  else {
                    return <ChatItem isGift giftImg={item.giftImage} key={index} data={item} />
                  }
                })}
              </div>
            </div>
            <div className="relative flex items-center bg-black bg-opacity-40 footer-action">
              {emojiShow && (
                <Picker
                  theme="dark"
                  include={['recent', 'search', 'people']}
                  color="#fe4365"
                  showPreview={false}
                  showSkinTones={false}
                  style={{ position: 'absolute', bottom: '100%', left: '0', width: '100%' }}
                  onSelect={(emoji) => senderRef.current?.onSelectEmoji(emoji)}
                />
              )}
              {timSDKReady.current &&
                <Sender
                  ref={senderRef}
                  emojiShow={emojiShow}
                  sendMessage={handlerSendMsn}
                  placeholder="Send something..."
                  disabled={false}
                  maxlength={120}
                  // onClick={handleSendMessage}
                  onTextInputChange={onTextInputChange}
                  onPressEmoji={() => {
                    setEmojiShow(s => !s)
                    senderRef.current.focus()
                  }}
                />
              }
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};

export default Livestream;
