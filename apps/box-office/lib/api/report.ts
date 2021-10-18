import { getFromCrowdCore,postToCrowdCore } from './base';

const GENERATE_AFFILIATE_REPORT = '/report/create-report-job'
const GET_AFFILIATE_REPORT = '/report/get-report-job?_id=${reportId}'

const generateAffiliateReport = async (payload:any)=> {
    const response = await postToCrowdCore(GENERATE_AFFILIATE_REPORT,payload);
    return response || {}
}

const getAffiliateReport = async (reportId:string)=> {
    const response = await getFromCrowdCore(GET_AFFILIATE_REPORT.replace('${reportId}',reportId));
    return response || {}
}

export { generateAffiliateReport,getAffiliateReport } 