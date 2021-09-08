import { TicketItemDataProps, Cart } from "lib/model/checkout";
import { TicketListAction, ActionKind } from "pages/checkout/[event_id]";

/**
 * Utility function to handle the delete ticket in cart logic
 * @param data TicketItemDataProps
 * @param cart Cart
 * @param editingIndex the index of the editing item in Cart
 * @param onChange function to modify the ticket list quantity (passed from checkout index filr)
 * @param removeItem function to remove item from the cart (passed from the checkout context)
 */
 export function deleteTicketFromCart(data: TicketItemDataProps, cart: Cart,
    ticketEditingIndex: number, onChange: (arg1: TicketListAction) => void, removeItem: (arg1: TicketItemDataProps, arg2: number) => void) {
    if (cart.items.ticketItem.length) {
      onChange({ type: ActionKind.Increase, payload: data, quantity: cart.items.ticketItem[ticketEditingIndex].quantity })
      removeItem(data, cart.items.ticketItem[ticketEditingIndex].quantity);
    }
  }
