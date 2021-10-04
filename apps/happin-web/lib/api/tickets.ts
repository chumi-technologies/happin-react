import { TicketItemDataProps } from 'lib/model/checkout';
import { getFromHappin, getFromCrowdCore, postToHappin, postToCrowdCore, deleteFromCrowdCore, updateToCrowdCore } from './base';

const CHECKIN_TICKET_PATH = '/ticket/check-in';
const GET_GA_TICKET_PATH = '/v2/tickets/general-admission?acid={acid}'
const GET_MERCH_PATH = '/v2/merchandise?withActivities=true&source=sass&activityId={acid}'
const VALIADTE_CODE_PATH = '/codes/validate?activityId={acid}&code={code}'
const LOCK_CHECKOUT_PATH = '/payment/order'
const RELEASE_LOCK_CHECKOUT_PATH = '/payment/order/{orderId}'
const UPDATE_ORDER_FROM_CART_PATH = '/payment/order/{orderId}'
const GET_CHECKOUT_FORM_QUESTIONS = '/checkout-form/questions/{acid}'
const EVENT_TICKETS_LIST_PATH = '/ticket/event-list'
const SAVED_EVENT_TICKETS_LIST_PATH = '/event/saved'
const TICKETS_LIST_PATH = '/ticket?eventID={eventId}'
const TICKETS_PLAY_BACK_LIST_PATH ='/ticket/playback?eventID={eventId}'

const checkinTicket = async (payload: any) => {
    const response = await postToHappin(CHECKIN_TICKET_PATH, payload)
    return response || {}
}

const getEventTicketsList = async ()=> {
    const response = await getFromHappin(EVENT_TICKETS_LIST_PATH)
    return response || {}
}

const getTicketsList = async (eventId:string)=> {
    const response = await getFromHappin(TICKETS_LIST_PATH.replace('{eventId}',eventId))
    return response || {}
}

const getSavedEventTicketsList = async()=> {
    const response = await getFromHappin(SAVED_EVENT_TICKETS_LIST_PATH)
    return response || {}
}

const getTicketsPlayBackList = async (eventId:string)=> {
    const response = await getFromHappin(TICKETS_PLAY_BACK_LIST_PATH.replace('{eventId}',eventId))
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

const getCheckoutFormQuestions = async(acid:string) => {
    const response = await getFromCrowdCore(GET_CHECKOUT_FORM_QUESTIONS.replace('{acid}',acid));
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

const releaseLockCheckoutTickets = async(orderId:string) => {
    const response = await deleteFromCrowdCore(RELEASE_LOCK_CHECKOUT_PATH.replace('{orderId}',orderId));
    return response || {}
}

const updateOrderFromCart = async(orderId:string, payload:any) => {
    const response = await updateToCrowdCore(UPDATE_ORDER_FROM_CART_PATH.replace('{orderId}',orderId),payload);
    return response || {}
}
export {checkinTicket, getGATickets, getEventMerchs, validateCode, lockCheckoutTickets, releaseLockCheckoutTickets, updateOrderFromCart, getCheckoutFormQuestions, getEventTicketsList, getSavedEventTicketsList, getTicketsList, getTicketsPlayBackList}
