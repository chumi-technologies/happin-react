import React from 'react';
import { MerchItemDataProps } from '../../../lib/model/checkout';
import { currencyFormatter } from './util/currencyFormat';

export type MerchItemProps = {
  data: MerchItemDataProps;
  onSelect?: (data: any) => void;
  disabled: boolean,
  currency: string
}

const MerchItem = (props: MerchItemProps) => {
  const { data, onSelect, disabled = false, currency } = props;
  return (
    <div className="bg-gray-800 p-2 sm:p-3 rounded-lg">
      <div className="aspect-w-1 aspect-h-1" style={{height:'150px'}}>
        <img src={data.image[0]} alt={data.name} className="w-full h-full object-center object-cover rounded-md" />
      </div>
      <div className="font-medium text-sm mt-3 mb-1">{currencyFormatter(currency as string).format(data.price)}</div>
      <div className="font-medium text-xs">{data.name}</div>
      <div className="text-xs text-gray-400 truncate mb-3">{data.description}</div>
      <button
        className="btn checkout__merch-select"
        disabled={disabled}
        onClick={() => onSelect?.(data)}
      >
        Select
      </button>
    </div>
  );
};

export default MerchItem;
