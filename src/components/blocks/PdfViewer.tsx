import { Download } from "lucide-react";
import { domainUrl } from "@/lib/constants";

type PdfViewerProps = {
  url: string;
  downloadLabel?: string;
};

export default function PdfViewer({ url, downloadLabel = "Open / Download PDF" }: PdfViewerProps) {
  const absoluteUrl = url.startsWith("/") ? `${domainUrl}${url}` : url;
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=true`;

  return (
    <div>
      <iframe
        src={viewerUrl}
        className="w-full border-0"
        style={{ height: "800px" }}
        title="PDF Document"
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
