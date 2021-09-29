import { createContext, useContext, useState, useEffect } from 'react';
import { exchangeCrowdcoreToken, getUserInfo } from "lib/api";
import { User } from 'lib/model/user';
import { useIntercom } from 'react-use-intercom';

interface UserContext {
  setUserInfo: ()=> Promise<void>,
  clearUser: ()=> void,
  exchangeForCrowdCoreToken: ()=>Promise<void>,
  user: User|undefined,
  eventDeepLink: string,
  setEventDeepLink : (arg: string)=>void
}

const userContext = createContext<UserContext>({} as UserContext);

export function UserState({ children }: {children: any}) {
  const [user, setUser] = useState<User>();
  const [eventDeepLink, setEventDeepLink] = useState<string>('');
  const {
    boot,
    shutdown,
    update,
  } = useIntercom();

  useEffect(() => {
    const idToken = localStorage.getItem('happin_jwt')
    if (idToken) {
      setUserInfo()
    }
  }, [])

  const setUserInfo = async ()=> {
    if (typeof window !== 'undefined') {
      try {
        const response = await getUserInfo();
        const user = response.data;
        setUser(user);
        update({email: user.email, userId: user._id})
      } catch (err) {
        clearUser();
        console.log(err)
      }
    }
  }

  const exchangeForCrowdCoreToken = async ()=> {
    if (typeof window !== 'undefined') {
      try {
          const response = await exchangeCrowdcoreToken();
          const token = response?.data?.token;
          localStorage.setItem('chumi_jwt',token);
      } catch (err) {
        console.log(err)
      }
    }
  }

  const clearUser = () => {
    setUser(undefined);
    shutdown()
    boot()
    localStorage.removeItem('happin_refresh_token');
    localStorage.removeItem('happin_jwt');
    localStorage.removeItem('chumi_jwt')
  }


  return (
    <userContext.Provider value={{ user, setUserInfo, clearUser, exchangeForCrowdCoreToken, eventDeepLink, setEventDeepLink }}>
      {children}
    </userContext.Provider>
  );
}


export function useUserState() {
  return useContext(userContext);
}
