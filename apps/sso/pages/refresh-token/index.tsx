import { useAppState } from 'contexts/state';
import React, { useEffect } from 'react';
import { auth } from '../../api/firebaseClient';


export default function RefreshToken() {
  const { origin } = useAppState();

  useEffect(() => {
    auth.onAuthStateChanged(async user => {
      if (user) {
        const token = await user.getIdToken(true);
        console.log('token refreshed:', token)
        window.parent.postMessage({ action: 'refresh_token', payload: { token: token } }, origin);
      }
    })
  }, [])
  return (
    <></>
  )
}
