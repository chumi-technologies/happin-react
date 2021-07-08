import Head from "next/head";
import { Box } from "@chakra-ui/react";

import Header from "./Header";

const Layout = ({ children }: { children: any }) => {
  return (
    <>
      <Head>
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />

      {/* Page Content */}
      <Box h="100vh" bg="black" color="white">
        <Box
          maxW="1440px"
          h="100vh"
          mx="auto"
          pt={{ base: "80px", sm: "88px" }}
        >
          {children}
        </Box>
      </Box>
    </>
  );
};

export default Layout;
