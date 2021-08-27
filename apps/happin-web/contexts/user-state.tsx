import { createContext, useContext, useState, useEffect } from 'react';
import { getUserInfo } from "lib/api";
import { User } from 'lib/model/user';

interface UserContext {
  setUserInfo: ()=> Promise<void>,
  clearUser: ()=> void,
  user: User|undefined
}

const userContext = createContext<UserContext>({} as UserContext);

export function UserState({ children }: {children: any}) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const idToken = localStorage.getItem('happin_jwt')
    if (idToken) {
      setUserInfo()
    }
  }, [])

  const setUserInfo = async ()=> {
    if (typeof window !== undefined) {
      try {
        const response = await getUserInfo();
        const user = response.data;
        setUser(user);
      } catch (err) {
        clearUser();
        console.log(err)
      }
    }
  }

  const clearUser = () => {
    setUser(undefined);
    localStorage.removeItem('happin_refresh_token');
    localStorage.removeItem('happin_jwt');
  }


  return (
    <userContext.Provider value={{ user, setUserInfo, clearUser }}>
      {children}
    </userContext.Provider>
  );
}


export function useUserState() {
  return useContext(userContext);
}
