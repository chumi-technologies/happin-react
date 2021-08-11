import React from 'react';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import SvgIcon from '@components/SvgIcon';
import { CloseSmall } from '@icon-park/react';

const CheckoutHead = () => {
  const [isOpen, setIsOpen] = useState(false)
  const closeModal = () => {
    setIsOpen(false)
  }
  const openModal = () => {
    setIsOpen(true)
  }
  return (
    <div className="bg-gray-800 border-b border-solid border-gray-700">
      <div className="container">
        <div className="flex items-center h-20">
          <div className="flex-1 font-semibold">
            <div>TWRP: Comin' Atcha Live at the Opera House</div>
            <div className="text-sm text-yellow-500">Event starts on Sat, Jul 17, 2021・8 PM</div>
          </div>
          <div className="relative flex items-center justify-center w-12 h-12 border-2 border-solid border-gray-600 rounded-full mr-6 cursor-pointer hover:bg-gray-600 transition">
            <SvgIcon id="buy" className="text-xl" />
            <div className="badge-count">3</div>
          </div>
          <button className="btn btn-rose !rounded-full !px-5" onClick={openModal}>Enter Pre-Sale Code</button>
        </div>
      </div>
      {/*Dialog*/}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => {
            console.log(111)
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
              <div className="relative inline-block w-full max-w-sm p-6 my-8 overflow-hidden text-left align-middle bg-gray-800 rounded-2xl z-10">
                <div className="relative flex items-center mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-bold leading-6 text-white"
                  >
                    Please enter <span className="text-rose-500">Pre-Sale Code</span>
                  </Dialog.Title>
                  <div className="flex items-center justify-center absolute -right-2 w-10 h-10 rounded-full hover:bg-gray-700 hover:text-white transition cursor-pointer text-gray-300" onClick={closeModal}>
                    <CloseSmall theme="outline" size="22" fill="currentColor" strokeWidth={3}/>
                  </div>
                </div>
                <input type="text" className="block w-full px-9 py-3 border-2 border-solid border-gray-600 rounded-lg bg-gray-900 text-white text-center transition placeholder-gray-400 hover:border-gray-500 focus:bg-black font-bold text-2xl" placeholder="Enter code" />
                <p className="mt-6 text-sm text-gray-400">Invitation code is case sensitive, you will reicive the code from the host.</p>
                <button
                  type="button"
                  className="mt-6 btn btn-rose w-full !rounded-full"
                  onClick={closeModal}
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
