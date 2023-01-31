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
} from "firebase/firestore";

import { getStorage, ref, deleteObject } from "firebase/storage";

const storage = getStorage();

export interface IPeminjaman {
  jenis_pinjaman: string;
  kegiatan: string;
  waktu_pinjam: Date;
  waktu_kembali: Date;
  file: string;
}

export interface IPeminjamanRequest extends IPeminjaman {
  pemohon: DocumentReference<DocumentData> | DocumentData | undefined;
  paraf_KBK: boolean;
  paraf_MK: boolean;
  paraf_SM: boolean;
  rejected: boolean;
  rejected_reason: string;
  created_at: Date;
}

export interface IUserData {
  email: string;
  name: string;
  role: string;
  created_at: Date;
  modifiedAt: Date;
}

export interface IPeminjamanData {
  id: string;
  peminjaman: IPeminjamanRequest;
}

export interface ILogPeminjaman {
  permohonan_peminjaman: DocumentReference<DocumentData>;
  user: DocumentReference<DocumentData>;
  aksi: "create" | "approve" | "reject" | "delete" | "update";
  waktu: Date;
}

export const getAllPeminjaman = async () => {
  const q = query(
    collection(db, "permohonan_peminjaman"),
    orderBy("created_at", "desc")
  );
  const querySnapshot = await getDocs(q);
  const peminjaman: any = [];

  querySnapshot.forEach((doc) => {
    peminjaman.push({
      id: doc.id,
      peminjaman: doc.data(),
    });
  });

  // Foreach peminjaman, get pemohon data from user
  // Edit peminjaman.pemohon to pemohon data

  await Promise.all(
    peminjaman.map(async (p: IPeminjamanData) => {
      if (p.peminjaman.pemohon instanceof DocumentReference<DocumentData>) {
        const pemohon = await getDoc(p.peminjaman.pemohon);
        p.peminjaman.pemohon = pemohon.data();
      }
    })
  );

  return peminjaman;
};

export const writePeminjaman = async (peminjaman: IPeminjaman) => {
  const pemohon = doc(db, "users", auth.currentUser!.uid);

  const peminjamanRequest: IPeminjamanRequest = {
    pemohon,
    ...peminjaman,
    paraf_KBK: false,
    paraf_MK: false,
    paraf_SM: false,
    rejected: false,
    rejected_reason: "",
    created_at: new Date(),
  };

  try {
    await addDoc(
      collection(db, "permohonan_peminjaman"),
      peminjamanRequest
    ).then(async (docRef) => {
      const logPeminjaman: ILogPeminjaman = {
        permohonan_peminjaman: doc(db, "permohonan_peminjaman", docRef.id),
        user: pemohon,
        aksi: "create",
        waktu: new Date(),
      };

      await addDoc(collection(db, "log_permohonan_peminjaman"), logPeminjaman);
    });
  } catch (e: any) {
    console.log(e);
  }
};

export const verifyPeminjaman = async (permohonanPeminjamanId: string) => {
  const userRef = doc(db, "users", auth.currentUser!.uid);
  const userSnap = await getDoc(userRef);
  const user = userSnap.data();
  const role = user!.role;

  const permohonanPeminjaman = doc(
    db,
    "permohonan_peminjaman",
    permohonanPeminjamanId
  );

  try {
    switch (role) {
      case "KBK":
        await setDoc(
          permohonanPeminjaman,
          { paraf_KBK: true },
          { merge: true }
        );
        break;
      case "MK":
        await setDoc(permohonanPeminjaman, { paraf_MK: true }, { merge: true });
        break;
      case "SM":
        await setDoc(permohonanPeminjaman, { paraf_SM: true }, { merge: true });
        break;
      default:
        break;
    }

    const logPeminjaman: ILogPeminjaman = {
      permohonan_peminjaman: permohonanPeminjaman,
      user: userRef,
      aksi: "approve",
      waktu: new Date(),
    };

    await addDoc(collection(db, "log_permohonan_peminjaman"), logPeminjaman);
  } catch (e: any) {
    console.log(e);
  }
};

export const rejectPeminjaman = async (permohonanPeminjamanId: string) => {};

export const deletePeminjaman = async (permohonanPeminjamanId: string) => {
  const permohonanPeminjaman = doc(
    db,
    "permohonan_peminjaman",
    permohonanPeminjamanId
  );

  try {
    // Delete file from storage by url
    // const permohonanPeminjamanSnap = await getDoc(permohonanPeminjaman);
    // const permohonanPeminjamanData = permohonanPeminjamanSnap.data();
    // const fileUrl = permohonanPeminjamanData!.file;
    // const fileRef = ref(storage, fileUrl);
    // await deleteObject(fileRef);

    // Delete all logs related to this document
    const q = query(
      collection(db, "log_permohonan_peminjaman"),
      where("permohonan_peminjaman", "==", permohonanPeminjaman)
    );
    const querySnapshot = await getDocs(q);

    await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
      })
    );

    // Delete document from firestore
    await deleteDoc(permohonanPeminjaman);
  } catch (e: any) {
    console.log(e);
  }
};
