import { EventResponse } from 'lib/model/event';
import { GroupEvent } from 'lib/model/groupEvent';

import { getFromHappin, getFromCrowdCore, postToHappin } from './base';

const EVENT_DETAIL_PATH = '/event/{event_id}?source={source}'
const GROUP_EVENT_PATH = '/website/get-group-events/{group_event_id}'
const EVENT_CHECKOUT_PATH = '/activity/{event_id}'
const WHITE_LABEL_DOMAIN = '/website/activities?domain={domain}'
const SAVE_OR_UNSAVE_EVENT_PATH = '/event/{eventID}/saved'

const getEventDetail = async (eventId: string, source: string) => {
    const response = await getFromHappin<EventResponse>(EVENT_DETAIL_PATH.replace('{event_id}', eventId).replace('{source}', source))
    return response || {}
}
const getGroupEvents = async (groupEventId: string) => {
    const response = await getFromCrowdCore<GroupEvent[]>(GROUP_EVENT_PATH.replace('{group_event_id}', groupEventId))
    return response || {}
}

const getEventDetailForCheckout =  async (eventId: string) => {
    const response = await getFromCrowdCore(EVENT_CHECKOUT_PATH.replace('{event_id}', eventId));
    return response || {}
}

const getWhiteLabelDomain = async (domain: string)=> {
    const response = await getFromCrowdCore(WHITE_LABEL_DOMAIN.replace('{domain}', domain));
    return response || {}
}

const saveOrUnsavedEvent = async (eventId: string)=> {
    const response = await postToHappin(SAVE_OR_UNSAVE_EVENT_PATH.replace('{eventID}', eventId), {});
    return response || {}
}

export { getEventDetail, getGroupEvents, getEventDetailForCheckout, getWhiteLabelDomain, saveOrUnsavedEvent } 
