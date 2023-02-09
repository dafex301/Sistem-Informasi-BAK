import "react-tailwind-table/dist/index.css";

import Table from "react-tailwind-table";
import { tableStyling } from "./tableStyling";
import { downloadExcel } from "../../lib/xlsx";

interface ITableProps {
  columns: any;
  rows: any;
  row_render?: any;
  per_page?: number;
  styling?: any;
  export?: boolean;
  handleExport?: () => void;
}

export default function DataTable(props: ITableProps) {
  return (
    <>
      {props.export && (
        <div className="absolute right-0 translate-y-6">
          <button
            onClick={props.handleExport}
            className="bg-green-500 hover:bg-green-700 transition-all text-white flex gap-2 px-3 py-2 rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zM21 9.375A.375.375 0 0020.625 9h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zM10.875 18.75a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5zM3.375 15h7.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375zm0-3.75h7.5a.375.375 0 00.375-.375v-1.5A.375.375 0 0010.875 9h-7.5A.375.375 0 003 9.375v1.5c0 .207.168.375.375.375z"
                clipRule="evenodd"
              />
            </svg>
            Export to Excel
          </button>
        </div>
      )}
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
