import React, { Fragment, useEffect, useReducer, useState } from 'react';
import TicketItem from '../../components/page_components/CheckoutPageComponents/TicketItem';
import CheckoutHead from '../../components/page_components/CheckoutPageComponents/CheckoutHead';
import BundleSidebar from '../../components/page_components/CheckoutPageComponents/BundleSidebar';
import { ETicketAvailability, ETicketFeature, ETicketType, ETicketVisibility, EventBasicData, GeneralTicketInfo, MerchItemDataProps, MerchProperty, TicketItemDataProps, TicketItemFeaturesProps } from '../../lib/model/checkout';
import MerchItem from '../../components/page_components/CheckoutPageComponents/MerchItem';
import { Link, animateScroll as scroll } from 'react-scroll';
import { useResize } from 'utils/hooks';
import { useRouter } from 'next/router';
import moment from 'moment';
import { TicketAndMerchListActionKind, useCheckoutState } from 'contexts/checkout-state';
import { getEventDetailForCheckout, getEventMerchs, getGATickets, validateCode } from 'lib/api';
import MerchSidebar from '@components/page_components/CheckoutPageComponents/MerchSideBar';
import { releaseLock } from './payment';

const Checkout = () => {
  const router = useRouter();
  const windowWidth = useResize();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bundleSidebarOpen, setBundleSidebarOpen] = useState(false);

  const [selectedRegularMerch, setSelectedRegularMerch] = useState<MerchItemDataProps>();
  const [selectedBundleMerch, setSelectedBundleMerch] = useState<MerchItemDataProps[]>();
  const [selectedBundleTicket, setSelectedBundleTicket] = useState<TicketItemDataProps>();

  const [saleStart, setSaleStart] = useState<boolean>();
  const [inPresale, setInPresale] = useState<boolean>();

  // indicate presale code from url param is valid
  const [presaleCodeUsed, setPresaleCodeUsed] = useState<boolean>(false);

  const { setEventDataForCheckout,
    eventDataForCheckout,
    boxOfficeMode,
    setGeneralTicketInfo,
    generalTicketInfo,
    setAffiliate,
    setCodeUsed, merchListState,
    dispatcMerchListAction,
    ticketListState,
    dispatchTicketListAction,
    onlyShowMerch,
  } = useCheckoutState();

  const ticketTypeHeaderId = new Set<string>()

  useEffect(() => {
    (async () => {
      if (router.query.event_id && router.query.event_id !== 'undefined') {
        // check code in url is valid or not
        if (router.query.code || router.query.affiliate) {
          // affilate code could be 100% discount code, hence need to check
          // if the affilate code is valid disocunt code, then store in the context if valid (codeUsed)
          if (router.query.affiliate) {
            // store affiliate code into context regardless, server will check validity on final step
            setAffiliate(router.query.affiliate as string)
          }
          // two code appear at same time is not possible
          await validateUrlCodeAndSetState(router.query.event_id as string, ((router.query.code || router.query.affiliate) as string));
        }
        Promise.all([getEventDetailAndSetState(router.query.event_id as string),
          getEventTicketsAndSetState(router.query.event_id as string),
          getEventMerchAndSetState(router.query.event_id as string)])
      }
    })()

    if (localStorage.getItem('orderId')) {
      releaseLock()
    }
    // hack react-scroll初加载拿不到offset的问题
    scroll.scrollTo(1, {
      containerId: 'checkout-scroll-body'
    });
  }, [router.query])

  useEffect(() => {
    if (generalTicketInfo?.saleStartTime) {
      checkSaleStarted(generalTicketInfo.saleStartTime);
    }
    if (generalTicketInfo?.presaleStart && generalTicketInfo?.presaleEnd) {
      checkPresaleStarted(generalTicketInfo.presaleStart, generalTicketInfo.presaleEnd);
    }
  }, [generalTicketInfo, presaleCodeUsed])

  const validateUrlCodeAndSetState = async (eventId: string, code: string) => {
    try {
      const res = await validateCode(eventId, code)
      if (res.valid) {
        if (res.type === 'discount') {
          setCodeUsed(res.code)
        } else if (res.type === 'presale') {
          setPresaleCodeUsed(true);
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getEventDetailAndSetState = async (eventId: string) => {
    try {
      const res = await getEventDetailForCheckout(eventId);
      const eventDetail: EventBasicData = {
        id: res._id,
        tags: res.tags,
        title: res.title,
        startTime: res.startTime,
        endTime: res.endTime,
        default_currency: res.default_currency,
        cover: res.cover,
        paymentMethod: res.paymentMethod,
        paypalEmail: res.paypalEmail,
      }
      setEventDataForCheckout(eventDetail)
    } catch (err) {
      console.log(err)
    }
  }

  const getEventTicketsAndSetState = async (eventId: string) => {
    try {
      const res = await getGATickets(eventId);
      const ticketList: TicketItemDataProps[] = res.tickets.map((t: any) => {
        let features: TicketItemFeaturesProps[] = [];
        switch (t.ticketType) {
          case ETicketType.INPERSON:
            features = [ETicketFeature.TICKET]
            break;
          case ETicketType.FREEINPERSON:
            features = [ETicketFeature.TICKET]
            break;
          case ETicketType.LIVESTREAM:
            features = [ETicketFeature.TICKET, ETicketFeature.PLAYBACK]
            break;
          case ETicketType.PFM:
            features = [ETicketFeature.TICKET,
            ETicketFeature.PLAYBACK,
            ETicketFeature.VIP]
            break;
          case ETicketType.PLAYBACK:
            features = [ETicketFeature.TICKET,
            ETicketFeature.PLAYBACK]
            break;
          default:
            break;
        }

        if (t.isBundle) {
          features.push(ETicketFeature.MERCHBUNDLE);
        }

        const ticket: TicketItemDataProps = {
          id: t.id,
          sectionId: t.sectionId,
          title: t.name,
          start: t.start,
          end: t.end,
          minPerOrder: t.minPerOrder,
          maxPerOrder: t.maxPerOrder,
          quantity: t.quantity,
          originalQuantity: t.quantity,
          ticketType: t.ticketType,
          merch: t.isBundle,
          price: t.price,
          notes: t.notes,
          features,
          kind: t.isBundle ? 'bundle' : 'ticket',
          visibility: t.visibility,
          availability: t.availability
        }
        return ticket
      })
      dispatchTicketListAction({ type: TicketAndMerchListActionKind.Init, initValue: ticketList })
      const gerneralTicketInfo: GeneralTicketInfo = {
        absorbFee: res.generalInfo.absorbFee,
        saleStartTime: res.generalInfo.onSaleCounter,
        presaleStart: res.generalInfo.presaleStartTime,
        presaleEnd: res.generalInfo.presaleEndTime,
        taxNeeded: res.generalInfo.taxNeeded
      }
      setGeneralTicketInfo(gerneralTicketInfo);
    } catch (err) {
      console.log(err)
    }
  }

  const getEventMerchAndSetState = async (eventId: string) => {
    try {
      const res = await getEventMerchs(eventId);
      let merchList: MerchItemDataProps[] = []
      if (res.length) {
        merchList = res.map((m: any) => {
          const property: MerchProperty[] = m.properties.map((p: any) => ({
            ...p,
            originalPValue: p.pValue
          }))
          const bindTickets = m.activities.filter((a: any) => eventId === a.activityId)
            .map((a: any) => a.tickets.map((t: any) => t.ticketId))
          const merch: MerchItemDataProps = {
            id: m._id,
            image: m.image,
            name: m.name,
            max: m.max,
            forApp: m.forApp,
            description: m.description,
            shippingCountry: m.shippingCost.map((shipping: any) => shipping.destination),
            price: m.price,
            kind: 'merch',
            mail: m.mail,
            show: m.show,
            property,
            tickets: bindTickets[0] || []
          }
          return merch
        })
      }
      dispatcMerchListAction({ type: TicketAndMerchListActionKind.Init, initValue: merchList })
    } catch (err) {
      console.log(err);
    }
  }


  const onTicketBundleSelect = (value: any) => {
    if (typeof value === 'object') {
      // set selected bundle merch
      filterBundleMerchForSelectedTicket(value.id)
      // set selceted bundle ticket
      setSelectedBundleTicket(value)
      // give a delay to allow the selected merch and ticket are updated
      setTimeout(() => {
        setBundleSidebarOpen(true);
      }, 100)
    }
  }

  const checkSaleStarted = (unixTime: number) => {
    // need to add condition if a presale code is entered and is valid (validate on server),
    if (new Date(unixTime) < new Date()) {
      setSaleStart(true)
    } else {
      setSaleStart(false)
    }
  }

  const checkPresaleStarted = (start: number, end: number) => {
    if (moment(new Date()).isBetween(moment(start), moment(end))) {
      setInPresale(true)
      if (presaleCodeUsed) {
        setSaleStart(true);
      }
    } else {
      setInPresale(false)
    }
  }

  const filterBundleMerchForSelectedTicket = (ticketId: string) => {
    const filterMerchs = merchListState.filter(m => {
      if (m.tickets.includes(ticketId)) {
        return true
      }
    })
    setSelectedBundleMerch(filterMerchs);
  }

  const renderTicketBaseOnAvailability = (item: TicketItemDataProps, disabledFlag: boolean): JSX.Element => {
    // in box office mode, only display at door and every-where tickets
    // otherwise display every-where && online tickets
    if (boxOfficeMode && (item.availability === ETicketAvailability.AT_DOOR
      || item.availability === ETicketAvailability.EVERY_WHERE)) {
      return <TicketItem
        key={item.id}
        data={item}
        onSelect={onTicketBundleSelect}
        currency={eventDataForCheckout?.default_currency || ''}
        absorbFee={generalTicketInfo?.absorbFee || false}
        taxNeeded={generalTicketInfo?.taxNeeded || 0}
        disabled={disabledFlag}
      />
    } else if (boxOfficeMode) {
      return <Fragment key={item.id}></Fragment>
    }
    if (!boxOfficeMode && (item.availability === ETicketAvailability.EVERY_WHERE
      || item.availability === ETicketAvailability.ONLINE)) {
      return <TicketItem
        key={item.id}
        data={item}
        onSelect={onTicketBundleSelect}
        currency={eventDataForCheckout?.default_currency || ''}
        taxNeeded={generalTicketInfo?.taxNeeded || 0}
        absorbFee={generalTicketInfo?.absorbFee || false}
        disabled={disabledFlag}
      />
    } else if (!boxOfficeMode) {
      return <Fragment key={item.id}></Fragment>
    }
    return <Fragment key={item.id}></Fragment>
  }


  if (ticketListState.length) {
    ticketListState.forEach(t => {
      switch (t.ticketType) {
        case ETicketType.LIVESTREAM:
          ticketTypeHeaderId.add('Livestream-Tickets');
          break;
        case ETicketType.PFM:
          ticketTypeHeaderId.add('Livestream-Tickets');
          break;
        case ETicketType.INPERSON:
          // not generate the tab for in person when the event is past
          if (eventDataForCheckout && moment(eventDataForCheckout.endTime).isBefore(new Date())) {
            return;
          }
          ticketTypeHeaderId.add('In-Person-Tickets');
          break;
        case ETicketType.FREEINPERSON:
          // not generate the tab for in person when the event is past
          if (eventDataForCheckout && moment(eventDataForCheckout.endTime).isBefore(new Date())) {
            return;
          }
          ticketTypeHeaderId.add('In-Person-Tickets');
          break;
        case ETicketType.PLAYBACK:
          ticketTypeHeaderId.add('Livestream-Tickets');
          break;
        default:
          break;
      }
    })
  }

  const ticketTypeHeaderArray = Array.from(ticketTypeHeaderId).map(id => (
    <Link
      className="checkout__head-tab"
      activeClass="active"
      containerId="checkout-scroll-body"
      to={id}
      name="myScrollToElement"
      spy={true}
      smooth={true}
      key={id}
      offset={windowWidth > 640 ? -56 : -44}
      duration={500}
    >
      {id.replace(/-/g, ' ')}
    </Link>
  ))

  const hasRegularMerch = () => {
    let hasRegularMerch = false
    if (merchListState.length) {
      merchListState.forEach(m => {
        if (!m.tickets.length) {
          hasRegularMerch = true;
        }
      })
    }
    return hasRegularMerch;
  }

  return (
    <div className="checkout__page">
      <div className="flex flex-col-reverse md:flex-col h-full">
        <CheckoutHead
          saleStart={saleStart}
          inPresale={inPresale}
          onPresaleCodeValidate={setSaleStart} />
        <div className="flex-1 h-0 web-scroll overflow-y-auto" id="checkout-scroll-body">
          <div className="sticky top-0 bg-gray-800 shadow-2xl z-10">
            <div className="container">
              <div className="flex">
                {!onlyShowMerch && ticketTypeHeaderArray}
                {(merchListState.length && hasRegularMerch()) ?
                  <Link
                    className="checkout__head-tab"
                    activeClass="active"
                    containerId="checkout-scroll-body"
                    to="merch"
                    spy={true}
                    smooth={true}
                    offset={windowWidth > 640 ? -56 : -44}
                    duration={500}
                  >
                    Merch
                  </Link> : <></>}
              </div>
            </div>
          </div>
          <div className="container">
            <div className="checkout__container">
              <div className="divide-y divide-gray-700">
                {/* do not show ticket and merchs when not published */}
                {(eventDataForCheckout && !eventDataForCheckout.tags?.includes('Private')) &&
                  (<>
                    {/* TODO NEED TO REMOVE AND ADD THE SALE TIME ON CHECKOU HEADER */}
                    {/* display public sale start time when sale not start */}
                    {saleStart === false &&
                      (
                        <div className="sm:text-lg" style={{ fontWeight: 600, textAlign: 'center', margin: '20px 0' }}>
                          <h1>Public sale start on</h1>
                          <h1>{moment(generalTicketInfo?.saleStartTime).format('MMMM Do, h:mma')}</h1>
                        </div>
                      )}
                    {!onlyShowMerch && <>
                      <div id="Livestream-Tickets" className="divide-y divide-gray-700">
                        {
                          ticketListState.map((item) => {
                            if ((item.ticketType === ETicketType.LIVESTREAM || item.ticketType === ETicketType.PFM
                              || item.ticketType === ETicketType.PLAYBACK) && item.visibility !== ETicketVisibility.INVISIBLE) {

                              let disabledFlag = false;
                              if (!saleStart) {
                                disabledFlag = true
                              }
                              return renderTicketBaseOnAvailability(item, disabledFlag);
                            } else return <Fragment key={item.id}></Fragment>
                          })
                        }
                      </div>
                      <div id="In-Person-Tickets" className="divide-y divide-gray-700">
                        {
                          ticketListState.map((item) => {
                            if ((item.ticketType === ETicketType.INPERSON || item.ticketType === ETicketType.FREEINPERSON)
                              && item.visibility !== ETicketVisibility.INVISIBLE) {

                              // for inperson ticket, if event has started, disable all the in person tickets,
                              // by passing the disabled into ticketItem
                              let disabledFlag = false;
                              if (eventDataForCheckout && moment(eventDataForCheckout?.startTime).isBefore(moment(new Date()))) {
                                disabledFlag = true;
                              }
                              if (!saleStart) {
                                disabledFlag = true
                              }
                              // if event has ended do not show the in person tickets at all
                              if (eventDataForCheckout && moment(eventDataForCheckout?.endTime).isBefore(moment(new Date()))) {
                                return <Fragment key={item.id}></Fragment>
                              }
                              return renderTicketBaseOnAvailability(item, disabledFlag);
                            } else return <Fragment key={item.id}></Fragment>
                          })
                        }
                      </div>
                    </>}
                    {/* merch items start */}
                    {(merchListState.length > 0 && hasRegularMerch()) && (<div id="merch" className="py-5 sm:py-8 text-white">
                      <div className="mb-3 font-semibold text-lg">Add On</div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {
                          merchListState.map((item) => {
                            let disabledFlag = false
                            if (!saleStart) {
                              disabledFlag = true
                            }
                            // not showing to the regular merch list if merch is 1. for app(virtual gift)
                            // 2. deleted(show is false) 3.tickets list has item (bundle merch)
                            if (item.forApp || !item.show || item.tickets.length) {
                              return <Fragment key={item.id}></Fragment>
                            }
                            return (
                              <MerchItem
                                key={item.id}
                                currency={eventDataForCheckout.default_currency}
                                data={item}
                                disabled={disabledFlag}
                                onSelect={() => {
                                  setSelectedRegularMerch(item)
                                  setSidebarOpen(true);
                                }}
                              />
                            )
                          })
                        }
                      </div>
                    </div>)}
                  </>)
                }
              </div>
            </div>
          </div>
          <BundleSidebar
            ticket={selectedBundleTicket as TicketItemDataProps}
            isOpen={bundleSidebarOpen}
            setIsOpen={setBundleSidebarOpen}
            merchs={selectedBundleMerch as MerchItemDataProps[]}
            onClose={() => { setBundleSidebarOpen(false); setSelectedBundleMerch(undefined); setSelectedBundleTicket(undefined) }}
          />
          <MerchSidebar
            merch={selectedRegularMerch as MerchItemDataProps}
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
            onClose={() => { setSidebarOpen(false); setSelectedRegularMerch(undefined) }}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
