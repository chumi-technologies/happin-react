import React, { useState, useMemo  } from 'react';
import { useForm, Controller  } from 'react-hook-form';
import NumberInput from '@components/reusable/NumberInput';
import PaymentHead from '@components/page_components/PaymentPageComponents/PaymentHead';
import { Delete } from '@icon-park/react';
import { Checkbox, CheckboxGroup, HStack, Radio, RadioGroup, Stack } from '@chakra-ui/react';
import Link from 'next/link';
import { StringOrNumber } from '@chakra-ui/utils/dist/types/types';
import { useEffect } from 'react';
import { useCheckoutState } from 'contexts/checkout-state';
import moment from 'moment';
import { currencyFormatter } from '../../../components/page_components/CheckoutPageComponents/util/currencyFormat';
import { CartTicketItem, TicketItemDataProps, CartBundleItem, CartMerchItem, OrderItem } from '../../../lib/model/checkout';
import {useRouter} from 'next/router';
import { useToast } from '@chakra-ui/react';
import Select from "react-select";
import countryList from 'react-select-country-list';
import { deleteTicketFromCart } from '../../../components/page_components/CheckoutPageComponents/util/deleteInput';
import { decreaseBundleTicketAmount } from '../../../components/page_components/CheckoutPageComponents/util/decreseInput';
import { generateToast } from '../../../components/page_components/CheckoutPageComponents/util/toast';
import { validateCode, lockCheckoutTickets } from '../../../lib/api';

type FormData = {
  email: string;
  country: string;
  fullName: string;
  phone: string;
  city: string;
  house: string;
  apartment: string;
  province: string;
  postcode: string;
  message: string;
  radio: string;
  radio2: string;
  checkbox: StringOrNumber[];
  textarea: string;
};

const Payment = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
  } = useForm<FormData>();


  const options = useMemo(() => countryList().getData(), [])
  const router = useRouter();
  const toast = useToast()

  const { eventDataForCheckout, cart, codeUsed, setCodeUsed, dispatchTicketListAction,dispatcMerchListAction, removeItem, ticketListState, merchListState} = useCheckoutState();
  const [ promoCode, setPromoCode ] = useState<string>('');
  const [ validateCodeLoading, setValidateCodeLoading ] = useState<boolean>(false);

  const ApplyPromoCode = async (e:any)=> {
    try {
      setValidateCodeLoading(true)
      const res= await validateCode(eventDataForCheckout?.id as string, promoCode as string)
      if (res.valid) {
        generateToast('Promo code applied', toast);
        setCodeUsed(promoCode);
      } else {
        generateToast('Invalid code', toast)
        return;
      }      
    } catch(err) {
      console.log(err)
    } finally {
      setValidateCodeLoading(false)
    }
  }

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  const onSelectCountryChange =  async (data:any) => {
    console.log(data);
  } 

  const getEdtingTicketListItem = (t: CartTicketItem): TicketItemDataProps => {
    return ticketListState.find(item => item.id === t.ticketId) as TicketItemDataProps
  }

  const bundleDeleteHandler = (t: CartBundleItem) => {
    decreaseBundleTicketAmount(
      getEdtingTicketListItem(t),
      filterBundleMerchForSelectedTicket(t.ticketId),
      dispatchTicketListAction,
      dispatcMerchListAction,
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

  useEffect(() => {
    // lock the payment and set timer
        lockCheckoutTicketsAndSetTimer({
          cart: cart.items,
          discountCode: codeUsed || "",
          activityId: eventDataForCheckout?.id || ""
      });    
  }, []);

  const lockCheckoutTicketsAndSetTimer = async (orderItem: OrderItem)=> {
      try {
        const reqBody = {
          cart: cart.items,
          discountCode: codeUsed || "",
          activityId: eventDataForCheckout?.id
      }
      const res = await lockCheckoutTickets(reqBody);
      console.log('start 7 minutes timer');
      console.log(res?.orderId,'order ID');
      }
      catch (err) {
        console.log(err)
      }
  }

  useEffect(() => {
    register('checkbox');
  }, [register]);

  console.log(cart,'cart')
  console.log(eventDataForCheckout,"eventDataForCheckout")

  return (
    <div className="checkout__page">
      <div className="flex flex-col h-full">
        <PaymentHead/>
        <div className="flex-1 h-0 web-scroll overflow-y-auto">
          <div className="container">
            <div className="flex flex-col md:flex-row w-full py-2 md:py-8">
              <div className="md:hidden">
                <div className="font-semibold min-w-0 block md:hidden pb-3 mb-3 border-b border-solid border-white border-opacity-20">
                  <div className="text-lg leading-5 mb-1">{eventDataForCheckout?.title}</div>
                  <div className="truncate text-sm text-yellow-500">Event starts on {moment(eventDataForCheckout?.startTime).format('MMMM Do, h:mma')}</div>
                </div>
                <div className="text-sm text-gray-300 mb-5">Please check out within <span className="font-medium text-white">5 minutes 51 seconds</span>.</div>
              </div>
              <div className="md:flex-1 min-w-0">
                <div className="lg:sticky lg:top-8 rounded-lg md:rounded-none bg-gray-900 md:bg-transparent p-4 sm:p-5 md:p-0">
                  <div className="sm:text-lg md:text-xl font-semibold mb-3">Shipping</div>
                  <form>
                    <div className="max-w-4xl mx-auto">
                      <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-6">
                        <div className="lg:col-span-3">
                          <label htmlFor="fullName" className="form-label required">Full name</label>
                          <input
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
                            id="email"
                            type="email"
                            className="form-field"
                            placeholder="Email"
                            {...register('email', { required: true,
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
{/*                        <div className="lg:col-span-3">
                          <label htmlFor="country" className="form-label required">Country</label>
                          <input
                            id="country"
                            type="text"
                            className="form-field"
                            placeholder="Country"
                            {...register('country',{ required: true })}
                          />
                        </div>*/}
                        <div className="lg:col-span-3">
                        <label htmlFor="country" className="form-label required">Country</label>
                        <Controller
                            name="country"
                            control={control}
                            render={({ field: { onChange, onBlur, value} }) => (
                                      <Select
                                        options={options}
                                        onChange={onSelectCountryChange}
                                        onBlur={onBlur}
                                        selected={value}
                                      />
                                    )}
                            rules={{
                            required: true
                          }}
                        />
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
                        <div className="lg:col-span-6 sm:text-lg md:text-xl font-semibold">Organizer questions:</div>
                        <div className="lg:col-span-6">
                          <div className="font-semibold mb-2">1. General Admission Livestream Tickets</div>
                          <RadioGroup defaultValue="1" colorScheme="rose">
                            <Stack className="radio-pointer text-gray-300">
                              <Radio value="radio1" {...register('radio')}>
                                <span className="text-sm">Radio 1</span>
                              </Radio>
                              <Radio value="radio2" {...register('radio')}>
                                <span className="text-sm">Radio 2</span>
                              </Radio>
                            </Stack>
                          </RadioGroup>
                        </div>
                        <div className="lg:col-span-6">
                          <div className="font-semibold mb-2">2. General Admission Livestream Tickets</div>
                          <RadioGroup defaultValue="1" colorScheme="rose">
                            <HStack className="radio-pointer text-gray-300">
                              <Radio value="radio1" {...register('radio2')}>
                                <span className="text-sm">Radio 1</span>
                              </Radio>
                              <Radio value="radio2" {...register('radio2')}>
                                <span className="text-sm">Radio 2</span>
                              </Radio>
                            </HStack>
                          </RadioGroup>
                        </div>
                        <div className="lg:col-span-6">
                          <div className="font-semibold mb-2">3. General Admission Livestream Tickets</div>
                          <CheckboxGroup
                            colorScheme="rose"
                            defaultValue={['checkbox01']}
                            onChange={(value) => {
                              setValue('checkbox', value)
                            }}
                          >
                            <Stack className="text-gray-300">
                              <Checkbox value="checkbox01">
                                <span className="text-sm">checkbox 1</span>
                              </Checkbox>
                              <Checkbox value="checkbox02">
                                <span className="text-sm">checkbox 2</span>
                              </Checkbox>
                            </Stack>
                          </CheckboxGroup>
                        </div>
                        <div className="lg:col-span-6">
                          <div className="font-semibold mb-2">4. General Admission Livestream Tickets</div>
                          <textarea
                            className="form-field"
                            rows={3}
                            placeholder="请输入"
                            {...register('textarea')}
                          />
                        </div>
                        {/*<label className="block">*/}
                        {/*  <span className="form-label">Industry Type</span>*/}
                        {/*  <OriginalSelect*/}
                        {/*    {...register('industry')}*/}
                        {/*    placeholder="Select Industry Type"*/}
                        {/*    options={*/}
                        {/*      [*/}
                        {/*        { value: 'Arts / Entertainment', text: 'Arts / Entertainment' },*/}
                        {/*        { value: 'Festivals', text: 'Festivals' },*/}
                        {/*        { value: 'Sports', text: 'Sports' },*/}
                        {/*        { value: 'Business Events / Conferences', text: 'Business Events / Conferences' },*/}
                        {/*        { value: 'Venues', text: 'Venues' },*/}
                        {/*        { value: 'Other', text: 'Other' }*/}
                        {/*      ]*/}
                        {/*    }*/}
                        {/*  />*/}
                        {/*</label>*/}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="payment--cart">
                <div className="rounded-lg bg-gray-900 mb-5">
                  <div className="divide-y divide-white divide-opacity-10">
                    <div className="py-2 sm:py-3 sm:px-1">
                      <div className="text-lg font-semibold px-4 py-1">Your cart</div>
                          { cart.items.bundleItem && cart.items.bundleItem.map(t => {
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
                                          />
                                        </div>
                                          {t.merchs && t.merchs.map(m => (
                                            <div key={m.identifier}>
                                              <div className="text-white text-sm font-semibold w-2/3">{`Bundle items: ${m.quantity} ${m.name}`}</div>
                                            </div>
                                          ))}
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
                    </div>
                    <div className="pt-4 pb-4 sm:pb-5 px-4 sm:px-5">
                      <div className="sm:text-lg font-semibold mb-4">Payment</div>
                      <div className="flex">
                        <input
                        defaultValue={codeUsed}
                        onChange={(e) => {
                              setPromoCode(e.target.value)
                        }}
                        type="text" 
                        className="block w-full px-4 h-11 font-medium text-sm rounded-lg bg-gray-700 focus:bg-gray-600 text-white transition placeholder-gray-500 mr-3" placeholder="Discount Code" />
                        <button 
                        onClick = {ApplyPromoCode}
                        className="btn btn-rose !py-0 sm:w-32 h-11 !text-sm !font-semibold">Apply                        
                        </button>                                           
                      </div>
                      <div className="sm:text-lg font-semibold mb-4">{validateCodeLoading? 'Processing...': ''}</div>
                    </div>

                    <div className="px-4 sm:px-5 divide-y divide-white divide-opacity-10">
                      <div className="text-white font-medium text-sm py-4">
                        { cart.items.bundleItem && cart.items.bundleItem.map(t => {
                          return (
                            <div className="flex justify-between py-1" key={t.identifier}>
                              <div className="text-gray-300">{`${t.quantity} x ${t.name}`} </div>
                                  {t.merchs && t.merchs.map(m => (
                                    <div key={m.identifier}>
                                          <div className="text-gray-300">{`Bundle items: ${m.quantity} ${m.name}`}</div>
                                      </div>
                                  ))}
                              <div>{currencyFormatter(eventDataForCheckout?.default_currency as string).format(t.price * t.quantity)}</div>
                            </div>
                          )
                          })
                        }
                        { cart.items.ticketItem && cart.items.ticketItem.map(t => {
                          return (
                            <div className="flex justify-between py-1" key={t.ticketId}>
                              <div className="text-gray-300">{`${t.quantity} x ${t.name}`}</div>
                              <div>{currencyFormatter(eventDataForCheckout?.default_currency as string).format(t.price * t.quantity)}</div>
                            </div>
                          )
                          })
                        }
                      </div>
                      <div className="text-gray-100 font-medium text-sm py-4">
                        <div className="flex justify-between py-1">
                          <div className="text-gray-300">Sub-total</div>
                          <div>{currencyFormatter(eventDataForCheckout?.default_currency as string).format(cart.subTotal)}</div>
                        </div>
                        <div className="flex justify-between py-1">
                          <div className="text-gray-300">Service Fee</div>
                          <div>CA$6.00</div>
                        </div>
                        <div className="flex justify-between py-1">
                          <div className="text-gray-300">Shipping</div>
                          <div>CA$0.00</div>
                        </div>
                        <div className="flex justify-between py-1">
                          <div className="text-gray-300">Sales Tax</div>
                          <div>CA$20.00</div>
                        </div>
                      </div>
                      <div className="flex justify-between text-white py-4 font-semibold text-lg sm:text-xl">
                        <div>Subtotal</div>
                        <div>CAD$225.98</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-gray-900 mb-5">
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-semibold sm:text-lg">Credit Card</div>
                      <HStack>
                        <img className="h-5" src="/images/amex-sm.svg" alt="amex" />
                        <img className="h-5" src="/images/mastercard-sm.svg" alt="mastercard" />
                        <img className="h-5" src="/images/visa-sm.svg" alt="visa" />
                      </HStack>
                    </div>
                    <input type="text" className="block w-full px-4 h-11 font-medium rounded-lg bg-gray-700 focus:bg-gray-600 text-white transition placeholder-gray-500" placeholder="Credit card number" />
                    <div className="divider-words">OR</div>
                    <button className="btn btn-white w-full">
                      <img className="h-5 mx-auto" src="/images/PayPal_logo.svg" alt="paypal" />
                    </button>
                    <div className="mt-5 text-center">
                      <Checkbox colorScheme="rose" size="md">
                        <span className="text-sm text-gray-400">I agree to the website <Link href="/"><a className="text-gray-300 underline hover:text-white transition">Terms and Conditions</a></Link></span>
                      </Checkbox>
                    </div>
                  </div>
                </div>
                <div className="h-12 sm:hidden" />
                <button className="btn btn-rose w-full !rounded-full !font-semibold hidden sm:block" onClick={handleSubmit(onSubmit)}>Place Order</button>
                <div className="fixed bottom-0 left-0 right-0 z-10 bg-gray-800 sm:hidden">
                  <button className="btn btn-rose w-full !py-4 !rounded-none !font-semibold" onClick={handleSubmit(onSubmit)}>Place Order</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
