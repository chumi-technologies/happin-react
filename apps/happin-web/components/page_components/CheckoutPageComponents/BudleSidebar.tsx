import React from 'react';
import SvgIcon from '@components/SvgIcon';
import { Check, CloseSmall } from '@icon-park/react';
import Merch from './Merch';
import Select from '@components/reusable/Select';
import NumberInput from '@components/reusable/NumberInput';
import classNames from 'classnames';
import { MerchItemDataProps, TicketItemDataProps } from 'lib/model/checkout';
import { useCheckoutState } from 'contexts/checkout-state';

type CheckoutSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  merchs: MerchItemDataProps[],
  ticket: TicketItemDataProps | undefined
}

const BundleSidebar = (props: CheckoutSidebarProps) => {
  const { isOpen, onClose, merchs, ticket} = props;
  const { eventDataForCheckout } = useCheckoutState();

  return (
    <div className={classNames('checkout__sidebar', { 'open': isOpen })}>
      <div className="flex flex-col flex-1 h-0">
        <div className="px-5 sm:px-6">

          <div className="relative flex items-start py-4 sm:py-6 border-b border-solid border-gray-700">
            <div className="w-full pr-7">
              <div className="leading-none mb-2 font-semibold text-white">{ticket?.title || ''}</div>
              <div className="font-medium text-xs text-gray-400">
                <span className="text-white text-sm">{eventDataForCheckout?.default_currency} {ticket?.price || 0}</span>
              </div>
              {/* <div className="text-gray-400 text-xs">Sales end on Dec 2, 2019</div> */}
            </div>
            <div
              className="absolute -right-2 top-4 flex items-center justify-center w-8 h-8 rounded-full hover:text-rose-500 transition cursor-pointer"
              onClick={onClose}>
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
            merchs && merchs.map((item, index) => (
              <div className="checkout__goods-item" key={index}>
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-md overflow-hidden">
                  <Merch
                    // @ts-ignore
                    imgList={item.image.map(i => ({ src: i, loading: 'lazy', alt: item.name }))}
                  />
                </div>
                <div className="flex-1 min-w-0 ml-5">
                  <div className="text-white font-semibold mb-1">{item.name}</div>
                  <div className="text-gray-400 text-tiny mb-3">{item.description}</div>
                 {/*  {
                    item.type && (
                      <div
                        className="inline-block py-1 px-3 border-2 border-solid border-gray-600 bg-gray-700 text-gray-400 text-sm rounded-lg cursor-default">{item.type}</div>
                    )
                  } */}
                  {
                    item.property && (
                      <Select
                        data={item.property.map((p, index)=> {
                          return {
                            value: p.pValue,
                            label: p.pName,
                            disabled: p.originalPValue <= 0,
                            index
                          }
                        })}
                        onChange={(data) => {
                          console.log(data);
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
        <NumberInput onChange={(value) => {
          console.log(value);
        }} />
        <div className="flex-1 ml-4 sm:ml-6">
          <button className="btn btn-rose h-11 !py-0 !px-0 !font-semibold flex items-center justify-center w-full">
            <SvgIcon id="buy" className="text-lg text-white mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BundleSidebar;
