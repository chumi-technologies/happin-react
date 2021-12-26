import { Avatar } from '@chakra-ui/react';
import React from 'react';
import classnames from 'classnames';

export type ChatItems = {
  avatar: string;
  username: string;
  content: string;
  color: 'yellow' | 'rose' | 'blue' | 'green' | 'pink' | 'white';
}
export type ChatIteProp = {
  data: ChatItems | never;
  isGift?: false;
  giftImg?: never;
} | {
  data: ChatItems;
  isGift?: true;
  giftImg: string;
}
const ChatItem = ({ data, isGift = false, giftImg } : ChatIteProp) => {
  return (
    <div className="live-stream__chat-item">
      <Avatar boxSize={6} mr={2} src={data.avatar} name={data.username} />
      <div className="flex-1 min-w-0">
        <div className={classnames('inline-block cursor-pointer', {'align-middle': !isGift})}>
          <span className={classnames('font-semibold mr-1.5', data.color === 'white' ? 'text-gray-50' : `text-${data.color}-500`)}>{data.username}</span>
        </div>
        {
          !isGift ? <span className="break-words align-middle">{data.content}</span>: (
            <span className="break-words font-semibold text-rose-500">
              <span>{data.content}</span>
              <img className="inline-block w-5 ml-1.5 align-text-bottom" src={giftImg} alt="" />
            </span>
          )
        }
      </div>
    </div>
  );
};

export default ChatItem;
