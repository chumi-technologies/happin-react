import { useState } from "react";
import Head from "next/head";
import Header from "./Header";
import MobileAppBar from "../components/MobileAppBar";

const Layout = ({ children }: { children: any }) => {
  const [isMobileBarOpen, setIsMobileBarOpen] = useState(true);

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
      <div className="flex flex-col h-full">
        <Header />
        {children}
      </div>
    </>
  );
};

export default Layout;
