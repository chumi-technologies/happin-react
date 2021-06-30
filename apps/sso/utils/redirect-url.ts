import { getChumiServerToken } from '@api/happin-server';

const happinWebHost = process.env.NEXT_PUBLIC_HAPPIN_WEB_HOST;

const getSaaSDashboardURL = async (firebaseToken: string, email: string) => {
  const chumiServerJWT = await getChumiServerToken(firebaseToken, email);
  if (!chumiServerJWT) {
    return null
  }
  return `${happinWebHost}/link-happin?t=${chumiServerJWT}`
}

export { getSaaSDashboardURL }
