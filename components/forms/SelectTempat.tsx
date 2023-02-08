import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getTempat } from "../../firebase/tempat";
import Select, { SelectProps } from "./Select";

export default function SelectTempat(props: SelectProps) {
  const [tempat, setTempat] = useState<DocumentData[]>([]);

  useEffect(() => {
    if (tempat.length === 0) {
      (async () => {
        setTempat(await getTempat());
      })();
    }
  });

  return (
    <>
      <Select
        value={props.value}
        onChange={props.onChange}
        error={props.error}
        label="Jenis Pinjaman"
        id="jenis-pinjaman"
        style={props.style}
      >
        <option value="" disabled>
          Pilih Jenis Pinjaman
        </option>
        {tempat.map((tempat) => (
          <option key={tempat.id} value={tempat.nama_tempat}>
            {tempat.nama_tempat}
          </option>
        ))}
      </Select>
    </>
  );
}
