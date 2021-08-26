export type TicketItemDataProps = {
  id: number;
  title: string;
  price: string;
  subPrice?: string[];
  time: string;
  features?: TicketItemFeaturesProps[];
  introduction?: string;
  merch?: boolean; // Merch Details
  helpText?: string; // What’s VIP room?
  soldOut: boolean;
};

export type TicketItemFeaturesProps = {
  type: 'ticket' | 'video' | 'bag' | 'vip';
  tooltip?: string;
};

export type MerchItemDataProps = {
  id: number;
  cover: string;
  title: string;
  price: string;
  introduction?: string;
  soldOut?: boolean;
};
