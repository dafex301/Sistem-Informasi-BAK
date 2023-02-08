// Next
import { Dialog } from "@material-tailwind/react";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { DeleteButton, EditButton } from "../../components/button/ActionButton";
import Input from "../../components/forms/Input";
import PageBody from "../../components/layout/PageBody";
import PageTitle from "../../components/layout/PageTitle";
import { ModalWithImage } from "../../components/modal/Modal";
import DataTable from "../../components/table/Table";
import {
  addTempat,
  deleteTempat,
  getTempat,
  updateTempat,
} from "../../firebase/tempat";
import { Irender_row } from "../../interface/table";

const ManajemenAkun: NextPage = () => {
  const [data, setData] = useState<any[]>([]);

  const [selected, setSelected] = useState<[string, any]>(["", undefined]);
  const [namaTempat, setNamaTempat] = useState<string>("");
  const [errorNamaTempat, setErrorNamaTempat] = useState<string>("");

  const columns = [
    {
      field: "nama_tempat",
      use: "Nama Tempat",
    },
    {
      field: "aksi",
      use: "Aksi",
      // use_in_search:false
    },
  ];

  const rowcheck: Irender_row = (row, column, display_value) => {
    if (column.field === "aksi") {
      return (
        <div className="flex items-center gap-1">
          <EditButton row={row} setSelected={setSelected} />
          <DeleteButton row={row} setSelected={setSelected} />
        </div>
      );
    }
    return display_value;
  };

  const handleCreate = (nama: string) => {
    if (nama === "") {
      setErrorNamaTempat("Nama tempat harus diisi");
    } else {
      setErrorNamaTempat("");
    }

    if (nama) {
      addTempat(nama).then((res) => {
        toast.success("Berhasil menambahkan tempat");
        setSelected(["", undefined]);
        setData([]);
      });
    }
  };

  const handleUpdate = (nama: string) => {
    if (nama === "") {
      setErrorNamaTempat("Nama tempat harus diisi");
    } else {
      setErrorNamaTempat("");
    }

    if (nama) {
      updateTempat(selected[1].id, nama).then((res) => {
        toast.success("Berhasil mengubah tempat");
        setSelected(["", undefined]);
        setData([]);
      });
    }
  };

  const handleDelete = () => {
    deleteTempat(selected[1].id).then((res) => {
      toast.success("Berhasil menghapus tempat");
      setSelected(["", undefined]);
      setData([]);
    });
  };

  // Get Data
  useEffect(() => {
    if (data.length === 0) {
      (async () => {
        setData(await getTempat());
      })();
    }
  });

  // Change state when selected is change
  useEffect(() => {
    if (selected[0] === "create") {
      setNamaTempat("");
    } else if (selected[0] === "update" || selected[0] === "delete") {
      setNamaTempat(selected[1].nama_tempat);
    }
  }, [selected]);

  return (
    <>
      <Head>
        <title>Manajemen Akun</title>
      </Head>
      <PageTitle>Manajemen Tempat</PageTitle>
      <PageBody>
        <div className="absolute right-3">
          <div className="flex justify-end translate-y-6">
            <button
              onClick={() => setSelected(["create", undefined])}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow-md"
            >
              Buat Tempat
            </button>
          </div>
        </div>
        <DataTable columns={columns} rows={data} row_render={rowcheck} />
      </PageBody>
      <Dialog
        open={Boolean(selected[0])}
        handler={() => setSelected(["", undefined])}
        className="overflow-auto min-w-min w-auto"
      >
        {selected[0] === "delete" ? (
          <ModalWithImage
            cancelHandler={setSelected}
            mainHandler={handleDelete}
            mainText={"Hapus"}
            description={
              "Apakah anda yakin untuk menghapus tempat peminjaman ini?"
            }
            image={"/assets/delete-document.png"}
            name={selected[1].nama_tempat}
            color={"red"}
          />
        ) : (
          <div className="flex flex-col p-5 h-auto w-[36rem] gap-5">
            {selected[0] === "create" && (
              <h2 className="font-semibold text-lg text-gray-900">
                Tambah Tempat Peminjaman
              </h2>
            )}

            {selected[0] === "update" && (
              <h2 className="font-semibold text-lg text-gray-900">
                Ubah Tempat Peminjaman
              </h2>
            )}

            <form className="flex flex-col gap-4">
              <Input
                label="Nama Tempat"
                error={errorNamaTempat}
                onChange={(e) => setNamaTempat(e.target.value)}
                id={"nama-tempat"}
                value={namaTempat}
                style="light"
                required
              />
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
                onClick={
                  selected[0] === "create"
                    ? () => {
                        handleCreate(namaTempat);
                      }
                    : () => {
                        handleUpdate(namaTempat);
                      }
                }
              >
                Save
              </button>
            </div>
          </div>
        )}
      </Dialog>

      <ToastContainer />
    </>
  );
};

export default ManajemenAkun;
