import React, { useEffect } from 'react';
import { auth } from '../../api/firebaseClient';
import { useRouter } from 'next/dist/client/router'


export default function RefreshToken() {
  const router = useRouter()

  useEffect(() => {
    if (router.query && Object.keys(router.query).length) {
      auth.onAuthStateChanged(async user => {
        if (user) {
          const { origin } = router.query;
          const token = await user.getIdToken(true);
          console.log('token refreshed:', token)
          window.parent.postMessage({ action: 'refresh_token', payload: { token: token } }, origin as string);
        }
      })
    }
  }, [router?.query])
  return (
    <></>
  )
}
