import { getFromCrowdCore } from './base';

const WHITE_LABEL_DOMAIN = '/website/activities?domain={domain}'

const getWhiteLabelDomain = async (domain: string)=> {
    const response = await getFromCrowdCore(WHITE_LABEL_DOMAIN.replace('{domain}', domain));
    return response || {}
}

export { getWhiteLabelDomain } 
