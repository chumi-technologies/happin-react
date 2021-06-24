import Head from 'next/head'

const Layout = ({ children }: { children: any }) => {
  return (
    <>
      <Head>
        <title>Happin Auth</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="login-bg fade-background">
        <div className="login-container fade-in-up">
          <div className="login-close">
            <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 8L40 40" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 40L40 8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          { children }
        </div>
      </div>
    </>
  );
}

export default Layout;
