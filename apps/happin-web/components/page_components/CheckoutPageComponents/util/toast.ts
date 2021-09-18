export const generateToast = (message: string, toast: any) => {
  toast({
    title: message,
    position: 'top',
    isClosable: true,
  })
}
