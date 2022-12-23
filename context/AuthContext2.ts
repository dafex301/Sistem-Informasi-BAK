import React, { useContext, useState, useEffect, useRef, Context } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextValue {
  currentUser: User | null;
  signup: (email: string, password: string) => Promise<UserCredential>;
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  userInfo: React.MutableRefObject<any>;
}

const AuthContext: Context<AuthContextValue> = React.createContext({
  currentUser: null,
  signup: (email: string, password: string) => Promise.resolve(null),
  login: (email: string, password: string) => Promise.resolve(null),
  logout: () => Promise.resolve(),
  userInfo: {}
});

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [loading, setLoading] = useState(true);
  const userInfo = useRef<any>();

  function signup(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout(): Promise<void> {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextValue = {
    currentUser,
    signup,
    login,
    logout,
    userInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
