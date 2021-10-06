import { GroupEvent } from "lib/model/groupEvent";
import moment from "moment";
import { useRouter } from 'next/router'
import { currencyFormatter } from "../CheckoutPageComponents/util/currencyFormat";

type GroupEventCardProp = {
  groupEvent: GroupEvent;
  setIsModalOpen: (arg0: boolean)=>void
}

const GroupEventCard = ({ groupEvent, setIsModalOpen }: GroupEventCardProp) => {

  const router = useRouter();

  const getTicket = () => {
    router.push(`/post/${groupEvent?._id}`)
    setIsModalOpen(false)
  }

  return (
    <div className="w-full py-4">
      <button onClick={getTicket} className="btn btn-rose btn-sm float-right !rounded-full" disabled={groupEvent?.soldOut}>{groupEvent?.soldOut ? "Sold Out" : "Get Tickets"}</button>
      <div className="font-bold text-yellow-500 mb-1">
        {moment.utc(groupEvent?.startTime).tz(moment.tz.guess()).format('ddd MMM D ・ H:mm A z')}
      </div>
      {(groupEvent?.price !== null && groupEvent?.price !== undefined) && (
        <div className="text-sm font-semibold text-white mb-1">{`Price from ${currencyFormatter(groupEvent.default_currency as string).format(groupEvent.price)}`}</div>
      )}
      <div className={`text-sm text-gray-400 ${(groupEvent?.contentPlainText?.length < 80)? "" : "truncate"}`}>{groupEvent?.contentPlainText}</div>
    </div>
  );
};

export default GroupEventCard;
