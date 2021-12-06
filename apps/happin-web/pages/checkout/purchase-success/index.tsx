import { useUserState } from 'contexts/user-state';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const PurchaseSuccess = () => {
  const router = useRouter();
  const [eventTitle, setEventTitle] = useState('');
  const [loginMethodString, setLoginMethodString] = useState('');
  const { user } = useUserState();

  useEffect(()=> {
    if (localStorage.getItem('purchase_item')) {
      setEventTitle(localStorage.getItem('purchase_item') as string)
    }
  }, [])

  useEffect(() => {
    if (user?.email) {
      setLoginMethodString(user.email)
    } else if (user?.phonenumber) {
      setLoginMethodString(user.phonenumber)
    }
  }, [user])

  return (
    <div className="container absolute" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '80%' }}>
      <h1 className="text-center black-title text-xl sm:text-3xl md:text-4xl text-gray-50 font-bold lg:pr-10 mt-1 sm:mt-4">Congrats! You are in</h1>
      <h1 className="text-center black-title text-xl sm:text-3xl md:text-4xl text-gray-50 font-bold lg:pr-10 mt-1 sm:mt-4">{eventTitle}</h1>
      <h1 className="text-center black-title text-base sm:text-xl text-gray-50 mt-1 sm:mt-3">We are saving your tickets to mobile Happin App, you can login with your account {loginMethodString ? `(${loginMethodString})` : ''} to see all the tickets</h1>
      <br />
      <Link href="/">
        <a href={process.env.NEXT_PUBLIC_HAPPIN_APP_APPLE_STORE} rel="noreferrer" target="_blank"><img className="m-auto" src="/images/app-store.svg" alt="App Store" /></a>
      </Link>
      <p className="black-title text-base sm:text-xl text-gray-50 font-bold  m-8 text-center">OR</p>
      <div className="flex justify-center">
        <button onClick={() => { router.push('/my-events') }} className="btn btn-rose !px-0 !font-semibold !rounded-full" >
          <span className="text-sm sm:text-base p-5">Check my tickets on website</span>
        </button>
      </div>
    </div>)
}

export default PurchaseSuccess
