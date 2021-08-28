import React, { useEffect, useReducer, useState } from 'react';
import TicketItem from '../../components/page_components/CheckoutPageComponents/TicketItem';
import CheckoutHead from '../../components/page_components/CheckoutPageComponents/CheckoutHead';
import CheckoutSidebar from '../../components/page_components/CheckoutPageComponents/CheckoutSidebar';
import { ETicketFeature, ETicketType, MerchItemDataProps, TicketItemDataProps } from '../../lib/model/checkout';
import MerchItem from '../../components/page_components/CheckoutPageComponents/MerchItem';
import { Link, animateScroll as scroll } from 'react-scroll';
import { useResize } from 'utils/hooks';
import { useRouter } from 'next/router';
import { CheckoutState } from 'contexts/checkout-state';

const ticketDataList: TicketItemDataProps[] = [
  {
    id: '1',
    title: 'General Pass',
    price: 99,
    subPrice: ['CA$11.60 Fee', 'CA$27.51 GST/HST'],//????
    startTime: new Date(),
    features: [
      ETicketFeature.TICKET,
      ETicketFeature.PLAYBACK,
      ETicketFeature.MERCHBUNDLE,
      ETicketFeature.VIP
    ],
    merch: false,
    quantity: 8,
    introduction: 'An all-access ticket which includes food and drink, career fair, workshops, conference sessions and keynotes, slides and slack-channel.An all-access ticket which includes food and drink, career fair, workshops, conference',
    //helpText: 'What’s VIP room?',
    kind: 'ticket',
    sectionId: '123',
    minPerOrder: 5,
    maxPerOrder: 10,
    originalQuantity: 8,
    ticketType: ETicketType.LIVESTREAM,
  },
  {
    id: '2',
    title: 'General Pass + Merch Bundle A',
    price: 99,
    subPrice: ['CA$11.60 Fee', 'CA$27.51 GST/HST'],
    startTime: new Date(),
    features: [
      ETicketFeature.TICKET,
      ETicketFeature.PLAYBACK
    ],
    quantity: 8,
    introduction: 'An all-access ticket which includes food and drink, career fair, workshops, conference sessions and keynotes, slides and slack-channel.An all-access ticket which includes food and drink, career fair, workshops, conference',
    merch: false,
    kind: 'ticket',
    sectionId: '123',
    minPerOrder: 2,
    maxPerOrder: 3,
    originalQuantity: 8,
    ticketType: ETicketType.INPERSON,
  }
];
const merchList: MerchItemDataProps[] = [
  {
    id: '1',
    cover: 'https://cdn.sspai.com/article/fe0d40a7-1a78-79f8-fb04-1fa0a3ccd358.jpg',
    title: 'Merch Titile',
    price: 50.00,
    introduction: 'Merch DesMerch DesMerch DesMe...',
    property: 's',
    kind: 'merch',
    quantity: 1,
    originalQuantity: 1
  },
  {
    id: '2',
    cover: 'https://cdn.sspai.com/article/fe0d40a7-1a78-79f8-fb04-1fa0a3ccd358.jpg',
    title: 'Merch Titile',
    price: 50.00,
    introduction: 'Merch DesMerch DesMerch DesMe...',
    quantity: 1,
    property: 's',
    kind: 'merch',
    originalQuantity: 1
  },
  {
    id: '3',
    cover: 'https://cdn.sspai.com/article/fe0d40a7-1a78-79f8-fb04-1fa0a3ccd358.jpg',
    title: 'Merch Titile',
    price: 50.00,
    introduction: 'Merch DesMerch DesMerch DesMe...',
    property: 's',
    quantity: 1,
    originalQuantity: 1,
    kind: 'merch'
  },
  {
    id: '4',
    cover: 'https://cdn.sspai.com/article/fe0d40a7-1a78-79f8-fb04-1fa0a3ccd358.jpg',
    title: 'Merch Titile',
    price: 50.00,
    introduction: 'Merch DesMerch DesMerch DesMe...',
    property: 's',
    quantity: 1,
    originalQuantity: 1,
    kind: 'merch'
  },
  {
    id: '5',
    cover: 'https://cdn.sspai.com/article/fe0d40a7-1a78-79f8-fb04-1fa0a3ccd358.jpg',
    title: 'Merch Titile',
    price: 50.00,
    introduction: 'Merch DesMerch DesMerch DesMe...',
    property: 's',
    quantity: 1,
    originalQuantity: 1,
    kind: 'merch'
  },
  {
    id: '6',
    cover: 'https://cdn.sspai.com/article/fe0d40a7-1a78-79f8-fb04-1fa0a3ccd358.jpg',
    title: 'Merch Titile',
    price: 50.00,
    introduction: 'Merch DesMerch DesMerch DesMe...',
    property: 's',
    quantity: 0,
    originalQuantity: 1,
    kind: 'merch'
  }
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
}

const ticketListReducer = (state: TicketItemDataProps[], action: TicketListAction) => {
  let finalTicketList = state
  if (action.type === ActionKind.Increase) {
    const targetIndex = state.findIndex(t => t.id === action.payload?.id);
    if (targetIndex !== -1) {
      const targetSection = state[targetIndex].sectionId;
      state.forEach(t => {
        if (t.sectionId === targetSection) {
          t.quantity += 1
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
  let finalTicketList = state
  if (action.type === ActionKind.Increase) {
    const targetIndex = state.findIndex(t => t.id === action.payload?.id);
    if (targetIndex !== -1) {
      state[targetIndex].quantity += 1
      finalTicketList = [...state];
    }
  }
  if (action.type === ActionKind.Decrease) {
    const targetIndex = state.findIndex(t => t.id === action.payload?.id);
    if (targetIndex !== -1) {
      state[targetIndex].quantity -= 1
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
  const [sidebarType, setSidebarType] = useState<'bundle' | 'merch'>('bundle');

  const [merchListState, dispatcMerchListAction] = useReducer(merchListReducer, []);
  const [ticketListState, dispatchTicketListAction] = useReducer(ticketListReducer, []);

  useEffect(() => {
    if (router?.query?.event_id) {
      // do api call
      dispatchTicketListAction({ type: ActionKind.Init, default: ticketDataList })
      dispatcMerchListAction({ type: ActionKind.Init, default: merchList })
      console.log(router?.query?.event_id)
    }
  }, [router.query])

  console.log(ticketListState)

  const getEventDetails = async () => {

  }

  const getTicketDetails = async () => {

  }

  const getMerchDetails = async () => {

  }

  const windowWidth = useResize();

  useEffect(() => {
    // hack react-scroll初加载拿不到offset的问题
    scroll.scrollTo(1, {
      containerId: 'checkout-scroll-body'
    });
  }, [])

  const onTicketSelect = (value: any) => {
    if (typeof value === 'object') {
      setSidebarType('bundle');
      setSidebarOpen(true);
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
        ticketTypeHeaderId.add('In-Person-Tickets');
        break;
      case ETicketType.FREEINPERSON:
        ticketTypeHeaderId.add('In-Person-Tickets');
        break;
      case ETicketType.PLAYBACK:
        ticketTypeHeaderId.add('Playback-Tickets');
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
      offset={windowWidth > 640 ? -56 : -44}
      duration={500}
    >
      {id.replace(/-/g, ' ')}
    </Link>
  ))

  return (
    <CheckoutState>
      <div className="checkout__page">
        <div className="flex flex-col-reverse md:flex-col h-full">
          <CheckoutHead />
          <div className="flex-1 h-0 web-scroll overflow-y-auto" id="checkout-scroll-body">
            <div className="sticky top-0 bg-gray-800 shadow-2xl z-10">
              <div className="container">
                <div className="flex">
                  {ticketTypeHeaderArray}
                  {merchListState.length &&
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
                    </Link>}

                </div>
              </div>
            </div>
            <div className="container">
              <div className="checkout__container">
                <div className="divide-y divide-gray-700">
                  {/* conditionally render tickets using presale time
                  render if 1. no presale time, 2. presale has past, 3.inside presale duration but enter presale code */}
                  <div id="Livestream-Tickets" className="divide-y divide-gray-700">
                    {
                      ticketListState.map((item) => {
                        if (item.ticketType === ETicketType.LIVESTREAM || item.ticketType === ETicketType.PFM) {
                          return (
                            <TicketItem
                              key={item.id}
                              data={item}
                              onSelect={onTicketSelect}
                              onChange={dispatchTicketListAction}
                            />
                          )
                        } else return <></>
                      })
                    }
                  </div>
                  <div id="In-Person-Tickets" className="divide-y divide-gray-700">
                    {
                      ticketListState.map((item) => {
                        if (item.ticketType === ETicketType.INPERSON || item.ticketType === ETicketType.FREEINPERSON) {
                          return (
                            <TicketItem
                              key={item.id}
                              data={item}
                              onSelect={onTicketSelect}
                              onChange={dispatchTicketListAction}
                            />
                          )
                        } else return <></>
                      })
                    }
                  </div>
                  <div id="Playback-Tickets" className="divide-y divide-gray-700">
                    {
                      ticketListState.map((item) => {
                        if (item.ticketType === ETicketType.PLAYBACK) {
                          return (
                            <TicketItem
                              key={item.id}
                              data={item}
                              onSelect={onTicketSelect}
                              onChange={dispatchTicketListAction}
                            />
                          )
                        }  else return <></>
                      })
                    }
                  </div>

                  {merchListState.length && (<div id="merch" className="py-5 sm:py-8 text-white">
                    <div className="mb-3 font-semibold text-lg">Adds On</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {
                        merchListState.map((item) => (
                          <MerchItem
                            key={item.id}
                            data={item}
                            onSelect={(value) => {
                              console.log(value);
                              setSidebarType('merch');
                              setSidebarOpen(true);
                            }}
                          />
                        ))
                      }
                    </div>
                  </div>)}
                </div>
              </div>
            </div>
            <CheckoutSidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
              type={sidebarType}
            />
          </div>
        </div>

      </div>
    </CheckoutState>
  );
};

export default Checkout;
