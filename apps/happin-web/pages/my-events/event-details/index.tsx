import React, { useEffect, useRef, useState } from 'react';
import EventDetailsHead from '@components/page_components/EventDetailsPageComponents/EventDetailsHead';

const EventDetails = () => {
  return (
    <div className="checkout__page">
      <div className="flex flex-col-reverse md:flex-col h-full">
        <EventDetailsHead />
        <div className="flex-1 h-0 web-scroll overflow-y-auto">
          <div className="container">
            <div className="py-5">
              <div className="relative lg:flex h-full lg:flex-row web-scroll overflow-y-auto">
                <div className="lg:sticky lg:top-0">

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
