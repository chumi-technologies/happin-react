import { Grid } from "@chakra-ui/react";
import { EventData } from "lib/model/event";
import moment from "moment";
import { useState } from "react";

const AgendaItem = ({ item }: any) => {
  return (
    <>
      <Grid
        mt={{ base: "16px", md: 7 }}
        templateColumns="100px 1fr"
      >
        <div className="text-sm font-bold leading-none">{item.time ? moment(item.time).format('h:mm A') : ''}</div>
        <div>
          <div className="text-xs mb-2 uppercase">{item.type}</div>
          <div className="font-bold mb-1">{item.title}</div>
          <div className="text-gray-400 text-sm">{item.description}</div>
        </div>
      </Grid>
    </>
  );
};

const AgendaDate = ({ date, content }: any) => {
  return (
    <>
      <div className="black-title text-lg sm:text-xl font-extrabold text-yellow-500 mt-3 sm:mt-5">{date}</div>
      {content.map((item: any, i: number) => {
        return <AgendaItem item={item} key={i} />;
      })}
    </>
  );
};

const EventAgenda = ({ eventData }: { eventData: EventData }) => {

  let agenda: any[] = [];

  const generateAgendaItems = () => {
    // filter the invisible pfm (deleted)
    const innerContents = eventData.pfms.filter(pfm => !pfm.invisible).map(pfm => {
      return {
        type: 'VIP/ Fan Meeting',
        description: 'Face to face, talk to your artist',
        time: pfm.startTime,
        title: eventData.event.title,
      }
    })
    innerContents.push({
      type: 'Public Show',
      description: 'Grab your tickets now. You can access the event and private group chat.',
      time: new Date(eventData.event.start_datetime).getTime(),
      title: eventData.event.title,
    })
    innerContents.sort((a,b) => { if (a.time > b.time) return 1; else return -1 });
    let previousDate: string;
    innerContents.forEach((inner, index) => {
      const currentDate = inner.time ? moment(inner.time).format('MMM D') : 'TBA';
      if (index === 0) {
        previousDate = currentDate;
        agenda.push({date: currentDate, content: [inner]})
      } else if(previousDate !== currentDate){
        agenda.push({date: currentDate, content: [inner]})
        previousDate = currentDate;
      } else {
        agenda[agenda.length-1].content.push(inner)
      }
    })
  }

  generateAgendaItems()

  return (
    <>
      <div className="black-title text-xl sm:text-2xl font-semibold">Agenda</div>
      {agenda.map((item, i) => {
        return <AgendaDate date={item.date} content={item.content} key={i} />;
      })}
    </>
  );
};

export default EventAgenda;
