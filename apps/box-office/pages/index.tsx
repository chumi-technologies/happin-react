import Head from 'next/head'
import { GetStaticProps } from 'next'
import React from 'react'
import styles from '../styles/Home.module.css'
import { getEvents } from '../api/activity'

interface Props {
  activities: Array<Object>;
}

const Home: React.FC<Props> = (props) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Happin Box Office</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Happin Box Office
        </h1>

        <ul>
          {props.activities.map((e: any) => (
            <li>{e.title}</li>
          ))}
        </ul>

        {/* <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p> */}

        {/* <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </div>

          <div className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </div>

          <div className={styles.card}>
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </div>

          <div className={styles.card}>
            <h2>Deploy &rarr;</h2>
            <p>Instantly deploy your Next.js site to a public URL with Vercel.</p>
          </div>
        </div> */}
      </main>

      {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const res = await getEvents('abc')
  const props = res.data

  return {
    props
  }
}

export default Home