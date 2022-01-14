export const generateToast = (message: string, toast: any) => {
  toast({
    title: message,
    position: 'top',
    isClosable: true,
  })
}

export const generateErrorToast = (message: string, toast: any) => {
  toast({
    title: message,
    position: 'top',
    status: 'error',
    isClosable: true,
  })
}


export const generateSuccessToast = (message: string, toast: any) => {
  toast({
    title: message,
    position: 'top',
    status: 'success',
    isClosable: true,
  })
}

