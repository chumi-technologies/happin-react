import { getFromHappin, postToHappin } from "./base"

const STREAM_ROOM_PATH = '/stream/room/{eid}'
const USERSTATUS = '/stream/user-status'


const getHappinStreamRoom = async (eventId: string) => {
    const response = await getFromHappin(STREAM_ROOM_PATH.replace('{eid}', eventId))
    return response || {}
}

const postHappinUserStatus = async (data:any) => {
    const response = await postToHappin(USERSTATUS,data)
    return response || {}
}


export { getHappinStreamRoom, postHappinUserStatus }
