import React, { Fragment, useState } from 'react';
import { Popover, Dialog, Transition } from '@headlessui/react'
import SvgIcon from '@components/SvgIcon';
import { CloseSmall, Delete } from '@icon-park/react';
import NumberInput from '@components/reusable/NumberInput';
import Select from '@components/reusable/Select';
import classNames from 'classnames';
import moment from 'moment'
import { CartTicketItem, EventBasicData, MerchItemDataProps, TicketItemDataProps } from 'lib/model/checkout';
import { useCheckoutState } from 'contexts/checkout-state';
import { useToast } from '@chakra-ui/react';
import { decreaseTicketAmount } from './util/decreseInput';
import { increaseTicketAmount } from './util/IncreseInput';
import { MerchListAction, TicketListAction } from 'pages/checkout/[event_id]';
import { currencyFormatter } from './util/currencyFormat';
import { deleteTicketFromCart } from './util/deleteInput';

const CheckoutHead = ({
  saleStart,
  inPresale,
  ticketList,
  merchList,
  onPresaleCodeValidate,
  onChangeTicketList,
  onChangeMerchList,
}: {
  saleStart: any,
  inPresale: any,
  ticketList: TicketItemDataProps[],
  merchList: MerchItemDataProps[],
  onPresaleCodeValidate: () => void,
  onChangeTicketList: (data: TicketListAction) => void;
  onChangeMerchList: (data: MerchListAction) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { eventDataForCheckout, cart, addItem, removeItem } = useCheckoutState();
  const toast = useToast()
  const closeModal = () => {
    setIsOpen(false)
  }
  const openModal = () => {
    setIsOpen(true)
  }

  const enterPresaleCode = () => {
    closeModal();
    onPresaleCodeValidate();
  }

  const cartItemCount = () => {
    let count = cart.items.bundleItem.length + cart.items.merchItem.length + cart.items.ticketItem.length
    return count
  }

  const nextButtonHandler = () => {
    console.log(cart);
    if (cart.items.bundleItem.length + cart.items.merchItem.length + cart.items.ticketItem.length === 0) {
      console.log('No item in cart');
      generateToast('No item in cart');
      return
    }
  }


  const generateToast = (message: string) => {
    toast({
      title: message,
      position: 'top',
      isClosable: true,
    })
  }

  const getMaxNumberInputQty = (data: TicketItemDataProps) => {
    if (data?.originalQuantity > data?.maxPerOrder) {
      return data?.maxPerOrder
    } else {
      return data?.originalQuantity;
    }
  }

  const getEdtingTicketListItem = (t: CartTicketItem): TicketItemDataProps => {
    return ticketList.find(item => item.id === t.ticketId) as TicketItemDataProps
  }

  const getEditingTicketCartIndex = (t: CartTicketItem) => {
    return cart.items.ticketItem.findIndex(item => item.ticketId === t.ticketId)
  }

  const generateCartTicketsTemplate = () => {
    return cart.items.ticketItem.map(t => {
      return (
        <div className="flex p-4" key={t.ticketId}>
          {/*   <div className="w-16 h-16 rounded-md overflow-hidden">
            <img className="w-full h-full object-cover" src="https://cdn.sspai.com/2021/08/04/ead81f219cd73b7070124c69eefe9923.jpg" alt="" />
          </div> */}
          <div className="flex-1 min-w-0 ml-4 flex flex-col">
            <div className="flex items-start mb-2">
              <div className="text-white text-sm font-semibold w-2/3">{t.name}</div>
              <div className="text-white font-bold w-1/3 text-right whitespace-nowrap">{currencyFormatter(eventDataForCheckout?.default_currency as string).format(t.price * t.quantity)}</div>
            </div>
            <div className="flex items-end justify-between flex-1">
              <div className="flex items-center">
                <NumberInput
                  min={0}
                  max={getMaxNumberInputQty(getEdtingTicketListItem(t))}
                  value={cart?.items?.ticketItem[getEditingTicketCartIndex(t)]?.quantity || 0}
                  size="sm"
                  onDecreaseClick={() => { decreaseTicketAmount(getEdtingTicketListItem(t), cart, getEditingTicketCartIndex(t), onChangeTicketList, removeItem) }}
                  onIncreaseClick={() => { increaseTicketAmount(getEdtingTicketListItem(t), cart, getEditingTicketCartIndex(t), onChangeTicketList, addItem) }}
                />
              </div>
              <div onClick={() => { deleteTicketFromCart(getEdtingTicketListItem(t), cart, getEditingTicketCartIndex(t), onChangeTicketList, removeItem) }}
                className="relative flex items-center justify-center w-8 h-8 text-gray-400 rounded-full cursor-pointer bg-gray-800 hover:bg-gray-700 hover:text-white transition">
                <Delete theme="outline" size="14" fill="currentColor" />
              </div>
            </div>
          </div>
        </div>
      )
    })
  }

  const generateCartMerchsTemplate = () => {
    cart.items.ticketItem.map(t => {

    })
  }

  const generateCartBundleTemplate = () => {
    cart.items.ticketItem.map(t => {

    })
  }

  /*   const select = [
      { value: 'xl', label: 'xl', index: 0 },
      { value: 'm', label: 'm', disabled: true, index: 1 },
      { value: 'xs', label: 'xs', index: 2 },
    ] */


  return (
    <div className="relative bg-gray-800 border-b border-solid border-gray-700">
      <div className="container">
        <div className="flex items-center py-3 sm:py-0 sm:h-20">
          <div className="flex-1 font-semibold min-w-0 hidden sm:block">
            <div className="truncate">{eventDataForCheckout?.title}</div>
            <div className="truncate text-sm text-yellow-500">Event starts on {moment(eventDataForCheckout?.startTime).format('MMMM Do, h:mma')}</div>
          </div>
          <Popover className="flex md:relative sm:ml-4">
            {({ open }) => (
              <>
                <Popover.Button
                  as="div"
                  className={classNames('relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 border-2 border-solid border-gray-600 rounded-full cursor-pointer hover:bg-gray-600 transition', { 'bg-gray-600': open })}
                >
                  <SvgIcon id="buy" className="text-xl" />
                  <div className="badge-count">{cartItemCount()}</div>
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="checkout-enter"
                  enterFrom="checkout-enter-from"
                  enterTo="checkout-enter-to"
                  leave="checkout-leave"
                  leaveFrom="checkout-leave-from"
                  leaveTo="checkout-leave-to"
                >
                  <Popover.Panel className="checkout__cart right-0 origin-top-right">
                    <div className="text-white">
                      <div className="px-5 h-12 flex items-center justify-between md:hidden border-b border-solid border-white border-opacity-10">
                        <div className="font-bold leading-none">My Cart</div>
                        <Popover.Button as={Fragment}>
                          <div className="flex items-center justify-center absolute right-3 w-9 h-9 rounded-full hover:bg-gray-700 hover:text-white transition cursor-pointer text-gray-300" onClick={closeModal}>
                            <CloseSmall theme="outline" size="22" fill="currentColor" strokeWidth={3} />
                          </div>
                        </Popover.Button>
                      </div>
                      <div className="checkout__cart-list web-scroll">
                        {/*  start the loop  */}
                        {generateCartTicketsTemplate()}
                        {cartItemCount() === 0 && (
                          <div style={{justifyContent:'center',display:'flex',alignItems:'center', height:'100%'}}>
                            <h1 className="font-semibold text-lg">Shopping cart is empty</h1>
                          </div>
                        )}
                      </div>
                      <div className="flex px-5 pt-5 border-t border-solid border-white border-opacity-10">
                        <input type="text" className="block w-full px-4 h-11 font-medium rounded-lg bg-gray-800 focus:bg-gray-700 text-white transition placeholder-gray-500 mr-3" placeholder="Discount Code" />
                        <button className="btn btn-rose !py-0 w-32 h-11 !font-semibold">Apply</button>
                      </div>
                      <div className="px-5 pb-5 flex justify-between mt-5">
                        <div className="font-semibold text-lg">Subtotal</div>
                        <div className="font-semibold text-lg">{currencyFormatter(eventDataForCheckout?.default_currency as string).format(cart.subTotal)} </div>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
          {/* show presale only when in presale duration and sale not start */}
          {(saleStart === false && inPresale) && <button className="flex-1 sm:flex-none btn btn-rose !font-semibold !rounded-full !px-5 ml-4 sm:ml-6 !text-sm sm:!text-base" onClick={openModal}>Enter Pre-Sale Code</button>}
          {saleStart && <button className="flex-1 sm:flex-none btn btn-rose !font-semibold !rounded-full !px-5 ml-4 sm:ml-6 !text-sm sm:!text-base" onClick={() => { nextButtonHandler() }} >Next Step</button>}
        </div>
      </div>
      {/*Dialog*/}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => {
          }}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="mask-enter"
              enterFrom="mask-enter-from"
              enterTo="mask-enter-to"
              leave="mask-leave"
              leaveFrom="mask-leave-from"
              leaveTo="mask-leave-to"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="dialog-enter"
              enterFrom="dialog-enter-from"
              enterTo="dialog-enter-to"
              leave="dialog-leave"
              leaveFrom="dialog-leave-from"
              leaveTo="dialog-leave-to"
            >
              <div className="relative inline-block w-full max-w-sm p-5 sm:p-6 my-8 overflow-hidden text-left align-middle bg-gray-800 rounded-2xl z-10">
                <div className="relative flex items-center mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg sm:text-xl font-bold leading-6 text-white"
                  >
                    Please enter <span className="text-rose-500">Pre-Sale Code</span>
                  </Dialog.Title>
                  <div className="flex items-center justify-center absolute -right-2 w-10 h-10 rounded-full hover:bg-gray-700 hover:text-white transition cursor-pointer text-gray-300" onClick={closeModal}>
                    <CloseSmall theme="outline" size="22" fill="currentColor" strokeWidth={3} />
                  </div>
                </div>
                <input type="text" className="block w-full px-3 py-2 sm:py-3 border-2 border-solid border-gray-600 rounded-lg bg-gray-900 text-white text-center transition placeholder-gray-400 hover:border-gray-500 focus:bg-black font-bold text-xl sm:text-2xl" placeholder="Enter code" />
                <p className="mt-6 text-sm text-gray-400">Invitation code is case sensitive, you will reicive the code from the host.</p>
                <button
                  type="button"
                  className="mt-6 btn btn-rose w-full !rounded-full"
                  onClick={enterPresaleCode}
                >
                  Confirm
                </button>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default CheckoutHead;
