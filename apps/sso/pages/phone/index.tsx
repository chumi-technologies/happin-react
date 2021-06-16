import React, { useState, useEffect } from 'react';

import { firebaseClient } from '../../api/firebaseClient';
import firebase from "firebase/app";
import 'firebase/auth';

import Link from 'next/Link';
import PhoneInput from 'react-phone-input-2';
import classNames from 'classnames';
import { Input } from '@chakra-ui/react';

export default function Home() {
  const [phone, setPhone] = useState('')
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any | null>(null)
  const [verificationCode, setVerificationCode] = useState<any | null>(null)
  let recaptchaWidgetId

  const sendVerificationCode = async () => {
    console.log("phone", phone, "captcha", recaptchaVerifier)
    try {
      firebaseClient.auth().signInWithPhoneNumber(phone, recaptchaVerifier).then(verificationCode => {
        setVerificationCode(verificationCode)
      }, err => {
        console.log(err)
      })
    } catch (err) {
      console.log('Unknown error, please try to update your browser');
    };
  }

  // Lifecycle hook - ComponentDidMount
  useEffect(() => {
    setTimeout(() => {
      let verifier =  new firebase.auth.RecaptchaVerifier("recaptcha-container", {
        size: 'normal',
        'expired-callback': () => {
          console.log('expired recaptcha')
        }
      });
      verifier.render().then((widgetId: any) => {
        recaptchaWidgetId = widgetId;
      }, (error: any) => {
        console.log(error);
      })
      setRecaptchaVerifier(verifier)
    }, 500)
  }, [])

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="text-center">
          <h2 className="text-3xl font-semibold mt-6">Log In with your phone</h2>
          <div className="text-gray-500 text-sm mt-3">6 digit code already sent over SMS to</div>
          <div className="text-sm mt-1" hidden={true}>905 483 9655</div>
        </div>
        <div className="w-full max-w-sm mx-auto mt-12">
          <PhoneInput
            country={'us'}
            value={phone}
            enableSearch={true}
            disableSearchIcon={true}
            onChange={phone => setPhone("+"+phone)}
          />
          <div className="mt-4" id="recaptcha-container"></div>
          <Input placeholder="Enter 6 digital" size="md" className="mt-4" />
          <button className="btn btn-light w-full mt-12" onClick={sendVerificationCode}>Send Code</button>
          <div className="flex mt-4">
            <button className="btn btn-teal w-full flex-grow">Resend</button>
            <button className="btn btn-light ml-4 !px-8">Confirm</button>
          </div>
        </div>
        <div className="flex-grow" />
        <div className="w-full max-w-sm mx-auto text-center border-t border-gray-200 border-solid pt-3 text-sm text-gray-500">
          <div className="flex justify-between">
            <Link href="/"><a className="underline transition font-semibold text-teal-500 hover:text-teal-600">More login options</a></Link>
            <div>Can’t login? <Link href="/"><a className="underline transition font-semibold text-rose-500 hover:text-rose-600">Sign up</a></Link> for new user?</div>
          </div>
        </div>
      </div>
    </div>

  )
}
