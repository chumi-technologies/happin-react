import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Image } from "@chakra-ui/react";

const Community = () => {
  const router = useRouter();
  const [info, setInfo] = useState({
    name: '',
    avatar: '',
    link: '',
    tag: '',
  });

  useEffect(() => {
    setInfo({
      name: router.query.af_referrer_name as string,
      avatar: router.query.af_referrer_image_url as string,
      tag: router.query.tag as string,
      link: router.query.inviteUrl as string
    })
  }, [router.query]);

  return (
    <>
      <Head>
        <title>Community Tag</title>
      </Head>
      <div className="w-full overflow-y-auto max-w-md mx-auto">
        <div className="px-4 pt-4 pb-10">
          <div className="rounded-2xl bg-gray-100">
            <div className="px-5 pt-5">
              <div className="flex items-center pb-5 border-b-2 border-dashed border-gray-300">
                <Image
                  className="rounded-lg w-14 h-14 object-cover"
                  alt={info.name}
                  src={info.avatar}
                  fallbackSrc="/images/avatar-default.svg"
                />
                <div className="ml-4 flex-1 min-w-0">
                  <div className="font-bold text-lg text-gray-900 mb-0.5">
                    {info.name}
                  </div>
                  <div className="font-semibold text-[15px] text-gray-600">
                    invites you to the community
                  </div>
                </div>
              </div>
            </div>
            <div className="relative pt-2 pb-1 pl-3">
              <div className="community__code">#{info.tag}</div>
              <img
                className="w-full"
                src="/images/community-banner.png"
                alt=""
              />
            </div>
          </div>
          <div className="mt-5 mb-10 text-gray-900 text-center font-semibold">
            By joining their tags, your will be matched with others who also
            select the same tag
          </div>
          <div className="px-2">
            <a
              className="black-title btn bg-[#FFDE4B] active:bg-[#ffea8a] rounded-md !font-bold block w-full !py-3.5 !text-xl text-center"
              href={info.link}
            >
              Join the community
            </a>
            <div className="mt-4 font-semibold text-gray-400 text-center">
              If you are new user of Happin, you can download the app first and
              enter the tag while selecting your interests.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Community;
