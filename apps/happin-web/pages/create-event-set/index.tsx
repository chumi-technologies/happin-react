import { editEventCollection, getEventCategories, getEventCollection, postEventCollectionToHappin, searchEvent } from "lib/api";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Select, Spinner, Tag, TagLabel, TagCloseButton, useToast, Link } from "@chakra-ui/react";
import Async from 'react-select/async';
import Upload from "rc-upload"
import moment from 'moment-timezone';
import PopUpModal from "../../components/reusable/PopUpModal";
import { useUserState } from "contexts/user-state";

interface setData {
  title: string,
  cover: string,
  description: string,
  category: string,
}

const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    color: state.isSelected ? '#1a1a1a' : '#fff',
    background: state.isSelected ? '#fff' : state.isFocused ? '#000' : '#1a1a1a',
    padding: 20,
  }),
  loadingMessage: (provided: any, state: any) => ({
    ...provided,
    color: '#fff',
    background: '#1a1a1a',
  }),
  noOptionsMessage: (provided: any, state: any) => ({
    ...provided,
    color: '#fff',
    background: '#1a1a1a',
  }),
  menuList: (provided: any, state: any) => ({
    ...provided,
    padding: 0,
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    background: state.isSelected ? '#E8F0FE' : '#000',
    marginTop: '0.25rem',
    border: '2px solid #454545',
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
  input: (provided: any) => ({
    ...provided,
    color: '#fff'
  })
}

export default function CreateEventSet() {
  const router = useRouter();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [eventTags, setEventTags] = useState<string[]>();
  const [uploadingCover, setUploadingCover] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<any[]>([]);

  const [currentSelect, setCurrentSelect] = useState<any>();
  const [createCompleteModal, setCreateCompleteModal] = useState<boolean>(false);
  const toast = useToast();

  const [newCollectionId, setNewCollectionId] = useState<string>();
  const [isApproved, setIsApproved] = useState<boolean>();
  const { user } = useUserState();
  let timeOut = useRef<any>(null);
  let timeZone = useRef<any>(moment.tz.guess());

  const generateToast = (message: string) => {
    toast({
      title: message,
      position: 'top',
      isClosable: true,
    })
  }
  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    control,
  } = useForm<setData>({ mode: 'all' });

  useEffect(()=> {
    if (!localStorage.getItem('happin_web_jwt') && !localStorage.getItem('happin_refresh_token')) {
      router.push('/');
    }
  }, [])

  useEffect(() => {
    getEventTags()
  }, [])

  const getEventTags = async () => {
    try {
      const response: any = await getEventCategories();
      console.log(Object.keys(response));
      setEventTags(Object.keys(response))
    } catch (err) {
      console.log(err)
    }
  }

  const onFormSubmit = async (data: setData) => {
    //console.log(data);
    if (!selectedEvent.length) {
      generateToast('A collection should have at least one event');
      return
    }
    try {
      if (editMode) {
        const form = {
          cover: data.cover,
          description: data.description,
          title: data.title,
          events: selectedEvent.map(e => e._id),
          categories: [data.category]
        }
        await editEventCollection(form, router.query.id as string);
        generateToast('Collection saved and will be reviewed within three days');
      } else {
        const { category, ...rest } = data
        const events = selectedEvent.map(event => event._id);
        const form = {
          categories: [category],
          events,
          ...rest
        }
        const response = await postEventCollectionToHappin(form);
        console.log(response._id)
        setCreateCompleteModal(true);
        setNewCollectionId(response._id);
      }
    } catch (err) {
      console.log(err)
    }
  }


  useEffect(() => {
    if (router.query.id && user) {
      getDataForEdit(router.query.id as string);
    }
  }, [router, user])

  const getDataForEdit = async (id: string) => {
    try {
      const response = await getEventCollection(id);
      if (response.creator._id !== user?._id) {
        generateToast('You are not allowed to edit this collection')
        router.push('/')
        return
      }
      setValue('title', response.title);
      setValue('category', response.categories[0]);
      setValue('description', response.description);
      setValue('cover', response.cover);
      setIsApproved(response.isApproved)
      setSelectedEvent(response.events);
      setEditMode(true);
    } catch (err) {
      console.log(err)
    }
  }

  const promiseOptions = async (inputValue: string) => {
    try {
      if (timeOut) {
        clearTimeout(timeOut.current)
      }
      let result: any;
      await new Promise<void>(resolve => {
        timeOut.current = setTimeout(async () => {
          const response = await searchEvent(inputValue)
          result = response.data.events.map(({ _id, title, start_datetime, ...rest }: { _id: string, title: string, start_datetime: Date }) =>
            ({ value: _id, title, _id, label: `Title: ${title}, Date: ${moment.utc(start_datetime).tz(timeZone.current).format('ddd MMM D ・ H:mm A')}`, ...rest }));
          resolve()
        }, 500)
      })
      return result
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      {/* create success modal */}
      {createCompleteModal && (
        <PopUpModal
          modalTitle="Redeem Completed"
          isModalOpen={createCompleteModal}
          setIsModalOpen={setCreateCompleteModal}
        >
          <div style={{margin: '0 1.25rem 1.25rem'}}>
            <p className="black-title text-md text-white text-center font-bold">Collection saved and will be reviewd within three days</p>
            <p className="black-title mt-6 text-md text-white text-center">To edit or preview, click <u><Link href={`https://happin.app/create-event-set?id=${newCollectionId}`}>here</Link></u></p>
          </div>
        </PopUpModal>
      )}
      <div className="create-event-collection__container">
        <h1 className="black-title text-xl sm:text-3xl md:text-4xl text-white font-bold lg:pr-10 mt-1 sm:mt-4">{editMode ? 'Edit' : 'Create'} event collection</h1>
        {editMode ?
          <>
            <h1 className="black-title text-base sm:text-xl text-white mt-1 sm:mt-3">Preview link: {<u><Link href={`https://happin.app/event-set/${router.query.id}`}>{`https://happin.app/event-set/${router.query.id}`}</Link></u>}</h1>
            <h1 className="black-title text-base sm:text-xl text-white mt-1 sm:mt-3">Status: {isApproved ? 'Approved' : 'Not Approved'}</h1>
          </> :
          <h1 className="black-title text-base sm:text-xl text-white mt-1 sm:mt-3">
            Collection page is your unique channel to show all of your recommended events. You can share it with your community, so members can consistently follow you and attend events.
          </h1>
        }

        <div className="flex flex-col md:h-full">
          <div className="md:flex-1 md:h-0 web-scroll h-full ">
            <div className="container">
              <div className="flex flex-col md:flex-row w-full py-2 md:py-8">
                <div className="md:flex-1 min-w-0">
                  <div className="lg:sticky lg:top-8 rounded-lg md:rounded-none bg-gray-900 md:bg-transparent p-4 sm:p-5 md:p-0">
                    <form>
                      <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-6">
                          <div className="lg:col-span-3">
                            <label htmlFor="title" className="form-label required">Title</label>
                            <Controller
                              name="title"
                              control={control}
                              defaultValue={''}
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
                              <div className="text-rose-500 text-sm mt-1">Title is required.</div>
                            )}
                          </div>
                          <div className="lg:col-span-3">
                            <label htmlFor="category" className="form-label required">Category</label>
                            <Controller
                              name="category"
                              control={control}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <Select
                                  iconColor={'#fff'}
                                  className="form-field"
                                  value={value}
                                  style={{ paddingTop: '0', marginTop: '6px', border: '2px solid #454545' }}
                                  selected={value} onBlur={onBlur}
                                  onChange={(val: any) => { onChange(val.target.value); }}
                                  placeholder="Select a category">
                                  {eventTags?.map(category => <option value={category} key={category}>{category}</option>)}
                                </Select>
                              )}
                              rules={{
                                required: true
                              }}
                            />
                            {errors.category && (
                              <div className="text-rose-500 text-sm mt-1">Categories is required.</div>
                            )}
                          </div>
                          <div className="lg:col-span-6">
                            <label htmlFor="description" className="form-label required">Write down collection description or why you recommend events</label>
                            <Controller
                              name="description"
                              control={control}
                              defaultValue={''}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <textarea
                                  id="description"
                                  rows={3}
                                  onChange={onChange}
                                  onBlur={onBlur}
                                  value={value}
                                  className="form-field"
                                  placeholder="Collection Description"
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

                          <div className="lg:col-span-6">
                            <label htmlFor="events" className="form-label required">Collection Events (type to search)</label>
                            <Async
                              styles={customStyles}
                              id="long-value-select"
                              instanceId="long-value-select"
                              loadOptions={promiseOptions}
                              value={currentSelect}
                              placeholder={'Type event title...'}
                              onChange={val => { if (val) { setCurrentSelect(null); setSelectedEvent(s => { if (!s.map(e => e._id).includes(val._id)) { return [...s, val] } else { generateToast('Duplicate record'); return s } }); } }}
                            />
                            <br />
                            {
                              selectedEvent.map((event) =>
                                <Tag
                                  size={'md'}
                                  key={event._id}
                                  borderRadius="full"
                                  variant="solid"
                                  colorScheme="yellow"
                                  style={{ color: '#000', margin: '5px 5px 5px 0' }}
                                >
                                  <TagLabel>{event.title}</TagLabel>
                                  <TagCloseButton onClick={() => { setSelectedEvent(s => { const newState = s.filter(e => e._id !== event._id); return newState }) }}></TagCloseButton>
                                </Tag>
                              )
                            }
                          </div>

                          <div className="lg:col-span-6">
                            <label htmlFor="cover" className="form-label required">Collection Cover</label>
                            <Controller
                              defaultValue={''}
                              name="cover"
                              control={control}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <Upload
                                  className='mt-2'
                                  onBlur={onBlur}
                                  action='https://api.crowdcore.com/prod/activity/uploadImage'
                                  type="drag" accept='image/*' style={{ display: 'block', borderRadius: '0.5rem', border: '2px #454545 dashed', height: 200 }}
                                  onSuccess={(file: any) => { setUploadingCover(false); onChange(file.location) }} onProgress={(_step: any, _file: any) => { setUploadingCover(true) }}>
                                  {!value && !uploadingCover && <div className="flex items-center h-full justify-center "><h1 className="black-title text-base sm:text-xl text-center p-5" style={{ color: '#454545' }}>Drag & drop or click to add image (JPEG, PNG)</h1></div>}
                                  {(value && !uploadingCover) && <div className="flex items-center h-full justify-center "><img className="h-full" style={{ padding: '10px' }} src={value.startsWith('https://') ? value : 'https://images.chumi.co/' + value} alt="" /></div>}
                                  {uploadingCover && <div className="flex items-center h-full justify-center "><Spinner size="xl" color="yellow"></Spinner></div>}
                                </Upload>
                              )}
                              rules={{
                                required: true
                              }}
                            />
                            {errors.cover && (
                              <div className="text-rose-500 text-sm mt-1">Collection cover is required.</div>
                            )}
                          </div>
                          <div className="lg:col-span-6 event-submit__form">
                            <button disabled={isSubmitting} onClick={handleSubmit(onFormSubmit)} style={{ width: '100%' }} className="btn btn-yellow !px-0 !font-semibold !rounded-full flex-1 mt-10" >
                              <span className="text-sm sm:text-base">{isSubmitting ? 'Porcessing...' : 'Save'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>)
}
