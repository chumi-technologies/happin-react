import { useCheckoutState } from 'contexts/checkout-state';
import moment from 'moment';

const PaymentHead = () => {
  const { eventDataForCheckout } = useCheckoutState();
  return (
    <div className="relative bg-gray-800 border-b border-solid border-gray-700 hidden md:block">
      <div className="container">
        <div className="flex items-center h-20">
          <div className="flex-1 font-semibold min-w-0">
            <div className="truncate">{eventDataForCheckout?.title}</div>
            <div className="truncate text-sm text-yellow-500">Event starts on {moment(eventDataForCheckout?.startTime).format('MMMM Do, h:mma')}</div>
          </div>
          <div className="text-sm text-gray-300">Please check out within <span className="font-medium text-white">5 minutes 51 seconds</span>.</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHead;
