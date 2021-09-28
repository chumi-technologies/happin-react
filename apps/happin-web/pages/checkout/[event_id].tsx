import React, { Fragment, useEffect, useState } from 'react';
import TicketItem from '../../components/page_components/CheckoutPageComponents/TicketItem';
import CheckoutHead from '../../components/page_components/CheckoutPageComponents/CheckoutHead';
import BundleSidebar from '../../components/page_components/CheckoutPageComponents/BundleSidebar';
import { ETicketAvailability, ETicketFeature, ETicketType, ETicketVisibility, EventBasicData, GeneralTicketInfo, MerchItemDataProps, MerchProperty, TicketItemDataProps, TicketItemFeaturesProps } from '../../lib/model/checkout';
import MerchItem from '../../components/page_components/CheckoutPageComponents/MerchItem';
// import { Link, animateScroll as scroll } from 'react-scroll';
// import { useResize } from 'utils/hooks';
import { useRouter } from 'next/router';
import moment from 'moment';
import { TicketAndMerchListActionKind, useCheckoutState } from 'contexts/checkout-state';
import { getEventDetailForCheckout, getEventMerchs, getGATickets, validateCode } from 'lib/api';
import MerchSidebar from '@components/page_components/CheckoutPageComponents/MerchSideBar';
import { releaseLock } from './payment';
import { generateToast } from '@components/page_components/CheckoutPageComponents/util/toast';
import { useToast } from '@chakra-ui/react';
import classNames from 'classnames';

const displayForBoxOfficeMode = (ticketAvailable: string) => {
  if ((ticketAvailable === ETicketAvailability.EVERY_WHERE || ticketAvailable === ETicketAvailability.AT_DOOR)) {
    return true
  } else return false
}
const displayForRegularMode = (ticketAvailable: string) => {
  if ((ticketAvailable === ETicketAvailability.EVERY_WHERE || ticketAvailable === ETicketAvailability.ONLINE)) {
    return true
  } else return false
}

const Checkout = () => {
  const router = useRouter();
  const toast = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bundleSidebarOpen, setBundleSidebarOpen] = useState(false);

  const [selectedRegularMerch, setSelectedRegularMerch] = useState<MerchItemDataProps>();
  const [selectedBundleMerch, setSelectedBundleMerch] = useState<MerchItemDataProps[]>();
  const [selectedBundleTicket, setSelectedBundleTicket] = useState<TicketItemDataProps>();

  const [saleStart, setSaleStart] = useState<boolean>();
  const [inPresale, setInPresale] = useState<boolean>();

  const [showingTab, setShowingTab] = useState<string>('');

  const [cartPopoverMsg, setCartPopoverMsg] = useState<any>({show: false});

  // indicate presale code from url param is valid
  const [presaleCodeUsed, setPresaleCodeUsed] = useState<boolean>(false);

  const { setEventDataForCheckout,
    eventDataForCheckout,
    boxOfficeMode,
    setGeneralTicketInfo,
    generalTicketInfo,
    setAffiliate,
    setCodeUsed, merchListState,
    dispatchMerchListAction,
    ticketListState,
    dispatchTicketListAction,
    onlyShowMerch,
    clearCart,
    codeUsed,
    setUserInfoFromUrl
  } = useCheckoutState();

  const ticketTypeHeaderId = new Set<string>()

  const [sortedHeader, setSortedHeader] = useState<string[]>([]);

  useEffect(()=>{
    if (codeUsed) {
      setCodeUsed('')
    }
  },[])

  useEffect(() => {
    (async () => {
      if (router.query.event_id && router.query.event_id !== 'undefined') {
        if (localStorage.getItem('orderId')) {
          await releaseLock()
        }
        // for user info form at payment page, higher priority than user state's info
        setUserInfoFromUrl({email: router.query.email, phonenumber: router.query.phone, displayname: router.query.username})
        // only clear cart when the order is failed to created due to not enough quantity, redirected from payment page
        if (localStorage.getItem('clearcart')) {
          console.log('clear cart')
          clearCart()
          localStorage.removeItem('clearcart')
        }
        await Promise.all([getEventDetailAndSetState(router.query.event_id as string),
        getEventTicketsAndSetState(router.query.event_id as string),
        getEventMerchAndSetState(router.query.event_id as string)])

        // check code in url is valid or not
        if (router.query.code || router.query.affiliate) {
          // affilate code could be 100% discount code, hence need to check
          // if the affilate code is valid disocunt code, then store in the context if valid (codeUsed)
          if (router.query.affiliate) {
            // store affiliate code into context regardless, server will check validity on final step
            setAffiliate(router.query.affiliate as string)
            return
          }
          // two code appear at same time is not possible
          await validateUrlCodeAndSetState(router.query.event_id as string, ((router.query.code || router.query.affiliate) as string));
        }
      }
    })()
  }, [router.query])

  useEffect(() => {
    if (generalTicketInfo?.saleStartTime) {
      checkSaleStarted(generalTicketInfo.saleStartTime);
    }
    if (generalTicketInfo?.presaleStart && generalTicketInfo?.presaleEnd) {
      checkPresaleStarted(generalTicketInfo.presaleStart, generalTicketInfo.presaleEnd);
    }
  }, [generalTicketInfo, presaleCodeUsed])

  useEffect(()=> {
    let timerToHideMsg: any;
    timerToHideMsg = setTimeout(()=> {setCartPopoverMsg({show: false})}, 2000)
    return ()=>{
      if(timerToHideMsg) {clearTimeout(timerToHideMsg)};
    }
  }, [cartPopoverMsg])

  const validateUrlCodeAndSetState = async (eventId: string, code: string) => {
    try {
      const res = await validateCode(eventId, code)
      if (res.valid) {
        if (res.type === 'discount') {
          generateToast('Discount code applied.',toast)
          setCodeUsed(res.code)
          if (res.appliedTo && res.appliedTo.length || res.appliedToAll) {
            setDiscountCodeApplied({appliedTo: res.appliedTo, discount: res.discount, method: res.discountMethod, appliedToAll: res.appliedToAll})
          }
        } else if (res.type === 'presale') {
          setPresaleCodeUsed(true);
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const [discountCodeApplied, setDiscountCodeApplied] = useState<{appliedTo: Array<string>, discount: number, method: string, appliedToAll: boolean}>();

  const getEventDetailAndSetState = async (eventId: string) => {
    try {
      const res = await getEventDetailForCheckout(eventId);
      const eventDetail: EventBasicData = {
        id: res._id,
        tags: res.tags,
        title: res.title,
        startTime: res.startTime,
        endTime: res.endTime,
        default_currency: res.default_currency,
        cover: res.cover,
        paymentMethod: res.paymentMethod,
        paypalEmail: res.paypalEmail,
        stripeKey: res.stripeKey,
      }
      setEventDataForCheckout(eventDetail)
    } catch (err) {
      console.log(err)
    }
  }

  const getEventTicketsAndSetState = async (eventId: string) => {
    try {
      const res = await getGATickets(eventId);

      const ticketList: TicketItemDataProps[] = res.tickets.map((t: any, index: number) => {
        let features: TicketItemFeaturesProps[] = [];
        switch (t.ticketType) {
          case ETicketType.LIVESTREAM:
            features = [ETicketFeature.TICKET, ETicketFeature.PLAYBACK];
            break;
          case ETicketType.PFM:
            features = [ETicketFeature.TICKET,
            ETicketFeature.PLAYBACK,
            ETicketFeature.VIP];
            break;
          case ETicketType.PLAYBACK:
            features = [ETicketFeature.TICKET,
            ETicketFeature.PLAYBACK];
            break;
          case ETicketType.INPERSON:
            features = [ETicketFeature.TICKET];
            break;
          case ETicketType.FREEINPERSON:
            features = [ETicketFeature.TICKET];
            break;
          default:
            break;
        }

        if (t.isBundle) {
          features.push(ETicketFeature.MERCHBUNDLE);
        }

        const ticket: TicketItemDataProps = {
          id: t.id,
          sectionId: t.sectionId,
          title: t.name,
          start: t.start,
          end: t.end,
          minPerOrder: t.minPerOrder,
          maxPerOrder: t.maxPerOrder,
          quantity: t.quantity,
          originalQuantity: t.quantity,
          ticketType: t.ticketType,
          merch: t.isBundle,
          price: t.price,
          notes: t.notes,
          features,
          kind: t.isBundle ? 'bundle' : 'ticket',
          visibility: t.visibility,
          availability: t.availability
        }
        return ticket
      })

      dispatchTicketListAction({ type: TicketAndMerchListActionKind.Init, initValue: ticketList })
      const gerneralTicketInfo: GeneralTicketInfo = {
        absorbFee: res.generalInfo.absorbFee,
        saleStartTime: res.generalInfo.onSaleCounter,
        presaleStart: res.generalInfo.presaleStartTime,
        presaleEnd: res.generalInfo.presaleEndTime,
        taxNeeded: res.generalInfo.taxNeeded,
        refundPolicy: res.generalInfo.refundPolicy
      }
      setGeneralTicketInfo(gerneralTicketInfo);
    } catch (err) {
      console.log(err)
    }
  }

  const getEventMerchAndSetState = async (eventId: string) => {
    try {
      const res = await getEventMerchs(eventId);
      let merchList: MerchItemDataProps[] = []
      if (res.length) {
        merchList = res.map((m: any) => {
          const property: MerchProperty[] = m.properties.map((p: any) => ({
            ...p,
            originalPValue: p.pValue
          }))
          // if this merch's price is greater than 0, it's not considered to be
          // a bundle merch, but a regular merch binded to a ticket as optional item
          const bindTickets = m.activities.filter((a: any) => eventId === a.activityId)
            .map((a: any) => a.tickets.map((t: any) => t.ticketId))
          const merch: MerchItemDataProps = {
            id: m._id,
            image: m.image,
            name: m.name,
            max: m.max,
            forApp: m.forApp,
            description: m.description,
            shippingCountry: m.shippingCost.map((shipping: any) => shipping.destination),
            price: m.price,
            kind: 'merch',
            mail: m.mail,
            show: m.show,
            isDonation: m.isDonation,
            property,
            isOptionalBundleItem: (m.price > 0 && bindTickets[0].length),
            tickets: bindTickets[0] || []
          }
          return merch
        })
      }
      dispatchMerchListAction({ type: TicketAndMerchListActionKind.Init, initValue: merchList })
    } catch (err) {
      console.log(err);
    }
  }


  const onTicketBundleSelect = (value: any) => {
    if (typeof value === 'object') {
      setBundleSidebarOpen(false)
      // set selected bundle merch
      filterBundleMerchForSelectedTicket(value.id)
      // set selceted bundle ticket
      setSelectedBundleTicket(value)
      // give a delay to allow the selected merch and ticket are updated
      setTimeout(() => {
        setBundleSidebarOpen(true);
      }, 100)
    }
  }

  const checkSaleStarted = (unixTime: number) => {
    // need to add condition if a presale code is entered and is valid (validate on server),
    if (new Date(unixTime) < new Date()) {
      setSaleStart(true)
    } else {
      setSaleStart(false)
    }
  }

  const checkPresaleStarted = (start: number, end: number) => {
    if (moment(new Date()).isBetween(moment(start), moment(end))) {
      setInPresale(true)
      if (presaleCodeUsed) {
        generateToast('You have entered the presale code', toast);
        setSaleStart(true);
      }
    } else {
      setInPresale(false)
    }
  }

  const filterBundleMerchForSelectedTicket = (ticketId: string) => {
    const filterMerchs = merchListState.filter(m => {
      // generate bundle items for the side bar to show
      // filter out not isOptionalBundleItem , so the side bar only includes 0 price bundle items
      if (m.tickets.includes(ticketId) && !m.isOptionalBundleItem) {
        return true
      }
    })
    setSelectedBundleMerch(filterMerchs);
  }

  const renderTicketBaseOnAvailability = (item: TicketItemDataProps, disabledFlag: boolean): JSX.Element => {
    // in box office mode, only display at door and every-where tickets
    // otherwise display every-where && online tickets
    if (boxOfficeMode && (item.availability === ETicketAvailability.AT_DOOR
      || item.availability === ETicketAvailability.EVERY_WHERE)) {
      return <TicketItem
        key={item.id}
        data={item}
        onSelect={onTicketBundleSelect}
        currency={eventDataForCheckout?.default_currency || ''}
        absorbFee={generalTicketInfo?.absorbFee || false}
        taxNeeded={generalTicketInfo?.taxNeeded || 0}
        disabled={disabledFlag}
        setCartPopoverMsg={setCartPopoverMsg}
        discountCodeApplied={discountCodeApplied}
      />
    } else if (boxOfficeMode) {
      return <Fragment key={item.id}></Fragment>
    }
    if (!boxOfficeMode && (item.availability === ETicketAvailability.EVERY_WHERE
      || item.availability === ETicketAvailability.ONLINE)) {
      return <TicketItem
        key={item.id}
        data={item}
        onSelect={onTicketBundleSelect}
        currency={eventDataForCheckout?.default_currency || ''}
        taxNeeded={generalTicketInfo?.taxNeeded || 0}
        absorbFee={generalTicketInfo?.absorbFee || false}
        disabled={disabledFlag}
        setCartPopoverMsg={setCartPopoverMsg}
        discountCodeApplied={discountCodeApplied}
      />
    } else if (!boxOfficeMode) {
      return <Fragment key={item.id}></Fragment>
    }
    return <Fragment key={item.id}></Fragment>
  }

  useEffect(() => {
    // for init the ticket headers options (in person tab/ live stram tab)
    if (ticketListState.length && !sortedHeader.length) {
      ticketListState.filter(t => t.visibility !== ETicketVisibility.INVISIBLE && t.visibility !== ETicketVisibility.HIDDEN).forEach(t => {
        // skip adding header for 1. box office mode, online tickets
        // and 2. not box office mode, at door tickets
        if (boxOfficeMode) {
          if (!displayForBoxOfficeMode(t.availability)) return;
        } else if (!displayForRegularMode(t.availability)) return;

        switch (t.ticketType) {
          case ETicketType.LIVESTREAM:
            ticketTypeHeaderId.add('Livestream-Tickets');
            break;
          case ETicketType.PFM:
            ticketTypeHeaderId.add('Livestream-Tickets');
            break;
          case ETicketType.INPERSON:
            // not generate the tab for in person when the event is past
/*             if (eventDataForCheckout && moment(eventDataForCheckout.endTime).isBefore(new Date())) {
              return;
            } */
            ticketTypeHeaderId.add('In-Person-Tickets');
            break;
          case ETicketType.FREEINPERSON:
            // not generate the tab for in person when the event is past
/*             if (eventDataForCheckout && moment(eventDataForCheckout.endTime).isBefore(new Date())) {
              return;
            } */
            ticketTypeHeaderId.add('In-Person-Tickets');
            break;
          case ETicketType.PLAYBACK:
            ticketTypeHeaderId.add('Livestream-Tickets');
            break;
          default:
            break;
        }
      })
      const sortedHead = Array.from(ticketTypeHeaderId).sort((a: string, b: string) => {
        if (a > b) return -1
        else return 1
      })
      setSortedHeader(sortedHead)
    }
  }, [ticketListState])


  useEffect(() => {
    // for initialize the showing tab only
    // (display Livestream-Tickets or In-Person-Tickets on page loaded)
    if (ticketListState.length && !showingTab) {
      let hasLiveTicket = false;
      let hasInPersonTicket = false;
      ticketListState.forEach(t => {
        // skip for 1. box office mode, online tickets
        // and 2. not box office mode, at door tickets
        if (boxOfficeMode) {
          if (displayForBoxOfficeMode(t.availability) && t.visibility !== ETicketVisibility.INVISIBLE && t.visibility !== ETicketVisibility.HIDDEN) {
            if ([ETicketType.INPERSON, ETicketType.FREEINPERSON].includes(t.ticketType)) {
              hasInPersonTicket = true;
            } else if ([ETicketType.LIVESTREAM, ETicketType.PFM, ETicketType.PLAYBACK].includes(t.ticketType)) {
              hasLiveTicket = true;
            }
          };
        } else if (displayForRegularMode(t.availability) && t.visibility !== ETicketVisibility.INVISIBLE && t.visibility !== ETicketVisibility.HIDDEN) {
          if ([ETicketType.INPERSON, ETicketType.FREEINPERSON].includes(t.ticketType)) {
            hasInPersonTicket = true;
          } else if ([ETicketType.LIVESTREAM, ETicketType.PFM, ETicketType.PLAYBACK].includes(t.ticketType)) {
            hasLiveTicket = true;
          }
        };
      })
      if (hasInPersonTicket) {
        // prioritize live stream ticket first (if any live stream ticket exists)
        if (hasLiveTicket) setShowingTab('Livestream-Tickets'); else setShowingTab('In-Person-Tickets')
      } else {
        setShowingTab('Livestream-Tickets')
      }
    }
  }, [boxOfficeMode, ticketListState])



  const hasRegularMerch = () => {
    let hasRegularMerch = false
    if (merchListState.length) {
      merchListState.filter(m => m.show && !m.forApp).forEach(m => {
        if (!m.tickets.length) {
          hasRegularMerch = true;
        }
      })
    }
    return hasRegularMerch;
  }

  return (
    <div className="checkout__page">
      <div className="sm:flex sm:flex-col-reverse md:flex-col sm:h-full">
        <CheckoutHead
          saleStart={saleStart}
          inPresale={inPresale}
          cartPopoverMsg={cartPopoverMsg}
          onPresaleCodeValidate={setSaleStart} />
        <div className="sm:flex-1 sm:h-0 web-scroll overflow-y-auto" id="checkout-scroll-body">
          <div className="fixed sm:sticky top-0 left-0 right-0 bg-gray-800 shadow-2xl z-10 border-b border-solid border-gray-700 md:border-0">
            <div className="container">
              <div className="flex overflow-x-auto">
                {!onlyShowMerch && (
                  sortedHeader.map(id => {
                    return (
                      <div
                        onClick={() => { setShowingTab(id) }}
                        className={classNames('checkout__head-tab', { active: showingTab === id })}
                        key={id}
                      >
                        {id.replace(/-/g, ' ')}
                      </div>
                    )
                  })
                )}
                {
                  (merchListState.length > 0 && hasRegularMerch()) &&
                  <div
                    onClick={() => { setShowingTab('merch') }}
                    className={classNames('checkout__head-tab', { active: showingTab === 'merch' })}
                  >
                    Add on
                  </div>
                }
              </div>
            </div>
          </div>
          <div className="container">
            <div className="checkout__container">
              {saleStart === false &&
                <div className="rounded-lg bg-yellow-500 px-4 py-3 md:px-5 md:py-3 text-gray-900 text-sm mt-5 sm:mt-8">
                  <div className="table">
                    {(generalTicketInfo?.presaleStart && generalTicketInfo?.presaleEnd) &&
                      <div className="table-row">
                        <div className="table-cell py-0.5 pr-3 whitespace-nowrap">Pre Sale:</div>
                        <div className="table-cell py-0.5 font-semibold">{moment(generalTicketInfo?.presaleStart).format('MMMM Do, h:mma')} - {moment(generalTicketInfo?.presaleEnd).format('MMMM Do, h:mma')}</div>
                      </div>
                    }
                    {saleStart === false &&
                      <div className="table-row">
                        <div className="table-cell py-0.5 pr-3 whitespace-nowrap">Public Sale:</div>
                        <div className="table-cell py-0.5 font-semibold">{moment(generalTicketInfo?.saleStartTime).format('MMMM Do, h:mma')}</div>
                      </div>
                    }
                  </div>
                </div>
              }

              <div className="divide-y divide-gray-700">
                {/* do not show ticket and merchs when not published */}
                {(eventDataForCheckout && eventDataForCheckout.tags?.includes('Private')) && (
                  <div className="sm:text-lg" style={{
                    position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, 0)',
                    fontWeight: 600, textAlign: 'center', margin: '20px 0'
                  }}>
                    <h1>Event not yet published</h1>
                  </div>
                )}
                {(eventDataForCheckout && !eventDataForCheckout.tags?.includes('Private')) &&
                  (<>
                    {!onlyShowMerch && <>
                      {
                        showingTab === 'Livestream-Tickets' && (
                          <div id="Livestream-Tickets" className="divide-y divide-gray-700">
                            {
                              ticketListState.map((item) => {
                                if ((item.ticketType === ETicketType.LIVESTREAM || item.ticketType === ETicketType.PFM
                                  || item.ticketType === ETicketType.PLAYBACK) && item.visibility !== ETicketVisibility.INVISIBLE && item.visibility !== ETicketVisibility.HIDDEN) {

                                  let disabledFlag = false;
                                  if (!saleStart) {
                                    disabledFlag = true
                                  }
                                  return renderTicketBaseOnAvailability(item, disabledFlag);
                                } else return <Fragment key={item.id}></Fragment>
                              })
                            }
                          </div>
                        )
                      }
                      {
                        showingTab === 'In-Person-Tickets' && (
                          <div id="In-Person-Tickets" className="divide-y divide-gray-700">
                            {
                              ticketListState.map((item) => {
                                if ((item.ticketType === ETicketType.INPERSON || item.ticketType === ETicketType.FREEINPERSON)
                                  && item.visibility !== ETicketVisibility.INVISIBLE && item.visibility !== ETicketVisibility.HIDDEN) {

                                  // for inperson ticket, if event has started, disable all the in person tickets,
                                  // by passing the disabled into ticketItem
                                  let disabledFlag = false;
                                  if (eventDataForCheckout && moment(eventDataForCheckout?.startTime).isBefore(moment(new Date()))) {
                                    disabledFlag = true;
                                  }
                                  if (!saleStart) {
                                    disabledFlag = true
                                  }
                                  // if event has ended do not show the in person tickets at all
                                  /* if (eventDataForCheckout && moment(eventDataForCheckout?.endTime).isBefore(moment(new Date()))) {
                                    return <Fragment key={item.id}></Fragment>
                                  } */
                                  return renderTicketBaseOnAvailability(item, disabledFlag);
                                } else return <Fragment key={item.id}></Fragment>
                              })
                            }
                          </div>
                        )
                      }


                      {/* show bundle optional item here (not free but has relation to ticket) , only show under live ticket
                          in person ticket tab, not showing in add on ticket tab
                      */}
                      {(merchListState.length > 0 && (showingTab !== 'merch') )&& (<div className="py-5 sm:py-8 text-white">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {
                          merchListState.map((item) => {
                            let disabledFlag = false
                            if (!saleStart) {
                              disabledFlag = true
                            }
                            // not showing to the regular merch list if merch is 1. for app(virtual gift)
                            // 2. deleted(show is false) 3.is not optional bundle merch
                            if (item.forApp || !item.show || !item.isOptionalBundleItem) {
                              return <Fragment key={item.id}></Fragment>
                            }
                            return (
                              <MerchItem
                                key={item.id}
                                currency={eventDataForCheckout.default_currency}
                                data={item}
                                disabled={disabledFlag}
                                onSelect={() => {
                                  setSidebarOpen(false);
                                  setSelectedRegularMerch(item)
                                  setTimeout(()=>{ setSidebarOpen(true)}, 250)
                                }}
                              />
                            )
                          })
                        }
                      </div>
                    </div>)}
                    </>}
                    {/* merch items start */}
                    {(merchListState.length > 0 && hasRegularMerch() && ((showingTab === 'merch') || onlyShowMerch)) && (<div id="merch" className="py-5 sm:py-8 text-white">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {
                          merchListState.map((item) => {
                            let disabledFlag = false
                            if (!saleStart) {
                              disabledFlag = true
                            }
                            // not showing to the regular merch list if merch is 1. for app(virtual gift)
                            // 2. deleted(show is false) 3.tickets list has item (bundle merch)
                            if (item.forApp || !item.show || item.tickets.length || item.isOptionalBundleItem) {
                              return <Fragment key={item.id}></Fragment>
                            }
                            return (
                              <MerchItem
                                key={item.id}
                                currency={eventDataForCheckout.default_currency}
                                data={item}
                                disabled={disabledFlag}
                                onSelect={() => {
                                  setSidebarOpen(false);
                                  setSelectedRegularMerch(item)
                                  setTimeout(()=>{ setSidebarOpen(true)}, 250)
                                }}
                              />
                            )
                          })
                        }
                      </div>
                    </div>)}
                  </>)
                }
              </div>
            </div>
          </div>
          <BundleSidebar
            ticket={selectedBundleTicket as TicketItemDataProps}
            isOpen={bundleSidebarOpen}
            setIsOpen={setBundleSidebarOpen}
            merchs={selectedBundleMerch as MerchItemDataProps[]}
            setCartPopoverMsg = {setCartPopoverMsg}
            onClose={() => { setBundleSidebarOpen(false); setSelectedBundleMerch(undefined); setSelectedBundleTicket(undefined) }}
          />
          <MerchSidebar
            merch={selectedRegularMerch as MerchItemDataProps}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
            setCartPopoverMsg = {setCartPopoverMsg}
            onClose={() => { setSidebarOpen(false); setSelectedRegularMerch(undefined) }}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
