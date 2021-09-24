import { Grid } from "@chakra-ui/react";
import { EventData } from "lib/model/event";
import moment from "moment";

const AgendaItem = ({ item }: any) => {
  return (
    <>
      <Grid
        mt={{ base: "16px", md: 7 }}
        templateColumns="100px 1fr"
      >
        <div className="text-sm font-bold leading-none">{item.time}</div>
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

const EventAgenda = ({eventData}:{eventData: EventData}) => {
  const agenda = [
    {
      date: 'July 1',
      content: [
        {
          time: "11PM",
          type: "Public Show",
          title: "A Night With Norelle",
          description:
            "Grab your tickets now. You can access the event and group chat 1 hour before the event starts.",
        },
        {
          time: "11PM",
          type: "VIP / FAN Meeting",
          title: "Lady Gaga’s Meet & Greet",
          description:
            "Grab your tickets now. You can access the event and group chat 1 hour before the event starts.",
        },
      ]
    },
  ];

  const generateAgendaItems = () => {
    // pfm start time is unix time millisecond, start_datetime is date object need to convert to unix time in millisecond
    const dates = [...eventData.pfms.map(pfm => pfm.startTime), new Date(eventData.event.start_datetime).getTime()];
    const sortedDates = dates.sort((d1,d2) => { if (d1>d2) return 1; else return -1 });
    const day = Array.from(new Set(sortedDates.map(d => moment(d).format('MMM D'))));
    console.log(day);
    const agenda = day.map(d=>({date: d, content:[]}));
    

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
