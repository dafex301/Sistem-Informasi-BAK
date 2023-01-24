export interface userAccount {
  id: string;
  email: string;
  name: string;
  identifier: string;
  role: "admin" | "UKM" | "TBAK" | "KBAK" | "MK" | "SM";
  created_at: Date;
  modified_at: Date;
}
