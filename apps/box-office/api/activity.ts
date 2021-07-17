import axios from 'axios';

export async function getEvents() {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1ZmJkYmZmOTVlNWZkODMzMGQ4OWQ2ZDUiLCJyb290VXNlcklEIjoiNWZkY2JjNDQ4ODBkNTMwZjI1ZmVmY2IxIiwiaGFwcGluVXNlcklEIjoiNWZjYWZhM2Q4OTc3ZGIwMDA4MGMyMGVmIiwiaWF0IjoxNjI2NDk1MTg2LCJleHAiOjE2MjkwODcxODZ9.qjyfQANCoHOMJPkhKJcJSYXUhW_NQftj6QW4HliZd-Y';
    const res = await axios({
        method: 'GET',
        url: process.env.NEXT_PUBLIC_CHUMI_SERVER_HOST + '/activity?pageSize=8&status=all&sortBy=start-time-desc&showStats=true',
        headers: {'Authorization': 'Bearer '+ token},
    })
    return res;
}

export async function getEventById(id: string) {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1ZmJkYmZmOTVlNWZkODMzMGQ4OWQ2ZDUiLCJyb290VXNlcklEIjoiNWZkY2JjNDQ4ODBkNTMwZjI1ZmVmY2IxIiwiaGFwcGluVXNlcklEIjoiNWZjYWZhM2Q4OTc3ZGIwMDA4MGMyMGVmIiwiaWF0IjoxNjI2NDk1MTg2LCJleHAiOjE2MjkwODcxODZ9.qjyfQANCoHOMJPkhKJcJSYXUhW_NQftj6QW4HliZd-Y';
    const res = await axios({
        method: 'GET',
        url: process.env.NEXT_PUBLIC_CHUMI_SERVER_HOST + '/activity/' + id,
        headers: {'Authorization': 'Bearer '+ token},
    })
    return res;
}
