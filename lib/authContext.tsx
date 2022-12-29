import { useState, useEffect, useContext, createContext } from "react";
import { getAuth, onAuthStateChanged, signOut as signout } from "firebase/auth";
import { setCookie, destroyCookie, parseCookies } from "nookies";
import { db } from "./firebaseConfig/init";
import { doc, getDoc } from "firebase/firestore";
import { createToken, verifyToken } from "./jwt/token";

export type TIdTokenResult = {
  token: string;
  expirationTime: string;
  authTime: string;
  issuedAtTime: string;
  signInProvider: string | null;
  signInSecondFactor: string | null;
  claims: {
    [key: string]: any;
  };
};

export type TIdFirebase = {
  aud: string;
  auth_time: number;
  email: string;
  email_verified: boolean;
  exp: number;
  firebase: {
    [key: string]: any;
  };
  iat: number;
  iss: string;
  sub: string;
  uid: string;
  user_id: string;
};

export type UserData = {
  name: string;
  no_induk: string;
  role: string;
};

type Props = {
  children: React.ReactNode;
};

type UserContext = {
  user: TIdTokenResult | null;
  userData: UserData | null;
  loading: boolean;
  setUserData: Function;
};

const authContext = createContext<UserContext>({
  user: null,
  userData: null,
  loading: true,
  setUserData: Function,
});

export default function AuthContextProvider({ children }: Props) {
  const [user, setUser] = useState<TIdTokenResult | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      //user returned from firebase not the state
      if (user) {
        // Save token for backend calls
        user.getIdToken().then((token) =>
          setCookie(null, "idToken", token, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          })
        );

        // Get user data from firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userDataObj: UserData = {
            name: docSnap.data()?.name,
            no_induk: docSnap.data()?.no_induk,
            role: docSnap.data()?.role,
          };

          const jwt = await createToken(userDataObj);

          setCookie(null, "user", jwt, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          });

          setUserData(userDataObj);
        }

        // Save decoded token on the state
        user.getIdTokenResult().then((result) => setUser(result));
      }

      if (!user) {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });
  }, []);

  return (
    <authContext.Provider value={{ user, userData, loading, setUserData }}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => useContext(authContext);
