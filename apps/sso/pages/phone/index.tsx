import 'bootstrap/dist/css/bootstrap.css'
import styles from '../../styles/Home.module.css'
import React, { useState, useEffect } from 'react';

import { firebaseClient } from '../../api/firebaseClient';
import firebase from "firebase/app";
import 'firebase/auth';

export default function Home() {
  const [phone, setPhone] = useState('');
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<any | null>(null);
  let recaptchaWidgetId

  const sendVerificationCode = async () => {
    console.log("phone", phone, "captcha", recaptchaVerifier)
    await firebaseClient
    .auth()
    .signInWithPhoneNumber(phone, recaptchaVerifier);
    location.href = '/';
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
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Log In with your phone</h1>

        <input
          // type={'phone'}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={'Phone Number'}
        />
        <div id="recaptcha-container"></div>

        <button onClick={sendVerificationCode}>
          Send Code {phone}
        </button>
      </main>

      <footer className={styles.footer}>
          Can't login? sign up for new user
      </footer>
    </div>
  )
}
