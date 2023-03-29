// Next
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";

// Components
import { Irow } from "react-tailwind-table";
import { useEffect, useState } from "react";
import { Irender_row } from "../../../interface/table";
import PageBody from "../../layout/PageBody";
import { Dialog } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";

// Data
import DataTable from "../../table/Table";
import Link from "next/link";
import { ActionModal, DisposisiModal } from "../../modal/Modal";
import {
  DisposisiButton,
  FileButton,
  RejectButton,
  VerifyButton,
} from "../../button/ActionButton";
import { useRouter } from "next/router";
import { Timestamp } from "firebase/firestore";
import { downloadExcel } from "../../../lib/xlsx";
import {
  deleteSurat,
  disposisiSurat,
  finalizeSurat,
  ISuratData,
  Role,
} from "../../../firebase/surat";
import Select from "../../forms/Select";
import { useAuth } from "../../../lib/authContext";

const PDFViewer = dynamic(() => import("../../PDFViewer"), {
  ssr: false,
});

// Columns
const columnsData = [
  {
    field: "nomor_surat",
    use: "Nomor Surat",
  },
  {
    field: "tanggal_surat",
    use: "Tanggal Surat",
  },
  {
    field: "perihal",
    use: "Perihal",
  },
  {
    field: "nama_pengirim",
    use: "Nama Pengirim",
  },
  {
    field: "penerima",
    use: "Penerima",
  },
  {
    field: "status",
    use: "Status",
  },
  {
    field: "aksi",
    use: "Aksi",
    use_in_search: false,
  },
];

interface IManajemenSurat {
  data: ISuratData[];
  role: "KBAK" | "MK" | "SM" | "SB" | "SK" | "staf_SM" | "staf_SB" | "staf_SK";
  type?: "data" | "pribadi" | "disposisi" | "tebusan";
}

const RoleUtama = ["KBAK", "MK", "SM", "SB", "SK"];
const RoleStaff = ["staf_SM", "staf_SB", "staf_SK"];

export const ManajemenSurat: NextPage<IManajemenSurat> = (
  props: IManajemenSurat
) => {
  const { user, loading } = useAuth();

  const { data } = props;
  const [viewData, setViewData] = useState<ISuratData[]>([]);
  const [selected, setSelected] = useState<[string, ISuratData | undefined]>([
    "",
    undefined,
  ]);

  console.log(viewData);

  const [penerima, setPenerima] = useState<Role | "">("");

  const router = useRouter();

  // Get Data
  useEffect(() => {
    setViewData(data);
  }, [data]);

  // Change data based on penerima
  useEffect(() => {
    if (penerima === "") {
      setViewData(data);
    } else {
      setViewData(data.filter((item) => item.penerima === penerima));
    }
  }, [data, penerima]);

  // Handler
  const handleDelete = async () => {
    await deleteSurat(selected[1]!).then(() => {
      setViewData([]);
      setSelected(["", undefined]);
      toast.success("Delete success", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    });
  };

  const handleApprove = async (catatan: string) => {
    await finalizeSurat(selected[1]!, user!, props.role, true, catatan).then(
      () => {
        setViewData([]);
        setSelected(["", undefined]);
        toast.success("Approve berhasil", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    );
  };

  const handleReject = async (catatan: string) => {
    await finalizeSurat(selected[1]!, user!, props.role, false, catatan).then(
      () => {
        setViewData([]);
        setSelected(["", undefined]);
        toast.success("Reject berhasil");
      }
    );
  };

  const handleDisposisi = async (catatan: string, tujuan?: Role[]) => {
    if (tujuan) {
      await disposisiSurat(selected[1]!, user!, props.role, catatan, tujuan);
    } else {
      await disposisiSurat(selected[1]!, user!, props.role, catatan);
    }

      // set the selected data.paraf.role.status to true
      setViewData((prev) => {
        return prev.map((item) => {
          if (item.id === selected[1]?.id) {
            item.paraf[props.role]!.status = true;
          }
          return item;
        });
      });

    setSelected(["", undefined]);
    toast.success("Disposisi berhasil");
  };

  const handleExport = () => {
    const exportedData = viewData.map((item: ISuratData) => {
      const tgl_surat = item.tanggal_surat as string;
      const createdAt = item.created_at as Timestamp;
      return {
        created_at: createdAt.toDate().toLocaleString("id-ID"),
        nomor_surat: item.nomor_surat,
        tanggal_surat: tgl_surat.split("-").reverse().join("/"),
        perihal: item.perihal,
        penerima: item.penerima,
        nama_pengirim: item.nama_pengirim,
        fakultas_pengirim: item.fakultas_pengirim,
        prodi_pengirim: item.prodi_pengirim,
        ormawa_pengirim: item.ormawa_pengirim,
        kontak_pengirim: item.kontak_pengirim,
        status: item.status,
        file: item.file,
      };
    });
    downloadExcel(
      exportedData,
      new Date().toLocaleString("id-ID") + "_surat.xlsx"
    );
  };

  // TODO
  // Table
  const rowcheck: Irender_row = (row, column, display_value) => {
    if (column.field === "nomor_surat") {
      return (
        <div className="flex items-center gap-2">
          <Link href={`/surat/detail/${row.id}`}>
            <p className="font-semibold hover:underline">{display_value}</p>
          </Link>
        </div>
      );
    }

    if (column.field === "tanggal_surat") {
      return <p>{display_value.split("-").reverse().join("/")}</p>;
    }

    if (column.field === "aksi") {
      return (
        <div className="flex items-center gap-1">
          {/* File Button */}
          <FileButton row={row} setSelected={setSelected} />

          {props.role === "KBAK" && (
            <>
              {/* Delete Button */}
              {/* <DeleteButton row={row} setSelected={setSelected} /> */}
            </>
          )}

          {/* Verify Button */}
          {props.type === "disposisi" && row.paraf[props.role].status === false && (
            <>
              {/* Verify Button */}
              {/* If role is in RoleUtama, show Disposisi Button, else show Approve Button */}
              {RoleUtama.includes(props.role) ? (
                <DisposisiButton row={row} setSelected={setSelected} />
              ) : (
                <VerifyButton row={row} setSelected={setSelected} />
              )}
              {/* Reject Button */}
              <RejectButton row={row} setSelected={setSelected} />
            </>
          )}
        </div>
      );
    }

    return display_value;
  };

  // TODO
  // Toaster trigger when route.query.success is filled
  let show = 0;
  useEffect(() => {
    if (router.query.success && show < 1) {
      toast.success(router.query.success, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      show++;
    }
  }, [router.query.success, show]);

  return (
    <>
      <PageBody>
        {/* Select Penerima */}
        {props.type === "data" && (
          <div className="absolute top-3 left-52 scale-90">
            <Select
              id={"penerima"}
              onChange={(e) => setPenerima(e.target.value as Role | "")}
            >
              <option value="">Penerima</option>
              <option value="KBAK">Kepala BAK</option>
              <option value="MK">Manager Kemahasiswaan</option>
              <option value="SM">Supervisor Minarpresma</option>
              <option value="SB">Supervisor Bikalima</option>
              <option value="SK">Supervisor Kesmala</option>
            </Select>
          </div>
        )}
        {/* End of Select Penerima */}

        <DataTable
          // per_page={3}
          row_render={rowcheck}
          columns={columnsData}
          rows={viewData}
          export={props.type !== "disposisi"}
          handleExport={handleExport}
        />
      </PageBody>

      <Dialog
        open={Boolean(selected[0])}
        handler={() => setSelected(["", undefined])}
        className="overflow-auto min-w-min w-auto"
      >
        {selected[0] === "file" && (
          <div className="h-[36rem]">
            <PDFViewer file={selected[1]?.file!} />
          </div>
        )}

        {selected[0] === "delete" && (
          <div className="w-96 flex flex-col gap-4 justify-center items-center text-center px-5 py-10">
            <Image
              src={"/assets/delete-document.png"}
              width={512}
              height={512}
              alt={"Document"}
              className="w-24 h-24"
            />
            <h2 className="text-xl font-semibold text-gray-800">
              Apakah anda yakin untuk menolak surat ini?
            </h2>
            <p className="text-gray-800">{selected[1]?.nomor_surat}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setSelected(["", undefined])}
                className="border border-gray-400 px-8 py-1 rounded-md text-gray-800 focus:outline-none hover:bg-gray-50 shadow-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="border border-red-400 px-8 py-1 rounded-md text-white focus:outline-none bg-red-600 hover:bg-red-700 shadow-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {selected[0] === "approve" && (
          <>
            <ActionModal
              cancelHandler={setSelected}
              mainHandler={handleApprove}
              description={"Apakah anda yakin untuk menyetujui surat ini?"}
              name={selected[1]?.nomor_surat!}
              type={"approve"}
            />
          </>
        )}

        {selected[0] === "disposisi" && (
          <>
            <DisposisiModal
              cancelHandler={setSelected}
              mainHandler={handleDisposisi}
              description={"Apakah anda yakin untuk mendisposisi surat ini?"}
              name={selected[1]!.nomor_surat}
              // select={props.role === "MK"}
              select={props.role === "MK"}
            />
          </>
        )}

        {selected[0] === "reject" && (
          <>
            <ActionModal
              cancelHandler={setSelected}
              mainHandler={handleReject}
              description={"Apakah anda yakin untuk menolak surat ini?"}
              name={selected[1]?.nomor_surat!}
              type={"reject"}
            />
          </>
        )}
      </Dialog>

      <ToastContainer />
    </>
  );
};
