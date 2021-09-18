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
