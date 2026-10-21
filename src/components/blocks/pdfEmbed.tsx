"use client";

import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("./PdfViewer"), { ssr: false });

type PdfEmbedProps = {
  title?: string;
  file?: { asset?: { url?: string } };
  height?: number;
};

export function PdfEmbed({ title, file }: PdfEmbedProps) {
  const url = file?.asset?.url;
  if (!url) return null;

  const proxyUrl = `/api/pdf?url=${encodeURIComponent(url)}`;

  return (
    <section className="w-full px-4 py-6">
      <div className="mx-auto max-w-5xl">
        {title && (
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">{title}</h2>
        )}
        <PdfViewer url={proxyUrl} />
      </div>
    </section>
  );
}
