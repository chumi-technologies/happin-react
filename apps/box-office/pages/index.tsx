import React, {useEffect } from 'react';
import { GetServerSidePropsResult } from 'next';
import { getWhiteLabelDomain } from 'lib/api';
import { useUserState } from 'contexts/user-state';
import { useRouter } from 'next/router'
import { useSSOState } from 'contexts/sso-state';

export default function Home() {
  const { user } = useUserState();
  const router = useRouter();
  const { showSSO, showSSOSignUp } = useSSOState();

  useEffect(() => {
    if (user) {
      router.push('/event-list');
    }
  }, [user])

  return (
    <div className="flex flex-col mt-40 mb-10 self-center text-center justify-center items-center text-black">
        <img className="h-40" src="/images/happin-single.svg" alt="Happin" />
        <p className="my-2"><strong>Happin</strong> Ticketing</p>
        <button className="home__page__button" onClick={showSSO}>Log in</button>
    </div>
  );
}


const whiteLabelDomain = async (domain: string) => {
  try {
    const response = await getWhiteLabelDomain(domain);
    if (response.groupEventId) {
      return response.groupEventId
    } else if(response.redirectToAc) {
      return response.redirectToAc
    }
  } catch (err) {
    console.log(err)
  }
}

export async function getServerSideProps(context: { req: {headers: {host: string}} }) : Promise<GetServerSidePropsResult<any>> {
  //&& !context.req.headers.host.includes('localhost')
  if (context.req.headers.host !== 'happin.app' && !context.req.headers.host.includes('localhost')) {
    const eventId = await whiteLabelDomain(context.req.headers.host)
    if (!eventId) {
      return {props: {}}
    }
    return {
      redirect: {
        permanent: false,
        destination: `/post/${eventId}`
      }
    }
  }  
  return {props: {}}
}


