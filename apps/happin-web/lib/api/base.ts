import axios from 'axios';
import jwt_decode from "jwt-decode";

interface refreshTokenResponse {
  refresh_token: string;
  id_token: string;
}

const happinApiHost = process.env.NEXT_PUBLIC_HAPPIN_SERVER_HOST
const crowdCoreApiHost = process.env.NEXT_PUBLIC_CROWD_CORE_HOST
const firebaseTokenHost = process.env.NEXT_PUBLIC_FIREBASE_TOKEN_HOST
const paymentGatewayHost = process.env.NEXT_PUBLIC_PAYMENT_GATEWAY_HOST

const HEADER: { [key: string]: string } = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

const instanceHappin = axios.create({
  baseURL: happinApiHost,
  headers: HEADER
})

const instanceCrowCore = axios.create({
  baseURL: crowdCoreApiHost,
  headers: HEADER
})

const instancePaymentGateway = axios.create({
  baseURL: paymentGatewayHost,
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
    idToken = window.localStorage.getItem('happin_web_jwt');
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

instancePaymentGateway.interceptors.request.use(
  (config) => {
    const idToken = getLocalStorageCrowdCoreIDToken();
    if(idToken) {
      let decoded: any = jwt_decode(idToken);
       if(decoded.happinUID) {
         config.headers['userid'] = decoded.happinUID;
       }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error)
  }
)


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
    const originalConfig = err.config;
    if (err.response) {
      if (err.response.data.message.includes('expired') && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const response = await refreshToken();
          const {id_token, refresh_token} = response;
          window.localStorage.setItem('happin_web_jwt', id_token);
          window.localStorage.setItem('happin_refresh_token', refresh_token);
          instanceHappin.defaults.headers.common['authorization'] = `Bearer ${id_token}`;
          return instanceHappin(originalConfig)
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

instanceCrowCore.interceptors.request.use(
  (config) => {
    const idToken = getLocalStorageCrowdCoreIDToken();
    if (idToken) {
      config.headers['authorization'] = `Bearer ${idToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error)
  }
)

const getLocalStorageCrowdCoreIDToken = () => {
  let idToken;
  if (typeof window !== 'undefined'){
    idToken = window.localStorage.getItem('chumi_jwt');
  }
  return idToken;
}

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
    const result = await instanceHappin.get<T>(path)
    return result.data
  } catch (error) {
    throw error
  }
}

export const postToHappin = async(path:string, payload: any) => {
  try {
    const result = await instanceHappin.post(path, payload);
    return result.data
  } catch (error) {
    throw error
  }
}

export const postToHappin_noBody = async(path:string) => {
  try {
    const result = await instanceHappin.post(path);
    return result.data
  } catch (error) {
    throw error
  }
}

export const postToCrowdCore = async(path:string, payload: any) => {
  try {
    const result = await instanceCrowCore.post(path, payload);
    return result.data
  } catch (error) {
    throw error
  }
}

export const updateToHappin = async(path:string, payload: any) => {
  try {
    const result = await instanceHappin.put(path, payload);
    return result.data
  } catch (error) {
    throw error
  }
}

export const updateToCrowdCore = async(path:string, payload: any) => {
  try {
    const result = await instanceCrowCore.put(path, payload);
    return result.data
  } catch (error) {
    throw error
  }
}

export const deleteFromCrowdCore = async(path:string) => {
  try {
    const result = await instanceCrowCore.delete(path);
    return result
  } catch (error) {
    throw error
  }
}

export const getFromCrowdCore = async<T = any>(path: string) => {
  try {
    const result = await instanceCrowCore.get<T>(path)
    return result.data
  } catch (error) {
    throw error
  }
}

export const getFromPaymentGateway = async<T = any>(path: string) => {
  try {
    const result = await instancePaymentGateway.get<T>(path)
    return result.data
  } catch (error) {
    throw error
  }
}

export const postToPaymentGateway = async(path:string, payload: any) => {
  try {
    const result = await instancePaymentGateway.post(path, payload);
    return result.data
  } catch (error) {
    throw error
  }
}

export {
  happinApiHost,
  crowdCoreApiHost,
  paymentGatewayHost,
}
