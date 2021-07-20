import { getChumiServerToken, getFirebaseCustomToken } from 'api/happin-server';

const happinWebHost = process.env.NEXT_PUBLIC_HAPPIN_WEB_HOST;
const happinDashboardHost = process.env.NEXT_PUBLIC_HAPPIN_DASHBOARD_HOST;

const getSaaSDashboardURL = async (firebaseToken: string) => {
  const chumiServerJWT = await getChumiServerToken(firebaseToken);
  if (!chumiServerJWT) {
    return null
  }
  return `${happinDashboardHost}/link-happin?t=${chumiServerJWT}`
}

const getHappinWebURL = async (firebaseToken: string) => {
  const customToken = await getFirebaseCustomToken(firebaseToken);
  return `${happinWebHost}?t=${customToken}`
}

export { getSaaSDashboardURL, getHappinWebURL }
