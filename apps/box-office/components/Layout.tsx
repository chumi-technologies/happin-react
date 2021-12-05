import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "./Header";
import MobileAppBar from "../components/MobileAppBar";
import { useRouter } from "next/router";
import classnames from "classnames";
import Footer from "./Footer";
import { getWhiteLabelDomain } from "lib/api";

const Layout = ({ children }: { children: any }) => {
  const [isMobileBarOpen, setIsMobileBarOpen] = useState(true);
  const [isHomePage, setHomePage] = useState(false);
  const [isRewardPage, setRewardPage] = useState(false);
  const [isAppRewardPage, setAppRewardPage] = useState(false);
  const [showFooter, setShowFooter] = useState(true);
  const [showHeader, setShowHeader] = useState(true);

  // check the param from url, if it contains the userId then we know it's from app, hence hide the top bar
  // save the userId for the final checkout step
  const router = useRouter()

  useEffect(() => {
    // 测试
    if (router.asPath === '/') setHomePage(true); else setHomePage(false)
    // end 测试
    //box office mode is only opened from 2b app
    if (!(router.asPath === '/')) {
      setShowFooter(false);
    } else {
      setShowFooter(true);
    }

    if (router.query?.fromapp) {
      setShowHeader(false);
    }

    if (router.asPath === '/reward') {
      setRewardPage(true)
      setShowHeader(false);
    }

    if (router.asPath === '/appreward') {
      setAppRewardPage(true)
      setShowHeader(false);
    }
  }, [router.query, router.asPath])

  return (
    <>
      <Head>
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>
      <main className={classnames('main-app', {'home-page': isHomePage, 'reward-page': isRewardPage, 'app-reward-page': isAppRewardPage})}>
        {/* Mobile App Bar for mobile screens */}
        {/* Header Section */}
          {(showHeader && !isHomePage) && <Header>
          </Header>}
        {children}
      </main>
      {(showFooter && !isHomePage) &&  <Footer></Footer>}
    </>
  );
};

export default Layout;
