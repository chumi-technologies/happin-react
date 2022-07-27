import { EventResponse } from 'lib/model/event';
import { GroupEvent } from 'lib/model/groupEvent';
import type { IThirdPartyEvent } from 'pages/submit-event';
import { getFromCrowdCore, getFromHappin, postToHappin, updateToHappin } from './base';


const EVENT_DETAIL_PATH = '/event/{event_id}?source={source}';
const GROUP_EVENT_PATH = '/website/get-group-events/{group_event_id}';
const EVENT_CHECKOUT_PATH = '/activity/{event_id}';
const WHITE_LABEL_DOMAIN = '/website/activities?domain={domain}';
const SAVE_OR_UNSAVE_EVENT_PATH = '/event/{eventID}/saved';
const GET_EVENT_CATEGORY_PATH = '/activity/api/returnAllEventTags';
const CRAWL_THIRD_PARTY_EVENT_PATH = '/event/crawl';
const POST_EVENT_TO_HAPPIN_PATH = '/event';
const GET_EVENT_SET_PATH = '/event-collections/{id}?expand=true';
const SEARCH_EVENT_PATH = '/event/search';
const POST_EVENT_COLLECTION_PATH = '/event-collections';
const EDIT_EVENT_COLLECTION_PATH = '/event-collections/{id}';
const GET_EVENT_COLLECTIONS_PATH = '/event-collections?creator={creator}';
const POST_EVENT_COLLECTIONS_APPEND = '/event-collections/append';
const POST_EVENT_COLLECTIONS_REMOVE = '/event-collections/remove';

export const getEventDetail = async (eventId: string, source: string) => {
  const response = await getFromHappin<EventResponse>(EVENT_DETAIL_PATH.replace('{event_id}', eventId).replace('{source}', source));
  return response || {};
};
export const getGroupEvents = async (groupEventId: string) => {
  const response = await getFromCrowdCore<GroupEvent[]>(GROUP_EVENT_PATH.replace('{group_event_id}', groupEventId));
  return response || {};
};

export const getEventDetailForCheckout = async (eventId: string) => {
  const response = await getFromCrowdCore(EVENT_CHECKOUT_PATH.replace('{event_id}', eventId));
  return response || {};
};

export const getWhiteLabelDomain = async (domain: string) => {
  const response = await getFromCrowdCore(WHITE_LABEL_DOMAIN.replace('{domain}', domain));
  return response || {};
};

export const saveOrUnsavedEvent = async (eventId: string, save: boolean) => {
  const response = await postToHappin(SAVE_OR_UNSAVE_EVENT_PATH.replace('{eventID}', eventId), save ? { saved: true } : {});
  return response || {};
};

export const getEventCategories = async () => {
  const response = await getFromCrowdCore(GET_EVENT_CATEGORY_PATH);
  return response || {};
};

export const crawlThirdPartyEvent = async (url: string) => {
  const response = await postToHappin(CRAWL_THIRD_PARTY_EVENT_PATH, { url });
  return response || {};
};

export const postEventToHappin = async (data: IThirdPartyEvent) => {
  const response = await postToHappin(POST_EVENT_TO_HAPPIN_PATH, data);
  return response || {};
};

export const getEventCollection = async (collectionId: string) => {
  const response = await getFromHappin(GET_EVENT_SET_PATH.replace('{id}', collectionId));
  return response || {};
};

export const getEventCollections = async (creator: string) => {
  const response = await getFromHappin(GET_EVENT_COLLECTIONS_PATH.replace('{creator}', creator));
  return response || {};
};

export const postEventCollectionToHappin = async (data: any) => {
  const response = await postToHappin(POST_EVENT_COLLECTION_PATH, data);
  return response || {};
};
export const postEventCollectionAppend = async (data: any) => {
  const response = await postToHappin(POST_EVENT_COLLECTIONS_APPEND, data);
  return response || {};
};
export const postEventCollectionRemove = async (data: any) => {
  const response = await postToHappin(POST_EVENT_COLLECTIONS_REMOVE, data);
  return response || {};
};
export const editEventCollection = async (data: any, id: string) => {
  const response = await updateToHappin(EDIT_EVENT_COLLECTION_PATH.replace('{id}', id), data);
  return response || {};
};

export const searchEvent = async (searchWord: string) => {
  const response = await getFromHappin(SEARCH_EVENT_PATH + `?searchString=${searchWord}`);
  return response || {};
};
export const getCollectionEvents = async (collection: string, page: number, pageSize: number) => {
  const response = await getFromHappin(
    `/event-collections/${collection}/events?onlyUpcoming=false&page=${page}&pageSize=${pageSize}`
  );
  return response || {};
};

