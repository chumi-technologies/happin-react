import 'bootstrap/dist/css/bootstrap.css'
import styles from '../../styles/Home.module.css'
import React, { useState } from 'react';
import Link from 'next/Link';
import { firebaseClient } from '../../api/firebaseClient';

export default function EmailLogin() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Log In with your email</h1>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={'Email'}
        />
        <input
          type={'password'}
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder={'Password'}
        />
        <button
          onClick={async () => {
            await firebaseClient
              .auth()
              .createUserWithEmailAndPassword(email, pass);
            window.location.href = '/';
          }}
        >
          Sign up
        </button>
        <button
          onClick={async () => {
            const res = await firebaseClient.auth().signInWithEmailAndPassword(email, pass);
            const parsed = JSON.parse(JSON.stringify(res));
            console.log(parsed.user.stsTokenManager.accessToken)
            window.location.href = '/';
          }}
        >
          Log in
        </button>
      </main>

      <footer className={styles.footer}>
        <Link href="/">
          <a>More Login Option</a>
        </Link>
          Can't login? sign up for new user
      </footer>
    </div>
  )
}
