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
  FieldValue,
  Query,
} from "firebase/firestore";

import { getStorage, ref, deleteObject } from "firebase/storage";

const storage = getStorage();

export interface ITebusan {
  KBAK: boolean;
  MK: boolean;
  SM: boolean;
  SB: boolean;
  SK: boolean;
}

export interface ISurat {
  nomor_surat: string;
  tanggal_surat: Timestamp | string | Date;
  perihal: string;
  penerima: string;
  tebusan: ITebusan;
  nama_pengirim: string;
  nim_pengirim: string;
  prodi_pengirim: string;
  fakultas_pengirim: string;
  kontak_pengirim: string;
  ormawa_pengirim?: string;
  file?: string;
}

export interface ISuratRequest extends ISurat {
  status?: "diproses" | "disetujui" | "ditolak";
  paraf_KBAK?: boolean;
  paraf_MK?: boolean;
  paraf_SM?: boolean;
  paraf_SB?: boolean;
  paraf_SK?: boolean;
  paraf_staf_SM?: boolean;
  paraf_staf_SB?: boolean;
  paraf_staf_SK?: boolean;
  created_at: FieldValue;
  modified_at: FieldValue;
}

export interface ISuratData {
  id: string;
  surat: ISuratRequest | DocumentData;
}

export interface ILogSurat {
  surat: DocumentReference<DocumentData>;
  user: DocumentReference<DocumentData>;
  aksi: "dibuat" | "disetujui" | "disposisi" | "ditolak";
  disposisi?: string;
  waktu: FieldValue;
}

export type Role =
  | "MK"
  | "KBAK"
  | "SK"
  | "SB"
  | "SM"
  | "staf_SK"
  | "staf_SB"
  | "staf_SM";

export const getAllSurat = async (role?: Role) => {
  const surat: DocumentData[] = [];
  let q: Query<DocumentData>;
  if (role == "SM" || role == "staf_SM") {
    q = query(
      collection(db, "surat"),
      where("penerima", "==", "SM"),
      orderBy("modified_at", "desc")
    );
  } else if (role == "SB" || role == "staf_SB") {
    q = query(
      collection(db, "surat"),
      where("penerima", "==", "SB"),
      orderBy("modified_at", "desc")
    );
  } else if (role == "SK" || role == "staf_SK") {
    q = query(
      collection(db, "surat"),
      where("penerima", "==", "SK"),
      orderBy("modified_at", "desc")
    );
  } else if (role == "KBAK") {
    q = query(
      collection(db, "surat"),
      where("penerima", "==", "KBAK"),
      orderBy("modified_at", "desc")
    );
  } else if (role == "MK") {
    q = query(
      collection(db, "surat"),
      where("penerima", "==", "MK"),
      orderBy("modified_at", "desc")
    );
  } else {
    // If role is not specified, return all surat
    q = query(collection(db, "surat"), orderBy("modified_at", "desc"));
  }
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    surat.push({ id: doc.id, ...doc.data() });
  });

  console.log("surat", surat);

  return surat as ISuratData[];
};

export const getDisposisiSurat = async (role?: Role) => {
  const surat: DocumentData[] = [];
  let q: Query<DocumentData>;
  q = query(
    collection(db, "surat"),
    where(`paraf_${role}`, "==", false),
    orderBy("modified_at", "desc")
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    surat.push({ id: doc.id, ...doc.data() });
  });

  return surat;
};

export const getTebusanSurat = async (role?: Role) => {
  const surat: DocumentData[] = [];
  let q: Query<DocumentData>;
  q = query(
    collection(db, "surat"),
    where(`tebusan.${role}`, "==", true),
    orderBy("modified_at", "desc")
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    surat.push({ id: doc.id, ...doc.data() });
  });

  return surat;
};

export const createSurat = async (surat: ISurat) => {
  const { penerima } = surat;

  const suratObj: ISuratRequest = {
    ...surat,
    created_at: serverTimestamp(),
    modified_at: serverTimestamp(),
  };

  if (penerima === "KBAK") {
    suratObj["paraf_KBAK"] = false;
  } else if (penerima === "MK") {
    suratObj["paraf_MK"] = false;
  } else if (penerima === "SM") {
    suratObj["paraf_SM"] = false;
  } else if (penerima === "SB") {
    suratObj["paraf_SB"] = false;
  } else if (penerima === "SK") {
    suratObj["paraf_SK"] = false;
  }
  try {
    await addDoc(collection(db, "surat"), {
      suratObj,
    });
  } catch (error) {
    console.log(error);
  }
};

export const disposisiSurat = async (
  id: string,
  role: Role,
  catatan: string,
  tujuan: Role
) => {
  const suratRef = doc(db, "surat", id);
  const surat = await getDoc(suratRef);
  const suratData = surat.data();

  if (suratData) {
    const suratObj = {
      ...suratData,
      [`paraf_${role}`]: true,
      [`paraf_${tujuan}`]: false,
      status: "diproses",
      modified_at: serverTimestamp(),
    };

    try {
      await updateDoc(suratRef, {
        suratObj,
      });
    } catch (error) {
      console.log(error);
    }

    const logSurat: ILogSurat = {
      surat: suratRef,
      user: doc(db, "users", auth.currentUser!.uid),
      aksi: "disposisi",
      disposisi: catatan,
      waktu: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "log_surat"), {
        logSurat,
      });
    } catch (error) {
      console.log(error);
    }
  }
};

export const finalizeSurat = async (
  id: string,
  role: Role,
  approve: boolean
) => {
  const suratRef = doc(db, "surat", id);
  const surat = await getDoc(suratRef);
  const suratData = surat.data();

  if (suratData) {
    const suratObj = {
      ...suratData,
      [`paraf_${role}`]: true,
      status: approve ? "disetujui" : "ditolak",
      modified_at: serverTimestamp(),
    };

    try {
      await updateDoc(suratRef, {
        suratObj,
      });
    } catch (error) {
      console.log(error);
    }

    const logSurat: ILogSurat = {
      surat: suratRef,
      user: doc(db, "users", auth.currentUser!.uid),
      aksi: approve ? "disetujui" : "ditolak",
      waktu: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "log_surat"), {
        logSurat,
      });
    } catch (error) {
      console.log(error);
    }
  }
};
