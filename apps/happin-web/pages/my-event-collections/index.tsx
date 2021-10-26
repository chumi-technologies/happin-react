import { VStack, Spinner, Tooltip } from '@chakra-ui/react';
import { SearchIcon, QuestionIcon } from "@chakra-ui/icons";
import { useUserState } from 'contexts/user-state';
import { getEventCollections } from 'lib/api';
import { User } from 'lib/model/user';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ICollectionData } from 'pages/event-collection/[set_id]';
import { useEffect, useState } from 'react';

export default function MyEventSets() {

  const [collections, setCollections] = useState<ICollectionData[]>();
  const { user } = useUserState();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!localStorage.getItem('happin_web_jwt') && !localStorage.getItem('happin_refresh_token')) {
      router.push('/')
    }
  })

  useEffect(() => {
    if (user) {
      getMyCollections(user)
    }
  }, [user])

  const getMyCollections = async (user: User) => {
    try {
      const response = await getEventCollections(user._id);
      setCollections(response.data);
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="create-event-collection__container">
        <div className="lg:pr-10 mt-1 sm:mt-4 black-title flex" style={{ justifyContent: 'space-between' }}>
          <h1 className=" text-xl sm:text-3xl md:text-4xl text-white font-bold " style={{position: 'relative'}}>Your event collections&nbsp;
          <Tooltip label="Collection page is your unique channel to show all of your recommended events. You can share it with your community, so members can consistently follow you and attend events." >
            <QuestionIcon style={{position: 'absolute', top: '0'}} color="white" className="text-sm"/>
          </Tooltip></h1>            
          <button onClick={() => { router.push('/create-event-collection') }} style={{ width: '200px' }} className="btn btn-yellow !px-0 !font-semibold !rounded-full" >
            <span className="text-sm sm:text-base">Create new collection</span>
          </button>
        </div>

        <br />
        <div className="flex flex-col h-full">
          <div className="flex-1 h-0 web-scroll overflow-y-auto">
            <div className="container">
              <div className="py-5">
                {loading ?
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Spinner color="yellow" size="xl" />
                  </div>
                  :
                  <VStack alignItems="stretch" spacing={{ base: 5, sm: 8 }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:grid-cols-3">
                      {!collections?.length ?
                        <>
                          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <h1 className="black-title text-base sm:text-xl text-white mt-1 sm:mt-3">You {`don't`} have any collections, please create one first.</h1>
                          </div>
                        </>
                        :
                        <>
                          {
                            collections?.map(data =>
                              <div key={data._id} className="group cursor-pointer">
                                <div className="relative">
                                  <Link href={`/create-event-collection?id=${data._id}`}>
                                    <div className="aspect-w-16 aspect-h-9">
                                      <div className="bg-black bg-opacity-0 group-hover:bg-opacity-20 transition z-10" />
                                      <img src={data.cover}
                                        alt={data.title}
                                        className="w-full h-full object-center object-cover rounded-md" />
                                    </div>
                                  </Link>
                                </div>
                                <Link href={`/create-event-collection?id=${data._id}`}>
                                  <div className="mt-3">
                                    <div className="truncate text-white font-semibold mb-2 group-hover:text-rose-500 transition">{data.title}
                                    </div>
                                  </div>
                                </Link>
                              </div>)
                          }
                        </>}
                    </div>
                  </VStack>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
