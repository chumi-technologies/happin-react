import { Box } from "@chakra-ui/react";

const ImageSection = () => {
  return (
    <>
      <Box
        w="100%"
        h="100%"
        backgroundImage="url('/images/pic.png')"
        backgroundPosition="center"
        backgroundRepeat="no-repeat"
        backgroundSize="cover"
      ></Box>
    </>
  );
};

export default ImageSection;
