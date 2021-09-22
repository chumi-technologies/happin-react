import { useCheckoutState } from 'contexts/checkout-state';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { Left } from '@icon-park/react';
import Link from 'next/link';


const PaymentHead = ({
  countdownCompleted,
 }:{
  countdownCompleted: (arg:any)=>void
  }
  ) => {
  const { eventDataForCheckout } = useCheckoutState();
  const [ timer,setTimer ] = useState<number>(420000);
  const renderer = ({ minutes, seconds }:any) => {
    return <span>{minutes}:{seconds}</span>;
  };
  // const [timer, setTimer] = useState<number>(111420000);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer => timer - 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative md:bg-gray-800 md:border-b border-solid border-gray-700">
      <div className="container">
        <div className="md:flex md:items-center md:h-20">
          <div className="flex-1 min-w-0 md:flex md:items-center">
            <div className="flex items-center flex-1 min-w-0 pt-5 md:pt-0 pb-3 md:p-0 border-b md:border-b-0 border-solid border-white border-opacity-20">
              <Link href="/checkout/612837057b14e585278f4329">
                <button className="btn inline-flex items-center text-gray-300 hover:text-white !px-0 mr-5 md:mr-7">
                  <Left theme="outline" size="24" fill="currentColor"/>
                  <span className="md:ml-2">Back</span>
                </button>
              </Link>
              <div className="font-semibold mr-4">
                <div className="text-lg leading-5 mb-1 md:truncate">{eventDataForCheckout?.title}</div>
                <div className="md:truncate text-sm text-yellow-500">Event starts on {moment(eventDataForCheckout?.startTime).format('MMMM Do, h:mma')}</div>
              </div>
            </div>
            <div className="text-sm text-gray-300 py-3 md:max-w-xs lg:max-w-none">Please check out within <span className="font-medium text-white">

          {/*<Countdown date={Date.now() + 420000} renderer={renderer} />*/}
              <Countdown
                controlled = {true}
                onComplete = {countdownCompleted}
                date = {timer}
                renderer={renderer}
              />
          </span>. <h3>Do not refresh or close this page as your reserved items will be lost</h3></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHead;
