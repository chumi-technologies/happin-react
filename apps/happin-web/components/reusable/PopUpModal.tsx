import { CloseSmall } from '@icon-park/react';
import React from 'react';

const PopUpModal = ({ modalTitle, setIsModalOpen, children, closeableOutside=true, showCloseIcon=true, mobilePosition='bottom'}: any) => {
  return (
    <div id="pop_up_modal" className={`fade-background fixed inset-0 w-full h-full flex ${mobilePosition === "bottom" ? 'items-end sm:items-center' : 'items-center'} justify-center z-50`} onClick={(e) => {
      if ((e.target as HTMLElement).id === "pop_up_modal" && closeableOutside) {
        setIsModalOpen(false);
      }
    }}>
      <div className={`${mobilePosition === "buttom" ? 'event-details__modal' : 'event-details__modal2'} fade-in-up`}>
        <div className="flex items-center justify-center">
          <div className="text-lg font-bold">{modalTitle}</div>
          {/* Close Icon */}
          {showCloseIcon &&
            <div className="flex items-center justify-center absolute right-3 w-10 h-10 rounded-full hover:bg-gray-700 hover:text-gray-50 transition cursor-pointer text-gray-300" onClick={() => {
              setIsModalOpen(false)
            }}>
              <CloseSmall theme="outline" size="22" fill="currentColor" strokeWidth={3}/>
            </div>
          }
        </div>
        {/* Body Block */}
        {children}
      </div>
    </div>
  );
};

export default PopUpModal;
