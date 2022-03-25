import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { Help, Switch } from "@icon-park/react";
import classnames from "classnames";
import { generateToast } from '@components/page_components/CheckoutPageComponents/util/toast';
import { getRewards, getTransactionHistory, rewardCheckIn, rewardClaim } from 'lib/api/reward';
import { Balance, RewardListResponse, Transaction } from 'lib/model/reward';
import { useUserState } from 'contexts/user-state';
import { useSSOState } from 'contexts/sso-state';
import { useRouter } from 'next/router';
import jwt_decode from "jwt-decode";
import moment from 'moment';

const TransactionHistory = () => {
  const router = useRouter()
  const { user, clearUser } = useUserState();
  const {  showSSO } = useSSOState();
  const [tabCur, setTabCur] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [ balance, setBalance ] = useState<Balance>({"coins": 0, "diamonds": 0,});
  const [ diamondTransaction, setDiamondTransaction ] = useState<Transaction[]>([])
  const [ coinTransaction, setCoinTransaction ] = useState<Transaction[]>([])
  // const [ weeklyTask, setWeeklyTask ] = useState<TaskDetail[]>([])
  const toast = useToast();
  const tab = ['Coin', 'Diamond']


  const getRewardsInfo = async () => {
    try {
      const res: RewardListResponse = await getRewards();
      if (res && res.data) {
        console.log(res.data)
        setBalance(res.data.balance)
        const coin_history = await getTransactionHistory("coin");
        const diamond_history = await getTransactionHistory("diamond");
        if (diamond_history?.data) {
          setDiamondTransaction(diamond_history.data?.transactions);
        }
        if (coin_history?.data) {
          setCoinTransaction(coin_history.data?.transactions);
        }
      }
    }
    catch (err) {
      generateToast('Unknown error about get rewards', toast);
      console.log(err)
    }
  }





  const handleSendToAPP = (type:string) => {
    let action = "";
    switch(type) {
      case "copy":
        action = 'copy-to-invite-friends';
        break;
      case "share":
        action = 'share-to-invite-friends';
        break;
      case "add":
        action = 'open-add-contacts';
        break;
      case "topup":
        action = 'top-up-needed-diamond';
        break;
      default:
        break;
    }
    console.log("direct to app ", action)
    const passJson = { action: action };
    if ((window as any).webkit) {
      (window as any).webkit.messageHandlers.jsHandler.postMessage(JSON.stringify(passJson));
    }
    if ((window as any).happinAndroid) {
      (window as any).happinAndroid.doAction(action, JSON.stringify(passJson));
    }
    window.parent.postMessage(passJson, '*');
  }

  useEffect(() => {
    if (user) {
      console.log(user);
      (async () => {
              try {
                await getRewardsInfo();
                setLoading(false);
              }
              catch(error) {
                generateToast('Get reward error', toast);
                console.log('Get reward error: ', error)
              }

            })()
    }
  },[user])

  useEffect(() => {
    clearUser();
    if (Object.entries(router.query).length !== 0) {
      if (!router.query.token) {
        generateToast('To continue, please log in or sign up ', toast);
        showSSO('Fan')
        return
      } else  {
        let decoded: any = jwt_decode(router.query.token as string);
          if (new Date().getTime() > (decoded.exp * 1000)) {
            // token expired
            generateToast('To continue, please log in or sign up ', toast);
            showSSO('Fan')
            return
          }
          else {
            localStorage.setItem("happin_web_jwt", router.query.token as string);
            (async () => {
              try {
                await getRewardsInfo();
                setLoading(false);
              }
              catch(error) {
                generateToast('Get reward error', toast);
                console.log('Get reward error: ', error)
              }

            })()
          }
      }
    }
  }, [router.query]);

  console.log("coin",coinTransaction)
  console.log(diamondTransaction)

  return (
      <div className="app-reward__page">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4 font-semibold text-gray-50">
            <div className="flex items-center">
              <span className="mr-1">Current Balance</span>
              <Help theme="outline" size="18" fill="currentColor" strokeWidth={4}/>
            </div>
          </div>
          <div className="bg-gray-800 rounded-xl py-4">
            <div className="flex">
              <div className="flex-1 text-center">
                <img className="w-6 mx-auto" src="/images/icon-coin.svg" alt="" />
                <div className="mt-1 text-lg font-semibold text-gray-50">{balance.coins}</div>
                <div className="text-sm font-semibold text-gray-400">Coin</div>
              </div>
              <div className="flex-1 text-center">
                <img className="w-6 mx-auto" src="/images/icon-diamond.svg" alt="" />
                <div className="mt-1 text-lg font-semibold text-gray-50">{balance.diamonds}</div>
                <div className="text-sm font-semibold text-gray-400">Diamond</div>
              </div>
              <div className="relative flex-1 text-center">
                <div className="app-reward__exchange">
                  <Switch theme="outline" size="20" fill="#fff"/>
                </div>
                <img className="w-6 mx-auto" src="/images/icon-cash.svg" alt="" />
                <div className="mt-1 text-lg font-semibold text-gray-50">{balance.diamonds}</div>
                <div className="text-sm font-semibold text-gray-400">Cash Value</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex px-4 pb-4">
          {
            tab?.map((item, index) => (
              <div key={index} className="flex justify-center flex-1">
                <div
                  className={`${classnames('app-reward__tab', {active: tabCur === index})} cursor-pointer`}
                  onClick={() => setTabCur(index)}
                >{item}</div>
              </div>
            ))
          }
        </div>
        <div className={classnames('px-4', {hidden: tabCur !== 0})}>
          {coinTransaction && coinTransaction?.map((transaction:Transaction, index:number) => {
            return (
              <div className="bg-gray-800 rounded-xl px-4 py-4 mb-4" key={`transactionCoin-${index}`}>
                <div className="flex items-center">
                  <div className="relative">
                    {transaction.icon ?
                        <img className="w-12 h-12 rounded-full" src={transaction.icon} />
                      :
                        <img src="/images/happinIcon.svg" />
                    }
                        {/* <img className="absolute bottom-0 right-0 avator-icon" src="/images/icon_cheers.svg"/> */}
                  </div>
                  {transaction.title ?
                    <div className="px-4">
                      <div className="text-medium leading-6 text-white font-semibold">{transaction.title}</div>
                      <div className="text-gray-400 text-sm leading-5">{transaction.content}</div>
                      <div className="text-gray-400 text-xs leading-5">{moment(transaction.timestamp).format("HH:mm MMMM DD, yyyy")}</div>
                    </div>
                  :
                    <div className="px-4">
                          <div className="text-400 text-white text-sm leading-5">{transaction.content}</div>
                          <div className="text-gray-400 text-xs leading-5">{moment(transaction.timestamp).format("HH:mm MMMM DD, yyyy")}</div>
                    </div>
                  }
                  <div className="flex flex-1 justify-end">
                      <span className="text-lg leading-6 text-white font-semibold ">{transaction.amount < 0 ? transaction.amount : '+'+transaction.amount }</span>
                      <img className="w-5 ml-1.5 mr-1 justify-center" src="images/icon-coin.svg" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className={classnames('px-4', {hidden: tabCur !== 1})}>
          {diamondTransaction && diamondTransaction?.map((transaction:Transaction, index:number) => {
              return (
                <div className="bg-gray-800 rounded-xl px-4 py-4 mb-4" key={`transactionDiamond-${index}`}>
                  <div className="flex items-center">
                    <div className="relative">
                      {transaction.icon ?
                          <img className="w-12 h-12 rounded-full" src={transaction.icon} />
                        :
                          <img src="/images/happinIcon.svg" />
                      }
                          {/* <img className="absolute bottom-0 right-0 avator-icon" src="/images/icon_cheers.svg"/> */}
                    </div>
                    {transaction.title ?
                      <div className="px-4">
                            <div className="text-medium leading-6 text-white font-semibold">{transaction.title}</div>
                            <div className="text-gray-400 text-sm leading-5">{transaction.content}</div>
                            <div className="text-gray-400 text-xs leading-5">{moment(transaction.timestamp).format("HH:mm MMMM DD, yyyy")}</div>
                      </div>
                    :
                      <div className="px-4">
                            <div className="text-400 text-white text-sm leading-5">{transaction.content}</div>
                            <div className="text-gray-400 text-xs leading-5">{moment(transaction.timestamp).format("HH:mm MMMM DD, yyyy")}</div>
                      </div>
                    }
                    <div className="flex flex-1 justify-end">
                        <span className="text-lg leading-6 text-white font-semibold ">{transaction.amount < 0 ? transaction.amount : '+'+transaction.amount }</span>
                        <img className="w-5 ml-1.5 mr-1 justify-center" src="images/icon-diamond.svg" />
                    </div>
                  </div>
                </div>
              )
            })}
            </div>
      </div>

  )
}

export default TransactionHistory

