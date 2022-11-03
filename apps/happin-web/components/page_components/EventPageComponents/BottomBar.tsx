import SvgIcon from "@components/SvgIcon";
import { EventData } from "lib/model/event";
import { useRouter } from "next/router";
import Modal from "@components/reusable/Modal";
import React, { useRef, useState } from "react";

interface eventDataProp {
  eventData: EventData;
  setIsChatButtonOpen: (arg: any) => void;
  setPreventScrolling: (arg: any) => void;
  // setOpenIframe: (arg: any) => void;
  queryParams: any;
  // canUseIframe: boolean;
  setIsOpen: (arg: any) => void;
}

const BottomBar = ({
  eventData,
  setIsChatButtonOpen,
  setPreventScrolling,
  // setOpenIframe,
  queryParams,
  // canUseIframe,
  setIsOpen,
}: eventDataProp) => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const hrefRef = useRef<HTMLAnchorElement>(null);
  const isSoldOut = eventData.isTicketSoldOut;

  const offSaleTimeHasPast = (eventData: EventData): boolean => {
    if (eventData?.event?.acInfo?.offSaleSetting?.offSaleTime) {
      return (
        new Date(eventData.event.acInfo.offSaleSetting.offSaleTime).getTime() <
        new Date().getTime()
      );
    }
    return false;
  };

  const checkOffLineEventStarted = (eventData: EventData): boolean => {
    if (
      eventData?.event?.acInfo?.location !== "happin.app" &&
      !eventData.event.streamEnabled
    ) {
      return (
        new Date(eventData.event.start_datetime).getTime() <
        new Date().getTime()
      );
    } else {
      return false;
    }
  };

  const buyTicketClickHandler = () => {
    if (eventData.event?.isThirdParty) {
      setModalVisible(true);
    } else {
      if (eventData.event?.eventHostingType === "audio") {
        //this event have no ticket
        setIsOpen(true);
      } else if (
        eventData.event?.eventHostingType?.includes("livestream") &&
        eventData.event?.eventHostingType !== "livestream-saas"
      ) {
        setIsOpen(true);
      } else {
        router.push({
          pathname: `/checkout/${eventData.event.eid}`,
          query: queryParams,
        });
      }
    }
  };

  return (
    <>
      <div className="footer-action fixed lg:sticky bottom-0 right-0 w-full bg-gray-800 z-40">
        <div className="event-details__container flex py-2.5 sm:py-4">
          <button
            onClick={() => {
              setIsChatButtonOpen((x: boolean) => (x = !x));
            }}
            className="btn btn-yellow !py-2.5 sm:!py-3 !px-0 !font-semibold !rounded-full flex items-center justify-center sm:flex-1 w-48 sm:w-auto"
            // style={{ padding: "0.55rem" }}
          >
            <SvgIcon id="chat" className="text-lg text-gray-900 mr-1 sm:mr-2" />
            <span className="text-sm sm:text-base">Join event community</span>
          </button>
          {!offSaleTimeHasPast(eventData) && (
            <button
              disabled={isSoldOut || checkOffLineEventStarted(eventData)}
              onClick={buyTicketClickHandler}
              // style={{ padding: "0.55rem" }}
              className="btn btn-rose !py-2.5 sm:!py-3 !px-0 !font-semibold !rounded-full flex items-center justify-center flex-1 ml-3"
            >
              <SvgIcon
                id="ticket"
                className="text-lg text-gray-50 mr-1 sm:mr-2"
              />
              <span className="text-sm sm:text-base">
                {isSoldOut
                  ? "Sold Out"
                  : checkOffLineEventStarted(eventData)
                  ? "Event Started"
                  : "Get tickets"}
              </span>
            </button>
          )}

          {offSaleTimeHasPast(eventData) && (
            <button
              disabled={true}
              // style={{ padding: "0.55rem" }}
              className="btn btn-rose !px-0 !font-semibold !rounded-full flex items-center justify-center flex-1 ml-3"
            >
              <SvgIcon
                id="ticket"
                className="text-lg text-gray-50 mr-1 sm:mr-2"
              />
              <span className="text-sm sm:text-base">
                {eventData.event.acInfo.offSaleSetting?.offSaleText}
              </span>
            </button>
          )}
        </div>
      </div>
      {/* create success modal */}
      <Modal
        isOpen={modalVisible}
        setIsOpen={setModalVisible}
        maskClosable={false}
        initialFocus={hrefRef}
      >
        <div className="text-left">
          <p className="text-lg text-gray-50 font-semibold pr-8">
            Do not forget to join the event community after you purchase
            tickets!
          </p>
          <div className="flex justify-end mt-7">
            <button
              className="btn btn-dark-light"
              onClick={() => setModalVisible(false)}
            >
              Cancel
            </button>
            <a
              ref={hrefRef}
              className="btn btn-rose ml-3 focus:outline-rose-500/30"
              target="_blank"
              href={eventData.event.sourceUrl}
              rel="noopener noreferrer"
            >
              Continue to get tickets
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BottomBar;
