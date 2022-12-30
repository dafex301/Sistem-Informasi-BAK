import { Icolumn, Irow } from "react-tailwind-table";

export type Irender_row = (
  row: Irow,
  col: Icolumn,
  display_value: any
) => JSX.Element | string;
