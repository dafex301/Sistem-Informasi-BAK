import "react-tailwind-table/dist/index.css";

import Table from "react-tailwind-table";
import { tableStyling } from "./tableStyling";

interface ITableProps {
  columns: any;
  rows: any;
  row_render?: any;
  per_page?: number;
  styling?: any;
}

export default function DataTable(props: ITableProps) {
  return (
    <>
      <Table
        columns={props.columns}
        rows={props.rows}
        row_render={props.row_render}
        per_page={props.per_page}
        styling={props.styling ?? tableStyling}
      />
    </>
  );
}
