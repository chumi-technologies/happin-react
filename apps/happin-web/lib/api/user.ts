import { getFromHappin, getFromHappin_dev, postToHappin, postToHappin_dev } from './base';
import { UserResponse } from 'lib/model/user';

const USER_INFO_PATH = '/user';
const EXCHANGE_CROWDCORE_TOKEN_PATH = '/user/exchange-saas-token';
const FIREBASE_CUSTOM_TOKEN_PATH ='/user/firebase-custom-token';
const EXCHANGE_DASHBOARD_EVENT_HOST_PATH = '/user/chumi-server-token'
const POST_FOLLOW = '/user/follow?userID={id}'
const GET_FOLLOWED = '/user/follow'
const REMOVE_FOLLOWED = '/user/unfollow?userID={id}'
const GET_GIFTLIST = '/gifts'
const SEND_GIFT = '/gifts/send'

const getUserInfo = async () => {
   const response = await getFromHappin<UserResponse>(USER_INFO_PATH)
   return response || {}
}

const getFollowed = async () => {
   const response = await getFromHappin(GET_FOLLOWED)
   return response || {}
}

const exchangeCrowdcoreToken = async () => {
   const response = await postToHappin(EXCHANGE_CROWDCORE_TOKEN_PATH, {})
   return response || {}
}

const getGiftList = async () => {
   const response = await getFromHappin(GET_GIFTLIST)
   return response || {}
}

const sendGiftTo = async (to: string, giftId: string) => {
   const response = await postToHappin(SEND_GIFT, {to:to, giftId: giftId});
   return response || {}
}

const removeFollowed = async (userId: string) => {
   const response = await postToHappin(REMOVE_FOLLOWED.replace("{id}", userId), {})
   return response || {}
}

const postFollow = async (userId: string) => {
   const response = await postToHappin(POST_FOLLOW.replace("{id}", userId), {})
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

export { getUserInfo, exchangeCrowdcoreToken, getFirebaseCustomToken, exchangeDashboardEventHostToken, postFollow, getFollowed, removeFollowed, getGiftList, sendGiftTo }
