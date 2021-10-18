export interface EventResponse{
	count:number;
	activities:Event[];
}

export interface Event {
  _id: string;
  cover: string;
  title: string;
  startTime: string;
  endTime:string;
  location:string;
}

export type MyEventItemDataProps = {
  _id: string;
  cover: string;
  title: string;
  startTime: string;
  endTime:string;
  location:string;
  _creator:string
};
