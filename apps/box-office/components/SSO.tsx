import { useSSOState } from '../contexts/sso-state';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// @ts-ignore
import IframeComm from 'react-iframe-comm';
import { useUserState } from 'contexts/user-state';

enum ESSOMode {
  signIn = 'sign-in',
  signUp = 'sign-up',
}

const SSO = () => {
  const { setUserInfo,exchangeForCrowdCoreToken} = useUserState();
  const { ssoState: { visible, mode, role }, hideSSO } = useSSOState();
  const [origin, setOrigin] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      setOrigin(window.location.href);
    }
  }, [router]);

  const url = new URL(process.env.NEXT_PUBLIC_HAPPIN_SSO || '');
  url.searchParams.set('origin', origin)
  url.searchParams.set('role', role)
  if (mode) {
    url.searchParams.set('mode', mode)
  }
  // url.searchParams.append('setting', JSON.stringify({
  //   role: 'Organizer',
  // }));

  // the html attributes to create the iframe with
  // make sure you use camelCase attribute names
  const attributes = {
    src: url.toString(),
    className: 'fixed inset-0 h-screen w-screen z-100',
  };

  // the postMessage data you want to send to your iframe
  // it will be send after the iframe has loaded
  //const postMessageData = "hello iframe";

  // parent received a message from iframe
  const onReceiveMessage = async (e: MessageEvent) => {
    if (e.origin !== process.env.NEXT_PUBLIC_HAPPIN_SSO) return;
    console.log("onReceiveMessage", e.data);
    const { action, payload } = e.data || {};
    if (action === 'close') hideSSO();
    if (action === 'get_token') {
      localStorage.setItem('happin_jwt', payload.idToken);
      localStorage.setItem('happin_refresh_token', payload.refreshToken);
      await setUserInfo();
      hideSSO();
      router.push('/event-list');
    }
  };

  // iframe has loaded
  // const onReady = () => {
  //   console.log("onReady");
  // };

  return (visible && (
    <IframeComm
      attributes={attributes}
      // postMessageData={postMessageData}
      // handleReady={onReady}
      handleReceiveMessage={onReceiveMessage}
    />
  ));
}

export {
  ESSOMode,
  SSO,
}
