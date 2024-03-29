import React, { useEffect, Fragment, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { Checkbox, HStack } from '@chakra-ui/react';
import { getUserInfo } from 'lib/api';
import { generateErrorToast, generateSuccessToast, generateToast } from '../../components/page_components/CheckoutPageComponents/util/toast';
import { currencyFormatter } from '../../components/page_components/CheckoutPageComponents/util/currencyFormat';
import { useToast } from '@chakra-ui/react';
import { useUserState } from 'contexts/user-state';
// import jwt_decode from "jwt-decode";
import { loadStripe, StripeCardElement } from '@stripe/stripe-js';
import CheckoutForm from '@components/page_components/PaymentPageComponents/StripeCheckoutForm';
import {
  CardElement,
  Elements,
  useElements,
  useStripe
} from "@stripe/react-stripe-js";
import { Dialog, Transition } from '@headlessui/react';
import classnames from 'classnames';
import { getTopUpPackage, postTopUp } from 'lib/api/topup';
import { useCheckoutState } from 'contexts/checkout-state';
import { useSSOState } from 'contexts/sso-state';

interface topupPackage {
  amount: number,
  cost: number,
  costType: string,
  amountType: string,
  discountedCost: number,
}

interface SearchUserResponse {
  data: UserResponse[]
}

interface UserResponse {
  _id: string,
  displayname: string,
  email: string,
  phonenumber: string,
}

const TopupInner = (props: any) => {
  const router = useRouter();
  const toast = useToast();
  const stripe = useStripe();
  const { showSSO } = useSSOState();
  const { user } = useUserState();
  const elements = useElements();
  const focusButtonRef = useRef(null);
  const { exchangeForCrowdCoreToken } = useUserState()
  const [userInfo, setUserInfo] = useState<any>();
  const [saasDashboard, setSaasDashboard] = useState<boolean>(false);
  const [selectedYourselftUser, setSelectedYourselftUser] = useState<any>()
  const [selectedAnotherUser, setSelectedAnotherUser] = useState<UserResponse>();
  const [showSearchUser, setShowSearchUser] = useState<boolean>(false);
  const [searchUserName, setSearchUserName] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<any>();
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [stripeInputError, setStripeInputError] = useState<any>(null);
  // const [billingAddress, setBillingAddress] = useState('')
  const [chooseStripe, setChooseStripe] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(1);
  const [isPorcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>();
  const [paymentSucceed, setPaymentSucceed] = useState<boolean>(false)
  const [coinPackage, setCoinPackage] = useState<topupPackage[]>();
  const [diamondPackage, setDiamondPackage] = useState<topupPackage[]>();
  const [tabCur, setTabCur] = useState(0);
  const [showCoinPayment, setShowCoinPayment] = useState<boolean>(false)
  const tab = ['Coin', 'Diamond']

  // const handleForYourselfClick = () => {
  //   setPaymentSucceed(false)
  //   if (selectedYourselftUser) {
  //     setSelectedYourselftUser(undefined);
  //     setShowPayment(false)
  //     setShowSearchUser(false)
  //   } else {
  //     setSelectedAnotherUser(undefined)
  //     setSelectedYourselftUser(userInfo);
  //     setShowSearchUser(false)
  //   }
  // }

  // const handleForAnotherClick = () => {
  //   setPaymentSucceed(false)
  //   if (selectedAnotherUser) {
  //     setSelectedAnotherUser(undefined)
  //     setShowPayment(false);
  //   } else {
  //     setSelectedYourselftUser(undefined);
  //     setShowSearchUser(true);
  //     setShowPayment(false);
  //   }
  // }

  // const onSearchUserNameChange = (e: any) => {
  //   setSearchUserName(e.target.value);
  // }

  // const handleSearchUser = async () => {
  //   try {
  //     const user: SearchUserResponse = await searchUser(searchUserName);
  //     if (user?.data && user.data.length === 0) {
  //       generateToast('There is no matching user, please search email or phone number', toast);
  //     } else if (user?.data && user.data.length > 0) {
  //       let searchedUser = user.data[0];
  //       setSelectedAnotherUser(searchedUser);
  //       setSearchUserName('')
  //       setShowSearchUser(false)
  //       if (selectedPointPackage) {
  //         setShowPayment(true);
  //       }
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  const handleSelectPointPackage = (topupPackage: any, index: any) => {
    setPaymentSucceed(false)
    if (selectedPackage === undefined) {
      setSelectedPackage(topupPackage);
    } else if (selectedPackage.amount == topupPackage.amount && selectedPackage.amountType == topupPackage.amountType) {
      setSelectedPackage(undefined);
      setShowPayment(false)
    } else {
      setSelectedPackage(topupPackage);
    }
    // if (selectedPointPackageIndex === undefined) {
    //   setSelectedPointPackageIndex(index)
    // } else if (selectedPointPackageIndex == index) {
    //   setSelectedPointPackageIndex(undefined);
    //   setShowPayment(false)
    // } else {
    //   setSelectedPointPackageIndex(index);
    // }
  }

  const handleTabChange = (index: number) => {
    setShowCoinPayment(false);
    setShowPayment(false);
    setTabCur(index);
    setSelectedPackage(undefined);
  }

  const handleContinue = () => {

    if (selectedPackage) {
      if (selectedPackage.amountType === "coin") {
        setShowCoinPayment(true);
      }
      setShowPayment(true);
      return;
    }
    generateErrorToast('Please select package to continue payment', toast)
    setShowPayment(false)
  }

  const onPaidPointsSubmit = async (data: any) => {
    if (!agreeToTerms) {
      generateErrorToast('Terms and condition is not checked', toast);
      return
    }
    if (showCoinPayment) {
      setIsProcessing(true);
      const data = {
        packageId: selectedPackage._id,
        // paymentMethodIndex: 0,
        receiptEmail: userInfo?.email,
      }
      const res = await postTopUp(data);
      if (res) {
        if (res.code === 100001) {
          generateErrorToast('Top up failed, Not enough diamonds', toast);
        }
        else if (res.code === 100003) {
          generateErrorToast('Top up failed', toast);
        }
        else if (res.success) {
          await updateUserInfo();
          generateSuccessToast('Top up successfully', toast);
          setSelectedPackage(undefined);
          setShowPayment(false);
          setShowCoinPayment(false);
          setPaymentSucceed(true);
        }
      }
      setIsProcessing(false)
      return;
    }
    // if (!billingAddress) {
    //   setStripeInputError({ message: 'Address is required' });
    //   setPaymentProcessing(false);
    //   return;
    // }
    if (stripeInputError) {
      return
    }

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    

    try {
      setIsProcessing(true);
      setPaymentSucceed(false)
      if (selectedPackage) {
        const data = {
          packageId: selectedPackage._id,
          // paymentMethodIndex: 0,
          receiptEmail: userInfo?.email,
        }
        const res = await postTopUp(data);
        if (res?.success) {
          setClientSecret(res?.clientSecret)

          if (stripe && elements) {
            const payment_method = {
              card: elements.getElement(CardElement) as StripeCardElement,
              billing_details: {
                name: userInfo?.displayname,
                // address: {
                //   line1: billingAddress
                // }
              }
            }
            const receipt_email =  userInfo?.email
            const response = await stripe.confirmCardPayment((res?.clientSecret || clientSecret), {
              payment_method: payment_method,
              setup_future_usage: 'off_session',
              receipt_email: receipt_email
            })
            if (response.error) {
              throw response.error  ;
            }
            else {
              
            }
            setTimeout(async function () {
              await updateUserInfo();
              generateSuccessToast('Top up successfully', toast);
              setPaymentSucceed(true);
              setShowPayment(false);
              setSelectedPackage(undefined)
              setIsProcessing(false);
            }, 3000);
            
          }
        }
        

      }

      // any following pay button click will use state client secret for strip api
      // result = await submitPointPayment(form);

      // after post payment, if it's stripe , need extra steps
      // if (!clientSecret) {
      //   setClientSecret(result?.client_secret)
      // }
      
    }
    catch (err: any) {
      if (err.type === 'card_error') {
        generateErrorToast(err.message, toast)
      } else {
        console.log(err)
        generateErrorToast(err.message, toast)
      }
    } finally {
      console.log("set processing")
      setIsProcessing(false);
    }
  }

  const updateUserInfo = async () => {
    try {
      console.log("updateUserInfo")
      const userInfoFromServer = await getUserInfo()
      console.log(userInfoFromServer)
      if (userInfoFromServer && userInfoFromServer.data) {
        setUserInfo(userInfoFromServer.data);
      }
    }
    catch(error) {
      console.log(error)
      generateErrorToast('Update user info error, please contact us', toast)
    }
    
  }

  useEffect(() => {
    if (!router.isReady) return;
    const { query: { fromSaas } } = router;
    if (fromSaas) {
      setSaasDashboard(true);
      (async () => {
        try {

        } catch (err) {
          generateErrorToast('Unknown error about getting your balance', toast);
          console.log(err)
        }
      })();
    } else {
      setSaasDashboard(false);
      (async () => {
          try {
            const userInfoFromServer = await getUserInfo()
            if (userInfoFromServer && userInfoFromServer.data) {
              setUserInfo(userInfoFromServer.data);
            }
          }
          catch(error) {
            generateToast('Please login to proceed',toast);
            showSSO();
          }
        
      })();
    }
  }, [])

  useEffect(() => {
    if (userInfo) {
      getTopUpPackage().then((topupPackagesFromServer:any)=> {
        if (topupPackagesFromServer && topupPackagesFromServer.data) {
          if (topupPackagesFromServer.data.coins) {
            const coinPackage = topupPackagesFromServer.data.coins.sort((a:any, b:any) => {
              return a.amount - b.amount;
            });
            setCoinPackage(coinPackage)
          }
          if (topupPackagesFromServer.data.diamonds) {
            const diamondPackage = topupPackagesFromServer.data.diamonds.sort((a:any, b:any) => {
              return a.amount - b.amount;
            });
            setDiamondPackage(diamondPackage)
          }
        }
      })
    }
  }, [userInfo])

  useEffect( () => {
    if (user) {
      console.log(user);
      (async () => {
        const userInfoFromServer = await getUserInfo()
        console.log(userInfoFromServer)
        if (userInfoFromServer && userInfoFromServer.data) {
          console.log(userInfoFromServer)
          setUserInfo(userInfoFromServer.data);
        }
      })();
    }
  },[user])

  // useEffect(() => {
  //   const { query: { fromSaas } } = router;
  //   if (fromSaas) {
  //     setSaasDashboard(true);
  //     (async () => {
  //       try {

  //       } catch (err) {
  //         generateToast('Unknown error about getting your balance', toast);
  //         console.log(err)
  //       }
  //     })();
  //   } else {
  //     setSaasDashboard(false);
  //     (async () => {
  //       try {
  //         const pointsPackagesFromServer = await getPointPackages()
  //         if (pointsPackagesFromServer && pointsPackagesFromServer.data && pointsPackagesFromServer.data.pointsPackages) {
  //           setPointsPackages(pointsPackagesFromServer.data.pointsPackages);
  //         }
  //         const userInfoFromServer = await getUserInfo()
  //         if (userInfoFromServer && userInfoFromServer.data) {
  //           setUserInfo(userInfoFromServer.data);
  //         }
  //       } catch (err) {
  //         generateToast('Unknown error about points', toast);
  //         console.log(err)
  //       }
  //     })();
  //   }
  // }, [paymentSucceed])

  // useEffect(() => {
  //   if (localStorage.getItem('chumi_jwt')) {
  //     let decoded: any = jwt_decode(localStorage.getItem('chumi_jwt') as string);
  //     if (new Date().getTime() > (decoded.exp * 1000)) {
  //       // token expires && revoke new token
  //       (async () => {
  //         await exchangeForCrowdCoreToken();
  //       })()
  //     }
  //   }
  //   else {
  //     // exchange token & store the crowdcore server token in local stoarge
  //     (async () => {
  //       await exchangeForCrowdCoreToken();
  //     })()
  //   }
  // }, []);
  return (
    <>
      {saasDashboard ?
      <div className="common__body">
      <div className="px-3 pt-3">
        <div className="card">
          <div className="flex-col">
          <div className="font-bold mb-3 text-gray-200">Top up your balance</div>
          <div className="font-bold mb-3 text-yellow-500">{`Your current balance: ${currencyFormatter(userInfo?.currency as string).format(0) || '0'}`}</div>
            <div className="grid grid-cols-6 gap-6">
              <div className="text-center rounded-md items-center p-2 m-2 border-2 border-solid border-yellow-100 border-opacity-50">
                  <div className="text-gray-200">{`For yourself`}</div> 
              </div>
              <div className="text-center rounded-md items-center p-2 m-2 border-2 border-solid border-gray-100 border-opacity-50">
                  <div className="text-gray-200">{`For another user`}</div>
              </div>
            </div>
          <div className="font-bold mt-5 mb-3 text-gray-200">Enter Amount</div>
            <input className="topup_enter-input" type="text" placeholder={currencyFormatter(userInfo?.currency as string).format(0)}></input>
            <div className="w-60 font-normal mt-5 mb-3 text-gray-500">Please select the same currency to cover the negative transactions</div>
          <div className="mt-20">
          <button className="topup_continue_button">Continue</button>
          </div>
        </div>
      </div>
      </div>
      </div>:
      <div className="common__body">
        <div className="flex pb-4 px-1" style={{maxWidth:'300px', margin:'auto'}}>
          {
            tab.map((item, index) => (
              <div key={index} className={`flex flex-1 ${item==="Coin" ? 'justify-start' : 'justify-end'}`}>
                <div
                  className={classnames('topup__tab', {active: tabCur === index})}
                  onClick={() => handleTabChange(index)}
                >{item}</div>
              </div>
            ))
          }
        </div>
        <div className="px-3 pt-3">
          <div className="card">
            <div className="topup-amount-container">
              <div>
              <div className="font-bold mb-3 m-2 flex">Balance&nbsp;&nbsp;
                <img className="inline align-middle w-4 mr-1" src={`/images/icon-${tabCur===0 ? 'coin' : 'diamond'}.svg`} alt="" />
                &nbsp;{tabCur===0 ? userInfo?.coins || '0' : userInfo?.diamonds || '0'}
              </div>
              {/* <div className="grid grid-cols-6 gap-6">
              <div onClick={handleForYourselfClick} className={selectedYourselftUser?"cursor-pointer text-center rounded-md items-center p-2 m-2 bg-rose-500 border-2 border-solid border-rose-500 border-opacity-50":"cursor-pointer text-center rounded-md items-center p-2 m-2 border-2 border-solid border-gray-100 border-opacity-50"}>
                  <div className="text-gray-200">{`For yourself`}</div>
              </div>
              <div onClick={handleForAnotherClick} className={selectedAnotherUser?"cursor-pointer text-center rounded-md items-center p-2 m-2 bg-rose-500 border-2 border-solid border-rose-500 border-opacity-50":"cursor-pointer text-center rounded-md items-center p-2 m-2 border-2 border-solid border-gray-100 border-opacity-50"}>
                  <div className="text-gray-200">{selectedAnotherUser?`For ${selectedAnotherUser.displayname ||selectedAnotherUser.email }`:`For another user`}</div>
              </div>
            </div> */}
              {/* {
              showSearchUser &&
              <div className="flex">
                <input value={searchUserName} onChange={onSearchUserNameChange} className="topup_username-input" type="text" placeholder="Please enter username of happin"></input>
                <button onClick={handleSearchUser} className="topup_continue_button mx-2">Search</button>
              </div>
            } */}
              {/* <div className="font-bold mt-5 mb-3 text-gray-200">Select following options</div> */}
              <div className="grid grid-cols-3">
                {tabCur===0 ?
                  coinPackage && coinPackage.map((p, index) => (
                    <div onClick={() => { handleSelectPointPackage(p, index) }} key={index}>
                      <div className={(selectedPackage!== undefined && p.amount == selectedPackage.amount && p.amountType == selectedPackage.amountType) ? "cursor-pointer text-center rounded-2xl items-center p-3 m-2 border-2 border-solid border-rose-500"
                        : "cursor-pointer text-center rounded-2xl items-center p-3 m-2 border-2 border-solid border-gray-100 border-opacity-50"}>
                        <div className='flex-col'>
                          <div className="text-gray-200 flex topup-amount font-bold">
                            <img className="inline align-middle w-4 mr-1" src="/images/icon-coin.svg" alt="" />
                            {p.amount >= 10000 ?  Math.floor(p.amount/1000) + 'K' : p.amount}
                          </div>
                          <div className="text-gray-200 flex topup-amount">
                              From&nbsp;
                                <img className="inline align-middle w-4 mr-1" src="/images/icon-diamond.svg" alt="" />
                                <span className={`font-bold ${p.discountedCost && 'strikethrough'}`}>{p.cost}</span>
                                { p.discountedCost &&
                                  <span>&nbsp;&nbsp;&nbsp;</span>
                                }
                                <span className="text-rose-700">{p.discountedCost && p.discountedCost}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                :
                  diamondPackage && diamondPackage.map((p, index) => (
                    <div onClick={() => { handleSelectPointPackage(p, index) }} key={index}>
                      <div className={(selectedPackage!== undefined && p.amount == selectedPackage.amount && p.amountType == selectedPackage.amountType) ? "cursor-pointer text-center rounded-2xl items-center p-3 m-2 border-2 border-solid border-rose-500 "
                        : "cursor-pointer text-center rounded-2xl items-center p-3 m-2 border-2 border-solid border-gray-100 border-opacity-50"}>
                        <div className='flex-col'>
                          <div className="text-gray-200 flex topup-amount font-bold">
                            <img className="inline align-middle w-4 mr-1" src="/images/icon-diamond.svg" alt="" />
                            {p.amount >= 10000 ?  Math.floor(p.amount/1000) + 'K' : p.amount}
                          </div>
                          <div className="text-gray-200 flex topup-amount">
                                <span className={`${p.discountedCost && 'strikethrough'}`}>{currencyFormatter(p.costType as string).format(p.cost/100)}</span>
                                { p.discountedCost &&
                                  <span>&nbsp;&nbsp;&nbsp;</span>
                                }
                                <span className="text-rose-500">{p.discountedCost && currencyFormatter(p.costType as string).format(p.discountedCost/100)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
              </div>
              {!showPayment && 
                <div className="mt-20">
                  <button onClick={handleContinue} className="topup_continue_button">Top up Now</button>
                </div>}
              {
                showPayment &&
                <>
                  <div className="mt-10 w-1/3">
                  {!showCoinPayment &&
                      <>
                        <div className="flex justify-between py-1">
                          <div className="text-gray-300">Price</div>
                          <div className="text-gray-300">{currencyFormatter(userInfo?.currency as string).format((selectedPackage?.discountedCost || selectedPackage?.cost || 0) / 100)}</div>
                        </div>
                        <div className="flex justify-between py-1">
                          <div className="text-gray-300">Processing Fee</div>
                          <div className="text-gray-300">{currencyFormatter(userInfo?.currency as string).format((selectedPackage?.discountedCost || selectedPackage?.cost || 0) / 100 * 0.03 + 0.5)}</div>
                        </div>
                        <div className="flex justify-between py-1">
                          <div className="text-gray-300">Total</div>
                          <div className="text-gray-300">{currencyFormatter(userInfo?.currency as string).format((selectedPackage?.discountedCost || selectedPackage?.cost || 0) / 100 * 1.03 + 0.5)}</div>
                        </div>
                        <CheckoutForm error={stripeInputError} setError={setStripeInputError} address={null} setAddress={null}></CheckoutForm>
                        </>
                    }
                        <div className="mt-5 text-center">
                          {!showCoinPayment && <p className="text-sm text-gray-400 mb-3">Processing fee will be applied</p>}
                          <Checkbox defaultIsChecked colorScheme="rose" size="md" value={agreeToTerms} onChange={() => { setAgreeToTerms(s => !s ? s = 1 : s = 0) }}>
                            <span className="text-sm text-gray-400">I agree to the website <a rel="noreferrer" target='_blank' href="https://happin.app/terms" className="text-gray-300 underline hover:text-white transition">Terms and Conditions</a></span>
                          </Checkbox>
                          <button onClick={onPaidPointsSubmit} disabled={isPorcessing} className="btn btn-white w-full">
                            {showCoinPayment ? 'Top up Now' : 'Pay With Credit Card'}
                          </button>
                        </div>
                      
                  </div>
                </>
              }
            </div>
          </div>
        </div>
      </div>
      }
      <Transition appear show={isPorcessing} as={Fragment}>
        <Dialog
          initialFocus={focusButtonRef}
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => {
          }}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="mask-enter"
              enterFrom="mask-enter-from"
              enterTo="mask-enter-to"
              leave="mask-leave"
              leaveFrom="mask-leave-from"
              leaveTo="mask-leave-to"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="dialog-enter"
              enterFrom="dialog-enter-from"
              enterTo="dialog-enter-to"
              leave="dialog-leave"
              leaveFrom="dialog-leave-from"
              leaveTo="dialog-leave-to"
            >
              <div className="relative inline-block w-full max-w-sm p-5 sm:p-6 my-8 overflow-hidden text-left align-middle bg-gray-800 rounded-2xl z-10">
                <div className="relative flex items-center justify-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg sm:text-xl font-bold leading-6 text-white"
                  >
                    <span className="text-rose-500">We are processing your top up...</span>
                  </Dialog.Title>
                </div>
                {/* dialog needs a element to focus, */}
                <button hidden={true} ref={focusButtonRef}></button>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PRIVATE_KEY as string, {locale:'en'});

const Topup = () => {
  return (
    <Elements stripe={stripePromise}>
      <TopupInner />
    </Elements>
  )
}

export default Topup

