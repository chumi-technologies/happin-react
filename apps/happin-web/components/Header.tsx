import {
  Box,
  Stack,
  Image,
  Link,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export default function Header() {
  return (
    <>
      <Box
        bg="black"
        w="100%"
        h="88px"
        color="white"
        pos="absolute"
        top="0"
        left="0"
      >
        <Stack h="100%" direction="row" align="center" justify="space-around">
          <Image
            w="150px"
            objectFit="contain"
            src="/images/happin.png"
            alt="Happin"
          />
          <Link href="#" fontSize="xs" color="white">
            Explore events
          </Link>
          {/* <Image
            w="267px"
            objectFit="contain"
            src="/images/search.png"
            alt="Search"
          /> */}
          <InputGroup w="267px" h="44px">
            <InputLeftElement
              h="100%"
              pointerEvents="none"
              children={<SearchIcon color="gray.500" />}
            />
            <Input
              h="100%"
              variant="outline"
              placeholder="Search"
              borderRadius="full"
            />
          </InputGroup>
          <Link href="#" fontSize="xs" color="white">
            Host Event
          </Link>
          <Image
            w="83px"
            objectFit="contain"
            src="/images/profile.png"
            alt="Profile"
          />
        </Stack>
        {/* <div className="lg:flex lg:items-center lg:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Back End Developer
            </h2>
            <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                Full-time
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                Remote
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                $120k &ndash; $140k
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                Closing on January 9, 2020
              </div>
            </div>
          </div>
          <div className="mt-5 flex lg:mt-0 lg:ml-4">
            <span className="hidden sm:block">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit
              </button>
            </span>

            <span className="hidden sm:block ml-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View
              </button>
            </span>

            <span className="sm:ml-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Publish
              </button>
            </span>
          </div>
        </div> */}
      </Box>
    </>
  );
}
