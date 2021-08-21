import React, { useState, useEffect } from 'react';

import { firebaseClient } from '../../api/firebaseClient';
import firebase from "firebase/app";
import 'firebase/auth';

import Link from 'next/link';
import PhoneInput from 'react-phone-input-2';
import { Input } from '@chakra-ui/react';
import { ERole, ESSOMode, useAppState } from '../../contexts/state';
import { signUpHappin } from 'api/happin-server';
import { getHappinWebURL, getSaaSDashboardURL } from 'utils/redirect-url';

declare var grecaptcha: any

export default function Phone() {
  const [countryCode, setCountryCode] = useState('us');
  const [phone, setPhone] = useState('')

  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any | null>(null)
  const [recaptchaWidgetId, setRecaptchaWidgetId] = useState<any | null>(null)

  const [verificationCode, setVerificationCode] = useState('')
  const [resendTimer, setResendTimer] = useState(0)
  const [verificationSent, setVerificationSent] = useState(false)
  const [signinResult, setSigninResult] = useState<any | null>(null)

  const { signin, toggleMode, origin, role } = useAppState();


  React.useEffect(() => {
    const tm = window.setInterval(() => {
      if (resendTimer > 0) {
        setResendTimer(resendTimer - 1);
      }
      if (resendTimer <= 0) {
        clearInterval(tm)
      }
    }, 1000);
    return () => {
      window.clearInterval(tm);
    };
  }, [resendTimer]);

  const sendVerificationCode = async () => {
    try {
      firebaseClient.auth().signInWithPhoneNumber(phone, recaptchaVerifier).then(res => {
        setSigninResult(res)
        setVerificationSent(true)
        setResendTimer(60)
      }, err => {
        console.log(err)
      })
    } catch (err) {
      console.log('Unknown error, please try to update your browser');
    };
  }

  const login = async () => {
    try {
      const result = await signinResult.confirm(verificationCode)
      console.log('result', result)
      const firebaseToken = await result?.user?.getIdToken();
      console.log('firebaseToken', firebaseToken);

      if (!signin) {
        await signUpHappin(firebaseToken, { version: 2, phone, areaCode: countryCode });
      }
      const redirectURL = role === ERole.organizer ? await getSaaSDashboardURL(firebaseToken) : await getHappinWebURL(firebaseToken);
      console.log('redirectURL', redirectURL);
      window.parent.postMessage({ action: 'get_token', payload: { token: firebaseToken } }, origin);
      window.parent.postMessage({ action: 'redirect', payload: { url: redirectURL } }, origin);
    } catch (err) {
      console.log(err);
      grecaptcha.reset(recaptchaWidgetId);
    }
  }

  const resend = () => {
    setSigninResult(null)
    grecaptcha.reset(recaptchaWidgetId);
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
        setRecaptchaWidgetId(widgetId)
      }, (error: any) => {
        console.log(error);
      })
      setRecaptchaVerifier(verifier)
    }, 500)
  }, [])

  const onPhoneChange = (phone: string, country: { name: string, dialCode: string, countryCode: string }) => {
    setPhone("+"+phone);
    setCountryCode(country.dialCode);
  }

  return (
    <>
      <div className="text-center">
        {
          signin
          ? <h2 className="black-title text-3xl font-semibold mt-6">Log In with your phone</h2>
          : <h2 className="black-title text-3xl font-semibold mt-6">Sign up</h2>
        }
        <div className="text-gray-500 text-sm mt-3">6 digit code already sent over SMS to</div>
        <div className="text-sm mt-1" hidden={true}>905 483 9655</div>
      </div>
      <div className="w-full max-w-sm mx-auto mt-12">
        <PhoneInput
          country={countryCode}
          value={phone}
          enableSearch={true}
          disableSearchIcon={true}
          preferredCountries={['us', 'ca', 'gb']}
          preserveOrder={['preferredCountries']}
          onChange={onPhoneChange}
        />
        <div className="mt-4 flex justify-center" hidden={verificationSent} id="recaptcha-container" />
        <Input placeholder="Enter 6 digital" size="md" className="mt-4"
          value={verificationCode}
          onChange={e => setVerificationCode(e.target.value)}/>
        <button className="btn btn-dark w-full mt-12" hidden={verificationSent} onClick={sendVerificationCode}>Send Code</button>
        <div className="flex mt-4">
          <button className="btn btn-teal w-full flex-grow" hidden={!verificationSent} disabled={resendTimer > 0} onClick={resend}>
            Resend {resendTimer === 0 ? '' : '(' + resendTimer + ' seconds)'}
            </button>
          <button className="btn btn-dark ml-4 !px-8" hidden={!verificationSent} onClick={login}>Confirm</button>
        </div>
      </div>
      <div className="flex-grow" />
      {
        signin
        ? <div className="w-full max-w-sm mx-auto text-center border-t border-gray-200 border-solid pt-3 text-sm text-gray-500">
            <div className="flex justify-between">
              <Link href="/"><a className="underline transition font-semibold text-teal-500 hover:text-teal-600">More login options</a></Link>
              <div>Can’t login? <Link href="/"><a className="underline transition font-semibold text-rose-500 hover:text-rose-600" onClick={toggleMode}>Sign up</a></Link> for new user?</div>
            </div>
          </div>
        : <div className="w-full max-w-sm mx-auto text-center border-t border-gray-200 border-solid pt-3 text-sm text-gray-500">
            <div className="flex justify-between">
              <Link href="/"><a className="underline transition font-semibold text-teal-500 hover:text-teal-600">More signup options</a></Link>
              <div>Already onboard? <Link href="/"><a className="underline transition font-semibold text-rose-500 hover:text-rose-600" onClick={toggleMode}>Log in</a></Link></div>
            </div>
          </div>
      }
    </>
  )
}
