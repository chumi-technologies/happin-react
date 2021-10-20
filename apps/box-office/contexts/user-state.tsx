import { createContext, useContext, useState, useEffect } from 'react';
import { exchangeCrowdcoreToken, getUserInfo, swtichTeam } from "lib/api";
import { User,SaasUser,connectTeamResponse } from 'lib/model/user';

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
  connectedTeam:connectTeamResponse[]|[],
  setConnectedTeam: (arg:connectTeamResponse[]|[])=>void,
  sasaUserInfo:SaasUser|undefined,
  setSaasUserInfo:(args:SaasUser|undefined)=>void,
  saasUserRole:string,
  setSaasUserRole:(args:string)=>void,
}

const userContext = createContext<UserContext>({} as UserContext);

export function UserState({ children }: {children: any}) {
  const [user, setUser] = useState<User>();
  const [eventDeepLink, setEventDeepLink] = useState<string>('');
  const [teamUser,setTeamUser]= useState<boolean>(false);
  const [affiliation,setAffiliation]= useState<connectTeamResponse>();
  const [partnerId, setPartnerId ] = useState<string>('');
  const [crowdCoreToken,setCrowdCoreToken] = useState<boolean>(false);
  const [connectedTeam,setConnectedTeam] = useState<connectTeamResponse[]>([]);
  const [sasaUserInfo,setSaasUserInfo] = useState<SaasUser>();
  const [saasUserRole,setSaasUserRole] = useState<string>('');

  useEffect(() => {
    const idToken = localStorage.getItem('happin_jwt')
    if (idToken) {
      setUserInfo()
    }
    const chumiToken = localStorage.getItem('chumi_jwt');
    if (chumiToken){
      setCrowdCoreToken(true)
    }
    const teamUserFromFS = localStorage.getItem('teamUser');
    if(teamUserFromFS) {
      setTeamUser(JSON.parse(teamUserFromFS))
    }
    const connectedTeamFS = localStorage.getItem('connectedTeam');
    if(connectedTeamFS) {
      setConnectedTeam(JSON.parse(connectedTeamFS));
    }
    const saasUserInfoFS = localStorage.getItem('saasUserInfo');
    if(saasUserInfoFS) {
      setSaasUserInfo(JSON.parse(saasUserInfoFS));
    }
    const partnerIdFS = localStorage.getItem('partnerId');
    if(partnerIdFS) {
      setPartnerId(JSON.parse(partnerIdFS));
    }
    const affiliationFS = localStorage.getItem('affiliation');
    if(affiliationFS) {
      setAffiliation(JSON.parse(affiliationFS));
    }
    const saasUserRoleFS = localStorage.getItem('saasUerRole');
    if(saasUserRoleFS) {
      setSaasUserRole(JSON.parse(saasUserRoleFS));
    }
  }, [])

  const setUserInfo = async ()=> {
    if (typeof window !== 'undefined') {
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

  const exchangeForCrowdCoreToken = async ()=> {
    const idToken = localStorage.getItem('happin_jwt')
    if (typeof window !== 'undefined' && idToken) {
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
    setTeamUser(false);
    setUser(undefined);
    setAffiliation(undefined);
    setPartnerId('');
    setCrowdCoreToken(false);
    setConnectedTeam([]);
    setSaasUserInfo(undefined);
    setSaasUserRole('')
    localStorage.removeItem('happin_refresh_token');
    localStorage.removeItem('happin_jwt');
    localStorage.removeItem('chumi_jwt');
    localStorage.removeItem('connectedTeam');
    localStorage.removeItem('saasUserInfo');
    localStorage.removeItem('partnerId');
    localStorage.removeItem('affiliation');
    localStorage.removeItem('teamUser');
    localStorage.removeItem('saasUerRole');
  }

  return (
    <userContext.Provider value={{ user, setUserInfo,clearUser, exchangeForCrowdCoreToken, eventDeepLink, setEventDeepLink, teamUser, setTeamUser, affiliation,
      setAffiliation,partnerId,setPartnerId,crowdCoreToken,setCrowdCoreToken,connectedTeam, setConnectedTeam, sasaUserInfo, setSaasUserInfo, saasUserRole,setSaasUserRole}}>
      {children}
    </userContext.Provider>
  );
}


export function useUserState() {
  return useContext(userContext);
}
