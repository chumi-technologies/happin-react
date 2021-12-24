import { getFromCrowdCore, postToCrowdCore,getFromHappin,getFromPaymentGateway,postToPaymentGateway } from './base';

const GET_TOPUP_PACKAGES = '/rewards/top-up/packages'




const getTopUpPackage = async()=> {
    const response = await getFromHappin(GET_TOPUP_PACKAGES);
    return response || {}
}


export {getTopUpPackage}
