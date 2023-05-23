import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import { useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc =
  "//cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.worker.js";

interface IPDFViewerProps {
  file: string;
  data: any;
}

export default function PDFViewer(props: IPDFViewerProps) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageChange, setPageChange] = useState<string>("1");

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  const handlePageNumber = (e: any) => {
    let num = parseInt(e.target.value);

    if (e.key === "Enter") {
      if (num > 0 && num <= numPages!) {
        setPageNumber(num);
      }
    }
  };

  const handleNext = () => {
    if (pageNumber < numPages!) {
      setPageNumber(pageNumber + 1);
      setPageChange(String(pageNumber + 1));
    }
  };

  const handlePrev = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
      setPageChange(String(pageNumber - 1));
    }
  };

  const handlePageNav = (e: any) => {
    let num = e.pageNumber;
    setPageNumber(num);
    setPageChange(String(num));
  };

  return (
    <>
      <div className="bg-gray-900 p-2 pt-0 flex">
        <Document
          file={props.file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(err) => console.log(err)}
          onItemClick={handlePageNav}
        >
          <div className=" text-white p-2 z-10 flex justify-between sticky top-0 bg-gray-900">
            <div className="flex gap-3 items-center">
              <button onClick={handlePrev} className="hover:text-gray-300">
                Previous
              </button>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={pageChange}
                  onKeyDown={(e) => handlePageNumber(e)}
                  onChange={(e) => setPageChange(e.target.value)}
                  className="bg-gray-800 text-white w-10 text-center"
                />
                <p>{`of ${numPages}`}</p>
              </div>

              <button className="hover:text-gray-300" onClick={handleNext}>
                Next
              </button>
            </div>
            <div className="flex gap-3 items-center">
              <a
                className="text-white flex items-center gap-1 hover:text-gray-300"
                href={props.file}
                target="_blank"
                download
                rel="noreferrer"
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </div>
          </div>
          <div className="flex">
            <Page className="" pageNumber={pageNumber} />
            <div className="bg-white ml-2 w-64 text-black p-3 flex flex-col gap-4">
              <h1 className="text-lg font-semibold">Catatan Disposisi</h1>
              <p className="text-sm">
                {/* TODO */}
                <span className="font-semibold">KBAK: </span>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Obcaecati consectetur atque voluptates eius dignissimos ratione
                earum iste tempora ab molestiae.
              </p>
              <p className="text-sm">
                <span className="font-semibold">MK: </span>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Obcaecati consectetur atque voluptates eius dignissimos ratione
                earum iste tempora ab molestiae.
              </p>
              <p className="text-sm">
                <span className="font-semibold">SM: </span>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Obcaecati consectetur atque voluptates eius dignissimos ratione
                earum iste tempora ab molestiae.
              </p>
            </div>
          </div>
        </Document>
      </div>
    </>
  );
}
