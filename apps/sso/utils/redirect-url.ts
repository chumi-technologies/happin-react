import { getChumiServerToken } from 'api/happin-server';

const happinWebHost = process.env.NEXT_PUBLIC_HAPPIN_WEB_HOST;

const getSaaSDashboardURL = async (firebaseToken: string) => {
  const chumiServerJWT = await getChumiServerToken(firebaseToken);
  if (!chumiServerJWT) {
    return null
  }
  return `${happinWebHost}/link-happin?t=${chumiServerJWT}`
}

export { getSaaSDashboardURL }
