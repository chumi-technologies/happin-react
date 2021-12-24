import React, { useEffect, useState, useRef } from "react";
import { Avatar } from '@chakra-ui/react';
import SvgIcon from '@components/SvgIcon';
import { Left, Plus, Right } from '@icon-park/react';
import Slider from 'react-slick';
import classnames from 'classnames';
import Sender from "@components/page_components/LiveStreamComponents/Sender";
import { Picker } from 'emoji-mart';

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
]
interface ISenderRef {
  onSelectEmoji: (event: any) => void;
  focus: () => void;
}
const Livestream = () => {
  const senderRef = useRef<ISenderRef>(null!);
  const [emojiShow, setEmojiShow] = useState(false);
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
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ],
    nextArrow: <Arrow><Right theme="outline" size="16" fill="currentColor" /></Arrow>,
    prevArrow: <Arrow><Left theme="outline" size="16" fill="currentColor" /></Arrow>,
  };

  const handlerSendMsn = (e: any) => {
    console.log(e);
    emojiShow && setEmojiShow(false)
  }
  const onTextInputChange = (e: any) => {
    // console.log(e);
  }

  return (
    <div className="container">
      <div className="flex mt-2 rounded-lg overflow-hidden">
        <div className="flex-1 min-w-0">
          <div className="flex items-center bg-gray-800 px-4 h-16 border-b border-black border-opacity-40">
            <Avatar boxSize={10} src="https://assets.website-files.com/5b9041fb091628c1f868ff07/5b90ef21e2a13a121bab54ed_Person%20Pic%207%402x.jpg" name="Alice" />
            <div className="flex-1 mx-4">
              <div className="font-semibold text-gray-50">Louis C.K.</div>
              <div className="font-medium text-sm text-gray-400 inline-flex items-center">
                <SvgIcon id="group" className="text-base text-gray-300 mr-1" />
                <span>123</span>
              </div>
            </div>
            <button className="livestream__btn-follow">
              <Plus theme="outline" size="14" fill="#fff" strokeWidth={5}/>
              <span className="ml-1">Follow</span>
            </button>
          </div>
          <div className="relative aspect-w-16 aspect-h-9">
            <div className="absolute inset-0 bg-black">
              <div className="flex items-center justify-center w-full h-full">
                <div className="text-white">Video Content</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 px-6">
            <Slider {...settings}>
              {
                giftList.map((item, index) => (
                  <div key={index} className="flex flex-col justify-center text-center py-2.5 px-1.5 cursor-pointer overflow-hidden group hover:bg-gray-700 transition">
                    <img className="w-8 h-8 mx-auto" src={item.img} alt={item.name} />
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
        </div>
        <div className="flex flex-col w-80 border-l border-black bg-gray-700">
          <div className="flex items-center justify-center h-12 text-white border-b border-gray-800 font-semibold">Live Chat</div>
          <div className="flex-1 overflow-y-auto px-1">
            <div className="">1</div>
          </div>
          <div className="relative flex items-center bg-black bg-opacity-40">
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
    </div>
  );
};

export default Livestream;
