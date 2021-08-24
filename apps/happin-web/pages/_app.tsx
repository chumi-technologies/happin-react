import { ChakraProvider } from "@chakra-ui/react"
import Layout from '@components/Layout'
import theme from "../theme"
import type { AppProps } from 'next/app'
import '@styles/globals.scss'
import { AppState } from '../contexts/state'
import { SSO } from '@components/SSO'
import { SEO } from "@components/SEO";

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AppState>
        <SEO />
        <SSO/>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppState>
    </ChakraProvider>
  )
}
export default App
