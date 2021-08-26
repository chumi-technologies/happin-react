import { createContext, useContext, useState, useEffect } from 'react';
import { getUserInfo } from "lib/api";

const userContext = createContext();

export function UserState({ children }) {
  const [user, setUser] = useState();

  useEffect(() => {
    setUserInfo()
  }, [])

  const setUserInfo = async ()=> {
    if (typeof window !== undefined) {
      try {
        const response = await getUserInfo();
        const user = response.data;
        setUser(user);
        console.log(user)
        return user
      } catch (err) {
        console.log(err)
      }
    }
  }

  const clearUser = () => {
    setUser();
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
