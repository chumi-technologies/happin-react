import { Box } from "@chakra-ui/react";

const PopUpOverlay = ({ children }: any) => {
  return (
    <>
      <Box
        w="100%"
        bg="brandGrey.500"
        borderRadius="10px"
        border="1px solid #454545"
        p="16px"
        zIndex="1"
      >
        {children}
      </Box>
    </>
  );
};

export default PopUpOverlay;
