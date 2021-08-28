import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "./Header";
import MobileAppBar from "../components/MobileAppBar";
import { useRouter } from "next/router";

const Layout = ({ children }: { children: any }) => {
  const [isMobileBarOpen, setIsMobileBarOpen] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  // check the param from url, if it contains the userId then we know it's from app, hence hide the top bar
  // save the userId for the final checkout step
  const router = useRouter()
  
  useEffect(() => {
    if (router?.query?.happinUser && router.asPath.includes('/checkout/')) {
      setIsMobileBarOpen(false)
      setShowHeader(false);
      localStorage.setItem('checkout_user_from_app', (router.query.happinUser as string))
    }
  }, [router.query])

  return (
    <>
      <Head>
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      {/* Mobile App Bar for mobile screens */}
      {isMobileBarOpen && (
        <MobileAppBar setIsMobileBarOpen={setIsMobileBarOpen}></MobileAppBar>
      )}

      {/* Header Section */}
      <div className="flex flex-col h-screen">
        {showHeader && <Header />}
        {children}
      </div>
    </>
  );
};

export default Layout;
