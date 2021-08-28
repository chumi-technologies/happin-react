import { HStack, Avatar } from "@chakra-ui/react";
import React from "react";

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
        <Avatar boxSize={10} src={props.hostProfileImageUrl} name={props.hostName} />
        <div className="font-medium">{props.hostName}</div>
        </HStack>
        {/* <button className="btn btn-blue !font-semibold w-24 btn-sm !rounded-full">Contact</button> */}
      </HStack>
    </>
  );
};

export default React.memo(EventHost);
