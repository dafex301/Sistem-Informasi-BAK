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
import { IPeminjamanData } from "./peminjaman";

// Compare peminjaman data this month and last month
// Return array of this month data and percentage from last month
export const comparePeminjaman = (data: IPeminjamanData[]) => {
  const thisMonth = new Date().getMonth();
  const thisMonthData = data.filter((item) => {
    return item.peminjaman.created_at.toDate().getMonth() === thisMonth;
  });

  const lastMonthData = data.filter((item) => {
    item.peminjaman.created_at.toDate().getMonth() === thisMonth - 1;
  });

  const thisMonthTotal = thisMonthData.length;
  const lastMonthTotal = lastMonthData.length;

  const percentage =
    lastMonthTotal === 0 ? 0 : (thisMonthTotal / lastMonthTotal - 1) * 100;

  return { total: thisMonthTotal, percentage };
};
