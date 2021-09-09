import { useToast } from "@chakra-ui/react"

export const generateToast = (message: string) => {
  const toast = useToast()
  toast({
    title: message,
    position: 'top',
    isClosable: true,
  })
}
