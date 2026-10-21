type PdfEmbedProps = {
  title?: string;
  file?: { asset?: { url?: string } };
  height?: number;
};

export function PdfEmbed({ title, file, height = 800 }: PdfEmbedProps) {
  const url = file?.asset?.url;
  if (!url) return null;

  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;

  return (
    <section className="w-full px-4 py-6">
      <div className="mx-auto max-w-5xl">
        {title && (
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">{title}</h2>
        )}
        <iframe
          src={viewerUrl}
          title={title ?? "PDF document"}
          width="100%"
          height={height}
          className="rounded border border-gray-200"
        />
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm text-blue-600 underline"
        >
          Download PDF
        </a>
      </div>
    </section>
  );
}
