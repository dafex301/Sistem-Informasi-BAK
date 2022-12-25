// Firebase config
import { auth, db } from "../lib/firebaseConfig/init";

// Firebase SDK
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as signout,
  onAuthStateChanged,
  Auth,
} from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// Other module
import { setCookie, destroyCookie } from "nookies";

export const createAccount = async (
  auth: Auth,
  email: string,
  password: string,
  name: string,
  no_induk: string,
  role: string
): Promise<void> => {
  // Create an account in firebase then store it in firestore with name, nim, and role
  await createUserWithEmailAndPassword(auth, email, password).then(
    async (userCredential) => {
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        no_induk: no_induk,
        role: role,
        email: email,
      });
    }
  );
};

export const findEmailByNoInduk = async (no_induk: string): Promise<string> => {
  // Find email by nim
  const q = query(collection(db, "users"), where("no_induk", "==", no_induk));
  const querySnapshot = await getDocs(q);
  let email = "";
  querySnapshot.forEach((doc) => {
    email = doc.data().email;
  });
  return email;
};

export const loginAccount = async (
  auth: Auth,
  identifier: string,
  password: string
): Promise<void> => {
  // Check if identifier is an email or nim
  const isEmail = identifier.includes("@");
  const isNoInduk = !isEmail;

  // Login with email
  if (isEmail) {
    try {
      await signInWithEmailAndPassword(auth, identifier, password).then(
        (userCredential) => {
          const user = userCredential.user;
          setCookie(null, "idToken", user.uid, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          });
        }
      );
    } catch (error) {
      throw error;
    }
  }

  if (isNoInduk) {
    try {
      const email = await findEmailByNoInduk(identifier);
      await signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const user = userCredential.user;
          setCookie(null, "idToken", user.uid, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          });
        }
      );
    } catch (error) {
      throw error;
    }
  }
};

export const writeUserToDb = async (
  auth: Auth,
  name: string,
  no_induk: string
): Promise<void> => {
  const user = auth.currentUser;
  if (user) {
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      no_induk: no_induk,
      role: "mahasiswa",
      email: user.email,
    });
  }
};

export const signOut = async () => {
  const auth = getAuth();
  destroyCookie(null, "idToken");
  destroyCookie(null, "user");
  await signout(auth);
};
