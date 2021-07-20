import Link from 'next/link'
import React, { useEffect } from 'react'
import { firebaseClient } from '../api/firebaseClient'
import { ERole, ESSOMode, useAppState } from '../contexts/state'
import { useRouter } from 'next/dist/client/router'
import { getHappinWebURL, getSaaSDashboardURL } from 'utils/redirect-url'
import { RoleToggle } from '@components/RoleToggle'


export default function Home() {
  const { signin, toggleMode, origin, setOrigin, role, setRole } = useAppState();
  const router = useRouter()

  useEffect(() => {
    if (router.query && Object.keys(router.query).length) {
      const { origin, role, mode } = router.query;
      // load setting from query into state
      console.log('SSO on triggered', origin, role, mode);
      setOrigin(origin as string);
      if (Object.values(ERole).includes(role as ERole)) {
        setRole(role as ERole);
      }
      if (mode === ESSOMode.signUp && signin) {
        toggleMode();
      }
    }
  }, [router?.query]);

  const googleAuth = () => {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebaseClient.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      firebaseClient.auth()
        .signInWithPopup(provider)
        .then(async (res) => {
          console.log('res', res);
          const firebaseToken = await res?.user?.getIdToken();
          if (firebaseToken) {
            const redirectURL = role === ERole.organizer ? await getSaaSDashboardURL(firebaseToken) : await getHappinWebURL(firebaseToken);
            console.log('redirectURL', redirectURL);
            window.parent.postMessage({ action: 'redirect', payload: { url: redirectURL } }, origin);
          }
          resolve(res);
        }, err => {
          console.log(err);
          reject(err);
        })
    })
  }

  return (
    <>
      <div className="text-center">
        {
          signin
          ? <h2 className="black-title text-4xl font-semibold mb-12 mt-6">Login</h2>
          : <h2 className="black-title text-4xl font-semibold mb-12 mt-6">Sign up</h2>
        }
        <RoleToggle className="toggle-tab average w-52" />
      </div>
      <div className="w-full max-w-xs mx-auto mt-10">
        {
          role === ERole.fan ?
          <Link href="/phone">
            <button className="btn btn-outline-light w-full mb-4">Continue with phone</button>
          </Link> : null
        }
        <Link href={signin ? '/email-sign-in' : '/email-sign-up'}>
          <button className="btn btn-outline-light w-full mb-4">Continue with email</button>
        </Link>
        <button className="btn btn-outline-light w-full mb-4 flex items-center justify-center" onClick={googleAuth}>
          <img src="/images/google-logo.svg" alt="" width="18" />
          <span className="ml-3">Continue with Google</span>
        </button>
      </div>
      <div className="flex-grow" />
      {
        signin
        ? <div className="w-full max-w-sm mx-auto text-center border-t border-gray-200 border-solid  pt-3 text-sm text-gray-500">
            Can’t login? <Link href="/"><a className="underline transition font-semibold text-rose-500 hover:text-rose-600" onClick={toggleMode}>Sign up</a></Link> for new user?
          </div>
        : <div className="w-full max-w-sm mx-auto text-center border-t border-gray-200 border-solid  pt-3 text-sm text-gray-500">
            Already onboard? <Link href="/"><a className="underline transition font-semibold text-rose-500 hover:text-rose-600" onClick={toggleMode}>Log in</a></Link>
          </div>
      }
    </>
  );
}
