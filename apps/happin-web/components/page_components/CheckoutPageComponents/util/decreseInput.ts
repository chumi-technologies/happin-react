import { MerchListAction, RemoveItemHandlerParam, TicketAndMerchListActionKind, TicketListAction } from "contexts/checkout-state";
import { Cart, MerchItemDataProps, TicketItemDataProps } from "lib/model/checkout";


/**
 * Utility function to handle the remove ticket logic
 * @param data TicketItemDataProps
 * @param cart Cart
 * @param ticketEditingId the id of the editing ticket in Cart
 * @param onChange function to modify the ticket list quantity (passed from the checkout context)
 * @param removeItem function to remove item from the cart (passed from the checkout context)
 */
export function decreaseTicketAmount(data: TicketItemDataProps, cart: Cart,
  ticketEditingId: string, onChange: (arg1: TicketListAction) => void, removeItem: (arg1: RemoveItemHandlerParam) => void) {
  if (cart.items.ticketItem.length) {
    // the remaining amount is equal to the min per order, decrease to zero
    const index = cart.items.ticketItem.findIndex(t=>t.ticketId === ticketEditingId)
    if (cart.items.ticketItem[index] && cart.items.ticketItem[index].quantity === data.minPerOrder) {
      onChange({ type: TicketAndMerchListActionKind.Increase, payload: data, quantity: data.minPerOrder })
      removeItem({item: data, quantity:data.minPerOrder});
      return
    }

    onChange({ type: TicketAndMerchListActionKind.Increase, payload: data, quantity: 1 })
    removeItem({item: data, quantity: 1});
  }
}


export function decreaseMerchAmount(
  data: MerchItemDataProps,
  onChange: (arg1: MerchListAction) => void,
  removeItem: (arg1: RemoveItemHandlerParam) => void,
  propertyName: string,
  quantity: number
) {
  //const propertyIndex = data.property.findIndex(p => p.pName === propertyName);
  onChange({ type: TicketAndMerchListActionKind.Increase, payload: data, quantity: 1, property: propertyName })
  removeItem({item: data, quantity, property: propertyName})
}


/**
 * Utility function to handle the decrease bundle logic
 * @param ticket TicketItemDataProps
 * @param cart Cart
 * @param bundleMerchs MerchItemDataProps[]
 * @param onChangeMerchList function to modify the merch list quantity (passed from the checkout context)
 * @param onChangeTicketList function to modify the ticket list quantity passed from the checkout context)
 * @param quantity number to add
 * @param removeItem function to remove item to the cart (passed from the checkout context)
 * @param properties array of selected properties name
 * @param identifier ticket bundle identifier
 */
 export function decreaseBundleTicketAmount(
  ticket: TicketItemDataProps,
  bundleMerchs: MerchItemDataProps[],
  onChangeTicketList: (arg1: TicketListAction) => void,
  onChangeMerchList: (arg1: MerchListAction) => void,
  quantity: number,
  removeItem: (arg1: RemoveItemHandlerParam) => void,
  properties: string[],
  identifier?: string,
) {
  onChangeTicketList({ type: TicketAndMerchListActionKind.Increase, payload: ticket, quantity });
  bundleMerchs.forEach((m, index) => {
    onChangeMerchList({ type: TicketAndMerchListActionKind.Increase, payload: m, quantity, property: properties[index] });
  })
  removeItem({item: ticket, quantity, bundleIdentifier: identifier});
}
