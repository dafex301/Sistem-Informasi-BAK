export const titleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.replace(word[0], word[0].toUpperCase()))
    .join(" ");
};

export const roleAbbreviation = (role: string) => {
  switch (role) {
    case "KBAK":
      return "Kepala BAK";
    case "MK":
      return "Manager Kemahasiswaan";
    case "SM":
      return "Supervisor Minarpresma";
    case "SK":
      return "Supervisor Kesmala";
    case "SB":
      return "Supervisor Bikalima";
    case "staf_SM":
      return "Staf Supervisor Minarpresma";
    case "staf_SK":
      return "Staf Supervisor Kesmala";
    case "staf_SB":
      return "Staf Supervisor Bikalima";
    case "TBAK":
      return "Tim BAK";
    case "UKM":
      return "Unit Kegiatan Mahasiswa";
    default:
      return "User";
  }
};

export const actionTranslation = (action: string) => {
  switch (action) {
    case "create":
      return "Ditambahkan";
    case "update":
      return "Diubah";
    case "delete":
      return "Dihapus";
    case "reject":
      return "Ditolak";
    case "approve":
      return "Disetujui";
    case "revision":
      return "Direvisi";
  }
};

export const convertLocalTime = (date: string, time?: boolean) => {
  const dateObj = new Date(date);
  if (time) {
    return dateObj.toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
    });
  } else {
    return dateObj.toLocaleDateString("id-ID", {
      timeZone: "Asia/Jakarta",
    });
  }
}
