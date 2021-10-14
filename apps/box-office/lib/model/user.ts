export interface User {
    displayname: string;
    photourl: string;
    uid: string;
    points: number;
    desc: string;
    _id: string // happinUID
    //rootUserID: string; // need to remove later
    email: string;
    phonenumber: string;
    areaCode: string;
    pointOneGifts: number;
}


export interface UserResponse {
    data: User;
    code: number;
    message: string;
}

export interface connectTeamResponse {
   _id: string;
   role: string;
   globalId: globalId;
   memberId: string;
   acid?:string[];
}

export interface globalId {
    _id: string;
    username: string;
    userPhoto: string;
    cityToLive: string;
    description: string;
    verifyFromEmail: boolean;
    occupation: string;
    company: string;
    reported: boolean,
    userType: string;
    acTotalNumberCount: number,
    stripeCustomerID: string;
    notifi_numberLeft: number,
    connectAccount: string;
    alterConnectAccount: string[];
    default_currency: string;
    payoutType: string;
    initialProductPlan: string;
    initialProductType: string;
    eventbrite_org_id: string;
    ticketingPackage: string;
    registerDate: string;
    lastLogin: string;
    happinLoginURL: string;
    connectStripeProcessor: string[];
    rootUserId: string;
    happinUID: string;
    oldSaasUserId: string;
    displayname: string;
    email:string;
    id: string;
}
