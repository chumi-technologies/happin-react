import { SEO } from "@components/SEO";
import { Box, Button, DarkMode, Stack } from "@chakra-ui/react";

export default function Home() {
  return (
    <>
      <SEO />
      <Box bg="black">
        <Stack padding={4} spacing={4} direction="row" align="center">
          <Button colorScheme="rose" size="xs">
            Button
          </Button>
          <Button colorScheme="rose" size="sm">
            Button
          </Button>
          <Button colorScheme="rose" size="md" borderRadius="full">
            Button
          </Button>
          <Button colorScheme="rose" size="lg">
            Button
          </Button>
          <Button colorScheme="rose" variant="outline">
            Button
          </Button>
          <Button colorScheme="rose" variant="ghost">
            Button
          </Button>
          <Button colorScheme="rose" variant="link">
            Button
          </Button>
        </Stack>
        <Stack padding={4} spacing={4} direction="row" align="center">
          <Button colorScheme="yellow" size="xs">
            Button
          </Button>
          <Button colorScheme="yellow" size="sm">
            Button
          </Button>
          <Button colorScheme="yellow" size="md" borderRadius="full">
            Button
          </Button>
          <Button colorScheme="yellow" size="lg">
            Button
          </Button>
          <Button colorScheme="yellow" variant="outline">
            Button
          </Button>
          <Button colorScheme="yellow" variant="ghost">
            Button
          </Button>
          <Button colorScheme="yellow" variant="link">
            Button
          </Button>
        </Stack>
        <Stack padding={4} spacing={4} direction="row" align="center">
          <Button colorScheme="blue" size="xs">
            Button
          </Button>
          <Button colorScheme="blue" size="sm">
            Button
          </Button>
          <Button colorScheme="blue" size="md" borderRadius="full">
            Button
          </Button>
          <Button colorScheme="blue" size="lg">
            Button
          </Button>
          <Button colorScheme="blue" variant="outline">
            Button
          </Button>
          <Button colorScheme="blue" variant="ghost">
            Button
          </Button>
          <Button colorScheme="blue" variant="link">
            Button
          </Button>
        </Stack>
      </Box>
    </>
  );
}
