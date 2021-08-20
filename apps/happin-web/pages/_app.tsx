import { ChakraProvider } from "@chakra-ui/react"
import Layout from '@components/Layout'
import theme from "../theme"
import type { AppProps } from 'next/app'
import '@styles/globals.scss'
import { AppState } from '../contexts/state'

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
      <AppState>
        <Component {...pageProps} />
      </AppState>
      </Layout>
    </ChakraProvider>
  )
}
export default App
