import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBCt_gN3kniz9ZYfsIUkl-9xOJkHxyHHMY",
  authDomain: "mobilefoods-e21ed.firebaseapp.com",
  projectId: "mobilefoods-e21ed",
  storageBucket: "mobilefoods-e21ed.firebasestorage.app",
  messagingSenderId: "321666293561",
  appId: "1:321666293561:web:feb27b2cbdd45ba6bad2e8",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Always prefer initializeAuth with AsyncStorage (RN). If it's already initialized,
// initializeAuth will throw and we fall back to getAuth(app).
let authInstance;
try {
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  authInstance = getAuth(app);
}

export const auth = authInstance;
export const db = getFirestore(app);
