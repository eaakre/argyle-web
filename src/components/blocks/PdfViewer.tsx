"use client";

import { useState } from "react";
import { Download, RefreshCw } from "lucide-react";
import { domainUrl } from "@/lib/constants";

type PdfViewerProps = {
  url: string;
  downloadLabel?: string;
};

export default function PdfViewer({ url, downloadLabel = "Open / Download PDF" }: PdfViewerProps) {
  const [key, setKey] = useState(0);

  const absoluteUrl = url.startsWith("/") ? `${domainUrl}${url}` : url;
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=true`;

  return (
    <div>
      <iframe
        key={key}
        src={viewerUrl}
        className="w-full border-0 h-[500px] md:h-[800px]"
        title="PDF Document"
      />
      <div className="mt-3 flex items-center gap-4">
        <button
          onClick={() => setKey((k) => k + 1)}
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
        >
          <RefreshCw size={13} />
          Reload viewer
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 underline"
        >
          <Download size={13} />
          {downloadLabel}
        </a>
      </div>
    </div>
  );
}
