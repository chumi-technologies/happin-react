import { AddItemHandlerParam, MerchListAction, TicketAndMerchListActionKind, TicketListAction } from "contexts/checkout-state";
import { Cart, MerchItemDataProps, TicketItemDataProps } from "lib/model/checkout";

/**
 * Utility function to handle the add ticket logic
 * @param data TicketItemDataProps
 * @param cart Cart
 * @param ticketId the id of the editing ticket item in Cart
 * @param onChange function to modify the ticket list quantity (passed from the checkout context)
 * @param addItem function to add item to the cart (passed from the checkout context)
 */
export function increaseTicketAmount(data: TicketItemDataProps,
  cart: Cart, ticketId: string, onChange: (arg1: TicketListAction) => void, addItem: (arg1: AddItemHandlerParam) => void) {
  if (data.quantity >= 1) {
    if (cart.items.ticketItem.length) {
      const index = cart.items.ticketItem.findIndex(t=>t.ticketId === ticketId)
      if (index >= 0) {
        // item in cart already, add one at a time
        onChange({ type: TicketAndMerchListActionKind.Decrease, payload: data, quantity: 1 })
        addItem({ item: data, quantity: 1 });
        return
      }
    }
    // other case, add min per order
    if (data.quantity >= data.minPerOrder) {
      onChange({ type: TicketAndMerchListActionKind.Decrease, payload: data, quantity: data.minPerOrder })
      addItem({ item: data, quantity: data.minPerOrder });
    }
  }
}


export function increaseMerchAmount(
  data: MerchItemDataProps,
  onChange: (arg1: MerchListAction) => void,
  addItem: (arg1: AddItemHandlerParam) => void,
  propertyName: string,
  quantity: number) {
  // const propertyIndex = data.property.findIndex(p => p.pName === propertyName);
  onChange({ type: TicketAndMerchListActionKind.Decrease, payload: data, quantity, property: propertyName });
  addItem({ item: data, quantity, property: propertyName });
}


/**
 * Utility function to handle the add bundle logic
 * @param ticket TicketItemDataProps
 * @param bundleMerchs MerchItemDataProps[]
 * @param onChangeMerchList function to modify the merch list quantity (passed from the checkout context)
 * @param onChangeTicketList function to modify the ticket list quantity (passed from the checkout context)
 * @param quantity number to add
 * @param addItem function to add item to the cart (passed from the checkout context)
 * @param properties array of selected properties name
 * @param identifier ticket bundle identifier
 */
export function increaseBundleTicketAmount(
  ticket: TicketItemDataProps,
  bundleMerchs: MerchItemDataProps[],
  onChangeTicketList: (arg1: TicketListAction) => void,
  onChangeMerchList: (arg1: MerchListAction) => void,
  quantity: number,
  addItem: (arg: AddItemHandlerParam) => void,
  properties: string[],
  identifier?: string,
) {
  if (ticket.quantity >= 1) {
    onChangeTicketList({ type: TicketAndMerchListActionKind.Decrease, payload: ticket, quantity });
    bundleMerchs.forEach((m, index) => {
      onChangeMerchList({ type: TicketAndMerchListActionKind.Decrease, payload: m, quantity, property: properties[index] });
    })
    addItem({ item: ticket, quantity: quantity, bundleMerchPayload: bundleMerchs, bundleMerchProperty: properties, bundleIdentifier: identifier })
  }
}
