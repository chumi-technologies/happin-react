import React, { useState } from 'react';
import Link from 'next/link';
import { VStack, HStack } from '@chakra-ui/react';
import { Like, ShareTwo, DownTwo, CloseSmall } from '@icon-park/react';
import classNames from 'classnames';

import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";

type ActionSideBarProps = {
  isFavorite: boolean;
  showDownload: boolean;
  eventTitle?: string;
  onFavorite: () => void;
  onDownload: () => void;
  onShare: () => void;
  hasPFM: boolean;
};
const ActionSideBar: React.FC<ActionSideBarProps> = (props) => {
  const {
    isFavorite,
    showDownload,
    eventTitle = "",
    onFavorite,
    onShare,
    onDownload,
    hasPFM
  } = props;
  const [openShare, setOpenShare] = useState(false)
  return (
    <div className="absolute right-4 top-4 sm:right-6 sm:top-6 lg:right-14 lg:top-14 z-20">
      <VStack>
        <div className={classNames('event-details__side-action', { 'favorite': isFavorite })}
             onClick={onFavorite}
        >
          <Like theme={isFavorite? 'filled' : 'outline'} size="1em" fill="currentColor" strokeWidth={2}/>
        </div>
        <div className="relative">
        <div className="event-details__side-action relative z-30" onClick={() => {setOpenShare(!openShare)}}>
          <ShareTwo theme="outline" size="1em" fill="currentColor" strokeWidth={2}/>
        </div>
        {
            openShare && (
              <div className="fade-scale-in absolute right-5 top-5 w-60 z-20">
                <div className="py-3 px-4 border border-solid border-gray-700 rounded-lg bg-gray-800">
                  <div className="text-sm pr-4 flex">
                    <div className="mx-2">
                      <EmailShareButton
                        url={window.location.href}
                        subject={eventTitle}
                        body={window.location.href}
                      >
                        <EmailIcon size={32} round />
                      </EmailShareButton>
                    </div>
                    <div className="mx-2">
                      <FacebookShareButton
                        url={window.location.href}
                        quote={eventTitle}
                      >
                        <FacebookIcon size={32} round />
                      </FacebookShareButton>
                    </div>
                    <div className="mx-2">
                      <TwitterShareButton
                        url={window.location.href}
                        title={eventTitle}
                      >
                        <TwitterIcon size={32} round />
                      </TwitterShareButton>
                    </div>
                    <div className="mx-2">
                      <WhatsappShareButton
                        url={window.location.href}
                        title={eventTitle}
                      >
                        <WhatsappIcon size={32} round />
                      </WhatsappShareButton>
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        </div>
        <div className="relative">
          <div
            className={classNames('event-details__side-action relative z-10', { 'active': showDownload })}
            onClick={onDownload}
          >
            {
              showDownload ? <CloseSmall theme="outline" size="1em" fill="currentColor" strokeWidth={2}/> : <DownTwo theme="outline" size="1em" fill="currentColor" strokeWidth={2}/>
            }
          </div>
          {
            showDownload ? (
              <div className="fade-scale-in absolute right-5 top-5 w-72">
                <div className="py-3 px-4 border border-solid border-gray-700 rounded-lg bg-gray-800">
                  <div className="text-sm pr-4">
                    {hasPFM ? <>This event includes <a rel="noreferrer" href="https://help.happin.app/en/articles/4891884-what-is-vip-fan-meeting" target="_blank" className="link-white">VIP/Fan meeting</a>
                    . Download the Happin app to meet your favourite artists`</> : 'Download the app and chat with other attendees.'}
                    
                  </div>
                  <HStack justify="space-between" mt={3}>
                    <Link href="/">
                      <a href={process.env.NEXT_PUBLIC_HAPPIN_APP_APPLE_STORE} rel="noreferrer" target="_blank"><img className="h-10" src="/images/app-store.svg" alt="App Store" /></a>
                    </Link>
                   {/*  <Link href="/">
                      <a><img className="h-10" src="/images/google-play.svg" alt="Google Play" /></a>
                    </Link> */}
                  </HStack>
                </div>
              </div>
            ) : (hasPFM && <div className="event-details__side-vip">VIP</div>)
          }
        </div>
      </VStack>
    </div>
  );
};

export default ActionSideBar;
