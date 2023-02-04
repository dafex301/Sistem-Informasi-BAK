import React, { useEffect, useState } from "react";

interface DragDropFileProps {
  label: string;
  filetype: Array<string>;
  maxSize?: number;
  uploader?: string;
  name?: string;
  error: string;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setErrorFile: React.Dispatch<React.SetStateAction<string>>;
  oldFileName?: string;
}

// drag drop file component
export default function DragDropFile(props: DragDropFileProps) {
  // drag state
  const [dragActive, setDragActive] = React.useState(false);

  const [fileNameLegacy, setFileNameLegacy] = useState("");
  // ref
  const inputRef = React.useRef(null);

  // handle drag events
  const handleDrag = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      //   props.handleFiles(e.dataTransfer.files[0]);
      //   props.setFile(e.dataTransfer.files[0]);
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e: any) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      //   console.log(e.target.files[0]);
      //   props.setFile(e.target.files[0]);
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = (file: File) => {
    // Check file type
    if (!props.filetype.includes("." + file.name.split(".").pop()!)) {
      setFileNameLegacy("");
      props.setErrorFile(
        `Format file tidak didukung! Format yang didukung: ${props.filetype}`
      );
      return;
    }
    // check file size
    if (props.maxSize && file.size > props.maxSize) {
      setFileNameLegacy("");
      props.setErrorFile(
        `Ukuran file terlalu besar! Maksimal: ${props.maxSize / 1000} KB`
      );
      return;
    }

    props.setErrorFile("");

    setFileNameLegacy(file.name);

    // Update file name with Uploader-DateTime-Name
    const newFileName = `${props.uploader + "_" ?? ""}${new Date().getTime()}${
      props.name ? "_" + props.name : ""
    }.${file.name.split(".").pop()}`;

    // Change file name
    const newFile = new File([file], newFileName, { type: file.type });

    // Set file
    props.setFile(newFile);
  };

  useEffect(() => {
    if (props.file?.name) {
      setFileNameLegacy(props.file.name);
    }
  }, [props.file?.name]);

  return (
    <>
      <label
        className="block tracking-wide text-gray-700 text-sm font-bold"
        htmlFor="input-file-upload"
      >
        {props.label}
      </label>
      <form
        id="form-file-upload"
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center justify-center w-full"
      >
        <input
          ref={inputRef}
          type="file"
          id="input-file-upload"
          multiple={true}
          onChange={handleChange}
          accept={props.filetype.join(",")}
        />
        <label
          htmlFor="input-file-upload"
          className={
            props.error
              ? "flex flex-col items-center justify-center w-full h-64 border-2 border-red-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-200 dark:border-red-600 dark:hover:border-red-500 dark:hover:bg-gray-600"
              : "flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          }
        >
          {fileNameLegacy || props.oldFileName ? (
            <div className="flex flex-col items-center justify-center py-5">
              <div className="flex flex-col items-center justify-center py-5">
                <svg
                  aria-hidden="true"
                  className="w-10 h-10 mb-3 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-gray-900">
                  {fileNameLegacy || props.oldFileName}
                </p>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to change file</span> or
                  drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {props.filetype.map((type) => {
                    return (
                      <span key={type}>
                        {
                          // remove the first part of the string and turn to uppercase
                          type.split(".")[1].toUpperCase()
                        }
                        {props.filetype.indexOf(type) !==
                        props.filetype.length - 1
                          ? ", "
                          : ""}
                      </span>
                    );
                  })}
                </p>
                {props.maxSize && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Max Size: {props.maxSize / 1000} KB
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                aria-hidden="true"
                className="w-10 h-10 mb-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {props.filetype.map((type) => {
                  return (
                    <span key={type}>
                      {
                        // remove the first part of the string and turn to uppercase
                        type.split(".")[1].toUpperCase()
                      }
                      {props.filetype.indexOf(type) !==
                      props.filetype.length - 1
                        ? ", "
                        : ""}
                    </span>
                  );
                })}
              </p>
              {props.maxSize && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Max Size: {props.maxSize / 1000} KB
                </p>
              )}
            </div>
          )}
        </label>
        {dragActive && (
          <div
            id="drag-file-element"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </form>
      {props.error && <p className="text-red-500 text-xs">{props.error}</p>}
    </>
  );
}
