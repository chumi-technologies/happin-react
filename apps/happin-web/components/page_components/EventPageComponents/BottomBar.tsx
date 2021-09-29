import SvgIcon from '@components/SvgIcon';
import { EventData } from 'lib/model/event';
import { useRouter } from 'next/router';

interface eventDataProp {
  eventData: EventData
  setIsChatButtonOpen: (arg: any)=>void,
  queryParams: any
}
const BottomBar = ({eventData, setIsChatButtonOpen, queryParams}: eventDataProp) => {
  const router = useRouter();
  const isSoldOut = eventData.isTicketSoldOut;

  const offSaleTimeHasPast = (eventData: EventData): boolean => {
    if (eventData?.event?.acInfo?.offSaleSetting?.offSaleTime) {
      return new Date(eventData.event.acInfo.offSaleSetting.offSaleTime).getTime() < new Date().getTime();
    } 
    return false
  }

  const checkOffLineEventStarted = (eventData: EventData): boolean => {
    if (eventData?.event?.acInfo?.location !== 'happin.app' && !eventData.event.streamEnabled) {
      return new Date(eventData.event.start_datetime).getTime() < new Date().getTime();
    } else {
      return false
    }
  }

  return (
    <div className="footer-action fixed lg:sticky bottom-0 right-0 w-full bg-gray-800 z-40">
      <div className="event-details__container flex py-3 sm:py-4">
        <button onClick={()=>{setIsChatButtonOpen((x: boolean)=> x = !x)}} className="btn btn-yellow !px-0 !font-semibold !rounded-full flex items-center justify-center flex-1">
          <SvgIcon id="chat" className="text-lg text-gray-900 mr-1 sm:mr-2" />
          <span className="text-sm sm:text-base">Chat with Fans</span>
        </button>
        {!offSaleTimeHasPast(eventData) &&  <button disabled={isSoldOut || checkOffLineEventStarted(eventData)} onClick={()=>{router.push({pathname:`/checkout/${eventData.event.eid}`, query: queryParams})}} className="btn btn-rose !px-0 !font-semibold !rounded-full flex items-center justify-center flex-1 ml-3">
          <SvgIcon id="ticket" className="text-lg text-white mr-1 sm:mr-2" />
          <span className="text-sm sm:text-base">{isSoldOut ? "Sold Out" :checkOffLineEventStarted(eventData) ? "Event Started" : "Get Tickets"}</span>
        </button>}

        {offSaleTimeHasPast(eventData) && <button disabled={true} className="btn btn-rose !px-0 !font-semibold !rounded-full flex items-center justify-center flex-1 ml-3">
          <SvgIcon id="ticket" className="text-lg text-white mr-1 sm:mr-2" />
          <span className="text-sm sm:text-base">{eventData.event.acInfo.offSaleSetting?.offSaleText}</span>
        </button>}
      </div>
    </div>
  );
};

export default BottomBar;
