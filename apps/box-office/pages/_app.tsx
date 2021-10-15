import { ChakraProvider } from "@chakra-ui/react"
import Layout from '@components/Layout'
import theme from "../theme"
import type { AppProps } from 'next/app'
import '@styles/globals.scss'
import { SSOState } from '../contexts/sso-state'
import { UserState } from '../contexts/user-state'
import { SSO } from '@components/SSO'
import { SEO } from "@components/SEO";
import { IntercomProvider } from 'react-use-intercom';

function App({ Component, pageProps }: AppProps) {
  
  return (
    <ChakraProvider theme={theme}>
      <IntercomProvider appId={process.env.NEXT_PUBLIC_INTERCOM_APP_ID as string} autoBoot={true}>
        <UserState>
            <SSOState>
              <SEO />
              <SSO />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </SSOState>
        </UserState>
      </IntercomProvider>
    </ChakraProvider>
  )
}
export default App
