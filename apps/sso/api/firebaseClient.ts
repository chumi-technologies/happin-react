import firebaseClient from "firebase/app";
import "firebase/auth";

const CLIENT_CONFIG = {
  apiKey: 'AIzaSyA5i8Q5mjsKtpw5ju0OZOaUTL-ilGVMMPA',
  authDomain: 'happin-b9c13.firebaseapp.com',
  databaseURL: 'https://happin-b9c13.firebaseio.com',
  projectId: 'happin-b9c13',
  storageBucket: 'happin-b9c13.appspot.com',
  messagingSenderId: '885671041550',
  appId: '1:885671041550:web:58eb2799f70ff37013ba5f',
  measurementId: 'G-5BDXD5HHF8'
};

if (typeof window !== "undefined" && !firebaseClient.apps.length) {
  firebaseClient.initializeApp(CLIENT_CONFIG);
  firebaseClient
    .auth()
    .setPersistence(firebaseClient.auth.Auth.Persistence.SESSION);
  (window as any).firebase = firebaseClient;
}

export { firebaseClient };
