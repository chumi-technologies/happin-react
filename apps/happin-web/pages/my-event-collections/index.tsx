import { Spinner, toast, Tooltip, useToast } from '@chakra-ui/react';
import { QuestionIcon } from '@chakra-ui/icons';
import { useUserState } from 'contexts/user-state';
import { getEventCollections } from 'lib/api';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ICollectionData } from 'pages/event-collection/[collection_id]';
import React, { useEffect, useState } from 'react';
import { Plus } from '@icon-park/react';
import { useSSOState } from '../../contexts/sso-state';

export default function MyEventSets() {
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<ICollectionData[]>([]);
  const { user } = useUserState();
  const router = useRouter();
  const { showSSOSignUp } = useSSOState();
  const toast = useToast();

  const generateToast = (message: string) => {
    toast({
      title: message,
      position: 'top',
      isClosable: true,
    })
  }

  useEffect(() => {
    (async () => {
      if (!localStorage.getItem('happin_web_jwt') && !localStorage.getItem('happin_refresh_token')) {
        await router.push('/');
      }
    })();
  });

  useEffect(() => {
    let isMounted = true;
    if (user) {
      (async () => {
        try {
          const res = await getEventCollections(user._id);
          isMounted && setCollections(res.data);
        } catch (err) {
          console.log(err);
        } finally {
          isMounted && setLoading(false);
        }
      })();
    }
    return () => { isMounted = false };
  }, [user]);

  const handleCreate = async () => {
    if (!user && !localStorage.getItem('chumi_jwt')) {
      generateToast('To continue, please log in or sign up ');
      showSSOSignUp('Fan');
      return
    }
    await router.push('/create-event-collection');
  }

  return (
    <div className="container flex flex-col flex-1 z-0">
      <div
        className="flex items-center pb-5 md:pb-7 mt-2 md:mt-4 border-b border-gray-800">
        <h1 className="flex-1 black-title text-2xl sm:text-3xl md:text-4xl text-gray-50 font-bold">
          <span className="mr-3">Your event collections</span>
          <Tooltip
            bg="gray.800" borderRadius="md" p={3} hasArrow arrowSize={8} shouldWrapChildren
            label="Collection page is your unique channel to show all of your recommended events. You can share it with your community, so members can consistently follow you and attend events.">
            <QuestionIcon color="white" className="text-sm" />
          </Tooltip>
        </h1>
        <div className="sm:static fixed bottom-0 left-0 right-0 z-50">
          <button
            className="btn btn-yellow flex w-full sm:w-auto sm:inline-flex justify-center items-center !font-semibold !rounded-none sm:!rounded-full"
            onClick={handleCreate}
          >
            <Plus theme="outline" size="16" fill="#121212" strokeWidth={5} />
            <span className="ml-2">Create new collection</span>
          </button>
        </div>
      </div>
      <div className="relative flex-1 py-6 md:py-8">
        {
          loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner
                thickness="4px"
                speed="0.65s"
                color="yellow.500"
                size="xl"
              />
            </div>
          ) : (
            <>
              {
                !collections?.length ? (
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <img src="/images/icons/collection-empty.png" className="w-24" alt="" />
                    <div className="my-3 sm:my-5 text-center">
                      <div className="text-xl text-gray-200 font-medium">No collections</div>
                      <div className="text-gray-400 mt-1">Please create one first</div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-8 lg:grid-cols-3">
                    {
                      collections?.map(data => (
                        <div key={data._id} className="group cursor-pointer">
                          <div className="relative">
                            <Link href={`/create-event-collection/edit/${data._id}`}>
                              <a className="block aspect-w-16 aspect-h-9">
                                <div
                                  className="bg-black bg-opacity-0 group-hover:bg-opacity-20 transition z-10" />
                                <img
                                  src={data.cover}
                                  alt={data.title}
                                  className="w-full h-full object-center object-cover rounded-md"
                                />
                              </a>
                            </Link>
                          </div>
                          <Link href={`/create-event-collection?id=${data._id}`}>
                            <a
                              className="block mt-3 text-gray-50 font-semibold group-hover:text-rose-500 transition">{data.title}</a>
                          </Link>
                        </div>
                      ))
                    }
                  </div>
                )
              }
            </>
          )
        }
        <div className="h-12 sm:hidden" />
      </div>
    </div>
  );
}
