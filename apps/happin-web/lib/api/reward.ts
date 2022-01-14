import { getFromHappin, postToHappin, postToHappin_noBody } from "./base"

const GET_REWARDS = '/rewards'
const POST_CHECKIN = '/rewards/check-in'
const POST_CLAIM= '/rewards/claim'
const GET_HISTORY= '/rewards/transactions?currency=@currency'


const getRewards = async () => {
    const response = await getFromHappin(GET_REWARDS)
    return response || {}
}

const getTransactionHistory = async (currency:string) => {
    const response = await getFromHappin(GET_HISTORY.replace("@currency", currency))
    return response || {}
}


const rewardCheckIn = async () => {
    const response = await postToHappin_noBody(POST_CHECKIN);
    return response || {}
}

const rewardClaim = async (id:string) => {
    const response = await postToHappin(POST_CLAIM, {rewardTaskId: id});
    return response || {}
}



export { getRewards, rewardCheckIn, rewardClaim, getTransactionHistory }
