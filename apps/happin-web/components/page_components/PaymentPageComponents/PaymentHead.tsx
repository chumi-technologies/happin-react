import { useCheckoutState } from 'contexts/checkout-state';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Countdown from 'react-countdown';


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
          <div className="flex-1 font-semibold min-w-0 pb-3 md:p-0 border-b md:border-b-0 border-solid border-white border-opacity-20">
            <div className="text-lg leading-5 mb-1 md:truncate">{eventDataForCheckout?.title}</div>
            <div className="md:truncate text-sm text-yellow-500">Event starts on {moment(eventDataForCheckout?.startTime).format('MMMM Do, h:mma')}</div>
          </div>
          <div className="text-sm text-gray-300 py-3">Please check out within <span className="font-medium text-white">
            
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
  );
};

export default PaymentHead;
