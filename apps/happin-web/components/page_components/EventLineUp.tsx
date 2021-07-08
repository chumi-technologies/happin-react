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
            fontSize="sm"
            w="116px"
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
      <Text mt="40px" fontSize="xl">
        Line Up
      </Text>
      <Grid
        mt="24px"
        gridTemplateColumns="repeat(auto-fit, 116px)"
        columnGap="16px"
        rowGap="40px"
      >
        {lineUp.map((lineUpTile: any, i: Number) => {
          return <LineUpTile key={i} lineUpTile={lineUpTile} />;
        })}
      </Grid>
    </>
  );
};

export default EventLineUp;
