import { ESSOMode } from '@components/SSO';
import { createContext, useContext, useState } from 'react';

const ssoContext = createContext();

export function SSOState({ children }) {
  const [dimmed, setDimmed] = useState(false);
  const [ssoState, setSSOState] = useState({ visible: false, mode: ESSOMode.signIn });

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
    <ssoContext.Provider value={{
      dimmed,
      ssoState, showSSO, showSSOSignUp, hideSSO,
    }}>
      {children}
    </ssoContext.Provider>
  );
}

export function useSSOState() {
  return useContext(ssoContext);
}
