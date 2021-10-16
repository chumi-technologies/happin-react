import React, { useEffect, useState }  from 'react';
import Link from 'next/link';
import moment from "moment";
import { useRouter } from 'next/router';
import { getSellByCardOrByCash } from 'lib/api';
import { useUserState } from 'contexts/user-state';

export type MyEventProps = {
  eventDetailData:{
    _id:string,
    title: string,
    startTime:string,
  }
}

const AffiliateDashboardHead = ({ eventDetailData }: MyEventProps) => {

  const router = useRouter();
  const { partnerId } = useUserState();

  const [sellByCard,setSellByCard ] = useState<boolean>(false);
  const [sellByCash,setSellByCash ] = useState<boolean>(false);
  const [sellByCardUrl,setSellByCardUrl ] = useState<string>('');
  const [sellByCashUrl,setSellByCashUrl ] = useState<string>('');
  
  useEffect(() => {
    (async () => {
      if(localStorage.getItem('chumi_jwt') && partnerId && (eventDetailData._id)){
        try{
          const result = await getSellByCardOrByCash(partnerId,eventDetailData._id);
          if (result) {
            setSellByCard(result.byCard);
            setSellByCash(result.byCash);
            setSellByCardUrl(result.urlCard);
            setSellByCashUrl(result.urlCash);
          }
        } catch(err) {
          console.log(err)
        }
      }
    })()
  }, [eventDetailData._id,partnerId])

  const openSellByCardTab = ()=>{
    window.open(sellByCardUrl, "_blank")
  }
  const openSellByCashTab = ()=>{
    window.open(sellByCashUrl, "_blank")
  }

  return (
      <div className="dashboard_container bg-gray-200">
        <button className="bg-gray-200 hover:bg-gray-200 text-xl text-black text-center py-2 px-4 rounded hover:bg-gray-400" onClick={() => {
          router.push(`/event-list`)
        }}>{`< Back`}</button>
        <div className="flex justify-center text-center">
        <div className="font-bold text-xl sm:text-2xl mt-1 mb-1 mx-1 text-gray-800">{eventDetailData.title}</div>
        <div className="font-normal text-xl sm:text-2xl mt-1 mb-1 mx-1 text-gray-800">{moment(eventDetailData.startTime).format('MMMM Do, h:mma')}</div>
        </div>
            <div className="flex text-gray-800">
                <a className="dashboard__head-tab">Dashboard</a>
                <a onClick={openSellByCardTab} className={sellByCard?"dashboard__head-tab":"dashboard__head-tab_disable"}>Sell by card</a>
                <a onClick={openSellByCashTab} className={sellByCash?"dashboard__head-tab":"dashboard__head-tab_disable"}>Sell by cash</a>
            </div>
      </div>
  );
};

export default AffiliateDashboardHead;