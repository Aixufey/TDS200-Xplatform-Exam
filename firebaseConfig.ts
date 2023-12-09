// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
import {
    APIKEY,
    APPID,
    AUTHDOMAIN,
    MEASUREMENTID,
    MESSAGINGSENDERID,
    PROJECTID,
    STORAGEBUCKET,
} from '@env';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import { Auth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { FirebaseStorage, StorageReference, getStorage, ref } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: APIKEY,
    authDomain: AUTHDOMAIN,
    projectId: PROJECTID,
    storageBucket: STORAGEBUCKET,
    messagingSenderId: MESSAGINGSENDERID,
    appId: APPID,
    measurementId: MEASUREMENTID,
};

// Accessing Firebase API
const firebase_app: FirebaseApp = initializeApp(firebaseConfig);
const firebase_db: Firestore = getFirestore(firebase_app);
const firebase_storage: FirebaseStorage = getStorage(firebase_app);
const storageRef: StorageReference = ref(firebase_storage);
/**
 * @description Firebase Auth
 *   For some reason, it's yapping about the persistance when using getAuth, so I'm using initializeAuth. 
 *   And of course, typescript is not recognizing the declared modules in firebase/auth
 *   The solution is to declare in tsconfig.json
 */
const firebase_auth: Auth = initializeAuth(firebase_app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export interface IFIREBASE {
    firebase_app: FirebaseApp;
    firebase_db: Firestore;
    firebase_storage: FirebaseStorage;
    storageRef: StorageReference;
    firebase_auth: Auth;
}
const FIREBASE: IFIREBASE = {
    firebase_app,
    firebase_db,
    firebase_storage,
    storageRef,
    firebase_auth,
};
export default FIREBASE;
