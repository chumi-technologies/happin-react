import SvgIcon from '@components/SvgIcon';
import { CloseSmall } from '@icon-park/react';
import React from 'react';

const SignInBar = ({ setIsFirstTimeVisitor }: any) => {
  return (
    <div className="absolute top-0 w-full py-3 sm:py-2 px-6 sm:px-8 md:px-10 lg:px-14 z-30 bg-white text-gray-900">
      <div className="relative flex items-center flex-wrap justify-center">
        <SvgIcon id="ticket-2" className="text-lg mb-2 md:m-0" />
        <div className="ml-3 pr-4 text-center md:text-left mb-3 md:mb-0 md:pr-0">Already have tickets or invitation code? Sign in to check your ticket!</div>
        <button className="btn btn-rose btn-sm !px-6 !rounded-full ml-6 font-semibold">Sign In to continue</button>
        <div className="flex items-center justify-center absolute -right-4 w-8 h-8 rounded-full hover:text-rose-500 transition cursor-pointer" onClick={() => {
          setIsFirstTimeVisitor(false)
        }}>
          <CloseSmall theme="outline" size="22" fill="currentColor" strokeWidth={3}/>
        </div>
      </div>
    </div>
  );
};

export default SignInBar;
