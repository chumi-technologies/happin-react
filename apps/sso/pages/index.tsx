import Link from 'next/link'
import React, { useEffect } from 'react'
import { firebaseClient } from '../api/firebaseClient'
import { ERole, ESSOMode, useAppState } from '../contexts/state'
import { useRouter } from 'next/dist/client/router'
import { getHappinWebURL, getSaaSDashboardURL } from 'utils/redirect-url'
import { RoleToggle } from '@components/RoleToggle'
import { getHappinUser, signUpHappin } from 'api/happin-server'
import { toast } from 'react-toastify';


export default function Home() {
  const { signin, toggleMode, origin, setOrigin, role, setRole, processing, setProcessing } = useAppState();
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
      setProcessing(true)
      firebaseClient.auth()
        .signInWithPopup(provider)
        .then(async (res) => {
          console.log('res', res);
          const firebaseToken = await res?.user?.getIdToken();
          const refreshToken = res?.user?.refreshToken;
          if (firebaseToken) {
            if (!signin) {
              try {
                await signUpHappin(firebaseToken, { version: 2 });
              } catch (err: any) {
                if (err.message.includes('already associated')) {
                  toggleMode()
                  toast.error('User exists, please log in');
                } else {
                  toast.error('Unknown error, please try again later');
                }
                setProcessing(false)
                return
              }
            }
            // check user exist or not
            try {
              await getHappinUser(firebaseToken);
            } catch (err: any) {
              if(err.response) {
                if (err.response.data.code === 401) {
                  await signUpHappin(firebaseToken, { version: 2 });
                  console.log('sign up')
                }
              }
            }
            if (origin.includes('ticketing.happin')) {
              const redirectURL = role === ERole.organizer ? await getSaaSDashboardURL(firebaseToken) : await getHappinWebURL(firebaseToken);
              window.parent.postMessage({ action: 'redirect', payload: { url: redirectURL } }, origin);
            }
            window.parent.postMessage({ action: 'get_token', payload: { idToken: firebaseToken, refreshToken } }, origin);
          }
          setTimeout(() => {
            setProcessing(false)
          }, 2000)
          resolve(res);
        }, err => {
          console.log(err);
          setProcessing(false)
          reject(err);
        })
    })
  }

  return (
    <>
      <div className="text-center">
        {processing &&
          <h2 className="black-title text-4xl font-semibold mb-12 mt-6">Processing...</h2>
        }
        {!processing && <>{
          signin
            ? <h2 className="black-title text-4xl font-semibold mb-12 mt-6">Login</h2>
            : <h2 className="black-title text-4xl font-semibold mb-12 mt-6">Sign up</h2>
        }</>}

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
