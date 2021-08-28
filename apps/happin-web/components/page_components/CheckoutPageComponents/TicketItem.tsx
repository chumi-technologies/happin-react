import React from 'react';
import NumberInput from '@components/reusable/NumberInput';
import { HStack, Tooltip } from '@chakra-ui/react';
import SvgIcon from '@components/SvgIcon';
import { ETicketType, TicketItemDataProps, TicketItemFeaturesProps } from '../../../lib/model/checkout';
import classNames from 'classnames';
import { Right } from '@icon-park/react';
import Link from 'next/link';
import { useCheckoutState } from 'contexts/checkout-state';
import { TicketListAction } from 'pages/checkout/[event_id]';
import { increaseTicketAmount } from './util/IncreseInput';
import { decreaseTicketAmount } from './util/decreseInput';

export type TicketItemProps = {
  data: TicketItemDataProps;
  onSelect?: (data: any) => void;
  onChange: (data: TicketListAction)=> void
}

const TicketItem = (props: TicketItemProps) => {
  const { data, onSelect, onChange } = props;
  const { cart, addItem, removeItem } = useCheckoutState();

  const ticketEditingIndex = cart.items.ticketItem.findIndex(item=>item.ticketId === data.id);

/*   function decrease(data: TicketItemDataProps) {
    if (cart.items.ticketItem.length) {
      if (cart.items.ticketItem[ticketEditingIndex] && cart.items.ticketItem[ticketEditingIndex].quantity === 0) {
        return
      }
      //setCurrentAmount(s => s-1)
      onChange({type:ActionKind.Increase, payload:data, quantity:1})
      removeItem(data, 1);
    }
  } */
/*   function increase(data: TicketItemDataProps) {
    if (data.quantity >= 1) {
      if (cart.items.ticketItem.length) {
        if (cart.items.ticketItem[ticketEditingIndex] && cart.items.ticketItem[ticketEditingIndex].quantity + 1 > maxPerOrder) {
          return
        } else if (!cart.items.ticketItem[ticketEditingIndex]) {
          onChange({type:ActionKind.Decrease, payload:data, quantity: minPerOrder})
          addItem(data, minPerOrder );
        } else {
          onChange({type:ActionKind.Decrease, payload:data, quantity: 1})
          addItem(data, 1);
        }
      } else {
        onChange({type:ActionKind.Decrease, payload:data, quantity: minPerOrder})
        addItem(data, minPerOrder );
      }
    }
  } */

  return (
    <div className="py-5 sm:py-8">
      <div className="flex items-start media-sm">
        <div className="flex-1">
          <div className="sm:text-lg leading-none mb-1 font-semibold text-white">{data.title}</div>
          <div className="font-medium text-xs text-gray-400">
            <span className="text-white text-sm">{data.price}</span>
            {
              data.subPrice && data.subPrice.map((item: string, index) => (
                <span className="ml-1" key={index}>+ {item}</span>
              ))
            }
          </div>
          <div className="text-gray-400 text-xs">{data.startTime?.toDateString()}</div>
        </div>
        {
          props.data.merch  ?
            <button
              onClick={() => onSelect?.(data)}
              className="btn checkout__ticket-select"
              disabled={data.quantity <= 0}
            >
              Select
            </button> :
            <NumberInput
              onChange={(value) => {
                onSelect?.(value)
              }}
              value = {cart?.items?.ticketItem[ticketEditingIndex]?.quantity || 0}
              onDecreaseClick = {()=>{decreaseTicketAmount(data, cart, ticketEditingIndex, onChange, removeItem)}}
              onIncreaseClick = {()=>{increaseTicketAmount(data, cart, ticketEditingIndex, onChange, addItem)}}
              isDisabled={data.originalQuantity <= 0}
            />
        }
      </div>
      <HStack my={2}>
        {
          data.features && data.features.map((item: TicketItemFeaturesProps, index) => (
            <Tooltip
              key={index}
              hasArrow
              label={item.tooltip}
              placement="bottom-start"
              py={2}
              px={3}
              offset={[0, 10]}
              borderRadius="lg" bg="gray.700"
            >
              <div className={classNames('checkout__ticket-tag', item.type)}>
                <SvgIcon id={`${item.type}-bold`} className="text-sm" />
              </div>
            </Tooltip>
          ))
        }
      </HStack>
      {
        data.introduction && <div className="text-white text-xs sm:text-sm">{data.introduction}</div>
      }
      {
        data.ticketType === ETicketType.PFM && (
          <div>
            <Link href="/">
              <a className="inline-block text-white font-medium text-xs cursor-pointer underline hover:text-rose-500">What’s
                VIP room?</a>
            </Link>
          </div>
        )
      }
      {
        data.merch && (
          <div className="inline-flex items-center text-blue-500 font-medium text-sm">
            <span className="mr-1 cursor-pointer hover:mr-2 transition-margin">Merch Details</span>
            <Right theme="outline" size="16" fill="currentColor" />
          </div>
        )
      }
    </div>
  );
};

export default TicketItem;
