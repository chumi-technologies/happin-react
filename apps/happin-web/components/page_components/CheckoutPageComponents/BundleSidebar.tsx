import React, { useState } from 'react';
import SvgIcon from '@components/SvgIcon';
import { Check, CloseSmall } from '@icon-park/react';
import Merch from './Merch';
import Select from '@components/reusable/Select';
import NumberInput from '@components/reusable/NumberInput';
import classNames from 'classnames';
import { MerchItemDataProps, TicketItemDataProps } from 'lib/model/checkout';
import { useCheckoutState } from 'contexts/checkout-state';
import { useEffect } from 'react';
import { increaseBundleTicketAmount } from './util/IncreseInput';
import { currencyFormatter } from './util/currencyFormat';


type CheckoutSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  merchs: MerchItemDataProps[],
  ticket: TicketItemDataProps,
  setIsOpen: (arg: any) => void,
  setCartPopoverMsg: (arg: any) => void
}

const BundleSidebar = (props: CheckoutSidebarProps) => {
  const { isOpen, setIsOpen, onClose, merchs, ticket, setCartPopoverMsg } = props;
  const { eventDataForCheckout, addItem, dispatchMerchListAction, dispatchTicketListAction } = useCheckoutState();
  const [inputValue, setInputValue] = useState(0)

  // array of the selected merchs property name inside this bundle 
  // (eg. ['small', 'medium'] means 'small' is the selected property 
  // for first mech with property name 'small' and so on
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);

  useEffect(() => {
    if (merchs) {
      const init: string[] = Array(merchs.length);
      merchs.forEach((m, index) => {
        // the init array should be the 0 property index of every merch
        init[index] = m.property[0].pName
      })
      setSelectedProperties(init)
    }
  }, [merchs])

  useEffect(() => {
    if (isOpen === false) {
      setInputValue(0);
    }
  }, [isOpen])

  const alterSelectedProperties = (outerIndex: number, data: any) => {
    setInputValue(0)
    setSelectedProperties(s => {
      const newSelectedProperties = [...s];
      newSelectedProperties[outerIndex] = data.label
      return newSelectedProperties
    })
  }

  /*   const getMaxAllowNumber = ()=> {
      let maxAllowNumber = 0;
      //let propertyMin = 0;
     // let maxPerOrder = 0;
      if (merchs && merchs.length && selectedProperties && selectedProperties.length) {
        // from the merch list, get the selected properties , then optain the min pValue among them
        //const selectedProperty = merchs.map((m, index)=> m.property.find(p=>p.pName === selectedProperties[index]));
        //const values = selectedProperty.map(p=>{return p?.pValue || 0});
        //propertyMin = Math.min(...values);
        
        // get merch list max per order list, then obtain the min value among them
        // const maxPerOrderList = merchs.map(m=>m.max);
        // maxPerOrder = Math.min(...maxPerOrderList);
  
        // finally compare propertyMin & ticket.quantity, reassign maxAllowNumber
        // maxAllowNumber = Math.min(propertyMin, ticket.quantity);
  
      }
      maxAllowNumber = ticket.quantity;
      return maxAllowNumber
    } */

  // the input number is not read from Cart , so the max number can use quantity,
  // quantity or cart will not change when the number input changed, it will only changed when the 
  // add to cart button is clicked
  const getMaxTicketNumberInputQty = (data: TicketItemDataProps) => {
    if (data?.quantity > data?.maxPerOrder) {
      return data?.maxPerOrder
    } else {
      return data?.quantity;
    }
  }

  const checkSoldOut = () => {
    let soldOut = false;
    if (ticket?.originalQuantity === 0) soldOut = true;
    return soldOut;
  }

  const addBundleButtonHandler = () => {
    if (!inputValue) {
      return
    }
    increaseBundleTicketAmount(ticket, merchs, dispatchTicketListAction, dispatchMerchListAction, inputValue, addItem, selectedProperties);
    setIsOpen((s: boolean) => !s);
    setInputValue(0)
    setSelectedProperties([]);
    setCartPopoverMsg({ show: true });
  }

  const increaseBundleAmount = () => {
    if (ticket.quantity >= 1) {
      if (inputValue !== 0) {
        setInputValue(s => s + 1)
        return
      }
      if (ticket.quantity >= ticket.minPerOrder) {
        setInputValue(ticket.minPerOrder)
      }
    }
  }

  const decreaseBundleAmount = () => {
    if (inputValue === ticket.minPerOrder) {
      setInputValue(0)
    } else {
      setInputValue(s => s - 1)
    }
  }

  return (
    <div className={classNames('checkout__sidebar', { 'open': isOpen })}>
      <div className="flex flex-col flex-1 h-0">
        <div className="px-5 sm:px-6">

          <div className="relative flex items-start py-4 sm:py-6 border-b border-solid border-gray-700">
            <div className="w-full pr-7">
              <div className="leading-none mb-2 font-semibold text-white">{ticket?.title}</div>
              <div className="font-medium text-xs text-gray-400">
                <span className="text-white text-sm">{currencyFormatter(eventDataForCheckout?.default_currency as string).format(ticket?.price)}</span>
                {/*  {generalTicketInfo && (
                  generalTicketInfo.taxNeeded ? <span className="text-white text-sm">{eventDataForCheckout?.default_currency} {ticket?.price} {generalTicketInfo.absorbFee ? '+ Tax' : '+ Tax, + Fee'}</span>
                    : <span className="text-white text-sm">{currencyFormatter(eventDataForCheckout?.default_currency as string).format(ticket?.price)} {generalTicketInfo.absorbFee ? '' : '+ Fee'}</span>)} */}
              </div>
              <div className="text-gray-400 text-xs">{ticket?.notes}</div>
            </div>
            <div
              className="absolute -right-2 top-4 flex items-center justify-center w-8 h-8 rounded-full hover:text-rose-500 transition cursor-pointer"
              onClick={() => { onClose(); setInputValue(0); setSelectedProperties([]) }}>
              <CloseSmall theme="outline" size="22" fill="currentColor" strokeWidth={3} />
            </div>
          </div>
        </div>
        <div className="flex-1 h-0 web-scroll overflow-y-auto px-5 sm:px-6">

          <div className="flex items-center text-green-500 font-bold uppercase py-5">
            <Check theme="outline" size="16" fill="currentColor" strokeWidth={6} />
            <span className="ml-2 text-sm">Bundle includes:</span>
          </div>
          {
            merchs && merchs.map((item, i) => (
              <div className="checkout__goods-item" key={i}>
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-md overflow-hidden">
                  <Merch
                    // @ts-ignore
                    imgList={item.image.map(i => ({ src: i, loading: 'lazy', alt: item.name }))}
                  />
                </div>
                <div className="flex-1 min-w-0 ml-5">
                  <div className="text-white font-semibold mb-1">{item.name}</div>
                  <div className="text-gray-400 text-tiny mb-3">{item.description}</div>
                  {
                    // isOpen is added here to ensure the select component is reset after close 
                    (item.property && isOpen) && (
                      <Select
                        data={item.property.map((p, j) => {
                          return {
                            value: p.pValue,
                            label: p.pName,
                            disabled: p.originalPValue <= 0,
                            index: j
                          }
                        })}
                        onChange={(data) => {
                          alterSelectedProperties(i, data)
                        }}
                      />
                    )
                  }
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <div className="flex items-center px-5 sm:px-6 py-4 border-t border-solid border-gray-700">
        <NumberInput min={0} max={getMaxTicketNumberInputQty(ticket)} value={inputValue}
          onDecreaseClick={() => decreaseBundleAmount()}
          onIncreaseClick={() => increaseBundleAmount()}
        />
        <div className="flex-1 ml-4 sm:ml-6">
          {checkSoldOut() ? <button className="btn btn-rose h-11 !py-0 !px-0 !font-semibold flex items-center justify-center w-full">
            <SvgIcon id="buy" disabled className="text-lg text-white mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">SOLD OUT</span>
          </button> : <button onClick={addBundleButtonHandler} className="btn btn-rose h-11 !py-0 !px-0 !font-semibold flex items-center justify-center w-full">
            <SvgIcon id="buy" className="text-lg text-white mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Add to Cart</span>
          </button>}

        </div>
      </div>
    </div>
  );
};

export default BundleSidebar;
