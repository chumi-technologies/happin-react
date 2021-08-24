import { ESSOMode } from '@components/SSO';
import { createContext, useContext, useState, useEffect } from 'react';
import {useRouter} from "next/router";

const AppContext = createContext();

export function AppState({ children }) {
  const [dimmed, setDimmed] = useState(false);
  const [ssoState, setSSOState] = useState({ visible: false, mode: ESSOMode.signIn });
  const router = useRouter();


  const showSSO = () => {
    setDimmed(true);
    setSSOState({
      visible: true,
    });
  }

  const showSSOSignUp = () => {
    setDimmed(true);
    setSSOState({
      visible: true,
      mode: ESSOMode.signUp,
    });
  }

  const hideSSO = () => {
    setDimmed(false);
    setSSOState({ visible: false });
  }

  return (
    <AppContext.Provider value={{
      dimmed,
      ssoState, showSSO, showSSOSignUp, hideSSO,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppContext);
}
