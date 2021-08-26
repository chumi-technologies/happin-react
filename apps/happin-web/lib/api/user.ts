import { getFromHappin } from './base';
import { User } from 'lib/model/user';

const USER_INFO_PATH = '/user';


const getUserInfo = async () => {
    const response = await getFromHappin<User>(USER_INFO_PATH)
    return response || {}
}

export { getUserInfo } 
