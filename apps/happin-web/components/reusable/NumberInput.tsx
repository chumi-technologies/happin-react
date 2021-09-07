import { useNumberInput } from '@chakra-ui/react';
import { Minus, Plus } from '@icon-park/react';
import React from 'react';
import classNames from 'classnames';
import { UseNumberInputProps } from '@chakra-ui/number-input/dist/types/use-number-input';

export type NumberInputProps = {
  isDisabled?: boolean;
  onDecreaseClick?: ()=>void;
  onIncreaseClick?: ()=>void;
  size?: 'sm' | 'md'
  max?: number;
} & UseNumberInputProps

const NumberInput = ({ isDisabled, size, max, min, onDecreaseClick, onIncreaseClick, ...rest }: NumberInputProps) => {
  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
  } = useNumberInput({
    focusInputOnChange: false,
    step: 1,
    defaultValue: 0,
    min,
    max: (max!==null && max!==undefined) ? max : 999,
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
      <button disabled={isDisabled} onClick={onDecreaseClick} className="number-input-button minus" {...dec}>
        <Minus theme="outline" size="1em" fill="currentColor"/>
      </button>
      <button disabled={isDisabled} onClick={onIncreaseClick} className="number-input-button plus" {...inc}>
        <Plus theme="outline" size="1em" fill="currentColor"/>
      </button>
      {/* always not allow enter number */} 
      <input type='number' disabled={true} {...input}/>
    </div>
  );
};

export default NumberInput;
