import { Avatar, Stack } from '@chakra-ui/react';
import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CloseSmall } from '@icon-park/react';

type EventHostProps = {
  hostName?: string;
  hostProfileImageUrl?: string;
  hostEmail?: string;
}

const EventHost = (props: EventHostProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar boxSize={14} src={props.hostProfileImageUrl} name={props.hostName} />
          <div className="flex-1 ml-3 sm:ml-5">
            <div className="font-semibold sm:text-lg">{props.hostName}</div>
            <div className="text-sm sm:text-base text-gray-400">Event Creator</div>
          </div>
        </div>
        <button className="btn btn-blue !font-semibold w-24 btn-sm !rounded-full"
          onClick={() => setIsOpen(true)}
        >Contact</button>
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
              <div className="relative inline-block w-full max-w-md p-5 sm:p-6 my-8 text-center overflow-hidden text-left align-middle bg-gray-800 rounded-2xl z-10">
                <div className="relative flex items-center mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg sm:text-xl font-bold leading-6 text-gray-50"
                  >
                    Contact the organizer
                  </Dialog.Title>
                  <div className="flex items-center justify-center absolute -right-2 w-10 h-10 rounded-full hover:bg-gray-700 hover:text-gray-50 transition cursor-pointer text-gray-300" onClick={() => setIsOpen(false)}>
                    <CloseSmall theme="outline" size="22" fill="currentColor" strokeWidth={3} />
                  </div>
                </div>
                <div className="mt-6 mb-2 text-gray-50 font-semibold">Common questions:</div>
                <Stack align="center" className="text-sm text-gray-300">
                  <a rel="noreferrer" target="_blank" href="https://help.happin.app/en/articles/5613558-can-i-get-a-refund"  className="link-normal">Can I get a refund?</a>
                  <a rel="noreferrer" target="_blank" href="https://help.happin.app/en/articles/5613572-can-i-confirm-my-order" className="link-normal">How to confirm my order and tickets?</a>
                  <a rel="noreferrer" target="_blank" href="https://help.happin.app/en/articles/5613572-can-i-confirm-my-order" className="link-normal">Where are my tickets?</a>
                </Stack>
                {props.hostEmail ?
                  <>
                    <div className="h-px bg-gray-600 my-6" />
                    <div className="mb-2 text-gray-50 font-semibold">Have a question for the organizer?</div>
                    <div className="text-sm text-gray-300">See the event page for more information or</div>
                    <a href={`mailto: ${props.hostEmail}`}
                       className="block mt-4 mb-1 btn btn-rose">
                      Contact the organizer
                    </a>
                  </> :
                  <>
                    <div className="h-px bg-gray-600 my-6" />
                    <div className="mb-2 text-gray-50 font-semibold">The organizer {`didn't`} provide a contact email</div>
                    <div className="text-sm text-gray-300">You can send us a message by clicking the button below</div>
                    <a href="mailto:admin@happin.app"
                      className="block mt-4 mb-1 btn btn-rose" onClick={()=>{setIsOpen(false)}}>
                      Contact us
                    </a>
                  </>
                }
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default React.memo(EventHost);
