export type TicketItemDataProps = {
  id: string;
  title: string;
  price: number;
  subPrice?: string[];
  time: string;
  features?: TicketItemFeaturesProps[];
  introduction?: string;
  merch?: boolean; // Merch Details
  helpText?: string; // What’s VIP room?
  soldOut: boolean;
  kind: 'ticket'
};

export type TicketItemFeaturesProps = {
  type: 'ticket' | 'video' | 'bag' | 'vip';
  tooltip?: string;
};

export type MerchItemDataProps = {
  id: string;
  cover: string;
  title: string;
  price: number;
  introduction?: string;
  soldOut?: boolean;
  property: string;
  kind: 'merch'
};

export interface Cart {
  items:{
    ticketItem: CartTicketItem[],
    merchItem: CartMerchItem[]
  };
  subTotal: number;
}

export interface CartTicketItem {
  ticketId: string;
  quantity: number;
}

export interface CartMerchItem {
  merchId: string;
  quantity: number;
  property: string;
}
