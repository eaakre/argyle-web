import { Download } from "lucide-react";

type PdfViewerProps = {
  url: string;
  downloadLabel?: string;
};

export default function PdfViewer({ url, downloadLabel = "Open / Download PDF" }: PdfViewerProps) {
  return (
    <div>
      <div className="hidden md:block w-full">
        <object
          data={url}
          type="application/pdf"
          className="w-full"
          style={{ height: "800px" }}
        >
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-600 underline">
            <Download size={13} />
            {downloadLabel}
          </a>
        </object>
      </div>

      <div className="md:hidden">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white"
        >
          <Download size={14} />
          {downloadLabel}
        </a>
      </div>
    </div>
  );
}
