import React, { Fragment, ReactNode, useRef } from 'react';
import classNames from 'classnames';
import { Dialog, Transition } from '@headlessui/react';
import classnames from 'classnames';
import IconPark from '@components/IconPark';

export type ModalProps = {
  isOpen: boolean;
  setIsOpen: (arg: boolean) => any;
  maskClosable?: boolean;
  onClose?: () => void;
  containerClass?: string;
  maxWidth?: string | number;
  headerRender?: () => ReactNode;
  title?: string | ReactNode;
  initialFocus?: React.MutableRefObject<HTMLElement | null> | undefined;
  children: ReactNode;
}

const Modal = (props: ModalProps) => {
  const {
    isOpen = false,
    setIsOpen,
    maskClosable = true,
    onClose,
    containerClass = 'max-w-md',
    maxWidth,
    headerRender,
    title,
    initialFocus,
    children
  } = props;
  const focusRef = useRef<HTMLDivElement>(null);
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        initialFocus={initialFocus || focusRef}
        onClose={() => {
          maskClosable && setIsOpen(false);
          onClose && onClose();
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
          <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
          <Transition.Child
            as={Fragment}
            enter="dialog-enter"
            enterFrom="dialog-enter-from"
            enterTo="dialog-enter-to"
            leave="dialog-leave"
            leaveFrom="dialog-leave-from"
            leaveTo="dialog-leave-to"
          >
            <div
              className={classNames('relative inline-block w-full min-w-[20rem] p-5 sm:p-6 my-8 text-center overflow-hidden text-left align-middle bg-gray-800 rounded-2xl z-10', containerClass)}
              style={maxWidth && maxWidth > 0 ? { maxWidth: `${maxWidth}px` } : {}}
            >
              {
                headerRender ? headerRender : (
                  <div className={classnames('relative flex items-center', {'mb-6': title})}>
                    {
                      title && (
                        <Dialog.Title
                          as="h3"
                          className="text-lg sm:text-xl font-bold leading-6 text-gray-50 text-left pr-8"
                        >
                          {title}
                        </Dialog.Title>
                      )
                    }
                    <div
                      className={classNames('flex items-center justify-center absolute -right-2 w-10 h-10 rounded-full hover:bg-gray-700 hover:text-gray-50 transition cursor-pointer text-gray-300', {
                        '-top-2': !title
                      })}
                      onClick={() => {
                        setIsOpen(false);
                        onClose && onClose();
                      }}>
                      <IconPark name="close-small" size={22} />
                    </div>
                  </div>
                )
              }
              <div ref={focusRef} className="w-full focus:outline-0">
                {children}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
