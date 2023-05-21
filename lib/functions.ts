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
    default:
      return role;
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

export const dateLocaleFormat = (date: string) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const getMonthName = (month: string) => {
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return monthNames[parseInt(month) - 1];
};

export const formatTime = (time: string) => {
  const timeComponents = time.split(".");
  return `${timeComponents[0]}:${timeComponents[1]}:${timeComponents[2]}`;
};

export const formatDateTime = (date: string) => {
  const dateObj = new Date(date);
  return `${dateObj.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })} ${formatTime(dateObj.toLocaleTimeString("id-ID"))}`;
};
