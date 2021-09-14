import { useCheckoutState } from 'contexts/checkout-state';
import moment from 'moment';
import Countdown from 'react-countdown';


const PaymentHead = ({ 
  countdownCompleted,
  date
 }:{
  countdownCompleted: (arg:any)=>void,
  date:number
  }
  ) => {
  const { eventDataForCheckout } = useCheckoutState();
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
            date = {date}
          />
          </span>.</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHead;
