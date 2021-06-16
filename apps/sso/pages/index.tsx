import Link from 'next/Link';
import { useState } from 'react';
import classNames from 'classnames';

export default function Home() {
  const [roleCur, setRoleCur] = useState(0);
  const roleList = ['Fan', 'Organizer']

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="text-center">
          <h2 className="text-4xl font-semibold mb-12 mt-6">Login</h2>
          <div className="toggle-tab average w-56">
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
          <Link href="/phone">
            <button className="btn btn-outline-dark w-full mb-4">Continue with phone</button>
          </Link>
          <button className="btn btn-outline-dark w-full mb-4">Continue with email</button>
          <button className="btn btn-outline-dark w-full mb-4 flex items-center justify-center">
            <img src="/images/google-logo.svg" alt="" width="18" />
            <span className="ml-3">Continue with Google</span>
          </button>
        </div>
        <div className="flex-grow" />
        <div className="w-full max-w-sm mx-auto text-center border-t border-gray-200 border-solid  pt-3 text-sm text-gray-500">
          Can’t login? <Link href="/"><a className="underline transition font-semibold text-rose-500 hover:text-rose-600">Sign up</a></Link> for new user?
        </div>
      </div>
    </div>
  );
}
