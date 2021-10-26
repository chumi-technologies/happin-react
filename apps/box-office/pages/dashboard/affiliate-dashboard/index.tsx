import { getDashboardStatAffiliation,getEventById } from "lib/api"
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { generateToast } from '../../../components/util/toast';
import { useToast } from '@chakra-ui/react';
import AffiliateDashboardHead from '@components/page_components/DashboardPageComponents/AffiliateDashboardHead';

interface dashboardData {
  totalRevnue: number,
  ticketsSold: number,
  currency: string,
  ticketBreakDown?: {count: number, default_currency: string, commision: number, _id: string}[]
}

interface eventDetailData {
  _id:string,
  title: string,
  startTime:string,
}

const Affiliate = () => {
  const router = useRouter();
  const toast = useToast();
  const [dashboardData, setDashbordData] = useState({} as dashboardData);
  const [eventDetailData,setEventDetailData] = useState({} as eventDetailData)
  const [showNavBar,setShowNavBar] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!router.isReady) return;
    const { query: { acid, partnerId, ownerId, fromapp } } = router;
    if (!acid || !partnerId || !ownerId) {
      return
    }
    (async () => {
      try {
        if(fromapp) {
          setShowNavBar(false);
        } else {
          setShowNavBar(true);
        }
        const result = await getDashboardStatAffiliation(String(partnerId),String(acid), String(ownerId))
        const processedData = processDashboardData(result)
        setDashbordData(processedData);
        const eventDetails = await getEventById(String(acid))
        setEventDetailData(eventDetails);
        setLoading(false);
      } catch (err) {
        generateToast('Unknown error about affiliation', toast);
        router.push(`/event-list`)
        console.log(err)
      }
    })();
  }, [router.isReady])

  const processDashboardData = (data: { commision: number, count: number, default_currency: string, _id: string }[]) => {
    const result: dashboardData = { totalRevnue: 0, ticketsSold: 0, currency: '' };
    data.forEach((d: { commision: number, count: number, default_currency: string }) => {
      result.totalRevnue += (+d.commision.toFixed(2));
      result.ticketsSold += (+d.count);
      result.currency = d.default_currency;
    })
    result.ticketBreakDown = data.sort((a,b) => b.count - a.count);
    return result;
  }

  return (
    <div className="common__body max-w-lg mx-auto">
    { showNavBar && <AffiliateDashboardHead eventDetailData={eventDetailData} loading={loading}/>}
    <div className="px-3 pt-3">
      <div className="card">
        <div className="text-gray-700 font-medium mb-2">Total Revenue</div>
        <div className="flex items-center">
          <div className="flex-1">
            <div className="text-2xl font-bold flex items-center text-gray-500 font-medium mt-1">
              <svg width="16px" height="16px" viewBox="0 0 14 14">
                <path fillRule="evenodd" clipRule="evenodd" fill="currentColor" d="M7,12.333c2.946,0,5.333-2.388,5.333-5.333S9.946,1.667,7,1.667S1.667,4.055,1.667,7S4.055,12.333,7,12.333z M7,13.667c3.682,0,6.667-2.985,6.667-6.667c0-3.682-2.985-6.667-6.667-6.667C3.318,0.333,0.333,3.318,0.333,7C0.333,10.682,3.318,13.667,7,13.667z M6.333,3.667C6.333,3.298,6.632,3,7,3c0.368,0,0.667,0.298,0.667,0.667c1.105,0,2,0.895,2,2c0,0.368-0.298,0.667-0.667,0.667S8.333,6.035,8.333,5.667C8.333,5.298,8.035,5,7.667,5H6.162C5.889,5,5.667,5.222,5.667,5.496c0,0.213,0.137,0.403,0.339,0.47l2.411,0.804c0.747,0.249,1.251,0.948,1.251,1.735c0,1.01-0.819,1.829-1.829,1.829H7.667C7.667,10.701,7.368,11,7,11c-0.368,0-0.667-0.299-0.667-0.667c-1.105,0-2-0.895-2-2c0-0.368,0.298-0.667,0.667-0.667c0.368,0,0.667,0.298,0.667,0.667C5.667,8.702,5.965,9,6.333,9h1.504c0.274,0,0.496-0.222,0.496-0.496c0-0.213-0.137-0.403-0.339-0.47L5.584,7.231C4.837,6.982,4.333,6.283,4.333,5.496c0-1.01,0.819-1.829,1.829-1.829H6.333z" />
              </svg>
              <span className="ml-1">{dashboardData.totalRevnue || 0} {dashboardData.currency}</span>
            </div>
          </div>

        </div>
        <div className="flex items-center mt-6">
          <div className="flex-1">
            <div className="text-gray-700 text-sm mb-1">Total tickets sold: <span className="text-teal-500 ml-1">{dashboardData.ticketsSold || 0}</span></div>
          </div>
        </div>
      </div>
      {dashboardData.ticketBreakDown && dashboardData.ticketBreakDown.map((ticket,index) => (
        <div className="card mt-3" key={index}>
          <div className="text-gray-700 text-sm mb-1">Ticket Name: </div>
          <div className="mb-3">
            <span className="text-gray-700">{ticket._id}</span>
          </div>
          <div className="text-gray-700 text-sm mb-1">Number Sold: {ticket.count}</div>
          {ticket.commision !== 0 && (
            <div className="text-gray-700 text-sm mb-1">Commision Collect: {(+ticket.commision).toFixed(2)} {ticket.default_currency}</div>
          )}
        </div>
      ))}
    </div>
    </div>
  )
}

export default Affiliate
