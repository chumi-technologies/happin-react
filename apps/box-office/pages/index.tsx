import Head from 'next/head'
import { GetStaticPropsResult } from 'next'
import React from 'react'
import { getEvents } from '../api/chumi-server'
import Link from 'next/link'

interface Props {
  count: number;
  activities: Array<Object>;
}

const Home: React.FC<Props> = (props) => {
  return (
    <div>
      <Head>
        <title>Happin Box Office</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Happin Box Office
        </h1>

        {props.activities.map((e: any) => (
          <Link key={e._id} href={`/event/${e._id}`}>
            <div>
              <h2>{e.title}</h2>
              <p>{e.location}</p>
            </div>
          </Link>
        ))}
      </main>
    </div>
  )
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const res = await getEvents()
  const props = res.data

  return {
    props
  }
}

export default Home
