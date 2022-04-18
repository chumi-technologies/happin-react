import { getFromHappin } from './base';

export const getAppTags = async (size: number, keyword: string) => {
  const response = await getFromHappin(`/app/tags?size=${size}&keyword=${keyword}`);
  return response || {};
};
export const getSearchEvent = async (keyword: string) => {
  const response = await getFromHappin(`/app/search?searchType=event&keyword=${keyword}`);
  return response || {};
};
