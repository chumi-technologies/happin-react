import { Button } from "@chakra-ui/react";

const ChatWithFans = () => {
  return <>
    <p className="mt-6 text-md text-gray-400">Join official event community to meet fellow fans or gather your friends to hangout</p>
    <div className="mt-6 flex" style={{justifyContent: 'center'}}>
      <a href={process.env.NEXT_PUBLIC_HAPPIN_APP_APPLE_STORE} rel="noreferrer" target="_blank"><img className="h-10" src="/images/app-store.svg" alt="App Store" /></a>
      <a href='https://play.google.com/store/apps/details?id=app.happin.prod' rel="noreferrer" target="_blank"><img className="h-10" src="/images/google-play.svg" alt="App Store" /></a>
    </div>
  </>
}

export default ChatWithFans
