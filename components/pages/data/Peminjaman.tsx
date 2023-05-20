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
import Input from "../../forms/Input";
import { ToastContainer, toast } from "react-toastify";

// Data
import {
  getAllPeminjaman,
  deletePeminjaman,
  IPeminjamanData,
  updatePeminjaman,
  approvePeminjaman,
  rejectPeminjaman,
} from "../../../firebase/peminjaman";
import DataTable from "../../table/Table";
import Link from "next/link";
import { ModalWithImage, ActionModal } from "../../modal/Modal";
import {
  DeleteButton,
  EditButton,
  FileButton,
  RejectButton,
  RevisionButton,
  UpdateButton,
  VerifyButton,
} from "../../button/ActionButton";
import { useRouter } from "next/router";
import SelectTempat from "../../forms/SelectTempat";
import { Timestamp } from "firebase/firestore";
import { downloadExcel } from "../../../lib/xlsx";
import Select from "../../forms/Select";
import { formatDateTime } from "../../../lib/functions";

const PDFViewer = dynamic(() => import("../../PDFViewer"), {
  ssr: false,
});

// Columns
const columnsData = [
  {
    field: "peminjaman.kegiatan",
    use: "Nama Kegiatan",
  },
  {
    // use_in_display: false,
    field: "peminjaman.pemohon.name",
    use: "Pemohon",
  },
  {
    field: "peminjaman.jenis_pinjaman",
    use: "Tempat",
  },
  {
    field: "peminjaman.waktu_pinjam",
    use: "Waktu Mulai",
  },
  {
    field: "peminjaman.waktu_kembali",
    use: "Waktu Selesai",
  },

  {
    field: "peminjaman.status",
    use: "Status",
    // use_in_search:false
  },
  {
    field: "aksi",
    use: "Aksi",
    use_in_search: false,
  },
  // {
  //   field: "actions",
  //   use: "Actions",
  //   // use_in_search:false
  // },
];

const columnsVerify = [
  {
    field: "peminjaman.kegiatan",
    use: "Nama Kegiatan",
  },
  {
    field: "peminjaman.pemohon.name",
    use: "Pemohon",
  },
  {
    field: "peminjaman.jenis_pinjaman",
    use: "Tempat",
  },
  {
    field: "peminjaman.waktu_pinjam",
    use: "Waktu Mulai",
  },
  {
    field: "peminjaman.waktu_kembali",
    use: "Waktu Selesai",
  },
  {
    field: "aksi",
    use: "Aksi",
    use_in_search: false,
  },
];

const columnsPemohon = [
  {
    field: "peminjaman.kegiatan",
    use: "Nama Kegiatan",
  },
  {
    field: "peminjaman.jenis_pinjaman",
    use: "Jenis Pinjaman",
  },
  {
    field: "peminjaman.waktu_pinjam",
    use: "Waktu Mulai",
  },
  {
    field: "peminjaman.waktu_kembali",
    use: "Waktu Selesai",
  },

  {
    field: "peminjaman.status",
    use: "Status",
    // use_in_search:false
  },
  {
    field: "aksi",
    use: "Aksi",
    use_in_search: false,
  },
  // {
  //   field: "actions",
  //   use: "Actions",
  //   // use_in_search:false
  // },
];

interface IManajemenPeminjamanProps {
  role?: "admin" | "KBAK" | "SM" | "MK" | "ORMAWA";
  type?: "verify" | "data";
}

const ManajemenPeminjaman: NextPage<IManajemenPeminjamanProps> = (
  props: IManajemenPeminjamanProps
) => {
  // Data State
  const [data, setData] = useState<IPeminjamanData[]>([]);
  const [viewData, setViewData] = useState<IPeminjamanData[]>([]);
  const [tempat, setTempat] = useState("");
  const [periode, setPeriode] = useState("");

  const [selected, setSelected] = useState<
    [string, Irow | IPeminjamanData | undefined]
  >(["", undefined]);

  // Input State
  const [kegiatan, setKegiatan] = useState("");
  const [errorKegiatan, setErrorKegiatan] = useState("");

  const [jenisPinjaman, setJenisPinjaman] = useState("");
  const [errorJenisPinjaman, setErrorJenisPinjaman] = useState("");

  const [waktuPinjam, setWaktuPinjam] = useState("");
  const [errorWaktuPinjam, setErrorWaktuPinjam] = useState("");

  const [waktuKembali, setWaktuKembali] = useState("");
  const [errorWaktuKembali, setErrorWaktuKembali] = useState("");

  const router = useRouter();

  // Get Data
  useEffect(() => {
    (async () => {
      const data: IPeminjamanData[] = await getAllPeminjaman(props.role);
      if (props.type === "verify") {
        // Sort data by modified_at asc
        data.sort((a, b) => {
          if (
            a.peminjaman.created_at instanceof Timestamp &&
            b.peminjaman.created_at instanceof Timestamp
          ) {
            return a.peminjaman.created_at.toDate() <
              b.peminjaman.created_at.toDate()
              ? -1
              : 1;
          }
          return 0;
        });
      }
      setData(data);
      setViewData(data);
    })();
  }, [props.role, props.type]);

  // Update state value when selected change
  useEffect(() => {
    if (selected[1]) {
      setKegiatan(selected[1].peminjaman.kegiatan);
      setJenisPinjaman(selected[1].peminjaman.jenis_pinjaman);
      setWaktuPinjam(
        selected[1].peminjaman.waktu_pinjam.toDate().toISOString().slice(0, 16)
      );
      setWaktuKembali(
        selected[1].peminjaman.waktu_kembali.toDate().toISOString().slice(0, 16)
      );
    }
  }, [selected]);

  // Update when tempat and periode change
  useEffect(() => {
    let filteredData = data;
    if (tempat !== "") {
      filteredData = filteredData.filter((item) => {
        return item.peminjaman.jenis_pinjaman === tempat;
      });
    }

    if (periode !== "") {
      filteredData = filteredData.filter((item) => {
        return (
          item.peminjaman.waktu_pinjam.toDate().getFullYear().toString() ===
          periode
        );
      });
    }

    setViewData(filteredData);
  }, [data, periode, tempat]);

  // Handler
  const handleDelete = async () => {
    await deletePeminjaman(selected[1]?.id).then(() => {
      setData([]);
      setSelected(["", undefined]);
      toast.success("Delete success");
    });
  };

  const handleUpdate = async () => {
    if (kegiatan === "") {
      setErrorKegiatan("Nama kegiatan tidak boleh kosong");
    } else {
      setErrorKegiatan("");
    }

    if (jenisPinjaman === "") {
      setErrorJenisPinjaman("Jenis pinjaman tidak boleh kosong");
    } else {
      setErrorJenisPinjaman("");
    }

    if (waktuPinjam && waktuKembali) {
      if (waktuPinjam > waktuKembali) {
        setErrorWaktuKembali(
          "Waktu selesai tidak boleh kurang dari waktu pinjam"
        );
        setErrorWaktuKembali(
          "Waktu selesai tidak boleh kurang dari waktu pinjam"
        );
        return;
      } else {
        setErrorWaktuPinjam("");
        setErrorWaktuKembali("");
      }
    } else {
      setErrorWaktuKembali("Waktu selesai tidak boleh kosong");
      setErrorWaktuPinjam("Waktu mulai tidak boleh kosong");
    }

    if (kegiatan && jenisPinjaman && waktuPinjam && waktuKembali) {
      console.log("updating");
      await updatePeminjaman(
        selected[1]?.id,
        kegiatan,
        jenisPinjaman,
        new Date(waktuPinjam),
        new Date(waktuKembali)
      ).then(() => {
        setData([]);
        setSelected(["", undefined]);

        toast.success("Update success");
      });
    }
  };

  const handleApprove = async () => {
    await approvePeminjaman(selected[1]?.id).then(async () => {
      setData(await getAllPeminjaman(props.role));
      setSelected(["", undefined]);
      toast.success("Approve berhasil");
    });
  };

  const handleReject = async (reason: string) => {
    await rejectPeminjaman(selected[1]?.id, reason).then(async () => {
      setData(await getAllPeminjaman(props.role));
      setSelected(["", undefined]);
      toast.success("Reject berhasil");
    });
  };

  const handleExport = () => {
    const exportedData = viewData.map((item: any) => {
      return {
        // Convert created_at date to DD/MM/YYYY hh:mm:ss
        created_at: item.peminjaman.created_at.toDate().toLocaleString("id-ID"),
        kegiatan: item.peminjaman.kegiatan,
        pemohon: item.peminjaman.pemohon?.name,
        jenis_pinjaman: item.peminjaman.jenis_pinjaman,
        waktu_pinjam: item.peminjaman.waktu_pinjam
          .toDate()
          .toLocaleString("id-ID"),
        waktu_kembali: item.peminjaman.waktu_kembali
          .toDate()
          .toLocaleString("id-ID"),
        status: item.peminjaman.status,
        file: item.peminjaman.file,
      };
    });
    downloadExcel(
      exportedData,
      new Date().toLocaleString("id-ID") + "_permohonan_peminjaman.xlsx"
    );
  };

  // Table
  const rowcheck: Irender_row = (row, column, display_value) => {
    if (column.field === "peminjaman.kegiatan") {
      return (
        <div className="flex items-center gap-2">
          <Link href={`/peminjaman/detail/${row.id}`}>
            <p className="font-semibold hover:underline">{display_value}</p>
          </Link>
        </div>
      );
    }

    if (column.field === "peminjaman.waktu_pinjam") {
      return <p>{formatDateTime(display_value.toDate())}</p>;
    }

    if (column.field === "peminjaman.waktu_kembali") {
      return <p>{formatDateTime(display_value.toDate())}</p>;
    }

    if (column.field === "aksi") {
      return (
        <div className="flex items-center gap-1">
          {/* File Button */}
          <FileButton row={row} setSelected={setSelected} />

          {props.role === "admin" && (
            <>
              {/* Edit Button */}
              <EditButton row={row} setSelected={setSelected} />

              {/* Delete Button */}
              <DeleteButton row={row} setSelected={setSelected} />
            </>
          )}

          {/* Update Button when not verified yet */}
          {props.role === "ORMAWA" &&
            row.peminjaman.status === "Diproses KBAK" && (
              <>
                <UpdateButton row={row} />
              </>
            )}

          {/* Revision Button */}
          {props.role === "ORMAWA" && row.peminjaman.status === "Ditolak" && (
            <>
              <RevisionButton row={row} />
            </>
          )}

          {/* Verify Button */}
          {props.type === "verify" && (
            <>
              {/* Verify Button */}
              <VerifyButton row={row} setSelected={setSelected} />

              {/* Reject Button */}
              <RejectButton row={row} setSelected={setSelected} />
            </>
          )}
        </div>
      );
    }

    return display_value;
  };

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
        <div className="absolute top-3 left-52 scale-90">
          <Select
            id="periode"
            onChange={(e) => setPeriode(e.target.value as string)}
          >
            <option value="">Periode</option>
            {/* get year available from viewData */}
            {/* also make sure there is no duplicate */}
            {data
              .map((item) => {
                return item.peminjaman.waktu_pinjam.toDate().getFullYear();
              })
              .filter((item, index, self) => self.indexOf(item) === index)
              .map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
          </Select>
        </div>
        <div className="absolute left-[19.5rem] top-3 scale-90">
          <SelectTempat
            id="select-tempat"
            onChange={(e) => setTempat(e.target.value)}
            error={""}
            hideLabel
            label="Semua Tempat"
          />
        </div>

        <DataTable
          // per_page={3}
          row_render={rowcheck}
          columns={
            props.role === "ORMAWA"
              ? columnsPemohon
              : props.type === "verify"
              ? columnsVerify
              : columnsData
          }
          rows={viewData}
          export={props.type !== "verify"}
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
            <PDFViewer file={selected[1]?.peminjaman.file} />
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
              Apakah anda yakin untuk menghapus Peminjaman Tempat ini?
            </h2>
            <p className="text-gray-800">{selected[1]?.peminjaman.kegiatan}</p>
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

        {selected[0] === "update" && (
          <div className="flex flex-col p-5 h-auto w-[36rem] gap-5">
            <div className="">
              <h2 className="font-semibold text-lg text-gray-900">
                Update Peminjaman Tempat
              </h2>
            </div>
            <form className="flex flex-col gap-4">
              <Input
                label="Nama Kegiatan"
                error={errorKegiatan}
                onChange={(e) => setKegiatan(e.target.value)}
                id={"nama-kegiatan"}
                value={kegiatan}
                style="light"
                required
              />
              <SelectTempat
                label={"Jenis Pinjaman"}
                required
                onChange={(e) => setJenisPinjaman(e.target.value)}
                error={errorJenisPinjaman}
                id={"jenis-pinjaman"}
                style="light"
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Waktu Mulai"
                  type="datetime-local"
                  error={errorWaktuPinjam}
                  onChange={(e) => setWaktuPinjam(e.target.value)}
                  id={"waktu-pinjam"}
                  value={waktuPinjam}
                  style="light"
                  required
                />
                <Input
                  label="Waktu Selesai"
                  type="datetime-local"
                  error={errorWaktuKembali}
                  onChange={(e) => setWaktuKembali(e.target.value)}
                  id={"waktu-kembali"}
                  value={waktuKembali}
                  style="light"
                  required
                />
              </div>
            </form>
            <div className="w-full grid grid-cols-2 gap-3 font-medium">
              <button
                onClick={() => setSelected(["", undefined])}
                className="border border-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                className="bg-gray-900 text-white p-2 rounded-md hover:bg-gray-800"
                onClick={handleUpdate}
              >
                Save
              </button>
            </div>
          </div>
        )}

        {selected[0] === "approve" && (
          <>
            <ModalWithImage
              cancelHandler={setSelected}
              mainHandler={handleApprove}
              description={
                "Apakah anda yakin untuk menyetujui Peminjaman Tempat ini?"
              }
              image={"/assets/document-approve.jpeg"}
              name={selected[1]?.peminjaman.kegiatan}
              color={"green"}
            />
          </>
        )}

        {selected[0] === "reject" && (
          <>
            <ActionModal
              cancelHandler={setSelected}
              mainHandler={handleReject}
              description={
                "Apakah anda yakin untuk menolak Peminjaman Tempat ini?"
              }
              name={selected[1]?.peminjaman.kegiatan}
              type={"reject"}
            />
          </>
        )}
      </Dialog>

      <ToastContainer />
    </>
  );
};

export default ManajemenPeminjaman;
