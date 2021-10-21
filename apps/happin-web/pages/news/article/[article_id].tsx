import React, { useState } from "react";
import { useRouter } from "next/router";
import Footer from '@components/Footer';
import { Avatar, HStack } from '@chakra-ui/react';


const Article = () => {
  const router = useRouter();
  const { event_id } = router.query;
  return (
    <div>
      <div className="py-6 sm:py-10 md:py-16 lg:py-24">
        <div className="container">
          <div className="text-white article-container">
            <div className="text-center">
              <div className="uppercase text-rose-500 font-semibold mb-3 sm:mb-4">shows</div>
              <h1 className="black-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6">City Hall Live Spotlight - An update!</h1>
            </div>
            <div className="flex items-center justify-center">
              <Avatar boxSize={{base: 6, sm: 8}} src="https://htmlstream.com/space/assets/img/160x160/img9.jpg" />
              <div className="ml-4">
                <div className="font-medium">
                  <span>Christina Kray</span>
                  <span className="mx-3">·</span>
                  <span className="text-sm text-gray-300">May 3, 2021</span>
                </div>

              </div>
            </div>
            <div className="my-7 sm:my-8 md:my-10">
              <img className="w-full rounded-md" src="https://images.chumi.co/cover-5ffde2ded69b3c112a017580-1618335795151.png" alt="" />
            </div>
            <div className="article-content">
              <p>The City Hall Live Spotlight series in partnership with the City of Toronto and the Unison Benevolent Fund have been going off without a hitch! We're so glad you've been enjoying the shows and bringing friends. Due to the new stay-at-home order being enforced, some of the previously stated dates for the City of Toronto Spotlight Series have changed, as well as a new show added!</p>
              <p>Tallies – Thursday, April 15th @ 7:30PM – [Live from Adelaide Hall]</p>
              <p>Tallies effortlessly combine shoegaze, dreampop and surf rock to create soaring soundscapes that are deeply moving and cinematic in nature. Having toured through Canada, the USA, and Europe, we’re looking forward to seeing how they take the digital space!</p>
              <p>Tay Jireh, Divine Lightbody, Dejuan Martin, Mighloe & Tyshan Knight – Thursday, April 22nd @ 7:30PM [Live from Sandbox Studios]</p>
              <p>Tay Jireh is a burgeoning hip-hop artists inspired by the likes of J. Cole, Kendrick Lamar, and J Dilla; his self-produced project ‘Soul Under Pressure’ has set the scene at over a dozen landmark venues across Canada, including the AGO, Harlem Underground, The Mod Club amongst many others. He’s organically built an audience of attentive followers, amassing over 30,000 plays.</p>
              <p>Divine Lightbody is a singer-songwriter inspired by Lauryn Hill and Nina Simone – She’s amassed over 60,000 views on her YouTube channel and her recent single “Bothered” reached over 50,000 streams since its release in May 2020, making it onto a number of Spotify’s illusive curated playlists. With appearances at festivals and platforms including Honey Jam, Talent Nation, and now the City Hall Live Spotlight Series, the up-and-comer has given us plenty to be excited about!</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Article;
