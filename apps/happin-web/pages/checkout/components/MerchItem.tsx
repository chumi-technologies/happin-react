import React from 'react';
import { MerchItemDataProps } from '../data';

export type MerchItemProps = {
  data: MerchItemDataProps;
  onSelect?: (data: any) => void;
}

const MerchItem = (props: MerchItemProps) => {
  const { data, onSelect } = props;
  return (
    <div className="bg-gray-800 p-2 sm:p-3 rounded-lg">
      <div className="aspect-w-1 aspect-h-1">
        <img src={data.cover} alt={data.title} className="w-full h-full object-center object-cover rounded-md" />
      </div>
      <div className="font-medium text-sm mt-3 mb-1">{data.price}</div>
      <div className="font-medium text-xs">{data.title}</div>
      <div className="text-xs text-gray-400 truncate mb-3">{data.introduction}</div>
      <button
        className="btn checkout__merch-select"
        disabled={data.soldOut}
        onClick={() => onSelect?.(data)}
      >
        Select
      </button>
    </div>
  );
};

export default MerchItem;
