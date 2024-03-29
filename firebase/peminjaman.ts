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
  Query,
} from "firebase/firestore";

import { getStorage, ref, deleteObject } from "firebase/storage";

const storage = getStorage();

export interface IPeminjaman {
  jenis_pinjaman: string;
  kegiatan: string;
  waktu_pinjam: Date;
  waktu_kembali: Date;
  penanggungJawab: string;
  kontakPJ: string;
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

// TODO: REWORKING
interface IPeminjamanNew {
  jenis_pinjaman: string;
  kegiatan: string;
  pemohon: string;
  waktu_pinjam: Date;
  waktu_kembali: Date;
  penanggungJawab: string;
  kontakPJ: string;
  file?: string;
  paraf: {
    KBAK: {
      status: boolean;
      waktu: Date;
      nama: string;
      catatan: string;
    };
    MK: {
      status: boolean;
      waktu: Date;
      nama: string;
      catatan: string;
    };
    SM: {
      status: boolean;
      waktu: Date;
      nama: string;
      catatan: string;
    };
  };
  rejected: {
    status: boolean;
    waktu: Date;
    catatan: string;
    role: string;
    nama: string;
  };
  status: string;
  logs: ILogPeminjamanNew[];
  created_at: Timestamp | Date;
  modified_at: Timestamp | Date;
}

interface ILogPeminjamanNew {
  nama: string;
  waktu: Date;
  aksi: string;
  role: string;
  catatan: string;
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
  role?: "admin" | "KBAK" | "MK" | "SM" | "ORMAWA"
) => {
  const userRef = doc(db, "users", auth.currentUser!.uid);

  let q: Query<DocumentData> | undefined,
    q2: Query<DocumentData> | undefined,
    q3: Query<DocumentData> | undefined;

  if (role === "KBAK") {
    q = query(
      collection(db, "permohonan_peminjaman"),
      orderBy("modified_at", "desc"),
      where("paraf_KBAK", "==", false),
      where("paraf_MK", "==", false),
      where("paraf_SM", "==", false),
      where("rejected", "==", false)
    );
    q2 = query(
      collection(db, "permohonan_peminjaman"),
      orderBy("modified_at", "desc"),
      where("paraf_KBAK", "==", true)
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
    q2 = query(
      collection(db, "permohonan_peminjaman"),
      orderBy("modified_at", "desc"),
      where("paraf_KBAK", "==", true),
      where("paraf_MK", "==", true)
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
    q2 = query(
      collection(db, "permohonan_peminjaman"),
      orderBy("modified_at", "desc"),
      where("paraf_KBAK", "==", true),
      where("paraf_MK", "==", true),
      where("paraf_SM", "==", true)
    );
  } else if (role === "ORMAWA") {
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

  if (role === "KBAK" || role === "SM" || role === "MK") {
    const querySnapshot2 = await getDocs(q2!);
    querySnapshot2.forEach((doc) => {
      peminjaman.push({
        id: doc.id,
        peminjaman: doc.data(),
      });
    });

    if (role === "KBAK") {
      q3 = query(
        collection(db, "permohonan_peminjaman"),
        where("rejected", "==", true),
        orderBy("modified_at", "desc")
      );
    } else if (role === "MK") {
      q3 = query(
        collection(db, "permohonan_peminjaman"),
        where("rejected", "==", true),
        where("rejected_by", "==", "MK"),
        orderBy("modified_at", "desc")
      );
    } else if (role === "SM") {
      q3 = query(
        collection(db, "permohonan_peminjaman"),
        where("rejected", "==", true),
        where("rejected_by", "==", "SM"),
        orderBy("modified_at", "desc")
      );
    }

    const querySnapshot3 = await getDocs(q3!);
    querySnapshot3.forEach((doc) => {
      peminjaman.push({
        id: doc.id,
        peminjaman: doc.data(),
      });
    });
  }

  // Foreach peminjaman, get pemohon data from user
  // Edit peminjaman.pemohon to pemohon data

  await Promise.all(
    peminjaman.map(async (p: IPeminjamanData) => {
      // delete peminjaman where rejected is true and modified_at is more than 1 week
      try {
        if (p.peminjaman.rejected) {
          const modified_at = p.peminjaman.modified_at.toDate();
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - modified_at.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays > 3) {
            if (p.peminjaman.file) {
              try {
                const storageRef = ref(storage, p.peminjaman.file);
                await deleteObject(storageRef);
              } catch (e) {
                // console.log(e);
              }
            }

            const peminjamanRef = doc(db, "permohonan_peminjaman", p.id);
            await deleteDoc(peminjamanRef);

            const logRef = doc(db, "log_peminjaman", p.id);
            await deleteDoc(logRef);
            peminjaman.splice(peminjaman.indexOf(p), 1);
          }
        }
      } catch (e) {
        console.log(e);
      }

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
      console.log(log);
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
    const permohonanPeminjamanSnap = await getDoc(permohonanPeminjaman);
    const permohonanPeminjamanData = permohonanPeminjamanSnap.data();

    if (permohonanPeminjamanData![`paraf_${role}`] === false) {
      await setDoc(
        permohonanPeminjaman,
        { [`paraf_${role}`]: true, modified_at: new Date() },
        { merge: true }
      );

      const logPeminjaman: ILogPeminjaman = {
        permohonan_peminjaman: permohonanPeminjaman,
        user: userRef,
        aksi: "approve",
        waktu: new Date(),
      };

      await addDoc(collection(db, "log_permohonan_peminjaman"), logPeminjaman);
    }
  } catch (e: any) {
    console.log(e);
  }
};

export const rejectPeminjaman = async (
  id: string,
  reason: string,
  role: string
) => {
  const userRef = doc(db, "users", auth.currentUser!.uid);

  const permohonanPeminjaman = doc(db, "permohonan_peminjaman", id);

  try {
    // check if reject is already true
    const permohonanPeminjamanSnap = await getDoc(permohonanPeminjaman);
    const permohonanPeminjamanData = permohonanPeminjamanSnap.data();
    if (permohonanPeminjamanData!.rejected === false) {
      await setDoc(
        permohonanPeminjaman,
        {
          paraf_KBAK: false,
          paraf_MK: false,
          paraf_SM: false,

          rejected: true,
          rejected_reason: reason,
          rejected_by: role,

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
    }
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
  penanggungJawab: string;
  kontakPJ: string;
  file?: string;
  paraf_KBAK: boolean;
  paraf_MK: boolean;
  paraf_SM: boolean;
  rejected: boolean;
  rejected_reason: string;
  rejected_by?: string;
  modified_at: Date;
};

export const editPeminjaman = async (
  type: "update" | "revision",
  id: string,
  kegiatan: string,
  jenis_pinjaman: string,
  waktu_pinjam: Date,
  waktu_kembali: Date,
  penanggungJawab: string,
  kontakPJ: string,
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
      penanggungJawab,
      kontakPJ,
      modified_at: new Date(),
      paraf_KBAK: false,
      paraf_MK: false,
      paraf_SM: false,
      rejected: false,
      rejected_by: "",
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
