import axios from 'axios';

interface refreshTokenResponse {
  refresh_token: string;
  id_token: string;
}

const happinApiHost = process.env.NEXT_PUBLIC_HAPPIN_SERVER_HOST
const crowdCoreApiHost = process.env.NEXT_PUBLIC_CROWD_CORE_HOST
const firebaseTokenHost = process.env.NEXT_PUBLIC_FIREBASE_TOKEN_HOST

const HEADER: { [key: string]: string } = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

const instanceHappin = axios.create({
  baseURL: happinApiHost,
  headers: HEADER
})

const instanceCrowCore = axios.create({
  baseURL: happinApiHost,
  headers: HEADER
})

const instanceFirebaseAPI = axios.create({
  baseURL: firebaseTokenHost,
  headers: {
    'Content-type': 'application/x-www-form-urlencoded'
  }
})

const getLocalStorageIDToken = () => {
  let idToken;
  if (typeof window !== 'undefined'){
    idToken = window.localStorage.getItem('happin_jwt');
  }
  return idToken;
}

const getLocalStorageRefreshToken = () => {
  let refreshToken
  if (typeof window !== 'undefined') {
    refreshToken = window.localStorage.getItem('happin_refresh_token')
  }
  return refreshToken;
}

instanceHappin.interceptors.request.use(
  (config) => {
    const idToken = getLocalStorageIDToken();
    if (idToken) {
      config.headers['authorization'] = `Bearer ${idToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error)
  }
)

instanceHappin.interceptors.response.use(
  (res)=> {
    return res;
  },
  async (err) => {
    const oringinalConfig = err.config;
    if (err.response) {
      if (err.response.data.message.includes('expired') && !oringinalConfig._retry) {
        oringinalConfig._retry = true;
        try {
          const response = await refreshToken();
          const {id_token, refresh_token} = response;
          window.localStorage.setItem('happin_jwt', id_token);
          window.localStorage.setItem('happin_refresh_token', refresh_token);
          instanceHappin.defaults.headers.common['authorization'] = `Bearer ${id_token}`;
          return instanceHappin(oringinalConfig)
        } catch (_error) {
          if(_error.response && _error.response.data) {
            return Promise.reject(_error.response.data)
          }

          return Promise.reject(_error);
        }
      }
      return Promise.reject(err.response)
    }
    return Promise.reject(err)
  }
)




const refreshToken = async (): Promise<refreshTokenResponse> => {
  const refreshToken = getLocalStorageRefreshToken();
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken as string);
  const result = await instanceFirebaseAPI.post('', params);
  const {id_token, refresh_token} = result.data;
  return {id_token, refresh_token};
}

export const getFromHappin = async<T = any>(path: string) => {
  try {
    const result = await instanceHappin.get(path)
    return result.data
  } catch (error) {
    throw error
  }
}

export const getFromCrowdCore = async<T = any>(path: string) => {
  try {
    const result = await instanceCrowCore.get(path)
    return result.data
  } catch (error) {
    throw error
  }
}


export {
  happinApiHost,
  crowdCoreApiHost,
}
