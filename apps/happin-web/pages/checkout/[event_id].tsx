import React, { Fragment, useEffect, useReducer, useState } from 'react';
import TicketItem from '../../components/page_components/CheckoutPageComponents/TicketItem';
import CheckoutHead from '../../components/page_components/CheckoutPageComponents/CheckoutHead';
import BundleSidebar from '../../components/page_components/CheckoutPageComponents/BudleSidebar';
import { ETicketFeature, ETicketType, EventBasicData, MerchItemDataProps, TicketItemDataProps } from '../../lib/model/checkout';
import MerchItem from '../../components/page_components/CheckoutPageComponents/MerchItem';
import { Link, animateScroll as scroll } from 'react-scroll';
import { useResize } from 'utils/hooks';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useCheckoutState } from 'contexts/checkout-state';
import { getEventDetailForCheckout } from 'lib/api';
import MerchSidebar from '@components/page_components/CheckoutPageComponents/MerchSideBar';

const ticketDataList: TicketItemDataProps[] = [
  {
    id: '1',
    title: 'General Pass',
    price: 99,
    subPrice: ['CA$11.60 Fee', 'CA$27.51 GST/HST'],//????
    start: 1629670051,
    end: 1630718220,
    features: [
      ETicketFeature.TICKET,
      ETicketFeature.PLAYBACK,
      ETicketFeature.MERCHBUNDLE,
      ETicketFeature.VIP
    ],
    merch: false,
    quantity: 12,
    introduction: 'An all-access ticket which includes food and drink, career fair, workshops, conference sessions and keynotes, slides and slack-channel.An all-access ticket which includes food and drink, career fair, workshops, conference',
    //helpText: 'What’s VIP room?',
    kind: 'ticket',
    sectionId: '123',
    minPerOrder: 5,
    maxPerOrder: 10,
    originalQuantity: 12,
    ticketType: ETicketType.LIVESTREAM,
  },
  {
    id: '2',
    title: 'General Pass + Merch Bundle A',
    price: 99,
    subPrice: ['CA$11.60 Fee', 'CA$27.51 GST/HST'],
    features: [
      ETicketFeature.TICKET,
      ETicketFeature.PLAYBACK
    ],
    quantity: 12,
    introduction: 'An all-access ticket which includes food and drink, career fair, workshops, conference sessions and keynotes, slides and slack-channel.An all-access ticket which includes food and drink, career fair, workshops, conference',
    merch: false,
    kind: 'ticket',
    sectionId: '123',
    minPerOrder: 3,
    maxPerOrder: 5,
    originalQuantity: 12,
    ticketType: ETicketType.INPERSON,
  }
];
const merchList: MerchItemDataProps[] = [
  {
    id: '1',
    image: ['https://cdn.sspai.com/article/fe0d40a7-1a78-79f8-fb04-1fa0a3ccd358.jpg'],
    name: 'Merch 1',
    price: 50.00,
    description: 'Merch DesMerch DesMerch DesMe...',
    property: [{pName: 's', pValue: 4, originalPValue: 4}],
    kind: 'merch',
    max: 10,
    mail: false, 
    forApp: false,
    show: false,
    tickets : []
  },
  {
    id: '2',
    image: ['https://cdn.sspai.com/article/fe0d40a7-1a78-79f8-fb04-1fa0a3ccd358.jpg'],
    name: 'Merch 2',
    price: 50.00,
    description: 'Merch DesMerch DesMerch DesMe...',
    property: [{pName: 's', pValue: 4, originalPValue: 4}],
    kind: 'merch',
    max: 10,
    mail: false, 
    forApp: false,
    show: true,
    tickets : []
  },
  {
    id: '3',
    image: ['https://cdn.sspai.com/article/fe0d40a7-1a78-79f8-fb04-1fa0a3ccd358.jpg'],
    name: 'Merch 3',
    price: 50.00,
    description: 'Merch DesMerch DesMerch DesMe...',
    property: [{pName: 's', pValue: 4, originalPValue: 4},{pName: 'v', pValue: 0, originalPValue: 0}, {pName: 'c', pValue: 8, originalPValue: 8}],
    kind: 'merch',
    max: 6,
    mail: false, 
    forApp: false,
    show: true,
    tickets : []
  },
  {
    id: '4',
    image: ['https://cdn.sspai.com/article/fe0d40a7-1a78-79f8-fb04-1fa0a3ccd358.jpg'],
    name: 'Merch 4',
    price: 50.00,
    description: 'Merch DesMerch DesMerch DesMe...',
    property: [{pName: 's', pValue: 4, originalPValue: 4}],
    kind: 'merch',
    max: 10,
    mail: false, 
    forApp: true,
    show: false,
    tickets : []
  },
  {
    id: '5',
    image: ['https://cdn.sspai.com/article/fe0d40a7-1a78-79f8-fb04-1fa0a3ccd358.jpg'],
    name: 'Merch 4',
    price: 50.00,
    description: 'Merch DesMerch DesMerch DesMe...',
    property: [{pName: 's', pValue: 4, originalPValue: 4}],
    kind: 'merch',
    max: 10,
    mail: false, 
    forApp: false,
    show: true,
    tickets : ['123456688']
  },
];

export enum ActionKind {
  Increase = 'INCREASE',
  Decrease = 'DECREASE',
  Init = 'INIT'
}

export type TicketListAction = {
  type: ActionKind,
  payload?: TicketItemDataProps,
  default?: TicketItemDataProps[],
  quantity?: number;
}

export type MerchListAction = {
  type: ActionKind,
  payload?: MerchItemDataProps,
  default?: MerchItemDataProps[],
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
    return [...action.default as TicketItemDataProps[]]
  }
  return finalTicketList
}

const merchListReducer = (state: MerchItemDataProps[], action: MerchListAction) => {
  let finalTicketList = state;
  const propertyIndex = action.propertyIndex as number
  if (action.type === ActionKind.Increase) {
    const targetIndex = state.findIndex(t => t.id === action.payload?.id);
    if (targetIndex !== -1) {
      if (propertyIndex >= 0) {
        state[targetIndex].property[propertyIndex].pValue += (action.quantity || 0)
      }
      finalTicketList = [...state];
    }
  }
  if (action.type === ActionKind.Decrease) {
    const targetIndex = state.findIndex(t => t.id === action.payload?.id);
    if (targetIndex !== -1) {
      // if merch has property alter the quantity inside this property
      if (propertyIndex >= 0) {
        state[targetIndex].property[propertyIndex].pValue -= (action.quantity || 0)
      }
      finalTicketList = [...state];
    }
  }
  if (action.type === ActionKind.Init) {
    return [...action.default as MerchItemDataProps[]]
  }
  return finalTicketList
}

const Checkout = () => {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [bundleSidebarOpen, setBundleSidebarOpen] = useState(false);
  const [selectedRegularMerch, setSelectedRegularMerch] = useState<MerchItemDataProps | undefined>();
  const [merchListState, dispatcMerchListAction] = useReducer(merchListReducer, []);
  const [ticketListState, dispatchTicketListAction] = useReducer(ticketListReducer, []);

  const [saleStart, setSaleStart] = useState<boolean | undefined>();
  const [saleStatTime, setSaleStartTime] = useState<number>();
  const [inPresale, setInPresale] = useState<boolean | undefined>();

  const { setEventDataForCheckout, eventDataForCheckout, cart } = useCheckoutState();

  useEffect(() => {
    if (router?.query?.event_id) {
      // do api call
      getEventDetailAndSetState(router?.query?.event_id as string);
      dispatchTicketListAction({ type: ActionKind.Init, default: ticketDataList })
      dispatcMerchListAction({ type: ActionKind.Init, default: merchList })
      checkSaleStarted(1632975969000);
      // !!!!!!!!!!! if ticket has presale start and end
      checkPresaleStarted(1630297569000, 1630556769000);
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

  const getEventDetailAndSetState = async(eventId: string) => {
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
    } catch(err) {
      console.log(err)
    }
  }

  const windowWidth = useResize();

  const onTicketSelect = (value: any) => {
    if (typeof value === 'object') {
      setBundleSidebarOpen(true);
    } else {
    }
  }

  const ticketTypeHeaderId = new Set<string>()
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


  const checkSaleStarted = (unixTime: number) => {
    // need to add condition if a presale code is entered and is valid (validate on server),
    if (new Date(unixTime) < new Date()) {
      setSaleStart(true)
    } else {
      setSaleStart(false)
      setSaleStartTime(unixTime);
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

  console.log(cart);
  console.log(merchListState)


  return (
    <div className="checkout__page">
      <div className="flex flex-col-reverse md:flex-col h-full">
        <CheckoutHead saleStart={saleStart} inPresale={inPresale} onPresaleCodeValidate={onPresaleCodeValidate} />
        <div className="flex-1 h-0 web-scroll overflow-y-auto" id="checkout-scroll-body">
          <div className="sticky top-0 bg-gray-800 shadow-2xl z-10">
            <div className="container">
              <div className="flex">
                {ticketTypeHeaderArray}
                {merchListState.length ?
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
                {(eventDataForCheckout && !eventDataForCheckout.tags.includes('Private')) &&
                  (<>
                    {/* display public sale start time when sale not start */}
                    {saleStart === false &&
                      (
                        <div className="sm:text-lg" style={{ fontWeight: 600, textAlign: 'center', margin: '20px 0' }}>
                          <h1>Public sale start on</h1>
                          <h1>{moment(saleStatTime).format('MMMM Do, h:mma')}</h1>
                        </div>
                      )}
                    <div id="Livestream-Tickets" className="divide-y divide-gray-700">
                      {
                        ticketListState.map((item) => {
                          if (item.ticketType === ETicketType.LIVESTREAM || item.ticketType === ETicketType.PFM) {
                            let disabledFlag = false;
                            if (!saleStart) {
                              disabledFlag = true
                            }
                            return (
                              <TicketItem
                                key={item.id}
                                data={item}
                                onSelect={onTicketSelect}
                                onChange={dispatchTicketListAction}
                                disabled={disabledFlag}
                              />
                            )
                          } else return <Fragment key={item.id}></Fragment>
                        })
                      }
                    </div>
                    <div id="In-Person-Tickets" className="divide-y divide-gray-700">
                      {
                        ticketListState.map((item) => {
                          if (item.ticketType === ETicketType.INPERSON || item.ticketType === ETicketType.FREEINPERSON) {
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
                            return (
                              <TicketItem
                                key={item.id}
                                data={item}
                                onSelect={onTicketSelect}
                                onChange={dispatchTicketListAction}
                                disabled={disabledFlag}
                              />
                            )
                          } else return <Fragment key={item.id}></Fragment>
                        })
                      }
                    </div>

                    {/* merch items start */}
                    {merchListState.length && (<div id="merch" className="py-5 sm:py-8 text-white">
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
            isOpen={bundleSidebarOpen}
            onClose={() => setBundleSidebarOpen(false)}
          />
           <MerchSidebar
            onChange={dispatcMerchListAction}
            merch={selectedRegularMerch as MerchItemDataProps}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
            onClose={() => {setSidebarOpen(false); setSelectedRegularMerch(undefined)}}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
