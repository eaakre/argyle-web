"use client";

import { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type PdfViewerProps = {
  url: string;
  downloadLabel?: string;
};

export default function PdfViewer({ url, downloadLabel = "Open / Download PDF" }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) setContainerWidth(node.getBoundingClientRect().width);
  }, []);

  return (
    <div>
      <div ref={containerRef} className="w-full">
        <Document
          file={url}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<div className="flex h-48 items-center justify-center text-sm text-gray-500">Loading PDF…</div>}
          error={<div className="flex h-24 items-center justify-center text-sm text-red-500">Failed to load PDF.</div>}
        >
          <Page
            pageNumber={pageNumber}
            width={containerWidth || undefined}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </div>

      {numPages > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-3 py-2">
          <button
            onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
            disabled={pageNumber <= 1}
            className="rounded p-1 disabled:opacity-30 hover:bg-gray-100"
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-gray-600">
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
            disabled={pageNumber >= numPages}
            className="rounded p-1 disabled:opacity-30 hover:bg-gray-100"
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <div className="mt-3">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-600 underline"
        >
          <Download size={13} />
          {downloadLabel}
        </a>
      </div>
    </div>
  );
}
