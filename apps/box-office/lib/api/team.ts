import { getFromCrowdCore } from './base';

const CONNECTED_TEAM_PATH = '/team-manage/connectedTeam'
const SWITCH_TEAM__PATH = '/member/exchangeTeamToken/${userId}'
const SAAS_USER_INFO_PATH = '/member/info/ulevel'
const SELL_BY_CARD_OR_BY_CASH_PATH = '/partnership/sell-by-card-or-cash?acid=${acid}'
const SELL_BY_CARD_OR_BY_CASH_AFFILIATION_PATH = '/partnership/sell-by-card-or-cash?partnerId=${partnerId}&acid=${acid}'

const getConnectedTeam = async()=> {  
    const response = await getFromCrowdCore(CONNECTED_TEAM_PATH)
    return response || {};
}

const swtichTeam = async(userId:string) => {
   const response = await getFromCrowdCore(SWITCH_TEAM__PATH.replace('${userId}',userId))
   return response || {}
   
}

const getSaasUserInfo = async() => {
   const response = await getFromCrowdCore(SAAS_USER_INFO_PATH)
   return response || {};
}

const getSellByCardOrByCash = async(acid:string)=> {
   const response = await getFromCrowdCore(SELL_BY_CARD_OR_BY_CASH_PATH.replace('${acid}',acid))
   return response || {};
}

const getSellByCardOrByCashAffiliation = async(partnerId:string,acid:string)=> {
   const response = await getFromCrowdCore(SELL_BY_CARD_OR_BY_CASH_AFFILIATION_PATH.replace('${partnerId}',partnerId).replace('${acid}',acid))
   return response || {};
}
export { getConnectedTeam, swtichTeam, getSaasUserInfo, getSellByCardOrByCash,getSellByCardOrByCashAffiliation }