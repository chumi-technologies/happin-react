import React, { useEffect, useState } from 'react';
import TicketItem, { TicketItemProps } from '../../components/page_components/CheckoutPageComponents/TicketItem';
import CheckoutHead from '../../components/page_components/CheckoutPageComponents/CheckoutHead';
import CheckoutSidebar from '../../components/page_components/CheckoutPageComponents/CheckoutSidebar';
import { MerchItemDataProps } from '../../lib/model/checkout';
import MerchItem from '../../components/page_components/CheckoutPageComponents/MerchItem';
import { Link, animateScroll as scroll } from 'react-scroll';
import { useResize } from 'utils/hooks';
import { useRouter } from 'next/router';
import { CheckoutState } from 'contexts/checkout-state';

const Checkout = () => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState<'bundle' | 'merch'>('bundle');

  useEffect(() => {
    if (router?.query?.event_id) {
      // do api call
      console.log(router?.query?.event_id)
    }
  }, [])

  const getEventDetails = async () => {

  }

  const getTicketDetails = async () => {

  }

  const getMerchDetails = async () => {

  }

  const ticketDataList: TicketItemProps[] = [
    {
      actionType: 'input',
      data: {
        id: '1',
        title: 'General Pass',
        price: 99,
        subPrice: ['CA$11.60 Fee', 'CA$27.51 GST/HST'],
        time: 'Sales end on Dec 2, 2019',
        features: [
          { type: 'ticket', tooltip: 'Tickets including replay description...' },
          { type: 'video', tooltip: 'Tickets including replay description...' },
          { type: 'bag' },
          { type: 'vip' }
        ],
        introduction: 'An all-access ticket which includes food and drink, career fair, workshops, conference sessions and keynotes, slides and slack-channel.An all-access ticket which includes food and drink, career fair, workshops, conference',
        helpText: 'What’s VIP room?',
        soldOut: false,
        kind: 'ticket'
      }
    },
    {
      actionType: 'button',
      data: {
        id: '2',
        title: 'General Pass + Merch Bundle A',
        price: 99,
        subPrice: ['CA$11.60 Fee', 'CA$27.51 GST/HST'],
        time: 'Sales end on Dec 2, 2019',
        features: [
          { type: 'ticket', tooltip: 'Tickets including replay description...' },
          { type: 'video', tooltip: 'Tickets including replay description...' }
        ],
        introduction: 'An all-access ticket which includes food and drink, career fair, workshops, conference sessions and keynotes, slides and slack-channel.An all-access ticket which includes food and drink, career fair, workshops, conference',
        merch: true,
        soldOut: false,
        kind: 'ticket'
      }
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
      kind: 'merch'
    },
    {
      id: '2',
      cover: 'https://cdn.sspai.com/article/fe0d40a7-1a78-79f8-fb04-1fa0a3ccd358.jpg',
      title: 'Merch Titile',
      price: 50.00,
      introduction: 'Merch DesMerch DesMerch DesMe...',
      soldOut: true,
      property: 's',
      kind: 'merch'
    },
    {
      id: '3',
      cover: 'https://cdn.sspai.com/article/fe0d40a7-1a78-79f8-fb04-1fa0a3ccd358.jpg',
      title: 'Merch Titile',
      price: 50.00,
      introduction: 'Merch DesMerch DesMerch DesMe...',
      property: 's',
      kind: 'merch'
    },
    {
      id: '4',
      cover: 'https://cdn.sspai.com/article/fe0d40a7-1a78-79f8-fb04-1fa0a3ccd358.jpg',
      title: 'Merch Titile',
      price: 50.00,
      introduction: 'Merch DesMerch DesMerch DesMe...',
      property: 's',
      kind: 'merch'
    },
    {
      id: '5',
      cover: 'https://cdn.sspai.com/article/fe0d40a7-1a78-79f8-fb04-1fa0a3ccd358.jpg',
      title: 'Merch Titile',
      price: 50.00,
      introduction: 'Merch DesMerch DesMerch DesMe...',
      property: 's',
      kind: 'merch'
    },
    {
      id: '6',
      cover: 'https://cdn.sspai.com/article/fe0d40a7-1a78-79f8-fb04-1fa0a3ccd358.jpg',
      title: 'Merch Titile',
      price: 50.00,
      introduction: 'Merch DesMerch DesMerch DesMe...',
      property: 's',
      kind: 'merch'
    }
  ];
  const windowWidth = useResize();

  useEffect(() => {
    // hack react-scroll初加载拿不到offset的问题
    scroll.scrollTo(1, {
      containerId: 'checkout-scroll-body'
    });
  }, [])

  return (
    <CheckoutState>
      <div className="checkout__page">
        <div className="flex flex-col-reverse md:flex-col h-full">
          <CheckoutHead />
          <div className="flex-1 h-0 web-scroll overflow-y-auto" id="checkout-scroll-body">
            <div className="sticky top-0 bg-gray-800 shadow-2xl z-10">
              <div className="container">
                <div className="flex">
                  <Link
                    className="checkout__head-tab"
                    activeClass="active"
                    containerId="checkout-scroll-body"
                    to="livestream-tickets"
                    name="myScrollToElement"
                    spy={true}
                    smooth={true}
                    offset={windowWidth > 640 ? -56 : -44}
                    duration={500}
                  >
                    Livestream Tickets
                  </Link>
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
                  </Link>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="checkout__container">
                <div className="divide-y divide-gray-700">
                  <div id="livestream-tickets" className="divide-y divide-gray-700">
                    <div className="font-semibold py-5 sm:hidden">
                      <div className="leading-5 mb-1">TWRP: Comin Atcha Live at the Opera House</div>
                      <div className="text-sm text-yellow-500">Event starts on Sat, Jul 17, 2021・8 PM</div>
                    </div>
                    {
                      ticketDataList.map((item) => (
                        <TicketItem
                          key={item.data.id}
                          actionType={item.actionType}
                          data={item.data}
                          onSelect={(value) => {
                            console.log(value);
                            if (typeof value === 'object') {
                              setSidebarType('bundle');
                              setSidebarOpen(true);
                            }
                          }}
                        />
                      ))
                    }
                  </div>
                  <div id="merch" className="py-5 sm:py-8 text-white">
                    <div className="mb-3 font-semibold text-lg">Adds On</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {
                        merchList.map((item) => (
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
                  </div>
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
