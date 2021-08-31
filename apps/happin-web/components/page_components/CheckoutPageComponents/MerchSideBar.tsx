import React from 'react';
import SvgIcon from '@components/SvgIcon';
import { CloseSmall } from '@icon-park/react';
import Merch from './Merch';
import Select from '@components/reusable/Select';
import NumberInput from '@components/reusable/NumberInput';
import classNames from 'classnames';
import { MerchItemDataProps } from 'lib/model/checkout';
import { useState } from 'react';
import { useCheckoutState } from 'contexts/checkout-state';
import { MerchListAction } from 'pages/checkout/[event_id]';
import { increaseMerchAmount } from './util/IncreseInput';

type CheckoutSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  merch: MerchItemDataProps,
  onChange: (data: MerchListAction)=> void;
  setIsOpen: (arg: any)=>void
}

const MerchSidebar = (props: CheckoutSidebarProps) => {
  const { isOpen, onClose, merch, onChange, setIsOpen } = props;
  const { addItem } = useCheckoutState();
  //const [merchEditingIndex, setMerchEditingIndex] = useState(0);

  const [inputValue, setInputValue] = useState(0)

  const [selectedPropertyIndex, setSelectedPropertyIndex] = useState(0);

  const addMerchButtonHandler = () => {
    if (!inputValue) {
      return
    }
    increaseMerchAmount(merch, onChange, addItem, selectedPropertyIndex, inputValue);
    setIsOpen((s:boolean)=>!s);
    setInputValue(0)
  }

  const getMaxNumberInputQty = () => {
    if (merch?.property[selectedPropertyIndex]?.pValue > merch?.max) {
      return merch?.max
    } else {
      return merch?.property[selectedPropertyIndex]?.pValue
    }
  }

  return (
    <div className={classNames('checkout__sidebar', { 'open': isOpen })}>
      <div className="flex flex-col flex-1 h-0">
        <div className="px-5 sm:px-6">
          <div className="relative flex items-start py-6">
            <div className="w-full pr-7">
              <div className="leading-none font-semibold text-white">Merch Details</div>
            </div>
            <div
              className="absolute -right-2 top-4 flex items-center justify-center w-8 h-8 rounded-full hover:text-rose-500 transition cursor-pointer"
              onClick={()=>{onClose(); setInputValue(0)}}>
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
                merch?.property && (
                  <Select
                    data={merch.property.map((p,index) => ({ label: p.pName, value: p.pValue, index }))}
                    onChange={data => {
                      setSelectedPropertyIndex(data.index)
                      /* const merchEditingIndex = cart.items.merchItem.findIndex(item=>item.identifier === merch.id + data.pName);
                      setMerchEditingIndex(merchEditingIndex); */
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
              size='sm' onChange={() => {}} onDecreaseClick = {()=>{setInputValue(s=>s-=1)}}
              onIncreaseClick = {()=>{setInputValue(s=>s+=1)}} />
            </div>
          </div>

        </div>
      </div>
      <div className="flex items-center px-5 sm:px-6 py-4 border-t border-solid border-gray-700">
        {merch?.property[selectedPropertyIndex]?.originalPValue > 0 ? <div className="flex-1 ml-4 sm:ml-6">
          <button onClick={addMerchButtonHandler} className="btn btn-rose h-11 !py-0 !px-0 !font-semibold flex items-center justify-center w-full">
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
