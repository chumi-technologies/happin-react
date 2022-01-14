import { getFromCrowdCore, postToCrowdCore,getFromHappin,getFromPaymentGateway,postToPaymentGateway } from './base';

const SUBMIT_PAYMENT_PATH = '/payment'
const SUBMIT_POINT_PAYMENT_PATH = '/payment/app/chargeCustomerCard'
const GET_PAYMENT_STATUS = '/payment/order/{orderId}/status'
const EVENT_MERCH_ORDER_SUMMARY = '/orders/summary?activityId={event_id}'
const GET_POINT_PACKAGES = '/payment/point-packages'
const GET_PAYMENT_METHODS = '/payment/app/getPaymentMethodsByStripeCustomerIdAndProcessorOnApp/${currency}/${userId}'

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

const getPointPackages = async()=> {
    const response = await getFromHappin(GET_POINT_PACKAGES);
    return response || {}
}

const getPaymentMethods = async (currency:string,userId:string)=>{
    const response = await getFromPaymentGateway(GET_PAYMENT_METHODS.replace('${currency}',currency).replace('${userId}',userId));
    return response || {}
}

const submitPointPayment = async(payload: any)=> {
    const response = await postToPaymentGateway(SUBMIT_POINT_PAYMENT_PATH, payload);
    return response || {}
}

export {submitPayment, getOrderStatus, getMerchOrdersSummary,getPointPackages, getPaymentMethods,submitPointPayment}
