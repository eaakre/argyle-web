type PdfEmbedProps = {
  title?: string;
  file?: { asset?: { url?: string } };
  height?: number;
};

export function PdfEmbed({ title, file, height = 800 }: PdfEmbedProps) {
  const url = file?.asset?.url;
  if (!url) return null;

  const proxyUrl = `/api/pdf?url=${encodeURIComponent(url)}`;

  return (
    <section className="w-full px-4 py-6">
      <div className="mx-auto max-w-5xl">
        {title && (
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">{title}</h2>
        )}
        <object
          data={proxyUrl}
          type="application/pdf"
          width="100%"
          height={height}
          className="rounded border border-gray-200"
        >
          <p className="p-4 text-sm text-gray-600">
            Your browser cannot display this PDF inline.{" "}
            <a href={proxyUrl} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">
              Open PDF
            </a>
          </p>
        </object>
        <a
          href={proxyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-sm text-blue-600 underline"
        >
          Open / Download PDF
        </a>
      </div>
    </section>
  );
}
