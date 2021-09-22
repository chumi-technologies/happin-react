import { useCheckoutState } from 'contexts/checkout-state';
import React from 'react';
import { ETicketVisibility, MerchItemDataProps } from '../../../lib/model/checkout';
import { currencyFormatter } from './util/currencyFormat';

export type MerchItemProps = {
  data: MerchItemDataProps;
  onSelect?: (data: any) => void;
  disabled: boolean,
  currency: string
}

const MerchItem = (props: MerchItemProps) => {
  const { data, onSelect, disabled = false, currency } = props;
  const { cart, ticketListState } = useCheckoutState();

  const checkOptionalMerchEligible = () => {
    if (data.isOptionalBundleItem) {
      let hasRelatedTicketInCart = false
      cart.items.ticketItem.some(t => data.tickets.includes(t.ticketId)) ? hasRelatedTicketInCart = true : hasRelatedTicketInCart = false;
      if (!hasRelatedTicketInCart) cart.items.bundleItem.some(t=> data.tickets.includes(t.ticketId)) ? hasRelatedTicketInCart = true : hasRelatedTicketInCart = false;
      return hasRelatedTicketInCart
    } else {
      return true
    }
  }

  const getEligibleTicketNames = () => {
    // .filter(t => t.visibility !== ETicketVisibility.INVISIBLE && t.visibility !== ETicketVisibility.HIDDEN)
    return ticketListState.reduce((acc: string[], cur) => {
      if (data.tickets.includes(cur.id)) {
        acc.push(cur.title);
      }
      return acc;
    }, [])
  }

  return (
    <div className="bg-gray-800 p-2 sm:p-3 rounded-lg">
      <div className="aspect-w-1 aspect-h-1" style={{ height: '150px' }}>
        <img src={data.image[0]} alt={data.name} className="w-full h-full object-center object-cover rounded-md" />
      </div>
      <div className="font-medium text-sm mt-3 mb-1">{currencyFormatter(currency as string).format(data.price)}</div>
      <div className="font-medium text-xs">{data.name}</div>
      <div className="text-xs text-gray-400 truncate mb-3">{data.description}</div>
      {checkOptionalMerchEligible() ? <button
        className="btn checkout__merch-select"
        disabled={disabled}
        onClick={() => onSelect?.(data)}
      >
        Select
      </button> : <span className="text-xs text-gray-400">
        Eligible for ticket(s): {
          getEligibleTicketNames().map((item, index) => <span style={{ display: 'block', fontWeight: 600 }} className="text-sm mb-1 text-gray-400 " key={item + index}>{item},</span>)
        }
      </span>}
    </div>
  );
};

export default MerchItem;
