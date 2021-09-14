import { getFromHappin, postToHappin } from './base';
import { UserResponse } from 'lib/model/user';

const USER_INFO_PATH = '/user';
const EXCHANGE_CROWDCORE_TOKEN_PATH = '/user/exchange-saas-token'

const getUserInfo = async () => {
    const response = await getFromHappin<UserResponse>(USER_INFO_PATH)
    return response || {}
}

const exchangeCrowdcoreToken = async () => {
    const response = await postToHappin(EXCHANGE_CROWDCORE_TOKEN_PATH,{})
    return response || {}
}

export { getUserInfo, exchangeCrowdcoreToken } 
