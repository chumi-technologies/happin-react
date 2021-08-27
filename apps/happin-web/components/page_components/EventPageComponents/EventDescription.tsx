import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState, useRef } from 'react';
import { CloseSmall } from '@icon-park/react';

type EventDescriptionProps = {
  description?: string;
  rawDescription?: string;
}

const EventDescription = ({description, rawDescription = ""}: EventDescriptionProps) => {
  let focuButtonRef = useRef(null)

  const [isOpen, setIsOpen] = useState(false)
  const closeModal = () => {
    setIsOpen(false)
  }
  const openModal = () => {
    setIsOpen(true)
  }

  return (
    <>
      <div className="black-title text-xl sm:text-2xl font-semibold">Description</div>
      <div className={`mt-3 sm:mt-5 text-sm sm:text-base relative ${(rawDescription?.length < 80)? "" : "max-h-12 overflow-hidden"}`}>
        {rawDescription}
       {/*  <div>
          <Link href="#"><a className="mr-2 link-blue">Website,</a></Link>
          <Link href="#"><a className="mr-2 link-blue">Instagram,</a></Link>
          <Link href="#"><a className="link-blue">Spotify</a></Link>
        </div> */}

      </div>
      {!(rawDescription?.length < 80) && (
          <div className="pt-4 link-rose inline-block cursor-pointer font-medium" onClick={openModal}>More ...</div>
        )}
      {/*Dialog*/}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          initialFocus={focuButtonRef}
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => {
          }}
        >
          <div className="min-h-screen px-2 sm:px-4 text-center">
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
              <div className="event-details__description-modal">
                <div className="relative flex items-center mb-6 px-6 pt-6">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-bold leading-6"
                  >
                    Description
                  </Dialog.Title>
                  <div className="flex items-center justify-center absolute right-3 w-10 h-10 rounded-full hover:bg-gray-200 hover:text-gray-700 transition cursor-pointer text-gray-500" onClick={closeModal}>
                    <CloseSmall theme="outline" size="22" fill="currentColor" strokeWidth={3}/>
                  </div>
                </div>
                <div className="flex-1 h-0 overflow-y-auto pb-6">
                  <div className="px-6">
                    {/*Description content here*/}
                    <div className="text-sm sm:text-base">
                      <div  dangerouslySetInnerHTML={{ __html: description || '' }}/>
                     {/*  <div>
                        <Link href="#"><a className="mr-2 link-blue">Website,</a></Link>
                        <Link href="#"><a className="mr-2 link-blue">Instagram,</a></Link>
                        <Link href="#"><a className="link-blue">Spotify</a></Link>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
          {/* dialog needs a element to focus, in case the description dont have a element that can be focus */}
          <button hidden={true} ref={focuButtonRef}></button>
        </Dialog>
      </Transition>
    </>
  );
};

export default React.memo(EventDescription);
