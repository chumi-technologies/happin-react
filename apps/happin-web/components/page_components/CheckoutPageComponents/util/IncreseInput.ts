import { Cart, MerchItemDataProps, TicketItemDataProps } from "lib/model/checkout";
import { ActionKind, MerchListAction, TicketListAction } from "pages/checkout/[event_id]";

export  function increaseTicketAmount(data: TicketItemDataProps,
     cart: Cart, editingIndex: number, onChange: (arg1:TicketListAction)=>void, addItem:(arg1: TicketItemDataProps, arg2: number)=>void) {
    if (data.quantity >= 1) {
      if (cart.items.ticketItem.length) {
        if (cart.items.ticketItem[editingIndex] && cart.items.ticketItem[editingIndex].quantity === data.maxPerOrder) {
          // item already in cart and is equal to max per order, abort adding
          return
        } else if (!cart.items.ticketItem[editingIndex]) {
          // item not in cart, add the min per order amount
          onChange({type:ActionKind.Decrease, payload:data, quantity: data.minPerOrder})
          addItem(data, data.minPerOrder );
        } else {
          // item in cart, add one at a time
          onChange({type:ActionKind.Decrease, payload:data, quantity: 1})
          addItem(data, 1);
        }
      } else {
        // no item in cart, 
        onChange({type:ActionKind.Decrease, payload:data, quantity: data.minPerOrder})
        addItem(data, data.minPerOrder );
      }
    }
  }
