import { getFromHappin, postToHappin } from './base';
import { UserResponse } from 'lib/model/user';

const USER_INFO_PATH = '/user';
const EXCHANGE_CROWDCORE_TOKEN_PATH = '/user/exchange-saas-token'
const EXCHANGE_DASHBOARD_EVENT_HOST_PATH = '/user/chumi-server-token'

const getUserInfo = async () => {
   const response = await getFromHappin<UserResponse>(USER_INFO_PATH)
   return response || {}
}

const exchangeCrowdcoreToken = async () => {
   const response = await postToHappin(EXCHANGE_CROWDCORE_TOKEN_PATH, {})
   return response || {}
}

// will create event creator on crowdcore server, different than exchangeCrowdcoreToken
const exchangeDashboardEventHostToken = async () => {
   const response = await getFromHappin(EXCHANGE_DASHBOARD_EVENT_HOST_PATH)
   return response || {}
}

export { getUserInfo, exchangeCrowdcoreToken, exchangeDashboardEventHostToken }
