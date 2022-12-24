// Firebase config
import { auth, db } from '../lib/firebaseConfig/init';

// Firebase SDK
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as signout,
    onAuthStateChanged,
    Auth,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

// Other module
import { setCookie, destroyCookie } from "nookies";

export const createAccount = async (auth: Auth, email: string, password: string, name: string, nim: string, role: string) => {
    // Create an account in firebase then store it in firestore with name, nim, and role
    await createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            nim: nim,
            role: role,
        });
    });
};

export const signOut = async () => {
    const auth = getAuth();
    destroyCookie(null, "idToken");
    await signout(auth);
};