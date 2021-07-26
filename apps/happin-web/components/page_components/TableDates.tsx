import { Flex, Text } from "@chakra-ui/react";

const TableDates = ({ date }: any) => {
  return (
    <div className="w-full py-4">
      <button className="btn btn-rose btn-sm float-right !rounded-full" disabled={date.isDisabled}>{date.buttonText}</button>
      <div className="font-bold text-yellow-500 mb-1">{date.date}</div>
      <div className="text-sm font-semibold text-white mb-1">{date.price}</div>
      <div className="text-sm text-gray-400">{date.type}</div>
    </div>
  );
};

export default TableDates;
