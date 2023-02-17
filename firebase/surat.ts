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
  Timestamp,
} from "firebase/firestore";

import { getStorage, ref, deleteObject } from "firebase/storage";

const storage = getStorage();

export interface ISurat {
    nomor_surat: string;
    tanggal_surat: Timestamp;
    perihal: string;
    penerima: string;
    file?: string;
}

export interface ISuratRequest extends ISurat {
    //pengirim: DocumentReference<DocumentData> | DocumentData | undefined;
    paraf_Staf: boolean;
    paraf_SM: boolean;
    paraf_MK: boolean;
    paraf_KBAK: boolean;
    disposisi_status: boolean;
    disposisi_note: string;
    created_at: Timestamp;
    modified_at: Timestamp;
    status?: string;
}

export interface IUserData {
    email: string;
    name: string;
    contact_info: string;
    created_at: Timestamp;
    modified_at: Timestamp;
}

export interface ISuratData {
    id: string;
    //surat: ISuratRequest | DocumentData;
}

export interface ILogSurat {
    //surat_masuk: DocumentReference<DocumentData>;
    //user: DocumentReference<DocumentData>;
    aksi: "create" | "approve" | "update" | "reject";
    disposisi?: string;
    waktu: Date;
}

export const getAllSurat = async (
    role?: "guest" | "Staf" | "SM" | "MK" | "KBAK" | "admin"
) => {
    const userRef = 
}

