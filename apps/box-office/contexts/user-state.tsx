import { createContext, useContext, useState, useEffect } from 'react';
import { exchangeCrowdcoreToken, getUserInfo, swtichTeam } from "lib/api";
import { User,connectTeamResponse } from 'lib/model/user';
import { useIntercom } from 'react-use-intercom';

interface UserContext {
  setUserInfo: ()=> Promise<void>,
  clearUser: ()=> void,
  exchangeForCrowdCoreToken: ()=>Promise<void>,
  user: User|undefined,
  eventDeepLink: string,
  setEventDeepLink : (arg: string)=>void,
  teamUser:boolean,
  setTeamUser: (arg:boolean)=>void,
  affiliation:connectTeamResponse|undefined,
  setAffiliation: (arg:connectTeamResponse|undefined)=>void,
  partnerId:string,
  setPartnerId: (arg:string)=>void,
  crowdCoreToken:boolean,
  setCrowdCoreToken:(arg:boolean)=>void,
}

const userContext = createContext<UserContext>({} as UserContext);

export function UserState({ children }: {children: any}) {
  const [user, setUser] = useState<User>();
  const [eventDeepLink, setEventDeepLink] = useState<string>('');
  const [teamUser,setTeamUser]= useState<boolean>(false);
  const [affiliation,setAffiliation]= useState<connectTeamResponse>();
  const [partnerId, setPartnerId ] = useState<string>('');
  const [crowdCoreToken,setCrowdCoreToken] = useState<boolean>(false);

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
          setCrowdCoreToken(true);
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
    setTeamUser(false);
    setAffiliation(undefined);
    setPartnerId('');
    setCrowdCoreToken(false);
  }

  return (
    <userContext.Provider value={{ user, setUserInfo,clearUser, exchangeForCrowdCoreToken, eventDeepLink, setEventDeepLink, teamUser, setTeamUser, affiliation,
      setAffiliation,partnerId,setPartnerId,crowdCoreToken,setCrowdCoreToken }}>
      {children}
    </userContext.Provider>
  );
}


export function useUserState() {
  return useContext(userContext);
}
