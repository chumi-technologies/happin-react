import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "./Header";
import MobileAppBar from "../components/MobileAppBar";
import { useRouter } from "next/router";
import { useCheckoutState } from "contexts/checkout-state";
import classnames from "classnames";
import Footer from "./Footer";
import { getWhiteLabelDomain } from "lib/api";

const Layout = ({ children }: { children: any }) => {
  const [isMobileBarOpen, setIsMobileBarOpen] = useState(true);
  const [isProduction, setIsProduction] = useState(false);
  const [showFooter, setShowFooter] = useState(true);
  const [showHeader, setShowHeader] = useState(true);

  const [isRewardPage, setRewardPage] = useState(false);
  const [isAppRewardPage, setAppRewardPage] = useState(false);

  const [whiteLabelLogo, setWhiteLabelLogo] = useState();
  const [whiteLabelHome, setWhiteLabelHome] = useState('');
  const [checkingWhiteLable, setCheckingWhiteLable] = useState(true);

  const { setBoxOfficeMode , setOnlyShowMerch, setOpenInApp, setTokenPassedIn, openInApp} = useCheckoutState();

  // check the param from url, if it contains the userId then we know it's from app, hence hide the top bar
  // save the userId for the final checkout step
  const router = useRouter()

  useEffect(() => {
    if (router.query?.token && router.asPath.includes('/checkout/')) {
      setTokenPassedIn(true);
      localStorage.setItem('chumi_jwt', router?.query?.token as string);
    }

    if (router.query?.headerHidden) {
      setShowHeader(false);
    }

    if (router.query?.token) {
      localStorage.setItem('chumi_jwt', router?.query?.token as string);
    }

    if (router.query?.fromapp) {
      setIsMobileBarOpen(false);
      setOpenInApp(true);
    }
    if (router.query?.merchonly) {
      setOnlyShowMerch(true);
    }
    //box office mode is only opened from 2b app
    if (router.query?.role === 'boxoffice') {
      setBoxOfficeMode(true);
    }
    if (router.asPath === '/' || router.asPath === '/events') {
      setIsProduction(true)
      setShowFooter(true);
    } else {
      setShowFooter(false);
      setIsProduction(false)
    }
    if (router.asPath === '/reward') {
      setRewardPage(true)
      setShowHeader(false);
    }

    if (router.asPath === '/appreward') {
      setAppRewardPage(true)
      setShowHeader(false);
    }

    if (router.asPath === '/campaign') {
      setShowHeader(false);
    }
  }, [router.query, router.asPath, setBoxOfficeMode])

  useEffect(()=> {
    const hideMobileBar = localStorage.getItem('hide_mobile_bar');
    if (hideMobileBar) {
      setIsMobileBarOpen(false);
    }
  }, [])


  useEffect(()=> {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      //const hostname = 'deadroyaltyproductions.happin.app'
      // && !hostname.includes('localhost')
      if (hostname !== 'happin.app' && !hostname.includes('localhost')) {
        whiteLabelDomain(hostname)
      } else {
        setCheckingWhiteLable(false)
      }
    }
  }, [])

  const whiteLabelDomain = async (domain: string) => {
    try {
      const response = await getWhiteLabelDomain(domain);
      if (response.domainLogo) {
        const logo = response.domainLogo.startsWith('https') ? response.domainLogo : 'https://images.chumi.co/' + response.domainLogo
        setWhiteLabelLogo(logo)
        setWhiteLabelHome(response.clientUrl);
      }
      setCheckingWhiteLable(false)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <Head>
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <main className={classnames('main-app', {'production': isProduction, 'reward-page': isRewardPage, 'app-reward-page': isAppRewardPage})}>
        {/* Mobile App Bar for mobile screens */}
        {/* Header Section */}
        {(!openInApp && showHeader) &&
          <Header whiteLabelLogo={whiteLabelLogo} whiteLabelHome={whiteLabelHome} checkingWhiteLable={checkingWhiteLable}>
            {/* { isMobileBarOpen && <MobileAppBar setIsMobileBarOpen={setIsMobileBarOpen} /> } */}
          </Header>
        }
        {children}
        {showFooter &&  <Footer whiteLabelLogo={whiteLabelLogo}></Footer>}
      </main>
    </>
  );
};

export default Layout;
