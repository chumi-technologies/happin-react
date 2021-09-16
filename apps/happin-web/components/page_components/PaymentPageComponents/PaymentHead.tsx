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
  // const [timer, setTimer] = useState<number>(111420000);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer => timer - 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-gray-800 border-b border-solid border-gray-700 hidden md:block">
      <div className="container">
        <div className="flex items-center h-20">
          <div className="flex-1 font-semibold min-w-0">
            <div className="truncate">{eventDataForCheckout?.title}</div>
            <div className="truncate text-sm text-yellow-500">Event starts on {moment(eventDataForCheckout?.startTime).format('MMMM Do, h:mma')}</div>
          </div>
          <div className="text-sm text-gray-300">Please check out within <span className="font-medium text-white">
          {/*<Countdown date={Date.now() + 420000} renderer={renderer} />*/}
          <Countdown
            controlled = {true}
            onComplete = {countdownCompleted}
            date = {timer}
          />
          </span>.</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHead;
