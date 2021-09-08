import { AddItemHandlerParam } from "contexts/checkout-state";
import { Cart, MerchItemDataProps, TicketItemDataProps } from "lib/model/checkout";
import { ActionKind, MerchListAction, TicketListAction } from "pages/checkout/[event_id]";
import { SelectedProperty } from "../BundleSidebar";

/**
 * Utility function to handle the add ticket logic
 * @param data TicketItemDataProps
 * @param cart Cart
 * @param editingIndex the index of the editing item in Cart
 * @param onChange function to modify the ticket list quantity (passed from the checkout index file)
 * @param addItem function to add item to the cart (passed from the checkout context)
 */
export function increaseTicketAmount(data: TicketItemDataProps,
  cart: Cart, editingIndex: number, onChange: (arg1: TicketListAction) => void, addItem: (arg1: AddItemHandlerParam) => void) {
  if (data.quantity >= 1) {
    if (cart.items.ticketItem.length) {
      if (cart.items.ticketItem[editingIndex]) {
        // item in cart already, add one at a time
        onChange({ type: ActionKind.Decrease, payload: data, quantity: 1 })
        addItem({ item: data, quantity: 1 });
        return
      }
    }
    // other case, add min per order
    if (data.quantity >= data.minPerOrder) {
      onChange({ type: ActionKind.Decrease, payload: data, quantity: data.minPerOrder })
      addItem({ item: data, quantity: data.minPerOrder });
    }
  }
}


export function increaseMerchAmount(
  data: MerchItemDataProps,
  onChange: (arg1: MerchListAction) => void,
  addItem: (arg1: AddItemHandlerParam) => void,
  propertyIndexOrName: number | string,
  quantity: number) {
  if (typeof propertyIndexOrName === 'number') {
    onChange({ type: ActionKind.Decrease, payload: data, quantity, propertyIndex: propertyIndexOrName });
    addItem({ item: data, quantity, property: data.property[propertyIndexOrName].pName });
  } else if (typeof propertyIndexOrName === 'string') {
    const propertyIndex = data.property.findIndex(p=> p.pName === propertyIndexOrName);
    onChange({ type: ActionKind.Decrease, payload: data, quantity, propertyIndex });
    addItem({ item: data, quantity, property: data.property[propertyIndex].pName });
  }
}


/**
 * Utility function to handle the add bundle logic
 * @param ticket TicketItemDataProps
 * @param bundleMerchs MerchItemDataProps[]
 * @param onChangeMerchList function to modify the merch list quantity (passed from the checkout index file)
 * @param onChangeTicketList function to modify the ticket list quantity (passed from the checkout index file)
 * @param quantity number to add
 * @param addItem function to add item to the cart (passed from the checkout context)
 * @param properties array of selected properties name
 */
export function increaseBundleTicketAmount(
  ticket: TicketItemDataProps,
  bundleMerchs: MerchItemDataProps[],
  onChangeTicketList: (arg1: TicketListAction) => void,
  onChangeMerchList: (arg1: MerchListAction) => void,
  quantity: number,
  addItem: (arg: AddItemHandlerParam) => void,
  properties: SelectedProperty[],
) {
  onChangeTicketList({ type: ActionKind.Decrease, payload: ticket, quantity });

  const propertyNames = properties.map(p => p.pname);
  const propertyIndex = properties.map(p => p.index);

  bundleMerchs.forEach((m, index) => {
    onChangeMerchList({ type: ActionKind.Decrease, payload: m, quantity, propertyIndex: propertyIndex[index] });
  })
  addItem({ item: ticket, quantity: quantity, bundleMerchPayload: bundleMerchs, bundleMerchProperty: propertyNames })
}
