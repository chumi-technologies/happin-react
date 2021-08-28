import { postToHappin } from './base';

const CHECKIN_TICKET__PATH = '/ticket/check-in';

const checkinTicket = async (payload: any) => {
    const response = await postToHappin(CHECKIN_TICKET__PATH, payload)
    return response || {}
}

export {checkinTicket}
