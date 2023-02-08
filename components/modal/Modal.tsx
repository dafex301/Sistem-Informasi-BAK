import Image from "next/image";
import { useState } from "react";

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

interface IRejectModalProps {
  cancelHandler: (arg: [string, undefined]) => void;
  mainHandler: (reason: string) => void;
  description: string;
  name: string;
}

export function RejectModal(props: IRejectModalProps) {
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
          src={"/assets/document-reject.jpeg"}
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
            className={"bg-red-900 text-white p-2 rounded-md hover:bg-red-800"}
            onClick={handleReject}
          >
            Reject
          </button>
        </div>
      </div>
    </>
  );
}
