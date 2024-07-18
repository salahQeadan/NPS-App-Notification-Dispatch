import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDVOCdc-W0K8qI4HRrD-e1P1v8OKRHsomc",
  authDomain: "notification-1dc26.firebaseapp.com",
  projectId: "notification-1dc26",
  storageBucket: "notification-1dc26.appspot.com",
  messagingSenderId: "351762808913",
  appId: "1:351762808913:web:ac0044a0163c758ac7b870",
  measurementId: "G-LY3QY6E7V4"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { app, messaging };
