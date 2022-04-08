import { getFromHappin } from './base';

export const getAppTags = async (size: number, keyword: string) => {
  const response = await getFromHappin(`/app/tags?size=${size}&keyword=${keyword}`);
  return response || {};
};
