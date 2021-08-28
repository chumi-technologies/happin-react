import { Cart, CartMerchItem, CartTicketItem, MerchItemDataProps, TicketItemDataProps } from "lib/model/checkout";
import { createContext, useContext, useReducer } from "react";

enum ActionKind {
  Increase = 'INCREASE',
  Decrease = 'DECREASE',
}

type Action = {
  type: ActionKind,
  payload: TicketItemDataProps | MerchItemDataProps
  quantity: number;
}

interface CartContext {
  cart: Cart, 
  addItem: (arg0: MerchItemDataProps| TicketItemDataProps, arg1: number)=> void,
  removeItem: (arg0: MerchItemDataProps| TicketItemDataProps, arg1: number)=> void
}

const defaultCartState: Cart = {
  subTotal: 0,
  items: {
    ticketItem: [],
    merchItem: [],
  }
}

function instanceOfMerch(arg: any): arg is MerchItemDataProps {
  return arg['kind'] === 'merch'
}

function instanceOfTicket(arg: any): arg is TicketItemDataProps {
  return arg['kind'] === 'ticket'
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
      updateItems = state.items.ticketItem.concat({ticketId: action.payload.id, quantity: action.quantity});
    }
    finalCart = {
      items: {
        merchItem: state.items.merchItem,
        ticketItem: updateItems
      },
      subTotal: updateSubTotal
    }
  } else if(instanceOfMerch(action.payload)) {
    const existingCartMerchIndex = state.items.merchItem.findIndex(item => item.merchId === action.payload.id);
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
      updateItems = state.items.merchItem.concat({merchId: action.payload.id, quantity: action.quantity, property: action.payload.property});
    }
    finalCart = {
      items: {
        merchItem: updateItems,
        ticketItem: state.items.ticketItem
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
        ticketItem: updateItems
      },
      subTotal: updatedTotalAmount
    }
  } else if (instanceOfMerch(action.payload)) {
    const existingCartMerchIndex = state.items.merchItem.findIndex(item => item.merchId === action.payload.id);
    const existingCartMerchItem = state.items.merchItem[existingCartMerchIndex];
    let updateItems: CartMerchItem[];
    if (existingCartMerchItem.quantity === action.quantity) {
      updateItems = state.items.merchItem.filter(item => item.merchId !== action.payload.id);
    } else {
      const updateItem: CartMerchItem = {...existingCartMerchItem, quantity: existingCartMerchItem.quantity - action.quantity};
      updateItems = [...state.items.merchItem];
      updateItems[existingCartMerchIndex] = updateItem;
    }
    finalCart =  {
      items: {
        merchItem: updateItems,
        ticketItem: state.items.ticketItem
      },
      subTotal: updatedTotalAmount
    }
  }
  return finalCart
}


const checkoutContext = createContext({} as CartContext);

export function CheckoutState({ children }: {children: any}) {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState
  );

  const addItemToCartHandler = (item: TicketItemDataProps | MerchItemDataProps, quantity: number) => {
    dispatchCartAction({ type: ActionKind.Increase, payload: item, quantity });
  };

  const removeItemFromCartHandler = (item: TicketItemDataProps | MerchItemDataProps,  quantity: number) => {
    dispatchCartAction({ type: ActionKind.Decrease, payload: item, quantity });
  };

  const cartContext: CartContext = {
    cart: cartState,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
  };

  return (
    <checkoutContext.Provider value={cartContext}>
      {children}
    </checkoutContext.Provider>
  );
}


export function useCheckoutState() {
  return useContext(checkoutContext);
}
