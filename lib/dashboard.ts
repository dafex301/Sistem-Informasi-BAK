import { IPeminjamanData } from "../firebase/peminjaman";

export function peminjamanRecap(data: IPeminjamanData[]) {
  const recap = data.reduce(
    (acc, d) => {
      if (d.peminjaman.rejected === true) {
        acc.ditolak += 1;
      } else if (d.peminjaman.paraf_SM === false) {
        acc.diproses += 1;
      } else if (d.peminjaman.paraf_SM === true) {
        acc.disetujui += 1;
      }
      return acc;
    },
    { diproses: 0, ditolak: 0, disetujui: 0 }
  );
  return recap;
}

export function peminjamanMonthly(data: IPeminjamanData[]) {
  const monthly = data.reduce((acc, d) => {
    const month = d.peminjaman.created_at.toDate().getMonth();
    acc[month] += 1;
    return acc;
  }, new Array(12).fill(0));
  return monthly;
}

export const peminjamanVerify = (
  data: IPeminjamanData[],
  role: "KBAK" | "MK" | "SM"
) => {
  const verify = data.reduce((verif, d) => {
    if (!d.peminjaman.rejected) {
      if (d.peminjaman.paraf_KBAK === false && role === "KBAK") {
        verif += 1;
      } else if (
        d.peminjaman.paraf_KBAK === true &&
        d.peminjaman.paraf_MK === false &&
        role === "MK"
      ) {
        verif += 1;
      } else if (
        d.peminjaman.paraf_KBAK === true &&
        d.peminjaman.paraf_MK === true &&
        d.peminjaman.paraf_SM === false &&
        role === "SM"
      ) {
        verif += 1;
      }
    }
    return verif;
  }, 0);
  return verify;
};

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
