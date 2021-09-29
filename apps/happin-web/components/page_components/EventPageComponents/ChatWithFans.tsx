import { Button } from "@chakra-ui/react";

const ChatWithFans = () => {
  return <>
    <p className="mt-6 text-md text-gray-400">Join official event community to meet fellow fans or create your private event chat and bring your friends together</p>
    <div className="mt-6 flex" style={{justifyContent: 'center'}}>
      <a href={process.env.NEXT_PUBLIC_HAPPIN_APP_APPLE_STORE} rel="noreferrer" target="_blank"><img className="h-10" src="/images/app-store.svg" alt="App Store" /></a>
    </div>
  </>
}

export default ChatWithFans
