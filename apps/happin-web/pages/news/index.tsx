import React, { useState } from "react";
import Link from "next/link";
import Footer from '@components/Footer';
import { SearchIcon } from '@chakra-ui/icons';

const News = () => {
  return (
    <div>
      <div className="news__banner text-center text-white py-12 sm:py-16 lg:py-24">
        <div className="container">
          <h1 className="black-title text-3xl sm:text-5xl lg:text-6xl font-bold mb-5 sm:mb-6 md:mb-8 lg:mb-10">NEWS</h1>
          <div className="news__search">
            <label htmlFor="search" className="absolute left-6 leading-none inline-flex transition">
              <SearchIcon w={4} h={4} color="currentColor" />
            </label>
            <input id="search" type="text" className="news__search-input" placeholder="Search..." />
          </div>
        </div>
      </div>
      <div className="py-6 sm:py-10 md:py-16 lg:py-24">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            <div className="relative flex flex-col bg-white bg-opacity-5 border border-solid border-gray-900 rounded-md overflow-hidden text-white">
              <Link href="/">
                <a className="aspect-h-9 aspect-w-16">
                  <img src="https://leap.mediumra.re/assets/img/article-3.jpg"
                       className="w-full h-full object-cover transition hover:opacity-80" />
                </a>
              </Link>
              <div className="px-4 sm:px-5 lg:px-6 py-5 sm:py-6 lg:py-7">
                <div className="flex justify-between items-center mb-3">
                  <div className="inline-flex py-0.5 px-2 bg-yellow-500 text-black text-xs rounded-md font-medium">Artist Resources</div>
                  <div className="text-sm text-gray-300 font-medium">Apr 21, 2021</div>
                </div>
                <Link href="/">
                  <a className="block font-semibold mb-3 text-lg transition hover:text-rose-500">A Livestream Equipment Checklist</a>
                </Link>
                <p className="ellipsis-3 text-sm text-gray-200">To pull off a professional-looking live stream, you might think you need a whole teams effort or a production studio worth of equipment and the truth is that’s simply not the case. Finding what kind of equipment you need can be confusing, so here are some recommendations that should help you find your footing. </p>
              </div>
            </div>
            <div className="relative flex flex-col bg-white bg-opacity-5 border border-solid border-gray-900 rounded-md overflow-hidden text-white">
              <Link href="/">
                <a className="aspect-h-9 aspect-w-16">
                  <img src="https://images.chumi.co/cover-5ffde2ded69b3c112a017580-1618335795151.png"
                       className="w-full h-full object-cover transition hover:opacity-80" />
                </a>
              </Link>
              <div className="px-4 sm:px-5 lg:px-6 py-5 sm:py-6 lg:py-7">
                <div className="flex justify-between items-center mb-3">
                  <div className="inline-flex py-0.5 px-2 bg-rose-500 text-xs rounded-md font-medium">Shows</div>
                  <div className="text-sm text-gray-300 font-medium">Apr 21, 2021</div>
                </div>
                <Link href="/">
                  <a className="block font-semibold mb-3 text-lg transition hover:text-rose-500">City Hall Live Spotlight - An update!</a>
                </Link>
                <p className="ellipsis-3 text-sm text-gray-200">Happin is proud to present, in partnership with the City of Toronto, the Spotlight Series – in benefit of the Unison Benevolent Fund. A number of shows have been added as well as rescheduled due to the recent stay-at-home order; get the updates!</p>
              </div>
            </div>
            <div className="relative flex flex-col bg-white bg-opacity-5 border border-solid border-gray-900 rounded-md overflow-hidden text-white">
              <Link href="/">
                <a className="aspect-h-9 aspect-w-16">
                  <img src="https://images.chumi.co/cover-5ffde2ded69b3c112a017580-1618245621815.jpeg"
                       className="w-full h-full object-cover transition hover:opacity-80" />
                </a>
              </Link>
              <div className="px-4 sm:px-5 lg:px-6 py-5 sm:py-6 lg:py-7">
                <div className="flex justify-between items-center mb-3">
                  <div className="inline-flex py-0.5 px-2 bg-yellow-500 text-black text-xs rounded-md font-medium">Artist Resources</div>
                  <div className="text-sm text-gray-300 font-medium">Apr 21, 2021</div>
                </div>
                <Link href="/">
                  <a className="block font-semibold mb-3 text-lg transition hover:text-rose-500">Set Design for Livestream</a>
                </Link>
                <p className="ellipsis-3 text-sm text-gray-200">Being able to perform from the comfort of your home studio is a huge plus for anyone that’s ever had to move and set up a drum kit, but just as home studios have a certain make-shift quality to them, they might not be incredibly visually appealing and the kind you want to host a show out of. With some help, you can take the quality of your streams from amateur to pro with these few considerations.</p>
              </div>
            </div>
          </div>
          <div className="mt-6 sm:mt-10 text-center">
            <button className="btn btn-outline-light !px-6">Load More</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
export default News
