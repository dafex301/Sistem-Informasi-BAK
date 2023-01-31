import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import { useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc =
  "//cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/build/pdf.worker.js";

interface IPDFViewerProps {
  file: string;
}

export default function PDFViewer(props: IPDFViewerProps) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  return (
    <>
      <Document
        file={props.file}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(err) => console.log(err)}
      >
        <Page pageNumber={pageNumber} />
      </Document>
    </>
  );
}
