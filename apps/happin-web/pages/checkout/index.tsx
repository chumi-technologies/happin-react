import React, { useState } from 'react';
import TicketItem from './components/TicketItem';
import CheckoutHead from './components/CheckoutHead';
import { Check, CloseSmall } from '@icon-park/react';
import NumberInput from '@components/page_components/NumberInput';
import SvgIcon from '@components/SvgIcon';
import Select from '@components/reusable/Select';
import Merch from './components/Merch';

const Checkout = () => {
  const people = [
    { value: 'Wade Cooper', label: 'Wade Cooper' },
    { value: 'Arlene Mccoy', label: 'Arlene Mccoy', disabled: true },
    { value: 'Devon Webb', label: 'Devon Webb' },
    { value: 'Tom Cook', label: 'Tom Cook' },
    { value: 'Tanya Fox', label: 'Tanya Fox' },
    { value: 'Hellen Schmidt', label: 'Hellen Schmidt' },
  ]
  const [numberInputValue, setNumberInputValue] = useState('0');
  return (
    <div className="checkout__page">
      <div className="flex flex-col h-full">
        <CheckoutHead />
        <div className="flex-1 h-0 web-scroll overflow-y-auto">
          <div className="container">
            <div className="checkout__container">
              <div className="divide-y divide-gray-700">
                <TicketItem
                  data={{
                    id: 1,
                    title: 'General Pass',
                    price: 'CA$99.99',
                    subPrice: ['CA$11.60 Fee', 'CA$27.51 GST/HST'],
                    time: 'Sales end on Dec 2, 2019',
                    features: [
                      { type: 'ticket', tooltip: 'Tickets including replay description...' },
                      { type: 'video', tooltip: 'Tickets including replay description...' },
                      { type: 'bag' },
                      { type: 'vip' }
                    ],
                    introduction: 'An all-access ticket which includes food and drink, career fair, workshops, conference sessions and keynotes, slides and slack-channel.An all-access ticket which includes food and drink, career fair, workshops, conference',
                    helpText: 'What’s VIP room?',
                    soldOut: false
                  }}
                  actionType="input"
                  onSelect={(value) => {
                    console.log(value);
                  }} />
                <TicketItem
                  data={{
                    id: 2,
                    title: 'General Pass + Merch Bundle A',
                    price: 'CA$99.99',
                    subPrice: ['CA$11.60 Fee', 'CA$27.51 GST/HST'],
                    time: 'Sales end on Dec 2, 2019',
                    features: [
                      { type: 'ticket', tooltip: 'Tickets including replay description...' },
                      { type: 'video', tooltip: 'Tickets including replay description...' }
                    ],
                    introduction: 'An all-access ticket which includes food and drink, career fair, workshops, conference sessions and keynotes, slides and slack-channel.An all-access ticket which includes food and drink, career fair, workshops, conference',
                    merch: true,
                    soldOut: false
                  }}
                  actionType="button"
                  onSelect={(value) => {
                    console.log(value);
                  }} />
              </div>
            </div>
          </div>
          <div className="checkout__sidebar">
            <div className="flex flex-col flex-1 h-0 px-6">
              <div className="relative flex items-start py-6 border-b border-solid border-gray-700">
                <div className="w-full pr-7">
                  <div className="text-lg leading-none mb-1 font-semibold text-white">VIP Pass + Merch Bundle B</div>
                  <div className="font-medium text-xs text-gray-400">
                    <span className="text-white text-sm">CA$199.99</span>
                  </div>
                  <div className="text-gray-400 text-xs">Sales end on Dec 2, 2019</div>
                </div>
                <div className="absolute -right-2 top-4 flex items-center justify-center w-8 h-8 rounded-full hover:text-rose-500 transition cursor-pointer">
                  <CloseSmall theme="outline" size="22" fill="currentColor" strokeWidth={3}/>
                </div>
              </div>
              <div className="flex-1 h-0 web-scroll overflow-y-auto">
                <div className="flex items-center text-green-500 font-bold uppercase py-5">
                  <Check theme="outline" size="18" fill="currentColor" strokeWidth={6}/>
                  <span className="ml-2">Bundle includes:</span>
                </div>
                <div className="checkout__goods-item">
                  <div className="w-40 h-40 rounded-md overflow-hidden">
                    <Merch />
                  </div>
                  <div className="flex-1 min-w-0 ml-5">
                    <div className="text-white font-semibold mb-1">Merch Name</div>
                    <div className="text-gray-400 text-tiny mb-3">Merch Descript..........Hello, I’m a black notebook; Hello, I’m a black notebook.</div>
                    <Select data={people} defaultValue="Tom Cook" onChange={(data) => {
                      console.log(data);
                    }} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center px-6 py-4 border-t border-solid border-gray-700">
              <NumberInput setNumberInputValue={setNumberInputValue} />
              <div className="flex-1 ml-6">
                <button className="btn btn-rose h-11 !py-0 !px-0 !font-semibold flex items-center justify-center w-full">
                  <SvgIcon id="buy" className="text-lg text-white mr-1 sm:mr-2" />
                  <span className="text-sm sm:text-base">Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Checkout;
