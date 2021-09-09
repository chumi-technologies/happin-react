export enum ETicketType {
  INPERSON = 'paid',
  FREEINPERSON = 'free',
  LIVESTREAM = 'live',
  PFM = 'pfm',
  PLAYBACK = 'playback'
}

export type EventBasicData = {
  startTime: Date;
  endTime: Date;
  tags: string[];
  title: string;
  default_currency: string;
  cover: string;
}

export type GeneralTicketInfo = {
  absorbFee: boolean,
  saleStartTime: number,
  taxNeeded: number,
  presaleStart: number,
  presaleEnd: number,
}

export type TicketItemDataProps = {
  id: string;
  title: string;
  price: number;
  start?: number;
  end?: number;
  minPerOrder: number;
  maxPerOrder: number;
  features: TicketItemFeaturesProps[];
  quantity: number;
  originalQuantity: number; // for keep track of sold out
  ticketType: ETicketType;
  notes: string;
  merch?: boolean; //includes merch as a bundle
  kind: 'ticket'| 'bundle';
  sectionId: string;
  visibility: ETicketVisibility;
  availability: ETicketAvailability;
};

export enum ETicketVisibility {
  VISIBLE = 'visible',
  INVISIBLE = 'invisible',
  SCHEDULE = 'schedule'
}

export enum ETicketAvailability  {
  EVERY_WHERE = 'everywhere',
  ONLINE = 'online',
  AT_DOOR = 'atdoor'
}

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
  image: string[];
  name: string;
  price: number;
  description?: string;
  property: MerchProperty[];
  kind: 'merch',
  max: number, // max per order
  mail: boolean, // can be shipped
  forApp: boolean // filter out for app gifts
  show: boolean // deleted or not
  tickets : string[] //bind to which ticket (if empty, the merch is regular merch, otherwise it's inside bundle)
};

export type MerchProperty = {
  pName: string;
  pValue: number;
  originalPValue: number;
}

export interface Cart {
  items:{
    ticketItem: CartTicketItem[],
    merchItem: CartMerchItem[],
    bundleItem: CartBundleItem[],
  };
  subTotal: number;
}

export interface CartTicketItem {
  ticketId: string;
  sectionId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface CartBundleItem {
  ticketId: string;
  sectionId: string;
  quantity: number;
  identifier: string;
  merchs: CartMerchItem[];
  price: number;
  name: string;
}

export interface CartMerchItem {
  merchId: string;
  quantity: number;
  property: string;
  identifier: string;
  price: number;
  name: string;
  image: string[];
  shipping: boolean;
}

