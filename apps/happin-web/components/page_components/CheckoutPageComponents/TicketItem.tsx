import React from 'react';
import NumberInput from '@components/reusable/NumberInput';
import { HStack, Tooltip } from '@chakra-ui/react';
import SvgIcon from '@components/SvgIcon';
import { ETicketType, TicketItemDataProps, TicketItemFeaturesProps } from '../../../lib/model/checkout';
import classNames from 'classnames';
import { useCheckoutState } from 'contexts/checkout-state';
import { increaseTicketAmount } from './util/IncreseInput';
import { decreaseTicketAmount } from './util/decreseInput';
import moment from 'moment';
import { currencyFormatter } from './util/currencyFormat';

export type TicketItemProps = {
  data: TicketItemDataProps;
  onSelect: (data: any) => void;
  disabled?: boolean,
  currency: string,
  absorbFee: boolean,
  taxNeeded: number
  setCartPopoverMsg: (arg: any)=> void
  discountCodeApplied: {appliedTo: Array<string>, discount: number, method: string, appliedToAll: boolean} | undefined
}

const TicketItem = (props: TicketItemProps) => {
  const { data, onSelect, currency, absorbFee = false, taxNeeded, disabled = false, setCartPopoverMsg, discountCodeApplied } = props;
  const { cart, addItem, removeItem, dispatchTicketListAction } = useCheckoutState();
  const ticketEditingIndex = cart.items.ticketItem.findIndex(item=>item.ticketId === data.id);

  // the input number is read from Cart , so the max input must use original quantity,
  // (quantity will keep decreasing as item add to cart, if quantity is used here,
  // the max will never reach the correct amount)
  const getMaxNumberInputQty = () => {
    if (data?.originalQuantity > data?.maxPerOrder) {
      return data?.maxPerOrder
    } else {
      return data?.originalQuantity;
    }
  }

  const renderDiscountNumberFromUrlCode = () => {
    if (discountCodeApplied && (discountCodeApplied.appliedTo && discountCodeApplied.appliedTo.includes(data.id) || discountCodeApplied.appliedToAll)) {
      if (discountCodeApplied.method === 'percentage') {
        return <span className="text-yellow-500 text-sm">&nbsp;  {discountCodeApplied.discount}% off per ticket at checkout</span>
      } else {
        const offValue = currencyFormatter(currency as string).format(discountCodeApplied.discount);
        return <span  className="text-yellow-500 text-sm">&nbsp;  {offValue} off per ticket at checkout</span>
      }
    } else {
      return <></>
    }
  }

  return (
    <div className="py-5 sm:py-8">
      <div className="flex items-start media-sm">
        <div className="flex-1 mr-2">
          <div className="sm:text-lg leading-none mb-1 font-semibold text-white">{data.title}</div>
          <div className="font-medium text-xs text-gray-400">
            <span className="text-white text-sm">{currencyFormatter(currency as string).format(data.price)}</span>
            {data.price!==0 && (taxNeeded  ? <span className="ml-1">{absorbFee ? '+ Tax' : '+ Tax + Fee'}</span> : <span className="ml-1">{absorbFee ? '' : '+ Fee'}</span>)}
            {renderDiscountNumberFromUrlCode()}
          </div>
          {(typeof data.start === 'number' && typeof data.end === 'number') && <div className="text-gray-400 text-xs">On sale from: {moment(data.start * 1000).format('MMMM Do, h:mma')} ~ {moment(data.end * 1000).format('MMMM Do, h:mma')}</div>}
        </div>
        {(data.originalQuantity <= 0 || data.originalQuantity < data.minPerOrder) ? <p style={{textAlign: 'center'}} className="btn checkout__ticket-select !w-auto whitespace-nowrap">SOLD OUT</p>
        : (
          data.merch ?
            <button
              onClick={() => onSelect(data)}
              className="btn checkout__ticket-select"
              disabled={ disabled || ((typeof data.start === 'number' && typeof data.end === 'number' ) && !(moment(new Date()).isBetween(moment(data.start * 1000), moment(data.end * 1000))))}
            >
              Select
            </button> :
            <NumberInput
              min={0}
              max={getMaxNumberInputQty()}
              value = {cart?.items?.ticketItem[ticketEditingIndex]?.quantity || 0}
              onDecreaseClick = {()=>{decreaseTicketAmount(data, cart, data.id, dispatchTicketListAction, removeItem)}}
              onIncreaseClick = {()=>{increaseTicketAmount(data, cart, data.id, dispatchTicketListAction, addItem); setCartPopoverMsg({show: true})}}
              // disabled if  1. out side the ticket sale time range, 2.the prop disblaed is pass in
              isDisabled={ disabled || ((typeof data.start === 'number' && typeof data.end === 'number' ) && !(moment(new Date()).isBetween(moment(data.start * 1000), moment(data.end * 1000)))) }
            />
        )}

      </div>
      <HStack mt={2}>
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
        data.notes && <div className="text-white text-xs sm:text-sm mt-2">{data.notes}</div>
      }
      {
        data.ticketType === ETicketType.PFM && (
          <div>
              <a href='https://help.happin.app/en/articles/4891884-what-is-vip-fan-meeting' rel="noreferrer" target='_blank'
              className="inline-block text-white font-medium text-xs cursor-pointer underline hover:text-rose-500">What’s
                VIP room?</a>
          </div>
        )
      }
{/*       {
        data.merch && (
          <div className="inline-flex items-center text-blue-500 font-medium text-sm">
            <span className="mr-1 cursor-pointer hover:mr-2 transition-margin">Merch Details</span>
            <Right theme="outline" size="16" fill="currentColor" />
          </div>
        )
      } */}
    </div>
  );
};

export default TicketItem;
