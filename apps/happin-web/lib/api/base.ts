import axios from 'axios';

const happinApiHost = process.env.NEXT_PUBLIC_CHUMI_SERVER_HOST || 'https://api.happin.app/prod'
const crowdCoreApiHost = process.env.NEXT_PUBLIC_CROWD_CORE_HOST || 'https://api.crowdcore.com/prod'

const HEADER : { [key: string] : string }= {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

export const get = async <T = any>(path: string, host?:string, token?: string) => {
    var header = {...HEADER };
    if (token) {
        header.Authorization = `Bearer ${token}`;
    } 

    try {
        const result = await axios.request<T>({
            method: 'GET',
            url: `${host}${path}`,
            headers: header,
        })
        return result.data
    } catch (error) {
        throw error
    }
}

export {
    happinApiHost,
    crowdCoreApiHost,
}
