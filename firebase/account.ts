// Firebase config
import { auth, db } from "../lib/firebaseConfig/init";

// Firebase SDK
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as signout,
  Auth,
  EmailAuthProvider,
  linkWithCredential,
  sendPasswordResetEmail,
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
      setCookie(null, "idToken", await user.getIdToken(), {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }
  );
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
        async (userCredential) => {
          const user = userCredential.user;
          setCookie(null, "idToken", await user.getIdToken(), {
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
      // Get email by requesting to /api/auth/email/[no_induk]
      const email = await fetch(`/api/auth/email/${identifier}`)
        .then((res) => res.json())
        .then((data) => data.email);
      await signInWithEmailAndPassword(auth, email, password).then(
        async (userCredential) => {
          const user = userCredential.user;
          setCookie(null, "idToken", await user.getIdToken(), {
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

// Write user to Firestore and link it to email
// This function fire when users login with third party
export const writeUserToDb = async (
  auth: Auth,
  name: string,
  no_induk: string,
  email: string,
  password: string
): Promise<void> => {
  const credential = EmailAuthProvider.credential(email, password);
  const user = auth.currentUser;
  if (user) {
    // Link user with email
    await linkWithCredential(user, credential);

    // Write user to firestore
    const time = new Date();
    await setDoc(doc(db, "users", user.uid), {
      name: name,
      no_induk: no_induk,
      role: "mahasiswa",
      email: user.email,
      created_at: time,
      modified_at: time,
    });
  }
};

export const forgetPassword = async (
  auth: Auth,
  identifier: string
): Promise<void> => {
  // Check if identifier is an email or nim
  const isEmail = identifier.includes("@");
  const isNoInduk = !isEmail;

  // Login with email
  if (isEmail) {
    try {
      await sendPasswordResetEmail(auth, identifier);
    } catch (error) {
      throw error;
    }
  }

  if (isNoInduk) {
    try {
      // Get email by requesting to /api/auth/email/[no_induk]
      const email = await fetch(`/api/auth/email/${identifier}`)
        .then((res) => res.json())
        .then((data) => data.email);
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  }
};

export const signOut = async () => {
  // destroyCookie(null, "idToken");
  // destroyCookie(null, "user");
  await signout(auth).then(() => {
    destroyCookie(null, "idToken");
    destroyCookie(null, "user");
  });
};
