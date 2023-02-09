import { auth, db } from "../lib/firebaseConfig/init";
import {
  doc,
  addDoc,
  collection,
  DocumentReference,
  DocumentData,
  where,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { getStorage, ref, deleteObject } from "firebase/storage";

export const getTotalPeminjaman = async () => {
  const q = query(collection(db, "permohonan_peminjaman"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
};

export const getTotalTempat = async () => {
  const q = query(collection(db, "tempat"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
};

export const getTotalUser = async () => {
  const q = query(collection(db, "users"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
};
