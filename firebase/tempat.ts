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

export const addTempat = async (nama: string) => {
  const docRef = await addDoc(collection(db, "tempat"), {
    nama_tempat: nama,
    created_at: serverTimestamp(),
    modified_at: serverTimestamp(),
  });
  return docRef;
};

export const getAllTempat = async () => {
  const tempat: DocumentData[] = [];
  const q = query(collection(db, "tempat"), orderBy("modified_at", "desc"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    tempat.push({ id: doc.id, ...doc.data() });
  });

  return tempat;
};

export const getTempatById = async (id: string) => {
  const docRef = doc(db, "tempat", id);
  const docSnap = await getDoc(docRef);
  return docSnap;
};

export const updateTempat = async (id: string, nama: string) => {
  const docRef = doc(db, "tempat", id);

  const docSnap = await getDoc(docRef);
  const oldNama = docSnap.data()?.nama_tempat;

  await updateDoc(docRef, {
    nama_tempat: nama,
    modified_at: serverTimestamp(),
  });

  // Get all data from peminjaman and search for jenis_pinjaman === nama
  // If found, update jenis_pinjaman to new nama
  const q = query(
    collection(db, "permohonan_peminjaman"),
    where("jenis_pinjaman", "==", oldNama)
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async (data) => {
    const docRef = doc(db, "permohonan_peminjaman", data.id);
    await updateDoc(docRef, {
      jenis_pinjaman: nama,
    });
  });
};

export const deleteTempat = async (id: string) => {
  const docRef = doc(db, "tempat", id);
  await deleteDoc(docRef);
};
