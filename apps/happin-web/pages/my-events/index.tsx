import React, { useEffect, useRef, useState } from 'react';
import MyEventsHead from '@components/page_components/MyEventsPageComponents/MyEventsHead';
import SvgIcon from '@components/SvgIcon';
import { Tooltip, VStack } from '@chakra-ui/react';
import MyEventItem from '@components/page_components/MyEventsPageComponents/MyEventItem';
import { useToast } from '@chakra-ui/react';
import { generateToast } from '../../components/page_components/CheckoutPageComponents/util/toast';
import {EventTicketsListResponse, SavedEventTicketsListResponse} from '../../lib/model/myEvents';
import {getEventTicketsList, getSavedEventTicketsList} from '../../lib/api';
import { useUserState } from 'contexts/user-state';
import jwt_decode from "jwt-decode";

const MyEvents = () => {

  const toast = useToast();
  const { exchangeForCrowdCoreToken } = useUserState()
  const [upcomingTickets,setUpcomingTickts] = useState<any[]>([]);
  const [pastTickets,setPastTickts] = useState<any[]>([]);
  const [savedTickets,setSavedTickts] = useState<any[]>([]);


  const getEventTicketsListFromServer = async () => {
    try {
      const res: EventTicketsListResponse = await getEventTicketsList();
      if (res && res.data && res.data.upcoming) {
        const upcomingTicketsFromServer = res.data.upcoming;
        setUpcomingTickts(upcomingTicketsFromServer);
      }
      if (res && res.data && res.data.past) {
        const pastTicketsFromServer = res.data.past;
        setPastTickts(pastTicketsFromServer);
      }
    }
    catch (err) {
      generateToast('Unknown error about event tickets', toast);
      console.log(err)
    }
  }

  const getSavedEventTicketsListFromServer = async () => {
    try {
      const res: SavedEventTicketsListResponse = await getSavedEventTicketsList();
      if (res && res.data && res.data.events) {
        const savedTicketsFromServer = res.data.events;
        setSavedTickts(savedTicketsFromServer);
      }
    }
    catch (err) {
      generateToast('Unknown error about event tickets', toast);
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

  useEffect(() => {
     getEventTicketsListFromServer();
  }, []);

  useEffect(() => {
     getSavedEventTicketsListFromServer();
  }, []);

  useEffect(() => {
    if(localStorage.getItem('chumi_jwt')) {
      let decoded: any = jwt_decode(localStorage.getItem('chumi_jwt') as string);
        if (new Date().getTime() > (decoded.exp * 1000)) {
          // token expires && revoke new token
          generateChumiJWTToken();
        }
    }
    else {
        // exchange token & store the crowdcore server token in local stoarge
        generateChumiJWTToken();
     }
  }, []);
  
  return (
    <div className="common__body">
      <div className="flex flex-col h-full">
        <MyEventsHead upcomingTickets = {upcomingTickets} pastTickets = {pastTickets} savedTickets={savedTickets}/>
        <div className="flex-1 h-0 web-scroll overflow-y-auto" id="my-events-scroll-body">
          <div className="container">
            <div className="py-5">
              <VStack alignItems="stretch" spacing={{base: 5, sm: 8}}>
                <div id="upcoming">
                  <div className="mb-5 font-semibold text-xl sm:text-2xl">{upcomingTickets && upcomingTickets.length>0 && `Upcoming`}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:grid-cols-3">
                    {
                      upcomingTickets && upcomingTickets.length>0 && upcomingTickets.map(item => <MyEventItem data={item} key={item._id} />)
                    }
                  </div>
                </div>
                <div id="past">
                  <div className="mb-5 font-semibold text-xl sm:text-2xl">{pastTickets && pastTickets.length>0 && `Past`}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:grid-cols-3">
                    {
                      pastTickets && pastTickets.length>0 && pastTickets.map(item => <MyEventItem data={item} key={item._id} />)
                    }
                  </div>
                </div>
                <div id="saved">
                  <div className="mb-5 font-semibold text-xl sm:text-2xl">{savedTickets && savedTickets.length>0 && `Saved`}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:grid-cols-3">
                    {
                      savedTickets && savedTickets.length>0 && savedTickets.map(item => <MyEventItem data={item} key={item._id} />)
                    }
                  </div>
                </div>
              </VStack>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEvents;
