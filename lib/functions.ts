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
