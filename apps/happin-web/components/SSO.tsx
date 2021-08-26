import { useAppState } from '../contexts/state';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import IframeComm from 'react-iframe-comm';

enum ESSOMode {
  signIn = 'sign-in',
  signUp = 'sign-up',
}

const SSO = () => {
  const { ssoState: { visible, mode }, hideSSO } = useAppState();
  const [origin, setOrigin] = useState('');
  const router = useRouter();

  console.log('mode', mode);



  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      console.log('hostname', hostname);
      setOrigin(window.location.href);
    }
  }, [router]);

  useEffect(() => {
    console.log('mode', mode);

  }, [mode]);


  const url = new URL(process.env.NEXT_PUBLIC_HAPPIN_SSO || '');
  url.searchParams.set('origin', origin)
  url.searchParams.set('role', 'Fan')
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
    className: 'fixed inset-0 h-screen w-screen z-10',
  };

  // the postMessage data you want to send to your iframe
  // it will be send after the iframe has loaded
  const postMessageData = "hello iframe";

  // parent received a message from iframe
  const onReceiveMessage = (e: MessageEvent) => {
    if (e.origin !== process.env.NEXT_PUBLIC_HAPPIN_SSO) return;
    console.log("onReceiveMessage", e.data);
    const { action, payload } = e.data || {};
    if (action === 'close') hideSSO();
    if (action === 'redirect') {
      console.log('receive', payload.url);
      window.location.assign(payload.url)
    }
  };

  // iframe has loaded
  // const onReady = () => {
  //   console.log("onReady");
  // };

  return (visible && (
    <IframeComm
      attributes={attributes}
      postMessageData={postMessageData}
      // handleReady={onReady}
      handleReceiveMessage={onReceiveMessage}
    />
  ));
}

export {
  ESSOMode,
  SSO,
}