import { auth, db } from "../lib/firebaseConfig/init";
import {
  doc,
  addDoc,
  collection,
  DocumentReference,
  DocumentData,
} from "firebase/firestore";

interface IPeminjaman {
  jenis_pinjaman: string;
  kegiatan: string;
  waktu_pinjam: Date;
  waktu_kembali: Date;
  file: string;
}

interface IPeminjamanRequest extends IPeminjaman {
  pemohon: DocumentReference<DocumentData>;
  paraf_KBK: boolean;
  paraf_MK: boolean;
  paraf_SM: boolean;
  rejected: boolean;
  rejected_reason: string;
  created_at: Date;
}

interface ILogPeminjaman {
  permohonan_peminjaman: DocumentReference<DocumentData>;
  user: DocumentReference<DocumentData>;
  aksi: "create" | "approve" | "reject" | "delete";
  waktu: Date;
}

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
