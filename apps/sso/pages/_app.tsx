import '@styles/globals.scss'
import type { AppProps } from 'next/app'
import { AppState } from '../contexts/state'

import { ChakraProvider } from "@chakra-ui/react"
import Layout from '@components/Layout'
import theme from "../theme"

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <AppState>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppState>
    </ChakraProvider>
  )
}
export default App
