import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppState({ children }) {
  const [signin, setSignin] = useState(true);

  const toggleMode = () => {
    setSignin(signin => !signin);
  }

  return (
    <AppContext.Provider value={{signin, toggleMode}}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppContext);
}