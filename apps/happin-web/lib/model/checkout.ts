export enum ETicketType {
  INPERSON = 'paid',
  FREEINPERSON = 'free',
  LIVESTREAM = 'live',
  PFM = 'pfm',
  PLAYBACK = 'playback'
}

export type TicketItemDataProps = {
  id: string;
  title: string;
  price: number;
  subPrice?: string[]; // ?????? no where come from
  startTime?: Date;
  endTime?: Date;
  minPerOrder: number;
  maxPerOrder: number;
  features: TicketItemFeaturesProps[];
  quantity: number;
  originalQuantity: number; // for keep track of sold out
  ticketType: ETicketType;
  introduction: string;
  merch?: boolean; // Merch Details
  kind: 'ticket';
  sectionId: string;
};

export type TicketItemFeaturesProps = {
  type: string
  tooltip: string;
};

export const ETicketFeature = {
  TICKET : {type: 'ticket', tooltip: 'Ticket includes'} ,
  PLAYBACK : {type: 'video', tooltip: 'Playback ticket includes'},
  MERCHBUNDLE : { type:'bag', tooltip: 'Merch bundle includes'},
  VIP : {type:'vip', tooltip: 'VIP ticket includes'}
}


export type MerchItemDataProps = {
  id: string;
  cover: string;
  title: string;
  price: number;
  introduction?: string;
  quantity: number;
  originalQuantity: number; // for keep track of sold out
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
