import {
  CardElement,
} from "@stripe/react-stripe-js";
import React from "react";
import styles from './StripeStyles.module.css'


const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fff",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#87bbfd"
      },
      ':-webkit-autofill': {
        color: '#fce883',
      },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee"
    }
  }
};

const Field = ({
  label,
  id,
  type,
  placeholder,
  required,
  autoComplete,
  value,
  onChange
}) => (
  <div className={styles.FormRow}>
    <label htmlFor={id} className={styles.FormRowLabel}>
      {label}
    </label>
    <input
      className={styles.FormRowInput}
      id={id}
      type={type}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
    />
  </div>
);

const CardField = ({ onChange }) => (
  <div className={styles.FormRow}>
    <CardElement options={CARD_OPTIONS} onChange={onChange} />
  </div>
);



const ErrorMessage = ({ children }) => (
  <div className={styles.ErrorMessage} role="alert">
    <svg width="16" height="16" viewBox="0 0 17 17">
      <path
        fill="#FFF"
        d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"
      />
      <path
        fill="#6772e5"
        d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
      />
    </svg>
    {children}
  </div>
);


const CheckoutForm = ({ address, setAddress, error, setError }) => {
  return (
    <form id="stripe-form">
      <fieldset className={styles.FormGroup}>
        <CardField
          onChange={(e) => {
            setError(e.error);
          }}
        />
      </fieldset>
      <fieldset className={styles.FormGroup}>
        <Field
          label="Address"
          id="address"
          type="text"
          required={true}
          value={address}
          onChange={(val)=>{
            setAddress(val.target.value);
            if(error){
              if(error.message === 'Address is required') {
                setError(null)
              }
            }}}
          autoComplete="street-address"
        />
      </fieldset>
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </form>
  );
};

export default CheckoutForm
