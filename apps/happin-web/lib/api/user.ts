import { getFromHappin, postToHappin } from './base';
import { UserResponse } from 'lib/model/user';

const USER_INFO_PATH = '/user';
const CCROWDCORE_USER_INFO_PATH = '/user/exchange-saas-token'

const getUserInfo = async () => {
    const response = await getFromHappin<UserResponse>(USER_INFO_PATH)
    return response || {}
}

const setCrowdCoreUserInfo = async () => {
    const response = await postToHappin(CCROWDCORE_USER_INFO_PATH,{})
    return response || {}
}

export { getUserInfo, setCrowdCoreUserInfo } 
