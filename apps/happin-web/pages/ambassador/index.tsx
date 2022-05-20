import React, { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import classNames from "classnames";


export default function Events() {

  return (
    <div className="relative bg-gray-900 text-gray-50 z-0">
      <div className="relative overflow-hidden pt-36 pb-32 md:py-36 lg:py-44 xl:py-56 home__banner">
        <div className="container">
          <div className="absolute -left-14 lg:-left-20 xl:-left-28 top-12 w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-56 xl:h-56 rounded-full bg-yellow-500" />
          <img className="absolute left-14 sm:left-20 md:left-32 lg:left-40 top-8 w-14 lg:w-20 xl:w-24" src="/images/music.png" alt="" />
          <img className="absolute left-40 md:left-1/3 lg:right-auto xl:left-auto xl:right-1/3 top-2 md:top-8 h-20 md:h-28 lg:h-32 xl:h-36" src="/images/mc.png" alt="" />
          <div className="absolute top-10 rounded-full bg-green-500 right-circle">
            <img className="absolute -left-20 md:-left-36 top-20 sm:top-16 lg:top-14 xl:top-20 h-14 md:h-20 lg:h-24 xl:h-28 z-10" src="/images/sge.png" alt="" />
            <img className="absolute -left-16 sm:-left-12 md:-left-16 lg:-left-12 bottom-24 top-auto sm:bottom-auto sm:top-1/2 -mt-8 md:-mt-16 h-14 md:h-20 lg:h-24 xl:h-28 z-10" src="/images/asp.png" alt="" />
            <div className="hidden sm:block absolute left-10 lg:left-20 top-1/2 mt-8 lg:mt-20 w-8 h-8 md:w-14 md:h-14 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full bg-white z-10" />
            <div className="absolute -left-10 top-20 lg:top-28 mt-20 w-4 h-4 lg:w-6 lg:h-6 xl:w-8 xl:h-8 rounded-full bg-white z-10" />
            <div className="absolute left-0 md:-left-28 lg:-left-44 xl:-left-56 -bottom-12 sm:bottom-20 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full bg-rose-500 z-10" />
            <div className="hidden lg:block absolute -left-32 lg:-left-40 xl:-left-1/4 top-8 sm:top-40 lg:top-56 w-10 h-10 md:w-14 md:h-14 lg:w-20 lg:h-20 xl:w-20 xl:h-20 rounded-full bg-yellow-500" />
          </div>
          <div className="relative black-title text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold w-2/3 py-8 md:py-10 lg:py-16 xl:py-24 z-30">
            <div className="absolute left-12 md:left-16 lg:left-20 -top-6 md:-top-14 lg:-top-14 xl:-top-32 w-12 md:w-16 h-2 lg:w-20 lg:h-3 xl:w-24 xl:h-4 home__color-purple" />
            <div className="absolute -left-24 bottom-24 w-8 h-8 rounded-full home__color-pink z-10" />
            <div className="absolute -left-2 lg:-left-16 -bottom-28 lg:-bottom-32 xl:-bottom-40 w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 rounded-full home__color-purple z-10" />
            <img className="absolute left-24 lg:left-40 xl:left-1/2 -bottom-24 sm:-bottom-28 md:-bottom-36 xl:-bottom-48 h-14 md:h-20 lg:h-24 xl:h-28" src="/images/fnl.png" alt="" />
            AMBASSADOR PROGRAM
          </div>
          <div className="relative inline-block text-lg sm:text-xl lg:text-2xl font-semibold pb-0 sm:pb-10 lg:pb-14">
            <img className="absolute top-0 -right-10 w-6 lg:-top-1 lg:-right-12 lg:w-8" src="/images/light.svg" alt="" />
            Attend festivals, parties, events and get paid.
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden pt-14 pb-20 md:py-32 lg:py-40">
        <div className="absolute left-24 md:left-96 top-0 md:top-10 w-6 h-6 md:w-8 md:h-8 rounded-full home__color-pink" />
        <div className="container">
          <div className="black-title text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-rose-500">
            Happin <br/>
            Ambassador
          </div>
          <div className="article-wrapper">
            <h3 id="requirements-to-be-a-long-term-ambassador">Mission:</h3>
            <p>Attend events and bring like-minded people together.</p>

            <h3 id="requirements-to-be-a-long-term-ambassador">If you voluntarily become an event moderator, or receive a new squad reward:</h3>
            <p>You are qualified to be one time ambassador and get benefits by following the procedure.</p>


            <h3 id="requirements-to-be-a-long-term-ambassador">Requirements to be a long-term ambassador:</h3>
            <p>You need to have at least 1k followers on Instagram or Tiktok.</p>
            <p>You are an outgoing person who enjoys connecting with others and loves attending different kinds of events</p>
            <p>You agreed with our vision, and building a community that promotes a fun for all, deep connections, confidence and diversity in interests</p>
            <p>You better tried with one time ambassador once</p>
            <p>Please fillout this form: <a className="link-blue" href="https://forms.gle/4WcnUfggyfehsmYA8" target="_blank" rel="noreferrer">https://forms.gle/4WcnUfggyfehsmYA8</a> to finish apply.</p>
            <h3 id="benefits">Benefits:</h3>
            <p>You will get reimbursed for 50% of ticket price(up to $50).</p>
            <p>Happin will feature your profile</p>
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="min-w-0">
                <h3 id="what-to-do-before-you-attend-an-event">Before you attend an event:</h3>
                <p>Send an email to ambassador@happin.app to tell us </p>
                <p>1.What event you are attending(share Happin event URL with us); and if the event is not on the app yet, please share/submit it using our app or website</p>
                <p>2. Get approval from us, please give us 48 hours to reply back.</p>
                <p>3. After approval, you can create event chat to gather your friends, and other people who is also going from social medias.</p>
                <p>Happin main feature is to let you easily “share & gather” all goers in one chat. People who click on your link and download Happin, system will bring them to your group itself.</p>
              </div>
              <div className="w-60 md:ml-10 shrink-0 mx-auto">
                <img src="/images/before-attend.png" className="w-full mt-10 md:mt-14 rounded-xl border border-solid  border-gray-700" alt="" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="min-w-0">
                <h3 id="what-to-do-during-you-attend-an-event">During you attend an event:</h3>
                <p>Network, talk to other people about Happin, and show QRcode of your event chat to invite them.</p>
                <p>(e.g. You can say Happin is social to-do app, it allows you find fun things to do via friends or check what other cool people are up to.</p>
                <p>Many ambasssadors told us, it is easier to talk to people in groups, so they can all scan your QRcode in once.</p>
                <p>You need to have at least 10 new users in your group chat to get the 50% reimburse.  If you get less than that, we still reward you a free VIP membership.</p>
              </div>
              <div className="w-60 md:ml-10 shrink-0 mx-auto">
                <img src="/images/during-attend.png" className="w-full mt-10 md:mt-14 rounded-xl border border-solid  border-gray-700" alt="" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="min-w-0">
                <h3 id="what-to-do-during-you-attend-an-event">After you attend an event:</h3>
                <p>Tell your group members, they can try the match system to have some fun, or let them follow you to discover more fun things to do.</p>
                <p>Post event content to your social media to keep best memory! Remember to tag our accounts, and comment us like “Better way to attend events, so easy to gather friends and meet new friends”.</p>
                <p>Send an email to ambassador@happin.app and provide:</p>
                <p>1. Your ticket receipt 2. The link to your social media post 3. Screenshot of your group (new users have a special sign) 4. Your PayPal address</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



