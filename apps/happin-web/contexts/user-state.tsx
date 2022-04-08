import { createContext, useContext, useEffect, useState } from 'react';
import { exchangeCrowdcoreToken, getUserInfo } from 'lib/api';
import { User } from 'lib/model/user';

interface UserContext {
  setUserInfo: () => Promise<void>,
  clearUser: () => void,
  exchangeForCrowdCoreToken: () => Promise<void>,
  user: User | undefined,
  eventDeepLink: string,
  setEventDeepLink: (arg: string) => void
}

const userContext = createContext<UserContext>({} as UserContext);

export function UserState({ children }: { children: any }) {
  const [user, setUser] = useState<User>();
  const [eventDeepLink, setEventDeepLink] = useState<string>('');

  useEffect(() => {
    const idToken = localStorage.getItem('happin_web_jwt');
    if (idToken) {
      (async () => {
        await setUserInfo();
      })();
    }
  }, []);

  const setUserInfo = async () => {
    if (typeof window !== 'undefined') {
      try {
        const response = await getUserInfo();
        const user = response.data;
        setUser(user);
      } catch (err) {
        clearUser();
        console.log(err);
      }
    }
  };

  const exchangeForCrowdCoreToken = async () => {
    if (typeof window !== 'undefined') {
      try {
        const response = await exchangeCrowdcoreToken();
        const token = response?.data?.token;
        localStorage.setItem('chumi_jwt', token);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const clearUser = () => {
    setUser(undefined);
    localStorage.removeItem('happin_refresh_token');
    localStorage.removeItem('happin_web_jwt');
    localStorage.removeItem('chumi_jwt');
  };


  return (
    <userContext.Provider value={{
      user,
      setUserInfo,
      clearUser,
      exchangeForCrowdCoreToken,
      eventDeepLink,
      setEventDeepLink
    }}>
      {children}
    </userContext.Provider>
  );
}


export function useUserState() {
  return useContext(userContext);
}
