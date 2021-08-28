const PaymentHead = () => {
  return (
    <div className="relative bg-gray-800 border-b border-solid border-gray-700 hidden md:block">
      <div className="container">
        <div className="flex items-center h-20">
          <div className="flex-1 font-semibold min-w-0">
            <div className="truncate">TWRP: Comin' Atcha Live at the Opera House</div>
            <div className="truncate text-sm text-yellow-500">Event starts on Sat, Jul 17, 2021・8 PM</div>
          </div>
          <div className="text-sm text-gray-300">Please check out within <span className="font-medium text-white">5 minutes 51 seconds</span>.</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHead;
