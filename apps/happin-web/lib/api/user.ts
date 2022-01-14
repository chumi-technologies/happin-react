import { getFromHappin, postToHappin } from './base';
import { UserResponse } from 'lib/model/user';

const USER_INFO_PATH = '/user';
const SEARCH_USER_PATH = '/user/search?searchStr=${searchStr}'
const EXCHANGE_CROWDCORE_TOKEN_PATH = '/user/exchange-saas-token';
const FIREBASE_CUSTOM_TOKEN_PATH ='/user/firebase-custom-token';
const EXCHANGE_DASHBOARD_EVENT_HOST_PATH = '/user/chumi-server-token'

const getUserInfo = async () => {
   const response = await getFromHappin<UserResponse>(USER_INFO_PATH)
   return response || {}
}

const searchUser = async (searchStr:string) => {
   const response = await getFromHappin(SEARCH_USER_PATH.replace('${searchStr}',searchStr))
   return response || {}
}

const exchangeCrowdcoreToken = async () => {
   const response = await postToHappin(EXCHANGE_CROWDCORE_TOKEN_PATH, {})
   return response || {}
}

const getFirebaseCustomToken = async () => {
    const response = await getFromHappin(FIREBASE_CUSTOM_TOKEN_PATH)
    return response || {}
}

// will create event creator on crowdcore server, different than exchangeCrowdcoreToken
const exchangeDashboardEventHostToken = async () => {
   const response = await getFromHappin(EXCHANGE_DASHBOARD_EVENT_HOST_PATH)
   return response || {}
}

export { getUserInfo,searchUser, exchangeCrowdcoreToken, getFirebaseCustomToken, exchangeDashboardEventHostToken }
