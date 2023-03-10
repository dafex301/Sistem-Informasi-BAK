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

export interface IPeminjaman {
  jenis_pinjaman: string;
  kegiatan: string;
  waktu_pinjam: Date;
  waktu_kembali: Date;
  file?: string;
}

export interface IPeminjamanRequest extends IPeminjaman {
  pemohon: DocumentReference<DocumentData> | DocumentData | undefined;
  paraf_KBAK: boolean;
  paraf_MK: boolean;
  paraf_SM: boolean;
  rejected: boolean;
  rejected_reason: string;
  created_at: Timestamp | Date;
  modified_at: Timestamp | Date;
  status?: string;
}

export interface IUserData {
  email: string;
  name: string;
  role: string;
  created_at: Timestamp;
  modified_at: Timestamp;
}

export interface IPeminjamanData {
  id: string;
  peminjaman: IPeminjamanRequest | DocumentData;
}

export interface ILogPeminjaman {
  permohonan_peminjaman: DocumentReference<DocumentData>;
  user: DocumentReference<DocumentData>;
  aksi: "create" | "approve" | "reject" | "update" | "revision";
  alasan?: string;
  waktu: Date;
}

export const getAllPeminjaman = async (
  role?: "admin" | "KBAK" | "MK" | "SM" | "UKM"
) => {
  const userRef = doc(db, "users", auth.currentUser!.uid);

  let q;

  if (role === "KBAK") {
    q = query(
      collection(db, "permohonan_peminjaman"),
      orderBy("modified_at", "desc"),
      where("paraf_KBAK", "==", false),
      where("paraf_MK", "==", false),
      where("paraf_SM", "==", false),
      where("rejected", "==", false)
    );
  } else if (role === "MK") {
    q = query(
      collection(db, "permohonan_peminjaman"),
      orderBy("modified_at", "desc"),
      where("paraf_KBAK", "==", true),
      where("paraf_MK", "==", false),
      where("paraf_SM", "==", false),
      where("rejected", "==", false)
    );
  } else if (role === "SM") {
    q = query(
      collection(db, "permohonan_peminjaman"),
      orderBy("modified_at", "desc"),
      where("paraf_KBAK", "==", true),
      where("paraf_MK", "==", true),
      where("paraf_SM", "==", false),
      where("rejected", "==", false)
    );
  } else if (role === "UKM") {
    q = query(
      collection(db, "permohonan_peminjaman"),
      orderBy("modified_at", "desc"),
      where("pemohon", "==", userRef)
    );
  } else {
    q = query(
      collection(db, "permohonan_peminjaman"),
      orderBy("modified_at", "desc")
    );
  }

  const querySnapshot = await getDocs(q);
  const peminjaman: IPeminjamanData[] = [];

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

        // Set status peminjaman from boolean to string
        if (p.peminjaman.rejected) {
          p.peminjaman.status = "Ditolak";
        } else if (p.peminjaman.paraf_SM) {
          p.peminjaman.status = "Disetujui";
        } else if (p.peminjaman.paraf_MK) {
          p.peminjaman.status = "Diproses SM";
        } else if (p.peminjaman.paraf_KBAK) {
          p.peminjaman.status = "Diproses MK";
        } else {
          p.peminjaman.status = "Diproses KBAK";
        }
      }
    })
  );

  return peminjaman;
};

export const getPeminjamanById = async (id: string) => {
  const peminjamanRef = doc(db, "permohonan_peminjaman", id);
  const peminjaman = await getDoc(peminjamanRef);
  const peminjamanData = peminjaman.data();

  if (peminjaman.exists()) {
    const pemohon = await getDoc(peminjamanData!.pemohon);
    peminjamanData!.pemohon = pemohon.data();

    return peminjamanData;
  } else {
    return null;
  }
};

export const getPeminjamanByTempat = async (tempat: string) => {
  const q = query(
    collection(db, "permohonan_peminjaman"),
    where("jenis_pinjaman", "==", tempat)
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

        // Set status peminjaman from boolean to string
        if (p.peminjaman.rejected) {
          p.peminjaman.status = "Ditolak";
        } else if (p.peminjaman.paraf_SM) {
          p.peminjaman.status = "Disetujui";
        } else if (p.peminjaman.paraf_MK) {
          p.peminjaman.status = "Diproses SM";
        } else if (p.peminjaman.paraf_KBAK) {
          p.peminjaman.status = "Diproses MK";
        } else {
          p.peminjaman.status = "Diproses KBAK";
        }
      }
    })
  );

  return peminjaman;
};

export const getLogPeminjamanById = async (id: string) => {
  const permohonanPeminjamanRef = doc(db, "permohonan_peminjaman", id);

  const q = query(
    collection(db, "log_permohonan_peminjaman"),
    where("permohonan_peminjaman", "==", permohonanPeminjamanRef),
    orderBy("waktu", "desc")
  );

  const querySnapshot = await getDocs(q);

  const logPeminjaman = await Promise.all(
    querySnapshot.docs.map(async (doc) => {
      const log = doc.data();
      if (log.user instanceof DocumentReference<DocumentData>) {
        log.user = (await getDoc(log.user)).data();
      }
      return { id: doc.id, log };
    })
  );

  return logPeminjaman;
};

export const writePeminjaman = async (peminjaman: IPeminjaman) => {
  const pemohon = doc(db, "users", auth.currentUser!.uid);

  const peminjamanRequest: IPeminjamanRequest = {
    pemohon,
    ...peminjaman,
    paraf_KBAK: false,
    paraf_MK: false,
    paraf_SM: false,
    rejected: false,
    rejected_reason: "",
    created_at: new Date(),
    modified_at: new Date(),
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

export const checkWaktuPeminjamanAvailable = async (
  waktu_mulai: Date,
  waktu_selesai: Date,
  jenis_pinjaman: string,
  id?: string
) => {
  const q = query(
    collection(db, "permohonan_peminjaman"),
    where("jenis_pinjaman", "==", jenis_pinjaman)
  );

  const querySnapshot = await getDocs(q);

  const docs = querySnapshot.docs;

  for (const doc of docs) {
    if (id && doc.id === id) continue;

    const data = doc.data();

    const waktuMulai = data.waktu_pinjam.toDate();
    const waktuSelesai = data.waktu_kembali.toDate();

    if (
      (waktu_mulai >= waktuMulai && waktu_mulai < waktuSelesai) ||
      (waktu_selesai > waktuMulai && waktu_selesai <= waktuSelesai) ||
      (waktu_mulai <= waktuMulai && waktu_selesai >= waktuSelesai)
    ) {
      return false;
    }
  }

  return true;
};

export const approvePeminjaman = async (id: string) => {
  const userRef = doc(db, "users", auth.currentUser!.uid);
  const userSnap = await getDoc(userRef);
  const user = userSnap.data();
  const role = user!.role;

  const permohonanPeminjaman = doc(db, "permohonan_peminjaman", id);

  try {
    switch (role) {
      case "KBAK":
        await setDoc(
          permohonanPeminjaman,
          { paraf_KBAK: true, modified_at: new Date() },
          { merge: true }
        );
        break;
      case "MK":
        await setDoc(
          permohonanPeminjaman,
          { paraf_MK: true, modified_at: new Date() },
          { merge: true }
        );
        break;
      case "SM":
        await setDoc(
          permohonanPeminjaman,
          { paraf_SM: true, modified_at: new Date() },
          { merge: true }
        );
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

export const rejectPeminjaman = async (id: string, reason: string) => {
  const userRef = doc(db, "users", auth.currentUser!.uid);

  const permohonanPeminjaman = doc(db, "permohonan_peminjaman", id);

  try {
    await setDoc(
      permohonanPeminjaman,
      {
        paraf_KBAK: false,
        paraf_MK: false,
        paraf_SM: false,

        rejected: true,
        rejected_reason: reason,

        modified_at: new Date(),
      },
      { merge: true }
    );

    const logPeminjaman: ILogPeminjaman = {
      permohonan_peminjaman: permohonanPeminjaman,
      user: userRef,
      aksi: "reject",
      alasan: reason,
      waktu: new Date(),
    };

    await addDoc(collection(db, "log_permohonan_peminjaman"), logPeminjaman);
  } catch (e: any) {
    console.log(e);
  }
};

export const updatePeminjaman = async (
  id: string,
  kegiatan: string,
  jenis_pinjaman: string,
  waktu_pinjam: Date,
  waktu_kembali: Date
) => {
  const permohonan_peminjamanRef = doc(db, "permohonan_peminjaman", id);

  try {
    await updateDoc(permohonan_peminjamanRef, {
      kegiatan,
      jenis_pinjaman,
      waktu_pinjam,
      waktu_kembali,
      modified_at: serverTimestamp(),
    });
  } catch (e: any) {
    console.log(e);
  }
};

type IEditPeminjaman = {
  kegiatan: string;
  jenis_pinjaman: string;
  waktu_pinjam: Date;
  waktu_kembali: Date;
  file?: string;
  paraf_KBAK: boolean;
  paraf_MK: boolean;
  paraf_SM: boolean;
  rejected: boolean;
  rejected_reason: string;
  modified_at: Date;
};

export const editPeminjaman = async (
  type: "update" | "revision",
  id: string,
  kegiatan: string,
  jenis_pinjaman: string,
  waktu_pinjam: Date,
  waktu_kembali: Date,
  file?: string
) => {
  try {
    const userRef = doc(db, "users", auth.currentUser!.uid);
    const permohonan_peminjamanRef = doc(db, "permohonan_peminjaman", id);

    let updatedData: IEditPeminjaman = {
      kegiatan,
      jenis_pinjaman,
      waktu_pinjam,
      waktu_kembali,
      modified_at: new Date(),
      paraf_KBAK: false,
      paraf_MK: false,
      paraf_SM: false,
      rejected: false,
      rejected_reason: "",
    };

    // If file is not null, delete the old file from storage
    if (file) {
      const permohonanPeminjamanSnap = await getDoc(permohonan_peminjamanRef);
      const permohonanPeminjaman = permohonanPeminjamanSnap.data();
      const oldFile = permohonanPeminjaman!.file;

      if (oldFile) {
        const storageRef = ref(storage, oldFile);
        await deleteObject(storageRef);
      }

      updatedData = {
        ...updatedData,
        file,
      };
    }

    await updateDoc(permohonan_peminjamanRef, updatedData).then(() => {
      const logPeminjaman: ILogPeminjaman = {
        permohonan_peminjaman: permohonan_peminjamanRef,
        user: userRef,
        aksi: type,
        waktu: new Date(),
      };

      addDoc(collection(db, "log_permohonan_peminjaman"), logPeminjaman);
    });
  } catch (e: any) {
    console.log(e);
  }
};

export const deletePeminjaman = async (permohonanPeminjamanId: string) => {
  const permohonanPeminjaman = doc(
    db,
    "permohonan_peminjaman",
    permohonanPeminjamanId
  );

  try {
    // Delete file from storage by url
    const permohonanPeminjamanSnap = await getDoc(permohonanPeminjaman);
    const permohonanPeminjamanData = permohonanPeminjamanSnap.data();
    const fileUrl = permohonanPeminjamanData!.file;
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);

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

    await deleteDoc(permohonanPeminjaman);
    // Delete document from firestore
  } catch (e: any) {
    console.log(e);
  }
};
