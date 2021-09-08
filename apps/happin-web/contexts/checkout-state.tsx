import { Cart, CartBundleItem, CartMerchItem, CartTicketItem, EventBasicData, GeneralTicketInfo, MerchItemDataProps, TicketItemDataProps } from "lib/model/checkout";
import { createContext, useContext, useReducer, useState } from "react";


export interface AddItemHandlerParam {
  item: TicketItemDataProps | MerchItemDataProps,
  quantity: number, 
  property?: string, 
  bundleMerchPayload?: MerchItemDataProps[],
  bundleMerchProperty? : string[]
}

enum ActionKind {
  Increase = 'INCREASE',
  Decrease = 'DECREASE',
}

type Action = {
  type: ActionKind,
  payload: TicketItemDataProps | MerchItemDataProps
  quantity: number;
  property? : string;
  bundleMerchPayload?: MerchItemDataProps[];
  bundleMerchProperty? : string[];
  bundleIdentifier?: string;
}

interface CheckoutContext {
  cart: Cart, 
  eventDataForCheckout: EventBasicData | undefined,
  happinUserID: string | undefined,
  codeUsed: string | undefined,
  boxOfficeMode: boolean,
  generalTicketInfo: GeneralTicketInfo | undefined,
  setGeneralTicketInfo: (arg: GeneralTicketInfo)=>void,
  setBoxOfficeMode: (arg: boolean)=>void,
  setCodeUsed: (arg: string)=> void,
  setHappinUserID: (arg: string)=> void,
  setEventDataForCheckout: (arg: EventBasicData)=>void,
  addItem: (arg: AddItemHandlerParam)=> void,
  removeItem: (arg0: MerchItemDataProps| TicketItemDataProps, arg1: number)=> void
}

const defaultCartState: Cart = {
  subTotal: 0,
  items: {
    ticketItem: [],
    merchItem: [],
    bundleItem: [],
  }
}

function instanceOfMerch(arg: any): arg is MerchItemDataProps {
  return arg['kind'] === 'merch';
}

function instanceOfTicket(arg: any): arg is TicketItemDataProps {
  return arg['kind'] === 'ticket';
}

function instanceOfBundle(arg: any): arg is TicketItemDataProps {
  return arg['kind'] === 'bundle';
}

const cartReducer = (state: Cart, action: Action) => {
  if (action.type === ActionKind.Increase) {
    return inreament(action, state)
  }
  if (action.type === ActionKind.Decrease) {
    return decreament(action, state);
  }
  return defaultCartState
}


const inreament = (action: Action, state: Cart) => {
  let finalCart: Cart = defaultCartState;
  const updateSubTotal = state.subTotal + action.payload.price * action.quantity
  if (instanceOfTicket(action.payload)) {
    const existingCartTicketIndex = state.items.ticketItem.findIndex(item => item.ticketId === action.payload.id);
    const existingCartTicketItem = state.items.ticketItem[existingCartTicketIndex];
    let updateItems: CartTicketItem[];
    if (existingCartTicketItem) {
      const updateItem: CartTicketItem = {
        ...existingCartTicketItem,
        quantity: existingCartTicketItem.quantity + action.quantity
      }
      updateItems = [...state.items.ticketItem];
      updateItems[existingCartTicketIndex] = updateItem
    } else {
      updateItems = state.items.ticketItem.concat({ticketId: action.payload.id, sectionId: action.payload.sectionId, quantity: action.quantity, price: action.payload.price});
    }
    finalCart = {
      items: {
        merchItem: state.items.merchItem,
        ticketItem: updateItems,
        bundleItem: state.items.bundleItem
      },
      subTotal: updateSubTotal
    }
  } else if (instanceOfMerch(action.payload)) {
    const existingCartMerchIndex = state.items.merchItem.findIndex(item => item.identifier === (action.payload.id + action.property));
    const existingCartMerchItem = state.items.merchItem[existingCartMerchIndex];
    let updateItems: CartMerchItem[];
    if (existingCartMerchItem) {
      const updateItem: CartMerchItem = {
        ...existingCartMerchItem,
        quantity: existingCartMerchItem.quantity + action.quantity
      }
      updateItems = [...state.items.merchItem];
      updateItems[existingCartMerchIndex] = updateItem
    } else {
      updateItems = state.items.merchItem.concat(
        {merchId: action.payload.id,
        quantity: action.quantity, property: (action.property as string), 
        identifier: action.payload.id + action.property, price: action.payload.price});
    }
    finalCart = {
      items: {
        merchItem: updateItems,
        ticketItem: state.items.ticketItem,
        bundleItem: state.items.bundleItem
      },
      subTotal: updateSubTotal
    }
  } else if (instanceOfBundle(action.payload)) {
    // for bundle, every ticket is unique
    let updateItems: CartBundleItem[];
    const bundleMerchs: CartMerchItem[] = action.bundleMerchPayload?.map((m, index)=> ({
      merchId: m.id,
      property: (action.bundleMerchProperty as string[])[index],
      quantity: action.quantity, //not important for bundles, bundle quantity should be ticket's quantity
      identifier: m.id + (action.bundleMerchProperty as string[])[index], // not important for bundles
      price: m.price, // not important for bundles, bundle price should be ticket's price
    })) || [];

    const bundleTicket: CartBundleItem = {
      ticketId: (action.payload as TicketItemDataProps).id,
      sectionId: (action.payload as TicketItemDataProps).sectionId, 
      quantity: action.quantity, price: (action.payload as TicketItemDataProps).price,
      identifier: (action.payload as TicketItemDataProps).id + new Date().getTime(), // unique for every bundle ticket
      merchs: bundleMerchs
    }

    updateItems = state.items.bundleItem.concat(bundleTicket);

    finalCart = {
      items: {
        merchItem: state.items.merchItem,
        ticketItem: state.items.ticketItem,
        bundleItem: updateItems
      },
      subTotal: updateSubTotal
    }
  }
  return finalCart
}


const decreament = (action: Action, state: Cart) => {
  let finalCart:Cart = defaultCartState 
  const updatedTotalAmount = state.subTotal - action.quantity * action.payload.price
  if (instanceOfTicket(action.payload)) {
    const existingCartTicketIndex = state.items.ticketItem.findIndex(item => item.ticketId === action.payload.id);
    const existingCartTicketItem = state.items.ticketItem[existingCartTicketIndex];
    let updateItems: CartTicketItem[];
    if (existingCartTicketItem.quantity === action.quantity) {
      updateItems = state.items.ticketItem.filter(item => item.ticketId !== action.payload.id);
    } else {
      const updateItem: CartTicketItem = {...existingCartTicketItem, quantity: existingCartTicketItem.quantity - action.quantity};
      updateItems = [...state.items.ticketItem];
      updateItems[existingCartTicketIndex] = updateItem;
    }
    finalCart = {
      items: {
        merchItem: state.items.merchItem,
        ticketItem: updateItems,
        bundleItem: state.items.bundleItem
      },
      subTotal: updatedTotalAmount
    }
  } else if (instanceOfMerch(action.payload)) {
    const existingCartMerchIndex = state.items.merchItem.findIndex(item => item.identifier === (action.payload.id + action.property));
    const existingCartMerchItem = state.items.merchItem[existingCartMerchIndex];
    let updateItems: CartMerchItem[];
    if (existingCartMerchItem.quantity === action.quantity) {
      updateItems = state.items.merchItem.filter(item => item.identifier !== (action.payload.id + action.property));
    } else {
      const updateItem: CartMerchItem = {...existingCartMerchItem, quantity: existingCartMerchItem.quantity - action.quantity};
      updateItems = [...state.items.merchItem];
      updateItems[existingCartMerchIndex] = updateItem;
    }
    finalCart =  {
      items: {
        merchItem: updateItems,
        ticketItem: state.items.ticketItem,
        bundleItem: state.items.bundleItem
      },
      subTotal: updatedTotalAmount
    }
  } else if (instanceOfBundle(action.payload)) {
    const updateItems: CartBundleItem[] = state.items.bundleItem.filter(item => item.identifier !== action.bundleIdentifier);
    finalCart =  {
      items: {
        merchItem: state.items.merchItem,
        ticketItem: state.items.ticketItem,
        bundleItem: updateItems
      },
      subTotal: updatedTotalAmount
    }
  }
  return finalCart
}


const checkoutCtx = createContext({} as CheckoutContext);

export function CheckoutState({ children }: {children: any}) {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );
  
  const [eventDataForCheckout, setEventDataForCheckout] = useState<EventBasicData>();
  // happinUserID will be set when the userID is passed in url(mobile app logged in and open the checkout page)
  const [happinUserID, setHappinUserID] = useState<string>();
  // discount code or presale code or thirdParty code
  const [codeUsed, setCodeUsed] = useState<string>();

  const [generalTicketInfo, setGeneralTicketInfo] = useState<GeneralTicketInfo>();
  const [boxOfficeMode, setBoxOfficeMode] = useState<boolean>(false);

  const addItemToCartHandler = ({item,
     quantity, property, bundleMerchPayload,
     bundleMerchProperty}: AddItemHandlerParam) => {
    dispatchCartAction({ type: ActionKind.Increase, payload: item, quantity, property, bundleMerchPayload, bundleMerchProperty});
  };

  const removeItemFromCartHandler = (item: TicketItemDataProps | MerchItemDataProps,  quantity: number, property?: string) => {
    dispatchCartAction({ type: ActionKind.Decrease, payload: item, quantity, property });
  };


  const context: CheckoutContext = {
    cart: cartState,
    eventDataForCheckout: eventDataForCheckout,
    happinUserID: happinUserID,
    codeUsed: codeUsed,
    boxOfficeMode: boxOfficeMode,
    generalTicketInfo: generalTicketInfo,
    setGeneralTicketInfo: setGeneralTicketInfo,
    setBoxOfficeMode: setBoxOfficeMode,
    setCodeUsed: setCodeUsed,
    setHappinUserID: setHappinUserID,
    setEventDataForCheckout: setEventDataForCheckout,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };

  return (
    <checkoutCtx.Provider value={context}>
      {children}
    </checkoutCtx.Provider>
  );
}


export function useCheckoutState() {
  return useContext(checkoutCtx);
}
