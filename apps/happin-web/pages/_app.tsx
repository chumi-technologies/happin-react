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
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_A7jK4iCYHL045qgjjfzAfPxu');

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <UserState>
        <CheckoutState>
          <SSOState>
            <SEO />
            <SSO />
            <Layout>
              <Elements stripe={stripePromise}>
              <Component {...pageProps} />
              </Elements>
            </Layout>
          </SSOState>
        </CheckoutState>
      </UserState>
    </ChakraProvider>
  )
}
export default App
