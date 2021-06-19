import Head from 'next/head'

const Layout = ({ children }: { children: any }) => {
  return (
    <>
      <Head>
        <title>Happin Auth</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      { children }
    </>
  );
}

export default Layout;
