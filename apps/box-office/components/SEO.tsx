import Head from 'next/head';
import { useRouter } from 'next/router';

import {
  SEO_TITLE,
  SEO_DESCRIPTION,
  SEO_KEYWORDS,
  SEO_OG_IMAGE,
  SEO_TWITTER_IMAGE,
  PRODUCTION_URL
} from 'utils/constants';
import React from 'react';

type SEOProps = {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
};

export const SEO: React.FC<SEOProps> = (props) => {
  const {
    description = SEO_DESCRIPTION,
    keywords = SEO_KEYWORDS,
    title = SEO_TITLE,
    ogImage = SEO_OG_IMAGE,
    ogUrl = PRODUCTION_URL,
    twitterImage = SEO_TWITTER_IMAGE
  } = props;
  const router = useRouter();

  return (
    <Head>
      <meta name="description" key="description" content={description} />
      <meta name="keywords" key="keywords" content={keywords} />
      <title>{title}</title>
      <meta property="og:title" key="og:title" content={title} />
      <meta property="og:description" key="og:description" content={description} />
      <meta property="og:image" key="og:image" content={ogImage} />
      <meta property="og:site_name" key="og:site_name" content={SEO_TITLE} />
      <meta property="og:url" key="og:url" content={`${ogUrl}${router.asPath}`} />
      <meta property="og:type" key="og:type" content={'website'} />
      <meta name="twitter:title" key="twitter:title" content={title} />
      <meta name="twitter:description" key="twitter:description" content={description} />
      <meta name="twitter:image" key="twitter:image" content={twitterImage} />
      <meta name="twitter:card" key="twitter:card" content="summary_large_image" />
    </Head>
  );
};
