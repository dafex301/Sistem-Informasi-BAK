export interface userAccount {
  email: string;
  name: string;
  no_induk: string;
  role: "Admin" | "Mahasiswa" | "Staff";
  created_at: Date;
  modified_at: Date;
}
