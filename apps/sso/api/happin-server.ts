import Axios from 'axios';

const happinServerHost = process.env.NEXT_PUBLIC_HAPPIN_SERVER_HOST;

const getAxiosWithAuth = (firebaseToken: string) => Axios.create({
  baseURL: `${happinServerHost}/prod`,
  headers: {
    'authorization': firebaseToken,
  },
});

const getChumiServerToken = async (firebaseToken: string) => {
  try {
    const { data: { code, data: { token } } } = await getAxiosWithAuth(firebaseToken).get(`/user/chumi-server-token`);
    if (code !== 200 || !token) {
      return console.error('fail to getChumiServerToken');
    }
    return token;
  } catch (error) {
    console.error('fail to getChumiServerToken')
  }
}

interface signUpHappinPayload {
  // birthday,
  // languageCode,
  // countryCode,
  areaCode?: string,
  phone?: string,
  version: 2,
}
const signUpHappin = async (firebaseToken: string, payload: signUpHappinPayload) => {
  const { data: { code, data, message } } = await getAxiosWithAuth(firebaseToken).post(`/user/signup`, payload);
  if (code !== 200) {
    throw new Error(`Fail to sign up with happin ${message}`)
  }
  return data;
}

export { getChumiServerToken, signUpHappin };
