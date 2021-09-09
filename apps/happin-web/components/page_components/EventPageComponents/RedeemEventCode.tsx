import { checkinTicket } from "lib/api";
import { useState } from "react"
import { Button } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react"

const RedeemEventCode = ({ setIsRedeemModalOpen, happinEID }: { setIsRedeemModalOpen: (arg: boolean) => void, happinEID: string }) => {
  const [codeInput, setCodeInput] = useState<string | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  
  const generateToast = (message: string) => {
    toast({
      title: message,
      position: 'top',
      isClosable: true,
    })
  }

  const onConfirmHandler = async () => {
    if (!codeInput) {
      generateToast('Missing required field');
      return
    }
    if (codeInput.trim() === '') {
      generateToast('Missing required field')
      return
    }
    try {
      setIsLoading(true);
      const formatCode = codeInput.trim();
      const paylaod = { eventID: happinEID, shortCode: formatCode }
      const checkinRes = await checkinTicket(paylaod);
      if (checkinRes.code !== 200) {
        if (checkinRes.message.includes('checked already')) {
          generateToast('This invitation code has been used')
        } else if (checkinRes.message.includes('checked in with a regular ticket')) {
          generateToast('You have already checked in with one ticket')
        } else if (checkinRes.message.includes('Ticket not exist')) {
          generateToast('Ticket code not exists');
        }
        return
      }
      if (checkinRes.data.alreadyChecked) {
        generateToast('The invitation code already redeemed by you.')
        return
      }

      generateToast('Redeem successful')
      setIsRedeemModalOpen(false)
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const onInputHandler = (event: any) => {
    setCodeInput(event.target.value)
  }

  return (
    <>
      <input type="text"
        maxLength={6}
        className="block w-full px-3 py-2 sm:py-3 border-2 border-solid border-gray-600 rounded-lg bg-gray-900 text-white text-center transition placeholder-gray-400 hover:border-gray-500 focus:bg-black font-bold text-xl sm:text-2xl" onInput={onInputHandler}
        placeholder="Enter code" />
      <p className="mt-6 text-sm text-gray-400">Ticket code is case sensitive.</p>
      <Button
        variant="solid"
        colorScheme="cyan"
        fontSize={{ base: "medium", sm: "medium" }}
        h="40px"
        w="100%"
        mt={{ base: "10", sm: "5" }}
        isLoading={isLoading}
        onClick={onConfirmHandler}
      >
        Confirm
      </Button>
    </>
  )
}

export default RedeemEventCode;
