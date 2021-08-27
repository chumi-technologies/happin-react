import { Image } from "@chakra-ui/react";

const LineUpTile = ({ lineUpTile }: any) => {
  return (
    <div className="px-1 sm:px-2">
      <div className="text-center w-20 sm:w-auto">
        <Image
          borderRadius="full"
          mx="auto"
          boxSize={{ base: 12, md: 14 }}
          src={lineUpTile.profileImageURL}
          alt="profile picture"
        />
        <div className="ellipsis-2 mt-2 text-sm">{lineUpTile.name}</div>
      </div>
    </div>
  );
};

const EventLineUp = () => {
  const lineUp = [
    { name: "Cardi B", profileImageURL: "/images/profile_pic.png" },
    { name: "Alexandar Wang", profileImageURL: "/images/profile_pic.png" },
    { name: "Black Pink", profileImageURL: "/images/profile_pic.png" },
    { name: "Cardi B", profileImageURL: "/images/profile_pic.png" },
    { name: "Alexandar Wang", profileImageURL: "/images/profile_pic.png" },
    { name: "Black Pink", profileImageURL: "/images/profile_pic.png" },
    {
      name: "CardiCardiCardiCard",
      profileImageURL: "/images/profile_pic.png",
    },
    {
      name: "CardiCardiCardiCard",
      profileImageURL: "/images/profile_pic.png",
    },
  ];
  return (
    <>
      <div className="black-title text-xl sm:text-2xl font-semibold">Line Up</div>
      <div className="flex overflow-x-auto hide-scrollbar sm:grid sm:grid-cols-4 sm:gap-x-4 sm:gap-y-6 mt-5 sm:mt-8">
        {lineUp.map((lineUpTile: any, i: Number) => {
          return <LineUpTile key={i} lineUpTile={lineUpTile} />;
        })}
      </div>
    </>
  );
};

export default EventLineUp;
