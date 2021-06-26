import React, { useEffect, useRef, useState } from 'react';
import { useFormikContext } from 'formik';

export const SubmitButton = ({children, ...rest}:any) => {
  const [validate, setValidate] = useState(false);
  const { isValid } = useFormikContext();
  const didMountRef = useRef(false);

  useEffect(() => {
    if (didMountRef.current) {
      setValidate(isValid)
    } else {
      didMountRef.current = true
    }
  }, [isValid])

  return (
    <button
      type="submit"
      disabled={!validate}
      {...rest}
    >
      {children}
    </button>
  )
}
