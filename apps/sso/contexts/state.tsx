import { createContext, useContext, useState } from 'react';

interface AppContextInterface {
  signin: boolean;
  toggleMode: () => void;
  origin: string;
  setOrigin: (arg0: string) => void;
  role: ERole;
  setRole: (arg0: ERole) => void;
}
const AppContext = createContext<AppContextInterface>({} as AppContextInterface);

enum ERole {
  fan = 'Fan',
  organizer = 'Organizer',
}
enum ESSOMode {
  signIn = 'sign-in',
  signUp = 'sign-up',
}

function AppState({ children }: { children: any }) {
  const [signin, setSignin] = useState(true);
  const [origin, setOrigin] = useState('');
  const [role, setRole] = useState(ERole.fan);

  const toggleMode = () => {
    setSignin(s => !s);
  }

  return (
    <AppContext.Provider value={{
      signin, toggleMode,
      origin, setOrigin,
      role, setRole,
    }}>
      {children}
    </AppContext.Provider>
  );
}

function useAppState() {
  return useContext(AppContext);
}

export { AppState, ERole, useAppState, ESSOMode };
