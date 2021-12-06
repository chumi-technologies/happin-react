import { useToast, Spinner } from "@chakra-ui/react";
import { useSSOState } from "contexts/sso-state";
import { useUserState } from "contexts/user-state";
import { crawlThirdPartyEvent, exchangeDashboardEventHostToken } from "lib/api";
import { useRouter } from "next/router";
import { useState } from "react";
import ThirdPartyEvent from "../../components/page_components/SubmitEventPageComponents/ThirdPartyEvent";

export interface IThirdPartyEvent {
  title: string,
  content: string,
  cover: string,
  type: string,
  subType: string,
  startDate: number,
  endDate: number,
  tags: string[],
  currency: string,
  country: string,
  state: string,
  city: string,
  images: string[]
  location: string;
  sourceUrl: string;
  geo?: number[];
}

export default function SubmitEvent() {
  const toast = useToast();
  const router = useRouter();
  const [inputURL, setInputURL] = useState<string>('');
  const [urlSubmitting, setUrlSubmitting] = useState<boolean>(false);
  const [thirdPartyEventSubmit, setThirdPartyEventSubmit] = useState<boolean>(false);
  const [thirdPartyEventData, setThirdPartyEventData] = useState<IThirdPartyEvent>();
  const [thirdPartyReadOnlyProps, setThirdPartyReadOnlyProps] = useState<string[]>();
  const { showSSOSignUp } = useSSOState();
  const { user } = useUserState();
  const generateToast = (message: string) => {
    toast({
      title: message,
      position: 'top',
      isClosable: true,
    })
  }

  const redirectToTicketingHome = async () => {
    if (!user) {
      router.push('https://ticketing.happin.app')
    } else {
      try {
        const res = await exchangeDashboardEventHostToken();
        if (res.code !== 200) {
          throw new Error(res.message)
        }
        const sassToken = res.data.token;
        router.push(`https://ticketing.happin.app?token=${sassToken}`)
      } catch (err) {
        console.log(err)
      }
    }
  }

  const onURLClickHandler = async () => {
    if (!inputURL || inputURL === '') {
      generateToast('Invalid URL');
      return
    }
    if (!localStorage.getItem('happin_web_jwt') && !localStorage.getItem('happin_refresh_token')) {
      generateToast('To continue, please log in or sign up ');
      showSSOSignUp('Organizer')
      return
    }

    try {
      setUrlSubmitting(true);
      const response = await crawlThirdPartyEvent(inputURL);
      if (response.code === 32001) {
        generateToast('This URL has been submitted already.')
        return
      }
      const eventData: IThirdPartyEvent = response.data.result;
      eventData.sourceUrl = response.data.sourceUrl;
      setThirdPartyReadOnlyProps(response.data.readonlyProperties)
      setThirdPartyEventData(eventData);
      setThirdPartyEventSubmit(true);
    } catch (err) {
      generateToast('Event not found');
      console.log(err)
    } finally {
      setUrlSubmitting(false);
    }
  }

  return (
    <>
      {!thirdPartyEventSubmit &&
        (
          <>
            {!urlSubmitting ?
              <div className="event-submit__container">
                <h1 className="black-title text-xl sm:text-3xl md:text-4xl text-gray-50 font-bold lg:pr-10 mt-1 sm:mt-4">Submit event</h1>
                <h1 className="black-title text-base sm:text-xl text-gray-50 mt-1 sm:mt-3">How it works? Find your event landing page.
                  copy and paste the URL here, and finish editing. <br /> For example, you can put any Eventbrite event URL here to upload to Happin.
                </h1>
                <div className="flex items-center justify-center" style={{ margin: 'auto' }}>
                  <div className="event-submit__inner mt-20">
                    <p className="mt-6 text-sm text-gray-400 pb-1">Copy event URL and paste it here</p>
                    <input type="text"
                      value={inputURL}
                      onChange={(event) => { setInputURL(event.target.value) }}
                      className="block w-full px-3 py-2 sm:py-3 border-2 border-solid border-gray-600 rounded-lg bg-gray-900 text-gray-50 text-center transition placeholder-gray-400 hover:border-gray-500 focus:bg-gray-900"
                      placeholder="Enter Event URL" />
                    <button onClick={onURLClickHandler} style={{ width: '100%' }} className="btn btn-yellow !px-0 !font-semibold !rounded-full flex-1 mt-10" >
                      <span className="text-sm sm:text-base">Share event to Happin</span>
                    </button>
                    <br />
                    <p className="black-title text-base sm:text-xl text-gray-50 font-bold  m-8 text-center">OR</p>
                    <button onClick={redirectToTicketingHome} style={{ width: '100%' }} className="btn btn-rose !px-0 !font-semibold !rounded-full" >
                      <span className="text-sm sm:text-base">Create event as organizer</span>
                    </button>
                  </div>
                </div>
              </div> :
              <div className="event-submit__container h-full flex items-center justify-center">
                <div className="flex items-center justify-center " style={{ margin: 'auto', flexDirection: 'column' }}>
                  <Spinner size="xl" color="yellow"></Spinner>
                  <h1 className="black-title text-base sm:text-xl text-gray-50 mt-1 sm:mt-3 font-bold">We are processing the event</h1>
                </div>
              </div>
            }
          </>
        )}
      {thirdPartyEventSubmit && (
        <ThirdPartyEvent
          thirdPartyReadOnlyProps={thirdPartyReadOnlyProps as string[]}
          setThirdPartyReadOnlyProps={setThirdPartyReadOnlyProps}
          thirdPartyEventData={thirdPartyEventData as IThirdPartyEvent}
          setThirdPartyEventSubmit={setThirdPartyEventSubmit}
          setThirdPartyEventData={setThirdPartyEventData}
        />
      )}
    </>
  )
}
