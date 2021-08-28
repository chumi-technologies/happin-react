import { getFromHappin } from './base';
import { UserResponse } from 'lib/model/user';

const USER_INFO_PATH = '/user';


const getUserInfo = async () => {
    const response = await getFromHappin<UserResponse>(USER_INFO_PATH)
    return response || {}
}

export { getUserInfo } 
