import { useEffect, useState } from "react";
import Head from "next/head";
import Header from "./Header";
import MobileAppBar from "../components/MobileAppBar";
import { useRouter } from "next/router";
import { useCheckoutState } from "contexts/checkout-state";

const Layout = ({ children }: { children: any }) => {
  // TODO  IMPORTANT BECAUSE HAPPIN WEB ANGULAR IS STILL OUR EVENT DETAIL
  // PAGE THIS HAPPIN REACT IS ONY WORK AS A CHECKOUT PAGE CURRENTLY, HENCE NO NEED TO
  // SHOW HEADER AND MOBILE BAR FOR NOW, NEED TO CHANGE BACK ONCE HAPPIN WEB
  // ANGULAR IS DEPREICATED.
  const [isMobileBarOpen, setIsMobileBarOpen] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const { setBoxOfficeMode , setOnlyShowMerch, setOpenInApp, setTokenPassedIn} = useCheckoutState();

  // check the param from url, if it contains the userId then we know it's from app, hence hide the top bar
  // save the userId for the final checkout step
  const router = useRouter()

  useEffect(() => {
    if (router?.query?.token && router.asPath.includes('/checkout/')) {
      setIsMobileBarOpen(false);
      setShowHeader(false);
      setTokenPassedIn(true);
      localStorage.setItem('chumi_jwt', router?.query?.token as string);
    }
    if (router?.query?.fromapp) {
      //setIsMobileBarOpen(false);
      //setShowHeader(false);
      setOpenInApp(true);
    }
    if (router?.query?.merchonly) {
      setOnlyShowMerch(true);
    }
    //box office mode is only opened in 2b app, hide the header
    if (router?.query?.role === 'boxoffice') {
      setBoxOfficeMode(true);
    }
  }, [router.query, router.asPath, setBoxOfficeMode])

  useEffect(()=> {
    const hideMobileBar = localStorage.getItem('hide_mobile_bar');
    if (hideMobileBar) {
      setIsMobileBarOpen(false);
    }
  }, [])

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
      <div className="sm:flex sm:flex-col sm:h-screen">
        {showHeader && <Header/>}
        {children}
      </div>
    </>
  );
};

export default Layout;
