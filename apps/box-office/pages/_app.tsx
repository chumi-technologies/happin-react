import { ChakraProvider } from "@chakra-ui/react"
import Layout from '@components/Layout'
import theme from "../theme"
import type { AppProps } from 'next/app'
import '@styles/globals.scss'
import { SSOState } from '../contexts/sso-state'
import { UserState } from '../contexts/user-state'
import { SSO } from '@components/SSO'
import { SEO } from "@components/SEO";

function App({ Component, pageProps }: AppProps) {
  
  return (
    <ChakraProvider theme={theme}>
        <UserState>
            <SSOState>
              <SEO />
              <SSO />
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </SSOState>
        </UserState>
    </ChakraProvider>
  )
}
export default App
