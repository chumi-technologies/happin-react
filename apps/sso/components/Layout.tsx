import Head from 'next/head'

const Layout = ({ children }: { children: any }) => {
  return (
    <div>
      <Head>
        <title>Happin Auth</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      { children }
    </div>
  );
}
 
export default Layout;