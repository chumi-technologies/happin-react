import { useState } from "react";

import Head from "next/head";
import { Box } from "@chakra-ui/react";

import Header from "./Header";
import MobileAppBar from "../components/MobileAppBar";

const Layout = ({ children }: { children: any }) => {
  const [isMobileBarOpen, setIsMobileBarOpen] = useState(true);

  return (
    <>
      <Head>
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Mobile App Bar for mobile screens */}
      {isMobileBarOpen && (
        <MobileAppBar setIsMobileBarOpen={setIsMobileBarOpen}></MobileAppBar>
      )}

      <Box position="relative">
        {/* Header Section */}
        <Header />

        {/* Page Content */}
        <Box h={{ base: "auto", sm: "100vh" }} bg="black" color="white">
          <Box
            maxW="1440px"
            h={{ base: "auto", sm: "100vh" }}
            mx="auto"
            pt={{ base: "80px", sm: "88px" }}
            pb={{ base: "44px", sm: "0" }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Layout;
