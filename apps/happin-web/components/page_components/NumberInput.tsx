import { useNumberInput } from '@chakra-ui/react';
import { Minus, Plus } from '@icon-park/react';
import React, { useEffect } from 'react';
import classNames from 'classnames';

const NumberInput = ({ setNumberInputValue, disabled }: any) => {
  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
  } = useNumberInput({
    step: 1,
    defaultValue: 0,
    min: 0,
    max: 999,
    precision: 0,
  })

  const inc = getIncrementButtonProps()
  const dec = getDecrementButtonProps()
  const input = getInputProps({disabled: disabled})
  useEffect(() => {
    const { value }: any = input
    setNumberInputValue(value)
  }, [input])
  return (
    <div className={classNames('number-input', { 'disabled': disabled })}>
      <button className="number-input-button minus" {...dec} disabled={disabled || (input as any).value === '0'}>
        <Minus theme="outline" size="16" fill="currentColor"/>
      </button>
      <button className="number-input-button plus" {...inc} disabled={disabled}>
        <Plus theme="outline" size="16" fill="currentColor"/>
      </button>
      <input {...input}/>
    </div>
  );
};

export default NumberInput;
