import Head from 'next/head'

const Layout = ({ children }: { children: any }) => {
  return (
    <>
      <Head>
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      { children }
    </>
  );
}

export default Layout;
