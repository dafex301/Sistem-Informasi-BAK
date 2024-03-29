import { useState, useEffect, useContext, createContext } from "react";
import { getAuth, onAuthStateChanged, signOut as signout } from "firebase/auth";
import { setCookie, destroyCookie, parseCookies } from "nookies";

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

type Props = {
  children: React.ReactNode;
};

type UserContext = {
  user: TIdTokenResult | null;
  loading: boolean;
};

const authContext = createContext<UserContext>({
  user: null,
  loading: true,
});

export default function AuthContextProvider({ children }: Props) {
  const [user, setUser] = useState<TIdTokenResult | null>(null);
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

        // Save decoded token on the state
        user.getIdTokenResult().then((result) => setUser(result));
      }

      if (!user) {
        setUser(null);
      }
      setLoading(false);
    });
  }, []);

  return (
    <authContext.Provider value={{ user, loading }}>
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => useContext(authContext);
