import React, { useEffect, useState } from 'react';
import SvgIcon from '@components/SvgIcon';
import { Tooltip, VStack } from '@chakra-ui/react';
import { MyEventItemDataProps } from 'lib/model/myEvents';
import {getMerchOrdersSummary, getTicketsPlayBackList} from "../../../lib/api";
import { useUserState } from 'contexts/user-state';
import { generateToast } from '../../../components/page_components/CheckoutPageComponents/util/toast';
import { useToast } from '@chakra-ui/react';
import Link from 'next/link';
import moment from 'moment';
import jwt_decode from "jwt-decode";

export type MyEventItemProps = {
  data: MyEventItemDataProps;
}

const MyEventItem = ({ data }: MyEventItemProps) => {

  const toast = useToast();
  const { exchangeForCrowdCoreToken } = useUserState()

  const [merchs,setMerchs] = useState<any[]>([]);
  const [playBackList,setPlayBackList] = useState<any[]>([]);

  const getMerchOrdersSummaryFromCrowdcoreServer = async(id:string)=> {
    try {
      if(localStorage.getItem('chumi_jwt')) {
        let decoded: any = jwt_decode(localStorage.getItem('chumi_jwt') as string);
        if (new Date().getTime() > (decoded.exp * 1000)) {
        // token expires && revoke new token
        generateChumiJWTToken();
        }
      } else {
        // exchange token & store the crowdcore server token in local stoarge
        generateChumiJWTToken();
      }
      const res = await getMerchOrdersSummary(id)
      if (res && res.merchandises) {
        const merchFromServer = res.merchandises;
        setMerchs(merchFromServer);
      }
    } catch(err) {
       console.log(err)
    }
  }

  const getPlayBackListFromServer = async (id:string) => {
    try {
      const res = await getTicketsPlayBackList(id);
      if (res && res.data && res.data.tickets) {
        const playBackListFromServer = res.data.tickets;
        setPlayBackList(playBackListFromServer);
      }
    }
    catch (err) {
      generateToast('Unknown error about playback tickets', toast);
      console.log(err)
    }
  }

  const generateChumiJWTToken = async ()=>{
    try {
      await exchangeForCrowdCoreToken();
    }
    catch(err) {
      console.log(err)
    }
  }
  const generateLocationInfo = (data:any)=>{
    if (data.acInfo?.location) {
      return <div className="truncate flex-1 ml-2 text-sm text-gray-200">{ data.acInfo?.location}</div>
    } else if (data.city  || data.state) {
      return <div className="truncate flex-1 ml-2 text-sm text-gray-200">{`${data.city} ${data.state}`}</div>
    } else {
      return <div className="truncate flex-1 ml-2 text-sm text-gray-200">{'Unknown'}</div>
    }
  }

  useEffect(() => {
    if(data.eid){
      getMerchOrdersSummaryFromCrowdcoreServer((data.eid).toString())
    }
  },[])

  useEffect(() => {
    if(data._id){
      getPlayBackListFromServer((data._id).toString())
    }
  }, []);

  return (
    <div className="group cursor-pointer">
      <div className="relative">
{/*        // Todo live stream tickets
        {
          data.livestream && (
            <div className="absolute left-3 top-3 inline-flex items-center bg-rose-500 rounded-md px-1.5 py-0.5 z-20">
              <SvgIcon id="livestream" className="text-white" />
              <div className="ml-2 text-sm text-gray-200 font-medium">Livestream</div>
            </div>
          )
        }*/}
        <div className="hidden md:block absolute right-2 top-2 z-20 opacity-0 group-hover:opacity-100 transition">
          <VStack spacing={1.5}>
            <Tooltip label="Ticket" placement="left" bg="gray.900" borderRadius="md" hasArrow arrowSize={8} shouldWrapChildren>
              {/*https://nextjs.org/docs/tag/v9.5.2/api-reference/next/link#dynamic-routes*/}
              <Link href={`/my-events/event-details?id=${data._id}&page=0`}
                    as={`/my-events/event-details/${data._id}/tickets`}>
                <div className="my-events__cover-action">
                  <SvgIcon id="ticket-bold" />
                </div>
              </Link>
            </Tooltip>
            {merchs && merchs.length>0 &&
              <Tooltip label="Merch" placement="left" bg="gray.900" borderRadius="md" hasArrow arrowSize={8} shouldWrapChildren>
              <Link href={`/my-events/event-details?id=${data._id}&page=1`}
                    as={`/my-events/event-details/${data._id}/merch`}>
                <div className="my-events__cover-action">
                  <SvgIcon id="bag-bold" />
                </div>
              </Link>
            </Tooltip>}
            { playBackList && playBackList.length>0 &&
            <Tooltip label="Replay Video" placement="left" bg="gray.900" borderRadius="md" hasArrow arrowSize={8} shouldWrapChildren>
              <Link href={`/my-events/event-details?id=${data._id}&page=2`}
                    as={`/my-events/event-details/${data._id}/replay-video`}>
                <div className="my-events__cover-action">
                  <SvgIcon id="video-bold" />
                </div>
              </Link>
            </Tooltip>}
          </VStack>
        </div>
        <Link href={`/my-events/event-details?id=${data._id}&page=0`}
            as={`/my-events/event-details/${data._id}/tickets`}>
            <div className="aspect-w-16 aspect-h-9">
              <div className="bg-black bg-opacity-0 group-hover:bg-opacity-20 transition z-10" />
              <img src={data.cover}
                   alt={data.title}
                   className="w-full h-full object-center object-cover rounded-md" />
            </div>
        </Link>
      </div>
      <div className="flex md:hidden mt-3 bg-gray-700 rounded-full justify-between">
        <Link href={`/my-events/event-details?id=${data._id}&page=0`}
              as={`/my-events/event-details/${data._id}/tickets`}>
          <div className="flex items-center text-sm px-3 py-2 active:text-rose-500">
            <div className="text-lg mr-2">
              <SvgIcon id="ticket-bold" />
            </div>
            <span>Tickets</span>
          </div>
        </Link>
       <Link href={`/my-events/event-details?id=${data._id}&page=0`}
              as={`/my-events/event-details/${data._id}/tickets`}>
          <div className="flex items-center text-sm px-3 py-2 active:text-rose-500">
            <div className="text-lg mr-2">
              <SvgIcon id="bag-bold" />
            </div>
            <span>Merch</span>
          </div>
        </Link>
        <Link href={`/my-events/event-details?id=${data._id}&page=0`}
              as={`/my-events/event-details/${data._id}/tickets`}>
          <div className="flex items-center text-sm px-3 py-2 active:text-rose-500">
            <div className="text-lg mr-2">
              <SvgIcon id="video-bold" />
            </div>
            <span>replay video</span>
          </div>
        </Link>
      </div>
      <Link href={`/my-events/event-details?id=${data._id}&page=0`}
              as={`/my-events/event-details/${data._id}/tickets`}>
      <div className="mt-3">
        <div className="text-sm mb-1 text-gray-200">{moment(data.start_datetime).format('MMMM Do, h:mma')}</div>
        <div className="truncate font-semibold mb-2 group-hover:text-rose-500 transition">{data.title}
        </div>
        <div className="flex items-center">
          <SvgIcon id="location" className="text-sm text-gray-50" />
            {generateLocationInfo(data)}
        </div>
      </div>
      </Link>
    </div>
  );
};

export default MyEventItem;
