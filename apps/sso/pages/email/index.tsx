import 'bootstrap/dist/css/bootstrap.css'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Log In with your email</h1>
      </main>

      <footer className={styles.footer}>
          Can't login? sign up for new user
      </footer>
    </div>
  )
}
