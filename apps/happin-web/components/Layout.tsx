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
      <Box h="100vh">
        <Header></Header>
        {children}
      </Box>
    </>
  );
};

export default Layout;
