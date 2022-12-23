// Firebase config
import { auth, db } from '../lib/firebaseConfig/init';

// Firebase SDK
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as signout,
    onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Other module
import { setCookie, destroyCookie } from "nookies";


export const generateAccount = async (email: string, password: string, username: string, role: string) => {

}

export const signOut = async () => {
    const auth = getAuth();
    destroyCookie(null, "idToken");
    await signout(auth);
};