import { Cart, TicketItemDataProps } from "lib/model/checkout";
import { ActionKind, TicketListAction } from "pages/checkout/[event_id]";

export function decreaseTicketAmount(data: TicketItemDataProps, cart: Cart,
   ticketEditingIndex: number, onChange:(arg1:TicketListAction) =>void, removeItem:(arg1: TicketItemDataProps, arg2: number)=>void) {
  if (cart.items.ticketItem.length) {
    if (cart.items.ticketItem[ticketEditingIndex] && cart.items.ticketItem[ticketEditingIndex].quantity === 0) {
      return
    }
    onChange({ type: ActionKind.Increase, payload: data, quantity: 1 })
    removeItem(data, 1);
  }
}
