import SvgIcon from '@components/SvgIcon';

const BottomBar = () => {
  return (
    <div className="footer-action fixed lg:sticky bottom-0 right-0 w-full bg-gray-800 z-40">
      <div className="event-details__container flex py-3 sm:py-4">
        <button className="btn btn-yellow !px-0 !font-semibold !rounded-full flex items-center justify-center flex-1">
          <SvgIcon id="chat" className="text-lg text-gray-900 mr-1 sm:mr-2" />
          <span className="text-sm sm:text-base">Chat with Fans</span>
        </button>
        <button className="btn btn-rose !px-0 !font-semibold !rounded-full flex items-center justify-center flex-1 ml-3">
          <SvgIcon id="ticket" className="text-lg text-white mr-1 sm:mr-2" />
          <span className="text-sm sm:text-base">Get Tickets</span>
        </button>
      </div>
    </div>
  );
};

export default BottomBar;
