import { useAppState } from 'contexts/state';
import Head from 'next/head'

const Layout = ({ children }: { children: any }) => {
  const { origin } = useAppState();
  const onSSOClose = () => {
    window.parent.postMessage({ action: 'close' }, origin);
  };

  return (
    <>
      <Head>
        <title>Happin Auth</title>
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          key="apple"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
          key="icon32"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
          key="icon16"
        />
        <link
          rel="icon"
          href="/favicon.ico"
          key="favicon"
        />
      </Head>
      <div className="login-bg fade-background">
        <div className="login-container fade-in-up">
          <div className="login-close" onClick={onSSOClose}>
            <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 8L40 40" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 40L40 8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          { children }
        </div>
      </div>
    </>
  );
}

export default Layout;
