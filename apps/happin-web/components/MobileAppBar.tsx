import { HStack } from "@chakra-ui/react";

const MobileAppBar = ({ setIsMobileBarOpen }: any) => {
  return (
    <>
      <div className="px-4 py-4 text-white bg-rose-500">
        <div className="text-sm font-bold">
          Happin is better on the app, try our event social app now!
        </div>
        <HStack mt={3}>
          <button className="btn btn-outline-white btn-sm !rounded-full" onClick={() => {
            setIsMobileBarOpen(false);
          }}>Not Now</button>
          <div className="flex-1">
            <button className="w-full btn btn-dark-pure btn-sm !rounded-full" onClick={() => {
              setIsMobileBarOpen(false);
              location.href = "#";
            }}>Switch to the App</button>
          </div>
        </HStack>
      </div>
    </>
  );
};

export default MobileAppBar;
