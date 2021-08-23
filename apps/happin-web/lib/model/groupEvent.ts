import { Creator } from './creator'

export interface OrganizerProfile {
    fullURLPhoto: string;
    name: string;
    email: string;
    orderMessage: string;
}

export interface GroupEvent {
    _id: string;
    contentPlainText: string;
    cover: string;
    title: string;
    startTime: Date;
    endTime: Date;
    tags: string[];
    soldOut: boolean;
    price?: number;
    default_currency: string;
    location: string;
    venueName: string;
    _creator: Creator;
    organizerProfile: OrganizerProfile;
    hasPFM: boolean;
}

