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
import { TIdTokenResult } from "../lib/authContext";

const storage = getStorage();

export interface ITebusanDetail {
  status: boolean;
  view: boolean;
  waktu?: FieldValue;
}

export interface ITebusan {
  KBAK: ITebusanDetail;
  MK: ITebusanDetail;
  SM: ITebusanDetail;
  SB: ITebusanDetail;
  SK: ITebusanDetail;
  [key: string]: ITebusanDetail;
}

export interface IParafDetail {
  status: boolean;
  nama?: string;
  catatan?: string;
  waktu?: Timestamp;
}

export interface IParaf {
  // key is a string
  [key: string]: IParafDetail | undefined;
  KBAK?: IParafDetail;
  MK?: IParafDetail;
  SM?: IParafDetail;
  SB?: IParafDetail;
  SK?: IParafDetail;
  staf_SM?: IParafDetail;
  staf_SB?: IParafDetail;
  staf_SK?: IParafDetail;
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
  status?: string;
  paraf: IParaf;
  created_at: Timestamp;
  modified_at: Timestamp;
}

export interface ISuratData extends ISuratRequest {
  id: string;
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

  return surat as ISuratData[];
};

export const getSuratById = async (id: string) => {
  if (!id) {
    return;
  }
  const suratRef = doc(db, "surat", id);
  const suratDoc = await getDoc(suratRef);

  if (suratDoc.exists()) {
    return { id: suratDoc.id, ...suratDoc.data() } as ISuratData;
  } else {
    return null;
  }
};

export const getDisposisiSurat = async (role?: Role) => {
  const surat: DocumentData[] = [];
  let q: Query<DocumentData>;
  q = query(
    collection(db, "surat"),
    where(`paraf.${role}.status`, "==", false),
    orderBy("modified_at", "desc")
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    surat.push({ id: doc.id, ...doc.data() });
  });

  q = query(
    collection(db, "surat"),
    where(`paraf.${role}.status`, "==", true),
    orderBy("modified_at", "desc")
  );

  const querySnapshot2 = await getDocs(q);

  querySnapshot2.forEach((doc) => {
    surat.push({ id: doc.id, ...doc.data() });
  });

  return surat as ISuratData[];
};

export const getFinishedDisposisiSurat = async (role?: Role) => {
  const surat: DocumentData[] = [];
  let q: Query<DocumentData>;
  q = query(
    collection(db, "surat"),
    where(`paraf.${role}.status`, "==", true),
    orderBy("modified_at", "desc")
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    surat.push({ id: doc.id, ...doc.data() });
  });

  return surat as ISuratData[];
};

export const getTebusanSurat = async (role?: Role) => {
  const surat: DocumentData[] = [];
  let q: Query<DocumentData>;
  q = query(
    collection(db, "surat"),
    where(`tebusan.${role}.status`, "==", true),
    orderBy("modified_at", "desc")
  );
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    surat.push({ id: doc.id, ...doc.data() });
  });

  return surat as ISuratData[];
};

export const createSurat = async (surat: ISurat) => {
  const { penerima } = surat;

  const suratObj: ISuratRequest = {
    ...surat,
    status: `Diproses ${penerima}`,
    paraf: {
      [`${penerima}`]: {
        status: false,
      },
    },
    created_at: serverTimestamp() as Timestamp,
    modified_at: serverTimestamp() as Timestamp,
  };

  try {
    await addDoc(collection(db, "surat"), {
      ...suratObj,
    });
  } catch (error) {
    console.log(error);
  }
};

export const disposisiSurat = async (
  surat: ISuratData,
  user: TIdTokenResult,
  role: Role,
  catatan: string,
  tujuan?: Role[]
) => {
  let defined_tujuan: Role[];
  if (tujuan!.length === 0) {
    switch (role) {
      case "KBAK":
        defined_tujuan = ["MK"];
        break;
      case "SM":
        defined_tujuan = ["staf_SM"];
        break;
      case "SB":
        defined_tujuan = ["staf_SB"];
        break;
      case "SK":
        defined_tujuan = ["staf_SK"];
        break;
      default:
        defined_tujuan = [];
    }
  } else {
    defined_tujuan = tujuan!;
  }

  const suratRef = doc(db, "surat", surat.id);

  const parafObj = defined_tujuan.reduce((acc, curr) => {
    acc[curr] = {
      status: false,
    };
    return acc;
  }, {} as IParaf);

  const cleanDefinedTujuan = defined_tujuan.map((t) => {
    if (t.includes("staf_")) {
      return t.replace("staf_", "Staf ");
    }
    return t;
  });

  const suratObj = {
    ...surat,
    paraf: {
      ...surat.paraf,
      ...parafObj,
      [`${role}`]: {
        status: true,
        nama: user.claims.name,
        catatan,
        waktu: serverTimestamp(),
      },
    },
    status: `Diproses ${cleanDefinedTujuan.join(", ")}`,
    modified_at: serverTimestamp(),
  };

  try {
    await updateDoc(suratRef, { ...suratObj });
  } catch (error) {
    console.log(error);
  }
};

export const finalizeSurat = async (
  surat: ISuratData,
  user: TIdTokenResult,
  role: Role,
  approve: boolean,
  catatan?: string
) => {
  const suratRef = doc(db, "surat", surat.id);

  const suratObj = {
    ...surat,
    paraf: {
      ...surat.paraf,
      [`${role}`]: {
        status: true,
        nama: user.claims.name,
        catatan,
        waktu: serverTimestamp(),
      },
    },
    modified_at: serverTimestamp(),
  };

  if (approve) {
    const isAllParafTrue = Object.values(suratObj.paraf).every(
      (paraf) => paraf!.status
    );
    if (isAllParafTrue) {
      suratObj.status = "Disetujui";
    } else {
      const parafFalse = Object.entries(suratObj.paraf).find(
        ([key, value]) => value!.status === false
      );
      suratObj.status = `Diproses ${parafFalse![0]}`;
    }
  } else {
    suratObj.status = "Ditolak";
  }

  try {
    await updateDoc(suratRef, { ...suratObj });
  } catch (error) {
    console.log(error);
  }
};

// Delete surat from firestore and also delete the file from storage
export const deleteSurat = async (surat: ISuratData) => {
  try {
    await deleteDoc(doc(db, "surat", surat.id));
    await deleteObject(ref(storage, surat.file));
  } catch (error) {
    console.log(error);
  }
};
