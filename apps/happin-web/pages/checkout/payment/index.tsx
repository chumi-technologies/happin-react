import React, { useState, Fragment, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import NumberInput from '@components/reusable/NumberInput';
import PaymentHead from '@components/page_components/PaymentPageComponents/PaymentHead';
import CheckoutForm from '@components/page_components/PaymentPageComponents/StripeCheckoutForm';
import {
  CardElement,
  Elements,
  useElements,
  useStripe
} from "@stripe/react-stripe-js";
import { Delete } from '@icon-park/react';
import { Checkbox, HStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useCheckoutState } from 'contexts/checkout-state';
import { currencyFormatter } from '../../../components/page_components/CheckoutPageComponents/util/currencyFormat';
import { CartTicketItem, TicketItemDataProps, MerchItemDataProps, CartBundleItem, CartMerchItem, OrderItem, MappingQuestionsResponse } from '../../../lib/model/checkout';
import { useRouter } from 'next/router';
import { useToast } from '@chakra-ui/react';
import Select from "react-select";
import countryList from 'react-select-country-list';
import { deleteTicketFromCart, deleteMerchFromCart } from '../../../components/page_components/CheckoutPageComponents/util/deleteInput';
import { decreaseBundleTicketAmount } from '../../../components/page_components/CheckoutPageComponents/util/decreseInput';
import { generateToast } from '../../../components/page_components/CheckoutPageComponents/util/toast';
import { validateCode, lockCheckoutTickets, releaseLockCheckoutTickets, submitPayment, getOrderStatus, updateOrderFromCart, getCheckoutFormQuestions } from '../../../lib/api';
import { Dialog, Transition } from '@headlessui/react';
import { PayPalButton } from "react-paypal-button-v2";
import _ from "lodash";
import { loadStripe, StripeCardElement } from '@stripe/stripe-js';
import { User } from 'lib/model/user';
import { useUserState } from 'contexts/user-state';


enum EOrderStatus {
  RESERVED = 'Reserved',
  INPROGRESS = 'PaymentInProgress',
  PAID = 'Paid',
  CANCELLED = 'Cancelled',
  EXPIRED = 'Expired'
}

type FormData = {
  email: string;
  country?: string;
  fullName: string;
  phone: string;
  city?: string;
  house?: string;
  apartment?: string;
  province?: string;
  postcode?: string;
};

const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    color: state.isSelected ? '#1a1a1a' : '#fff',
    background: state.isSelected ? '#fff' : state.isFocused ? '#000' : '#1a1a1a',
    padding: 20,
  }),
  menuList: (provided: any, state: any) => ({
    ...provided,
    padding: 0,
  }),
  control: (provided: any, state: any) => ({
    // none of react-select's styles are passed to <Control />
    ...provided,
    background: state.isSelected ? '#E8F0FE' : '#000',
    marginTop: '0.25rem',
    border: '2px solid gray',
    borderRadius: '0.5rem',
    padding: '0.1rem 0.75rem',
  }),
  dropdownIndicator: (provided: any, state: any) => ({
    ...provided,
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: state.isSelected ? '#000' : '#fff',
  }),
}

export const releaseLock = async () => {
  const orderId = localStorage.getItem('orderId');
  if (orderId) {
    try {
      localStorage.removeItem('orderId');
      localStorage.removeItem('activityId');
      await releaseLockCheckoutTickets(orderId);
      console.log('release tickets')
    }
    catch (err) {
      console.log(err)
    }
  }
}

const PaymentInner = (props: any) => {
  const {
    register,
    handleSubmit,
    formState,
    formState: { errors, isValid, isSubmitting },
    //setValue,
    //reset,
    control,
    getValues
  } = useForm<FormData>({ mode: 'all' });


  const focusButtonRef = useRef(null);
  const router = useRouter();
  const toast = useToast();
  const [billingAddress, setBillingAddress] = useState('')
  const [chooseStripe, setChooseStripe] = useState(false);
  const [isPorcessing, setIsProcessing] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(1)
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [stripeInputError, setStripeInputError] = useState<any>(null);
  const { eventDataForCheckout,
    cart,
    codeUsed,
    setCodeUsed,
    dispatchTicketListAction,
    dispatchMerchListAction,
    removeItem,
    ticketListState,
    merchListState,
    affiliate,
    openInApp,
    generalTicketInfo,
    userInfoFromUrl
  } = useCheckoutState();
  const { user } = useUserState();
  const [validateCodeLoading, setValidateCodeLoading] = useState<boolean>(false);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [priceBreakDown, setPriceBreakDown] = useState<any>({});
  const [shippingCountry, setShippingCountry] = useState<string>('');
  const [showShipping, setShowShipping] = useState<boolean>(false);
  const [checkoutQuestions, setCheckoutQuestions] = useState<any[]>([]);
  const [promoteCode, setPromoteCode] = useState<string>('');


  // for stripe, in case stripe payment failed , can pay again with this secret
  const [clientSecret, setClientSecret] = useState<string>();

  const generateShippingOptions = (): any[] => {
    const shippings = merchListState.filter(m => !m.isDonation).map(m => m.shippingCountry);
    const shippingOptionsUnion = _.union(shippings[0]);
    if (shippingOptionsUnion.includes("ROW")) {
      return countryList().getData()
    }
    return countryList().getData().filter(list => shippingOptionsUnion.includes(list.value));
  }

  const ApplyPromoCode = async (e: any) => {
    if (!promoteCode) {
      return
    }
    try {
      setValidateCodeLoading(true)
      const res = await validateCode(eventDataForCheckout?.id as string, promoteCode as string)
      const ticketsInCart = [...cart.items.ticketItem.map(i => i.ticketId), ...cart.items.bundleItem.map(i => i.ticketId)];
      // If not applied to all and no match ticket ids show error
      if (res.valid && res.type === 'discount') {
        if (!res.appliedToAll && !res.appliedTo.some((id: string) => ticketsInCart.includes(id))) {
          generateToast(`No eligible product for discount`, toast);
        } else {
          generateToast(`Discount applied successfully`, toast);
          setCodeUsed(promoteCode.trim());
        }
      } else {
        generateToast(`Not a valid code`, toast)
        return;
      }
    } catch (err) {
      console.log(err)
    } finally {
      setValidateCodeLoading(false)
    }
  }

  const handleCartUpdateAndApplyPromoCode = async () => {
    const orderId = localStorage.getItem('orderId');
    if (orderId) {
      caculatePriceBreakDown(orderId,
        {
          cart: cart.items,
          discountCode: codeUsed || "",
          activityId: eventDataForCheckout?.id || "",
          shippingCountry: shippingCountry
        });
    }
  }

  const onPayPalApprove = (data: any, actions: any) => {
    return actions.order.capture().then(async (details: any) => {
      const crowdcoreOrderId = localStorage.getItem('orderId')
      const userForm = getValues()
      const checkoutFormAnswers = generateQuestionAnswer(userForm);
      const shippingForm = {
        country: userForm.country,
        city: userForm.city,
        province: userForm.province,
        street: userForm.house,
        postalCode: userForm.postcode
      }
      const formForPayPal = {
        paypalChargeId: details['purchase_units'][0]['payments']['captures'][0]['id'],
        orderId: crowdcoreOrderId,
        method: 'paypal',
        shipping: shippingForm,
        email: userForm.email,
        phone: userForm.phone,
        buyerName: userForm.fullName,
        affiliateCode: affiliate,
        checkoutForm: checkoutFormAnswers
      }
      postPaymentToCrowdCore(formForPayPal, crowdcoreOrderId as string)
    });
  }

  const createPayPalOrder = (_: any, actions: any) => {
    if (!agreeToTerms) {
      generateToast('Terms and condition is not checked', toast);
      return
    }
    // hack to trigger the validate, display the error message
    handleSubmit((data) => { })()
    if (!isValid) {
      return;
    }
    if (!localStorage.getItem('orderId')) {
      generateToast('Order lost', toast);
      return
    }

    let paypalObject: any;
    if (eventDataForCheckout?.paypalEmail) {
      paypalObject = {
        purchase_units: [
          {
            amount: {
              currency_code: eventDataForCheckout?.default_currency,
              value: priceBreakDown.total / 100
            },
            payee: {
              email_address: eventDataForCheckout?.paypalEmail
            }
          }
        ],
      }
    } else {
      paypalObject = {
        purchase_units: [
          {
            amount: {
              currency_code: eventDataForCheckout?.default_currency,
              value: priceBreakDown.total / 100
            }
          }
        ],
      }
    }

    return actions.order.create(paypalObject);
  }

  const generateQuestionAnswer = (data: any) => {
    const checkoutFormAnswers: any[][] = [];
    const questions: any = checkoutQuestions.map(q => ({ question: q.questions, type: q.type }));
    if (questions) {
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].type === 'multipleSelect') {
          let multiSelectAnswer = [];
          for (let j = 0; j < data[questions[i].question].length; j++) {
            multiSelectAnswer.push(data[questions[i].question][j].value);
          }
          checkoutFormAnswers.push(multiSelectAnswer);
        } else if (questions[i].type === 'singleSelect') {
          let singleSelectAnswer = [];
          singleSelectAnswer.push(data[questions[i].question].value)
          checkoutFormAnswers.push(singleSelectAnswer);
        } else if (questions[i].type === 'text') {
          let textAnswer = [];
          textAnswer.push(data[questions[i].question])
          checkoutFormAnswers.push(textAnswer);
        }
      }
    }
    return checkoutFormAnswers;
  }

  const onPaidTicketSubmit = async (data: any) => {
    const checkoutFormAnswers = generateQuestionAnswer(data);
    if (!agreeToTerms) {
      generateToast('Terms and condition is not checked', toast);
      return
    }
    const orderId = localStorage.getItem('orderId')
    if (!orderId) {
      generateToast('Order lost', toast);
      return
    }

    if (!billingAddress) {
      setStripeInputError({ message: 'Address is required' });
      return;
    }

    if (stripeInputError) {
      return
    }

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const shippingForm = {
      country: data.country,
      city: data.city,
      province: data.province,
      street: data.house,
      postalCode: data.postcode
    }

    const formForPaidTicket = {
      orderId,
      email: data.email,
      phone: data.phone,
      method: 'stripe',
      buyerName: data.fullName,
      billingAddress,
      shipping: shippingForm,
      affiliateCode: affiliate,
      checkoutForm: checkoutFormAnswers
    }
    await postPaymentToCrowdCore(formForPaidTicket, orderId as string, data)

  }

  const onFreeTicketSubmit = async (data: any) => {
    const checkoutFormAnswers = generateQuestionAnswer(data);
    if (!agreeToTerms) {
      generateToast('Terms and condition is not checked', toast);
      return
    }
    const orderId = localStorage.getItem('orderId')
    if (!orderId) {
      generateToast('Order lost', toast);
      return
    }

    const shippingForm = {
      country: data.country,
      city: data.city,
      province: data.province,
      street: data.house,
      postalCode: data.postcode
    }
    const formForFreeTicket = {
      orderId,
      email: data.email,
      phone: data.phone,
      method: 'free',
      buyerName: data.fullName,
      shipping: shippingForm,
      affiliateCode: affiliate,
      checkoutForm: checkoutFormAnswers
    }
    await postPaymentToCrowdCore(formForFreeTicket, orderId as string, data)
  };

  const onSelectCountryChange = async (data: any) => {
    setShippingCountry(data.value);
    const orderId = localStorage.getItem('orderId');
    if (orderId) {
      caculatePriceBreakDown(orderId,
        {
          cart: cart.items,
          discountCode: codeUsed || "",
          activityId: eventDataForCheckout?.id || "",
          shippingCountry: data.value
        });
    }
  }

  const onCountDownCompleted = async () => {
    const orderId = localStorage.getItem('orderId');
    if (orderId) {
      try {
        router.push({
          pathname: `/checkout/${eventDataForCheckout?.id}`,
          query: { clearcart: 'true' }
        });
      }
      catch (err) {
        console.log(err)
      }
      // rediect to first page will release the lock and clear localstorage,
      // no need to do it here
      /*  finally {
         localStorage.removeItem('orderId');
         localStorage.removeItem('activityId');
       } */
    }
  }

  const getEdtingTicketListItem = (t: CartTicketItem): TicketItemDataProps => {
    return ticketListState.find(item => item.id === t.ticketId) as TicketItemDataProps
  }

  const getEditingMerchListItem = (merch: CartMerchItem): MerchItemDataProps => {
    return merchListState.find(item => item.id === merch.merchId) as MerchItemDataProps;
  }

  const bundleDeleteHandler = async (t: CartBundleItem) => {
    decreaseBundleTicketAmount(
      getEdtingTicketListItem(t),
      filterBundleMerchForSelectedTicket(t.ticketId),
      dispatchTicketListAction,
      dispatchMerchListAction,
      t.quantity,
      removeItem,
      getPropertiesForMerchBundle(t.merchs),
      t.identifier)
  }

  const filterBundleMerchForSelectedTicket = (ticketId: string) => {
    return merchListState.filter(m => {
      if (m.tickets.includes(ticketId)) {
        return true
      }
    })
  }

  const getPropertiesForMerchBundle = (merchs: CartMerchItem[]): string[] => {
    // this list will contain all properties  (user cannot skip merch inside a bundle)
    return merchs.map(m => m.property);
  }

  const lockCheckoutTicketsHandle = async (orderItem: OrderItem) => {
    if (cart && cart.items && cart.items.merchItem.length && (cart.items.merchItem.map(m => m.shipping)).some(v => v === true)) {
      setShowShipping(true);
    }
    if (cart && cart.items && cart.items.bundleItem.length && cart.items.bundleItem.map(t => t.merchs.map(m => m.shipping).some(v => v === true)).some(v => v === true)) {
      setShowShipping(true);
    }
    try {
      const res = await lockCheckoutTickets(orderItem);
      if (res.orderId) {
        localStorage.setItem('orderId', res?.orderId);
      } else if (res.status === 'failed') {
        generateToast('Item(s) no longer available, please try again later', toast);
        router.push({
          pathname: `/checkout/${eventDataForCheckout?.id}`,
          query: { clearcart: 'true' }
        });
        return
      }
      setPriceBreakDown(res?.priceBreakDown)
    }
    catch (err) {
      console.log(err)
      generateToast('Unknown error, please contact us', toast);
      router.push(`/checkout/${eventDataForCheckout?.id}`);
    }
  }

  const caculatePriceBreakDown = async (orderId: string, orderItem: OrderItem) => {
    try {
      const res = await updateOrderFromCart(orderId, orderItem);
      setPriceBreakDown(res?.priceBreakDown);
    }
    catch (err) {
      // if server failed to calculate the price, return to first page
      generateToast('Unknown error, please contact us', toast);
      router.push(`/checkout/${eventDataForCheckout?.id}`);
      console.log(err)
    }
  }

  const getCheckoutFormQuestionFromServer = async (acid: string) => {
    try {
      const res: MappingQuestionsResponse[] = await getCheckoutFormQuestions(acid);
      if (res) {
        const mappingQuestions: any[] = res.map(question => ({
          type: question.type,
          isMandatory: question.isMandatory,
          appliedToTicketId: question.appliedToTicketId,
          questions: question.questions,
          definedAnswers: question.definedAnswers.map((a: any) => ({ value: a, label: a })),
        }))
        setCheckoutQuestions(mappingQuestions);
      }
    }
    catch (err) {
      generateToast('Unknown error about organizer questions, please contact us', toast);
      router.push(`/checkout/${eventDataForCheckout?.id}`);
      console.log(err)
    }
  }
  useEffect(() => {
    const orderId = localStorage.getItem('orderId');
    //const activityId = localStorage.getItem('activityId');
    if (eventDataForCheckout) {
      // redirect logic is handle in outer wrapper
      /* if (orderId) {
        if (activityId) {
          // releaseLock();
          console.log('Redirect to ac:', activityId);
          router.push(`/checkout/${activityId}`);
        } else {
          releaseLock();
          router.push(`https://happin.app`);
        }
      } else {
        router.push(`https://happin.app`);
      }
    } else { */
      if (!orderId) {
        localStorage.setItem('activityId', eventDataForCheckout.id);
        lockCheckoutTicketsHandle({
          cart: cart.items,
          discountCode: codeUsed || "",
          activityId: eventDataForCheckout?.id || "",
          shippingCountry: ""
        })
      }
    }

  }, []);

  useEffect(() => {
    const addPaypalScript = () => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${eventDataForCheckout?.default_currency}&disable-funding=credit,card`;
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    };
    if (!scriptLoaded) {
      addPaypalScript();
    }
  }, [scriptLoaded])

  useEffect(() => {
    const options = generateShippingOptions();
    setShippingOptions(options);
  }, []);

  useEffect(() => {
    if (eventDataForCheckout) {
      getCheckoutFormQuestionFromServer(eventDataForCheckout?.id);
    }
  }, []);


  useEffect(() => {
    // last item in cart deleted, go back to first page
    if (!cart.items.bundleItem.length && !cart.items.merchItem.length && !cart.items.ticketItem.length && eventDataForCheckout) {
      router.push(`/checkout/${eventDataForCheckout?.id}`);
      return
    }
    handleCartUpdateAndApplyPromoCode();

  }, [cart, codeUsed]);

  useEffect(() => {
    const questions = checkoutQuestions.map(q => q.questions);
    if (questions) {
      for (let i = 0; i < questions.length; i++) {
        // @ts-ignore
        if (isSubmitting && errors[questions[i]]) {
          generateToast(`Please enter all required information for organizer question`, toast);
          break;
        }
      }
    } else if (showShipping && formState.isSubmitting && (formState.errors.email || formState.errors.fullName || formState.errors.phone || formState.errors.province || formState.errors.city || formState.errors.country || formState.errors.postcode)) {
      generateToast(`Please enter all required information for shipping address`, toast);
    } else if (!showShipping && isSubmitting && (errors.email || errors.fullName || errors.phone)) {
      generateToast(`Please enter all required information`, toast);
    }
  }, [formState]);

  const postPaymentToCrowdCore = async (form: any, crowdcoreOrderId: string, data?: any) => {
    try {
      setIsProcessing(true);
      let result: any;
      if (chooseStripe) {
        // any following pay button click will use state client secret for strip api
        if (!clientSecret) {
          // acquire clientSecret
          result = await submitPayment(form);
        }
      } else {
        result = await submitPayment(form);
      }
      console.log('stripe method => post payment to crowdcore ', result);
      // after post payment, if it's stripe , need extra steps
      if (chooseStripe) {
        if (!clientSecret) {
          setClientSecret(result?.clientSecret)
        }
        if (stripe && elements) {
          const response = await stripe.confirmCardPayment((result?.clientSecret || clientSecret), {
            payment_method: {
              card: elements.getElement(CardElement) as StripeCardElement,
              billing_details: {
                name: data.fullName,
                address: {
                  line1: billingAddress
                }
              }
            },
            setup_future_usage: 'off_session',
            receipt_email: data.email
          })
          if (response.error) {
            throw response.error;
          }
          console.log('stripe confirmed payment, wait for crowdcore server confirm', response)
          await checkStripePaymentSuccess(crowdcoreOrderId)
        }
      } else {
        generateToast('Thank you, your order is placed', toast);
        localStorage.removeItem('orderId')
        localStorage.removeItem('activityId');
        if (openInApp) {
          postCloseMessageForApp()
        } else {
          setTimeout(() => {
            router.push(`https://happin.app/post/${eventDataForCheckout?.id}`)
          }, 1000)
        }
      }
    } catch (err) {
      if (err.type === 'card_error') {
        generateToast(err.message, toast)
      } else {
        generateToast('Unknown error, please contact us', toast)
      }
    } finally {
      setIsProcessing(false);
    }
  }

  /*   const handlePaymentError = (errCode: string) => {
      console.log('payment error: ', errCode)
      switch (errCode) {
        case 'incorrect_cvc':
          generateToast('Incorrect CVC code, please check your card input', toast)
          break;
        case 'incomplete_cvc':
          generateToast('Incomplete CVC code, please check your card input', toast)
          break;
        case 'incomplete_zip':
          generateToast('Incomplete ZIP code, please check your card input', toast)
          break;
        case 'expired_card':
          generateToast('Your card has expired.', toast)
          break;
        case 'card_declined':
          generateToast('Your card was declined.', toast)
          break;
        case 'processing_error':
          generateToast('An error occured while processing your card. Please try again later', toast)
        default:
          generateToast('Unknown error, please contact us', toast)
          break
      }
    } */

  const checkStripePaymentSuccess = async (crowdcoreOrderId: string) => {
    let retryTimes = 0
    try {
      while (retryTimes < 10) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const orderStatus = await getOrderStatus(crowdcoreOrderId)
        if (orderStatus.status === EOrderStatus.PAID) {
          setIsProcessing(false)
          generateToast('Thank you, your order is placed', toast);
          localStorage.removeItem('orderId');
          localStorage.removeItem('activityId');
          if (openInApp) {
            postCloseMessageForApp()
          } else {
            setTimeout(() => {
              router.push(`https://happin.app/post/${eventDataForCheckout?.id}`)
            }, 1000)
          }
          return
        } else if (orderStatus.status !== EOrderStatus.INPROGRESS) {
          setIsProcessing(false);
          generateToast('Failed to process order, please try again later', toast);
          router.push(`/checkout/${eventDataForCheckout?.id}`)
          return
        } else {
          console.log('Order status: ', orderStatus.status)
        }
        retryTimes += 1;
      }
      if (retryTimes === 10) {
        generateToast('Server time out, please try again later', toast);
        router.push(`/checkout/${eventDataForCheckout?.id}`)
      }
    } catch (err) {
      console.log(err);
    }
  }

  const postCloseMessageForApp = () => {
    const passJson = { action: 'purchase-ticket-success' };
    if ((window as any).webkit) {
      (window as any).webkit.messageHandlers.jsHandler.postMessage(JSON.stringify(passJson));
    }
    if ((window as any).happinAndroid) {
      (window as any).happinAndroid.doAction('purchase-ticket-success', JSON.stringify(passJson));
    }
    window.parent.postMessage(passJson, '*');
  }

  const generateShippingFormTemplate = () => {
    return (
      <>
        <div className="lg:col-span-3">
          <label htmlFor="country" className="form-label required">Country</label>
          <Controller
            name="country"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <Select
                styles={customStyles}
                options={shippingOptions}
                onChange={(val) => { onChange(val.value); onSelectCountryChange(val) }}
                onBlur={onBlur}
                selected={value}
              />
            )}
            rules={{
              required: true
            }}
          />
          {errors.country && (
            <div className="text-rose-500 text-sm mt-1">Country is required.</div>
          )}
        </div>
        <div className="lg:col-span-4">
          <label htmlFor="province" className="form-label required">State / Province</label>
          <input
            id="province"
            type="text"
            className="form-field"
            placeholder="State / Province"
            {...register('province', { required: true })}
          />
          {errors.province && (
            <div className="text-rose-500 text-sm mt-1">State / Province is required.</div>
          )}
        </div>
        <div className="lg:col-span-2">
          <label htmlFor="province" className="form-label required">Postcode</label>
          <input
            id="postcode"
            type="text"
            className="form-field"
            placeholder="Postcode"
            {...register('postcode', { required: true })}
          />
          {errors.postcode && (
            <div className="text-rose-500 text-sm mt-1">Postcode is required.</div>
          )}
        </div>
        <div className="lg:col-span-6">
          <label htmlFor="city" className="form-label required">Town / City</label>
          <input
            id="city"
            type="text"
            className="form-field"
            placeholder="Town / City"
            {...register('city', { required: true })}
          />
          {errors.city && (
            <div className="text-rose-500 text-sm mt-1">Town / City is required.</div>
          )}
        </div>
        <div className="lg:col-span-6">
          <label htmlFor="house" className="form-label">Street address</label>
          <div className="grid grid-cols-1 gap-2 lg:gap-5 lg:grid-cols-2">
            <div>
              <input
                id="house"
                type="text"
                className="form-field"
                placeholder="House number and street name"
                {...register('house')}
              />
            </div>
            <div>
              <input
                type="text"
                className="form-field"
                placeholder="Apartment, suite, unit, etc. (optional)"
                {...register('apartment')}
              />
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="checkout__page">
        <div className="flex flex-col md:h-full">
          <PaymentHead
            countdownCompleted={onCountDownCompleted}
          />
          <div className="md:flex-1 md:h-0 web-scroll overflow-y-auto">
            <div className="container">
              <div className="flex flex-col md:flex-row w-full py-2 md:py-8">
                {showShipping ?
                  <div className="md:flex-1 min-w-0">
                    <div className="lg:sticky lg:top-8 rounded-lg md:rounded-none bg-gray-900 md:bg-transparent p-4 sm:p-5 md:p-0">
                      <div className="sm:text-lg md:text-xl font-semibold mb-3">Shipping</div>
                      <form>
                        <div className="max-w-4xl mx-auto">
                          <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-6">
                            <div className="lg:col-span-3">
                              <label htmlFor="fullName" className="form-label required">Full name</label>
                              <input
                                defaultValue={userInfoFromUrl.displayname || user?.displayname || ''}
                                id="fullName"
                                type="text"
                                className="form-field"
                                placeholder="Full name"
                                {...register('fullName', { required: true })}
                              />
                              {errors.fullName && (
                                <div className="text-rose-500 text-sm mt-1">Full name is required.</div>
                              )}
                            </div>
                            <div className="lg:col-span-3">
                              <label htmlFor="email" className="form-label required">Email</label>
                              <input
                                defaultValue={userInfoFromUrl.email || user?.email || ''}
                                id="email"
                                type="email"
                                className="form-field"
                                placeholder="Email"
                                {...register('email', {
                                  required: true,
                                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                                })}
                              />
                              {errors.email && errors.email.type === 'required' && (
                                <div className="text-rose-500 text-sm mt-1">Email is required.</div>
                              )}
                              {errors.email && errors.email.type === 'pattern' && (
                                <div className="text-rose-500 text-sm mt-1">Email is invalid.</div>
                              )}
                            </div>
                            <div className="lg:col-span-3">
                              <label htmlFor="tel" className="form-label required">Phone number</label>
                              <input
                                defaultValue={userInfoFromUrl.phonenumber || user?.phonenumber || ''}                            
                                id="tel"
                                type="tel"
                                className="form-field"
                                placeholder="Phone number"
                                {...register('phone', { required: true })}
                              />
                              {errors.phone && (
                                <div className="text-rose-500 text-sm mt-1">Phone number is required.</div>
                              )}
                            </div>
                            {generateShippingFormTemplate()}
                            <div className="lg:col-span-6 sm:text-lg md:text-xl font-semibold">Organizer questions:</div>
                            {checkoutQuestions && checkoutQuestions.map(q => {
                              if (q.type === 'singleSelect') {
                                return (
                                  <div key={q.questions} className="lg:col-span-6">
                                    <div className={"font-semibold mb-2 " + (q.isMandatory ? "required" : "")}>{q.questions}</div>
                                    <Controller
                                      name={q.questions}
                                      control={control}
                                      render={({ field: { onChange, onBlur, value } }) => (
                                        <Select
                                          styles={customStyles}
                                          options={q.definedAnswers}
                                          onChange={(val) => { onChange(val) }}
                                          onBlur={onBlur}
                                          selected={value}
                                        />
                                      )}
                                      rules={
                                        { required: q.isMandatory }
                                      }
                                    />
                                    {/*
                                           // @ts-ignore */}
                                    {errors[q.questions] && (
                                      <div className="text-rose-500 text-sm mt-1">This question is required.</div>
                                    )}
                                  </div>
                                )
                              }
                              if (q.type === 'multipleSelect') {
                                return (
                                  <div key={q.questions} className="lg:col-span-6">
                                    <div className={"font-semibold mb-2 " + (q.isMandatory ? "required" : "")}>{q.questions}</div>
                                    <Controller
                                      name={q.questions}
                                      control={control}
                                      render={({ field: { onChange, onBlur, value } }) => (
                                        <Select
                                          styles={customStyles}
                                          isMulti={true}
                                          options={q.definedAnswers}
                                          onChange={(val) => { onChange(val) }}
                                          onBlur={onBlur}
                                          selected={value}
                                        />
                                      )}
                                      rules={
                                        { required: q.isMandatory }
                                      }
                                    />
                                    {/*
                                           // @ts-ignore */}
                                    {errors[q.questions] && (
                                      <div className="text-rose-500 text-sm mt-1">This question is required.</div>
                                    )}
                                  </div>
                                )
                              }
                              if (q.type === 'text') {
                                return (
                                  <div key={q.questions} className="lg:col-span-6">
                                    <div className={"font-semibold mb-2 " + (q.isMandatory ? "required" : "")}>{q.questions}</div>
                                    <Controller
                                      name={q.questions}
                                      control={control}
                                      render={({ field: { onChange, value } }) => (
                                        <textarea
                                          className="form-field"
                                          onChange={(val) => { onChange(val) }}
                                          rows={3}
                                          placeholder="Please enter"
                                          value={value}
                                        />
                                      )}
                                      rules={
                                        { required: q.isMandatory }
                                      }
                                    />
                                    {/*
                                           // @ts-ignore */}
                                    {errors[q.questions] && (
                                      <div className="text-rose-500 text-sm mt-1">This question is required.</div>
                                    )}
                                  </div>
                                )
                              }
                            })}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  :
                  <div className="md:flex-1 min-w-0">
                    <div className="lg:sticky lg:top-8 rounded-lg md:rounded-none bg-gray-900 md:bg-transparent p-4 sm:p-5 md:p-0">
                      <div className="sm:text-lg md:text-xl font-semibold mb-3">Buyer Information</div>
                      <form>
                        <div className="max-w-4xl mx-auto">
                          <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-6">
                            <div className="lg:col-span-6">
                              <label htmlFor="fullName" className="form-label required">Full name</label>
                              <input
                                defaultValue={userInfoFromUrl?.displayname || user?.displayname || ''}
                                id="fullName"
                                type="text"
                                className="form-field"
                                placeholder="Full name"
                                {...register('fullName', { required: true })}
                              />
                              {errors.fullName && (
                                <div className="text-rose-500 text-sm mt-1">Full name is required.</div>
                              )}
                            </div>
                            <div className="lg:col-span-6">
                              <label htmlFor="email" className="form-label required">Email</label>
                              <input
                                defaultValue={userInfoFromUrl?.email || user?.email || ''}
                                id="email"
                                type="email"
                                className="form-field"
                                placeholder="Email"
                                {...register('email', {
                                  required: true,
                                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                                })}
                              />
                              {errors.email && errors.email.type === 'required' && (
                                <div className="text-rose-500 text-sm mt-1">Email is required.</div>
                              )}
                              {errors.email && errors.email.type === 'pattern' && (
                                <div className="text-rose-500 text-sm mt-1">Email is invalid.</div>
                              )}
                            </div>
                            <div className="lg:col-span-6">
                              <label htmlFor="tel" className="form-label required">Phone number</label>
                              <input
                                defaultValue={userInfoFromUrl?.phonenumber || user?.phonenumber || ''}                              
                                id="tel"
                                type="tel"
                                className="form-field"
                                placeholder="Phone number"
                                {...register('phone', { required: true })}
                              />
                              {errors.phone && (
                                <div className="text-rose-500 text-sm mt-1">Phone number is required.</div>
                              )}
                            </div>
                            {checkoutQuestions && checkoutQuestions.map(q => {
                              if (q.type === 'singleSelect') {
                                return (
                                  <div key={q.questions} className="lg:col-span-6">
                                    <div className={"font-semibold mb-2 " + (q.isMandatory ? "required" : "")}>{q.questions}</div>
                                    <Controller
                                      name={q.questions}
                                      control={control}
                                      render={({ field: { onChange, onBlur, value } }) => (
                                        <Select
                                          styles={customStyles}
                                          options={q.definedAnswers}
                                          onChange={(val) => { onChange(val) }}
                                          onBlur={onBlur}
                                          selected={value}
                                        />
                                      )}
                                      rules={
                                        { required: q.isMandatory }
                                      }
                                    />
                                    {/*
                                           // @ts-ignore */}
                                    {errors[q.questions] && (
                                      <div className="text-rose-500 text-sm mt-1">This question is required.</div>
                                    )}
                                  </div>
                                )
                              }
                              if (q.type === 'multipleSelect') {
                                return (
                                  <div key={q.questions} className="lg:col-span-6">
                                    <div className={"font-semibold mb-2 " + (q.isMandatory ? "required" : "")}>{q.questions}</div>
                                    <Controller
                                      name={q.questions}
                                      control={control}
                                      render={({ field: { onChange, onBlur, value } }) => (
                                        <Select
                                          styles={customStyles}
                                          isMulti={true}
                                          options={q.definedAnswers}
                                          onChange={(val) => { onChange(val) }}
                                          onBlur={onBlur}
                                          selected={value}
                                        />
                                      )}
                                      rules={
                                        { required: q.isMandatory }
                                      }
                                    />
                                    {/*
                                           // @ts-ignore */}
                                    {errors[q.questions] && (
                                      <div className="text-rose-500 text-sm mt-1">This question is required.</div>
                                    )}
                                  </div>
                                )
                              }
                              if (q.type === 'text') {
                                return (
                                  <div key={q.questions} className="lg:col-span-6">
                                    <div className={"font-semibold mb-2 " + (q.isMandatory ? "required" : "")}>{q.questions}</div>
                                    <Controller
                                      name={q.questions}
                                      control={control}
                                      render={({ field: { onChange, value } }) => (
                                        <textarea
                                          className="form-field"
                                          onChange={(val) => { onChange(val) }}
                                          rows={3}
                                          placeholder="Please enter"
                                          value={value}
                                        />
                                      )}
                                      rules={
                                        { required: q.isMandatory }
                                      }
                                    />
                                    {/*
                                           // @ts-ignore */}
                                    {errors[q.questions] && (
                                      <div className="text-rose-500 text-sm mt-1">This question is required.</div>
                                    )}
                                  </div>
                                )
                              }
                            })}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                }
                <div className="payment--cart">
                  <div className="rounded-lg bg-gray-900 mb-5">
                    <div className="divide-y divide-white divide-opacity-10">
                      <div className="py-2 sm:py-3 sm:px-1">
                        <div className="text-lg font-semibold px-4 py-1">Your cart</div>
                        {cart.items.ticketItem && cart.items.ticketItem.map(t => {
                          return (
                            <div className="flex p-4" key={t.ticketId}>
                              <div className="w-16 h-16 rounded-md overflow-hidden">
                                <img className="w-full h-full object-cover" src={eventDataForCheckout?.cover.startsWith('https') ? eventDataForCheckout.cover : 'https://images.chumi.co/' + eventDataForCheckout?.cover} alt='' />
                              </div>
                              <div className="flex-1 min-w-0 ml-4 flex flex-col">
                                <div className="flex items-start mb-2">
                                  <div className="text-white text-sm font-semibold w-2/3">{t.name}</div>
                                  <div className="text-white font-bold w-1/3 text-right whitespace-nowrap">{currencyFormatter(eventDataForCheckout?.default_currency as string).format(t.price * t.quantity)}</div>
                                </div>
                                <div className="flex items-end justify-between flex-1">
                                  <div className="flex items-center">
                                    <NumberInput
                                      min={0}
                                      max={t.quantity}
                                      value={t.quantity || 0}
                                      size="sm"
                                      isDisabled={true}
                                    />
                                  </div>
                                  <div onClick={() => { deleteTicketFromCart(getEdtingTicketListItem(t), t.quantity, dispatchTicketListAction, removeItem) }}
                                    className="relative flex items-center justify-center w-8 h-8 text-gray-400 rounded-full cursor-pointer bg-gray-800 hover:bg-gray-700 hover:text-white transition">
                                    <Delete theme="outline" size="14" fill="currentColor" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })
                        }
                        {cart.items.merchItem.map(m => {
                          return (
                            <div className="flex p-4" key={m.identifier}>
                              <div className="w-16 h-16 rounded-md overflow-hidden">
                                <img className="w-full h-full object-cover" src={m.image[0]} alt={m.name} />
                              </div>
                              <div className="flex-1 min-w-0 ml-4 flex flex-col">
                                <div className="flex items-start mb-2">
                                  <div className="text-white text-sm font-semibold w-2/3">({m.property}) {m.name}</div>
                                  <div className="text-white font-bold w-1/3 text-right whitespace-nowrap">{currencyFormatter(eventDataForCheckout?.default_currency as string).format(m.price * m.quantity)}</div>
                                </div>
                                <div className="flex items-end justify-between flex-1">
                                  <div className="flex items-center">
                                    <NumberInput
                                      min={0}
                                      max={m.quantity}
                                      value={m.quantity || 0}
                                      size="sm"
                                      isDisabled={true}
                                    />
                                  </div>
                                  <div onClick={() => { deleteMerchFromCart(getEditingMerchListItem(m), m.quantity, m.property, dispatchMerchListAction, removeItem) }}
                                    className="relative flex items-center justify-center w-8 h-8 text-gray-400 rounded-full cursor-pointer bg-gray-800 hover:bg-gray-700 hover:text-white transition">
                                    <Delete theme="outline" size="14" fill="currentColor" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                        {cart.items.bundleItem && cart.items.bundleItem.map(t => {
                          return (
                            <div className="flex p-4" key={t.identifier}>
                              <div className="w-16 h-16 rounded-md overflow-hidden">
                                <img className="w-full h-full object-cover" src={eventDataForCheckout?.cover.startsWith('https') ? eventDataForCheckout.cover : 'https://images.chumi.co/' + eventDataForCheckout?.cover} alt='' />
                              </div>
                              <div className="flex-1 min-w-0 ml-4 flex flex-col">
                                <div className="flex items-start mb-2">
                                  <div className="text-white text-sm font-semibold w-2/3">{t.name}</div>
                                  <div className="text-white font-bold w-1/3 text-right whitespace-nowrap">{currencyFormatter(eventDataForCheckout?.default_currency as string).format(t.price * t.quantity)}</div>
                                </div>
                                <div className="flex items-end justify-between flex-1">
                                  <div className="flex items-center">
                                    <NumberInput
                                      min={0}
                                      max={t.quantity}
                                      value={t.quantity || 0}
                                      size="sm"
                                      isDisabled={true}
                                    />
                                  </div>
                                  <div onClick={() => { bundleDeleteHandler(t) }}
                                    className="relative flex items-center justify-center w-8 h-8 text-gray-400 rounded-full cursor-pointer bg-gray-800 hover:bg-gray-700 hover:text-white transition">
                                    <Delete theme="outline" size="14" fill="currentColor" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })
                        }
                        {cart.items.bundleItem && cart.items.bundleItem.map(t => {
                          return (
                            <div className="flex p-4 text-white justify-between font-medium text-sm" key={t.identifier}>
                              {t.merchs && `Bundle items: `}
                              {t.merchs && t.merchs.map(m => (
                                <div key={m.identifier}>
                                  <div className="text-gray-300">{`${m.quantity} ${m.name}`}</div>
                                </div>
                              ))}
                            </div>
                          )
                        })
                        }
                      </div>
                      <div className="pt-4 pb-4 sm:pb-5 px-4 sm:px-5">
                        <div className="sm:text-lg font-semibold mb-4">Discount Code</div>
                        <div className="flex">
                          <input
                            disabled={(codeUsed && !promoteCode) ? true : false}
                            onChange={(e) => {
                              const trimmed = e.target.value.trim()
                              setPromoteCode(trimmed)
                            }}
                            value={codeUsed || promoteCode}
                            type="text"
                            className="block w-full px-4 h-11 font-medium text-sm rounded-lg bg-gray-700 focus:bg-gray-600 text-white transition placeholder-gray-500 mr-3" placeholder="Discount Code" />
                          <button
                            onClick={ApplyPromoCode}
                            disabled={validateCodeLoading}
                            className="btn btn-rose !py-0 sm:w-32 h-11 !text-sm !font-semibold">{(codeUsed && !promoteCode) ? 'Applied' : validateCodeLoading ? 'Processing...' : 'Apply'}
                          </button>
                        </div>
                      </div>

                      <div className="px-4 sm:px-5 divide-y divide-white divide-opacity-10">
                        <div className="text-white font-medium text-sm py-4">
                          {cart.items.ticketItem && cart.items.ticketItem.map(t => {
                            return (
                              <div className="flex justify-between py-1" key={t.ticketId}>
                                <div className="text-gray-300">{`${t.quantity} x ${t.name}`}</div>
                                <div>{currencyFormatter(eventDataForCheckout?.default_currency as string).format(t.price * t.quantity)}</div>
                              </div>
                            )
                          })
                          }
                          {cart.items.merchItem && cart.items.merchItem.map(m => {
                            return (
                              <div className="flex justify-between py-1" key={m.identifier}>
                                <div className="text-gray-300">{`${m.quantity} x ${m.name}`}</div>
                                <div>{currencyFormatter(eventDataForCheckout?.default_currency as string).format(m.price * m.quantity)}</div>
                              </div>
                            )
                          })
                          }
                          {cart.items.bundleItem && cart.items.bundleItem.map(t => {
                            return (
                              <div className="flex justify-between py-1" key={t.identifier}>
                                <div className="text-gray-300">{`${t.quantity} x ${t.name}`} </div>
                                <div>{currencyFormatter(eventDataForCheckout?.default_currency as string).format(t.price * t.quantity)}</div>
                              </div>
                            )
                          })
                          }
                          {cart.items.bundleItem && cart.items.bundleItem.map(t => {
                            return (
                              <div className="text-white font-medium text-sm py-4" key={t.identifier}>
                                {t.merchs && `Bundle items: `}
                                {t.merchs && t.merchs.map(m => (
                                  <div key={m.identifier}>
                                    <div className="text-gray-300">{`${m.quantity} ${m.name}`}</div>
                                  </div>
                                ))}
                              </div>
                            )
                          })
                          }
                        </div>
                        <div className="text-gray-100 font-medium text-sm py-4">
                          <div className="flex justify-between py-1">
                            <div className="text-gray-300">Sub-total</div>
                            <div>{currencyFormatter(eventDataForCheckout?.default_currency as string).format((priceBreakDown?.faceValue || 0) / 100)}</div>
                          </div>
                          <div className="flex justify-between py-1">
                            <div className="text-gray-300">Service Fee</div>
                            <div>{currencyFormatter(eventDataForCheckout?.default_currency as string).format(((priceBreakDown?.stripeFee + priceBreakDown?.happinProcessFee) || 0) / 100)}</div>
                          </div>
                          {
                            priceBreakDown?.extraChargeDetails?.map((detail: { title: string, amount: number; }) => {
                              return (
                                <div className="flex justify-between py-1" key={detail.title}>
                                  <div className="text-gray-300">{detail.title}</div>
                                  <div>{currencyFormatter(eventDataForCheckout?.default_currency as string).format((detail.amount || 0) / 100)}</div>
                                </div>
                              );
                            }
                            )
                          }
                          {showShipping && <div className="flex justify-between py-1">
                            <div className="text-gray-300">Shipping</div>
                            <div>{currencyFormatter(eventDataForCheckout?.default_currency as string).format((priceBreakDown?.shippingCost || 0) / 100)}</div>
                          </div>
                          }
                          <div className="flex justify-between py-1">
                            <div className="text-gray-300">Sales Tax</div>
                            <div>{currencyFormatter(eventDataForCheckout?.default_currency as string).format((priceBreakDown?.tax || 0) / 100)}</div>
                          </div>
                          {priceBreakDown?.discount ? <div className="flex justify-between py-1">
                            <div className="text-gray-300">Discount</div>
                            <div>{currencyFormatter(eventDataForCheckout?.default_currency as string).format((priceBreakDown?.discount || 0) / 100)}</div>
                          </div> : <></>
                          }
                        </div>
                        <div className="flex justify-between text-white py-4 font-semibold text-lg sm:text-xl">
                          <div>Total</div>
                          <div>{currencyFormatter(eventDataForCheckout?.default_currency as string).format((priceBreakDown?.total || 0) / 100)}</div>
                        </div>
                      </div>
                    </div>

                    {/* not showing this block if subtotal is 0 after server calculation */}
                    {(priceBreakDown && priceBreakDown.total) ?
                      (<>
                        <div className="rounded-lg bg-gray-900 mb-5">
                          <div className="p-4 sm:p-5">
                            <div className="flex items-center justify-between mb-4">
                              <div className="font-semibold sm:text-lg">Payment</div>
                              <HStack>
                                <img className="h-5" src="/images/amex-sm.svg" alt="amex" />
                                <img className="h-5" src="/images/mastercard-sm.svg" alt="mastercard" />
                                <img className="h-5" src="/images/visa-sm.svg" alt="visa" />
                              </HStack>
                            </div>
                            {chooseStripe ? (
                              <CheckoutForm error={stripeInputError} setError={setStripeInputError} address={billingAddress} setAddress={setBillingAddress}></CheckoutForm>
                            ) : <button onClick={() => setChooseStripe(true)} className="btn btn-white w-full">
                              Pay With Credit Card
                            </button>}
                            {!chooseStripe &&
                              <>
                                {(scriptLoaded && eventDataForCheckout?.paymentMethod.includes('PayPal')) &&
                                  <>
                                    <div className="divider-words">OR</div>
                                    <PayPalButton
                                      createOrder={(data: any, actions: any) => createPayPalOrder(data, actions)}
                                      onApprove={(data: any, actions: any) => onPayPalApprove(data, actions)} />
                                  </>
                                }
                              </>
                            }

                            <div className="mt-5 text-center">
                              {generalTicketInfo?.refundPolicy && <p className="text-sm text-gray-400 mb-3">Refund Policy: {generalTicketInfo?.refundPolicy}</p>}
                              <Checkbox defaultIsChecked colorScheme="rose" size="md" value={agreeToTerms} onChange={() => { setAgreeToTerms(s => !s ? s = 1 : s = 0) }}>
                                <span className="text-sm text-gray-400">I agree to the website <a rel="noreferrer" target='_blank' href="https://happin.app/terms" className="text-gray-300 underline hover:text-white transition">Terms and Conditions</a></span>
                              </Checkbox>
                            </div>
                          </div>
                        </div>
                        {chooseStripe && (
                          <>
                            <button className="btn btn-rose w-full !rounded-full !font-semibold hidden sm:block" onClick={() => { handleSubmit(onPaidTicketSubmit)() }}>Place Order</button>
                            <div className="fixed bottom-0 left-0 right-0 z-10 bg-gray-800 sm:hidden">
                              <button className="btn btn-rose w-full !py-4 !rounded-none !font-semibold" onClick={() => { handleSubmit(onPaidTicketSubmit)() }}>Place Order</button>
                            </div>
                          </>
                        )}

                      </>) : (priceBreakDown && priceBreakDown.total === 0) ?
                        (
                          <>
                            <div className="mt-5 text-center">
                              {generalTicketInfo?.refundPolicy && <p className="text-sm text-gray-400 mb-3">Refund Policy: {generalTicketInfo?.refundPolicy}</p>}
                              <Checkbox defaultIsChecked colorScheme="rose" size="md" value={agreeToTerms} onChange={() => { setAgreeToTerms(s => !s ? s = 1 : s = 0) }}>
                                <span className="text-sm text-gray-400">I agree to the website <a rel="noreferrer" target='_blank' href="https://happin.app/terms" className="text-gray-300 underline hover:text-white transition">Terms and Conditions</a></span>
                              </Checkbox>
                            </div>
                            <br></br>
                            <div className="h-12 sm:hidden" />
                            <button form="stripe-form" className="btn btn-rose w-full !rounded-t-none !rounded-b-lg !font-semibold hidden sm:block" onClick={() => { handleSubmit(onFreeTicketSubmit)() }}>Place Order</button>
                            <div className="fixed bottom-0 left-0 right-0 z-10 bg-gray-800 sm:hidden">
                              <button form="stripe-form" className="btn btn-rose w-full !py-4 !rounded-none !font-semibold" onClick={() => { handleSubmit(onFreeTicketSubmit)() }}>Place Order</button>
                            </div>
                          </>
                        ) : <></>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Transition appear show={isPorcessing} as={Fragment}>
        <Dialog
          initialFocus={focusButtonRef}
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
                <div className="relative flex items-center justify-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg sm:text-xl font-bold leading-6 text-white"
                  >
                    <span className="text-rose-500">We are processing your order...</span>
                  </Dialog.Title>
                </div>
                {/* dialog needs a element to focus, */}
                <button hidden={true} ref={focusButtonRef}></button>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );

};



const Payment = () => {
  const { eventDataForCheckout, cart, codeUsed } = useCheckoutState();
  const [stripeKey, setStripeKey] = useState<string>();
  const router = useRouter()
  useEffect(() => {
    if (eventDataForCheckout && eventDataForCheckout.stripeKey) {
      setStripeKey(eventDataForCheckout.stripeKey as string);
    }
  }, [eventDataForCheckout])


  useEffect(() => {
    const orderId = localStorage.getItem('orderId');
    const activityId = localStorage.getItem('activityId');
    if (!eventDataForCheckout) {
      if (orderId) {
        if (activityId) {
          // releaseLock();
          console.log('Redirect to ac:', activityId);
          router.push(`/checkout/${activityId}`);
        } else {
          releaseLock();
          router.push(`https://happin.app`);
        }
      } else {
        router.push(`https://happin.app`);
      }
    }
  }, []);

  return (
    <>
      {
        stripeKey &&
        <Elements stripe={loadStripe(stripeKey as string)} >
          <PaymentInner >
          </PaymentInner>
        </Elements>
      }
    </>
  )
}

export default Payment;
