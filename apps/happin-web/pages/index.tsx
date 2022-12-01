import React, { useState } from 'react';
import { useEffect } from 'react';
import VideoPlayer from '@components/reusable/Video';
import { VideoJsPlayer } from 'video.js';
import IconPark from '@components/IconPark';

export default function Home() {
  const playerRef = React.useRef<VideoJsPlayer | null>(null);
  const [isPlay, setIsPlay] = useState(false);
  const [bannerShow, setBannerShow] = useState(true);
  useEffect(() => {
    document.body.classList.add('home__page');
    return () => {
      document.body.classList.remove('home__page');
    };
  }, []);
  const handleVideo = () => {
    setIsPlay(true);
    playerRef.current?.play();
    playerRef.current?.loop(true);
  };
  const handlePlayerReady = (player: VideoJsPlayer) => {
    playerRef.current = player;
  };
  return (
    <div className="relative z-0 font-gtw">
      <div className="home__page-section-first">
        {bannerShow && (
          <div className="fixed left-0 right-0 top-1/4 sm:top-1/3 md:top-1/2 md:-mt-20 bg-white z-20 overflow-hidden">
            <div className="container">
              <div className="flex flex-col md:flex-row items-center justify-center py-10 md:h-40 md:py-8">
                <div
                  onClick={() => setBannerShow(false)}
                  className="flex items-center justify-center absolute right-1.5 top-1.5 p-2 rounded-full hover:text-rose-500 transition cursor-pointer"
                >
                  <IconPark name="close-small" size={26} />
                </div>
                <picture className="absolute -z-[1] inset-0">
                  <img
                    className="w-full h-[600px] sm:h-full object-cover opacity-70"
                    src="/images/home-page/bg-home-banner.svg"
                    alt=""
                  />
                </picture>
                <div className="flex-1 md:mr-6 text-center md:text-left mb-6">
                  <div className="text-lg font-medium leading-5 mb-2">
                    Do you wanna try the next cool thing to interact with your
                    friends?
                  </div>
                  <div className="text-lg font-medium">
                    Join the waitlist to get early access.
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 md:space-y-0 sm:space-x-4">
                  <button className="btn btn-rose !rounded-full !px-5 !py-3 !font-medium">
                    Get early access
                  </button>
                  <button className="btn btn-bee-yellow !rounded-full !px-5 !py-3 !font-medium">
                    Join as 3d designer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="container py-12 sm:py-18 lg:py-24 text-center">
          <div className="max-w-[1000px] mx-auto text-3xl sm:text-5xl lg:text-7xl font-bold mb-2 sm:mb-4">
            Send AR stickers to friends while chatting.
          </div>
          <div className="text-base sm:text-xl lg:text-2xl mb-8 sm:mb-10">
            Create meaningful interactions and self-express.
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-6 lg:mb-24">
            <button className="btn btn-rose !rounded-full sm:!px-8 sm:!py-4 lg:!px-12 sm:!text-lg lg:!text-xl !font-medium">
              Get early access
            </button>
            <button className="btn btn-bee-yellow !rounded-full sm:!px-8 sm:!py-4 lg:!px-12 sm:!text-lg lg:!text-xl !font-medium">
              Join as 3d designer
            </button>
          </div>
          <div className="relative w-3/4 sm:w-[300px] md:w-[330px] lg:w-[360px] mx-auto mt-10 sm:mt-16">
            <div className="iphone-mock">
              <div className="iphone-mock__lock" />
              <div className="iphone-mock__volume-up" />
              <div className="iphone-mock__volume-down" />
              <div className="iphone-mock__power" />
              <div className="iphone-mock__camera" />
              {!isPlay && (
                <div className="home__video-starter" onClick={handleVideo}>
                  <svg viewBox="0 0 24 24" width="30" height="30">
                    <path
                      fill="currentColor"
                      d="M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z"
                    />
                  </svg>
                </div>
              )}
              <VideoPlayer
                className="home__banner-video"
                options={{
                  autoplay: false,
                  controls: false,
                  fluid: true,
                  muted: true,
                  preload: 'auto',
                  sources: [
                    {
                      src: '/images/home-page/banner-video.mp4',
                      type: 'video/mp4',
                    },
                  ],
                }}
                onReady={handlePlayerReady}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="container py-12 md:py-18 lg:py-24">
          <div className="flex flex-col sm:items-center sm:flex-row-reverse w-full">
            <div className="text-center sm:text-left sm:w-1/2">
              <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-6 lg:mb-8">
                Match with other cool people
              </div>
              <div className="text-base sm:text-xl lg:text-2xl">
                Never get bored to connect with other people in your school,
                your community and more.
              </div>
            </div>
            <div className="flex justify-center sm:justify-start sm:w-1/2 mt-8 sm:mt-0">
              <img
                className="w-3/4 sm:w-[300px] md:w-[320px] lg:w-[340px]"
                src="/images/home-page/section-3-phone@2x.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
      <div className="home__page-section-second">
        <div className="container py-12 md:py-18 lg:py-24">
          <div className="flex flex-col sm:items-center sm:flex-row w-full">
            <div className="text-center sm:text-left sm:w-1/2">
              <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-6 lg:mb-8">
                Turn the background of messaging into an AR camera
              </div>
              <div className="text-base sm:text-xl lg:text-2xl">
                So you can see 3d stickers in real world while chatting with
                your friends.
              </div>
            </div>
            <div className="flex justify-center sm:justify-end sm:w-1/2 mt-8 sm:mt-0">
              <div className="relative w-3/4 sm:w-[280px] md:w-[300px] lg:w-[340px]">
                <div className="iphone-mock">
                  <div className="iphone-mock__lock" />
                  <div className="iphone-mock__volume-up" />
                  <div className="iphone-mock__volume-down" />
                  <div className="iphone-mock__power" />
                  <div className="iphone-mock__camera" />
                  <img
                    className="w-full"
                    src="/images/home-page/section-2-phone@2x.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="container py-12 md:py-18 lg:py-24">
          <div className="flex flex-col sm:items-center sm:flex-row-reverse w-full">
            <div className="text-center sm:text-left sm:w-1/2">
              <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-6 lg:mb-8">
                Build-in editing tool for you to create more personal stickers.
              </div>
              <div className="text-base sm:text-xl lg:text-2xl">
                You can add custom text, voice, music, or effects.
              </div>
            </div>
            <div className="flex justify-center sm:justify-start sm:w-1/2 mt-8 sm:mt-0">
              <div className="relative w-3/4 sm:w-[280px] md:w-[300px] lg:w-[340px]">
                <div className="iphone-mock">
                  <div className="iphone-mock__lock" />
                  <div className="iphone-mock__volume-up" />
                  <div className="iphone-mock__volume-down" />
                  <div className="iphone-mock__power" />
                  <div className="iphone-mock__camera" />
                  <img
                    className="w-full"
                    src="/images/home-page/section-editing@2x.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#e2f1ef]">
        <div className="container py-12 md:py-18 lg:py-24">
          <div className="flex flex-col sm:items-center sm:flex-row w-full">
            <div className="text-center sm:text-left sm:w-1/2">
              <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-6 lg:mb-8">
                Access to private 3d space from anywhere when you chat with your
                friends.
              </div>
            </div>
            <div className="flex justify-center sm:justify-end sm:w-1/2 mt-8 sm:mt-0">
              <div className="relative w-3/4 sm:w-[280px] md:w-[300px] lg:w-[340px]">
                <div className="iphone-mock">
                  <div className="iphone-mock__lock" />
                  <div className="iphone-mock__volume-up" />
                  <div className="iphone-mock__volume-down" />
                  <div className="iphone-mock__power" />
                  <div className="iphone-mock__camera" />
                  <img
                    className="w-full"
                    src="/images/home-page/section-3d-space@2x.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div className="container py-12 sm:py-24 md:py-32 lg:py-40">
          <div className="flex flex-col sm:items-center sm:flex-row-reverse w-full">
            <div className="text-center sm:text-left sm:w-1/2">
              <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-6 lg:mb-8">
                Unlimited ways to convey your emotion or create fun excuses to start a conversation.
              </div>
              <div className="text-base sm:text-xl lg:text-2xl">
                3d stickers can add more realistic animation and apply to your friends’ real world.
              </div>
            </div>
            <div className="flex justify-center sm:justify-start sm:w-1/2 mt-8 sm:mt-0">
              <div className="w-full sm:w-4/5 h-full">
                <div className="aspect-w-1 aspect-h-1 w-full">
                  <div className="absolute inset-0 flex items-center rounded-full bg-[#CFE5FF]">
                    <div className="absolute -left-8 flex flex-col justify-center rounded-3xl rounded-l-none xl:rounded-l-3xl pl-8 h-3/5 w-11/12 bg-[#7579C6]">
                      <div className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold mt-6 md:mt-7">What’s up,</div>
                      <div className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold mt-1 md:mt-3">buddy?!</div>
                    </div>
                    <img className="absolute left-0 top-0 w-1/3" src="/images/home-page/chat-heart.png" alt="" />
                    <img className="absolute right-6 bottom-6 w-1/3" src="/images/home-page/wave.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
