import { getFromCrowdCore, postToCrowdCore } from './base';

const SUBMIT_PAYMENT_PATH = '/payment'
const GET_PAYMENT_STATUS = '/payment/order/{orderId}/status'
const EVENT_MERCH_ORDER_SUMMARY = '/orders/summary?activityId={event_id}'

const submitPayment = async(payload: any)=> {
    const response = await postToCrowdCore(SUBMIT_PAYMENT_PATH, payload);
    return response || {}
}

const getOrderStatus = async(orderId: string)=> {
    const response = await getFromCrowdCore(GET_PAYMENT_STATUS.replace('{orderId}', orderId));
    return response || {}
}

const getMerchOrdersSummary = async (eventId:string) => {
    const response = await getFromCrowdCore(EVENT_MERCH_ORDER_SUMMARY.replace('{event_id}', eventId));
    return response || {}
}

export {submitPayment, getOrderStatus, getMerchOrdersSummary}
