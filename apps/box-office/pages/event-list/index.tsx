import React, { useEffect, useState, useRef } from 'react';
import { Skeleton, VStack } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react';
import Router, { useRouter } from "next/router";
import { generateToast } from '../../components/util/toast';
import { EventResponse } from '../../lib/model/myEvents';
import { getEvents,getConnectedTeam, getSaasUserInfo } from '../../lib/api';
import { useUserState } from 'contexts/user-state';
import EventListItem from '@components/page_components/EventListPageComponents/EventListItem';
import jwt_decode from "jwt-decode";
import Head from 'next/head';
import ReactPaginate from 'react-paginate';
import {connectTeamResponse} from 'lib/model/user';

const EventList = () => {

  const toast = useToast();
  const router = useRouter();
  const eventListRef = useRef<HTMLInputElement>(null);
  const { clearUser,exchangeForCrowdCoreToken,teamUser,affiliation,partnerId,setConnectedTeam,setSaasUserInfo,setPartnerId,setCrowdCoreToken } = useUserState()
  const [ eventsList, setEventsList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageCount,setPageCount] = useState<number>(1);

  const getEventsListFromServer = async () => {
    try {
      const res: EventResponse = await getEvents('0');
      if (res && res.activities) {
        const partnerIdFromLocalStorage = localStorage.getItem('partnerId');
        const affiliationFromLocalStorage = localStorage.getItem('affiliation');
        if (partnerIdFromLocalStorage && affiliationFromLocalStorage) {
          // @ts-ignore
          const affiliationEventList = res.activities.filter(a=>affiliation.acid.includes(a._id));
          if(affiliationEventList.length>0) {
            setEventsList(affiliationEventList);
            setPageCount(Math.ceil(affiliationEventList.length / 9))
            setLoading(false);
          } else {
            setEventsList([]);
            setPageCount(1);
            setLoading(false);
          }
        } else {
          const eventsListFromServer = res.activities;
          if(eventsListFromServer.length>0) {
            setEventsList(eventsListFromServer);
            setPageCount(Math.ceil(res.count / 9))
            setLoading(false);
          } else {
            setEventsList([]);
            setPageCount(1);
            setLoading(false);
          }
        }
      }
    }
    catch (err) {
      setLoading(true);
      console.log(err)
    }
  }

  const generateInitialState = async () => {
    try {
      await exchangeForCrowdCoreToken();
      setCrowdCoreToken(true);
      if(localStorage.getItem('chumi_jwt')){
        const teams:connectTeamResponse[] = await getConnectedTeam();
        if (teams && teams.length>0) {
          setConnectedTeam(teams);
          localStorage.setItem("connectedTeam",JSON.stringify(teams));
        }
        localStorage.setItem('teamUser',JSON.stringify(false));
        const userInfo = await getSaasUserInfo();
        localStorage.setItem('saasUserInfo',JSON.stringify(userInfo))
        setSaasUserInfo(userInfo);
        localStorage.setItem('partnerId',JSON.stringify(userInfo.userId))
        setPartnerId(userInfo.userId);
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  const handlePageClick = async (data:any)=> {
    let page = data.selected;
    try {
      const res: EventResponse = await getEvents(page);
      if (res && res.activities) {
        const eventsListFromServer = res.activities;
        setEventsList(eventsListFromServer);
      }
      if(eventListRef && eventListRef.current ) {
        eventListRef.current.tabIndex = 0;
        eventListRef.current.focus();
      }   
    }
    catch (err) {
      generateToast('Unknown error about events list', toast);
      console.log(err)
    }
  }

  const handleEventClick = async(acid:string,ownerId:string)=>{
    if(affiliation && partnerId) {
      router.push(`/dashboard/affiliate-dashboard?partnerId=${partnerId}&ownerId=${ownerId}&acid=${acid}`);
    } else {
      router.push(`/dashboard?acid=${acid}`);
    }
  }

  useEffect(() => {
    if (localStorage.getItem('chumi_jwt')) {
      let decoded: any = jwt_decode(localStorage.getItem('chumi_jwt') as string);
      if (new Date().getTime() > (decoded.exp * 1000)) {
        // token expires && ask user re login
        (async () => {
          generateToast('Token expires, please login in again', toast);
          clearUser();
          router.push('/')
        })()
      } else {
        (async () => {
          await getEventsListFromServer();
        })()
      }
    }
    else {
      // exchange token & store the crowdcore server token in local stoarge     
      (async () => {
        await generateInitialState();
        await getEventsListFromServer();
      })()
    }
  }, [teamUser]);

  return (
    <>
      <Head>
        <title>Events List</title>
      </Head>
      <div className="common__body">
        <div className="flex flex-col h-full">
          <div className="flex-1 h-0 web-scroll overflow-y-auto" id="my-events-scroll-body">
            <div className="container">
              <div className="py-5">
                {!loading ?
                  <VStack alignItems="stretch" spacing={{ base: 5, sm: 8 }}>
                    <div id="event-list">
                      <div ref={eventListRef} className="mb-5 font-semibold text-xl sm:text-2xl text-gray-900">{eventsList && eventsList.length > 0 && `Events List`}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:grid-cols-3 text-gray-900">
                        {
                          eventsList && eventsList.length > 0 && eventsList.map(item => <EventListItem data={item} key={item._id} onItemClick={handleEventClick}/>)
                        }
                      </div>
                    </div>
                    {eventsList && eventsList.length > 0 && <div id="react-paginate" className="self-center">
                      <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                      />
                    </div>}
                    {eventsList && eventsList.length == 0 && <div className="mb-5 font-semibold text-xl sm:text-2xl text-gray-900 self-center">
                       No event was found 
                    </div>
                    }
                  </VStack> :
                  <>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventList;
