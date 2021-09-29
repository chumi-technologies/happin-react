import { HStack } from "@chakra-ui/react";
import { useUserState } from "contexts/user-state";

const MobileAppBar = ({ setIsMobileBarOpen }: { setIsMobileBarOpen: any }) => {
  const { eventDeepLink } = useUserState();

  const closeMobileBar = () => {
    localStorage.setItem('hide_mobile_bar', '1');
    setIsMobileBarOpen((s: any) => !s);
  }
  return (
    <>
     <div className="px-4 py-4 text-white bg-rose-500 sm:hidden">
        <div className="text-sm font-bold">
          Happin is better on app, try our event social app!
        </div>
        <HStack mt={3}>
          <button className="btn btn-outline-white btn-sm !rounded-full" onClick={() => {
            closeMobileBar()
          }}>Not Now</button>
          <div className="flex-1">
            <button className="w-full btn btn-dark-pure btn-sm !rounded-full" onClick={() => {
              setIsMobileBarOpen(false);
              location.href = eventDeepLink || process.env.NEXT_PUBLIC_HAPPIN_APP_APPLE_STORE as string;
            }}>Download the App</button>
          </div>
        </HStack>
      </div>
    </>
  );
};

export default MobileAppBar;
