import 'bootstrap/dist/css/bootstrap.css'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Link from 'next/Link'

export default function Home() {

  return (
    <div className={styles.container}>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Login</h1>

        <div className="btn-group" role="group" aria-label="Basic example">
          <button type="button" className="btn btn-primary">Fan</button>
          <button type="button" className="btn btn-primary">Organizer</button>
        </div>

        <div className={styles.grid}>
          <div className="d-grid gap-3">
            <Link href={`/phone`}>
              <div className="btn btn-primary">
                Continue with Phone
              </div>
            </Link>
            <Link href={`/email`}>
              <div className="btn btn-primary">
                Continue with Email
              </div>
            </Link>
            <button className="btn btn-primary" type="button">Continue with Google</button>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
          Can't login? sign up for new user
      </footer>
    </div>
  )
}
