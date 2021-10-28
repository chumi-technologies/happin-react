import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Footer from '@components/Footer';
import { SearchIcon } from '@chakra-ui/icons';
import { getBlogByName, getBlogListBrief } from "lib/api";
import moment from "moment";


const NewsList = () => {
  const pageSize = useRef(6);
  const [blogList, setBlogList] = useState<any[]>([]);
  const [maxPageNumber, setMaxPageNumber] = useState<number>(0);
  const [searchWords, setSearchWords] = useState<string| undefined>(undefined)
  const [pagenumber, setPageNumber] = useState<number>(0);

  const [reset, setReset] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (searchWords === '') { setBlogList([]); setReset(s=>!s); setPageNumber(0); return }
    if (!searchWords ) return
    const timeout = setTimeout(async () => {
      const result = await getBlogByName(searchWords as string, 0, pageSize.current);
      setBlogList(result.blogs);
      setMaxPageNumber(result.maxPageNumber);
    }, 500)
    return () => {
      clearTimeout(timeout)
    }
  }, [searchWords]);

  const getBlogList = async (pagenumber: number) => {
    try {
      const response = await getBlogListBrief(pagenumber, pageSize.current);
      setBlogList(s => [...s, ...response.blogs]);
      setMaxPageNumber(response.maxPageNumber);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getBlogList(pagenumber)
  }, [pagenumber, reset])


  return (
    <div>
      <div className="news__banner text-center text-white py-12 sm:py-16 lg:py-24">
        <div className="container">
          <h1 className="black-title text-3xl sm:text-5xl lg:text-6xl font-bold mb-5 sm:mb-6 md:mb-8 lg:mb-10">News</h1>
          <div className="news__search">
            <label htmlFor="search" className="absolute left-6 leading-none inline-flex transition">
              <SearchIcon w={4} h={4} color="currentColor" />
            </label>
            <input id="search" type="text" className="news__search-input" value={searchWords} onChange={(event) => { setSearchWords(event.target.value) }} placeholder="Search..." />
          </div>
        </div>
      </div>
      <div className="py-6 sm:py-10 md:py-16 lg:py-24">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {blogList.map(blog =>
              <div key={blog._id} className="relative flex flex-col bg-white bg-opacity-5 border border-solid border-gray-900 rounded-md overflow-hidden text-white">
                <Link href={`/news-list/article/${blog.urlTitle}`}>
                  <a className="aspect-h-9 aspect-w-16">
                    <img src={blog.covername.startsWith('https://') ? blog.covername : 'https://images.chumi.co/' + blog.covername}
                      className="w-full h-full object-cover transition hover:opacity-80" />
                  </a>
                </Link>
                <div className="px-4 sm:px-5 lg:px-6 py-5 sm:py-6 lg:py-7">
                  <div className="flex justify-between items-center mb-3">
                  {blog?.tags?.map((tag: string) => <div key={tag} className="inline-flex py-0.5 px-2 bg-yellow-500 text-black text-xs rounded-md font-medium">{tag}</div>)}
                  <div className="text-sm text-gray-300 font-medium">{moment(blog.postDate).format('MMM DD, YYYY')}</div>
                  </div>
                  <Link href={`/news-list/article/${blog.urlTitle}`}>
                    <a className="block font-semibold mb-3 text-lg transition hover:text-rose-500">{blog.title}</a>
                  </Link>
                  <p className="ellipsis-3 text-sm text-gray-200">{blog.subDescription}</p>
                </div>
              </div>
            )}
          </div>
          {pagenumber < maxPageNumber - 1 &&
            <div className="mt-6 sm:mt-10 text-center">
              <button className="btn btn-outline-light !px-6" onClick={() => { setPageNumber(s => s + 1) }}>Load More</button>
            </div>
          }
        </div>
      </div>
      <Footer />
    </div>
  )
}
export default NewsList
