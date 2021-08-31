import { Cart, MerchItemDataProps, TicketItemDataProps } from "lib/model/checkout";
import { ActionKind, MerchListAction, TicketListAction } from "pages/checkout/[event_id]";

/**
 * Utility function to handle the add ticket logic
 * @param data TicketItemDataProps
 * @param cart Cart
 * @param editingIndex the index of the editing item in Cart
 * @param onChange function to modify the ticket list quantity (passed from the checkout index file)
 * @param addItem function to add item to the cart (passed from the checkout context)
 */
export function increaseTicketAmount(data: TicketItemDataProps,
  cart: Cart, editingIndex: number, onChange: (arg1: TicketListAction) => void, addItem: (arg1: TicketItemDataProps, arg2: number) => void) {
  if (data.quantity >= 1) {
    if (cart.items.ticketItem.length) {
      if (cart.items.ticketItem[editingIndex]) {
        // item in cart already, add one at a time
        onChange({ type: ActionKind.Decrease, payload: data, quantity: 1 })
        addItem(data, 1);
        return
      }
    }
    // other case, add min per order
    if (data.quantity >= data.minPerOrder) {
      onChange({ type: ActionKind.Decrease, payload: data, quantity: data.minPerOrder })
      addItem(data, data.minPerOrder);
    }
  }
}


export function increaseMerchAmount(
  data: MerchItemDataProps,
  onChange: (arg1: MerchListAction) => void,
  addItem: (arg1: MerchItemDataProps, arg2: number, arg3: string) => void,
  propertyIndex: number,
  quantity: number) {
  onChange({ type: ActionKind.Decrease, payload: data, quantity, propertyIndex });
  addItem(data, quantity, data.property[propertyIndex].pName);
}
