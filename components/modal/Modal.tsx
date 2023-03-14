import Image from "next/image";
import { useState } from "react";
import { Role } from "../../firebase/surat";

interface IModalWithImageProps {
  image: string;
  description: string;
  name: string;
  cancelHandler: (arg: [string, undefined]) => void;
  mainHandler: () => void;
  mainText?: string;
  color?: string;
}

export function ModalWithImage(props: IModalWithImageProps) {
  return (
    <>
      <div className="flex flex-col p-5 h-auto w-96 gap-5 justify-center items-center">
        <Image
          src={props.image}
          width={512}
          height={512}
          alt={"Document"}
          className="w-24 h-24"
        />
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          {props.description}
        </h2>
        <p className="text-gray-900 font-medium">{props.name}</p>
        <div className="w-full grid grid-cols-2 gap-3 font-medium">
          <button
            onClick={() => props.cancelHandler(["", undefined])}
            className="border border-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            className={
              props.color === "green"
                ? "bg-green-700 text-white p-2 rounded-md hover:bg-green-800"
                : props.color === "red"
                ? "bg-red-700 text-white p-2 rounded-md hover:bg-red-800"
                : "bg-gray-900 text-white p-2 rounded-md hover:bg-gray-800"
            }
            onClick={props.mainHandler}
          >
            {props.mainText ?? "Approve"}
          </button>
        </div>
      </div>
    </>
  );
}

interface IModalProps {
  cancelHandler: (arg: [string, undefined]) => void;
  mainHandler: (reason: string) => void;
  description: string;
  name: string;
}

interface IActionModalProps extends IModalProps {
  type: "reject" | "approve";
}

export function ActionModal(props: IActionModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleReject = () => {
    if (reason === "") {
      setError("Alasan wajib diisi!");
      return;
    } else {
      setError("");
    }

    props.mainHandler(reason);
  };

  return (
    <>
      <div className="flex flex-col p-5 h-auto w-96 gap-5 justify-center items-center">
        <Image
          src={
            props.type === "approve"
              ? "/assets/document-approve.jpeg"
              : "/assets/document-reject.jpeg"
          }
          width={512}
          height={512}
          alt={"Document"}
          className="w-24 h-24"
        />
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          {props.description}
        </h2>
        <p className="text-gray-900 font-medium">{props.name}</p>
        <div className="flex flex-col w-full text-gray-900">
          <label htmlFor="reason" className="text-sm text-center ">
            Alasan*
          </label>
          <textarea
            id="reason"
            className={
              error
                ? "border border-red-500 rounded-md p-2 text-sm"
                : "border border-gray-300 rounded-md p-2 text-sm"
            }
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          ></textarea>
          <p className="text-red-500 text-xs">{error}</p>
        </div>
        <div className="w-full grid grid-cols-2 gap-3 font-medium">
          <button
            onClick={() => props.cancelHandler(["", undefined])}
            className="border border-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            className={
              props.type === "approve"
                ? "bg-green-900 text-white p-2 rounded-md hover:bg-green-800"
                : "bg-red-900 text-white p-2 rounded-md hover:bg-red-800"
            }
            onClick={handleReject}
          >
            {props.type === "approve" ? "Setujui" : "Tolak"}
          </button>
        </div>
      </div>
    </>
  );
}

interface IDisposisiModalProps extends IModalProps {
  mainHandler: (reason: string, tujuan?: Role[]) => void;
  select?: boolean;
}

export function DisposisiModal(props: IDisposisiModalProps) {
  const [reason, setReason] = useState("");
  const [tujuan, setTujuan] = useState<Role[]>([]);
  const [error, setError] = useState("");

  const handleDisposisi = () => {
    if (reason === "") {
      setError("Catatan wajib diisi!");
      return;
    } else {
      setError("");
    }

    props.mainHandler(reason, tujuan);
  };

  return (
    <>
      <div className="flex flex-col p-5 h-auto w-96 gap-5 justify-center items-center">
        <Image
          src={"/assets/document-approve.jpeg"}
          width={512}
          height={512}
          alt={"Document"}
          className="w-24 h-24"
        />
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          {props.description}
        </h2>
        <p className="text-gray-900 font-medium">{props.name}</p>
        <div className="flex flex-col w-full text-gray-900">
          <label htmlFor="reason" className="text-sm text-center ">
            Catatan
          </label>
          <textarea
            id="reason"
            className={
              error
                ? "border border-red-500 rounded-md p-2 text-sm"
                : "border border-gray-300 rounded-md p-2 text-sm"
            }
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          ></textarea>

          {props.select && (
            <div className="flex flex-col w-full text-sm mt-4 ">
              <label htmlFor="tujuan" className="text-sm text-center mb-2">
                Tujuan
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="tujuan[]"
                  id="SM"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTujuan([...tujuan, "SM"]);
                    } else {
                      setTujuan(tujuan.filter((t) => t !== "SM"));
                    }
                  }}
                />
                <label htmlFor="SM">Supervisor Minarpresma</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="tujuan[]"
                  id="SB"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTujuan([...tujuan, "SB"]);
                    } else {
                      setTujuan(tujuan.filter((t) => t !== "SB"));
                    }
                  }}
                />
                <label htmlFor="SB">Supervisor Bikalima</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="tujuan[]"
                  id="SK"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTujuan([...tujuan, "SK"]);
                    } else {
                      setTujuan(tujuan.filter((t) => t !== "SK"));
                    }
                  }}
                />
                <label htmlFor="SK">Supervisor Kesmala</label>
              </div>
            </div>
          )}
          <p className="text-red-500 text-xs">{error}</p>
        </div>
        <div className="w-full grid grid-cols-2 gap-3 font-medium">
          <button
            onClick={() => props.cancelHandler(["", undefined])}
            className="border border-gray-300 text-gray-800 p-2 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            className={
              "bg-green-700 text-white p-2 rounded-md hover:bg-green-800"
            }
            onClick={handleDisposisi}
          >
            Disposisi
          </button>
        </div>
      </div>
    </>
  );
}
