import {EventDetail} from './event';
import {LocationInfo} from './event';

export type MyEventItemDataProps = {
  _id: string;
  livestream: boolean;
  cover: string;
  title: string;
  start_datetime: string;
  acInfo: LocationInfo;
  city:string;
  state:string;
};

export interface EventTicketsListResponse {
  data:{
    availablePB: EventDetail[];
    upcoming: EventDetail[];
    past: EventDetail[];
  }
}

export interface SavedEventTicketsListResponse {
  data:{
    events: EventDetail[];
  }
}
