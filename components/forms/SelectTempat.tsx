import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { getAllTempat } from "../../firebase/tempat";
import Select, { SelectProps } from "./Select";

interface AdvancedSelectProps extends SelectProps {
  hideLabel?: boolean;
}

export default function SelectTempat(props: AdvancedSelectProps) {
  const [tempat, setTempat] = useState<DocumentData[]>([]);

  useEffect(() => {
    if (tempat.length === 0) {
      (async () => {
        setTempat(await getAllTempat());
      })();
    }
  });

  return (
    <>
      <Select
        value={props.value}
        onChange={props.onChange}
        error={props.error}
        label={props.hideLabel ? "" : props.label}
        id={props.id}
        style={props.style}
      >
        <option value="">{props.label}</option>
        {tempat.map((tempat) => (
          <option key={tempat.id} value={tempat.nama_tempat}>
            {tempat.nama_tempat}
          </option>
        ))}
      </Select>
    </>
  );
}
