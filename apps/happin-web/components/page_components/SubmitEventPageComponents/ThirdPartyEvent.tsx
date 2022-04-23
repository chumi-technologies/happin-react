import React, { useState } from "react";
import { Left } from '@icon-park/react';
import { Controller, useForm } from "react-hook-form";
import { Button, Spinner, useToast } from '@chakra-ui/react';
import { useEffect } from "react";
import Select, { StylesConfig, ThemeConfig } from 'react-select';
import { getEventCategories, postEventToHappin } from "lib/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AutoComplete from "react-google-autocomplete";
import Upload from "rc-upload"
import { IThirdPartyEvent } from "pages/submit-event";
import { useRouter } from "next/router";
import GooglePlacesAutocomplete, { geocodeByPlaceId } from 'react-google-places-autocomplete';

type selectOption = {
  label: string;
  value: any;
}
type FormData = {
  title: string;
  type: selectOption | null;
  description: string;
  startTime: Date;
  endTime: Date;
  location: any;
  cover: string;
};

const selectStyles: StylesConfig<any, boolean> = {
  control: (provided, state) => ({
    ...provided,
    background: 'transparent',
    boxShadow: 'none',
    borderWidth: '2px',
    borderColor: state.isFocused ? '#808080' : '#454545',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    padding: '2px 12px'
  }),
  menu: (provided) => ({
    ...provided,
    background: '#222222'
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? '#fafafa' : '#e8e8e8',
    backgroundColor: state.isSelected ? '#454545' : (state.isFocused ? '#333' : 'transparent')
  }),
  multiValue: (provided) => ({
    ...provided,
    color: '#fafafa',
    backgroundColor: '#454545'
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: '#808080',
    ':hover': {
      color: '#e8e8e8',
    },
  }),
};
const selectTheme: ThemeConfig = theme => ({
  ...theme,
  borderRadius: 8,
  spacing: {
    ...theme.spacing,
    controlHeight: 44,
  },
  colors: {
    ...theme.colors,
    primary: '#808080',
    primary50: '#3d3d3d',
    neutral30: '#808080',
    neutral80: '#fafafa',
  }
});

export default function ThirdPartyEvent({
  thirdPartyEventData,
  setThirdPartyEventSubmit,
  setThirdPartyEventData,
  thirdPartyReadOnlyProps,
  setThirdPartyReadOnlyProps
}: {
    thirdPartyEventData: IThirdPartyEvent,
    setThirdPartyEventSubmit: (arg: boolean) => void,
    setThirdPartyEventData: (arg: IThirdPartyEvent | undefined) => void,
    thirdPartyReadOnlyProps: string[],
    setThirdPartyReadOnlyProps: (arg: any) => void
  }) {
  const {
    handleSubmit,
    formState: { errors, isSubmitting, isDirty, isValid },
    control,
  } = useForm<FormData>({
    defaultValues: {
      title: thirdPartyEventData.title || '',
      description: thirdPartyEventData.content || '',
      type: thirdPartyEventData.type === 'N/A' ? null : {
        value: thirdPartyEventData.type,
        label: thirdPartyEventData.type
      },
      startTime: thirdPartyEventData.startDate ? new Date(thirdPartyEventData.startDate * 1000) : undefined,
      endTime: thirdPartyEventData.endDate ? new Date(thirdPartyEventData.endDate * 1000) : undefined,
      location: thirdPartyEventData.location || '',
      cover: thirdPartyEventData.cover || '',
    },
    mode: 'all'
  });
  const router = useRouter();
  const [uploadingCover, setUploadingCover] = useState<boolean>(false);
  const [eventTags, setEventTags] = useState<selectOption[]>();
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
    (async () => {
      try {
        const res = await getEventCategories();
        const list = Object.keys(res).map(item => ({value: item, label: item}))
        setEventTags(list)
      } catch (err) {
        console.log(err)
      }
    })();
  }, [])

  const onFormSubmit = async (data: FormData) => {
    const terms = data.location.value.terms;
    const location = await geocodeByPlaceId(data.location.value.place_id);
    const form = {
      ...thirdPartyEventData,
      title: data.title,
      content: data.description,
      cover: data.cover,
      type: data.type!.value,
      subType: '',
      startDate: Math.round(data.startTime.getTime() / 1000),
      endDate: Math.round(data.endTime.getTime() / 1000),
      images: [data.cover],
      country: terms[3].value,
      state: terms[2].value,
      city: terms[1].value,
      street: terms[0].value,
      location: data.location.label,
      geo: [location[0].geometry.location.lng(), location[0].geometry.location.lat()]
    }
    // const formToSubmit = thirdPartyEventData;
    // formToSubmit.cover = data.cover;
    // formToSubmit.startDate = Math.round(data.startTime.getTime() / 1000);
    // formToSubmit.endDate = Math.round(data.endTime.getTime() / 1000);
    // formToSubmit.title = data.title;
    // formToSubmit.content = data.description;
    // formToSubmit.type = data.type?.value;
    // formToSubmit.subType = '';
    // formToSubmit.images = [data.cover];
    // delete formToSubmit.geo;
    // if (typeof data.location === 'object') {
    //   const province = data.location.address_components.find((a: any) => a.types[0] === 'administrative_area_level_1');
    //   const adminAreaLevel2 = data.location.address_components.find((a: any) => a.types[0] === 'administrative_area_level_2');
    //   const locality = data.location.address_components.find((a: any) => a.types.includes('locality'));
    //   const country = data.location.address_components.find((a: any) => a.types.includes('country'));
    //   const city = locality || adminAreaLevel2;
    //   formToSubmit.state = province.short_name;
    //   formToSubmit.city = city.short_name;
    //   formToSubmit.country = country.short_name;
    //   formToSubmit.location = data.location.formatted_address
    // }
    try {
      const response = await postEventToHappin(form);
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
                <button
                  onClick={() => {
                    setThirdPartyEventSubmit(false);
                    setThirdPartyEventData(undefined);
                    setThirdPartyReadOnlyProps(undefined);
                  }}
                  className="btn inline-flex items-center text-gray-300 hover:text-gray-50 !px-0 mr-5 md:mr-7">
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
          <div className="flex items-center justify-center mx-auto">
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                          <div className="lg:col-span-2">
                            <label htmlFor="title" className="form-label required">Title</label>
                            <Controller
                              name="title"
                              control={control}
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
                          <div className="lg:col-span-2">
                            <label htmlFor="description" className="form-label required">Description</label>
                            <Controller
                              name="description"
                              control={control}
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
                          <div>
                            <label htmlFor="location" className="form-label required">Event Location</label>
                            <Controller
                              name="location"
                              control={control}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <GooglePlacesAutocomplete
                                  apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
                                  apiOptions={{ language: 'en' }}
                                  autocompletionRequest={{types: ['address']}}
                                  selectProps={{
                                    instanceId: 'address',
                                    value,
                                    onChange,
                                    onBlur,
                                    isDisabled: thirdPartyReadOnlyProps.includes('location'),
                                    placeholder: 'Location of event',
                                    isClearable: true,
                                    theme: selectTheme,
                                    styles: selectStyles
                                  }}
                                />
                              )}
                              rules={{
                                required: true
                              }}
                            />
                            {errors.location && (
                              <div className="text-rose-500 text-sm ml-1 mt-1">Event location is required.</div>
                            )}
                          </div>
                          <div>
                            <label htmlFor="type" className="form-label required">Event Type</label>
                            <Controller
                              name="type"
                              control={control}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <Select
                                  instanceId="type"
                                  value={value}
                                  onBlur={onBlur}
                                  options={eventTags}
                                  onChange={onChange}
                                  theme={selectTheme}
                                  styles={selectStyles}
                                  isClearable
                                  isDisabled={thirdPartyReadOnlyProps.includes('type')}
                                  placeholder="Select a type"
                                />
                              )}
                              rules={{
                                required: true
                              }}
                            />
                            {errors.type && (
                              <div className="text-rose-500 text-sm mt-1">Event type is required.</div>
                            )}
                          </div>
                          <div className="lg:col-span-2">
                            <label htmlFor="cover" className="form-label required">Event Cover</label>
                            <Controller
                              name="cover"
                              control={control}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <Upload
                                  className="relative flex justify-center items-center w-full h-52 rounded-lg border-2 border-dashed border-gray-600"
                                  onBlur={onBlur}
                                  action='https://api.crowdcore.com/prod/activity/uploadImage'
                                  type="drag"
                                  accept='image/*'
                                  onSuccess={file => {
                                    setUploadingCover(false);
                                    onChange(file.location)
                                  }}
                                  onProgress={(step, file) => {
                                    setUploadingCover(true)
                                  }}
                                >
                                  {
                                    !value && !uploadingCover &&
                                    <div className="text-center">
                                      <h1 className="text-base sm:text-xl mb-2 text-gray-500 font-medium">
                                        Drag & drop or click to add image (JPEG, PNG)
                                      </h1>
                                      <h1 className="text-sm sm:text-base text-gray-500/80">
                                        Best resolution is width 660 x height 800
                                      </h1>
                                    </div>
                                  }
                                  {
                                    (value && !uploadingCover) &&
                                    <img className="h-full p-3" src={value.startsWith('https://') ? value : 'https://images.chumi.co/' + value} alt="" />
                                  }
                                  {
                                    uploadingCover &&
                                    <Spinner
                                      thickness="4px"
                                      speed="0.65s"
                                      color="yellow.500"
                                      size="xl"
                                    />
                                  }
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
                          <div>
                            <label htmlFor="startTime" className="form-label required">Event Start Time</label>
                            <Controller
                              name="startTime"
                              control={control}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <DatePicker
                                  disabled={thirdPartyReadOnlyProps?.includes('startDate')}
                                  dateFormat="Pp"
                                  onBlur={onBlur}
                                  className="form-field"
                                  placeholderText="Event Start Time"
                                  showTimeSelect
                                  selected={value}
                                  onChange={date => {
                                    onChange(date);
                                  }}
                                />
                              )}
                              rules={{
                                required: true
                              }}
                            />
                            {errors.startTime && (
                              <div className="text-rose-500 text-sm mt-1">Start time is required.</div>
                            )}
                          </div>
                          <div>
                            <label htmlFor="endTime" className="form-label required">Event End Time</label>
                            <Controller
                              name="endTime"
                              control={control}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <DatePicker
                                  disabled={thirdPartyReadOnlyProps?.includes('endDate')}
                                  dateFormat="Pp"
                                  onBlur={onBlur}
                                  className="form-field"
                                  placeholderText="Event End Time"
                                  showTimeSelect
                                  selected={value}
                                  onChange={date => {
                                    onChange(date);
                                  }}
                                />
                              )}
                              rules={{
                                required: true
                              }}
                            />
                            {errors.endTime && (
                              <div className="text-rose-500 text-sm mt-1">End time is required.</div>
                            )}
                          </div>
                        </div>
                        <div className="mt-6 md:mt-10">
                          <Button
                            width="100%"
                            isLoading={isSubmitting}
                            loadingText='Saving...'
                            fontSize="md"
                            fontWeight={600}
                            colorScheme="yellow"
                            rounded="full"
                            size="lg"
                            disabled={!isDirty || !isValid}
                            onClick={handleSubmit(onFormSubmit)}
                          >
                            Share event to Happin
                          </Button>
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
