import React, { useState } from 'react';
import { useEffect } from 'react';
import VideoPlayer from '@components/reusable/Video';
import { VideoJsPlayer } from 'video.js';
import IconPark from '@components/IconPark';
import Link from 'next/link';

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
                Unlimited ways to convey your emotion or create fun excuses to
                start a conversation.
              </div>
              <div className="text-base sm:text-xl lg:text-2xl">
                3d stickers can add more realistic animation and apply to your
                friends’ real world.
              </div>
            </div>
            <div className="flex justify-center sm:justify-start sm:w-1/2 mt-8 sm:mt-0">
              <div className="w-full sm:w-4/5 h-full">
                <div className="aspect-w-1 aspect-h-1 w-full">
                  <div className="absolute inset-0 flex items-center rounded-full bg-[#CFE5FF]">
                    <div className="absolute -left-8 flex flex-col justify-center rounded-3xl rounded-l-none xl:rounded-l-3xl pl-8 h-3/5 w-11/12 bg-[#7579C6]">
                      <div className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold mt-6 md:mt-7">
                        What’s up,
                      </div>
                      <div className="text-4xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold mt-1 md:mt-3">
                        buddy?!
                      </div>
                    </div>
                    <img
                      className="absolute left-0 top-0 w-1/3"
                      src="/images/home-page/chat-heart.png"
                      alt=""
                    />
                    <img
                      className="absolute right-6 bottom-6 w-1/3"
                      src="/images/home-page/wave.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative bg-white overflow-hidden z-0">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-center py-10 md:h-56 md:py-8">
            <picture className="absolute -z-[1] inset-0">
              <img
                className="w-full h-[600px] sm:h-full object-cover opacity-70"
                src="/images/home-page/bg-home-banner.svg"
                alt=""
              />
            </picture>
            <div className="flex-1 md:mr-6 text-center md:text-left mb-6 md:mb-0">
              <div className="text-xl font-medium leading-5 mb-2">
                Do you wanna try the next cool thing to interact with your
                friends?
              </div>
              <div className="text-xl font-medium">
                Join the waitlist to get early access.
              </div>
            </div>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-4">
              <button className="btn btn-rose !rounded-full sm:!px-8 sm:!py-4 lg:!px-12 sm:!text-lg lg:!text-xl !font-medium">
                Get early access
              </button>
              <button className="btn btn-bee-yellow !rounded-full sm:!px-8 sm:!py-4 lg:!px-12 sm:!text-lg lg:!text-xl !font-medium">
                Join as 3d designer
              </button>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-gray-900">
        <div className="container divide-y divide-white divide-opacity-20 bg-gray-900">
          <div className="flex flex-col md:flex-row items-center py-16">
            <div className="flex items-center justify-between md:justify-start w-full sm:w-auto flex-1">
              <Link href="/">
                <img className="h-8 mr-16" src="/images/happin-solid-logo.svg" alt="" />
              </Link>
              <div className="flex items-center space-x-3">
                <a
                  className="text-gray-100 hover:text-[#EE1D51]"
                  target="_blank"
                  rel="noreferrer"
                  href="#"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M10.44,9.57c-2.944-0.142-4.991,0.908-6.14,3.149c-1.723,3.362-0.299,8.864,5.45,8.864c5.749,0,5.916-5.556,5.916-6.138c0-0.388,0-2.557,0-6.508c1.23,0.779,2.266,1.248,3.11,1.407c0.844,0.159,1.38,0.229,1.609,0.211V7.317c-0.781-0.094-1.456-0.273-2.025-0.538c-0.854-0.397-2.548-1.498-2.548-3.113c0.001,0.008,0.001-0.409,0-1.249h-3.559c-0.011,7.908-0.011,12.251,0,13.029c0.016,1.167-0.889,2.8-2.725,2.8s-2.741-1.631-2.741-2.683c0-0.644,0.221-1.578,1.136-2.269c0.542-0.41,1.295-0.574,2.516-0.574C10.44,12.341,10.44,11.292,10.44,9.57z"
                    />
                  </svg>
                </a>
                <a
                  className="text-gray-100 hover:text-[#1DA1F2]"
                  target="_blank"
                  rel="noreferrer"
                  href="https://twitter.com/AppHappin"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M2.5,17.881c0.964,0.533,7.946,4.558,12.91,1.456c4.964-3.102,4.69-8.445,4.69-10.894c0.45-0.942,1.4-1.421,1.4-3.971c-0.933,0.862-1.861,1.155-2.782,0.88c-0.903-1.377-2.146-1.986-3.728-1.827c-2.373,0.238-3.241,2.567-2.986,5.579c-3.659,1.85-6.528-1.341-8.007-3.752c-0.494,1.898-0.97,4.177,0,6.698c0.647,1.681,2.202,3.101,4.666,4.263C6.166,17.665,4.112,18.188,2.5,17.881z"
                    />
                  </svg>
                </a>
                <a
                  className="text-gray-100 hover:text-[#1877F2]"
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.facebook.com/HappinEventApp"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M18,6.3h-2.376h-0.631c-0.543,0-0.983,0.44-0.983,0.983v3.45H18l-0.584,3.798H14.01V21.5H9.623v-6.968H6v-3.798h3.576l0.047-3.606L9.616,6.474C9.594,4.301,11.337,2.522,13.51,2.5c0.013,0,0.026,0,0.04,0H18V6.3z"
                    />
                  </svg>
                </a>
                <a
                  className="text-gray-100 hover:text-[#E4405F]"
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.instagram.com/happin.app/"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M17,3c2.209,0,4,1.791,4,4v10c0,2.209-1.791,4-4,4H7c-2.209,0-4-1.791-4-4V7c0-2.209,1.791-4,4-4H17z M12,8c-2.209,0-4,1.791-4,4s1.791,4,4,4s4-1.791,4-4S14.209,8,12,8z M17.5,5.5c-0.552,0-1,0.448-1,1s0.448,1,1,1s1-0.448,1-1S18.052,5.5,17.5,5.5z"
                    />
                  </svg>
                </a>
              </div>
            </div>
            <div className="relative flex items-center w-full sm:w-72 mt-8 sm:mt-10 md:mt-0">
              <input
                type="text"
                className="form-field"
                placeholder="Your email address"
              />
              <button className="py-1 px-3 rounded focus:outline-none border-0 absolute right-2 bg-gray-700 text-white text-sm hover:bg-[#FFDE4B] hover:text-gray-900 transition font-medium">Send</button>
            </div>
          </div>
          <div className="py-6 text-sm text-gray-400">
            © 2021 Happin. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
