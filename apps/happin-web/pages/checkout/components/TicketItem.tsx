import React, { useEffect, useRef, useState } from 'react';
import NumberInput from '@components/page_components/NumberInput';
import { HStack, Tooltip } from '@chakra-ui/react';
import SvgIcon from '@components/SvgIcon';
import type { TicketItemDataProps, TicketItemFeaturesProps } from '../data';
import classNames from 'classnames';
import { Right } from '@icon-park/react';
import Link from 'next/link';

export type TicketItemProps = {
  data: TicketItemDataProps;
  actionType: 'button' | 'input'; // number input or select button
  onSelect?: (data: any) => void;
}

const TicketItem = (props: TicketItemProps) => {
  const { data, onSelect, actionType } = props;
  // const [numberInputValue, setNumberInputValue] = useState('0');
  // const didMountRef = useRef(false);
  // useEffect(() => {
  //   if (didMountRef.current) {
  //     actionType === 'input' && onSelect?.(numberInputValue);
  //   } else {
  //     didMountRef.current = true;
  //   }
  //   // actionType === 'input' && onSelect?.(numberInputValue);
  // }, [numberInputValue]);
  return (
    <div className="py-8">
      <div className="flex items-start">
        <div className="flex-1">
          <div className="text-lg leading-none mb-1 font-semibold text-white">{data.title}</div>
          <div className="font-medium text-xs text-gray-400">
            <span className="text-white text-sm">{data.price}</span>
            {
              data.subPrice && data.subPrice.map((item: string, index) => (
                <span className="ml-1" key={index}>+ {item}</span>
              ))
            }
          </div>
          <div className="text-gray-400 text-xs">{data.time}</div>
        </div>
        {
          actionType === 'button' ?
            <button
              onClick={() => onSelect?.(data)}
              className="btn checkout__ticket-select"
              disabled={data.soldOut}
            >
              Select
            </button> :
            <NumberInput
              onChange={(value) => {
                onSelect?.(value)
              }}
              isDisabled={data.soldOut}
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
        data.introduction && <div className="text-white text-sm">{data.introduction}</div>
      }
      {
        data.helpText?.length && (
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
