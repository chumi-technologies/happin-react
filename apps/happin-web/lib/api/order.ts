import { getFromCrowdCore, postToCrowdCore } from './base';

const SUBMIT_PAYMENT_PATH = '/payment'
const GET_PAYMENT_STATUS = '/payment/order/{orderId}/status'

const submitPayment = async(payload: any)=> {
    const response = await postToCrowdCore(SUBMIT_PAYMENT_PATH, payload);
    return response || {}
}

const getOrderStatus = async(orderId: string)=> {
    const response = await getFromCrowdCore(GET_PAYMENT_STATUS.replace('{orderId}', orderId));
    return response || {}
}

export {submitPayment, getOrderStatus}
