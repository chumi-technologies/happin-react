import { Cart, MerchItemDataProps, TicketItemDataProps } from "lib/model/checkout";
import { ActionKind, MerchListAction, TicketListAction } from "pages/checkout/[event_id]";


/**
 * Utility function to handle the remove ticket logic
 * @param data TicketItemDataProps
 * @param cart Cart
 * @param editingIndex the index of the editing item in Cart
 * @param onChange function to modify the ticket list quantity (passed from checkout index filr)
 * @param removeItem function to remove item from the cart (passed from the checkout context)
 */
export function decreaseTicketAmount(data: TicketItemDataProps, cart: Cart,
  ticketEditingIndex: number, onChange: (arg1: TicketListAction) => void, removeItem: (arg1: TicketItemDataProps, arg2: number) => void) {
  if (cart.items.ticketItem.length) {
    // the remaining amount is equal to the min per order, decrease to zero
    if (cart.items.ticketItem[ticketEditingIndex] && cart.items.ticketItem[ticketEditingIndex].quantity === data.minPerOrder) {
      onChange({ type: ActionKind.Increase, payload: data, quantity: data.minPerOrder })
      removeItem(data, data.minPerOrder);
      return
    }

    onChange({ type: ActionKind.Increase, payload: data, quantity: 1 })
    removeItem(data, 1);
  }
}


export function decreaseMerchAmount(
  data: MerchItemDataProps,
  onChange: (arg1: MerchListAction) => void,
  removeItem: (arg1: MerchItemDataProps, arg2: number, arg3: string) => void,
  propertyIndexOrName: number | string,
  ) {
    if (typeof propertyIndexOrName === 'number') {
      onChange({ type: ActionKind.Increase, payload: data, quantity: 1, propertyIndex: propertyIndexOrName })
      removeItem(data, 1, data.property[propertyIndexOrName].pName)
    } else if (typeof propertyIndexOrName === 'string') {
      const propertyIndex = data.property.findIndex(p=> p.pName === propertyIndexOrName);
      onChange({ type: ActionKind.Increase, payload: data, quantity: 1, propertyIndex })
      removeItem(data, 1, data.property[propertyIndex].pName)
    }
}
