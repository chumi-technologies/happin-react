import { RemoveItemHandlerParam } from "contexts/checkout-state";
import { TicketItemDataProps, MerchItemDataProps } from "lib/model/checkout";
import { TicketListAction, ActionKind, MerchListAction } from "pages/checkout/[event_id]";

/**
 * Utility function to handle the delete ticket in cart logic
 * @param data TicketItemDataProps
 * @param quantity
 * @param onChange function to modify the ticket list quantity (passed from checkout index filr)
 * @param removeItem function to remove item from the cart (passed from the checkout context)
 */
export function deleteTicketFromCart(data: TicketItemDataProps, quantity: number,
  onChange: (arg1: TicketListAction) => void, removeItem: (arg1: RemoveItemHandlerParam) => void) {
  onChange({ type: ActionKind.Increase, payload: data, quantity })
  removeItem({item: data, quantity});
}


/**
 * Utility function to handle the delete merch in cart logic
 * @param data MerchItemDataProps
 * @param quantity 
 * @param propertyName the name of the editing property in the property array in the MerchItemDataProps
 * @param onChange function to modify the merch list quantity (passed from checkout index filr)
 * @param removeItem function to remove item from the cart (passed from the checkout context)
 */
export function deleteMerchFromCart(data: MerchItemDataProps, quantity: number,
  propertyName: string, onChange: (arg1: MerchListAction) => void, removeItem: (arg1: RemoveItemHandlerParam) => void) {
  const propertyIndex = data.property.findIndex(p => p.pName === propertyName);
  onChange({ type: ActionKind.Increase, payload: data, quantity, property: propertyName })
  removeItem({item: data, quantity, property: data.property[propertyIndex].pName})
}
