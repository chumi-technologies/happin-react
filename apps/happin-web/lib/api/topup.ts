import { TopupInput } from 'lib/model/topup';
import { getFromCrowdCore, postToCrowdCore,getFromHappin,getFromPaymentGateway,postToPaymentGateway, postToHappin } from './base';

const GET_TOPUP_PACKAGES = '/rewards/top-up/packages'
const POST_TOPUP = '/rewards/top-up'




const getTopUpPackage = async()=> {
    const response = await getFromHappin(GET_TOPUP_PACKAGES);
    return response || {}
}

const postTopUp = async(data: TopupInput) => {
    const response = await postToHappin(POST_TOPUP, data);
    return response || {}
}

export {getTopUpPackage, postTopUp}
