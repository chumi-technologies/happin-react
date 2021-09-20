import { ChakraProvider } from "@chakra-ui/react"
import Layout from '@components/Layout'
import theme from "../theme"
import type { AppProps } from 'next/app'
import '@styles/globals.scss'
import { SSOState } from '../contexts/sso-state'
import { UserState } from '../contexts/user-state'
import { SSO } from '@components/SSO'
import { SEO } from "@components/SEO";
import { CheckoutState } from "contexts/checkout-state"
function App({ Component, pageProps }: AppProps) {

  return (
    <ChakraProvider theme={theme}>
      <UserState>
        <CheckoutState>
          <SSOState>
            <SEO />
            <SSO />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SSOState>
        </CheckoutState>
      </UserState>
    </ChakraProvider>
  )
}
export default App
