import { Download } from "lucide-react";

type PdfViewerProps = {
  url: string;
  downloadLabel?: string;
};

export default function PdfViewer({ url, downloadLabel = "Open / Download PDF" }: PdfViewerProps) {
  return (
    <div>
      <object
        data={url}
        type="application/pdf"
        className="w-full"
        style={{ height: "800px" }}
      />
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
