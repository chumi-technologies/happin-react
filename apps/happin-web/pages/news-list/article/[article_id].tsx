import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Footer from '@components/Footer';
import { GetServerSidePropsResult } from "next";
import { getBlogById, getBlogByURLTitle } from "lib/api";
import moment from "moment";
import Head from "next/head";
import _ from 'lodash';

interface IArticle {
  author: string;
  blogSource: string;
  content: string;
  covername: string;
  postDate: string;
  seodescription: string;
  seokeywords: string;
  tags: string[];
  title: string;
  urlTitle: string;
}

const Article = (props: IArticle) => {
  const router = useRouter();
  const [blog, setBlog] = useState<IArticle>();
  const [isPreview, setIsPreview] = useState<boolean>(false);

  useEffect(()=> {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (router.query.preview) {
      setIsPreview(true);
      window.addEventListener('message', (event) => {
        if (typeof event.data === 'object') {
          const data = event.data;
          if (data['previewContent']) {
            const preview: IArticle = data['previewContent'];
            preview.covername = data['cover']
            setBlog(preview);
          }
        }
      });
    }
  }, [router])
  useEffect(()=>{
    document.documentElement.style.background = "#fff"
    return () =>{
      document.documentElement.style.removeProperty('background')
    }
  },[])

  return (
    <>
      <Head>
        <meta name="description" key="description" content={props.seodescription} />
        <meta name="keywords" key="keywords" content={props.seokeywords} />
        <title>{props.title}</title>
        <meta property="og:image" key="og:image" content={props?.covername?.startsWith('https://') ? props?.covername : 'https://images.chumi.co/' + props?.covername} />
        <meta property="og:title" key="og:title" content={props.title} />
        <meta property="og:description" key="og:description" content={props.seodescription} />
        <meta property="og:site_name" key="og:site_name" content={props.title} />
        <meta property="og:type" key="og:type" content={'website'} />
        <meta name="twitter:title" key="twitter:title" content={props.title} />
        <meta name="twitter:description" key="twitter:description" content={props.seodescription} />
      </Head>
      <div>
        {!isPreview ?
          <div className="py-6 sm:py-10 md:py-16 lg:py-24 bg-white">
            <div className="container">
              <div className="article-container">
                <div className="text-center">
                  {props?.tags?.map(tag => <div key={tag} className="uppercase text-rose-500 font-semibold mb-3 sm:mb-4">{tag}</div>)}
                  <h1 className="black-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6">{props?.title}</h1>
                </div>
                <div className="flex items-center justify-center">
                  <div className="ml-4">
                    <div className="font-medium">
                      <span>{props?.author}</span>
                      <span className="mx-3">·</span>
                      <span className="text-sm text-gray-600">{moment(props?.postDate).format('MMM DD, YYYY')}</span>
                    </div>

                  </div>
                </div>
                <div className="my-7 sm:my-8 md:my-10">
                  <img className="w-full rounded-md" src={props?.covername?.startsWith('https://') ? props?.covername : 'https://images.chumi.co/' + props?.covername} alt="" />
                </div>
                <div className="article-content" dangerouslySetInnerHTML={{ __html: props?.content }}>
                </div>
              </div>
            </div>
          </div> :
          <div className="py-6 sm:py-10 md:py-16 lg:py-24 bg-white">
            <div className="container">
              <div className="text-white article-container">
                <div className="text-center">
                  {blog?.tags.map(tag => <div key={tag} className="uppercase text-rose-500 font-semibold mb-3 sm:mb-4">{tag}</div>)}
                  <h1 className="black-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6">{blog?.title}</h1>
                </div>
                <div className="flex items-center justify-center">
                  <div className="ml-4">
                    <div className="font-medium">
                      <span>{blog?.author}</span>
                      <span className="mx-3">·</span>
                      <span className="text-sm text-gray-600">{blog && moment(blog.postDate).format('MMM DD, YYYY')}</span>
                    </div>

                  </div>
                </div>
                <div className="my-7 sm:my-8 md:my-10">
                  <img className="w-full rounded-md" src={blog?.covername} alt="" />
                </div>
                <div className="article-content" dangerouslySetInnerHTML={{ __html: blog?.content as string }}>
                </div>
              </div>
            </div>
          </div>
        }

        <Footer />
      </div>
    </>
  );
};

export default Article;

export async function getServerSideProps(context: { params: { article_id: string } }): Promise<GetServerSidePropsResult<any>> {
  try {
    const articleTitle = context.params.article_id;
    let result;
    if (articleTitle.includes('-')) {
      result = await getBlogByURLTitle(articleTitle);
    } else {
      result = await getBlogById(articleTitle);
    }
    const props = result;

    if (_.isEmpty(result) && articleTitle !== '5fcc40be77e25200098835df') {
      throw new Error('Article not found');
    }
    return {
      props,
    }
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: "/404",
      },
      props: {},
    };
  }
}
