import axios from 'axios';

export async function getEvents(token: string) {
    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1ZmNlZTBiNTgxMDNlNzAyM2E3N2Y5NjkiLCJyb290VXNlcklEIjoiNWZjZWUwOTQ4MTAzZTcwMjNhNzdmOTY4IiwiaGFwcGluVXNlcklEIjoiNWZjZWUwOTQ1NjIxNTYwMDA5YjJlODU2IiwiaWF0IjoxNjIzMjYzMDMxLCJleHAiOjE2MjU4NTUwMzF9.0FE0f2nmKEhmJPBvb9eWUPaRJwf91RypPC0z3IJJcz8'
    const res = await axios({
        method: 'GET',
        url: process.env.CHUMISERVER_HOST + '/activity?pageSize=8&status=all&sortBy=start-time-desc&showStats=true',
        headers: {'Authorization': 'Bearer '+ token},
    })
    return res;
}