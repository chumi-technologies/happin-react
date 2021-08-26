import { Creator } from './creator'
import { GroupEvent } from './groupEvent';

export interface Member {
    avatar: string;
    id: string;
}

export interface Group {
    id: string;
    members: Member[];
    total: number;
}

export interface MusicData {
    songs: any[];
}

export interface LocationInfo {
    eventType?: string;
    hasSeat: boolean;
    location: string;
    venueName?: string;
    offSaleSetting?: Map<string, any>
}

export interface EventDetail {
    _id: string;
    group: Group;
    groupAcid?: string;
    musicData: MusicData;
    content: string;
    contentPlainText: string;
    min_price: number;
    max_price: number;
    geo: number[];
    segments: any[];
    images: string[];
    tags: string[];
    view: number;
    disabled: boolean;
    isPublic: boolean;
    title: string;
    cover: string;
    currency: string;
    state: string;
    city: string;
    start_datetime: Date;
    end_datetime: Date;
    source: string;
    create_datetime: Date;
    eid: string;
    owner: string;
    streamEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
    notified: boolean;
    ODPBEnd: number;
    ODPBStart: number;
    streamSource: string;
    urlseo: string;
    isPromoteOn: boolean;
    isAudio: boolean;
    creator: Creator;
    acInfo: LocationInfo;
    socialImg: string;
}

export interface EventData {
    event: EventDetail;
    isLive: boolean;
    pfms: any[];
    isSaved: boolean;
    ticketNonPBCount: number;
    ticketPBCount: number;
    chatJoinStatus: number;
    hasTicket: boolean;
    hasTicketNonPB: boolean;
    hasTicketPB: boolean;
    hotTopics: any[];
    groupEvents?: GroupEvent[];
}

export interface EventResponse {
    data: EventData;
    code: number;
    message: string;
}
