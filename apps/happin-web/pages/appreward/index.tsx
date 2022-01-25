import React, { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { ArrowRight, Help, Switch } from "@icon-park/react";
import classnames from "classnames";
import SvgIcon from "@components/SvgIcon";
import { generateToast } from '@components/page_components/CheckoutPageComponents/util/toast';
import { getRewards, rewardCheckIn, rewardClaim } from 'lib/api/reward';
import { Balance, DailyCheckIn, RewardListResponse, TaskDetail } from 'lib/model/reward';
import { useUserState } from 'contexts/user-state';
import { useSSOState } from 'contexts/sso-state';
import { useRouter } from 'next/router';
import jwt_decode from "jwt-decode";
import { getUserInfo } from 'lib/api';

const Reward = () => {
  const router = useRouter()
  const { user, clearUser } = useUserState();
  const { showSSO } = useSSOState();
  const [tabCur, setTabCur] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [ balance, setBalance ] = useState<Balance>({"coins": 0, "diamonds": 0,});
  const [ happinID, setHappinID ] = useState<string>('');
  const [ dailyCheckIn, setDailyCheckIn ] =  useState<DailyCheckIn>({"reward":0, "rewardType": "", "strike":0, "hasCheckedIn":false})
  const [ oneTimeTask, setOneTimeTask ] = useState<TaskDetail[]>([]) 
  const [ inProgress, setInProgress ] = useState<boolean>(false);
  const [ semiMonthlyTask, setSemiMonthlyTask ] = useState<TaskDetail[]>([]) 
  const [ repeatTask, setRepeatTask ] = useState<TaskDetail[]>([]);
  const toast = useToast();
  const tab = ['Earn', 'Redeem']


  const getRewardsInfo = async () => {
    try {
      const res: RewardListResponse = await getRewards();
      if (res && res.data) {
        console.log("reward data: ",res.data)
        setBalance(res.data.balance)
        setDailyCheckIn(res.data.dailyCheckIn)
        if (res.data.tasks.oneTime) {
          setOneTimeTask(res.data.tasks.oneTime);
        }
        if (res.data.tasks.repeat) {
          setRepeatTask(res.data.tasks.repeat);
        }
        
        // if (res.data.tasks.weekly) {
        //   setWeeklyTask(res.data.tasks.weekly);
        // }
        if (res.data.tasks.semiMonthly) {
          setSemiMonthlyTask(res.data.tasks.semiMonthly);
        }
      }
    }
    catch (err) {
      generateToast('Unknown error about get rewards', toast);
      console.log(err)
    }
  }

  const handleCheckin = async () => {
    try {
      const res = await rewardCheckIn();
      if (res && res.data && res.data.status === "success") {
        // Update strick
        const temp = Object.assign({}, dailyCheckIn)
        temp.strike  = temp.strike + 1;
        temp.hasCheckedIn = true;
        setDailyCheckIn(temp)
        
      }

    }
    catch (err) {
      generateToast('Unknown error about rewards check in', toast);
      console.log(err)
    }
  }

  const handleClaim = async (id:string, type: string) => {
    try {
      setInProgress(true)
      const res = await rewardClaim(id);
      console.log(res)
      if (res && res.data) {
        if (type === "oneTime") {
          const update = oneTimeTask.map((item:TaskDetail) => {
            if (item._id === id) {
              const temp = item;
              temp.claimed = true;
              temp.claimable = false;
              return temp;
            }
            return item;
          })
          setOneTimeTask(update);
        }
        else {
          const update = semiMonthlyTask.map((item:TaskDetail) => {
            if (item._id === id) {
              const temp = item;
              temp.claimed = true;
              temp.claimable = false;
              return temp;
            }
            return item;
          })
          setSemiMonthlyTask(update);
        }
      }
      
      // update balance:
      try {
        const res: RewardListResponse = await getRewards();
        if (res && res.data) {
          console.log("reward data: ",res.data)
          setBalance(res.data.balance)
        }
      }
      catch (err) {
        generateToast('Unknown error update balance', toast);
        console.log(err)
        setInProgress(false)
      }
      setInProgress(false)
    }
    catch (err) {
      generateToast('Unknown error about Claim reward', toast);
      console.log(err)
      setInProgress(false)
    }

  }

  const handleCashOut = () => {
    window.location.href = `mailto:WithdrawBalance@happin.app?subject=uid:${user?.uid} username:${user?.happinID}&body=message%20goes%20here`;
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
                const res_user = await getUserInfo();
                if (res_user) {
                  setHappinID(res_user.data.happinID);
                }
                setLoading(false);
              }
              catch(error) {
                generateToast('Get reward error', toast);
                console.log('Get reward error: ', error)
              }
              
            })()
            console.log(user);
          }
      }
    }
  }, [router.query]);

  useEffect(() => {
    // href # jump
    if (!loading && window.location.hash !=="") {
      document.querySelector(window.location.hash)?.scrollIntoView();
    }
  },[loading])

  useEffect(() => {
    console.log("strikeChange")
  }, [dailyCheckIn.strike])

  return (
      <div className="app-reward__page">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4 font-semibold text-gray-50">
            <div className="flex items-center">
              <span className="mr-1">Current Balance</span>
              <Help theme="outline" size="18" fill="currentColor" strokeWidth={4}/>
            </div>
            <div className="flex items-center  cursor-pointer">
              <span className="mr-2" onClick={() => handleSendToAPP("topup")}>Top Up Now</span>
              <ArrowRight theme="outline" size="16" fill="currentColor" strokeWidth={5}/>
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
          <div className="bg-gray-800 rounded-xl px-4 py-6 mb-4">
            <div className="flex items-center justify-between">
              <div className="text-gray-50 font-semibold text-xl">Daily Checkin</div>
              <button className="btn btn-sm btn-rose !rounded-full !font-semibold" disabled={dailyCheckIn.hasCheckedIn} onClick={() => handleCheckin()}>Checkin Today</button>
            </div>
            <div className="mt-2 text-gray-400 text-sm">
              <span className="align-middle">Checkin 7 days in a row to win extra</span>
              <img className="inline align-middle w-4 ml-1.5 mr-1" src={`/images/icon-${dailyCheckIn.rewardType === "coin" ? 'coin' : 'diamond'}.svg`} alt="" />
              <span className="align-middle">{dailyCheckIn.reward}</span>
            </div>
            <div className="flex text-center mt-5 -ml-1 -mr-1">
              {
                [1,2,3,4,5,6,7].map(item => (
                  <div key={"day-"+item} className={classnames('app-reward__day-item', {checked: item <= dailyCheckIn.strike})}>
                    <div className="app-reward__day">{item}</div>
                    <div className="app-reward__day-text">Day</div>
                  </div>
                ))
              }
            </div>
          </div>
          {oneTimeTask && oneTimeTask.map((task:TaskDetail) => {
            return (
              <div className="bg-gray-800 rounded-xl px-4 py-6 mb-4" key={task._id}>
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="text-xl text-white font-semibold mb-2">Earn {task.rewardAmount} 
                      <img className="inline w-4 ml-1.5 mr-1" src={`/images/icon-${task.rewardType === "coin" ? 'coin' : 'diamond'}.svg`} alt="" />
                    </div>
                    <div className="text-gray-400 font-medium text-sm leading-5">{task.description}</div>
                  </div>
                  { task.claimed ? 
                        <button disabled className="btn btn-dark-light btn-sm !rounded-full ml-4">Claimed</button>
                        : <button className={`btn btn-outline-rose btn-sm !rounded-full ml-4 ${inProgress || !task.claimable &&'disabled'}`} disabled={inProgress || !task.claimable} onClick={() => handleClaim(task._id, "oneTime")}>Claim</button>
                      }
                </div>
              </div>
            )
          })}
          <div className="bg-gray-800 rounded-xl py-6 mb-4 text-center">
            <div className="px-4">
              <div className="text-xl text-white font-semibold mb-2">{repeatTask[0]?.description}</div>
              <div className="mt-2 text-gray-400 text-sm">
                <span className="align-middle">Earn</span>
                <img className="inline align-middle w-4 ml-1.5 mr-1" src={`/images/icon-${repeatTask[0]?.rewardType}.svg`} alt="" />
                <span className="align-middle">{repeatTask[0]?.rewardAmount} for each successful invite</span>
              </div>
              <div className="my-5">
                <div className="inline-flex items-center py-2 px-2 border-2 border-solid border-gray-600 rounded-full text-white font-semibold">
                  <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-rose-600 mr-2">ID</div>
                  <div className="mr-1">{user ? user.happinID : happinID}</div>
                </div>
              </div>
            </div>
            <div className="flex text-gray-50 font-semibold">
              <div className="flex-1 text-center cursor-pointer" onClick={() => handleSendToAPP("copy")}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900">
                  <SvgIcon id="copy" className="text-2xl" />
                </div>
                <div className="text-sm mt-2" >Copy</div>
              </div>
              <div className="flex-1 text-center  cursor-pointer" onClick={() => handleSendToAPP("share")}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900">
                  <SvgIcon id="share" className="text-2xl" />
                </div>
                <div className="text-sm mt-2" >Share to Invite</div>
              </div>
              <div className="flex-1 text-center  cursor-pointer" onClick={() => handleSendToAPP("add")}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900">
                  <SvgIcon id="add-user" className="text-2xl" />
                </div>
                <div className="text-sm mt-2" >Add Contacts</div>
              </div>
            </div>
          </div>
          {/* <div className="bg-gray-800 rounded-xl px-4 py-6 mb-4">
            <div className="text-xl text-white font-semibold mb-2">Weekly Reward</div>
            <div className="text-gray-400 font-medium text-sm leading-5">Complete weekly challenges to win coins up to 1,000</div>
            <div className="space-y-6 mt-5">
              {weeklyTask.map((task:TaskDetail) => {
                return (
                  <div className="flex items-center">
                    <div className="app-reward__earn-icon">
                      <SvgIcon id="livestream" className="text-2xl" />
                    </div>
                    <div className="mx-3 flex-1 text-gray-50">
                      <div className="font-semibold text-sm leading-5">{task.description}</div>
                      <div className="text-sm">
                        <img className="inline align-middle w-4 mr-1" src={`/images/icon-${task.rewardType === "coin" ? 'coin' : 'diamond'}.svg`} alt="" />
                        <span className="align-middle">{task.rewardAmount}</span>
                      </div>
                    </div>
                    { task.claimable ? 
                        <button className="btn btn-outline-rose btn-sm !rounded-full ml-4">Enter</button>
                        : task.claimed && <button disabled className="btn btn-dark-light btn-sm !rounded-full ml-4">Claimed</button>
                      }
                  </div>
                )
              })}
            </div>
          </div> */}
          <div className="bg-gray-800 rounded-xl px-4 py-6 mb-4">
            <a className="text-xl text-white font-semibold mb-2" href="semiMonth" id="semiMonth">Semi-month Reward</a>
            <div className="text-gray-400 font-medium text-sm leading-5">Rewards are added to next month if no one wins. Winners will share the monthly prize.</div>
            <div className="space-y-6 mt-5">
              {semiMonthlyTask.map((task:TaskDetail) => {
                return (
                  <div className="flex items-center" key={task._id}>
                    <div className="mx-3 flex-1 text-gray-50">
                      <div className="font-semibold text-sm leading-5">{task.description}</div>
                    </div>
                    <div className="flex items-center ml-4">
                      <img className="inline align-middle w-5 mr-1" src={`/images/icon-${task.rewardType === "coin" ? 'coin' : 'diamond'}.svg`} alt="" />
                      <span className="text-gray-50 text-sm font-medium">{task.rewardAmount}</span>
                      { task.claimed ? 
                        <button disabled className="btn btn-dark-light btn-sm !rounded-full ml-4">Claimed</button>
                        : <button className="btn btn-outline-rose btn-sm !rounded-full ml-4 disabled" disabled={inProgress || !task.claimable} onClick={() => handleClaim(task._id, "oneTime")}>Enter</button>
                      }
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="text-center mt-6 text-sm text-gray-200">
              Total <span className="text-rose-500 font-semibold">13030</span> Winners
            </div>
          </div>
        </div>
        <div className={classnames('px-4', {hidden: tabCur !== 1})}>
          <div className="bg-gray-800 rounded-xl px-4 pt-3 pb-4 mb-4">
            <div className="text-lg leading-6 text-white font-semibold mb-1.5">
              <span className="align-middle">Remove matching colddown</span>
              <img className="inline align-middle w-5 ml-2" src="/images/icon-coin.svg" alt="" />
            </div>
            <div className="text-gray-400 font-medium text-sm leading-5">Unlimited 30 mins matching with other people.</div>
          </div>
          <div className="bg-gray-800 rounded-xl px-4 pt-3 pb-4 mb-4">
            <div className="text-lg leading-6 text-white font-semibold mb-1.5">
              <span className="align-middle">Send virtual gift</span>
              <img className="inline align-middle w-5 ml-2" src="/images/icon-coin.svg" alt="" />
              <img className="inline align-middle w-5 ml-2" src="/images/icon-diamond.svg" alt="" />
            </div>
            <div className="text-gray-400 font-medium text-sm leading-5">Send virtual gift to other people you like.</div>
          </div>
          <div className="bg-gray-800 rounded-xl px-4 pt-3 pb-4 mb-4">
            <div className="text-lg leading-6 text-white font-semibold mb-1.5">
              <span className="align-middle">Coupon for Happin event tickets</span>
              <img className="inline align-middle w-5 ml-2" src="/images/icon-coin.svg" alt="" />
              <img className="inline align-middle w-5 ml-2" src="/images/icon-diamond.svg" alt="" />
            </div>
            <div className="text-gray-400 font-medium text-sm leading-5">Use coins like real money. When you purchase tickets with our events, you can get discounts.</div>
          </div>
          <div className="bg-gray-800 rounded-xl px-4 pt-3 pb-4 mb-4" >
            <a className="flex items-center" href={`mailto:WithdrawBalance@happin.app?subject=uid:${user?.uid} username:${user?.happinID}&body=message%20goes%20here`} target="_blank" rel="noreferrer">
              <div className="flex-1">
                <div className="text-lg leading-6 text-white font-semibold mb-1.5">
                  <span className="align-middle">Cash Out Earning</span>
                  <img className="inline align-middle w-5 ml-2" src="/images/icon-coin.svg" alt="" />
                  <img className="inline align-middle w-5 ml-2" src="/images/icon-diamond.svg" alt="" />
                </div>
                <div className="text-gray-400 font-medium text-sm leading-5">Cash out diamonds above 100 as experience creator.</div>
              </div>
              <img className="w-16 ml-4" src="/images/cash-out.svg" alt="" />
            </a>
          </div>
        </div>
      </div>

  )
}


export default Reward;