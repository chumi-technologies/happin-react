import React, { useState, useRef, useEffect } from "react";
import { Avatar, useToast } from '@chakra-ui/react';
import SvgIcon from '@components/SvgIcon';
import { Check, Left, Plus, Right } from '@icon-park/react';
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
const giftList = [
  {
    id: 0,
    name: 'Cheers',
    img: '/images/gift-01.png',
    cost: 50,
    costType: 'coins'
  },
  {
    id: 1,
    name: 'Hands Up',
    img: '/images/gift-02.png',
    cost: 50,
    costType: 'coins'
  },
  {
    id: 2,
    name: 'Kiss',
    img: '/images/gift-03.png',
    cost: 50,
    costType: 'coins'
  },
  {
    id: 3,
    name: 'Rocket',
    img: '/images/gift-04.png',
    cost: 50,
    costType: 'coins'
  },
  {
    id: 4,
    name: 'BoomShaking',
    img: '/images/gift-05.png',
    cost: 50,
    costType: 'coins'
  },
  {
    id: 5,
    name: 'Birthday Cake',
    img: '/images/gift-06.png',
    cost: 1,
    costType: 'diamond'
  },
  {
    id: 6,
    name: 'Bear',
    img: '/images/gift-07.png',
    cost: 2,
    costType: 'diamond'
  },
  {
    id: 7,
    name: 'Bear',
    img: '/images/gift-08.png',
    cost: 2,
    costType: 'diamond'
  },
  {
    id: 8,
    name: 'Bear',
    img: '/images/gift-09.png',
    cost: 2,
    costType: 'diamond'
  },
  {
    id: 9,
    name: 'Bear',
    img: '/images/gift-10.png',
    cost: 2,
    costType: 'diamond'
  },
  {
    id: 10,
    name: 'Bear',
    img: '/images/gift-11.png',
    cost: 2,
    costType: 'diamond'
  },
  {
    id: 11,
    name: 'Bear',
    img: '/images/gift-12.png',
    cost: 2,
    costType: 'diamond'
  },
  {
    id: 12,
    name: 'Bear',
    img: '/images/gift-13.png',
    cost: 2,
    costType: 'diamond'
  },
];
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
  const [emojiShow, setEmojiShow] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [chatShow, setChatShow] = useState(false);
  const [eventId, setEventId] = useState("");
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

  useEffect( () => {
    // if (!router.query.event_id || router.query.event_id === "") {
    //   console.log(user)
    //     router.push('/my-events');
    //     return;
    // }
    if (router.query.event_id) {
      setEventId(router.query.event_id as string);
      if (!user) {
        (async () => {
          try {
            await getUserInfo()
          }
          catch(error) {
            generateToast('Please login to proceed',toast);
            showSSO();
          }
        
      })();
      }
    }
  },[router.query])

  useEffect( () => {
    if (user) {
      console.log(user);
      // get api
    }
  },[user])

  const handlerSendMsn = (e: any) => {
    console.log(e);
    emojiShow && setEmojiShow(false)
  }
  const onTextInputChange = (e: any) => {
    // console.log(e);
  }

  return (
    <div className="live-stream__container">
      <div className="live-stream__inner xl:rounded-lg xl:mt-2">
        <div className="relative flex-1 min-w-0 md:overflow-x-hidden hide-scrollbar">
          <div className="live-stream__video-bar">
            <div className="flex items-center justify-end px-2 sm:hidden">
              <div
                className={classnames('text-gray-50 transition text-2xl p-2',
                  {'text-rose-500': chatShow})}
                onClick={() => setChatShow(s => !s)}
              >
                <SvgIcon id="comment" className="text-2xl" />
              </div>
            </div>
            <div className="flex items-center sm:bg-gray-800 px-4 h-16 footer-action">
              <Avatar boxSize={10} src="https://assets.website-files.com/5b9041fb091628c1f868ff07/5b90ef21e2a13a121bab54ed_Person%20Pic%207%402x.jpg" name="Alice" />
              <div className="flex-1 mx-4">
                <div className="font-semibold text-gray-50">Louis C.K.</div>
                <div className="font-medium text-sm text-white text-opacity-60 inline-flex items-center">
                  <SvgIcon id="group" className="text-base text-white text-opacity-70 mr-1" />
                  <span>123</span>
                </div>
              </div>
              {
                <button
                  className={classnames(isFollowed ? 'livestream__btn-following' : 'livestream__btn-follow')}
                  onClick={() => setIsFollowed(s => !s)}
                >
                  {isFollowed ? <Check theme="outline" size="14" fill="#d9d9d9" strokeWidth={5}/> :
                    <Plus theme="outline" size="14" fill="#fff" strokeWidth={5}/>
                  }
                  <span className="ml-1.5">
                { isFollowed ? 'Following' : 'Follow' }
              </span>
                </button>
              }
            </div>
          </div>
          <div className="relative h-screen sm:h-auto sm:aspect-w-16 sm:aspect-h-9">
            <div className="absolute inset-0 bg-black">
              <div className="absolute right-3 top-3 inline-flex justify-center items-center w-10 h-10 bg-black bg-opacity-30 rounded-full z-10 transition cursor-pointer hover:bg-opacity-40">
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
                <div className="text-white">Video Content</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 px-6 hidden sm:block">
            <Slider {...settings}>
              {
                giftList.map((item, index) => (
                  <div key={index} className="flex flex-col justify-center text-center py-2.5 px-1.5 cursor-pointer overflow-hidden group hover:bg-gray-700 transition">
                    <img className="w-7 h-7 md:w-8 md:h-8 mx-auto" src={item.img} alt={item.name} />
                    <div className="truncate text-gray-400 text-sm font-medium mt-2 group-hover:text-gray-50 transition">{item.name}</div>
                    <div className="flex items-center justify-center mt-1">
                      <img className="w-3 mr-1" src="/images/icon-coin.svg" alt="" />
                      <span className="text-tiny text-gray-300 font-semibold group-hover:text-gray-100 transition">{item.cost}</span>
                    </div>
                  </div>
                ))
              }
            </Slider>
          </div>
          {/* <div className="hidden md:block xl:hidden py-5 md:py-7 xl:py-10 px-4 md:px-5 lg:px-6 xl:px-8">
            <LiveList list={liveList} />
          </div> */}
        </div>
        <div className="hidden sm:flex flex-col w-full md:w-80 border-l border-black bg-gray-700">
          <div className="items-center justify-center h-12 text-white border-b border-gray-800 font-semibold hidden md:flex">liveChat</div>
          <div className="live-stream__chat-room">
            <div className="pt-3 pb-1.5">
              <ChatItem data={{
                avatar: 'https://assets.website-files.com/5b9041fb091628c1f868ff07/5b90ef21e2a13a121bab54ed_Person%20Pic%207%402x.jpg',
                username: 'slovely11',
                content: 'I built a house out of empty McRib boxes. Me and my 5 kids live there',
                color: 'blue'
              }}/>
              <ChatItem data={{
                avatar: 'https://assets.website-files.com/5b9041fb091628c1f868ff07/5b90ef21e2a13a121bab54ed_Person%20Pic%207%402x.jpg',
                username: 'Alex Ng',
                content: 'Nice!!',
                color: 'green'
              }}/>
              <ChatItem isGift giftImg="/images/gift-04.png" data={{
                avatar: 'https://assets.website-files.com/5b9041fb091628c1f868ff07/5b90ef21e2a13a121bab54ed_Person%20Pic%207%402x.jpg',
                username: 'vicktorious99',
                content: 'Sent a Rocket',
                color: 'pink',
              }}/>
              <ChatItem data={{
                avatar: 'https://assets.website-files.com/5b9041fb091628c1f868ff07/5b90ef21e2a13a121bab54ed_Person%20Pic%207%402x.jpg',
                username: 'norrmsn_man_stormin',
                content: 'can you sing originals? 😚',
                color: 'yellow'
              }}/>
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
          </div>
        </div>
      </div>
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
            <Slider {...settings}>
              {
                giftList.map((item, index) => (
                  <div key={index} className="flex flex-col justify-center text-center pt-2 pb-1 sm:py-2.5 px-1.5 cursor-pointer overflow-hidden group hover:bg-gray-700 rounded-md sm:rounded-none transition">
                    <img className="w-7 h-7 md:w-8 md:h-8 mx-auto" src={item.img} alt={item.name} />
                    <div className="truncate text-gray-400 text-sm font-medium mt-2 group-hover:text-gray-50 transition">{item.name}</div>
                    <div className="flex items-center justify-center mt-1">
                      <img className="w-3 mr-1" src="/images/icon-coin.svg" alt="" />
                      <span className="text-tiny text-gray-300 font-semibold group-hover:text-gray-100 transition">{item.cost}</span>
                    </div>
                  </div>
                ))
              }
            </Slider>
          </div>
          <div className="flex flex-col w-full bg-gray-700">
            <div className="live-stream__chat-room web-scroll">
              <div className="pt-3 pb-1.5">
                <ChatItem data={{
                  avatar: 'https://assets.website-files.com/5b9041fb091628c1f868ff07/5b90ef21e2a13a121bab54ed_Person%20Pic%207%402x.jpg',
                  username: 'slovely11',
                  content: 'I built a house out of empty McRib boxes. Me and my 5 kids live there',
                  color: 'blue'
                }}/>
                <ChatItem data={{
                  avatar: 'https://assets.website-files.com/5b9041fb091628c1f868ff07/5b90ef21e2a13a121bab54ed_Person%20Pic%207%402x.jpg',
                  username: 'Alex Ng',
                  content: 'Nice!!',
                  color: 'green'
                }}/>
                <ChatItem isGift giftImg="/images/gift-04.png" data={{
                  avatar: 'https://assets.website-files.com/5b9041fb091628c1f868ff07/5b90ef21e2a13a121bab54ed_Person%20Pic%207%402x.jpg',
                  username: 'vicktorious99',
                  content: 'Sent a Rocket',
                  color: 'pink',
                }}/>
                <ChatItem data={{
                  avatar: 'https://assets.website-files.com/5b9041fb091628c1f868ff07/5b90ef21e2a13a121bab54ed_Person%20Pic%207%402x.jpg',
                  username: 'norrmsn_man_stormin',
                  content: 'can you sing originals? 😚',
                  color: 'yellow'
                }}/>
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
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};

export default Livestream;
