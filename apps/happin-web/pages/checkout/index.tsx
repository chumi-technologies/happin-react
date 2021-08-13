import React, { useState } from 'react';
import TicketItem, { TicketItemProps } from './components/TicketItem';
import CheckoutHead from './components/CheckoutHead';
import CheckoutSidebar from './components/CheckoutSidebar';
import { TicketItemDataProps } from './data';

const Checkout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const ticketDataList: TicketItemProps[] = [
    {
      actionType: 'input',
      data: {
        id: 1,
        title: 'General Pass',
        price: 'CA$99.99',
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
        soldOut: false
      }
    },
    {
      actionType: 'button',
      data: {
        id: 2,
        title: 'General Pass + Merch Bundle A',
        price: 'CA$99.99',
        subPrice: ['CA$11.60 Fee', 'CA$27.51 GST/HST'],
        time: 'Sales end on Dec 2, 2019',
        features: [
          { type: 'ticket', tooltip: 'Tickets including replay description...' },
          { type: 'video', tooltip: 'Tickets including replay description...' }
        ],
        introduction: 'An all-access ticket which includes food and drink, career fair, workshops, conference sessions and keynotes, slides and slack-channel.An all-access ticket which includes food and drink, career fair, workshops, conference',
        merch: true,
        soldOut: false
      }
    },
  ]
  return (
    <div className="checkout__page">
      <div className="flex flex-col h-full">
        <CheckoutHead />
        <div className="flex-1 h-0 web-scroll overflow-y-auto">
          <div className="container">
            <div className="checkout__container">
              <div className="divide-y divide-gray-700">
                {
                  ticketDataList.map((item, index) => (
                    <TicketItem key={item.data.id} actionType={item.actionType} data={item.data} onSelect={(value) => {
                      console.log(value);
                      if (typeof value === 'object') {
                        setSidebarOpen(true)
                      }
                    }} />
                  ))
                }
              </div>
            </div>
          </div>
          <CheckoutSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>

    </div>
  );
};

export default Checkout;
