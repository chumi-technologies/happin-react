import React from 'react';
import { useState } from 'react';
import SvgIcon from '@components/SvgIcon';
import { Check, CloseSmall } from '@icon-park/react';
import Merch from './Merch';
import Select from '@components/reusable/Select';
import NumberInput from '@components/page_components/NumberInput';
import classNames from 'classnames';

type CheckoutSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  type: 'bundle' | 'merch';
}

const CheckoutSidebar = (props: CheckoutSidebarProps) => {
  const { isOpen, onClose, type } = props;
  const bundleList = [
    {
      name: 'Merch Name',
      desc: 'Merch Descript..........Hello, I’m a black notebook; Hello, I’m a black notebook.',
      select: [
        { value: 'Wade Cooper', label: 'Wade Cooper' },
        { value: 'Arlene Mccoy', label: 'Arlene Mccoy', disabled: true },
        { value: 'Devon Webb', label: 'Devon Webb' },
        { value: 'Tom Cook', label: 'Tom Cook' },
        { value: 'Tanya Fox', label: 'Tanya Fox' },
        { value: 'Hellen Schmidt', label: 'Hellen Schmidt' }
      ],
      imgList: [
        {
          src: 'https://cdn.sspai.com/2021/06/20/9a852c3a26e00530fd867ec10bd1d97a.jpg',
          loading: 'lazy',
          alt: 'img-01'
        },
        {
          src: 'https://cdn.sspai.com/2021/06/27/d9c675f539aa34caa7783f149eb06705.jpg',
          loading: 'lazy',
          alt: 'img-02'
        }
      ]
    },
    {
      name: 'Merch Name',
      desc: 'Merch Descript..........Hello, I’m a black notebook; Hello, I’m a black notebook.',
      type: 'Black Color',
      imgList: [
        {
          src: 'https://cdn.sspai.com/editor/u_/c49hkn5b34tdfon49s2g.jpeg',
          loading: 'lazy',
          alt: 'img-01'
        },
        {
          src: 'https://cdn.sspai.com/2021/06/20/9a852c3a26e00530fd867ec10bd1d97a.jpg',
          loading: 'lazy',
          alt: 'img-02'
        },
        {
          src: 'https://images.unsplash.com/photo-1628755840182-11c29f38b44c',
          loading: 'lazy',
          alt: 'img-03'
        }
      ]
    },
    {
      name: 'Merch Name',
      desc: 'Merch Descript..........Hello, I’m a black notebook; Hello, I’m a black notebook.',
      type: 'Black Color',
      imgList: [
        {
          src: 'https://cdn.sspai.com/2021/06/27/d9c675f539aa34caa7783f149eb06705.jpg',
          loading: 'lazy',
          alt: 'img-03'
        }
      ]
    }
  ];

  return (
    <div className={classNames('checkout__sidebar', { 'open': isOpen })}>
      <div className="flex flex-col flex-1 h-0">
        <div className="px-5 sm:px-6">
          {
            type === 'bundle' ? (
              <div className="relative flex items-start py-4 sm:py-6 border-b border-solid border-gray-700">
                <div className="w-full pr-7">
                  <div className="leading-none mb-2 font-semibold text-white">VIP Pass + Merch Bundle B</div>
                  <div className="font-medium text-xs text-gray-400">
                    <span className="text-white text-sm">CA$199.99</span>
                  </div>
                  <div className="text-gray-400 text-xs">Sales end on Dec 2, 2019</div>
                </div>
                <div
                  className="absolute -right-2 top-4 flex items-center justify-center w-8 h-8 rounded-full hover:text-rose-500 transition cursor-pointer"
                  onClick={onClose}>
                  <CloseSmall theme="outline" size="22" fill="currentColor" strokeWidth={3} />
                </div>
              </div>
            ) : (
              <div className="relative flex items-start py-6">
                <div className="w-full pr-7">
                  <div className="leading-none font-semibold text-white">Merch Details</div>
                </div>
                <div
                  className="absolute -right-2 top-4 flex items-center justify-center w-8 h-8 rounded-full hover:text-rose-500 transition cursor-pointer"
                  onClick={onClose}>
                  <CloseSmall theme="outline" size="22" fill="currentColor" strokeWidth={3} />
                </div>
              </div>
            )
          }
        </div>
        <div className="flex-1 h-0 web-scroll overflow-y-auto px-5 sm:px-6">
          {
            type === 'bundle' && (
              <div className="flex items-center text-green-500 font-bold uppercase py-5">
                <Check theme="outline" size="16" fill="currentColor" strokeWidth={6} />
                <span className="ml-2 text-sm">Bundle includes:</span>
              </div>
            )
          }
          {
            bundleList.map((item, index) => (
              <div className="checkout__goods-item" key={index}>
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-md overflow-hidden">
                  <Merch
                    // @ts-ignore
                    imgList={item.imgList}
                  />
                </div>
                <div className="flex-1 min-w-0 ml-5">
                  <div className="text-white font-semibold mb-1">{item.name}</div>
                  <div className="text-gray-400 text-tiny mb-3">{item.desc}</div>
                  {
                    item.type && (
                      <div
                        className="inline-block py-1 px-3 border-2 border-solid border-gray-600 bg-gray-700 text-gray-400 text-sm rounded-lg cursor-default">{item.type}</div>
                    )
                  }
                  {
                    item.select && (
                      <Select
                        data={item.select}
                        defaultValue="Tom Cook"
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

export default CheckoutSidebar;
