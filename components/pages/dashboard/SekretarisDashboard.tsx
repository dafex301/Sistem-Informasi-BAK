import Link from "next/link";

export default function SekretarisDashboard(props: any) {
  return (
    <>
      <div className="grid grid-cols-2 justify-items-center gap-6 pt-5">
        <Link href={"/sekretaris/surat/create"}>
          <button className="rounded-lg bg-gray-200 hover:bg-gray-300 m-4 p-4 grid grid-cols-4 items-center">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="col-span-1 p-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
                />
              </svg>
            </div>
            <div className="col-span-3 flex flex-col items-center justify-center gap-1">
              <h1 className="font-semibold">Buat surat baru</h1>
              <p>
                Ini adalah opsi untuk mengirimkan surat baru ke BAK, lanjutkan
                dengan mengisi formulir dan melampirkan surat dalam bentuk pdf
                kurang dari 512kb.
              </p>
            </div>
          </button>
        </Link>

        <Link href="/staff/surat/monitoring">
          <button className="rounded-lg bg-gray-200 hover:bg-gray-300 m-4 p-4 grid grid-cols-4 items-center">
            <div className="grid grid-cols-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="col-span-1 p-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            </div>
            <div className=" col-span-3 flex flex-col items-center justify-center gap-1">
              <h1 className="font-semibold">Monitoring Surat</h1>
              <p>
                Ini adalah opsi untuk memonitor surat yang telah dikirimkan ke
                BAK, seperti sudah diterima oleh siapa dan catatan disposisi
                terkait.
              </p>
            </div>
          </button>
        </Link>
      </div>
    </>
  );
}
