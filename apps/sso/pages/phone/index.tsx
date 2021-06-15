import 'bootstrap/dist/css/bootstrap.css'
import styles from '../../styles/Home.module.css'
import React, { useState } from 'react';
import Link from 'next/Link';
import { firebaseClient } from '../../api/firebaseClient';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Log In with your phone</h1>
      </main>

      <footer className={styles.footer}>
          Can't login? sign up for new user
      </footer>
    </div>
  )
}
