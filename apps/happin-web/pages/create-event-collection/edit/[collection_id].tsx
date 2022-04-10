import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Controller, useForm } from 'react-hook-form';
import { Button, Spinner, useToast } from '@chakra-ui/react';
import { Transition } from '@headlessui/react';
import AsyncSelect from 'react-select/async';
import AsyncCreatableSelect from 'react-select/async-creatable';
import Upload from 'rc-upload';
import moment from 'moment-timezone';
import { useUserState } from 'contexts/user-state';
import { Editor } from '@tinymce/tinymce-react';
import { components, ControlProps, StylesConfig, ThemeConfig } from 'react-select';
import { debounce, omit } from 'lodash';
import InfiniteScroll from 'react-infinite-scroll-component';
import classnames from 'classnames';
import { SearchIcon } from '@chakra-ui/icons';
import {
  editEventCollection,
  getEventCollection,
  postEventCollectionAppend,
  postEventCollectionRemove,
  searchEvent,
  getAppTags,
  getCollectionEvents
} from 'lib/api';

type selectOption = {
  label: string;
  value: any;
}
type asyncEvents = {
  value: string;
  label: string;
  cover: string;
  location: string;
  date: string;
}
type formData = {
  title: string;
  cover: string;
  description: string;
  tags: selectOption[];
  events: asyncEvents[];
}

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
const Control = ({ children, ...rest }: ControlProps<asyncEvents, false>) => {
  return (
    <components.Control {...rest}>
      <div className="w-full flex items-center">
        <span className="inline-flex text-gray-300 pl-4">
          <SearchIcon w={4} h={4} color="currentColor" />
        </span>
        {children}
      </div>
    </components.Control>
  )
};

export default function CreateEventSet() {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isEventsLoading, setIsEventsLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [currentSelect, setCurrentSelect] = useState<any>();
  const [eventList, setEventList] = useState<asyncEvents[]>([]);
  const [events, setEvents] = useState({
    page: 1,
    pageSize: 10,
    hasMore: true
  });

  const { user } = useUserState();
  const router = useRouter();
  const toast = useToast();
  const editorRef = useRef<any>(null);
  const timeZone = useRef<any>(moment.tz.guess());
  const asyncRef = useRef<any>(null);

  const generateToast = (message: string) => {
    toast({
      title: message,
      position: 'top',
      isClosable: true,
    })
  }
  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty, isValid },
    control,
  } = useForm<formData>({ mode: 'all' });

  useEffect(() => {
    (async () => {
      if (!localStorage.getItem('happin_web_jwt') && !localStorage.getItem('happin_refresh_token')) {
        await router.push('/');
      }
    })();
  }, [])

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (router.query.collection_id && user) {
        isMounted && setIsLoading(true);
        await fetchCollection();
        await fetchCollectionEvents(isMounted, true);
        isMounted && setIsLoading(false);
      }
    })();
    return () => { isMounted = false };
  }, [router, user])

  const fetchCollection = async () => {
    try {
      const res = await getEventCollection(String(router.query.collection_id));
      if (res.creator._id !== user?._id) {
        generateToast('You are not allowed to edit this collection')
        await router.push('/')
        return
      }
      reset({
        title: res.title,
        tags: res.tags.map((i: string) => ({value: i, label: i})),
        cover: res.cover,
        description: res.description,
      })
    } catch (err) {
      console.log(err)
    }
  }

  const fetchCollectionEvents = async (newFetch = false, isMounted = true) => {
    try {
      const res = await getCollectionEvents(
        String(router.query.collection_id), (newFetch ? 1 : events.page), events.pageSize
      );
      if (res.data.events.length < events.pageSize && isMounted) {
        setEvents({...events, hasMore: false})
      }
      if (res.code === 200) {
        const events = res.data.events.map((item: any) => ({
          value: item._id,
          label: item.title,
          cover: item.cover,
          location: `${item.street}, ${item.city}, ${item.state}, ${item.country}`,
          date: moment.utc(item.start_datetime).tz(timeZone.current).format('ddd MMM D ・ H:mm A')
        }))
        if (newFetch) {
          isMounted && setEventList(events)
        } else {
          isMounted && setEventList([...eventList, ...events])
        }
        isMounted && setEvents(s => ({...s, page: s.page + 1}))
      } else {
        generateToast(res.message)
      }
    } catch (err) {
      console.log(err);
    }
  }

  const fetchMoreEvents = async () => {
    try {
      if (!events.hasMore) {
        return;
      }
      await fetchCollectionEvents();
    } catch (err) {
      console.log(err);
    }
  }

  const onFormSubmit = (data: formData) => {
    const form = {
      title: data.title,
      tags: data.tags.map(i => i.value),
      description: data.description,
      descriptionPlainText: editorRef.current.getContent(({ format: 'text' })),
      cover: data.cover,
    }
    editEventCollection(form, String(router.query.collection_id)).then(res => {
      if (res.code === 200) {
        reset({...omit(form, 'descriptionPlainText'), tags: data.tags});
        generateToast('Collection saved and will be reviewed within three days');
      } else {
        generateToast(res.message);
      }
    }).catch(err => {
      console.log(err)
    });
  }

  const getAsyncOptions = (inputValue: string) => {
    return searchEvent(inputValue).then(res => {
      return res.data.events.map((item: any) => ({
        value: item._id,
        label: item.title,
        cover: item.cover,
        location: `${item.street}, ${item.city}, ${item.state}, ${item.country}`,
        date: moment.utc(item.start_datetime).tz(timeZone.current).format('ddd MMM D ・ H:mm A')
      }));
    }).catch(error => {
      console.log(error);
    })
  };

  const getAsyncTags = (keyword: string) => {
    return getAppTags(10, keyword).then(res => {
      return res.data.tags.map((item: any) => ({
        value: item.tagName,
        label: item.tagName,
      }))
    }).catch(error => {
      console.log(error);
    })
  };

  const loadOptions = debounce((inputText, callback) => {
    getAsyncOptions(inputText).then((options) => callback(options));
  }, 300);

  const loadTagsOptions = debounce((inputText, callback) => {
    getAsyncTags(inputText).then((options) => callback(options));
  }, 300);

  const formatOptionLabel = ({ label, date }: {label: string; date: string}) => {
    return (
      <>
        <div className="font-medium text-sm sm:text-base">{label}</div>
        <div className="text-xs sm:text-sm text-gray-400">{date}</div>
      </>
    )
  };

  const handleAppend = (value: any) => {
    setCurrentSelect(null);
    asyncRef?.current.blur();
    if (!eventList.map((e: any) => e.value).includes(value?.value)) {
      setIsEventsLoading(true);
      const append = {
        collection: router.query.collection_id,
        eventIds: [value?.value]
      }
      postEventCollectionAppend(append).then(async res => {
        if (res.code === 200) {
          await setEvents(s => ({
            ...s,
            page: 1,
            hasMore: true
          }))
          await fetchCollectionEvents(true);
          generateToast('Successfully append!')
        } else {
          generateToast(res.msg)
        }
      }).catch(err => {
        console.log(err);
      }).finally(() => setIsEventsLoading(false));
    } else {
      generateToast('Duplicate record');
    }
  };
  const handleRemove= (id: any) => {
    setIsEventsLoading(true);
    const remove = {
      collection: router.query.collection_id,
      eventIds: [id]
    }
    postEventCollectionRemove(remove).then(async res => {
      if (res.code === 200) {
        await setEvents(s => ({
          ...s,
          page: 1,
          hasMore: true
        }))
        await fetchCollectionEvents(true);
        generateToast('Successfully deleted!');
      } else {
        generateToast(res.msg)
      }
    }).catch(err => {
      console.log(err);
    }).finally(() => setIsEventsLoading(false));
  };

  return (
    <>
      <Transition
        show={isLoading}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[99]"
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          color="yellow.500"
          size="xl"
        />
      </Transition>
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="sm:pb-4 md:pb-6 mb-4 sm:mb-6 md:mb-8 mt-2 md:mt-4 border-b border-gray-600 sm:border-gray-800">
            <h1 className="black-title text-xl sm:text-3xl md:text-4xl text-gray-50 font-bold lg:pr-10">
              Edit event collection
            </h1>
            <div className="mt-1 sm:mt-3">
              <h2 className="black-title text-base sm:text-lg text-gray-50">
                <span className="mr-2 text-gray-300">Preview link:</span>
                <Link href={`/event-collection/${router.query.collection_id}`}>
                  <a className="text-rose-500 hover:text-rose-600 underline transition break-all">
                    {`https://happin.app/event-collection/${router.query.collection_id}`}
                  </a>
                </Link>
              </h2>
            </div>
            <div className="flex sm:space-x-5 mt-3 md:mt-4">
              {
                ['Collection Details', 'Collection Events'].map((item, index) => (
                  <div
                    key={index}
                    className={classnames('flex-1 text-center rounded-t-md sm:rounded-lg px-3 py-1.5 sm:px-4 sm:py-2.5 cursor-pointer transition',
                      step === index ? 'bg-rose-500' : 'sm:bg-gray-800 hover:bg-gray-700')}
                    onClick={() => setStep(index)}
                  >
                    <div className={classnames('font-medium', step === index ? 'text-gray-50' : 'text-gray-400 sm:text-gray-200')}>{item}</div>
                  </div>
                ))
              }
            </div>
          </div>
          <form className="pb-6 md:pb-10" hidden={step === 1}>
            <div className="space-y-4 md：space-y-5">
              <div>
                <label htmlFor="title" className="form-label required">Title</label>
                <Controller
                  name="title"
                  control={control}
                  defaultValue=""
                  render={({ field: { onChange, onBlur, value } }) => (
                    <input
                      type="text"
                      readOnly
                      className="form-field"
                      placeholder="Event Title"
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value}
                    />
                  )}
                />
                <div className="text-gray-400 text-sm ml-1 mt-1">You cannot change title after creation.
                </div>
              </div>
              <div>
                <label htmlFor="tags" className="form-label required">Tags</label>
                <Controller
                  name="tags"
                  defaultValue={[]}
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AsyncCreatableSelect
                      instanceId="tags"
                      isMulti
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      loadOptions={loadTagsOptions}
                      placeholder="Tags"
                      isClearable
                      theme={selectTheme}
                      styles={selectStyles}
                    />
                  )}
                  rules={{
                    required: true
                  }}
                />
                {errors.tags && (
                  <div className="text-rose-500 text-sm ml-1 mt-1">Tags is required.</div>
                )}
              </div>
              <div>
                <label htmlFor="description" className="form-label required">Write down collection description or why you recommend events</label>
                <Controller
                  name="description"
                  defaultValue=""
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Editor
                      apiKey={process.env.NEXT_PUBLIC_RICHTEXT_API_KEY}
                      onInit={(_, editor) => editorRef.current = editor}
                      value={value}
                      onEditorChange={(val) => onChange(val)}
                      id="description"
                      init={{
                        suffix: '.min',
                        height: 500,
                        branding: false,
                        plugins: [
                          'link', 'lists', 'autolink', 'paste', 'image'
                        ],
                        toolbar: [
                          'link bold underline strikethrough | bullist numlist',
                        ],
                        images_upload_url: 'https://api.crowdcore.com/prod/activity/uploadImage',
                        image_class_list: [
                          {title: 'default size', value: 'max-width-100'},
                        ],
                        content_style: 'body { background-color: #121212;  color:white; }'
                      }}
                    />
                  )}
                  rules={{
                    required: true
                  }}
                />
                {errors.description && (
                  <div className="text-rose-500 text-sm ml-1 mt-1">Description is required.</div>
                )}
              </div>
              <div>
                <label htmlFor="cover" className="form-label required">Collection Cover</label>
                <Controller
                  defaultValue=""
                  name="cover"
                  control={control}
                  rules={{required: true}}
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
                />
                {errors.cover && (
                  <div className="text-rose-500 text-sm ml-1 mt-1">Collection cover is required.</div>
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
                Update
              </Button>
            </div>
          </form>
          <div className="pb-6 md:pb-10" hidden={step === 0}>
            <div className="flex items-center justify-between">
              <label htmlFor="events" className="form-label">Collection Events (type to search)</label>
              {
                eventList?.length > 0 && (
                  <div className="text-sm text-gray-400 mb-1.5">
                    <span className="font-medium text-gray-50">{eventList?.length}</span> Selected
                  </div>
                )
              }
            </div>
            <AsyncSelect<asyncEvents, false>
              ref={asyncRef}
              instanceId="events"
              loadOptions={loadOptions}
              value={currentSelect}
              placeholder="Type event title..."
              onChange={handleAppend}
              theme={selectTheme}
              styles={selectStyles}
              components={{Control}}
              formatOptionLabel={formatOptionLabel}
            />
            <div className="relative">
              <Transition
                show={isEventsLoading}
                enter="transition-opacity duration-75"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10"
              >
                <Spinner
                  thickness="3px"
                  speed="0.65s"
                  color="yellow.500"
                  size="md"
                />
              </Transition>
              {
                eventList?.length > 0 && (
                  <div
                    id="scrollable"
                    className="mt-3 rounded-lg border border-dashed border-gray-600 overflow-y-auto"
                    style={{maxHeight: 400}}
                  >
                    <InfiniteScroll
                      className="px-3 sm:px-5 sm:py-2 divide-y divide-gray-700"
                      dataLength={eventList.length}
                      next={fetchMoreEvents}
                      hasMore={events.hasMore}
                      scrollableTarget="scrollable"
                      loader={
                        <div className="flex items-center justify-center w-full pt-2">
                          <Spinner
                            thickness="2px"
                            speed="0.65s"
                            color="yellow.500"
                            size="sm"
                          />
                          <span className="text-gray-200 ml-2">Loading...</span>
                        </div>
                      }
                    >
                      {
                        eventList.map((item, index) => (
                          <div key={item.value} className="flex items-center py-3 w-full">
                          <span className="hidden sm:block w-6 sm:w-8 sm:text-lg font-medium mr-4 text-gray-100">
                            #{index + 1}
                          </span>
                            <a href={`https://happin.app/post/${item.value}`}
                               target="_blank"
                               rel="noopener noreferrer"
                               className="block"
                            >
                              <img
                                className="w-12 h-12 object-cover rounded bg-gray-700"
                                src={item.cover}
                                alt=""
                              />
                            </a>
                            <div className="flex flex-col flex-1 min-w-0 mx-3 sm:mx-4">
                              <a href={`https://happin.app/post/${item.value}`}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-sm sm:text-base truncate sm:text-clip text-gray-50 font-medium leading-5 mb-1"
                              >
                                {item.label}
                              </a>
                              <div className="text-xs sm:text-sm truncate sm:text-clip text-gray-400">
                                {item.date}
                              </div>
                            </div>
                            <button
                              className="btn btn-xs btn-rose sm:!h-8 sm:!py-0 sm:!px-3 sm:!text-sm !rounded-full"
                              type="button"
                              onClick={() => handleRemove(item.value)}
                            >
                              Remove
                            </button>
                          </div>
                        ))
                      }
                    </InfiniteScroll>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
