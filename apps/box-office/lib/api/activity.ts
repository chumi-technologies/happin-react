import { getFromCrowdCore } from './base';

const DASHBOARD_STAT_AFFILIATION_PATH = '/partnership/affiliation-stats-box-office/${partnerId}/acid/${acid}/owner/${ownerId}'
const DASHBOARD_STAT_PATH = '/activity/sale-stat-for-box-office/${acid}'
const EVENT_PATH = '/activity?pageSize=9&status=all&sortBy=start-time-desc&showStats=true&page=${page}'
const EVENT_BY_ID_PATH = '/activity/${id}'

const getDashboardStatAffiliation = async(partnerId: string,acid: string, ownerId: string)=> {
    const response = await getFromCrowdCore(DASHBOARD_STAT_AFFILIATION_PATH.replace('${partnerId}',partnerId).replace('${acid}',acid).replace('${ownerId}',ownerId))
    return response || {};
}
const getDashboardStat = async(acid: string)=> {
    const response = await getFromCrowdCore(DASHBOARD_STAT_PATH.replace('${acid}',acid))
    return response || {};
}

const getEvents = async(page:string)=> {  
    const response = await getFromCrowdCore(EVENT_PATH.replace('${page}',page))
    return response || {};
}

const getEventById = async (id: string)=> {
    const response = await getFromCrowdCore(EVENT_BY_ID_PATH.replace('${id}',id))
    return response || {};
}

export {getDashboardStatAffiliation,getDashboardStat,getEvents,getEventById}
