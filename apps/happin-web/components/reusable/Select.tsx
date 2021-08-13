import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react'
import { Down } from '@icon-park/react';
import classNames from 'classnames';

type SelectProps = {
  data: SelectItemProps[];
  onChange?: (data: any) => void;
  defaultValue?: string | number | SelectItemProps;
  disabled?: boolean;
}
type SelectItemProps = {
  value: string | number;
  label: string | number;
  disabled?: boolean;
};
const getArrIndex = (arr: SelectItemProps[], value: any) => {
  if (value === undefined) {
    return 0
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const index = arr.findIndex(o => o.value === value);
    return index > -1 ? index : 0
  }
  if (typeof value === 'object') {
    const index = arr.findIndex(o => JSON.stringify(o) === JSON.stringify(value));
    return index > -1 ? index : 0
  }
  return 0
};
export default function Select(props: SelectProps) {
  const { data, onChange, defaultValue, disabled } = props;
  const defaultIndex = getArrIndex(data, defaultValue)
  const [selected, setSelected] = useState(data[defaultIndex || 0]);
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) {
      return onChange?.(selected);
    } else {
      didMountRef.current = true
    }
  }, [selected])
  return (
    <div className="w-full">
      <Listbox value={selected} onChange={setSelected} disabled={disabled}>
        {({ open }) => (
          <div className="relative mt-1">
            <Listbox.Button className={classNames('select-button', {'open': open})}>
              <span className="block truncate text-sm font-medium">{selected.label}</span>
              <span className="select-button__arrow">
                <Down theme="outline" size="16" fill="currentColor"/>
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options static className="absolute w-full py-1 mt-1 overflow-auto text-sm bg-gray-700 rounded-md max-h-60 font-medium focus:outline-none">
                {data.map((item: SelectItemProps, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ selected, active }) =>
                      classNames('block py-2 px-3 truncate cursor-pointer select-none transition hover:bg-gray-600 focus:outline-none', { 'bg-gray-600 bg-opacity-60': selected }, {'text-gray-500 cursor-not-allowed hover:bg-gray-700': item.disabled})
                    }
                    value={item}
                    disabled={item.disabled}
                  >
                    {item.label}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  )
}
