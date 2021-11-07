import React, { useState } from "react";
import { Left } from '@icon-park/react';
import { Controller, useForm } from "react-hook-form";
import { Select, Spinner, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { getEventCategories, postEventToHappin } from "lib/api";
// @ts-ignore
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AutoComplete from "react-google-autocomplete";
import Upload from "rc-upload"
import { IThirdPartyEvent } from "pages/submit-event";
import { useRouter } from "next/router";

type FormData = {
  title: string;
  type: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: any;
  cover: string;
};

export default function ThirdPartyEvent({ thirdPartyEventData, setThirdPartyEventSubmit, setThirdPartyEventData, thirdPartyReadOnlyProps, setThirdPartyReadOnlyProps }:
  {
    thirdPartyEventData: IThirdPartyEvent,
    setThirdPartyEventSubmit: (arg: boolean) => void,
    setThirdPartyEventData: (arg: IThirdPartyEvent | undefined) => void,
    thirdPartyReadOnlyProps: string[],
    setThirdPartyReadOnlyProps: (arg: any) => void
  }) {
  const {
    register,
    handleSubmit,
    //formState,
    formState: { errors, isSubmitting },
    control,
    //getValues
  } = useForm<FormData>({ mode: 'all' });
  const router = useRouter();
  const [uploadingCover, setUploadingCover] = useState<boolean>(false);
  const [eventTags, setEventTags] = useState<string[]>();
  const [eventSubmitted, setEventSubmitted] = useState<boolean>(false);
  const [eventId, setEventId] = useState<string>();

  const toast = useToast();
  const generateToast = (message: string) => {
    toast({
      title: message,
      position: 'top',
      isClosable: true,
    })
  }

  useEffect(() => {
    getEventTags()
  }, [])

  const getEventTags = async () => {
    try {
      const response: any = await getEventCategories();
      console.log(response);
      setEventTags(Object.keys(response))
    } catch (err) {
      console.log(err)
    }
  }

  const onFormSubmit = async (data: FormData) => {
    //console.log(data);
    const formToSubmit = thirdPartyEventData;
    formToSubmit.cover = data.cover;
    formToSubmit.startDate = Math.round(data.startTime.getTime() / 1000);
    formToSubmit.endDate = Math.round(data.endTime.getTime() / 1000);
    formToSubmit.title = data.title;
    formToSubmit.content = data.description;
    formToSubmit.type = data.type;
    formToSubmit.subType = '';
    formToSubmit.images = [data.cover];
    delete formToSubmit.geo;
    if (typeof data.location === 'object') {
      const province = data.location.address_components.find((a: any) => a.types[0] === 'administrative_area_level_1');
      const adminAreaLevel2 = data.location.address_components.find((a: any) => a.types[0] === 'administrative_area_level_2');
      const locality = data.location.address_components.find((a: any) => a.types.includes('locality'));
      const country = data.location.address_components.find((a: any) => a.types.includes('country'));
      const city = locality || adminAreaLevel2;
      formToSubmit.state = province.short_name;
      formToSubmit.city = city.short_name;
      formToSubmit.country = country.short_name;
      formToSubmit.location = data.location.formatted_address
    }
    console.log(formToSubmit);
    try {
      const response = await postEventToHappin(formToSubmit);
      console.log(response);
      if(response.code === 9111000) {
        generateToast('Duplicate event');
        return
      }
      setEventId(response.data._id);
      setEventSubmitted(true);
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <div className="flex flex-col md:h-full">
        <div className="footer-action fixed bottom-0 right-0 left-0 sm:relative bg-gray-800 border-b border-solid border-gray-700 z-20">
          <div className="container">
            <div className="flex items-center py-3 sm:py-0 sm:h-20 ">
              <div className="flex items-center sm:flex-1 min-w-0">
                <button onClick={() => { setThirdPartyEventSubmit(false); setThirdPartyEventData(undefined), setThirdPartyReadOnlyProps(undefined) }} className="btn inline-flex items-center text-gray-300 hover:text-gray-50 !px-0 mr-5 md:mr-7">
                  <Left theme="outline" size="24" fill="currentColor" />
                </button>
                <div className="flex-1 font-semibold min-w-0 sm:block">
                  <div className="text-gray-50 text-center">Share third party event</div>
                </div>
              </div>

            </div>
          </div>
        </div>
        {eventSubmitted ? <>
          <div className="flex items-center justify-center" style={{ margin: 'auto' }}>
            <div className="mt-10 flex items-center justify-center" style={{ width: '80%', padding: '20px', flexDirection: 'column' }}>
              <h1 className="black-title text-base sm:text-xl text-gray-50 mt-1 sm:mt-3 text-center">Congrats! you just successfully submitted an event, the event group chat is automatically created under your
                moderation, please find it on your happin mobile app. {`Don't`} forget to share with your friends!
              </h1>
              <button onClick={() => { router.push(`/post/${eventId}`) }} style={{ width: '200px' }} className="btn btn-yellow !px-0 !font-semibold !rounded-full flex-1 mt-10" >
                <span className="text-sm sm:text-base">Check your event</span>
              </button>
            </div>
          </div>
        </> :
          <div className="md:flex-1 md:h-0 web-scroll h-full ">
            <div className="container">
              <div className="flex flex-col md:flex-row w-full py-2 md:py-8">
                <div className="md:flex-1 min-w-0">
                  <div className="lg:sticky lg:top-8 rounded-lg md:rounded-none bg-gray-900 md:bg-transparent p-4 sm:p-5 md:p-0">
                    <form>
                      <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-6">
                          <div className="lg:col-span-6">
                            <label htmlFor="title" className="form-label required">Title</label>
                            <Controller
                              name="title"
                              control={control}
                              defaultValue={thirdPartyEventData?.title || ''}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <input
                                  type="text"
                                  className="form-field"
                                  placeholder="Event Title"
                                  onBlur={onBlur}
                                  onChange={onChange}
                                  value={value}
                                  disabled={thirdPartyReadOnlyProps?.includes('title')}
                                />
                              )}
                              rules={{
                                required: true
                              }}
                            />

                            {errors.title && (
                              <div className="text-rose-500 text-sm mt-1">Title is required.</div>
                            )}
                          </div>
                          <div className="lg:col-span-6">
                            <label htmlFor="description" className="form-label required">Description</label>
                            <Controller
                              name="description"
                              control={control}
                              defaultValue={thirdPartyEventData?.content || ''}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <textarea
                                  disabled={thirdPartyReadOnlyProps?.includes('content')}
                                  id="description"
                                  rows={3}
                                  onChange={onChange}
                                  onBlur={onBlur}
                                  value={value}
                                  className="form-field"
                                  placeholder="Event Description"
                                />
                              )}
                              rules={{
                                required: true
                              }}
                            />
                            {errors.description && (
                              <div className="text-rose-500 text-sm mt-1">Description is required.</div>
                            )}

                          </div>

                          <div className="lg:col-span-3">
                            <label htmlFor="location" className="form-label">Event Address</label>
                            <Controller
                              name="location"
                              control={control}
                              defaultValue={thirdPartyEventData?.location || ''}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                  {thirdPartyReadOnlyProps?.includes('location') ?
                                    <input
                                      disabled
                                      value={thirdPartyEventData?.location || ''}
                                      className="form-field"
                                    />
                                    :
                                    <AutoComplete
                                      defaultValue={thirdPartyEventData?.location || ''}
                                      className="form-field"
                                      apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
                                      onBlur={onBlur}
                                      placeholder="Location not required if it's an online event"
                                      inputAutocompleteValue={value?.formatted_address || value}
                                      options={{ types: ['address'] }}
                                      onPlaceSelected={(place: any) => { onChange(place) }}
                                    />
                                  }
                                </>
                              )}
                            />
                          </div>

                          <div className="lg:col-span-3">
                            <label htmlFor="type" className="form-label required">Event Type</label>
                            <Controller
                              name="type"
                              control={control}
                              defaultValue={thirdPartyEventData?.type || ''}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                  {thirdPartyReadOnlyProps?.includes('type') ?
                                    <input
                                      disabled
                                      value={thirdPartyEventData?.type || ''}
                                      className="form-field"
                                    />
                                    :
                                    <Select
                                      iconColor={'#fff'}
                                      className="form-field"
                                      style={{ paddingTop: '0', marginTop: '6px', border: '2px solid #454545' }}
                                      selected={value} onBlur={onBlur}
                                      onChange={(val) => { onChange(val.target.value); }}
                                      placeholder="Select a type">
                                      {eventTags?.map(category => <option value={category} key={category}>{category}</option>)}
                                    </Select>
                                  }
                                </>
                              )}
                              rules={{
                                required: true
                              }}
                            />
                            {errors.type && (
                              <div className="text-rose-500 text-sm mt-1">Event type is required.</div>
                            )}
                          </div>

                          <div className="lg:col-span-6">
                            <label htmlFor="cover" className="form-label required">Event Cover</label>
                            <Controller
                              defaultValue={thirdPartyEventData?.cover || ''}
                              name="cover"
                              control={control}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <Upload
                                  disabled={thirdPartyReadOnlyProps?.includes('cover')}
                                  className='mt-2'
                                  onBlur={onBlur}
                                  action='https://api.crowdcore.com/prod/activity/uploadImage'
                                  type="drag" accept='image/*' style={{ display: 'block', borderRadius: '0.5rem', border: '2px #454545 dashed', height: 200 }}
                                  onSuccess={(file: any) => { setUploadingCover(false); onChange(file.location) }} onProgress={(_step: any, _file: any) => { setUploadingCover(true) }}>
                                  {!value && <div className="flex items-center h-full justify-center "><h1 className="black-title text-base sm:text-xl text-center p-5" style={{ color: '#454545' }}>Drag & drop or click to add image (JPEG, PNG)</h1></div>}
                                  {(value && !uploadingCover) && <div className="flex items-center h-full justify-center "><img className="h-full" style={{ padding: '10px' }} src={value.startsWith('https://') ? value : 'https://images.chumi.co/' + value} alt="" /></div>}
                                  {uploadingCover && <div className="flex items-center h-full justify-center "><Spinner size="xl" color="yellow"></Spinner></div>}
                                </Upload>
                              )}
                              rules={{
                                required: true
                              }}
                            />
                            {errors.cover && (
                              <div className="text-rose-500 text-sm mt-1">Event cover is required.</div>
                            )}
                          </div>



                          <div className="lg:col-span-3">
                            <label htmlFor="startTime" className="form-label required">Event Start Time</label>
                            <Controller
                              defaultValue={thirdPartyEventData?.startDate ? new Date(thirdPartyEventData?.startDate * 1000) : undefined}
                              name="startTime"
                              control={control}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <DatePicker disabled={thirdPartyReadOnlyProps?.includes('startDate')} dateFormat="Pp" onBlur={onBlur} className="form-field" showTimeSelect selected={value} onChange={(date: any) => { onChange(date); console.log(date) }} />
                              )}
                              rules={{
                                required: true
                              }}
                            />
                            {errors.startTime && (
                              <div className="text-rose-500 text-sm mt-1">Start time is required.</div>
                            )}
                          </div>

                          <div className="lg:col-span-3">
                            <label htmlFor="endTime" className="form-label required">Event End Time</label>
                            <Controller
                              defaultValue={thirdPartyEventData?.endDate ? new Date(thirdPartyEventData?.endDate * 1000) : undefined}
                              name="endTime"
                              control={control}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <DatePicker disabled={thirdPartyReadOnlyProps?.includes('endDate')} dateFormat="Pp" onBlur={onBlur} className="form-field" showTimeSelect selected={value} onChange={(date: any) => { onChange(date); console.log(date) }} />
                              )}
                              rules={{
                                required: true
                              }}
                            />
                            {errors.endTime && (
                              <div className="text-rose-500 text-sm mt-1">End time is required.</div>
                            )}
                          </div>
                          <div className="lg:col-span-6 event-submit__form">
                            <button disabled={isSubmitting} onClick={handleSubmit(onFormSubmit)} style={{ width: '100%' }} className="btn btn-yellow !px-0 !font-semibold !rounded-full flex-1 mt-10" >
                              <span className="text-sm sm:text-base">{isSubmitting ? 'Porcessing...' : 'Share event to Happin'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>

                  </div>
                </div>
              </div>
            </div>
          </div>}
      </div>
    </>
  )
}
