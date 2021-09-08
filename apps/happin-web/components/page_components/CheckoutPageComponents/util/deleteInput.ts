import { TicketItemDataProps, Cart, MerchItemDataProps } from "lib/model/checkout";
import { TicketListAction, ActionKind, MerchListAction } from "pages/checkout/[event_id]";

/**
 * Utility function to handle the delete ticket in cart logic
 * @param data TicketItemDataProps
 * @param quantity
 * @param editingIndex the index of the editing item in Cart
 * @param onChange function to modify the ticket list quantity (passed from checkout index filr)
 * @param removeItem function to remove item from the cart (passed from the checkout context)
 */
 export function deleteTicketFromCart(data: TicketItemDataProps, quantity: number,
    onChange: (arg1: TicketListAction) => void, removeItem: (arg1: TicketItemDataProps, arg2: number) => void) {
    onChange({ type: ActionKind.Increase, payload: data, quantity })
    removeItem(data, quantity);
  }


/**
 * Utility function to handle the delete merch in cart logic
 * @param data MerchItemDataProps
 * @param quantity 
 * @param propertyIndexOrName the index of the editing property in the property array in the MerchItemDataProps
 * @param onChange function to modify the merch list quantity (passed from checkout index filr)
 * @param removeItem function to remove item from the cart (passed from the checkout context)
 */
 export function deleteMerchFromCart(data: MerchItemDataProps, quantity: number,
  propertyIndexOrName: number | string, onChange: (arg1: MerchListAction) => void, removeItem: (arg1: MerchItemDataProps, arg2: number, arg3: string) => void) {
    if (typeof propertyIndexOrName === 'number') {
      onChange({ type: ActionKind.Increase, payload: data, quantity, propertyIndex: propertyIndexOrName })
      removeItem(data, quantity, data.property[propertyIndexOrName].pName)
    } else if (typeof propertyIndexOrName === 'string') {
      const propertyIndex = data.property.findIndex(p=> p.pName === propertyIndexOrName);
      onChange({ type: ActionKind.Increase, payload: data, quantity, propertyIndex })
      removeItem(data, quantity, data.property[propertyIndex].pName)
    }
}
