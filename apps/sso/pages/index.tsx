import Link from 'next/link'
import { useEffect, useState } from 'react'
import { firebaseClient } from '../api/firebaseClient'
import classNames from 'classnames'
import { useAppState } from '@contexts/state';
import { useRouter } from 'next/dist/client/router'


export default function Home() {
  const { signin, toggleMode, setOrigin } = useAppState();
  const [roleCur, setRoleCur] = useState(0);
  const roleList = ['Fan', 'Organizer']
  const router = useRouter()

  useEffect(() => {
    if (router.query && Object.keys(router.query).length) {
      const { origin, role, prefillEmail } = router.query;
      // load setting from query into state
      console.log('SSO save origin', router.query.origin);
      setOrigin(router.query.origin);
      if (role) {
        setRoleCur(1);
        if (prefillEmail) {
          // TODO: redirect organizer email with prefill value
        }
      }
    }
  }, [router.query]);

  const googleAuth = () => {
    return new Promise<any>((resolve, reject) => {
      const provider = new firebaseClient.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      firebaseClient.auth()
        .signInWithPopup(provider)
        .then(res => {
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
        ? <h2 className="text-4xl font-semibold mb-12 mt-6">Login</h2>
        : <h2 className="text-4xl font-semibold mb-12 mt-6">Sign up</h2>
      }
        <div className="toggle-tab average w-52">
          {roleList.map((item, index) => (
            <div
              key={index}
              className={classNames('toggle-tab-item', { active: roleCur === index })}
              onClick={() => setRoleCur(index)}
            >{item}</div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-xs mx-auto mt-10">
        {
          roleCur === 0 ?
          <Link href="/phone">
            <button className="btn btn-outline-light w-full mb-4">Continue with phone</button>
          </Link> : null
        }
        <Link href={signin ? '/email' : '/sign-up'}>
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
