import { EventResponse } from 'lib/model/event';
import { GroupEvent } from 'lib/model/groupEvent';

import { get, crowdCoreApiHost, chumiApiHost } from './base';

const EVENT_DETAIL_PATH = '/event/{event_id}?source={source}'
const GROUP_EVENT_PATH = '/website/get-group-events/{group_event_id}'

const getEventDetail = async (eventId: string, source: string) => {
    const response = await get<EventResponse>(EVENT_DETAIL_PATH.replace('{event_id}', eventId).replace('{source}', source), chumiApiHost)
    return response || {}
}
const getGroupEvents = async (groupEventId: string) => {
    const response = await get<GroupEvent[]>(GROUP_EVENT_PATH.replace('{group_event_id}', groupEventId), crowdCoreApiHost)
    return response || {}
}

export { getEventDetail, getGroupEvents } 