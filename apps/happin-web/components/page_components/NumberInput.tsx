import { useNumberInput } from '@chakra-ui/react';
import { Minus, Plus } from '@icon-park/react';
import React, { useEffect } from 'react';
import classNames from 'classnames';
import { UseNumberInputProps } from '@chakra-ui/number-input/dist/types/use-number-input';

export type NumberInputProps = {
  isDisabled?: boolean;
  size?: 'sm' | 'md'
} & UseNumberInputProps

const NumberInput = ({ isDisabled, size, ...rest }: NumberInputProps) => {
  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
  } = useNumberInput({
    focusInputOnChange: false,
    step: 1,
    defaultValue: 0,
    min: 0,
    max: 999,
    precision: 0,
    isDisabled,
    ...rest
  })

  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps()
  // const sizeClass = size && `number-input--${size}` || ''
  return (
    <div className={classNames('number-input', { 'disabled': isDisabled, [size && `number-input--${size}` || '']: true })}>
      <button className="number-input-button minus" {...dec}>
        <Minus theme="outline" size="1em" fill="currentColor"/>
      </button>
      <button className="number-input-button plus" {...inc}>
        <Plus theme="outline" size="1em" fill="currentColor"/>
      </button>
      <input {...input}/>
    </div>
  );
};

export default NumberInput;
