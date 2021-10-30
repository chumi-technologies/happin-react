import React, { Fragment, useEffect, useRef, useState } from 'react';
import { CloseSmall, Delete, Edit, Plus, SaveOne } from '@icon-park/react';
import { Dialog, Transition } from '@headlessui/react';
import { Controller, useForm } from 'react-hook-form';
import { FilePond, registerPlugin } from 'react-filepond'
import LoadingSpinner from '@components/reusable/LoadingSpinner';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType,
  FilePondPluginImageResize
)
type FormData = {
  giftName: string;
  pointsRequired: number | undefined;
  giftImage: any;
};
export default function CustomVirtualGift() {
  const [isOpen, setIsOpen] = useState(false) // dialog显示状态
  const [isEdit, setIsEdit] = useState(false) // dialog新增or编辑
  const [imgUrl, setImgUrl] = useState('') // dialog图片回显
  const [loading, setLoading] = useState(false) // 上传loading
  const [defaultValues, setDefaultValues] = useState<FormData>({
    giftName: '',
    pointsRequired: undefined,
    giftImage: []
  })
  const focusButtonRef = useRef(null)
  const filePondRef = useRef(null)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: any) => {
    console.log(data);
    if (data.giftImage.length) {
      setLoading(true)
      // @ts-ignore
      filePondRef.current.processFile().then((file) => {
        console.log(file);
        setLoading(false)
        closeModal()
      })
    } else {
      closeModal()
    }
  };
  function closeModal() {
    setIsOpen(false)
    reset()
  }
  useEffect(() => {
    if (!isEdit) {
      reset({
        giftName: '',
        pointsRequired: undefined,
        giftImage: []
      })
    } else {
      reset({
        giftName: defaultValues.giftName,
        pointsRequired: defaultValues.pointsRequired,
        giftImage: []
      })
    }
  }, [isOpen]);
  const giftList = [
    {
      id: 0,
      giftName: 'TWRP - Comin Atcha Tee - VIP Meet & Greet Bundle',
      giftPoints: 20,
      giftImage: 'https://cdn.sspai.com/article/17242d0e-d540-f6ff-a9fc-f26f637733ba.png'
    },
    {
      id: 1,
      giftName: 'TWRP',
      giftPoints: 2,
      giftImage: 'https://cdn.sspai.com/article/17242d0e-d540-f6ff-a9fc-f26f637733ba.png'
    },
  ]
  return (
    <div className="common__body">
      <div className="flex flex-col h-full">
        <div className="bg-gray-800 border-b border-solid border-gray-700">
          <div className="container">
            <div className="flex items-center justify-between py-3 sm:py-0 sm:h-20">
              <div className="font-bold text-lg sm:text-2xl">Custom virtual gift</div>
              <div className="fixed sm:static left-0 right-0 bottom-0 z-20">
                <button
                  className="btn btn-rose flex sm:inline-flex items-center justify-center w-full sm:w-auto !font-semibold !rounded-none sm:!rounded-full !py-4 sm:!py-3 !px-5"
                  onClick={() => {
                    setIsEdit(false)
                    setIsOpen(true)
                  }}
                >
                  <Plus theme="outline" size="16" fill="currentColor" strokeWidth={5}/>
                  <span className="ml-2">Add virtual gift</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 h-0 web-scroll overflow-y-auto">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 py-5 sm:py-6 lg:py-8">
              {
                giftList.map(item => (
                  <div key={item.id} className="flex bg-white bg-opacity-10 p-3 rounded-md">
                    <div className="w-24 h-24 rounded-md overflow-hidden">
                      <img className="w-full h-full object-cover" src={item.giftImage} alt={item.giftName} />
                    </div>
                    <div className="flex-1 min-w-0 ml-4 flex flex-col">
                      <div className="flex items-start mb-2 flex-1">
                        <div className="text-white text-sm sm:text-base font-semibold ellipsis-2">{item.giftName}</div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-gray-300 font-medium text-sm flex-1">{item.giftPoints} Points</div>
                        <div
                          className="relative flex items-center justify-center w-8 h-8 text-gray-400 rounded-full cursor-pointer bg-gray-700 hover:bg-gray-600 hover:text-white transition mr-2"
                          onClick={() => {
                            setDefaultValues({
                              giftName: item.giftName,
                              pointsRequired: item.giftPoints,
                              giftImage: item.giftImage
                            })
                            setImgUrl(item.giftImage)
                            setIsEdit(true)
                            setIsOpen(true)
                          }}
                        >
                          <Edit theme="outline" size="14" fill="currentColor" />
                        </div>
                        <div className="relative flex items-center justify-center w-8 h-8 text-gray-400 rounded-full cursor-pointer bg-gray-700 hover:bg-gray-600 hover:text-white transition">
                          <Delete theme="outline" size="14" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
            <div className="h-14 sm:hidden" />
          </div>
        </div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          initialFocus={focusButtonRef}
          onClose={() => {}}
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
              <div className="relative inline-block w-full max-w-lg p-5 sm:p-6 my-8 text-left overflow-hidden align-middle bg-gray-800 rounded-2xl z-10">
                {
                  loading && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 z-30 transition flex items-center justify-center">
                      <LoadingSpinner />
                    </div>
                  )
                }
                <div className="relative flex items-center mb-6">
                  <Dialog.Title
                    as="h3"
                    className="text-lg sm:text-xl font-bold leading-6 text-white"
                  >
                    Edit
                  </Dialog.Title>
                  <div className="flex items-center justify-center absolute -right-2 w-10 h-10 rounded-full hover:bg-gray-700 hover:text-white transition cursor-pointer text-gray-300" onClick={closeModal}>
                    <CloseSmall theme="outline" size="22" fill="currentColor" strokeWidth={3} />
                  </div>
                </div>
                <form className="mb-7">
                  <div className="space-y-4">
                    {
                      isEdit ? (
                        !imgUrl ? (
                          <>
                            <div className="custom-gift__upload">
                              <Controller
                                control={control}
                                rules={{
                                  required: true,
                                }}
                                render={({ field: { onChange, value } }) => (
                                  <FilePond
                                    ref={filePondRef}
                                    files={value}
                                    onupdatefiles={onChange}
                                    allowMultiple={false}
                                    allowProcess={false}
                                    maxFiles={1}
                                    stylePanelAspectRatio="1:1"
                                    imageResizeTargetWidth={500} // The output width in pixels
                                    imageResizeTargetHeight={500} // The output height in pixels
                                    server="/"
                                    name="files"
                                    instantUpload={false}
                                    acceptedFileTypes={['image/*']}
                                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'

                                  />
                                )}
                                name="giftImage"
                              />
                            </div>
                            {errors.giftImage && (
                              <div className="text-rose-500 text-sm mt-1">Gift image is required.</div>
                            )}
                          </>
                        ) : (
                          <div className="custom-gift__upload">
                            <div className="custom-gift__image">
                              <div className="filepond--image-preview-overlay filepond--image-preview-overlay-idle">
                                <svg width="500" height="200" viewBox="0 0 500 200" preserveAspectRatio="none">
                                  <defs>
                                    <radialGradient id="gradient-4" cx=".5" cy="1.25" r="1.15">
                                      <stop offset="50%" stopColor="#000000"></stop>
                                      <stop offset="56%" stopColor="#0a0a0a"></stop>
                                      <stop offset="63%" stopColor="#262626"></stop>
                                      <stop offset="69%" stopColor="#4f4f4f"></stop>
                                      <stop offset="75%" stopColor="#808080"></stop>
                                      <stop offset="81%" stopColor="#b1b1b1"></stop>
                                      <stop offset="88%" stopColor="#dadada"></stop>
                                      <stop offset="94%" stopColor="#f6f6f6"></stop>
                                      <stop offset="100%" stopColor="#ffffff"></stop>
                                    </radialGradient>
                                    <mask id="mask-4">
                                      <rect x="0" y="0" width="500" height="200" fill="url(#gradient-4)"></rect>
                                    </mask>
                                  </defs>
                                  <rect x="0" width="500" height="200" fill="currentColor" mask="url(#mask-4)"></rect>
                                </svg>
                              </div>
                              <div
                                className="flex justify-center"
                                onClick={() => {
                                  setImgUrl('')
                                  setValue('giftImage', '')
                                }}>
                                <div className="custom-gift__delete">
                                  <Delete theme="outline" size="14" strokeWidth={5} fill="currentColor" />
                                </div>
                              </div>
                              <img src={imgUrl} alt="" />
                            </div>
                          </div>
                        )
                      ) : (
                        <>
                          <div className="custom-gift__upload">
                            <Controller
                              control={control}
                              rules={{
                                required: true,
                              }}
                              render={({ field: { onChange, value } }) => (
                                <FilePond
                                  ref={filePondRef}
                                  files={value}
                                  onupdatefiles={onChange}
                                  allowMultiple={false}
                                  allowProcess={false}
                                  maxFiles={1}
                                  stylePanelAspectRatio="1:1"
                                  imageResizeTargetWidth={500}
                                  imageResizeTargetHeight={500}
                                  server="/"
                                  name="files"
                                  instantUpload={false}
                                  acceptedFileTypes={['image/*']}
                                  labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                                />
                              )}
                              name="giftImage"
                            />
                          </div>
                          {errors.giftImage && (
                            <div className="text-rose-500 text-sm mt-1">Gift image is required.</div>
                          )}
                        </>
                      )
                    }
                    <div className="">
                      <label htmlFor="giftName" className="form-label required">Gift name</label>
                      <input
                        id="giftName"
                        type="text"
                        className="form-field"
                        placeholder="Gift name"
                        {...register('giftName', { required: true })}
                      />
                      {errors.giftName && (
                        <div className="text-rose-500 text-sm mt-1">Gift name is required.</div>
                      )}
                    </div>
                    <div className="">
                      <label htmlFor="pointsRequired" className="form-label required">Points required</label>
                      <input
                        id="pointsRequired"
                        type="number"
                        min="0"
                        step="1"
                        className="form-field"
                        placeholder="Points required"
                        {...register('pointsRequired', { required: true })}
                      />
                      <div className="text-tiny text-gray-400 mt-1">Tip: 1 point is worth 0.025 USD, excluding Happin service fee</div>
                      {errors.pointsRequired && (
                        <div className="text-rose-500 text-sm mt-1">Points required is required.</div>
                      )}
                    </div>
                  </div>
                </form>
                <div className="flex justify-end space-x-3">
                  <button ref={focusButtonRef} className="inline-flex items-center btn btn-dark-light !px-6" onClick={closeModal}>
                    Cancel
                  </button>
                  <button className="inline-flex items-center btn btn-rose !px-6" onClick={handleSubmit(onSubmit)}>
                    <SaveOne theme="outline" size="16" fill="currentColor" />
                    <span className="ml-2">Save</span>
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}
