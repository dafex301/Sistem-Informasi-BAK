import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebaseConfig/init";

export interface IPeminjaman2 {
  id?: string;
  kegiatan: string;
  peminjam: string;
  tempat: string;
  penanggung_jawab: string;
  kontak_penanggung_jawab: string;
  status: string;
  waktu_mulai: Timestamp;
  waktu_selesai: Timestamp;
  file: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  logs?: IPeminjaman2Logs[];
}

export interface IPeminjaman2Logs {
  aksi: string;
  catatan: string;
  jabatan: string;
  nama: string;
  waktu: Date;
}

export const subscribeToPeminjaman = (
  callback: (peminjaman: IPeminjaman2[]) => void
) => {
  const unsubscribe = onSnapshot(collection(db, "peminjaman"), (snapshot) => {
    const updatedPeminjaman = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(updatedPeminjaman as IPeminjaman2[]);
  });

  // Return the unsubscribe function
  return unsubscribe;
};
