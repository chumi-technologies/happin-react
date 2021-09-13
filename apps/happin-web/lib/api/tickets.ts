import { TicketItemDataProps } from 'lib/model/checkout';
import { getFromCrowdCore, postToHappin, postToCrowdCore } from './base';

const CHECKIN_TICKET_PATH = '/ticket/check-in';
const GET_GA_TICKET_PATH = '/v2/tickets/general-admission?acid={acid}'
const GET_MERCH_PATH = '/v2/merchandise?withActivities=true&source=sass&activityId={acid}'
const VALIADTE_CODE_PATH = '/codes/validate?activityId={acid}&code={code}'
const LOCK_CHECKOUT_PATH = '/payment/order'

const checkinTicket = async (payload: any) => {
    const response = await postToHappin(CHECKIN_TICKET_PATH, payload)
    return response || {}
}

const getGATickets = async (acid: string) => {
    const response = await getFromCrowdCore(GET_GA_TICKET_PATH.replace('{acid}',acid))
    return response || {}
}

const getEventMerchs = async (acid: string)=> {
    const response = await getFromCrowdCore(GET_MERCH_PATH.replace('{acid}',acid));
    return response || {}
}

const validateCode = async (acid: string, code: string)=> {
    const response = await getFromCrowdCore(VALIADTE_CODE_PATH.replace('{acid}',acid).replace('{code}',code));
    return response || {}
}

const lockCheckoutTickets = async(payload: any)=> {
    const response = await postToCrowdCore(LOCK_CHECKOUT_PATH, payload);
    return response || {}
}

export {checkinTicket, getGATickets, getEventMerchs, validateCode, lockCheckoutTickets}
