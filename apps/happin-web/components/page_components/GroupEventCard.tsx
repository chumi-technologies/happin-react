import { Flex, Text } from "@chakra-ui/react";
import { GroupEvent } from "lib/model/groupEvent";
import moment from "moment";

type GroupEventCardProp = {
  groupEvent?: GroupEvent;
}

const GroupEventCard = ({ groupEvent }: GroupEventCardProp) => {
  return (
    <div className="w-full py-4">
      <button className="btn btn-rose btn-sm float-right !rounded-full" disabled={groupEvent?.soldOut}>{groupEvent?.soldOut ? "Sold Out" : "Get Tickets"}</button> 
      <div className="font-bold text-yellow-500 mb-1">
        {moment.utc(groupEvent?.startTime).tz(moment.tz.guess()).format('ddd MMM D ・ H:mm A z')}
      </div>
      {groupEvent?.price && (
        <div className="text-sm font-semibold text-white mb-1">{groupEvent?.price}</div>
      )}
      <div className="text-sm text-gray-400">{groupEvent?.contentPlainText}</div>
    </div>
  );
};

export default GroupEventCard;
