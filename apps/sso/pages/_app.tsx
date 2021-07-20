import '@styles/globals.scss'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppState } from '../contexts/state'

import { ChakraProvider } from "@chakra-ui/react"
import Layout from '@components/Layout'
import theme from "../theme"

function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <ToastContainer />
      <AppState>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AppState>
    </ChakraProvider>
  )
}
export default App
