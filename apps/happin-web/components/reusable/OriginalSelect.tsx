import React, { useState } from 'react';
import classNames from 'classnames';

export type selectList = {
  value: string;
  text: string;
};
type SelectProps = {
  options: selectList[];
  selected?: string;
  placeholder?: string;
  className?: string;
  onChange?: (event: any) => void;
  onBlur?: (event: any) => void;
};

// eslint-disable-next-line react/display-name
const Select = React.forwardRef(
  (props: SelectProps, ref: React.Ref<HTMLSelectElement>) => {
    const { options, selected, placeholder, className,onBlur,onChange, ...rest } = props;
    const [isEmpty, setEmpty] = useState<boolean>(true);
    const handleChange = (event: any) => {
      setEmpty(false)
      if (onChange) {
        onChange(event);
      }
    }
    const handleOnBlur = (event: any) => {
      if (onBlur) {
        onBlur(event);
      }
    }
    return (
      <select
        className={classNames(`form-field ${className}`, { 'is-placeholder': !selected?.length && isEmpty })}
        defaultValue={selected?.length ? selected : ''}
        onBlur={(event) => handleOnBlur(event)}
        onChange={(event => handleChange(event))}
        ref={ref}
        {...rest}
      >
        <option disabled value=''>
          {placeholder?.length ? placeholder : 'Please select'}
        </option>
        {options.map((item, index) => (
          <option value={item.value} key={index}>
            {item.text}
          </option>
        ))}
      </select>
    );
  },
);
export default Select
