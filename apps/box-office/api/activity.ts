import axios from 'axios';

export async function getEvents(token: string) {
    const res = await axios({
        method: 'GET',
        url: process.env.CHUMISERVER_HOST + '/activity?pageSize=8&status=all&sortBy=start-time-desc&showStats=true',
        headers: {'Authorization': 'Bearer '+ token},
    })
    return res;
}