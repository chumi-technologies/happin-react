import React, { useEffect } from 'react';
import SvgIcon from '@components/SvgIcon';
import { CloseSmall } from '@icon-park/react';
import Merch from './Merch';
import Select from '@components/reusable/Select';
import NumberInput from '@components/reusable/NumberInput';
import classNames from 'classnames';
import { MerchItemDataProps } from 'lib/model/checkout';
import { useState } from 'react';
import { useCheckoutState } from 'contexts/checkout-state';
import { increaseMerchAmount } from './util/IncreseInput';

type CheckoutSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  merch: MerchItemDataProps,
  setIsOpen: (arg: any)=>void,
  setCartPopoverMsg: (arg: any)=> void
}

const MerchSidebar = (props: CheckoutSidebarProps) => {
  const { isOpen, onClose, merch, setIsOpen, setCartPopoverMsg } = props;
  const { addItem, dispatchMerchListAction } = useCheckoutState();
  //const [merchEditingIndex, setMerchEditingIndex] = useState(0);

  const [inputValue, setInputValue] = useState(0)

  const [selectedPropertyIndex, setSelectedPropertyIndex] = useState(0);

  useEffect(()=> {
    if (isOpen === false) {
      setInputValue(0);
      setSelectedPropertyIndex(0)
    }
  }, [isOpen])

  const addMerchButtonHandler = () => {
    if (!inputValue) {
      return
    }
    increaseMerchAmount(merch, dispatchMerchListAction, addItem, merch?.property[selectedPropertyIndex]?.pName, inputValue);
    setIsOpen((s:boolean)=>!s);
    setInputValue(0)
    setSelectedPropertyIndex(0);
    setCartPopoverMsg({show: true})
  }

   // the input number is not read from Cart , so the max input can be quantity,
  // quantity or cart will not change when the number input changed, it will only changed when the
  // add to cart button is clicked
  const getMaxNumberInputQty = () => {
    if (merch?.property[selectedPropertyIndex]?.pValue > merch?.max) {
      return merch?.max
    } else {
      return merch?.property[selectedPropertyIndex]?.pValue
    }
  }

  return (
    <div className={classNames('checkout__sidebar footer-action', { 'open': isOpen })}>
      <div className="flex flex-col flex-1 h-0">
        <div className="px-5 sm:px-6">
          <div className="relative flex items-start py-6">
            <div className="w-full pr-7">
              <div className="leading-none font-semibold text-white">Merch Details</div>
            </div>
            <div
              className="absolute -right-2 top-4 flex items-center justify-center w-8 h-8 rounded-full hover:text-rose-500 transition cursor-pointer"
              onClick={()=>{onClose(); setInputValue(0); setSelectedPropertyIndex(0)}}>
              <CloseSmall theme="outline" size="22" fill="currentColor" strokeWidth={3} />
            </div>
          </div>

        </div>
        <div className="flex-1 h-0 web-scroll overflow-y-auto px-5 sm:px-6">
          <div className="checkout__goods-item">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-md overflow-hidden">
              {merch?.image && <Merch
                // @ts-ignore
                imgList={merch.image.map(i => ({ src: i, loading: 'lazy', alt: merch.name }))}
              />}

            </div>
            <div className="flex-1 min-w-0 ml-5">
              <div className="text-white font-semibold mb-1">{merch?.name}</div>
              <div className="text-gray-400 text-tiny mb-3">{merch?.description}</div>
              {
                // isOpen is added here to ensure the select component is reset after close
                (merch?.property && isOpen) && (
                  <Select
                    data={merch.property.map((p,index) => ({ label: p.pName, value: p.pValue, index }))}
                    onChange={data => {
                      setSelectedPropertyIndex(data.index)
                      setInputValue(0)
                    }}
                  />
                )
              }
              <br />
              <NumberInput
              value = {inputValue}
              max={getMaxNumberInputQty()}
              min={0}
              size='sm' onDecreaseClick = {()=>{setInputValue(s=>s-=1)}}
              onIncreaseClick = {()=>{setInputValue(s=>s+=1)}} />
            </div>
          </div>

        </div>
      </div>
      <div className="flex items-center px-5 sm:px-6 py-4 border-t border-solid border-gray-700">
        {merch?.property[selectedPropertyIndex]?.originalPValue > 0 ? <div className="flex-1 ml-4 sm:ml-6">
          <button disabled={inputValue === 0} onClick={addMerchButtonHandler} className="btn btn-rose h-11 !py-0 !px-0 !font-semibold flex items-center justify-center w-full">
            <SvgIcon id="buy" className="text-lg text-white mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Add to Cart</span>
          </button>
        </div> : <div className="flex-1 ml-4 sm:ml-6">
          <button disabled className="btn btn-rose h-11 !py-0 !px-0 !font-semibold flex items-center justify-center w-full">
            <SvgIcon id="buy" className="text-lg text-white mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">SOLD OUT</span>
          </button>
        </div>}

      </div>
    </div>
  );
};

export default MerchSidebar;
