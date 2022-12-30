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
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  OAuthProvider,
  linkWithPopup,
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

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const githubProvider = new GithubAuthProvider();
const microsoftProvider = new OAuthProvider("microsoft.com");

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
        created_at: new Date(),
        modified_at: new Date(),
      });
      setCookie(null, "idToken", await user.getIdToken(), {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
    }
  );
};

export const loginAccount = async (
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

export const loginWithProvider = async (provider: string) => {
  try {
    if (provider === "google") {
      await signInWithPopup(auth, googleProvider);
    }
    if (provider === "facebook") {
      await signInWithPopup(auth, facebookProvider);
    }
    if (provider === "github") {
      await signInWithPopup(auth, githubProvider);
    }
    if (provider === "microsoft") {
      await signInWithPopup(auth, microsoftProvider);
    }
  } catch (error: any) {
    throw error;
  }
};

export const linkWithProvider = async (provider: string) => {
  if (auth.currentUser) {
    try {
      if (provider === "google") {
        await linkWithPopup(auth.currentUser, googleProvider);
      }
      if (provider === "facebook") {
        await linkWithPopup(auth.currentUser, facebookProvider);
      }
      if (provider === "github") {
        await linkWithPopup(auth.currentUser, githubProvider);
      }
      if (provider === "microsoft") {
        await linkWithPopup(auth.currentUser, microsoftProvider);
      }
    } catch (error: any) {
      console.log(error);
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
  destroyCookie(null, "idToken", { path: "/" });
  destroyCookie(null, "user", { path: "/" });
  await signout(auth);
};
