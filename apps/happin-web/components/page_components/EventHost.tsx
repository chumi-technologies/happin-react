import { Image, HStack } from "@chakra-ui/react";

type EventHostProps = {
  hostName?: string;
  hostProfileImageUrl?:string;
}

const EventHost = (props : EventHostProps) => {
  return (
    <>
      <div className="black-title text-xl sm:text-2xl font-semibold">Meet Your Host</div>
      <HStack justify="space-between" mt={5}>
        <HStack spacing={{base: 3, sm: 5}}>
          <Image
            borderRadius="full"
            boxSize={10}
            src={`${props.hostProfileImageUrl || "/images/profile_pic.png"}`}
            alt="profile picture"
          />
          <div className="font-medium">{props.hostName}</div>
        </HStack>
        {/* <button className="btn btn-blue !font-semibold w-24 btn-sm !rounded-full">Contact</button> */}
      </HStack>
    </>
  );
};

export default EventHost;
