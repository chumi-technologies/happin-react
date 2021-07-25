import { Image, HStack } from "@chakra-ui/react";

const EventHost = () => {
  return (
    <>
      <div className="black-title text-xl sm:text-2xl font-semibold">Meet Your Host</div>
      <HStack justify="space-between" mt={5}>
        <HStack spacing={{base: 3, sm: 5}}>
          <Image
            borderRadius="full"
            boxSize={10}
            src="/images/profile_pic.png"
            alt="profile picture"
          />
          <div className="font-medium">Happin Staff</div>
        </HStack>
        <button className="btn btn-blue !font-semibold w-24 btn-sm !rounded-full">Contact</button>
      </HStack>
    </>
  );
};

export default EventHost;
