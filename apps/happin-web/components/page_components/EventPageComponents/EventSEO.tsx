import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { EventData } from 'lib/model/event';
import { PRODUCTION_URL } from 'utils/constants';
import { useRouter } from 'next/router';

type EventSEOProps = {
  eventData: EventData
}
const EventSEO = ({ eventData }: EventSEOProps) => {
  const router = useRouter();
  const [location, setLocation] = useState('Stream Via Happin');
  const [description, setDescription] = useState(
    ' - You can watch livestream on https://livestream.happin.app or download Happin App',
  );
  const [seo, setSeo] = useState({
    description: '',
    keywords: '',
    title: '',
    ogImage: '',
    ogUrl: '',
    twitterImage: '',
  });

  useEffect(() => {
    const acInfo = eventData.event.acInfo;
    if (acInfo.location !== 'happin.app' && acInfo.eventType !== 'hybrid') {
      setLocation(acInfo.venueName || acInfo.location);
      setDescription(
        ` - You can attend event @ ${acInfo.venueName || acInfo.location}`,
      );
    }
    if (acInfo.eventType === 'hybrid') {
      setLocation(
        acInfo.venueName || acInfo.location + ' and Stream Via Happin',
      );
      setDescription(
        ` - You can attend event @ ${
          acInfo.venueName || acInfo.location
        } and watch livestream on https://happin.app or download Happin App`,
      );
    }
  }, [eventData.event.acInfo]);

  useEffect(() => {
    setSeo({
      description: eventData.event.title + description,
      keywords: `${eventData.event?.tags.toString()}, Happin livestream`,
      title: eventData.event.title + ' @ ' + location,
      ogImage: eventData.event?.socialImg || eventData.event?.cover,
      ogUrl: `${PRODUCTION_URL}${router.asPath}`,
      twitterImage: eventData.event?.socialImg || eventData.event?.cover,
    });
  }, [location, description, eventData, router.asPath]);

  return (
    <Head>
      <meta name="description" key="description" content={seo.description} />
      <meta name="keywords" key="keywords" content={seo.keywords} />
      <title>{seo.title}</title>
      <meta property="og:title" key="og:title" content={seo.title} />
      <meta
        property="og:description"
        key="og:description"
        content={seo.description}
      />
      <meta property="og:image" key="og:image" content={seo.ogImage} />
      <meta property="og:site_name" key="og:site_name" content={seo.title} />
      <meta property="og:url" key="og:url" content={seo.ogUrl} />
      <meta property="og:type" key="og:type" content={'website'} />
      <meta name="twitter:title" key="twitter:title" content={seo.title} />
      <meta
        name="twitter:description"
        key="twitter:description"
        content={seo.description}
      />
      <meta
        name="twitter:image"
        key="twitter:image"
        content={seo.twitterImage}
      />
      <meta
        name="twitter:card"
        key="twitter:card"
        content="summary_large_image"
      />
    </Head>
  );
};

export default EventSEO;
