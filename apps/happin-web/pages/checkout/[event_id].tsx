import React, { Fragment, useEffect, useReducer, useState } from 'react';
import TicketItem from '../../components/page_components/CheckoutPageComponents/TicketItem';
import CheckoutHead from '../../components/page_components/CheckoutPageComponents/CheckoutHead';
import BundleSidebar from '../../components/page_components/CheckoutPageComponents/BundleSidebar';
import { ETicketAvailability, ETicketFeature, ETicketType, ETicketVisibility, EventBasicData, GeneralTicketInfo, MerchItemDataProps, MerchProperty, TicketItemDataProps, TicketItemFeaturesProps } from '../../lib/model/checkout';
import MerchItem from '../../components/page_components/CheckoutPageComponents/MerchItem';
import { Link, animateScroll as scroll } from 'react-scroll';
import { useResize } from 'utils/hooks';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useCheckoutState } from 'contexts/checkout-state';
import { getEventDetailForCheckout, getEventMerchs, getGATickets } from 'lib/api';
import MerchSidebar from '@components/page_components/CheckoutPageComponents/MerchSideBar';


export enum ActionKind {
  Increase = 'INCREASE',
  Decrease = 'DECREASE',
  Init = 'INIT'
}

export type TicketListAction = {
  type: ActionKind,
  payload?: TicketItemDataProps,
  initValue?: TicketItemDataProps[],
  quantity?: number;
}

export type MerchListAction = {
  type: ActionKind,
  payload?: MerchItemDataProps,
  initValue?: MerchItemDataProps[],
  quantity?: number;
  propertyIndex?: number;
}

const ticketListReducer = (state: TicketItemDataProps[], action: TicketListAction) => {
  let finalTicketList = state
  if (action.type === ActionKind.Increase) {
    const targetIndex = state.findIndex(t => t.id === action.payload?.id);
    if (targetIndex !== -1) {
      const targetSection = state[targetIndex].sectionId;
      state.forEach(t => {
        if (t.sectionId === targetSection) {
          t.quantity += (action.quantity || 0);
        }
      })
      finalTicketList = [...state];
    }
  }
  if (action.type === ActionKind.Decrease) {
    const targetIndex = state.findIndex(t => t.id === action.payload?.id);
    if (targetIndex !== -1) {
      const targetSection = state[targetIndex].sectionId;
      state.forEach(t => {
        if (t.sectionId === targetSection) {
          t.quantity -= (action.quantity || 0);
        }
      })
      finalTicketList = [...state];
    }
  }
  if (action.type === ActionKind.Init) {
    return [...action.initValue as TicketItemDataProps[]]
  }
  return finalTicketList
}

const merchListReducer = (state: MerchItemDataProps[], action: MerchListAction) => {
  let finalMerchList = state;
  const propertyIndex = action.propertyIndex as number
  if (action.type === ActionKind.Increase) {
    const targetIndex = state.findIndex(t => t.id === action.payload?.id);
    if (targetIndex !== -1) {
      if (propertyIndex >= 0) {
        state[targetIndex].property[propertyIndex].pValue += (action.quantity || 0)
      }
      finalMerchList = [...state];
    }
  }
  if (action.type === ActionKind.Decrease) {
    const targetIndex = state.findIndex(t => t.id === action.payload?.id);
    if (targetIndex !== -1) {
      // if merch has property alter the quantity inside this property
      if (propertyIndex >= 0) {
        state[targetIndex].property[propertyIndex].pValue -= (action.quantity || 0)
      }
      finalMerchList = [...state];
    }
  }
  if (action.type === ActionKind.Init) {
    return [...action.initValue as MerchItemDataProps[]]
  }
  return finalMerchList
}

const Checkout = () => {
  const router = useRouter();
  const windowWidth = useResize();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bundleSidebarOpen, setBundleSidebarOpen] = useState(false);

  const [selectedRegularMerch, setSelectedRegularMerch] = useState<MerchItemDataProps>();
  const [selectedBundleMerch, setSelectedBundleMerch] = useState<MerchItemDataProps[]>();
  const [selectedBundleTicket, setSelectedBundleTicket] = useState<TicketItemDataProps>();

  // ticket list & merch list, payment page dont need these, hence not store in context
  const [merchListState, dispatcMerchListAction] = useReducer(merchListReducer, []);
  const [ticketListState, dispatchTicketListAction] = useReducer(ticketListReducer, []);

  const [saleStart, setSaleStart] = useState<boolean>();
  const [inPresale, setInPresale] = useState<boolean>();

  const { setEventDataForCheckout, eventDataForCheckout, boxOfficeMode, setGeneralTicketInfo, generalTicketInfo } = useCheckoutState();

  const ticketTypeHeaderId = new Set<string>()

  useEffect(() => {
    if (router?.query?.event_id) {
      Promise.all([getEventDetailAndSetState(router.query.event_id as string),
      getEventTicketsAndSetState(router.query.event_id as string),
      getEventMerchAndSetState(router.query.event_id as string)])
    }
    // check code in url is valid or not
    if (router?.query?.presale_code) {

    }

    if (router?.query?.code) {

    }
    // hack react-scroll初加载拿不到offset的问题
    scroll.scrollTo(1, {
      containerId: 'checkout-scroll-body'
    });
  }, [router.query])

  useEffect(() => {
    checkSaleStarted(1630793982000)
    /*  if (generalTicketInfo?.saleStartTime) {
       checkSaleStarted(generalTicketInfo.saleStartTime);
     } */
    if (generalTicketInfo?.presaleStart && generalTicketInfo?.presaleEnd) {
      checkPresaleStarted(generalTicketInfo.presaleStart, generalTicketInfo.presaleEnd);
    }
  }, [generalTicketInfo])

  const getEventDetailAndSetState = async (eventId: string) => {
    try {
      const res = await getEventDetailForCheckout(eventId);
      console.log(res)
      const eventDetail: EventBasicData = {
        tags: res.tags,
        title: res.title,
        startTime: res.startTime,
        endTime: res.endTime,
        default_currency: res.default_currency
      }
      setEventDataForCheckout(eventDetail)
    } catch (err) {
      console.log(err)
    }
  }

  const getEventTicketsAndSetState = async (eventId: string) => {
    try {
      const res = await getGATickets(eventId);
      const ticketList: TicketItemDataProps[] = res.tickets.map((t: any) => {
        let features: TicketItemFeaturesProps[] = [];
        switch (t.ticketType) {
          case 'paid':
            features = [ETicketFeature.TICKET]
            break;
          case 'free':
            features = [ETicketFeature.TICKET]
            break;
          case 'live':
            features = [ETicketFeature.TICKET, ETicketFeature.PLAYBACK]
            break;
          case 'pfm':
            features = [ETicketFeature.TICKET,
            ETicketFeature.PLAYBACK,
            ETicketFeature.VIP]
            break;
          case 'playback':
            features = [ETicketFeature.TICKET,
            ETicketFeature.PLAYBACK]
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
      dispatchTicketListAction({ type: ActionKind.Init, initValue: ticketList })
      const gerneralTicketInfo: GeneralTicketInfo = {
        absorbFee: res.generalInfo.absorbFee,
        saleStartTime: res.generalInfo.onSaleCounter,
        presaleStart: res.generalInfo.presaleStartTime,
        presaleEnd: res.generalInfo.presaleEndTime,
        taxNeeded: res.generalInfo.taxNeeded
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
          const bindTickets = m.activities.filter((a: any) => eventId === a.activityId)
            .map((a: any) => a.tickets.map((t: any) => t.ticketId))
          const merch: MerchItemDataProps = {
            id: m._id,
            image: m.image,
            name: m.name,
            max: m.max,
            forApp: m.forApp,
            description: m.description,
            price: m.price,
            kind: 'merch',
            mail: m.mail,
            show: m.show,
            property,
            tickets: bindTickets[0] || []
          }
          return merch
        })
      }
      dispatcMerchListAction({ type: ActionKind.Init, initValue: merchList })
    } catch (err) {
      console.log(err);
    }
  }


  const onTicketBundleSelect = (value: any) => {
    console.log(value)
    if (typeof value === 'object') {
      // set selected bundle items here
      filterBundleMerchForSelectedTicket(value.id)
      setSelectedBundleTicket(value)
      setBundleSidebarOpen(true);
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
    } else {
      setInPresale(false)
    }
  }

  const onPresaleCodeValidate = () => {
    setSaleStart(true)
  }

  const filterBundleMerchForSelectedTicket = (ticketId: string)=> {
    const filterMerchs = merchListState.filter(m => {
      if (m.tickets.includes(ticketId)) {
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
        onChange={dispatchTicketListAction}
        currency={eventDataForCheckout?.default_currency || ''}
        absorbFee={generalTicketInfo?.absorbFee || false}
        taxNeeded={generalTicketInfo?.taxNeeded || 0}
        disabled={disabledFlag}
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
        onChange={dispatchTicketListAction}
        currency={eventDataForCheckout?.default_currency || ''}
        taxNeeded={generalTicketInfo?.taxNeeded || 0}
        absorbFee={generalTicketInfo?.absorbFee || false}
        disabled={disabledFlag}
      />
    } else if (!boxOfficeMode) {
      return <Fragment key={item.id}></Fragment>
    }
    return <Fragment key={item.id}></Fragment>
  }


  if (ticketListState.length) {
    ticketListState.forEach(t => {
      switch (t.ticketType) {
        case ETicketType.LIVESTREAM:
          ticketTypeHeaderId.add('Livestream-Tickets');
          break;
        case ETicketType.PFM:
          ticketTypeHeaderId.add('Livestream-Tickets');
          break;
        case ETicketType.INPERSON:
          // not generate the tab for in person when the event is past
          if (eventDataForCheckout && moment(eventDataForCheckout.endTime).isBefore(new Date())) {
            return;
          }
          ticketTypeHeaderId.add('In-Person-Tickets');
          break;
        case ETicketType.FREEINPERSON:
          // not generate the tab for in person when the event is past
          if (eventDataForCheckout && moment(eventDataForCheckout.endTime).isBefore(new Date())) {
            return;
          }
          ticketTypeHeaderId.add('In-Person-Tickets');
          break;
        case ETicketType.PLAYBACK:
          ticketTypeHeaderId.add('Livestream-Tickets');
          break;
        default:
          break;
      }
    })
  }

  const ticketTypeHeaderArray = Array.from(ticketTypeHeaderId).map(id => (
    <Link
      className="checkout__head-tab"
      activeClass="active"
      containerId="checkout-scroll-body"
      to={id}
      name="myScrollToElement"
      spy={true}
      smooth={true}
      key={id}
      offset={windowWidth > 640 ? -56 : -44}
      duration={500}
    >
      {id.replace(/-/g, ' ')}
    </Link>
  ))

  const hasRegularMerch = () => {
    let hasRegularMerch = false
    if (merchListState.length) {
      merchListState.forEach(m => {
        if (!m.tickets.length) {
          hasRegularMerch = true;
        }
      })
    }
    return hasRegularMerch;
  }

  return (
    <div className="checkout__page">
      <div className="flex flex-col-reverse md:flex-col h-full">
        <CheckoutHead saleStart={saleStart} inPresale={inPresale} onPresaleCodeValidate={onPresaleCodeValidate} />
        <div className="flex-1 h-0 web-scroll overflow-y-auto" id="checkout-scroll-body">
          <div className="sticky top-0 bg-gray-800 shadow-2xl z-10">
            <div className="container">
              <div className="flex">
                {ticketTypeHeaderArray}
                {(merchListState.length && hasRegularMerch()) ?
                  <Link
                    className="checkout__head-tab"
                    activeClass="active"
                    containerId="checkout-scroll-body"
                    to="merch"
                    spy={true}
                    smooth={true}
                    offset={windowWidth > 640 ? -56 : -44}
                    duration={500}
                  >
                    Merch
                  </Link> : <></>}
              </div>
            </div>
          </div>
          <div className="container">
            <div className="checkout__container">
              <div className="divide-y divide-gray-700">
                {/* do not show ticket and merchs when not published */}
                {(eventDataForCheckout && !eventDataForCheckout.tags?.includes('Private')) &&
                  (<>
                    {/* display public sale start time when sale not start */}
                    {saleStart === false &&
                      (
                        <div className="sm:text-lg" style={{ fontWeight: 600, textAlign: 'center', margin: '20px 0' }}>
                          <h1>Public sale start on</h1>
                          <h1>{moment(generalTicketInfo?.saleStartTime).format('MMMM Do, h:mma')}</h1>
                        </div>
                      )}
                    <div id="Livestream-Tickets" className="divide-y divide-gray-700">
                      {
                        ticketListState.map((item) => {
                          if ((item.ticketType === ETicketType.LIVESTREAM || item.ticketType === ETicketType.PFM
                            || item.ticketType === ETicketType.PLAYBACK) && item.visibility !== ETicketVisibility.INVISIBLE) {

                            let disabledFlag = false;
                            if (!saleStart) {
                              disabledFlag = true
                            }
                            return renderTicketBaseOnAvailability(item, disabledFlag);
                          } else return <Fragment key={item.id}></Fragment>
                        })
                      }
                    </div>
                    <div id="In-Person-Tickets" className="divide-y divide-gray-700">
                      {
                        ticketListState.map((item) => {
                          if ((item.ticketType === ETicketType.INPERSON || item.ticketType === ETicketType.FREEINPERSON)
                            && item.visibility !== ETicketVisibility.INVISIBLE) {

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
                            if (eventDataForCheckout && moment(eventDataForCheckout?.endTime).isBefore(moment(new Date()))) {
                              return <Fragment key={item.id}></Fragment>
                            }
                            return renderTicketBaseOnAvailability(item, disabledFlag);
                          } else return <Fragment key={item.id}></Fragment>
                        })
                      }
                    </div>

                    {/* merch items start */}
                    {(merchListState.length > 0 && hasRegularMerch()) && (<div id="merch" className="py-5 sm:py-8 text-white">
                      <div className="mb-3 font-semibold text-lg">Adds On</div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {
                          merchListState.map((item) => {
                            let disabledFlag = false
                            if (!saleStart) {
                              disabledFlag = true
                            }
                            // not showing to the regular merch list if merch is 1. for app(virtual gift)
                            // 2. deleted(show is false) 3.tickets list has item (bundle merch)
                            if (item.forApp || !item.show || item.tickets.length) {
                              return <Fragment key={item.id}></Fragment>
                            }
                            return (
                              <MerchItem
                                key={item.id}
                                currency={eventDataForCheckout.default_currency}
                                data={item}
                                disabled={disabledFlag}
                                onSelect={() => {
                                  setSelectedRegularMerch(item)
                                  setSidebarOpen(true);
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
            onChangeMerchList={dispatcMerchListAction}
            onChangeTicketList={dispatchTicketListAction}
            merchs={selectedBundleMerch as MerchItemDataProps[]}
            onClose={() => {setBundleSidebarOpen(false); setSelectedBundleMerch(undefined); setSelectedBundleTicket(undefined)}}
          />
          <MerchSidebar
            onChange={dispatcMerchListAction}
            merch={selectedRegularMerch as MerchItemDataProps}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
            onClose={() => { setSidebarOpen(false); setSelectedRegularMerch(undefined) }}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
