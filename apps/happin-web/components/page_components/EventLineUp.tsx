import { Box, Image, Text, VStack, Grid } from "@chakra-ui/react";

const LineUpTile = ({ lineUpTile }: any) => {
  return (
    <>
      <Box>
        <VStack justify="center" align="center">
          <Image
            borderRadius="full"
            boxSize="48px"
            src={lineUpTile.profileImageURL}
            alt="profile picture"
          ></Image>
          <Text
            fontSize={{ base: "xs", sm: "sm" }}
            w={{ base: "64px", sm: "116px" }}
            maxH="2.4rem"
            align="center"
            // whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {lineUpTile.name}
          </Text>
        </VStack>
      </Box>
    </>
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
      name: "CardiCardiCardiCiC...",
      profileImageURL: "/images/profile_pic.png",
    },
    {
      name: "CardiCardiCardiCiC...",
      profileImageURL: "/images/profile_pic.png",
    },
  ];
  return (
    <>
      <Text textStyle="sectionTitle">Line Up</Text>
      <Grid
        mt={{ base: "16px", sm: "24px" }}
        gridTemplateColumns={{
          // base: "repeat(auto-fit, 64px)",
          base: "repeat(100, 1fr)",
          sm: "repeat(auto-fit, 116px)",
        }}
        columnGap="16px"
        rowGap={{ base: "16px", sm: "40px" }}
        overflowX="auto"
      >
        {lineUp.map((lineUpTile: any, i: Number) => {
          return <LineUpTile key={i} lineUpTile={lineUpTile} />;
        })}
      </Grid>
    </>
  );
};

export default EventLineUp;
