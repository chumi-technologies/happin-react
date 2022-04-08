import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Controller, useForm } from 'react-hook-form';
import { Button, Spinner, useToast } from '@chakra-ui/react';
import { Transition } from '@headlessui/react';
import AsyncSelect from 'react-select/async';
import AsyncCreatableSelect from 'react-select/async-creatable';
import Upload from 'rc-upload';
import moment from 'moment-timezone';
import { Editor } from '@tinymce/tinymce-react';
import { components, ControlProps, StylesConfig, ThemeConfig } from 'react-select';
import Modal from '@components/reusable/Modal';
import { debounce } from 'lodash';
import { SearchIcon } from '@chakra-ui/icons';
import {
  postEventCollectionAppend,
  postEventCollectionToHappin,
  searchEvent,
  getAppTags,
} from 'lib/api';
import Link from 'next/link';
import Scroll from 'react-scroll';

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
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [currentSelect, setCurrentSelect] = useState<any>();
  const [createCompleteModal, setCreateCompleteModal] = useState(false);
  const [newCollectionId, setNewCollectionId] = useState<string>('');

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
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting, isDirty, isValid },
    control,
  } = useForm<formData>({ mode: 'all' });

  const selectedEvent = watch('events');

  useEffect(() => {
    (async () => {
      if (!localStorage.getItem('happin_web_jwt') && !localStorage.getItem('happin_refresh_token')) {
        await router.push('/');
      }
    })();
  }, [])

  const removeItemAtIndex = (arr: any[], index: number) => {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  };

  const onFormSubmit = async (data: formData) => {
    setIsLoading(true);
    try {
      const form = {
        title: data.title,
        tags: data.tags.map(i => i.value),
        description: data.description,
        descriptionPlainText: editorRef.current.getContent(({ format: 'text' })),
        cover: data.cover,
      }
      const res = await postEventCollectionToHappin(form);
      setNewCollectionId(res.data._id);
      const append = {
        collection: res.data._id,
        eventIds: data.events.map(i => i.value)
      }
      await postEventCollectionAppend(append);
      setCreateCompleteModal(true);
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false);
    }
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
          <div className="pb-4 md:pb-8 mb-4 md:mb-8 mt-2 md:mt-4 border-b border-gray-800">
            <h1 className="black-title text-2xl sm:text-3xl md:text-4xl text-gray-50 font-bold lg:pr-10">
              Create event collection
            </h1>
            <h2 className="text-base sm:text-xl text-gray-300 mt-1 sm:mt-3 leading-5">
              Collection page is your unique channel to show all of your recommended events. You can share it with your community, so members can consistently follow you and attend events.
            </h2>
          </div>
          <form className="pb-6 md:pb-10">
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
                      className="form-field"
                      placeholder="Event Title"
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value}
                    />
                  )}
                  rules={{
                    required: true
                  }}
                />
                {errors.title && (
                  <div className="text-rose-500 text-sm ml-1 mt-1">Title is required.</div>
                )}
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
                        <div className="text-center px-5">
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
                        <img className="h-full" style={{ padding: '10px' }} src={value.startsWith('https://') ? value : 'https://images.chumi.co/' + value} alt="" />
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
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="events" className="form-label required">Collection Events (type to search)</label>
                  {
                    selectedEvent?.length > 0 && (
                      <div className="text-sm text-gray-400 mb-1.5">
                        <span className="font-medium text-gray-50">{selectedEvent?.length}</span> Selected
                      </div>
                    )
                  }
                </div>
                <Controller
                  name="events"
                  control={control}
                  defaultValue={[]}
                  render={({ field: { onBlur, onChange } }) => (
                    <AsyncSelect<asyncEvents, false>
                      ref={asyncRef}
                      instanceId="events"
                      loadOptions={loadOptions}
                      value={currentSelect}
                      onBlur={onBlur}
                      placeholder="Type event title..."
                      menuPlacement={selectedEvent?.length > 3 ? 'bottom' : 'top'}
                      onChange={value => {
                        setCurrentSelect(null);
                        asyncRef?.current.blur();
                        if (!selectedEvent.map((e: any) => e.value).includes(value?.value)) {
                          onChange([...selectedEvent, value])
                        } else {
                          generateToast('Duplicate record');
                        }
                      }}
                      theme={selectTheme}
                      styles={selectStyles}
                      components={{Control}}
                      formatOptionLabel={formatOptionLabel}
                    />
                  )}
                  rules={{required: true}}
                />
                {errors.events && (
                  <div className="text-rose-500 text-sm ml-1 mt-1">Collection events is required.</div>
                )}
                {
                  selectedEvent?.length > 0 && (
                    <div
                      className="mt-3 rounded-lg border border-dashed border-gray-600 overflow-y-auto"
                      style={{maxHeight: 300}}
                    >
                      <div className="px-3 sm:px-5 sm:py-2 divide-y divide-gray-700">
                        {
                          selectedEvent.map((item, index) => (
                            <div key={item.value} className="flex items-center py-3 w-full">
                              <span className="hidden sm:block w-6 sm:w-8 sm:text-lg font-medium mr-4 text-gray-100">
                                #{index + 1}
                              </span>
                              <a href={`https://happin.app/post/${item.value}`}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="block"
                              >
                                <img className="w-12 h-12 object-cover rounded bg-gray-700" src={item.cover} alt="" />
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
                                onClick={async () => {
                                  setValue('events', removeItemAtIndex(selectedEvent, index))
                                  await trigger('events')
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )
                }
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
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
      {/* create success modal */}
      <Modal
        isOpen={createCompleteModal}
        setIsOpen={setCreateCompleteModal}
        maskClosable={false}
        onClose={async () => {
          await router.push('/my-event-collections')
        }}
        title={
          <div className="flex items-center">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none">
              <path d="M24 44C29.5228 44 34.5228 41.7614 38.1421 38.1421C41.7614 34.5228 44 29.5228 44 24C44 18.4772 41.7614 13.4772 38.1421 9.85786C34.5228 6.23858 29.5228 4 24 4C18.4772 4 13.4772 6.23858 9.85786 9.85786C6.23858 13.4772 4 18.4772 4 24C4 29.5228 6.23858 34.5228 9.85786 38.1421C13.4772 41.7614 18.4772 44 24 44Z" fill="#60EBA0" stroke="#60EBA0" strokeWidth="4" strokeLinejoin="round" />
              <path d="M16 24L22 30L34 18" stroke="#222222" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3 className="ml-3 text-lg sm:text-xl font-bold leading-6 text-gray-50">Redeem Completed</h3>
          </div>
        }
      >
        <div className="text-left">
          <p className="sm:px-4 text-lg text-gray-50 font-medium">Collection saved and will be reviewed within three days</p>
          <p className="sm:px-4 mt-2 text-gray-100 font-medium">
            <span className="mr-1.5">To edit or preview,</span>
            <Link href={`/create-event-collection/edit/${newCollectionId}`}>
              <a className="text-rose-500 hover:text-rose-600 underline transition">Click Here</a>
            </Link>
          </p>
          <div className="flex justify-end mt-7">
            <button
              className="btn btn-dark-light"
              onClick={() => {
                reset({
                  title: '',
                  tags: [],
                  cover: '',
                  description: '',
                  events: []
                });
                setNewCollectionId('');
                setCreateCompleteModal(false);
                Scroll.animateScroll.scrollToTop({
                  duration: 400,
                  smooth: true,
                })
              }}
            >
              Continue to add
            </button>
            <button
              className="btn btn-rose ml-3"
              onClick={async () => {
                await router.push('/my-event-collections')
              }}
            >
              Go back to list
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
